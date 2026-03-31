#!/usr/bin/env python3
"""
NestWise SF Scraper — v2
Scrapes Craigslist + SF property manager sites, scores listings, emails matches.
- Digest: 10am, 2pm, 6pm PT (all matches ≥50)
- Urgent: any match ≥95 emailed immediately
"""

import json
import os
import re
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from bs4 import BeautifulSoup

# ── Config ────────────────────────────────────────────────────────────────────
CRITERIA = {
    "min_rent": 3500,
    "max_rent": 5500,
    "min_beds": 1,
    "neighborhoods": [
        "pacific heights", "pac heights",
        "marina district", "marina",
        "cow hollow",
        "russian hill",
        "nob hill",
        "hayes valley",
        "noe valley",
        "lower haight",
        "inner richmond",
        "dolores heights",
        "fillmore",
    ],
    "pet_friendly":  ["dogs ok", "dog ok", "cats ok", "cat ok", "pets ok", "pet friendly",
                      "dogs allowed", "cats allowed", "pets allowed", "small dogs",
                      "dogs welcome", "cats welcome", "pets welcome", "dog friendly",
                      "cat friendly", "pet friendly", "small pets"],
    "pet_hostile":   ["no pets", "no dogs", "no cats", "no animals", "pets not allowed",
                      "no pets allowed"],
}

EMAIL_FROM = "finnigenhart@gmail.com"
EMAIL_TO   = ["haydenestes5@gmail.com"]
EMAIL_PASS = "gfkizatmzxvmvwbe"
URGENT_THRESHOLD = 95
SEEN_IDS_FILE    = os.path.join(os.path.dirname(__file__), "seen_ids.json")
LISTINGS_JSON    = os.path.join(os.path.dirname(__file__), "..", "public", "listings.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/122.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

TOP_HOODS   = {"pacific heights","pac heights","marina","marina district","cow hollow","russian hill"}
MID_HOODS   = {"nob hill","hayes valley","noe valley","dolores heights","fillmore"}
VALUE_HOODS = {"lower haight","inner richmond"}

# ── Helpers ───────────────────────────────────────────────────────────────────
def detect_neighborhood(text):
    t = text.lower()
    for hood in CRITERIA["neighborhoods"]:
        if hood in t:
            # Return canonical display name
            canon = {
                "pac heights": "Pacific Heights",
                "marina district": "Marina",
            }
            return canon.get(hood, hood.title())
    return None

def in_target(text):
    return detect_neighborhood(text) is not None

def detect_pet(text):
    t = text.lower()
    if any(k in t for k in CRITERIA["pet_hostile"]):  return "no_pets"
    if any(k in t for k in CRITERIA["pet_friendly"]): return "pets_ok"
    return "unknown"

def parse_rent(text):
    m = re.search(r'\$(\d{1,2},?\d{3})', text)
    return int(m.group(1).replace(",", "")) if m else 0

def score_listing(l):
    s, notes = 0, []
    hood = l.get("neighborhood","").lower()

    if any(h in hood for h in TOP_HOODS):   s += 40; notes.append("Top-tier hood")
    elif any(h in hood for h in MID_HOODS): s += 25; notes.append("Mid-tier hood")
    elif any(h in hood for h in VALUE_HOODS):s += 10; notes.append("Value hood")

    rent = l.get("rent", 0)
    if CRITERIA["min_rent"] <= rent <= CRITERIA["max_rent"]:
        s += 20
        if rent <= 4000: s += 10; notes.append("Under $4k")
    elif rent > CRITERIA["max_rent"]: s -= 20

    pet = l.get("pet_policy","unknown")
    if pet == "pets_ok":  s += 20; notes.append("🐾 Pets OK")
    elif pet == "no_pets":s -= 30; notes.append("No pets ✗")

    if l.get("beds", 0) >= 2: s += 10; notes.append("2+ BR")
    elif l.get("beds", 0) == 1: s += 5

    if l.get("parking"):  s += 5; notes.append("Parking")
    if l.get("laundry") == "in-unit": s += 5; notes.append("In-unit laundry")
    if l.get("outdoor"): s += 3; notes.append("Outdoor space")

    # Bonus: listed directly on PM site (not aggregator) = less competition
    if l.get("source") not in ("Craigslist", "Zillow", "Redfin"):
        s += 5; notes.append("PM site exclusive ⚡")

    l["score"] = max(0, min(100, s))
    l["score_notes"] = notes
    return l

def load_seen():
    try:
        with open(SEEN_IDS_FILE) as f:
            return set(json.load(f))
    except Exception:
        return set()

def save_seen(seen):
    # Keep last 500 IDs to avoid unbounded growth
    ids = list(seen)[-500:]
    with open(SEEN_IDS_FILE, "w") as f:
        json.dump(ids, f)

def deduplicate(listings):
    seen, unique = set(), []
    for l in listings:
        key = (l.get("rent"), l.get("beds"), (l.get("neighborhood","")[:20]).lower())
        addr_key = l.get("address","")[:30].lower()
        if key not in seen and addr_key not in seen:
            seen.add(key); seen.add(addr_key)
            unique.append(l)
    return unique

# ── Scrapers ──────────────────────────────────────────────────────────────────
def scrape_craigslist():
    listings = []
    base = "https://sfbay.craigslist.org"
    url  = (f"{base}/search/sfc/apa"
            f"?min_price={CRITERIA['min_rent']}"
            f"&max_price={CRITERIA['max_rent']}"
            f"&min_bedrooms={CRITERIA['min_beds']}"
            f"&availabilityMode=0")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")
        anchors = soup.select('a[href*="/sfc/apa/d/"]')
        for anchor in anchors[:50]:
            try:
                link  = anchor.get("href","")
                title = re.sub(r'\$[\d,]+.*$','', anchor.get_text(strip=True)).strip()
                if not title or not link or not in_target(title): continue

                # Price from sibling
                parent = anchor.find_parent("li") or anchor.find_parent("div")
                price_el = parent.select_one('[class*="price"],.priceinfo') if parent else None
                rent = parse_rent(price_el.get_text() if price_el else "")

                # Detail page for rent + pet policy + first image
                detail_text = title
                img_url = None
                if link:
                    try:
                        dr = requests.get(link, headers=HEADERS, timeout=10)
                        detail_text = dr.text[:5000]
                        if rent == 0: rent = parse_rent(detail_text)
                        # Grab first listing image — only from images.craigslist.org (trusted source)
                        detail_soup = BeautifulSoup(dr.text, "lxml")
                        img_el = detail_soup.select_one("img[src*='images.craigslist.org']")
                        if img_el:
                            candidate = img_el.get("src") or img_el.get("data-src")
                            # Only use if it's a real craigslist image URL
                            if candidate and "images.craigslist.org" in candidate:
                                img_url = candidate
                        time.sleep(0.4)
                    except Exception: pass

                if rent == 0 or not (CRITERIA["min_rent"] <= rent <= CRITERIA["max_rent"]): continue

                beds_m = re.search(r'(\d)\s*[bB][rR]', detail_text)
                beds   = int(beds_m.group(1)) if beds_m else 1

                listings.append({
                    "id": link, "source": "Craigslist",
                    "title": title, "address": title,
                    "neighborhood": detect_neighborhood(title) or "SF",
                    "rent": rent, "beds": beds, "link": link,
                    "img": img_url,
                    "pet_policy": detect_pet(detail_text),
                    "parking":    "parking"  in detail_text.lower(),
                    "laundry":    "in-unit"  if re.search(r"in.unit laundry|w/d in unit", detail_text, re.I) else "shared",
                    "outdoor":    any(k in detail_text.lower() for k in ["deck","patio","yard","balcony","garden"]),
                })
            except Exception: continue
    except Exception as e:
        print(f"[Craigslist] Error: {e}")
    return listings


def scrape_chandler():
    listings = []
    url = "https://chandlerproperties.com/rental-listings/"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "lxml")
        for item in soup.select(".listing-item"):
            text = item.get_text(" ", strip=True)
            rent = parse_rent(text)
            if not (CRITERIA["min_rent"] <= rent <= CRITERIA["max_rent"]): continue

            # Address: look for SF address pattern
            addr_m = re.search(r'(\d+\s+[A-Z][^\d,]+(?:Street|St|Ave|Avenue|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Way|Place|Pl)[^\d]*(?:#[\w]+)?)', text)
            address = addr_m.group(1).strip() if addr_m else text[:60]

            # Prefer "Details" link over "Apply" button
            details_el = item.find("a", string=re.compile("Details", re.I))
            link_el = details_el or item.select_one("a[href]")
            href = link_el["href"] if link_el else ""
            if href.startswith("?"):
                link = "https://chandlerproperties.com/rental-listings/" + href
            elif href.startswith("/"):
                link = "https://chandlerproperties.com" + href
            else:
                link = href or url

            beds_m = re.search(r'(\d+)\s*[Bb]ed', text)
            beds = int(beds_m.group(1)) if beds_m else 1

            listings.append({
                "id": link, "source": "Chandler Properties",
                "title": address, "address": address,
                "neighborhood": detect_neighborhood(text + " pacific heights marina cow hollow") or "SF",
                "rent": rent, "beds": beds, "link": link,
                "pet_policy": detect_pet(text),
                "parking":    "parking"  in text.lower(),
                "laundry":    "in-unit"  if re.search(r"in.unit|w/d", text, re.I) else "shared",
                "outdoor":    any(k in text.lower() for k in ["deck","patio","yard","balcony"]),
            })
    except Exception as e:
        print(f"[Chandler] Error: {e}")
    return listings


def scrape_relisto():
    listings = []
    # Search target zip codes: Pacific Heights, Marina/Cow Hollow, Russian Hill/Nob Hill
    zip_hoods = [("94115", "Pacific Heights"), ("94123", "Marina"), ("94109", "Russian Hill")]
    for zip_code, hood_hint in zip_hoods:
        url = f"https://www.relisto.com/search/?zip_code={zip_code}"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            soup = BeautifulSoup(resp.text, "lxml")
            for card in soup.select(".listing-box")[:20]:
                text = card.get_text(" ", strip=True)
                rent = parse_rent(text)
                if not (CRITERIA["min_rent"] <= rent <= CRITERIA["max_rent"]): continue
                link_el = card.select_one("a[href]") if card.name != "a" else card
                link = card.get("href") or (link_el["href"] if link_el else url)
                if link.startswith("/"): link = "https://www.relisto.com" + link
                # Address: first line before sq ft / beds
                addr_m = re.search(r'(\d+\s+[A-Z][^\d\n]+(?:St|Ave|Blvd|Dr|Rd|Way|Pl|Lane|Ln)\.?)', text)
                address = addr_m.group(1).strip() if addr_m else text[:60]
                beds_m = re.search(r'(\d+)\s*bed', text, re.I)
                beds = int(beds_m.group(1)) if beds_m else 1
                listings.append({
                    "id": link, "source": "ReLISTO",
                    "title": address, "address": address,
                    "neighborhood": detect_neighborhood(text) or hood_hint,
                    "rent": rent, "beds": beds, "link": link,
                    "pet_policy": detect_pet(text),
                    "parking": "parking" in text.lower(),
                    "laundry": "in-unit" if re.search(r"in.unit|w/d", text, re.I) else "shared",
                    "outdoor": any(k in text.lower() for k in ["deck","patio","yard","balcony"]),
                })
        except Exception as e:
            print(f"[ReLISTO {zip_code}] Error: {e}")
    return listings


def scrape_wavro():
    listings = []
    url = "https://www.jwavro.com/rental_list.php?hood=San+Francisco"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "lxml")
        for card in soup.select(".rental-card")[:30]:
            text = card.get_text(" ", strip=True)
            rent_m = re.search(r'\$([\d,]+)/mo', text)
            if not rent_m: continue
            rent = int(rent_m.group(1).replace(",", ""))
            if not (CRITERIA["min_rent"] <= rent <= CRITERIA["max_rent"]): continue
            if not in_target(text): continue
            # No direct links — use search page as link with unique ID from text
            title = text[:80].strip()
            beds_m = re.search(r'(\d+)\s*[Bb][Rr]|Studio', text)
            beds = int(beds_m.group(1)) if beds_m and beds_m.group(1) else (0 if "Studio" in text else 1)
            listing_id = f"wavro-{rent}-{title[:20]}"
            listings.append({
                "id": listing_id, "source": "J. Wavro Associates",
                "title": title, "address": title,
                "neighborhood": detect_neighborhood(text) or "SF",
                "rent": rent, "beds": beds,
                "link": url,
                "pet_policy": detect_pet(text),
                "parking": "parking" in text.lower(),
                "laundry": "in-unit" if re.search(r"in.unit|w/d", text, re.I) else "shared",
                "outdoor": any(k in text.lower() for k in ["deck","patio","yard","balcony"]),
            })
    except Exception as e:
        print(f"[J. Wavro] Error: {e}")
    return listings


def scrape_appfolio(subdomain: str, source_name: str):
    """Generic scraper for AppFolio-based property managers."""
    listings = []
    base_url = f"https://{subdomain}.appfolio.com"
    url = f"{base_url}/listings"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "lxml")
        for card in soup.select(".listing-item, .js-listing-item, [data-url]")[:30]:
            text = card.get_text(" ", strip=True)
            rent = parse_rent(text)
            if not (CRITERIA["min_rent"] <= rent <= CRITERIA["max_rent"]): continue

            # Get detail link
            href = card.get("data-url") or ""
            if not href:
                link_el = card.select_one("a[href]")
                href = link_el["href"] if link_el else ""
            link = (base_url + href) if href.startswith("/") else href
            if not link: link = url

            # Fetch detail page for neighborhood + pet policy
            detail_text = text
            if link and link != url:
                try:
                    dr = requests.get(link, headers=HEADERS, timeout=10)
                    detail_text = dr.text[:4000]
                    time.sleep(0.3)
                except Exception:
                    pass

            if not in_target(detail_text + " " + text):
                continue

            beds_m = re.search(r'(\d+)\s*[Bb][Dd]', text)
            beds = int(beds_m.group(1)) if beds_m else (0 if re.search(r'[Ss]tudio', text) else 1)

            # Address from AppFolio detail page
            addr_m = re.search(r'(\d+\s+[A-Z][^,\n]{3,40}(?:St|Ave|Blvd|Dr|Rd|Way|Ln|Place|Pl)\.?)', detail_text)
            address = addr_m.group(1).strip() if addr_m else text[:60]

            listings.append({
                "id": link, "source": source_name,
                "title": address, "address": address,
                "neighborhood": detect_neighborhood(detail_text + " " + text) or "SF",
                "rent": rent, "beds": beds, "link": link,
                "pet_policy": detect_pet(detail_text + " " + text),
                "parking": "parking" in (detail_text + text).lower(),
                "laundry": "in-unit" if re.search(r"in.unit|w/d", detail_text + text, re.I) else "shared",
                "outdoor": any(k in (detail_text + text).lower() for k in ["deck","patio","yard","balcony"]),
            })
    except Exception as e:
        print(f"[{source_name}] Error: {e}")
    return listings


def scrape_gaetani():
    return scrape_appfolio("gaetanirealestate", "Gaetani Real Estate")


def scrape_wcpm():
    return scrape_appfolio("wcpm", "WCPM")


# ── Email ─────────────────────────────────────────────────────────────────────
def listing_html(l):
    pet_badge = {
        "pets_ok": '<span style="color:#2d7a2d;font-weight:600">🐾 Pets OK</span>',
        "no_pets": '<span style="color:#cc0000;font-weight:600">✗ No pets</span>',
        "unknown": '<span style="color:#999">Pet policy TBD</span>',
    }.get(l.get("pet_policy","unknown"), "")

    tags = []
    if l.get("parking"): tags.append("🅿 Parking")
    if l.get("laundry") == "in-unit": tags.append("🧺 In-unit W/D")
    if l.get("outdoor"): tags.append("🌿 Outdoor space")
    extras = " &nbsp;·&nbsp; ".join(tags)

    score = l.get("score", 0)
    score_color = "#2d7a2d" if score >= 85 else "#8B6914" if score >= 65 else "#666"

    return f"""
<div style="border:1px solid #e0d9ce;border-radius:10px;padding:18px 20px;margin-bottom:14px;background:#fefcf9;font-family:'Georgia',serif">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
    <div>
      <div style="font-size:17px;font-weight:bold;color:#1a1208">{l.get('address','(address unavailable)')}</div>
      <div style="font-size:12px;color:#888;margin-top:2px">{l.get('neighborhood','')} &nbsp;·&nbsp; {l.get('source','')}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:22px;font-weight:bold;color:#8B6914">${l.get('rent',0):,}/mo</div>
      <div style="font-size:11px;font-weight:700;color:{score_color}">{score}/100 match</div>
    </div>
  </div>
  <div style="margin:10px 0 6px;font-size:13px;color:#444">
    {l.get('beds',1)} BR &nbsp;·&nbsp; {pet_badge}
    {(' &nbsp;·&nbsp; ' + extras) if extras else ''}
  </div>
  <div style="font-size:11px;color:#999;margin-bottom:12px">{', '.join(l.get('score_notes',[]))}</div>
  <a href="{l.get('link','#')}" style="display:inline-block;background:#8B6914;color:#fff;padding:9px 20px;border-radius:5px;text-decoration:none;font-size:13px;font-family:sans-serif">View Listing →</a>
</div>"""


def build_email_html(listings, subject_prefix="NestWise Match Update"):
    strong   = [l for l in listings if l["score"] >= 80]
    moderate = [l for l in listings if 50 <= l["score"] < 80]

    html = f"""
<html><body style="font-family:Georgia,serif;max-width:660px;margin:0 auto;padding:24px 20px;color:#1a1208;background:#faf8f5">
<div style="border-bottom:2px solid #8B6914;padding-bottom:12px;margin-bottom:28px">
  <div style="font-size:30px;font-weight:bold;letter-spacing:0.06em;color:#8B6914">NestWise</div>
  <div style="font-size:12px;color:#aaa;margin-top:2px;letter-spacing:0.08em;text-transform:uppercase">San Francisco Rental Intelligence</div>
</div>"""

    if strong:
        html += f'<h2 style="font-size:16px;text-transform:uppercase;letter-spacing:0.06em;color:#1a1208;border-bottom:1px solid #e0d9ce;padding-bottom:8px;margin-bottom:16px">🔥 Strong Matches &nbsp;<span style="color:#8B6914">({len(strong)})</span></h2>'
        for l in strong: html += listing_html(l)

    if moderate:
        html += f'<h2 style="font-size:16px;text-transform:uppercase;letter-spacing:0.06em;color:#1a1208;border-bottom:1px solid #e0d9ce;padding-bottom:8px;margin:28px 0 16px">👀 Worth Watching &nbsp;<span style="color:#8B6914">({len(moderate)})</span></h2>'
        for l in moderate: html += listing_html(l)

    if not strong and not moderate:
        html += '<p style="color:#888;font-style:italic">No new matches found this scan.</p>'

    html += '<p style="font-size:11px;color:#bbb;margin-top:36px;border-top:1px solid #e0d9ce;padding-top:12px">Finn, on behalf of Hayden &nbsp;·&nbsp; NestWise SF &nbsp;·&nbsp; Automated listing scan</p>'
    html += '</body></html>'
    return html


def send_email(listings, subject, urgent=False):
    if not listings:
        return
    html = build_email_html(listings)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = EMAIL_FROM
    msg["To"]      = ", ".join(EMAIL_TO)
    if urgent:
        msg["X-Priority"] = "1"
        msg["X-MSMail-Priority"] = "High"
    msg.attach(MIMEText(html, "html"))
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as s:
        s.login(EMAIL_FROM, EMAIL_PASS)
        s.send_message(msg)
    print(f"Email sent: '{subject}' → {len(listings)} listings")


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    mode = sys.argv[1] if len(sys.argv) > 1 else "digest"
    # mode: "digest" = full 10am/2pm/6pm email | "urgent" = 95+ only, no email if none

    print(f"NestWise scraper starting (mode={mode})...")

    raw = []
    for fn, name in [
        (scrape_craigslist, "Craigslist"),
        (scrape_chandler,   "Chandler"),
        (scrape_relisto,    "ReLISTO"),
        (scrape_wavro,      "J. Wavro"),
        (scrape_gaetani,    "Gaetani"),
        (scrape_wcpm,       "WCPM"),
    ]:
        results = fn()
        raw += results
        print(f"  {name}: {len(results)} listings")

    deduped = deduplicate(raw)
    scored  = sorted([score_listing(l) for l in deduped], key=lambda l: l["score"], reverse=True)
    print(f"  Total: {len(scored)} unique listings scored")

    # Filter out already-seen listings
    seen = load_seen()
    new_listings = [l for l in scored if l["id"] not in seen]
    print(f"  New (not previously alerted): {len(new_listings)}")

    if not new_listings:
        print("No new listings since last scan. Done.")
        import sys; sys.exit(0)

    # Mark all as seen
    seen.update(l["id"] for l in new_listings)
    save_seen(seen)

    # Urgent: 95+ → send immediately regardless of mode
    urgent = [l for l in new_listings if l["score"] >= URGENT_THRESHOLD]
    if urgent:
        count = len(urgent)
        send_email(urgent,
            subject=f"🚨 NestWise URGENT: {count} top match{'es' if count>1 else ''} — apply now",
            urgent=True)

    if mode == "digest":
        matches = [l for l in new_listings if l["score"] >= 50 and l["score"] < URGENT_THRESHOLD]
        if matches:
            strong_count = len([l for l in matches if l["score"] >= 80])
            send_email(matches,
                subject=f"NestWise: {strong_count} strong match{'es' if strong_count!=1 else ''} in SF today")
        else:
            print("No new digest matches above threshold.")

    # Write all scored listings to public/listings.json for the frontend
    import datetime
    output = {
        "updated": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "listings": scored,
    }
    try:
        with open(LISTINGS_JSON, "w") as f:
            json.dump(output, f, indent=2)
        # Git commit and push so Vercel redeploys
        import subprocess
        repo = os.path.join(os.path.dirname(__file__), "..")
        subprocess.run(["git", "-C", repo, "add", "public/listings.json"], check=True)
        subprocess.run(["git", "-C", repo, "commit", "-m",
                        f"Update listings {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC"],
                       check=True)
        subprocess.run(["git", "-C", repo, "push"], check=True)
        print("listings.json committed and pushed.")
    except Exception as e:
        print(f"[listings.json] Error: {e}")

    print("Done.")
