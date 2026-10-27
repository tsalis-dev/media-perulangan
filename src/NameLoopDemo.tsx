import { useEffect, useRef, useState } from 'react';
import { nameLoopFrame } from './lib/nameLoop';
import styles from './NameLoopDemo.module.css';

export default function NameLoopDemo() {
  const [mode, setMode] = useState<'manual' | 'loop'>('manual');
  const [count, setCount] = useState(5);
  const [step, setStep] = useState(0);
  const [still, setStill] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const output = useRef<HTMLOListElement>(null);
  const demo = useRef<HTMLDivElement>(null);
  const motionOff = reduced || still;
  const end = nameLoopFrame(mode, count, 0).end;
  const frame = nameLoopFrame(mode, count, motionOff ? end : step);
  const lines = mode === 'manual' ? Array.from({ length: 5 }, () => 'print("Budi")') : [`for i in range(${count}):`, '    print("Budi")'];

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    function update() { setReduced(preference.matches); }
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (demo.current) observer.observe(demo.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (motionOff || !visible) return;
    const timer = window.setTimeout(() => setStep(frame.done ? 0 : step + 1), frame.done ? 1800 : count === 100 ? 100 : 650);
    return () => window.clearTimeout(timer);
  }, [step, frame.done, motionOff, visible, count]);
  useEffect(() => { if (output.current) output.current.scrollTop = output.current.scrollHeight; }, [frame.printed]);

  function choose(nextMode: 'manual' | 'loop', nextCount: number) {
    setStep(0); setMode(nextMode); setCount(nextCount);
  }
  return <div className={styles.demo} ref={demo} data-still={motionOff}>
    <div className={styles.choices} role="group" aria-label="Pilih contoh cetak nama">
      <button aria-pressed={mode === 'manual'} onClick={() => choose('manual', 5)}>Tanpa perulangan</button>
      <button aria-pressed={mode === 'loop' && count === 5} onClick={() => choose('loop', 5)}>Loop 5 kali</button>
      <button aria-pressed={mode === 'loop' && count === 100} onClick={() => choose('loop', 100)}>Loop 100 kali</button>
    </div>
    <div className={styles.workspace}>
      <div>
        <h4>{lines.length} baris kode</h4>
        <pre className={styles.code}><code>{lines.map((line, index) => <span key={index} className={frame.line === index + 1 ? styles.active : undefined} aria-current={frame.line === index + 1 ? 'step' : undefined}><small aria-hidden="true">{index + 1}</small>{line}</span>)}</code></pre>
        <p>{mode === 'manual' ? 'Setiap baris print dijalankan sekali.' : `Baris print yang sama dijalankan ${count} kali. range(${count}) menyediakan ${count} nilai, dari 0 sampai ${count - 1}.`}</p>
      </div>
      <div className={styles.console}>
        <h4>Output <span>{frame.printed} / {count} baris</span></h4>
        <ol ref={output} tabIndex={0} aria-label="Hasil cetak nama">{Array.from({ length: frame.printed }, (_, index) => <li key={index}><span aria-hidden="true">{index + 1}</span>Budi</li>)}</ol>
        {frame.printed === 0 && <p>Belum ada nama tercetak. Amati baris kode yang disorot.</p>}
      </div>
    </div>
    <label className={styles.motionChoice}><input type="checkbox" checked={motionOff} disabled={reduced} onChange={event => setStill(event.target.checked)} />Tampilkan tanpa gerakan{reduced ? ' (sesuai pengaturan perangkat)' : ''}</label>
    <p className={styles.status} aria-live="off">{frame.done ? `${lines.length} baris kode menghasilkan ${count} baris output.${motionOff ? '' : ' Animasi akan mengulang dari awal.'}` : frame.line === null ? 'Animasi berjalan otomatis. Amati bagaimana nama Budi dicetak.' : mode === 'loop' && frame.line === 1 ? `Putaran ${frame.iteration}: for mengambil nilai berikutnya. Nama belum dicetak pada langkah ini.` : `Baris print dijalankan. Sekarang ada ${frame.printed} nama di output.`}</p>
  </div>;
}
