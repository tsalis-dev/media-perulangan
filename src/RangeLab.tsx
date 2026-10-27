import type { Dispatch, Ref, SetStateAction } from 'react';
import Icon from './Icon';
import { challengeIds, challenges, newRangeExercise, nextRangeChallenge, rangeLiteral, runRangeExercise, selectRangeChallenge } from './lib/rangeExercise';
import type { RangeLabState } from './lib/rangeExercise';
import shared from './App.module.css';
import trace from './LoopVisualizer.module.css';
import styles from './RangeLab.module.css';

type Props = { state: RangeLabState; onChange: Dispatch<SetStateAction<RangeLabState>>; headingRef: Ref<HTMLHeadingElement> };

export default function RangeLab({ state, onChange, headingRef }: Props) {
  const { fields, result } = state.exercises[state.challenge];
  const target = challenges[state.challenge].target;
  const roundComplete = state.remaining.length === 0;

  return <section className={trace.visualizer} aria-labelledby="slide-title">
    <div className={`${shared.slideHeading} ${trace.heading}`}>
      <div><p className={shared.subject}>Latihan perulangan</p><h1 id="slide-title" ref={headingRef} tabIndex={-1}>Ubah polanya. Amati hasilnya.</h1></div>
      <p>Prediksi hasilnya,<br />lalu uji pilihan parametermu.</p>
    </div>
    <div className={styles.challengeBar}>
      <div className={styles.challengePicker}>
        <label htmlFor="challenge-choice">Pilih tantangan</label>
        <div className={styles.challengeControls}>
          <select id="challenge-choice" value={state.challenge} aria-describedby="challenge-cycle" onChange={event => {
            const selected = challengeIds.find(id => id === event.target.value);
            if (selected) onChange(previous => selectRangeChallenge(previous, selected));
          }}>{challengeIds.map(id => <option key={id} value={id}>{challenges[id].label}</option>)}</select>
          <button className={trace.finishButton} aria-describedby="challenge-cycle" onClick={() => onChange(nextRangeChallenge)}>
            <Icon name="loop" />{roundComplete ? 'Acak putaran baru' : 'Acak berikutnya'}
          </button>
        </div>
        <p id="challenge-cycle" className={styles.cycleNote}>{roundComplete ? `Semua ${challengeIds.length} dibuka. Putaran baru mengosongkan percobaan.` : `${state.remaining.length} dari ${challengeIds.length} tantangan belum dibuka dalam putaran ini.`}</p>
      </div>
      <div className={styles.target} aria-live="polite" aria-atomic="true"><span>Target output</span><code>{target.join(', ')}</code></div>
    </div>
    <div className={trace.workspace}>
      <div className={trace.source}>
        <div className={trace.panelHeading}><h2>Kode & parameter</h2><span>Ubah, lalu jalankan</span></div>
        <pre className={trace.code} aria-label="Kode percobaan for"><code>
          <span className={trace.codeRow}><span className={trace.lineNumber} aria-hidden="true">1</span><span>for nomor in range({rangeLiteral(fields.start)}, {rangeLiteral(fields.stop)}, {rangeLiteral(fields.step)}):</span></span>
          <span className={trace.codeRow}><span className={trace.lineNumber} aria-hidden="true">2</span><span>{'    print(nomor)'}</span></span>
        </code></pre>
        <form noValidate onSubmit={event => {
          event.preventDefault();
          onChange(previous => ({ ...previous, exercises: { ...previous.exercises, [previous.challenge]: {
            ...previous.exercises[previous.challenge], result: runRangeExercise(previous.challenge, previous.exercises[previous.challenge].fields),
          } } }));
        }}>
          <div className={styles.fields}>{(['start', 'stop', 'step'] as const).map(field => <div key={field}>
            <label htmlFor={`lab-${field}`}>{field[0].toUpperCase() + field.slice(1)}</label>
            <input id={`lab-${field}`} type="number" step="1" value={fields[field]} aria-invalid={result?.ok === false && result.field === field} aria-describedby={result?.ok === false && result.field === field ? 'range-feedback' : undefined} onChange={event => {
              const value = event.target.value;
              onChange(previous => ({ ...previous, exercises: { ...previous.exercises, [previous.challenge]: {
                fields: { ...previous.exercises[previous.challenge].fields, [field]: value }, result: null,
              } } }));
            }} />
          </div>)}</div>
          <div className={`${trace.controls} ${styles.runControls}`}>
            <button className={shared.primaryButton} type="submit"><Icon name="play" />Jalankan percobaan</button>
            <button className={shared.resetButton} type="button" onClick={() => onChange(previous => ({ ...previous, exercises: { ...previous.exercises, [previous.challenge]: newRangeExercise() } }))}><Icon name="reset" />Ulangi tantangan</button>
          </div>
        </form>
      </div>
      <div className={trace.runtime}>
        <div className={trace.panelHeading}><h2>Output percobaan</h2><span>{result?.ok ? `${result.output.length} angka` : 'Belum dijalankan'}</span></div>
        {result?.ok && result.output.length > 0 ? <ol className={`${trace.output} ${styles.labOutput}`} aria-label="Output percobaan" tabIndex={result.output.length > 10 ? 0 : undefined}>
          {result.output.map(value => <li key={value} className={trace.outputTicket}><span>Nomor</span><strong>{value}</strong></li>)}
        </ol> : <div className={styles.empty}><Icon name="ticket" /><p>{result?.ok ? 'Tidak ada angka yang tercetak.' : 'Hasil menunggu prediksimu.'}</p><span>{result?.ok ? 'Periksa batas dan arah Step.' : 'Ubah parameter, lalu jalankan percobaan.'}</span></div>}
        <p className={styles.outputNote}>Stop tidak ikut dicetak. Percobaan dibatasi 50 angka.</p>
      </div>
    </div>
    <div id="range-feedback" className={`${trace.explanation} ${result?.ok && result.solved ? styles.success : ''}`} role={result?.ok === false ? 'alert' : 'status'} aria-atomic="true">
      <span className={trace.phaseLabel}>{result === null ? 'Prediksi' : !result.ok ? 'Periksa input' : result.solved ? 'Tepat' : 'Coba lagi'}</span>
      <p>{result?.message ?? 'Tentukan Start, Stop, dan Step agar output persis seperti target. Kamu bisa memilih tantangan atau mengambil soal acak berikutnya.'}</p>
    </div>
  </section>;
}
