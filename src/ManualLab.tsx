import type { Dispatch, Ref, SetStateAction } from 'react';
import Icon from './Icon';
import { formatTicket, MANUAL_LIMIT, printNext } from './lib/presentation';
import shared from './App.module.css';
import trace from './LoopVisualizer.module.css';
import styles from './ManualLab.module.css';

type Props = { count: number; onChange: Dispatch<SetStateAction<number>>; headingRef: Ref<HTMLHeadingElement> };

export default function ManualLab({ count, onChange, headingRef }: Props) {
  return <section className={trace.visualizer} aria-labelledby="slide-title">
    <div className={`${shared.slideHeading} ${trace.heading}`}>
      <div><p className={shared.subject}>Mesin antrean</p><h1 id="slide-title" ref={headingRef} tabIndex={-1}>Coba cetak satu per satu.</h1></div>
      <p>Satu tekanan menghasilkan satu tiket.<br />Bagaimana kalau antreannya 500 orang?</p>
    </div>
    <div className={styles.manualGrid}>
      <div className={styles.machine}>
        <div className={styles.machineTop}><Icon name="ticket" /><span>Loket antrean</span><span>Manual</span></div>
        <div className={styles.counter}>
          <span>Nomor terakhir</span><strong>{count === 0 ? '—' : formatTicket(count)}</strong>
          <span>{count === 0 ? 'Belum ada tiket tercetak' : `${count} klik menghasilkan ${count} tiket`}</span>
        </div>
        <button className={shared.primaryButton} onClick={() => onChange(printNext)} disabled={count >= MANUAL_LIMIT}>
          <Icon name="ticket" />{count >= MANUAL_LIMIT ? 'Lima tiket sudah tercetak' : 'Cetak satu nomor'}
        </button>
        <button className={shared.resetButton} onClick={() => onChange(0)} disabled={count === 0}><Icon name="reset" />Ulangi percobaan</button>
      </div>
      <div className={styles.outputTray}>
        <div className={styles.trayHeading}><h2>Hasil cetakan</h2><span>{count} / {MANUAL_LIMIT} tiket</span></div>
        <div className={styles.ticketTray}>
          {count === 0 ? <div className={styles.empty}><Icon name="ticket" /><p>Tiket pertama menunggu dicetak.</p><span>Tekan Cetak satu nomor untuk memulai.</span></div> : Array.from({ length: count }, (_, index) => <div className={styles.ticket} key={index}>
            <span>Loket Loop</span><small>Nomor antrean</small><strong>{formatTicket(index + 1)}</strong>
            <span className={styles.tear} /><small>Silakan tunggu panggilan</small>
          </div>)}
        </div>
        <p className={styles.outputStatus} role="status" aria-live="polite">{count === MANUAL_LIMIT ? 'Lima tiket selesai. Bagaimana kalau jumlahnya 500?' : count > 0 ? `Tiket ${formatTicket(count)} tercetak. Setiap nomor memerlukan satu klik.` : 'Percobaan ini mencetak paling banyak lima tiket.'}</p>
      </div>
    </div>
    <aside className={shared.discussion}><span>Coba cara lain</span><p>Gunakan <a href="#lab/for">Simulator for</a> untuk mencetak beberapa nomor dengan satu pola perintah.</p></aside>
  </section>;
}
