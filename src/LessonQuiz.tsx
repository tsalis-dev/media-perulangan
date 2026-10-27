import type { Ref } from 'react';
import shared from './App.module.css';
import styles from './LessonQuiz.module.css';

const quizUrl = 'https://wayground.com/join?gc=15908803';

export default function LessonQuiz({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  return <section className={styles.quiz} aria-labelledby="slide-title">
    <div className={shared.slideHeading}>
      <div><p className={shared.subject}>Kuis pengetahuan</p><h1 id="slide-title" ref={headingRef} tabIndex={-1}>Kerjakan kuis di Wayground.</h1></div>
      <p>Siapkan perangkat dan koneksi internet.</p>
    </div>
    <div className={styles.joinGrid}>
      <figure className={styles.qrPanel}>
        <img src="/quiz-wayground.png" width="390" height="390" alt="QR untuk bergabung ke kuis Wayground. Tautan tersedia di bagian petunjuk." />
        <figcaption>Pindai QR dengan kamera HP.</figcaption>
      </figure>
      <div className={styles.instructions}>
        <h2>Petunjuk pengerjaan</h2>
        <ol>
          <li>Pindai QR atau tekan <strong>Buka kuis di Wayground</strong>.</li>
          <li>Gunakan nama lengkap dan kelas sebagai nama peserta agar guru dapat mengenali hasilmu.</li>
          <li>Ikuti arahan guru, kerjakan soal secara mandiri, lalu selesaikan kuis di Wayground.</li>
        </ol>
        <a className={shared.primaryButton} href={quizUrl} target="_blank" rel="noopener noreferrer">Buka kuis di Wayground <span className={styles.newTab}></span></a>
        <a className={styles.directLink} href={quizUrl} target="_blank" rel="noopener noreferrer">{quizUrl}</a>
        <p className={styles.joinCode}>Kode bergabung <strong>{new URL(quizUrl).searchParams.get('gc')}</strong></p>
        <p className={styles.resultNote}>Jawaban dan hasil kuis tercatat di Wayground untuk dilihat guru.</p>
      </div>
    </div>
    <p className={styles.sessionNote}>Jika sesi sudah berakhir atau tautan tidak bisa dibuka, minta tautan sesi terbaru kepada guru.</p>
  </section>;
}
