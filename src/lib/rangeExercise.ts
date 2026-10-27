import { createForTrace } from './loopTrace.ts';

export const challenges = {
  even: { label: 'Angka genap', target: [2, 4, 6, 8, 10] },
  countdown: { label: 'Hitung mundur', target: [5, 4, 3, 2, 1] },
  odd: { label: 'Angka ganjil', target: [1, 3, 5, 7, 9, 11] },
  threes: { label: 'Kelipatan tiga', target: [3, 6, 9, 12, 15, 18] },
  fours: { label: 'Kelipatan empat', target: [4, 8, 12, 16, 20] },
  fives: { label: 'Kelipatan lima', target: [5, 10, 15, 20, 25, 30] },
  tens: { label: 'Kelipatan sepuluh', target: [10, 20, 30, 40, 50] },
  ascending: { label: 'Naik satu per satu', target: [1, 2, 3, 4, 5, 6] },
  zero: { label: 'Mulai dari nol', target: [0, 1, 2, 3, 4, 5] },
  negativeUp: { label: 'Naik di bilangan negatif', target: [-5, -4, -3, -2, -1] },
  crossZero: { label: 'Melintasi nol', target: [-3, -2, -1, 0, 1, 2, 3] },
  evenCross: { label: 'Genap melintasi nol', target: [-6, -4, -2, 0, 2, 4, 6] },
  evenDown: { label: 'Genap menurun', target: [12, 10, 8, 6, 4, 2] },
  oddDown: { label: 'Ganjil menurun', target: [11, 9, 7, 5, 3, 1] },
  threesDown: { label: 'Turun tiga per langkah', target: [18, 15, 12, 9, 6, 3] },
  tensDown: { label: 'Puluhan menuju nol', target: [50, 40, 30, 20, 10, 0] },
  crossDown: { label: 'Turun melewati nol', target: [4, 3, 2, 1, 0, -1, -2] },
  negativeDown: { label: 'Turun di bilangan negatif', target: [-1, -2, -3, -4, -5, -6] },
  offset: { label: 'Lompatan dari dua puluh', target: [20, 23, 26, 29, 32] },
  negativeFours: { label: 'Negatif menuju nol', target: [-20, -16, -12, -8, -4, 0] },
} as const;

export type Challenge = keyof typeof challenges;
export const challengeIds = Object.keys(challenges) as Challenge[];
export type RangeFields = { start: string; stop: string; step: string };
export type RangeResult =
  | { ok: true; output: number[]; solved: boolean; message: string }
  | { ok: false; field: keyof RangeFields | null; message: string };

export function newRangeExercise(): { fields: RangeFields; result: RangeResult | null } {
  return { fields: { start: '1', stop: '6', step: '1' }, result: null };
}

export type RangeLabState = {
  challenge: Challenge;
  remaining: Challenge[];
  exercises: Record<Challenge, ReturnType<typeof newRangeExercise>>;
};

export function newRangeLabState(): RangeLabState {
  const order = [...challengeIds];
  for (let index = order.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [order[index], order[other]] = [order[other], order[index]];
  }
  return {
    challenge: order[0],
    remaining: order.slice(1),
    exercises: Object.fromEntries(challengeIds.map(id => [id, newRangeExercise()])) as RangeLabState['exercises'],
  };
}

export function selectRangeChallenge(state: RangeLabState, challenge: Challenge): RangeLabState {
  return { ...state, challenge, remaining: state.remaining.filter(id => id !== challenge) };
}

export function nextRangeChallenge(state: RangeLabState): RangeLabState {
  if (state.remaining.length > 0) return { ...state, challenge: state.remaining[0], remaining: state.remaining.slice(1) };
  const next = newRangeLabState();
  if (next.challenge === state.challenge) {
    next.remaining.push(next.challenge);
    next.challenge = next.remaining.shift()!;
  }
  return next;
}

export function rangeLiteral(text: string): string {
  const value = Number(text);
  return /^[+-]?\d+$/.test(text.trim()) && Number.isSafeInteger(value) ? String(value) : '…';
}

export function runRangeExercise(challenge: Challenge, fields: RangeFields): RangeResult {
  for (const field of ['start', 'stop', 'step'] as const) {
    const label = field[0].toUpperCase() + field.slice(1);
    if (rangeLiteral(fields[field]) === '…') return { ok: false, field, message: Number.isInteger(Number(fields[field])) && Math.abs(Number(fields[field])) > Number.MAX_SAFE_INTEGER
      ? `Nilai ${label} terlalu besar. Gunakan bilangan yang lebih kecil.`
      : `Isi ${label} dengan bilangan bulat, misalnya 1 atau -1.` };
  }
  const start = Number(fields.start);
  const stop = Number(fields.stop);
  const step = Number(fields.step);
  if (step === 0) return { ok: false, field: 'step', message: 'Step tidak boleh 0. Gunakan bilangan positif atau negatif.' };

  let output: number[];
  try {
    const trace = createForTrace(start, stop, step);
    output = trace[trace.length - 1].output;
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    return { ok: false, field: null, message: error.message };
  }

  const target = challenges[challenge].target;
  const solved = output.length === target.length && target.every((value, index) => output[index] === value);
  let message: string;
  if (solved) message = 'Tepat! Urutan output sudah sesuai target. Batas Stop tetap tidak ikut dicetak.';
  else if (output.length === 0) message = start === stop
    ? 'Tidak ada output: Start sama dengan Stop, sehingga rentangnya kosong.'
    : `Tidak ada output. Step ${step > 0 ? 'positif bergerak naik; Start harus lebih kecil' : 'negatif bergerak turun; Start harus lebih besar'} dari Stop.`;
  else if (start !== target[0]) message = `Awal output belum sesuai. Angka pertama target adalah ${target[0]}; sesuaikan Start terlebih dahulu.`;
  else if (step !== target[1] - target[0]) message = `Start sudah sesuai. Perhatikan selisih antarangka target: ${target[1] - target[0]}. Sesuaikan arah dan besar Step.`;
  else message = `Start dan Step sudah sesuai. Angka terakhir target adalah ${target[target.length - 1]}. Sesuaikan Stop agar angka itu ikut tercetak, tanpa mencetak angka berikutnya. Stop adalah batas eksklusif.`;
  return { ok: true, output, solved, message };
}
