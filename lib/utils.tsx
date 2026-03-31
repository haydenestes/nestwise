export function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export function scoreColor(score: number): string {
  if (score >= 90) return 'score-a';
  if (score >= 75) return 'score-b';
  if (score >= 60) return 'score-c';
  return 'score-d';
}

export function petTag(policy: string): JSX.Element {
  if (policy === 'dogs_ok' || policy === 'pets_ok') {
    return <span className="tag tag-green">🐾 Pets OK</span>;
  }
  if (policy === 'verify') {
    return <span className="tag tag-amber">Verify pets</span>;
  }
  if (policy === 'unknown') {
    return <span className="tag tag-amber">Pet policy TBD</span>;
  }
  return <span className="tag tag-red">No pets</span>;
}
