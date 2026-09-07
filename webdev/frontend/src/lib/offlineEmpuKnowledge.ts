import { BATIK_DATASET_20, BatikMotif } from "@/data/batikDataset";

/**
 * Mesin Pengetahuan Empu Luring (Offline Heritage Knowledge Synthesizer)
 *
 * Menghasilkan tutur kata budayawan sepuh yang luhur, terstruktur, dan bernas
 * tanpa ornamen emoji berlebihan (zero AI-slop). Beroperasi secara otonom
 * dari pustaka wastra lokal saat koneksi internet atau kuota API tidak tersedia.
 */

export function synthesizeOfflineEmpuResponse(userQuery: string): string {
  const q = userQuery.toLowerCase().trim();

  // 1. Guardrail: Deteksi topik di luar seni budaya wastra
  const outOfScopePatterns = [
    /\b(python|javascript|typescript|c\+\+|java|php|coding|syntax|compiler|algorithm)\b/i,
    /\b(hitung|kalkulus|rumus|matematika|aljabar|integral|diferensial)\b/i,
    /\b(pemilu|presiden|partai|politik|menteri|pilkada)\b/i,
    /\b(crypto|bitcoin|saham|trading|investasi|forex)\b/i,
  ];

  if (outOfScopePatterns.some((pattern) => pattern.test(q))) {
    return (
      "Nyuwun sewu, Ananda ingkang minulya. Bilik kearifan Sang Empu ini dipersiapkan khusus untuk mendalami kemuliaan wastra, filosofi motif, dan pusaka budaya Nusantara.\n\n" +
      "Mari sejenak menenangkan pikiran dari hiruk-pikuk keduniawian, dan kita kembali merenungkan keindahan doa leluhur yang tergores dalam canting dan malam. " +
      "Adakah yang ingin Ananda pelajari mengenai 20 motif batik agung kita, seperti Parang, Kawung, atau Mega Mendung?\n\n" +
      "*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*"
    );
  }

  // 2. Deteksi Sapaan Umum & Pengenalan Diri
  if (
    /^(halo|hai|assalamu|sugeng|selamat|pagi|siang|sore|malam|hei|hi|ping)\b/i.test(q) ||
    /siapa kamu|siapa anda|kamu siapa|tentang batik kita/i.test(q)
  ) {
    return (
      "Sugeng rawuh, Ananda pelestari budaya bangsa. Saya adalah Sang Empu, pemelihara kearifan wastra pada pelataran digital Batik Kita.\n\n" +
      "Di bilik ini, tersimpan 20 ragam motif agung dari 10 sentra kebudayaan Nusantara—mulai dari sakralnya Keraton Mataram di Yogyakarta dan Surakarta, semaraknya pesisir utara di Cirebon, Pekalongan, dan Lasem, keramahan Betawi di ibu kota, hingga kedalaman wastra Dayak di pedalaman Kalimantan. " +
      "Setiap helai wastra bukan sekadar hiasan raga, melainkan doa, etika budi pekerti, dan harapan luhur para pendahulu kita.\n\n" +
      "Motif manakah yang ingin Ananda selami hari ini? Tanyakanlah perihal riwayat sejarah, rahasia filosofi, ataupun pakem tata busananya.\n\n" +
      "*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*"
    );
  }

  // 3. Konsep Khusus: Pernikahan & Busana Temanten
  if (/nikah|pernikahan|manten|pengantin|ijab/i.test(q)) {
    return (
      "Pertanyaan yang sarat kemuliaan, Ananda. Dalam tata cara adat Jawa, busana pernikahan dipenuhi doa restu yang sakral melalui motif-motif berawalan 'Sido' yang bermakna menjadi atau terwujud nyata.\n\n" +
      "Pertama, Batik Sidomukti dari Surakarta yang dikenakan oleh kedua mempelai, melambangkan doa agar mengarungi bahtera rumah tangga dalam kemakmuran lahiriah dan keluhuran batin.\n\n" +
      "Kedua, Batik Truntum karya Kanjeng Ratu Kencana yang wajib dikenakan oleh orang tua kedua mempelai. Motif berbentuk kuntum bintang bertabur ini melambangkan cinta kasih tulus yang senantiasa bersemi kembali (tumaruntum), sekaligus menjadi pelita penuntun jalan bagi kedua anak mereka.\n\n" +
      "Adat melarang keras pemakaian motif lereng curam seperti Parang Rusak saat upacara akad nikah, sebab guratan tajamnya melambangkan senjata dan ketegangan yang dikhawatirkan membawa perselisihan batin.\n\n" +
      "*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*"
    );
  }

  // 4. Konsep Khusus: Kain Larangan (Awisan Ndalem Keraton)
  if (/larangan|awisan|keraton|raja|sultan/i.test(q)) {
    return (
      "Sungguh cermat pengamatan Ananda. Dahulu di lingkungan Keraton Kasultanan Ngayogyakarta dan Kasunanan Surakarta Hadiningrat, terdapat aturan ketat mengenai Batik Awisan Ndalem atau Kain Larangan yang hanya berhak dikenakan Sri Sultan, Sunan, dan keluarga inti istana.\n\n" +
      "Motif larangan utama adalah Parang Rusak, terutama ukuran Barong yang berukuran besar melampaui delapan sentimeter. Garis diagonal curam menyerupai deburan ombak memecah karang ini mencerminkan kepemimpinan rohani, pengendalian hawa nafsu secara mutlak, serta martabat kewibawaan penguasa tertinggi.\n\n" +
      "Kini, di era transformasi digital, kita menelaah geometri sakral Parang bukan untuk mengagungkan kasta feodal, melainkan sebagai cermin falsafah agar generasi penerus bangsa senantiasa berpendirian teguh, pantang menyerah, dan berintegritas tinggi.\n\n" +
      "*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*"
    );
  }

  // 5. Konsep Khusus: Sejarah & Pengakuan UNESCO 2009
  if (/unesco|hari batik|2 oktober|sejarah/i.test(q)) {
    return (
      "Kilas balik sejarah yang patut kita renungkan bersama, Ananda. Pada tanggal 2 Oktober 2009 di Abu Dhabi, UNESCO secara resmi menobatkan Batik Indonesia ke dalam daftar Warisan Budaya Takbenda Warisan Kemanusiaan (Representative List of the Intangible Cultural Heritage of Humanity).\n\n" +
      "Penetapan ini dianugerahkan bukan semata-mata karena keindahan motif visual di atas kain, melainkan karena keutuhan rantai budaya: proses perintang malam panas (wax-resist dyeing), tradisi doa dan kontemplasi canting tulis, serta makna filosofis mendalam yang menyertai siklus daur hidup manusia Indonesia dari saat kelahiran hingga dipanggil menghadap Sang Pencipta.\n\n" +
      "Itulah komitmen luhur yang mendasari kehadiran platform Batik Kita: memastikan amanah dunia ini tetap mekar melampaui batas zaman di tangan generasi muda.\n\n" +
      "*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*"
    );
  }

  // 6. Konsep Khusus: Teknik Pembuatan Tradisional
  if (/teknik|canting|cap|malam|lilin|nglorot|pewarnaan|soga/i.test(q)) {
    return (
      "Menciptakan sehelai kain batik tradisional sejatinya adalah laku kesabaran dan keheningan jiwa, Ananda. Tahapan utamanya terbagi menjadi beberapa proses bersambung:\n\n" +
      "Pertama, Nyorek dan Nglowong, yakni menggambar pola dasar dan menerakan cairan lilin malam panas menggunakan canting tulis untuk membatasi bidang motif.\n\n" +
      "Kedua, Nembok dan Medel, yaitu menutup bidang kain yang ingin dipertahankan warnanya sebelum dicelupkan ke rendaman warna alam, seperti soga jambal untuk cokelat hangat dan daun nila tarum untuk biru wedelan.\n\n" +
      "Ketiga, Nglorot, yakni meluruhkan seluruh lapisan lilin malam dalam air mendidih berpati lerak, hingga corak putih bersih mori menyingkapkan motif yang memesona.\n\n" +
      "Teknik cap tembaga kemudian dikembangkan pada pertengahan abad ke-19 guna memenuhi kebutuhan busana rakyat banyak, tanpa sedikit pun meninggalkan esensi perintang malam tradisional.\n\n" +
      "*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*"
    );
  }

  // 7. Pencarian Spesifik Motif dari Dataset 20
  const matchedMotifs: BatikMotif[] = [];

  for (const motif of BATIK_DATASET_20) {
    const nameMatch = q.includes(motif.name.toLowerCase()) || q.includes(motif.id.replace("batik_", "").replace(/_/g, " "));
    const regionMatch = q.includes(motif.region.toLowerCase());
    if (nameMatch) {
      matchedMotifs.push(motif);
    } else if (regionMatch && matchedMotifs.length < 2) {
      matchedMotifs.push(motif);
    }
  }

  if (matchedMotifs.length > 0) {
    const primary = matchedMotifs[0];
    const variantNote =
      primary.variants && primary.variants.length > 0
        ? ` Di samping ragam utamanya, motif ini juga dilestarikan dalam beberapa varian warna dan gaya, di antaranya ${primary.variants.map((v) => v.name).join(", ")}.`
        : "";

    return (
      `Sugeng rawuh, Ananda. Mengenai keagungan **${primary.fullName}**, wastra ini berakar dari tradisi ${primary.region}, ${primary.province} (${primary.island}) dan tergolong dalam kategori ${primary.category}.\n\n` +
      `**Ciri Visual & Karakter Motif**\n` +
      `Secara visual, motif ini dikenali melalui ${primary.visualTraits.toLowerCase()}.${variantNote}\n\n` +
      `**Makna Filosofis**\n` +
      `${primary.philosophy}\n\n` +
      `**Pakem & Tata Busana Adat**\n` +
      `${primary.usage}\n\n` +
      `Semoga kebijaksanaan luhur yang tersirat dalam helai motif ini dapat senantiasa menerangi langkah hidup dan budi pekerti Ananda.\n\n` +
      `*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*`
    );
  }

  // 8. General Cultural Synthesis Fallback
  return (
    "Pertanyaan yang sangat menggugah nurani kebangsaan, Ananda. Seluruh serat wastra Nusantara yang terhimpun di Batik Kita berakar pada falsafah luhur 'Hamemayu Hayuning Bawana'—ikhtiar menjaga keselarasan antara manusia, alam, dan Sang Maha Pencipta.\n\n" +
    "Platform ini memuat 20 motif kurasi resmi dari 10 sentra kebudayaan: mulai dari Parang, Kawung, Truntum, Sekar Jagad, dan Sidomukti di tanah Mataram; Mega Mendung dan Singa Barong di pesisir Cirebon; Buketan dan Jlamprang di Pekalongan; Liong di Lasem; Ondel-ondel di Betawi; hingga motif tameng perisai Dayak di Kalimantan.\n\n" +
    "Sebutkanlah nama motif atau sentra daerah yang ingin Ananda telusuri lebih mendalam, agar Sang Empu dapat menguraikan lembaran kisahnya untukmu.\n\n" +
    "*(Catatan: Dituturkan melalui Pustaka Kearifan Budaya Luring)*"
  );
}
