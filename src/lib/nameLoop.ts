export function nameLoopFrame(mode: 'manual' | 'loop', count: number, step: number) {
  if (!['manual', 'loop'].includes(mode) || ![5, 100].includes(count) || (mode === 'manual' && count !== 5)) throw new RangeError('Pilih contoh lima baris atau loop 5/100 kali.');
  const end = (mode === 'manual' ? count : count * 2) + 1;
  if (!Number.isInteger(step) || step < 0 || step > end) throw new RangeError('Langkah di luar contoh.');
  const done = step === end;
  return {
    end, done,
    printed: mode === 'manual' ? Math.min(step, count) : Math.min(Math.floor(step / 2), count),
    line: step === 0 || done ? null : mode === 'manual' ? step : step % 2 === 1 ? 1 : 2,
    iteration: step === 0 ? null : Math.min(mode === 'manual' ? step : Math.ceil(step / 2), count),
  };
}
