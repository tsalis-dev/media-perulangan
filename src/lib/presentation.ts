export const labTools = [
  { id: 'manual', label: 'Cetak manual' },
  { id: 'for', label: 'Simulator for' },
  { id: 'while', label: 'Simulator while' },
  { id: 'parameter', label: 'Tantangan' },
  { id: 'debug', label: 'Debugging' },
  { id: 'kuis', label: 'Kuis' },
] as const;

export function getLabTool(hash: string) {
  return labTools.find(tool => hash === `#lab/${tool.id}`)?.id;
}

export const MANUAL_LIMIT = 5;
export function printNext(current: number): number { return Math.min(MANUAL_LIMIT, current + 1); }
export function formatTicket(value: number): string { return String(value).padStart(3, '0'); }
