export interface TikaMotif {
  id: string;
  batik_name: string;
  normalized_name: string;
  aliases: string[];
  origin: string;
  province: string;
  category: string;
  description: string;
  image_url: string;
  focus_point: {
    x: number; // 0 to 1 (percentage coordinate)
    y: number; // 0 to 1 (percentage coordinate)
  };
  difficulty_multiplier: number;
  clues?: string[];
}

export const TIKA_CATALOG: TikaMotif[] = [
  {
    id: "kawung",
    batik_name: "Kawung",
    normalized_name: "kawung",
    aliases: ["batik kawung", "kawung picis", "kawung beton", "kawung sen"],
    origin: "D.I. Yogyakarta",
    province: "D.I. Yogyakarta",
    category: "Batik Keraton (Geometris)",
    description:
      "Terinspirasi dari buah aren atau kolang-kaling yang tersusun empat penjuru simetris. Melambangkan kesucian hati, keadilan, pengendalian hawa nafsu, dan empat arah mata angin sumber energi kehidupan.",
    image_url: "/images/motifs/batik_kawung.webp",
    focus_point: { x: 0.5, y: 0.5 },
    difficulty_multiplier: 1.0,
    clues: [
      "Empat elips lonjong yang merepresentasikan buah aren atau kolang-kaling.",
      "Salah satu motif tertua di tanah Jawa yang tercatat sejak abad ke-13.",
      "Kerap dikenakan oleh para ksatria dan abdi dalem berhati bersih.",
    ],
  },
  {
    id: "mega-mendung",
    batik_name: "Mega Mendung",
    normalized_name: "mega mendung",
    aliases: ["megamendung", "batik mega mendung", "batik megamendung", "mega mendung cirebon"],
    origin: "Cirebon",
    province: "Jawa Barat",
    category: "Batik Pesisiran (Alam)",
    description:
      "Gumpalan awan berlapis dengan gradasi warna tegas khas pesisir Cirebon. Melambangkan keluasan jiwa, keteduhan watak pemimpin, dan kesabaran dalam menghadapi cobaan hidup seperti awan yang menyejukkan bumi.",
    image_url: "/images/motifs/batik_mega_mendung.webp",
    focus_point: { x: 0.42, y: 0.38 },
    difficulty_multiplier: 1.1,
    clues: [
      "Gradasi awan meliuk berlapis hasil akulturasi seni Tiongkok dan Cirebon.",
      "Warna khas menggunakan paduan biru langit dan merah membara.",
      "Lahir dari kearifan para pembatik Keraton Kasepuhan dan Kanoman di Cirebon.",
    ],
  },
  {
    id: "parang-rusak",
    batik_name: "Parang Rusak",
    normalized_name: "parang rusak",
    aliases: ["parang", "batik parang", "batik parang rusak", "parang barong", "parang klithik"],
    origin: "Surakarta & Yogyakarta",
    province: "Jawa Tengah & D.I. Yogyakarta",
    category: "Batik Larangan (Geometris)",
    description:
      "Garis diagonal tajam berkesinambungan menyerupai ombak samudra yang menghantam karang tanpa putus. Melambangkan semangat pantang menyerah, keteguhan hati, dan kewaspadaan diri.",
    image_url: "/images/motifs/batik_parang.webp",
    focus_point: { x: 0.35, y: 0.65 },
    difficulty_multiplier: 1.2,
    clues: [
      "Lekukan garis diagonal miring menyerupai huruf S (lereng) yang saling menjalin tanpa putus.",
      "Diciptakan oleh Sultan Agung Hanyokrokusumo saat bertapa di pesisir Laut Selatan Jawa.",
      "Dahulu tergolong Batik Larangan yang hanya boleh dikenakan oleh raja dan keluarga bangsawan.",
    ],
  },
  {
    id: "buketan",
    batik_name: "Buketan",
    normalized_name: "buketan",
    aliases: ["batik buketan", "buketan pekalongan", "boeket"],
    origin: "Pekalongan",
    province: "Jawa Tengah",
    category: "Batik Pesisiran (Floral)",
    description:
      "Berasal dari kata Belanda boeket (karangan bunga). Menampilkan komposisi karangan bunga mekar cerah nan anggun, melambangkan kebahagiaan, kemekaran budi pekerti, dan akulturasi budaya.",
    image_url: "/images/motifs/batik_buketan.webp",
    focus_point: { x: 0.58, y: 0.45 },
    difficulty_multiplier: 1.3,
    clues: [
      "Menampilkan karangan bunga mawar, tulip, kupu-kupu, dan burung merak yang berlatar cerah.",
      "Karya pembatik peranakan Belanda dan Tionghoa di pesisir utara Jawa.",
      "Sangat digemari sebagai kain sarung kebaya pesta yang anggun.",
    ],
  },
  {
    id: "truntum",
    batik_name: "Truntum",
    normalized_name: "truntum",
    aliases: ["batik truntum", "truntum solo", "truntum yogyakarta"],
    origin: "Surakarta (Solo)",
    province: "Jawa Tengah",
    category: "Batik Keraton (Geometris)",
    description:
      "Bintang-bintang kecil gemerlap di langit malam ciptaan Kanjeng Ratu Kencana. Truntum bermakna tumaruntum (tumbuh bersemi kembali), simbol cinta kasih tulus yang selalu bersemi.",
    image_url: "/images/motifs/batik_truntum.webp",
    focus_point: { x: 0.52, y: 0.48 },
    difficulty_multiplier: 1.2,
    clues: [
      "Pola taburan bunga melati kecil atau bintang berhamburan di langit malam gelap.",
      "Diciptakan oleh permaisuri Sunan Pakubuwana III saat memandangi langit malam berbintang.",
      "Tradisional dikenakan oleh orang tua pengantin pada prosesi pernikahan adat Jawa.",
    ],
  },
  {
    id: "sekar-jagad",
    batik_name: "Sekar Jagad",
    normalized_name: "sekar jagad",
    aliases: ["sekarjagad", "batik sekar jagad", "batik sekarjagad"],
    origin: "Yogyakarta & Surakarta",
    province: "D.I. Yogyakarta",
    category: "Batik Keraton (Campuran)",
    description:
      "Berasal dari kata kar (peta) dan jagad (dunia), atau sekar (bunga keindahan). Menggambarkan mozaik pulau-pulau di dunia yang masing-masing diisi aneka isen-isen motif berbeda.",
    image_url: "/images/motifs/batik_sekar_jagad.webp",
    focus_point: { x: 0.45, y: 0.55 },
    difficulty_multiplier: 1.4,
    clues: [
      "Bentuk pulau-pulau kecil asimetris yang dibatasi garis bergelombang seperti peta benua.",
      "Tiap bagian pulau dihiasi isen-isen motif berbeda seperti cecek, sawut, dan kawung.",
      "Bermakna keindahan bunga sejagat raya dan keragaman suku bangsa yang harmonis.",
    ],
  },
  {
    id: "sido-mukti",
    batik_name: "Sido Mukti",
    normalized_name: "sido mukti",
    aliases: ["sidomukti", "batik sido mukti", "batik sidomukti"],
    origin: "Surakarta & Yogyakarta",
    province: "Jawa Tengah",
    category: "Batik Keraton (Semen)",
    description:
      "Sido bermakna menjadi atau terlaksana, Mukti bermakna hidup mulia dan berkecukupan. Doa agar pemakainya memperoleh kebahagiaan lahir batin, rezeki halal, dan kedudukan terhormat.",
    image_url: "/images/motifs/batik_sidomukti.webp",
    focus_point: { x: 0.55, y: 0.62 },
    difficulty_multiplier: 1.3,
    clues: [
      "Menggunakan pewarnaan soga alam cokelat kemerahan khas keraton Jawa Mataram.",
      "Dihiasi ornamen pohon hayat, garuda sayap satu (lar), dan singgasana mahkota.",
      "Dikenakan kedua mempelai dalam upacara panggih pernikahan adat Surakarta.",
    ],
  },
  {
    id: "singa-barong",
    batik_name: "Singa Barong",
    normalized_name: "singa barong",
    aliases: ["batik singa barong", "singabarong", "singa barong cirebon"],
    origin: "Cirebon",
    province: "Jawa Barat",
    category: "Batik Keraton (Mitos)",
    description:
      "Menggambarkan wujud kereta kencana Paksi Naga Liman dari Keraton Kasepuhan Cirebon. Perpaduan empat unsur budaya: belalai gajah (India), kepala naga (Tiongkok), sayap garuda (Islam/Jawa), dan badan singa (Eropa).",
    image_url: "/images/motifs/batik_singa_barong.webp",
    focus_point: { x: 0.38, y: 0.42 },
    difficulty_multiplier: 1.5,
    clues: [
      "Hewan mitologis gabungan empat makhluk: gajah, naga, singa, dan burung garuda.",
      "Terinspirasi dari kereta pusaka kebesaran Sultan di Keraton Kasepuhan Cirebon.",
      "Simbol keterbukaan pelabuhan Cirebon terhadap peradaban dunia.",
    ],
  },
  {
    id: "jlamprang",
    batik_name: "Jlamprang",
    normalized_name: "jlamprang",
    aliases: ["batik jlamprang", "jlamprang pekalongan"],
    origin: "Pekalongan",
    province: "Jawa Tengah",
    category: "Batik Pesisiran (Geometris)",
    description:
      "Pola geometri simetris delapan arah mata angin terinspirasi dari kain tenun patola sutra Gujarat India. Melambangkan keselarasan manusia dengan semesta serta keteraturan spiritual yang damai.",
    image_url: "/images/motifs/batik_jlamprang.webp",
    focus_point: { x: 0.5, y: 0.5 },
    difficulty_multiplier: 1.4,
    clues: [
      "Pola roset bintang dan lingkaran teratur simetris tanpa gambar makhluk bernyawa.",
      "Lahir dari akulturasi saudagar Gujarat India dan para santri di pesisir Pekalongan.",
      "Merupakan ikon resmi lambang kota batik Pekalongan, Jawa Tengah.",
    ],
  },
  {
    id: "lasem-liong",
    batik_name: "Lasem Liong",
    normalized_name: "lasem liong",
    aliases: ["batik lasem", "lasem", "liong lasem", "batik naga lasem"],
    origin: "Lasem (Rembang)",
    province: "Jawa Tengah",
    category: "Batik Pesisiran (Akulturasi)",
    description:
      "Perpaduan seni batik di pesisir Lasem. Warna merah getih pitik (darah ayam) yang khas dipadukan dengan ornamen naga liong dan burung hong melambangkan kemakmuran dan keberanian.",
    image_url: "/images/motifs/batik_liong.webp",
    focus_point: { x: 0.65, y: 0.35 },
    difficulty_multiplier: 1.4,
    clues: [
      "Ciri khas warna merah menyala yang dikenal dengan sebutan merah getih pitik.",
      "Menampilkan ornamen naga liong, burung phoenix (hong), dan motif sekar jagad pesisir.",
      "Berkembang di kota tua Lasem, Rembang yang dijuluki Kota Tiongkok Kecil.",
    ],
  },
  {
    id: "betawi-ondel",
    batik_name: "Betawi Ondel-Ondel",
    normalized_name: "betawi ondel-ondel",
    aliases: ["batik betawi", "ondel-ondel", "batik ondel ondel", "betawi"],
    origin: "DKI Jakarta",
    province: "DKI Jakarta",
    category: "Batik Pesisiran (Kultural)",
    description:
      "Menggambarkan boneka raksasa Ondel-ondel Betawi yang dipadukan dengan pucuk rebung dan kembang kelapa. Melambangkan penolak bala, keterbukaan hati, dan keceriaan warga Jakarta.",
    image_url: "/images/motifs/batik_betawi.webp",
    focus_point: { x: 0.48, y: 0.52 },
    difficulty_multiplier: 1.1,
    clues: [
      "Warna-warna cerah seperti kuning terang, merah jingga, dan hijau daun.",
      "Menampilkan ikon boneka raksasa penjaga kota Jakarta dan ornamen pucuk rebung segitiga.",
      "Batik khas ibu kota yang sering dikenakan pada perayaan HUT DKI Jakarta dan Abang None.",
    ],
  },
  {
    id: "dayak-batang-garing",
    batik_name: "Dayak Batang Garing",
    normalized_name: "dayak batang garing",
    aliases: ["batik dayak", "batang garing", "batik kalimantan", "dayak"],
    origin: "Palangka Raya",
    province: "Kalimantan Tengah",
    category: "Batik Nusantara (Etnik)",
    description:
      "Menggambarkan Batang Garing (Pohon Kehidupan) kosmologi Dayak Ngaju. Melambangkan keseimbangan hubungan manusia dengan Sang Pencipta, sesama manusia, dan kelestarian alam hutan tropis Kalimantan.",
    image_url: "/images/motifs/batik_dayak.webp",
    focus_point: { x: 0.45, y: 0.6 },
    difficulty_multiplier: 1.3,
    clues: [
      "Lengkungan sulur khas ukiran kayu Dayak berpadu dengan tameng telawang.",
      "Menampilkan pohon kehidupan Batang Garing dan burung enggang gading.",
      "Batik etnik khas Kalimantan yang sarat nilai persatuan dengan alam semesta.",
    ],
  },
];

// Helper: ambil soal harian berbasis seed tanggal (semua pemain mendapatkan soal yang sama hari ini)
export function getDailyTikaMotif(): TikaMotif {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = Math.abs(dayOfYear) % TIKA_CATALOG.length;
  return TIKA_CATALOG[index];
}

// Helper: ambil motif acak untuk mode endless/latihan
export function getRandomTikaMotif(excludeId?: string): TikaMotif {
  const pool = excludeId ? TIKA_CATALOG.filter((m) => m.id !== excludeId) : TIKA_CATALOG;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
