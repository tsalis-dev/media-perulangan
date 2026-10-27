import type { Dispatch, Ref, SetStateAction } from 'react';
import Icon from './Icon';
import LoopVisualizer from './LoopVisualizer';
import { createWhileTrace } from './lib/loopTrace';
import type { WhileUpdate } from './lib/loopTrace';
import shared from './App.module.css';
import styles from './RangeLab.module.css';

export type DebugState = { proposal: '' | 'increment' | 'decrement'; applied: WhileUpdate; frameIndex: number };
export function newDebugState(): DebugState { return { proposal: '', applied: 'none', frameIndex: 0 }; }

type Props = { state: DebugState; onChange: Dispatch<SetStateAction<DebugState>>; headingRef: Ref<HTMLHeadingElement> };

export default function DebugLab({ state, onChange, headingRef }: Props) {
  return <LoopVisualizer mode="debug" update={state.applied} frameIndex={state.frameIndex} headingRef={headingRef} onFrameChange={frameIndex => onChange(previous => ({ ...previous, frameIndex }))} sourceFooter={
    <form className={styles.repair} onSubmit={event => {
      event.preventDefault();
      const proposal = state.proposal;
      if (!proposal) return;
      onChange(previous => ({ ...previous, applied: proposal, frameIndex: createWhileTrace(proposal).length - 1 }));
    }}>
      <label htmlFor="debug-proposal">Usulan perbaikan di baris 4</label>
      <div className={styles.repairControls}>
        <select id="debug-proposal" value={state.proposal} onChange={event => {
          const proposal = event.target.value;
          if (proposal === '' || proposal === 'increment' || proposal === 'decrement') onChange(previous => ({ ...previous, proposal }));
        }}><option value="">Pilih baris kode</option><option value="increment">nomor += 1</option><option value="decrement">nomor -= 1</option></select>
        <button className={shared.primaryButton} type="submit" disabled={state.proposal === ''}>Uji perbaikan</button>
        <button className={shared.resetButton} type="button" onClick={() => onChange(newDebugState())} disabled={state.applied === 'none' && state.frameIndex === 0 && state.proposal === ''} aria-label="Kembalikan kode tanpa update" title="Kembalikan kode tanpa update"><Icon name="reset" /></button>
      </div>
      <p>{state.proposal && state.proposal !== state.applied ? 'Usulan belum diterapkan. Tekan Uji perbaikan untuk mencobanya.' : 'Baris pilihan ditambahkan di dalam blok while, lalu hasilnya diuji.'}</p>
    </form>
  } />;
}
