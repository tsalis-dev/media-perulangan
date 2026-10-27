export type LoopFrame = {
  phase: 'ready' | 'assign' | 'check' | 'print' | 'update' | 'done' | 'paused';
  line: number | null;
  value: number | null;
  output: number[];
  message: string;
};

// shortcut: maksimal 50 iterasi untuk demonstrasi proyektor; naikkan jika latihan memerlukan output lebih panjang.
const MAX_ITERATIONS = 50;

export function createForTrace(start = 1, stop = 6, step = 1): LoopFrame[] {
  if (![start, stop, step].every(Number.isSafeInteger) || step === 0) {
    throw new RangeError('Start, stop, dan step harus bilangan bulat aman; step tidak boleh nol.');
  }

  const frames: LoopFrame[] = [{ phase: 'ready', line: null, value: null, output: [], message: 'Prediksi dulu: nomor berapa saja yang akan dicetak?' }];
  const output: number[] = [];
  let lastValue: number | null = null;

  for (let value = start; step > 0 ? value < stop : value > stop; value += step) {
    if (output.length === MAX_ITERATIONS) throw new RangeError('Demonstrasi dibatasi 50 iterasi.');
    lastValue = value;
    frames.push({ phase: 'assign', line: 1, value, output: [...output], message: `Ambil ${value} dari range, lalu simpan ke variabel nomor.` });
    output.push(value);
    frames.push({ phase: 'print', line: 2, value, output: [...output], message: `print(nomor) mencetak ${value}. Berikutnya, for mengambil nilai selanjutnya.` });
  }

  frames.push({ phase: 'done', line: 1, value: lastValue, output: [...output], message: lastValue === null
    ? 'Rentang kosong. Tidak ada nilai yang diambil dan print tidak dijalankan.'
    : `Range sudah habis. Batas ${stop} tidak ikut dicetak; nomor tetap bernilai ${lastValue}.` });
  return frames;
}

export type WhileUpdate = 'none' | 'increment' | 'decrement';

export function createWhileTrace(update: WhileUpdate = 'increment'): LoopFrame[] {
  if (!['none', 'increment', 'decrement'].includes(update)) throw new RangeError('Pilih perubahan nilai yang tersedia.');
  const frames: LoopFrame[] = [{ phase: 'ready', line: null, value: null, output: [], message: update === 'none'
    ? 'Prediksi dulu: apakah nomor bisa berubah tanpa baris update?'
    : 'Prediksi dulu: apa yang membuat while ini berhenti?' }];
  const output: number[] = [];
  let value = 1;
  frames.push({ phase: 'assign', line: 1, value, output: [], message: 'Inisialisasi: simpan nilai awal 1 ke variabel nomor.' });

  while (value <= 5) {
    // Jeda contoh yang macet agar demonstrasi tidak mengunci browser.
    if (update !== 'increment' && output.length === 3) {
      frames.push({ phase: 'paused', line: 2, value, output: [...output], message: update === 'none'
        ? 'Simulasi dijeda setelah 3 cetakan. Kode aslinya terus berulang karena nomor tetap 1.'
        : `Simulasi dijeda setelah 3 cetakan. nomor turun ke ${value}; ${value} <= 5 tetap True, loop belum berhenti.` });
      return frames;
    }
    frames.push({ phase: 'check', line: 2, value, output: [...output], message: `${value} <= 5 bernilai True. Jalankan isi blok while.` });
    output.push(value);
    frames.push({ phase: 'print', line: 3, value, output: [...output], message: update === 'none'
      ? `Cetak ${value}. Tidak ada update; kembali ke kondisi dengan nomor yang sama.`
      : `Cetak ${value}. Nilai nomor belum berubah; perubahan terjadi di baris berikutnya.` });
    if (update !== 'none') {
      value += update === 'increment' ? 1 : -1;
      frames.push({ phase: 'update', line: 4, value, output: [...output], message: `nomor ${update === 'increment' ? '+=' : '-='} 1 mengubah nilai menjadi ${value}. Kembali periksa kondisi di baris 2.` });
    }
  }

  frames.push({ phase: 'done', line: 2, value, output: [...output], message: '6 <= 5 bernilai False. Blok while dilewati; angka 6 tidak dicetak.' });
  return frames;
}
