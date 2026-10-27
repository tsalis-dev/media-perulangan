import type { ReactNode, Ref } from 'react';
import Icon from './Icon';
import { createForTrace, createWhileTrace } from './lib/loopTrace';
import type { WhileUpdate } from './lib/loopTrace';
import shared from './App.module.css';
import styles from './LoopVisualizer.module.css';

const forTrace = createForTrace();
const whileTrace = createWhileTrace();
const debugTraces = { none: createWhileTrace('none'), increment: whileTrace, decrement: createWhileTrace('decrement') };

type Props = {
  mode: 'for' | 'while' | 'debug';
  frameIndex: number;
  onFrameChange: (index: number) => void;
  headingRef: Ref<HTMLHeadingElement>;
  update?: WhileUpdate;
  sourceFooter?: ReactNode;
};

export default function LoopVisualizer({ mode, frameIndex, onFrameChange, headingRef, update = 'none', sourceFooter }: Props) {
  const isFor = mode === 'for';
  const isDebug = mode === 'debug';
  const frames = isFor ? forTrace : isDebug ? debugTraces[update] : whileTrace;
  const frame = frames[frameIndex];
  const done = frame.phase === 'done';
  const paused = frame.phase === 'paused';
  const stopped = done || paused;
  const lines = isFor
    ? ['for nomor in range(1, 6, 1):', '    print(nomor)']
    : ['nomor = 1', 'while nomor <= 5:', '    print(nomor)', ...(!isDebug || update !== 'none' ? [`    nomor ${isDebug && update === 'decrement' ? '-=' : '+='} 1`] : [])];

  return <section className={styles.visualizer} aria-labelledby="slide-title">
    <div className={`${shared.slideHeading} ${styles.heading}`}>
      <div><p className={shared.subject}>{isDebug ? 'Temukan & perbaiki bug' : 'Simulator mesin antrean'}</p><h1 id="slide-title" ref={headingRef} tabIndex={-1}>{isDebug ? 'Mengapa nomor 1 terus tercetak?' : isFor ? 'Jalankan perulangan for.' : 'Jalankan perulangan while.'}</h1></div>
      <p>{isDebug ? 'Amati, usulkan perbaikan, lalu uji.' : isFor ? 'Dari range ke variabel, lalu ke output.' : 'Cek kondisi, cetak, ubah nilai, ulangi.'}</p>
    </div>

    <div className={styles.workspace}>
      <div className={styles.source}>
        <div className={styles.panelHeading}><h2>Kode Python</h2><span>{frame.line === null ? 'Belum dijalankan' : `Baris ${frame.line} baru dijalankan`}</span></div>
        <pre className={styles.code} aria-label={`Kode perulangan ${mode}`}><code>{lines.map((line, index) => <span key={line} className={`${styles.codeRow} ${frame.line === index + 1 ? styles.activeRow : ''}`} aria-current={frame.line === index + 1 ? 'step' : undefined}><span className={styles.lineNumber} aria-hidden="true">{index + 1}</span><span>{line}</span></span>)}</code></pre>
        {sourceFooter ?? <><dl className={styles.anatomy}>
          <div><dt>{isFor ? 'Start' : 'Inisialisasi'}</dt><dd><code>{isFor ? '1' : 'nomor = 1'}</code><span>Nilai awal</span></dd></div>
          <div><dt>{isFor ? 'Stop' : 'Kondisi'}</dt><dd><code>{isFor ? '6' : 'nomor <= 5'}</code><span>{isFor ? 'Batas eksklusif' : 'Lanjut jika True'}</span></dd></div>
          <div><dt>{isFor ? 'Step' : 'Update'}</dt><dd><code>{isFor ? '1' : 'nomor += 1'}</code><span>{isFor ? 'Loncatan +1' : 'Naik satu'}</span></dd></div>
        </dl>
        <p className={styles.sourceNote}>{isFor ? <><code>range(1, 6)</code> sama dengan <code>range(1, 6, 1)</code>. Step bawaannya 1.</> : <>Indentasi menandai isi blok <code>while</code>. Update ada di dalam blok.</>}</p></>}
      </div>

      <div className={styles.runtime}>
        <div className={styles.panelHeading}><h2>Yang terjadi di memori</h2><span>{paused ? 'Simulasi dijeda' : done ? 'Selesai' : 'Langkah demi langkah'}</span></div>
        <div className={styles.memory}><code>nomor</code><span aria-hidden="true">=</span><strong>{frame.value ?? '—'}</strong><span>{frame.value === null ? 'Belum terisi' : 'Nilai saat ini'}</span></div>
        {isFor ? <div className={styles.rangeTrack} aria-label="Range berisi 1 sampai 5, batas 6 tidak termasuk">
          {[1, 2, 3, 4, 5].map(value => <span key={value} className={value === frame.value ? styles.currentValue : ''} aria-label={value === frame.value ? `${value}, nilai saat ini` : String(value)}>{value}</span>)}<span className={styles.excludedValue}>6<small>stop</small></span>
        </div> : <div className={styles.condition}><code>{frame.value === null ? 'nomor' : frame.value} &lt;= 5</code><span>{paused ? 'Tetap True' : frame.phase === 'check' ? 'True · masuk blok' : done ? 'False · berhenti' : 'Dicek di baris 2'}</span></div>}
        <div className={styles.outputHeader}><h2>Output program</h2><span>{frame.output.length} nomor tercetak</span></div>
        {frame.output.length === 0 ? <p className={styles.emptyOutput}>Belum ada output. Baris <code>print</code> belum dijalankan.</p> : <ol className={styles.output} aria-label="Nomor yang sudah dicetak">{frame.output.map((value, index) => <li key={index} className={styles.outputTicket}><span>Nomor</span><strong>{value}</strong></li>)}</ol>}
      </div>
    </div>

    <div className={styles.explanation} role="status" aria-live="polite" aria-atomic="true"><span className={styles.phaseLabel}>{frame.phase === 'ready' ? 'Prediksi' : paused ? 'Dijeda' : done ? 'Berhenti' : `Langkah ${frameIndex}`}</span><p>{isDebug && done ? 'Perbaikan berhasil. ' : ''}{frame.message}</p></div>
    <div className={styles.controls}>
      <button className={shared.primaryButton} onClick={() => onFrameChange(Math.min(frameIndex + 1, frames.length - 1))} disabled={stopped}><Icon name="next" />{paused ? 'Simulasi dijeda' : done ? 'Perulangan selesai' : 'Langkah berikutnya'}</button>
      <button className={styles.finishButton} onClick={() => onFrameChange(frames.length - 1)} disabled={stopped}>{isDebug ? 'Lihat hasil uji' : 'Lihat sampai selesai'}</button>
      <button className={shared.resetButton} onClick={() => onFrameChange(0)} disabled={frameIndex === 0}><Icon name="reset" />Ulangi simulasi</button>
    </div>
  </section>;
}
