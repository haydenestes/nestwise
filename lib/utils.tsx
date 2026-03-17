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
  if (policy === 'dogs_ok') {
    return <span className="tag tag-green">🐕 Dogs OK</span>;
  }
  if (policy === 'verify') {
    return <span className="tag tag-amber">Verify pets</span>;
  }
  return <span className="tag tag-red">No pets</span>;
}
