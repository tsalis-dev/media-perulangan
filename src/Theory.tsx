import { useRef, useState, type Ref } from 'react';
import Icon from './Icon';
import NameLoopDemo from './NameLoopDemo';
import shared from './App.module.css';
import styles from './Theory.module.css';

const topics = [
  ['konsep', 'Apa itu perulangan?'],
  ['tanpa-loop', 'Contoh tanpa perulangan'],
  ['manfaat', 'Mengapa memakai perulangan?'],
  ['sintaks', 'Membaca sintaks kode'],
  ['kendali', 'Nilai awal, kondisi, update'],
  ['for', 'For dan range'],
  ['while', 'Cara kerja while'],
  ['pilih', 'Memilih jenis loop'],
  ['debug', 'Loop yang tidak berhenti'],
  ['rangkuman', 'Rangkuman & tindak lanjut'],
] as const;

export default function Theory({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  return <>
    <div className={styles.intro}>
      <div>
        <p className={shared.subject}>Materi perulangan Python</p>
        <h1 id="materi" ref={headingRef} tabIndex={-1}>Mengenal perulangan<br />dalam pemrograman.</h1>
        <p>Perulangan adalah cara menjalankan sebuah blok instruksi berulang kali. Mulai dari mencetak nama, lalu pelajari bagaimana komputer mengulangi pekerjaan sesuai aturan yang kita tentukan.</p>
        <a className={shared.primaryButton} href="#materi-konsep">Mulai dari pengertian<Icon name="next" /></a>
        <p className={styles.prerequisite}>Bekal belajar: variabel, <code>print()</code>, dan <code>if-else</code>.</p>
      </div>
      <figure className={styles.ticketFigure}>
        <div className={styles.figureTop}><Icon name="ticket" /><span>Satu pekerjaan yang diulang</span></div>
        <p className={styles.conceptInstruction}>Cetak sebuah nama</p>
        <div className={styles.ticketStrip} aria-label="Nama Budi muncul lima kali">
          {[1, 2, 3, 4, 5].map(number => <div key={number}><span>{number}</span><strong>Budi</strong></div>)}
        </div>
        <figcaption>Pekerjaannya sama: mencetak nama Budi. Lima pengulangan menghasilkan lima baris nama.</figcaption>
      </figure>
    </div>

    <div className={styles.readingLayout}>
      <aside className={styles.contents} data-open={menuOpen} onKeyDown={event => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}>
        <button ref={menuButtonRef} className={styles.contentsToggle} aria-expanded={menuOpen} aria-controls="daftar-materi" onClick={() => setMenuOpen(open => !open)}>
          <span className={styles.menuIcon} aria-hidden="true"><span /><span /><span /></span>
          Daftar materi
          <span className={styles.menuHint}>{menuOpen ? 'Tutup' : `${topics.length} bahasan`}</span>
        </button>
        <div id="daftar-materi" className={styles.contentsBody}>
          <div className={styles.contentsInner}>
            <nav aria-label="Daftar isi materi"><h2>Dalam materi ini</h2>{topics.map(([id, label]) => <a key={id} href={`#materi-${id}`} onClick={() => {
              setMenuOpen(false);
              document.getElementById(`materi-${id}`)?.focus({ preventScroll: true });
            }}>{label}</a>)}</nav>
            <p>Untuk guru dan siswa SMA/SMK. Bagian bacaan dapat dipakai kembali setelah pembelajaran.</p>
          </div>
        </div>
      </aside>
      <article className={styles.article} aria-label="Penjelasan perulangan Python">
        <section aria-labelledby="materi-konsep">
          <h2 id="materi-konsep" tabIndex={-1}>Apa itu perulangan dalam pemrograman?</h2>
          <p><strong>Perulangan atau loop</strong> adalah struktur kontrol yang menjalankan sebuah blok instruksi berulang kali. Pengulangan dapat mengikuti urutan nilai atau berlangsung selama suatu kondisi terpenuhi.</p>
          <p>Satu kali pelaksanaan isi loop disebut <strong>iterasi</strong> atau putaran. Jika instruksi mencetak nama dijalankan lima kali, terjadi lima iterasi dan ada lima baris nama di output.</p>
          <p><code>if</code> memilih apakah sebuah blok dijalankan. Perulangan membuat blok instruksi dijalankan kembali sesuai aturan. Di Python, dua bentuk yang akan kita pelajari adalah <code>for</code> dan <code>while</code>.</p>
          <div className={styles.learningGoal}><h3>Setelah mempelajari materi ini</h3><ul>
            <li>Jelaskan alasan menggunakan perulangan.</li>
            <li>Kenali nilai awal, kondisi, dan perubahan nilai pada contoh pencacah; bedakan penggunaan <code>for</code> dan <code>while</code>.</li>
            <li>Temukan dan perbaiki perulangan yang tidak berhenti.</li>
          </ul></div>
        </section>

        <section aria-labelledby="materi-tanpa-loop">
          <h2 id="materi-tanpa-loop" tabIndex={-1}>Mencetak nama tanpa perulangan</h2>
          <p>Misalnya, kita ingin menampilkan nama <strong>Budi</strong> sebanyak lima kali. Dengan cara biasa, kita menulis perintah yang sama pada lima baris berbeda.</p>
          <pre className={styles.code}><code>{Array.from({ length: 5 }, () => 'print("Budi")').join('\n')}</code></pre>
          <p>Setiap baris mencetak nama satu kali. Kode ini benar dan menghasilkan lima baris output. Namun, untuk seratus cetakan dengan cara yang sama, kita perlu menulis seratus perintah <code>print</code>. Mengganti nama di semua baris juga mudah terlewat.</p>
        </section>

        <section aria-labelledby="materi-manfaat">
          <h2 id="materi-manfaat" tabIndex={-1}>Mengapa memakai perulangan?</h2>
          <p>Dengan perulangan, kita menuliskan pekerjaan sekali di dalam blok, lalu menentukan berapa kali pekerjaan itu diulang. Contoh berikut hanya memiliki <strong>dua baris kode</strong>, tetapi menghasilkan <strong>seratus baris nama</strong>.</p>
          <pre className={styles.code}><code>{'for i in range(100):\n    print("Budi")'}</code></pre>
          <p><code>range(100)</code> menyediakan 100 nilai, dari 0 sampai 99. Untuk setiap nilai, <code>for</code> menjalankan baris <code>print</code> sekali. Nama tetap Budi karena isi <code>print</code> berupa teks yang sama, bukan nilai variabel <code>i</code>.</p>
          <h3>Amati kode dan hasilnya</h3>
          <p>Animasi berjalan otomatis dan terus mengulang. Baris yang disorot menunjukkan instruksi yang sedang dijalankan. Bandingkan Tanpa perulangan dengan Loop 5 kali, lalu pilih Loop 100 kali untuk melihat banyaknya keluaran tanpa menambah baris kode.</p>
          <NameLoopDemo />
          <p>Perulangan mengurangi penulisan kode yang berulang dan memudahkan perubahan. Jumlah pekerjaan yang dijalankan tetap mengikuti jumlah iterasinya: kode yang ringkas tetap harus melakukan 100 cetakan untuk menghasilkan 100 baris.</p>
          <p>Ide yang sama bisa digunakan untuk mencetak nomor antrean 1 sampai 500. Bedanya, nomor yang dicetak berubah pada setiap putaran. Berikutnya, kita akan mempelajari nilai awal, batas, dan perubahan nilainya.</p>
          <a className={styles.labLink} href="#lab/manual">Hubungkan dengan mesin antrean<Icon name="next" /></a>
        </section>

        <section aria-labelledby="materi-sintaks">
          <h2 id="materi-sintaks" tabIndex={-1}>Bagaimana membaca sintaks kode?</h2>
          <p>Sintaks adalah aturan penulisan kode agar dapat dipahami Python. Mari baca contoh cetak nama Budi per bagian, bukan menghafalnya sebagai satu kalimat.</p>
          <pre className={styles.code}><code>{'for i in range(5):\n    print("Budi")'}</code></pre>
          <dl className={styles.syntax}>
            <div><dt><code>for</code></dt><dd>Kata kunci untuk menelusuri nilai satu per satu. Untuk setiap nilai yang diambil, Python menjalankan isi blok. Kita memakainya karena ingin mengulangi pekerjaan untuk setiap nilai dalam sebuah urutan.</dd></div>
            <div><dt><code>i</code></dt><dd>Variabel yang menampung nilai yang sedang diambil. Pada contoh ini nilainya berganti: 0, 1, 2, 3, lalu 4. Nama <code>i</code> bukan kata khusus; boleh diganti menjadi <code>nomor</code> atau nama variabel lain yang sesuai.</dd></div>
            <div><dt><code>in</code></dt><dd>Bagian dari sintaks <code>for</code> yang menghubungkan variabel dengan sumber nilai. Baca <code>for i in range(5)</code> sebagai “untuk setiap nilai i yang diambil dari range(5)”.</dd></div>
            <div><dt><code>range(5)</code></dt><dd>Menyediakan urutan bilangan bulat 0 sampai 4: ada lima nilai. Start bawaannya 0, Step bawaannya 1, dan Stop 5 tidak ikut. <code>range</code> tidak mencetak apa pun; <code>for</code> memakai urutan ini untuk menjalankan lima putaran.</dd></div>
            <div><dt><code>:</code></dt><dd>Tanda titik dua mengakhiri kepala perulangan. Setelahnya, tulis blok instruksi yang akan dijalankan pada setiap putaran.</dd></div>
            <div><dt>Indentasi</dt><dd>Jarak di awal baris menandai bahwa <code>print</code> berada di dalam blok <code>for</code>. Gunakan indentasi konsisten; lazimnya empat spasi. Baris yang kembali sejajar dengan <code>for</code> berada di luar bloknya.</dd></div>
            <div><dt><code>print("Budi")</code></dt><dd><code>print(...)</code> menampilkan isinya ke output. Tanda kurung memuat nilai yang diberikan ke <code>print</code>, sedangkan tanda kutip menandai teks. Karena teksnya selalu <code>"Budi"</code>, yang tercetak adalah Budi pada setiap putaran.</dd></div>
          </dl>
          <h3>Mengapa memakai for dan range bersama?</h3>
          <p><code>for</code> mengatur pengulangan, sedangkan <code>range</code> menyediakan nilai-nilai yang ditelusuri. Untuk mengulang sejumlah hitungan tertentu, gabungan ini praktis. Mengubah <code>range(5)</code> menjadi <code>range(100)</code> menyediakan 100 nilai, sehingga baris cetak nama dijalankan 100 kali.</p>
          <p><code>for</code> juga bisa menelusuri daftar tanpa <code>range</code>. Pada contoh berikut, nama diambil langsung dari daftar dan dicetak satu per satu.</p>
          <pre className={styles.code}><code>{'for nama in ["Budi", "Siti"]:\n    print(nama)'}</code></pre>
          <p>Outputnya Budi, lalu Siti pada baris berikutnya. Ini menunjukkan bahwa <code>range</code> dipakai ketika kita membutuhkan urutan angka; bukan bagian yang wajib ada pada semua perulangan <code>for</code>.</p>
          <h3>Mengapa nilai i tidak ikut tercetak?</h3>
          <p>Variabel <code>i</code> tetap berganti nilai meskipun tidak dipakai oleh <code>print</code>. Isi tanda kurung <code>print</code> menentukan apa yang ditampilkan.</p>
          <div className={styles.tableWrap}><table><caption>Perbedaan isi print dalam for i in range(5)</caption><thead><tr><th scope="col">Isi blok</th><th scope="col">Output pada lima baris</th></tr></thead><tbody>
            <tr><td><code>print("Budi")</code></td><td>Budi, Budi, Budi, Budi, Budi</td></tr>
            <tr><td><code>print(i)</code></td><td>0, 1, 2, 3, 4</td></tr>
          </tbody></table></div>
          <p>Selanjutnya, kita hubungkan urutan angka ini dengan nilai awal, batas, dan perubahan nilai pada contoh mesin antrean.</p>
        </section>

        <section aria-labelledby="materi-kendali">
          <h2 id="materi-kendali" tabIndex={-1}>Nilai awal, kondisi, dan update</h2>
          <p>Pada contoh pencacah nomor antrean, tiga kendali membantu kita memahami jalannya program: <strong>Start</strong> menentukan nilai awal, <strong>Condition</strong> menentukan kapan loop berlanjut, dan <strong>Update</strong> mengubah nilai setiap putaran.</p>
          <figure>
            <div className={styles.cycle}>
              <div><span>Start</span><code>nomor = 1</code><small>Mulai dari 1</small><Icon name="next" /></div>
              <div><span>Condition</span><code>nomor &lt;= 5</code><small>True: lanjut ke isi loop</small><Icon name="next" /></div>
              <div><span>Isi loop</span><code>print(nomor)</code><small>Cetak nomor saat ini</small><Icon name="next" /></div>
              <div><span>Update</span><code>nomor += 1</code><small>Naikkan nilainya</small></div>
            </div>
            <p className={styles.cycleReturn}><Icon name="loop" />Sesudah Update, periksa Condition lagi. Jika False, loop berhenti.</p>
            <figcaption>Alur contoh <code>while</code>. Start dijalankan sekali sebelum pemeriksaan pertama. Model pencacah ini membantu memahami contoh; bentuk loop Python lainnya bisa berbeda.</figcaption>
          </figure>
        </section>

        <section aria-labelledby="materi-for">
          <h2 id="materi-for" tabIndex={-1}>For mengambil nilai satu per satu</h2>
          <p><code>for</code> menelusuri nilai dalam suatu kumpulan. Untuk nomor antrean, kita memakai <code>range</code> yang menyediakan urutan bilangan bulat.</p>
          <pre className={styles.code}><code>{'for nomor in range(1, 6, 1):\n    print(nomor)'}</code></pre>
          <p>Pada <code>range(start, stop, step)</code>, angka <strong>1</strong> adalah nilai awal, <strong>6</strong> adalah batas eksklusif, dan <strong>1</strong> adalah loncatan. Batas eksklusif berarti Stop tidak termasuk dalam urutan.</p>
          <div className={styles.tableWrap}><table><caption>Tiga cara menulis range</caption><thead><tr><th scope="col">Penulisan</th><th scope="col">Nilai yang disediakan</th></tr></thead><tbody>
            <tr><td><code>range(5)</code></td><td>0, 1, 2, 3, 4 — hanya Stop ditulis; Start 0 dan Step 1.</td></tr>
            <tr><td><code>range(1, 6)</code></td><td>1, 2, 3, 4, 5 — Start dan Stop ditulis; Step 1.</td></tr>
            <tr><td><code>range(2, 11, 2)</code></td><td>2, 4, 6, 8, 10 — Start, Stop, dan Step ditulis.</td></tr>
          </tbody></table></div>
          <figure>
            <div className={styles.rangeTrack}>{[1, 2, 3, 4, 5].map(number => <span key={number}>{number}</span>)}<span className={styles.excluded}>6<small>Stop</small></span></div>
            <figcaption>Nilai yang diambil: 1, 2, 3, 4, 5. Angka 6 menjadi batas dan tidak dicetak.</figcaption>
          </figure>
          <p><code>range(1, 6)</code> memakai Step bawaan 1. Untuk hitung mundur, gunakan arah yang sesuai: <code>range(5, 0, -1)</code> menghasilkan 5, 4, 3, 2, 1. Step tidak boleh nol.</p>
          <p>Indentasi menandai isi blok <code>for</code>. Pada contoh ini, setelah loop selesai, nilai terakhir yang diambil variabel <code>nomor</code> tetap 5.</p>
          <a className={styles.labLink} href="#lab/for">Amati for baris demi baris<Icon name="next" /></a>
        </section>

        <section aria-labelledby="materi-while">
          <h2 id="materi-while" tabIndex={-1}>While memeriksa kondisi berulang</h2>
          <p><code>while</code> menjalankan blok selama kondisinya bernilai True. Kondisi diperiksa sebelum setiap putaran, termasuk sebelum putaran pertama. Jika sejak awal False, isi loop tidak dijalankan.</p>
          <pre className={styles.code}><code>{'nomor = 1\nwhile nomor <= 5:\n    print(nomor)\n    nomor += 1'}</code></pre>
          <dl className={styles.syntax}>
            <div><dt><code>nomor = 1</code></dt><dd>Memberi nilai awal 1 pada variabel <code>nomor</code>. Tanda <code>=</code> adalah penugasan nilai, bukan pemeriksaan kesamaan.</dd></div>
            <div><dt><code>while nomor &lt;= 5:</code></dt><dd><code>while</code> memeriksa syarat sebelum setiap putaran. Operator <code>&lt;=</code> berarti “kurang dari atau sama dengan”. Jika syarat True, jalankan blok; jika False, keluar dari loop.</dd></div>
            <div><dt><code>nomor += 1</code></dt><dd>Sama dengan <code>nomor = nomor + 1</code>: tambahkan satu ke nilai sekarang. Pada contoh ini, update ditulis di dalam blok agar terjadi setiap putaran dan membawa nilai menuju kondisi berhenti.</dd></div>
          </dl>
          <p>Program mencetak nomor saat ini, lalu menambahkan 1. Setelah mencetak 5, update mengubah <code>nomor</code> menjadi 6. Pemeriksaan berikutnya bernilai False sehingga 6 tidak dicetak.</p>
          <div className={styles.tableWrap}><table><caption>Beberapa pemeriksaan pada contoh while</caption><thead><tr><th scope="col">Nilai nomor</th><th scope="col">nomor &lt;= 5</th><th scope="col">Tindakan</th></tr></thead><tbody>
            <tr><td>1</td><td>True</td><td>Cetak 1, update menjadi 2</td></tr>
            <tr><td>5</td><td>True</td><td>Cetak 5, update menjadi 6</td></tr>
            <tr><td>6</td><td>False</td><td>Berhenti tanpa mencetak 6</td></tr>
          </tbody></table></div>
          <a className={styles.labLink} href="#lab/while">Periksa nilai dan kondisi di simulator<Icon name="next" /></a>
        </section>

        <section aria-labelledby="materi-pilih">
          <h2 id="materi-pilih" tabIndex={-1}>Kapan memakai for atau while?</h2>
          <p>Pilih bentuk yang paling langsung menyatakan masalahmu. <code>for</code> cocok untuk menelusuri kumpulan nilai, sedangkan <code>while</code> cocok ketika pengulangan dikendalikan oleh sebuah kondisi.</p>
          <div className={styles.tableWrap}><table><caption>Contoh pemilihan jenis loop</caption><thead><tr><th scope="col">Masalah</th><th scope="col">Pilihan dan alasan</th></tr></thead><tbody>
            <tr><td>Cetak nomor 1 sampai 100</td><td><code>for</code> dapat menelusuri <code>range(1, 101)</code> yang sudah ditentukan.</td></tr>
            <tr><td>Layani pengunjung selama loket buka</td><td><code>while</code> dapat memeriksa kondisi loket sebelum melayani lagi.</td></tr>
          </tbody></table></div>
          <p>Keduanya dapat menyelesaikan beberapa masalah yang sama. Jumlah putaran <code>while</code> juga bisa diketahui, seperti contoh nomor 1 sampai 5 tadi.</p>
          <a className={styles.labLink} href="#lab/parameter">Coba 20 tantangan perulangan acak<Icon name="next" /></a>
        </section>

        <section aria-labelledby="materi-debug">
          <h2 id="materi-debug" tabIndex={-1}>Mengapa loop tidak berhenti?</h2>
          <p>Perhatikan kode berikut. Nilai <code>nomor</code> tetap 1 karena tidak pernah diubah. Kondisi <code>1 &lt;= 5</code> selalu True sehingga program terus mencetak 1. Keadaan ini disebut <strong>infinite loop</strong>.</p>
          <pre className={styles.code}><code>{'nomor = 1\nwhile nomor <= 5:\n    print(nomor)'}</code></pre>
          <details><summary>Lihat perbaikan dan alasannya</summary><p>Tambahkan <code>nomor += 1</code> di dalam blok <code>while</code>, setelah <code>print(nomor)</code>. Nilai kemudian bergerak menuju kondisi berhenti. Mengurangi nilai dengan <code>nomor -= 1</code> justru menjauhkannya dari batas pada contoh ini.</p></details>
          <a className={styles.labLink} href="#lab/debug">Uji usulan perbaikan di laboratorium<Icon name="next" /></a>
        </section>

        <section aria-labelledby="materi-rangkuman">
          <h2 id="materi-rangkuman" tabIndex={-1}>Rangkuman dan tindak lanjut</h2>
          <ul className={styles.recap}>
            <li>Loop meringkas pekerjaan yang berulang.</li>
            <li><code>for</code> menelusuri kumpulan nilai; <code>range</code> tidak memasukkan Stop.</li>
            <li><code>while</code> melanjutkan pengulangan selama kondisi True.</li>
            <li>Pada contoh pencacah, nilai awal, kondisi, dan update bekerja bersama agar loop berhenti sesuai tujuan.</li>
          </ul>
          <a className={shared.primaryButton} href="#lab/kuis">Uji pemahamanmu<Icon name="next" /></a>
          <h3>Coba bersama orang tua</h3>
          <p>Amati satu kegiatan berulang di rumah, misalnya mengecek stok atau menyiram tanaman. Diskusikan nilai awal, kondisi berhenti, dan perubahan nilainya. Tulis pseudocode atau Python hasil diskusi, lalu minta paraf orang tua.</p>
    
          <details><summary>Refleksi setelah belajar</summary><p>Jawab secara lisan dengan Ya, Biasa-biasa saja, atau Tidak.</p><ol>
            <li>Apakah kamu senang mengikuti pembelajaran perulangan Python?</li>
            <li>Apakah kamu merasa kesulitan saat praktik perulangan Python?</li>
            <li>Apakah suasana kelas terasa menyenangkan?</li>
            <li>Apakah kamu dapat mengerjakan kuis dengan baik?</li>
            <li>Apakah kamu ingin belajar perulangan Python lagi?</li>
          </ol></details>
          <p className={styles.source}>Materi mengacu pada RPP Micro Teaching Perulangan Python 20 Menit. Simulator memakai contoh terarah; percobaan simulator kembali ke awal saat halaman dimuat ulang. Kuis dikerjakan dan dinilai melalui Wayground.</p>
        </section>
      </article>
    </div>
  </>;
}
