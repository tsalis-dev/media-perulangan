import { useEffect, useRef, useState } from 'react';
import { getLabTool, labTools } from './lib/presentation';
import Icon from './Icon';
import Theory from './Theory';
import ManualLab from './ManualLab';
import LoopVisualizer from './LoopVisualizer';
import RangeLab from './RangeLab';
import DebugLab, { newDebugState } from './DebugLab';
import LessonQuiz from './LessonQuiz';
import { newRangeLabState } from './lib/rangeExercise';
import styles from './App.module.css';

export default function App() {
  const [navigation, setNavigation] = useState(() => ({ hash: window.location.hash, tool: getLabTool(window.location.hash) ?? 'manual' }));
  const [manualCount, setManualCount] = useState(0);
  const [forFrame, setForFrame] = useState(0);
  const [whileFrame, setWhileFrame] = useState(0);
  const [rangeLab, setRangeLab] = useState(newRangeLabState);
  const [debugLab, setDebugLab] = useState(newDebugState);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousHash = useRef(navigation.hash);
  const isLab = getLabTool(navigation.hash) !== undefined;
  const activeTool = labTools.find(tool => tool.id === navigation.tool)!;

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash;
      setNavigation(previous => ({ hash, tool: getLabTool(hash) ?? previous.tool }));
    }
    function onFullscreenChange() { setIsFullscreen(Boolean(document.fullscreenElement)); }
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const hasNavigated = previousHash.current !== navigation.hash;
    previousHash.current = navigation.hash;
    document.title = `${isLab ? activeTool.label + ' · Laboratorium' : 'Materi perulangan'} · Loket Loop`;
    const section = !isLab && navigation.hash !== '#materi' ? document.getElementById(navigation.hash.slice(1)) : null;
    if (section) {
      if (hasNavigated) section.focus({ preventScroll: true });
      section.scrollIntoView({ block: 'start' });
    } else {
      if (hasNavigated) headingRef.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    if (isLab) document.getElementById(`tool-${navigation.tool}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [navigation.hash, navigation.tool, isLab, activeTool.label]);

  async function toggleFullscreen() {
    setFullscreenError('');
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFullscreenError('Layar penuh tidak tersedia. Laboratorium tetap bisa digunakan di jendela ini.');
    }
  }

  return <div className={styles.app}>
    <a className={styles.skipLink} href="#isi" onClick={event => {
      event.preventDefault();
      document.getElementById('isi')?.focus();
      document.getElementById('isi')?.scrollIntoView();
    }}>Langsung ke isi</a>
    <header className={styles.header}>
      <a className={styles.brand} href="#materi" aria-label="Loket Loop, materi perulangan">
        <span className={styles.brandMark}><Icon name="ticket" /></span>
        <span>Loket<span className={styles.brandLight}>Loop</span><span className={styles.brandDot}>.</span><small>Python untuk SMA & SMK</small></span>
      </a>
      <nav className={styles.mainNav} aria-label="Halaman utama">
        <a href="#materi" aria-current={!isLab ? 'page' : undefined}>Materi</a>
        <a href={`#lab/${navigation.tool}`} aria-current={isLab ? 'page' : undefined}>Laboratorium</a>
      </nav>
      <button className={styles.fullscreenButton} onClick={toggleFullscreen} disabled={!document.fullscreenEnabled} title={!document.fullscreenEnabled ? 'Browser ini tidak menyediakan layar penuh' : undefined}>
        <Icon name={isFullscreen ? 'shrink' : 'expand'} /><span>{isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}</span>
      </button>
    </header>
    {fullscreenError && <p role="alert" className={styles.error}>{fullscreenError}</p>}
    {isLab && <nav className={styles.toolNav} aria-label="Alat laboratorium">
      {labTools.map(tool => <a id={`tool-${tool.id}`} href={`#lab/${tool.id}`} key={tool.id} aria-current={tool.id === navigation.tool ? 'page' : undefined}>{tool.label}</a>)}
    </nav>}
    <main id="isi" tabIndex={-1} className={isLab ? styles.labStage : styles.readingStage}>
      {!isLab ? <Theory headingRef={headingRef} /> : <>
        {navigation.tool === 'manual' && <ManualLab count={manualCount} onChange={setManualCount} headingRef={headingRef} />}
        {navigation.tool === 'for' && <LoopVisualizer mode="for" frameIndex={forFrame} onFrameChange={setForFrame} headingRef={headingRef} />}
        {navigation.tool === 'while' && <LoopVisualizer mode="while" frameIndex={whileFrame} onFrameChange={setWhileFrame} headingRef={headingRef} />}
        {navigation.tool === 'parameter' && <RangeLab state={rangeLab} onChange={setRangeLab} headingRef={headingRef} />}
        {navigation.tool === 'debug' && <DebugLab state={debugLab} onChange={setDebugLab} headingRef={headingRef} />}
        {navigation.tool === 'kuis' && <LessonQuiz headingRef={headingRef} />}
      </>}
    </main>
    <footer className={styles.footer}>
      <p>{isLab ? 'Prediksi hasilnya. Jalankan percobaan. Jelaskan apa yang terjadi.' : 'Baca konsepnya, lalu buktikan di laboratorium.'}</p>
      <a href={isLab ? '#materi' : '#lab/manual'}>{isLab ? 'Buka materi' : 'Buka laboratorium'}<Icon name="next" /></a>
    </footer>
  </div>;
}
