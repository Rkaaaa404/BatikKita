export interface BatikVariant {
  name: string;
  image: string;
  description: string;
}

export interface BatikMotif {
  id: string; // Raw dataset id, e.g. "batik_kawung"
  name: string; // Standard name, e.g. "Kawung"
  fullName: string; // e.g. "Batik Kawung"
  rawId: string; // e.g. "batik_kawung"
  region: string; // Sentra asal
  province: string;
  island: string;
  category: "Batik Keraton" | "Batik Pesisiran" | "Batik Larangan" | "Batik Nusantara";
  philosophy: string;
  usage: string;
  visualTraits: string;
  image: string; // Primary image e.g. "/images/motifs/batik_kawung.webp"
  variants: BatikVariant[];
  hints: [string, string, string, string]; // 4 progressive clues, zero em-dash
}

export const BATIK_DATASET_20: BatikMotif[] = [
  {
    id: "batik_betawi",
    rawId: "batik_betawi",
    name: "Betawi",
    fullName: "Batik Betawi",
    region: "DKI Jakarta",
    province: "DKI Jakarta",
    island: "Jawa",
    category: "Batik Pesisiran",
    philosophy:
      "Mencerminkan keterbukaan dan kehangatan warga Batavia dalam menyambut keberagaman etnis. Ornamen Ondel-ondel dan pucuk rebung menjadi simbol penangkal bala serta harapan agar warga selalu berkembang lurus ke atas seperti tunas bambu.",
    usage: "Busana resmi festival Abang None Jakarta, seragam seremonial hari ulang tahun kota, dan busana santai pesta adat.",
    visualTraits: "Warna kontras mencolok seperti jingga terang, merah delima, dan kuning kunyit. Menampilkan motif Ondel-ondel, kembang kelapa, atau tumpal segitiga pucuk rebung.",
    image: "/images/motifs/batik_betawi.webp",
    variants: [
      {
        name: "Varian Ondel-Ondel & Pucuk Rebung",
        image: "/images/motifs/batik_betawi_var1.webp",
        description: "Pewarnaan merah jingga cerah khas pesisir Batavia dengan ikon budaya Jakarta.",
      },
      {
        name: "Varian Kembang Kelapa Kontemporer",
        image: "/images/motifs/batik_betawi_var2.webp",
        description: "Latar dasar kontras dengan ornamen kembang kelapa penolak bala.",
      },
    ],
    hints: [
      "Motif ini lahir dari masyarakat pesisir barat pulau Jawa yang menjadi pusat perniagaan antarbangsa.",
      "Khas dengan warna-warna menyala dan berani tanpa takut memadukan merah, kuning, dan hijau terang.",
      "Diproduksi di sentra kebudayaan lokal seperti Setu Babakan dan perkampungan Palmerah.",
      "Kerap menampilkan boneka raksasa Ondel-ondel, pohon kelapa, atau segitiga pucuk rebung.",
    ],
  },
  {
    id: "batik_bokor_kencono",
    rawId: "batik_bokor_kencono",
    name: "Bokor Kencono",
    fullName: "Batik Bokor Kencono",
    region: "D.I. Yogyakarta & Surakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Bokor bermakna wadah logam sesaji, sedangkan kencono berarti emas murni. Motif ini memuat doa agar pemakainya menjadi wadah yang menampung kebajikan, rezeki halal, serta menjaga kejernihan hati.",
    usage: "Dikenakan oleh sesepuh dan keluarga bangsawan dalam upacara adat midodareni dan pertemuan seremonial kraton.",
    visualTraits: "Pola ceplok belah ketupat berulang yang diisi ornamen wadah bertutup, sulur tanaman melingkar, dan untaian bunga teratur.",
    image: "/images/motifs/batik_bokor_kencono.webp",
    variants: [
      {
        name: "Bokor Kencono Babaran Sogan",
        image: "/images/motifs/batik_bokor_kencono_var1.webp",
        description: "Warna cokelat soga Mataram dengan isen cecek halus di sekeliling wadah emas.",
      },
      {
        name: "Ceplok Belah Ketupat Alus",
        image: "/images/motifs/batik_bokor_kencono_var2.webp",
        description: "Geometri simetris dengan garis luar tegas berlatar mori pethak.",
      },
    ],
    hints: [
      "Namanya diambil dari perabot logam kuno tempat menyimpan beras kuning dan sesaji di istana raja.",
      "Tergolong rumpun batik ceplok dengan garis batas belah ketupat yang tertata simetris.",
      "Lahir dari kehalusan seni batik Kraton Ngayogyakarta dan Surakarta Hadiningrat.",
      "Setiap bidang memuat ornamen mangkuk bertutup yang diapit sulur dedaunan melengkung.",
    ],
  },
  {
    id: "batik_buketan",
    rawId: "batik_buketan",
    name: "Buketan",
    fullName: "Batik Buketan",
    region: "Pekalongan",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Pesisiran",
    philosophy:
      "Berasal dari kata Belanda boeket yang berarti karangan bunga. Mencerminkan keindahan tanaman mekar, keramahan, dan perpaduan gaya seni Art Nouveau Eropa dengan keahlian mencanting pembatik Pekalongan.",
    usage: "Pilihan favorit untuk kebaya pesta, wisuda, perhelatan keluarga, dan busana kerja semi-formal.",
    visualTraits: "Rangkaian karangan bunga mawar, tulip, atau seruni berukuran besar, ditemani burung merak atau kupu-kupu yang bertebaran di latar warna pastel lembut.",
    image: "/images/motifs/batik_buketan.webp",
    variants: [
      {
        name: "Buket Pastel Pekalongan",
        image: "/images/motifs/batik_buketan_var1.webp",
        description: "Rangkaian bunga seruni dan tulip berwarna merah muda berlatar cerah.",
      },
      {
        name: "Buket Kupu-Kupu & Merak",
        image: "/images/motifs/batik_buketan_var2.webp",
        description: "Komposisi karangan bunga dengan burung merak bergaya Indo-Belanda abad ke-19.",
      },
    ],
    hints: [
      "Namanya diserap dari bahasa Belanda untuk menyebut karangan bunga yang dirangkai cantik.",
      "Berkembang pesat di tangan pengusaha batik perempuan Indo-Eropa pada akhir abad ke-19.",
      "Menjadi ciri khas paling terkenal dari sentra batik pesisir Pekalongan, Jawa Tengah.",
      "Menampilkan karangan bunga asimetris yang ditemani kupu-kupu dan burung merak di latar warna cerah.",
    ],
  },
  {
    id: "batik_dayak",
    rawId: "batik_dayak",
    name: "Dayak",
    fullName: "Batik Dayak",
    region: "Palangka Raya & Balikpapan",
    province: "Kalimantan Tengah",
    island: "Kalimantan",
    category: "Batik Nusantara",
    philosophy:
      "Pohon Batang Garing menggambarkan hubungan manusia dengan Sang Pencipta (Ranying Hatalla) serta keharusan menjaga keseimbangan rimba raya. Tameng telawang melambangkan perlindungan diri dari ancaman mara bahaya.",
    usage: "Busana upacara adat Tiwah, festival budaya Isen Mulang, serta pakaian dinas resmi instansi di Kalimantan.",
    visualTraits: "Garis lengkung sulur khas ukiran kayu Dayak Ngaju, ornamen tameng telawang segitiga, dan siluet burung enggang gading.",
    image: "/images/motifs/batik_dayak.webp",
    variants: [
      {
        name: "Batang Garing (Pohon Kehidupan)",
        image: "/images/motifs/batik_dayak_var1.webp",
        description: "Pohon kehidupan dengan cabang sulur vertikal dan buah lambang kemakmuran.",
      },
      {
        name: "Ukiran Telawang & Burung Enggang",
        image: "/images/motifs/batik_dayak_var2.webp",
        description: "Pola perisai suku pedalaman yang dipadukan dengan paruh burung enggang.",
      },
    ],
    hints: [
      "Lahir dari kearifan suku penghuni pedalaman hutan tropis terbesar di Indonesia.",
      "Memadukan teknik canting lilin dengan ragam ukir kayu khas perisai dan rumah betang.",
      "Banyak diproduksi di Palangka Raya, Pontianak, dan Balikpapan.",
      "Memuat gambar Batang Garing (Pohon Kehidupan) dan burung enggang berparuh panjang.",
    ],
  },
  {
    id: "batik_jlamprang",
    rawId: "batik_jlamprang",
    name: "Jlamprang",
    fullName: "Batik Jlamprang",
    region: "Pekalongan",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Pesisiran",
    philosophy:
      "Terinspirasi dari tenun sutra Patola asal Gujarat, India. Pola bintang delapan penjuru melambangkan keteraturan arah mata angin pembawa berkah, tanpa menggambar makhluk bernyawa sesuai anjuran syariat para saudagar muslim.",
    usage: "Kain upacara sedekah laut di pesisir utara, perayaan hari besar Islam, dan busana formal pria.",
    visualTraits: "Rangkaian lingkaran dan roset bintang delapan simetris dengan batas-batas titik tegas, menyerupai mandala geometris.",
    image: "/images/motifs/batik_jlamprang.webp",
    variants: [
      {
        name: "Jlamprang Patola Roset",
        image: "/images/motifs/batik_jlamprang_var1.webp",
        description: "Bintang delapan penjuru simetris dalam lingkaran ceplok berlatar gelap.",
      },
      {
        name: "Jlamprang Geometris Cokelat",
        image: "/images/motifs/batik_jlamprang_var2.webp",
        description: "Komposisi titik dan garis lurus menyerupai tenunan Gujarat kuno.",
      },
    ],
    hints: [
      "Terinspirasi dari kain tenun sutra Patola yang dibawa saudagar India ke pelabuhan Jawa.",
      "Menganut kaidah seni Islam pesisir yang tidak menggambarkan wujud binatang maupun manusia.",
      "Diabadikan sebagai motif resmi lambang daerah Kota Pekalongan.",
      "Tersusun dari lingkaran dan bintang delapan penjuru yang berulang rapat di seluruh helai kain.",
    ],
  },
  {
    id: "batik_kawung",
    rawId: "batik_kawung",
    name: "Kawung",
    fullName: "Batik Kawung",
    region: "D.I. Yogyakarta & Surakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Empat kelopak buah aren yang menyentuh titik poros melambangkan Sedulur Papat Lima Pancer: empat arah mata angin yang bermuara pada satu pusat kesadaran batin. Mengajarkan kejujuran, keadilan, dan pengendalian diri.",
    usage: "Busana keraton abdi dalem, pertemuan dinas resmi, wisuda sarjana, dan busana kemeja kerja pria.",
    visualTraits: "Empat elips lonjong bersilang menyentuh lingkaran poros pusat, menyerupai irisan buah kolang-kaling yang tersusun diagonal teratur.",
    image: "/images/motifs/batik_kawung.webp",
    variants: [
      {
        name: "Kawung Picis Tradisional",
        image: "/images/motifs/batik_kawung_var1.webp",
        description: "Kelopak bulat kecil sebesar koin picis dengan isen titik cecek rapi.",
      },
      {
        name: "Kawung Sen & Beton",
        image: "/images/motifs/batik_kawung_var2.webp",
        description: "Bentuk kelopak lebih besar lonjong menyerupai biji buah nangka tua.",
      },
    ],
    hints: [
      "Bentuknya terinspirasi dari irisan buah tanaman aren atau kolang-kaling di pedesaan Jawa.",
      "Termasuk salah satu motif tertua yang tercatat dalam relief candi Jawa sejak abad ke-13.",
      "Mencerminkan konsep filosofi Jawa Sedulur Papat Lima Pancer.",
      "Terdiri dari empat kelopak lonjong bersilang rapi mengelilingi satu titik tengah.",
    ],
  },
  {
    id: "batik_liong",
    rawId: "batik_liong",
    name: "Liong",
    fullName: "Batik Liong",
    region: "Lasem (Rembang)",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Pesisiran",
    philosophy:
      "Makhluk naga sakral (Liong) melambangkan keberuntungan, kekuasaan alam, dan perlindungan dari marabahaya. Memperlihatkan keterbukaan kota Lasem sebagai tempat bertemunya tradisi canting Jawa dengan budaya Tionghoa.",
    usage: "Perayaan Tahun Baru Imlek, resepsi pernikahan peranakan Tionghoa-Jawa, dan festival budaya pesisir utara.",
    visualTraits: "Sosok naga berkumis panjang dan bertanduk yang meliuk gagah, diapit burung phoenix (burung hong), gumpalan awan, dan warna merah getih pitik khas Lasem.",
    image: "/images/motifs/batik_liong.webp",
    variants: [
      {
        name: "Liong Naga Merah Getih Pitik",
        image: "/images/motifs/batik_liong_var1.webp",
        description: "Pewarnaan akar mengkudu merah darah ayam khas rumah pembatik Lasem.",
      },
      {
        name: "Liong & Burung Hong Berawan",
        image: "/images/motifs/batik_liong_var2.webp",
        description: "Naga langit yang meliuk berpasangan dengan burung phoenix di antara mega.",
      },
    ],
    hints: [
      "Lahir dari kota pesisir utara Rembang yang dijuluki Tiongkok Kecil karena akulturasi tuanya.",
      "Terkenal dengan racikan pewarna merah alami getih pitik dari akar tanaman mengkudu.",
      "Kerap diproduksi sebagai bagian dari kain batik legendaris Tiga Negeri.",
      "Menggambarkan tubuh naga bersisik tajam yang meliuk bebas di antara kepulan awan dan burung hong.",
    ],
  },
  {
    id: "batik_mega_mendung",
    rawId: "batik_mega_mendung",
    name: "Mega Mendung",
    fullName: "Batik Mega Mendung",
    region: "Cirebon",
    province: "Jawa Barat",
    island: "Jawa",
    category: "Batik Pesisiran",
    philosophy:
      "Gumpalan awan mendung pembawa hujan menyimbolkan kepala dingin, kesabaran jiwa, dan kemampuan meredam emosi saat menghadapi persoalan, seperti awan sejuk yang membasahi bumi panas.",
    usage: "Busana kerja kantor pria dan wanita, kemeja santai etnik, syal, serta busana panggung diplomasi budaya.",
    visualTraits: "Lapisan awan horizontal berundak dengan garis segitiga lancip, menampilkan gradasi 5 hingga 7 tingkat warna dari biru pekat ke putih atau merah menyala.",
    image: "/images/motifs/batik_mega_mendung.webp",
    variants: [
      {
        name: "Gradasi Biru Klasik Cirebon",
        image: "/images/motifs/batik_mega_mendung_var1.webp",
        description: "Gradasi tujuh undak warna biru tua ke putih terang khas perajin Trusmi.",
      },
      {
        name: "Mega Mendung Merah Mas Pesisir",
        image: "/images/motifs/batik_mega_mendung_var2.webp",
        description: "Varian warna jingga merah marun yang merefleksikan kehangatan laut Cirebon.",
      },
    ],
    hints: [
      "Menggambarkan bentuk awan tebal pembawa hujan yang menyejukkan tanah kemarau.",
      "Lahir dari sejarah pernikahan Sunan Gunung Jati dengan Putri Ong Tien asal Tiongkok.",
      "Merupakan lambang budaya paling terkenal dari sentra batik Trusmi di Cirebon, Jawa Barat.",
      "Memiliki ciri khas garis awan meliuk lancip segitiga dengan gradasi warna berulang hingga tujuh lapis.",
    ],
  },
  {
    id: "batik_parang",
    rawId: "batik_parang",
    name: "Parang",
    fullName: "Batik Parang",
    region: "Surakarta & D.I. Yogyakarta",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Larangan",
    philosophy:
      "Deretan ombak laut selatan yang tak pernah surut memecah karang terjal. Melambangkan semangat pantang menyerah, keteguhan watak ksatria, dan kepemimpinan berwibawa yang tidak boleh terputus.",
    usage: "Pakaian wajib raja, pangeran, dan wisudawan kehormatan dalam upacara resmi kenegaraan serta upacara wisuda.",
    visualTraits: "Larik-larik diagonal miring bersudut 45 derajat menyerupai susunan huruf S berkait tanpa jeda, diselingi ornamen taji mlinjon tajam di sela-selanya.",
    image: "/images/motifs/batik_parang.webp",
    variants: [
      {
        name: "Parang Rusak Barong Keraton",
        image: "/images/motifs/batik_parang_var1.webp",
        description: "Ukuran larik diagonal di atas 8 cm yang dahulu khusus dikenakan oleh raja.",
      },
      {
        name: "Parang Klitik Alus",
        image: "/images/motifs/batik_parang_var2.webp",
        description: "Susunan larik lebih kecil dan halus, biasa dikenakan para putri keraton.",
      },
    ],
    hints: [
      "Konon diciptakan oleh Sultan Agung Hanyakrakusuma saat mengamati ombak di tebing Laut Selatan.",
      "Termasuk kelompok Batik Larangan yang dahulu tidak boleh dipakai sembarang orang di luar keraton.",
      "Pusaka budaya utama dari kedua pecahan kerajaan Mataram: Surakarta dan Yogyakarta.",
      "Tersusun dari garis miring diagonal teratur menyerupai deretan huruf S bersambungan.",
    ],
  },
  {
    id: "batik_sekarjagad",
    rawId: "batik_sekarjagad",
    name: "Sekar Jagad",
    fullName: "Batik Sekar Jagad",
    region: "D.I. Yogyakarta & Surakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Sekar bermakna bunga, jagad bermakna alam semesta. Menggambarkan keindahan keberagaman suku, bahasa, dan budaya dunia yang dapat hidup berdampingan secara damai dalam satu kesatuan.",
    usage: "Busana terhormat untuk pembicara seminar kebudayaan, pejabat negara, dan tamu undangan upacara adat.",
    visualTraits: "Bidang-bidang berlekuk tak beraturan menyerupai peta kepulauan dunia, di mana setiap bidang diisi cuplikan motif batik berbeda seperti Kawung, Truntum, dan ceplok.",
    image: "/images/motifs/batik_sekarjagad.webp",
    variants: [
      {
        name: "Sekar Jagad Peta Kepulauan",
        image: "/images/motifs/batik_sekarjagad_var1.webp",
        description: "Batas bidang bergelombang memuat cuplikan motif isen-isen yang berbeda tiap pulau.",
      },
      {
        name: "Sekar Jagad Sogan Mataram",
        image: "/images/motifs/batik_sekarjagad_var2.webp",
        description: "Pewarnaan cokelat soga tanah dengan garis pembatas kontur luwes.",
      },
    ],
    hints: [
      "Namanya secara harfiah berarti bunga alam semesta, lambang keindahan aneka ciptaan.",
      "Menuntut keterampilan canting tinggi karena harus menggabungkan puluhan ornamen berbeda di satu helai kain.",
      "Sangat dihormati di lingkungan keraton Surakarta Hadiningrat dan Yogyakarta.",
      "Menyerupai gambar peta kepulauan berlekuk, di mana masing-masing bidang memuat motif berbeda.",
    ],
  },
  {
    id: "batik_sidoluhur",
    rawId: "batik_sidoluhur",
    name: "Sido Luhur",
    fullName: "Batik Sido Luhur",
    region: "Surakarta & D.I. Yogyakarta",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Sido berarti menjadi terus menerus, luhur bermakna berbudi pekerti mulia dan berderajat terhormat. Doa agar pemakainya mencapai keluhuran tingkah laku dan menjadi teladan bagi masyarakat sekitar.",
    usage: "Dikenakan calon pengantin putri pada malam midodareni dan upacara peringatan leluhur.",
    visualTraits: "Pola kotak ceplok simetris yang memuat ornamen tahta atau bale, sayap burung garuda bersayap satu (lar), serta tanaman pohon hayat.",
    image: "/images/motifs/batik_sidoluhur.webp",
    variants: [
      {
        name: "Ceplok Tahta & Pohon Hayat",
        image: "/images/motifs/batik_sidoluhur_var1.webp",
        description: "Kotak ceplok berisi singgasana kemuliaan berlatar cokelat soga khas Surakarta.",
      },
      {
        name: "Sido Luhur Lar Garuda",
        image: "/images/motifs/batik_sidoluhur_var2.webp",
        description: "Sayap burung garuda berselingan dengan ornamen tumbuhan semesta.",
      },
    ],
    hints: [
      "Bagian dari rumpun motif berawalan Sido yang bermakna harapan agar doa terkabul selamanya.",
      "Luhur dalam bahasa Jawa berarti berbudi pekerti mulia dan berderajat tinggi di mata sesama.",
      "Dibuat dengan ketelitian tinggi oleh para empu batik di Surakarta dan Yogyakarta.",
      "Tersusun dari kotak ceplok berulang yang memuat gambar tahta tahtaan dan sayap garuda.",
    ],
  },
  {
    id: "batik_sidomukti",
    rawId: "batik_sidomukti",
    name: "Sido Mukti",
    fullName: "Batik Sido Mukti",
    region: "Surakarta (Solo)",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Mukti bermakna kemakmuran, kecukupan pangan sandang, dan kebahagiaan batin. Doa restu bagi pengantin baru agar bahtera rumah tangganya senantiasa dilimpahi rezeki dan ketenangan hidup.",
    usage: "Kain sakral wajib bagi kedua mempelai saat prosesi ijab kabul dan upacara panggih manten adat Jawa.",
    visualTraits: "Kotak-kotak ceplok geometris berlatar cokelat sogan hangat, berisi ornamen kupu-kupu yang melambangkan kebahagiaan, singgasana tahta, dan sayap garuda.",
    image: "/images/motifs/batik_sidomukti.webp",
    variants: [
      {
        name: "Sido Mukti Pengantin Jawa",
        image: "/images/motifs/batik_sidomukti_var1.webp",
        description: "Kain upacara panggih manten dengan ornamen kupu-kupu dan burung garuda.",
      },
      {
        name: "Sido Mukti Sogan Solo Alus",
        image: "/images/motifs/batik_sidomukti_var2.webp",
        description: "Pewarnaan soga kuning kecokelatan hangat dengan isen cecek rapat.",
      },
    ],
    hints: [
      "Nama belakangnya bermakna hidup makmur, berkecukupan rezeki, dan bahagia lahir batin.",
      "Kain adat paling sakral yang dikenakan pengantin Jawa saat prosesi ijab kabul dan temu manten.",
      "Sentra utamanya berada di Kraton Kasunanan Surakarta Hadiningrat (Solo).",
      "Berisi pola kotak teratur dengan ornamen kupu-kupu, tahta singgasana, dan burung garuda berlatar sogan.",
    ],
  },
  {
    id: "batik_sidomulyo",
    rawId: "batik_sidomulyo",
    name: "Sido Mulyo",
    fullName: "Batik Sido Mulyo",
    region: "D.I. Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Mulyo bermakna mulia dan tenteram. Mengandung harapan agar keluarga baru yang dibina selalu dilimpahi ketenteraman batin, kejujuran budi, serta dihindarkan dari godaan pertikaian.",
    usage: "Dikenakan oleh kedua mempelai dalam upacara perkawinan adat gaya Kasultanan Yogyakarta.",
    visualTraits: "Pola kotak ceplok berselang-seling dengan ornamen rumah adat (bale), gunung meru, dan sayap garuda di atas kain berlatar putih bersih (pethak).",
    image: "/images/motifs/batik_sidomulyo.webp",
    variants: [
      {
        name: "Sido Mulyo Latar Pethak",
        image: "/images/motifs/batik_sidomulyo_var1.webp",
        description: "Latar putih bersih (pethak) khas Yogyakarta dengan kontur hitam kecokelatan tegas.",
      },
      {
        name: "Sido Mulyo Ornamen Bale",
        image: "/images/motifs/batik_sidomulyo_var2.webp",
        description: "Ornamen rumah adat pelindung keluarga di dalam bidang ceplok geometris.",
      },
    ],
    hints: [
      "Bagian dari trilogi motif Sido yang mendoakan rumah tangga agar senantiasa mulia dan tenteram.",
      "Khas gaya Yogyakarta yang mengutamakan latar kain putih bersih (pethak) dengan garis tegas.",
      "Diciptakan dan dipelihara di lingkungan istana Kasultanan Ngayogyakarta Hadiningrat.",
      "Memiliki susunan kotak simetris berisi ornamen rumah adat, gunung meru, dan sayap garuda.",
    ],
  },
  {
    id: "batik_singa_barong",
    rawId: "batik_singa_barong",
    name: "Singa Barong",
    fullName: "Batik Singa Barong",
    region: "Cirebon",
    province: "Jawa Barat",
    island: "Jawa",
    category: "Batik Pesisiran",
    philosophy:
      "Wujud satwa mitologi yang menggabungkan belalai gajah (Hindu), sayap garuda (Islam), kepala naga (Tiongkok), dan badan singa (Barat). Menjadi simbol toleransi dan persahabatan antarbangsa di pelabuhan Cirebon.",
    usage: "Kain pusaka kehormatan yang dipajang sebagai karya seni dinding atau dikenakan pada upacara budaya agung.",
    visualTraits: "Makhluk berbadan singa bersayap garuda, berkepala naga berbelalai gajah yang menggenggam senjata trisula di belalainya.",
    image: "/images/motifs/batik_singa_barong.webp",
    variants: [
      {
        name: "Singa Barong Kereta Kasepuhan",
        image: "/images/motifs/batik_singa_barong_var1.webp",
        description: "Mengacu pada wujud kereta kencana pusaka peninggalan Panembahan Losari tahun 1549.",
      },
      {
        name: "Singa Barong Emas Pesisir",
        image: "/images/motifs/batik_singa_barong_var2.webp",
        description: "Pewarnaan latar tanah hangat dengan aksen trisula dan sayap garuda mengembang.",
      },
    ],
    hints: [
      "Bentuk satwanya terinspirasi dari kereta kencana pusaka Keraton Kasepuhan Cirebon abad ke-16.",
      "Menggabungkan empat satwa simbol empat peradaban dunia: India, Islam, Tiongkok, dan Eropa.",
      "Menjadi adikarya kedua yang paling dihormati di Cirebon selain motif Mega Mendung.",
      "Menampilkan makhluk mitologi berkepala naga, berbelalai gajah bersenjata trisula, dan bersayap burung garuda.",
    ],
  },
  {
    id: "batik_srikaton",
    rawId: "batik_srikaton",
    name: "Srikaton",
    fullName: "Batik Srikaton",
    region: "Surakarta & D.I. Yogyakarta",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Sri bermakna cahaya kemakmuran dan keanggunan, katon bermakna tampak nyata. Menggambarkan pancaran kebaikan budi, kewibawaan lahiriah, dan ketenteraman yang terpancar dari diri pemakainya.",
    usage: "Busana upacara adat keraton bagi putri bangsawan, wisuda, dan pertemuan keluarga besar.",
    visualTraits: "Sepasang burung merak anggun berhadapan di samping pohon hayat rimbun, dinaungi ornamen mahkota kemuliaan berlatar cokelat soga halus.",
    image: "/images/motifs/batik_srikaton.webp",
    variants: [
      {
        name: "Srikaton Merak Berhadapan",
        image: "/images/motifs/batik_srikaton_var1.webp",
        description: "Sepasang merak dengan ekor meliuk di samping pohon kehidupan berbuah berkah.",
      },
      {
        name: "Srikaton Sogan Alus",
        image: "/images/motifs/batik_srikaton_var2.webp",
        description: "Pewarnaan cokelat tua alami dengan ornamen mahkota bersayap di bagian atas.",
      },
    ],
    hints: [
      "Namanya bermakna pancaran cahaya kemakmuran dan kecantikan budi yang tampak nyata dari luar.",
      "Termasuk rumpun batik keraton klasik Mataram dengan goresan canting yang sangat lentur.",
      "Banyak dikenakan oleh para putri dan abdi dalem kraton dalam acara seremonial keraton.",
      "Memiliki ornamen sepasang burung merak berhadapan yang mengapit pohon kehidupan dan mahkota.",
    ],
  },
  {
    id: "batik_tribusono",
    rawId: "batik_tribusono",
    name: "Tribusono",
    fullName: "Batik Tribusono",
    region: "Surakarta (Solo)",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Tri bermakna tiga, busono bermakna busana atau keindahan budi. Mengingatkan tiga pilar moral manusia Jawa dalam bertindak: Cipta (kekuatan akal pikiran), Rasa (kepekaan hati nurani), dan Karsa (kehendak berbuat kebaikan).",
    usage: "Dikenakan dalam perhelatan adat penting, wisuda adat, dan upacara seremonial budaya Jawa.",
    visualTraits: "Paduan harmonis tiga unsur alam: ragam flora dedaunan mekar, fauna burung garuda terbang, dan ornamen air tanah yang saling menopang.",
    image: "/images/motifs/batik_tribusono.webp",
    variants: [
      {
        name: "Tribusono Tiga Pilar Budi",
        image: "/images/motifs/batik_tribusono_var1.webp",
        description: "Komposisi ornamen burung, flora melingkar, dan aliran air yang berimbang.",
      },
      {
        name: "Tribusono Sogan Surakarta",
        image: "/images/motifs/batik_tribusono_var2.webp",
        description: "Pewarnaan soga matang dengan ornamen cecek halus di sekeliling bidang motif.",
      },
    ],
    hints: [
      "Namanya terinspirasi dari tiga pilar pembentuk budi pekerti manusia: cipta, rasa, dan karsa.",
      "Lahir dari perenungan para empu pembatik di Kraton Surakarta Hadiningrat.",
      "Mengajarkan keselarasan antara logika pikiran, kepekaan hati, dan tindakan nyata.",
      "Menampilkan tiga kelompok ornamen alam: burung terbang, dedaunan berbunga, dan aliran air tanah.",
    ],
  },
  {
    id: "batik_truntum",
    rawId: "batik_truntum",
    name: "Truntum",
    fullName: "Batik Truntum",
    region: "Surakarta (Solo)",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Tumaruntum berarti tumbuh bersemi kembali. Diciptakan oleh Kanjeng Ratu Beruk saat memandang taburan bintang di langit malam, melambangkan cinta sejati tanpa syarat yang selalu tumbuh mekar dan tak lekang oleh waktu.",
    usage: "Busana wajib yang dikenakan oleh orang tua kedua mempelai pada hari upacara pernikahan adat Jawa.",
    visualTraits: "Bunga melati kecil berbentuk roset menyerupai taburan bintang malam di atas latar kain moro hitam pekat, diberi isen titik cecek putih halus.",
    image: "/images/motifs/batik_truntum.webp",
    variants: [
      {
        name: "Truntum Bintang Langit Malam",
        image: "/images/motifs/batik_truntum_var1.webp",
        description: "Kuntum melati kecil menyerupai bintang bertabur di atas kain hitam pekat (morodadi).",
      },
      {
        name: "Truntum Sogan Orang Tua",
        image: "/images/motifs/batik_truntum_var2.webp",
        description: "Varian soga cokelat matang yang melambangkan ketulusan doa restu orang tua pengantin.",
      },
    ],
    hints: [
      "Diciptakan oleh permaisuri Raja Pakubuwana III saat memandangi bintang malam demi merajut kembali cinta kasih.",
      "Secara bahasa bermakna tumbuh bersemi kembali tanpa henti.",
      "Wajib dikenakan oleh orang tua mempelai saat pernikahan adat Jawa sebagai lambang penuntun anak.",
      "Berisi kuntum bunga melati kecil mirip bintang malam yang tersebar merata di atas kain hitam.",
    ],
  },
  {
    id: "batik_tujuh_rupa",
    rawId: "batik_tujuh_rupa",
    name: "Tujuh Rupa",
    fullName: "Batik Tujuh Rupa",
    region: "Pekalongan",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Pesisiran",
    philosophy:
      "Tujuh unsur flora dan fauna yang berpadu serasi mencerminkan keterbukaan warga pesisir Pekalongan terhadap para pedagang dari Tiongkok, Arab, dan Eropa yang singgah di pelabuhan.",
    usage: "Busana pesta pernikahan modern, kemeja kerja kreatif, dan selendang peragaan busana etnik.",
    visualTraits: "Tujuh ragam hias tumbuhan dan binatang (kupu-kupu, burung, daun pakis, kuncup bunga seruni) yang disusun dalam gradasi warna cerah semarak.",
    image: "/images/motifs/batik_tujuh_rupa.webp",
    variants: [
      {
        name: "Tujuh Rupa Pesisir Pekalongan",
        image: "/images/motifs/batik_tujuh_rupa_var1.webp",
        description: "Paduan tujuh ragam hias hayati dengan warna ungu, merah muda, dan toska cerah.",
      },
      {
        name: "Tujuh Rupa Flora Semarak",
        image: "/images/motifs/batik_tujuh_rupa_var2.webp",
        description: "Kupu-kupu dan ranting bunga mekar yang mengisi seluruh bidang kain tanpa batas kaku.",
      },
    ],
    hints: [
      "Menggabungkan tujuh ornamen makhluk hidup berbeda dalam satu bidang kain yang sama.",
      "Lahir dari percampuran budaya saudagar lintas benua di kota pelabuhan Pekalongan.",
      "Tergolong kelompok batik pesisiran yang sangat dinamis dan berani bermain aneka warna cerah.",
      "Menampilkan kupu-kupu, burung, bunga mekar, dan dedaunan yang berpadu bebas dan semarak.",
    ],
  },
  {
    id: "batik_wahyu_tumurun",
    rawId: "batik_wahyu_tumurun",
    name: "Wahyu Tumurun",
    fullName: "Batik Wahyu Tumurun",
    region: "D.I. Yogyakarta & Surakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Wahyu berarti petunjuk dan anugerah Tuhan, tumurun berarti turun menghampiri. Memuat doa pengharapan agar pemakainya dikaruniai petunjuk hidup, kemudahan dalam menuntut ilmu, serta masa depan yang terang.",
    usage: "Dikenakan saat wisuda perguruan tinggi, pelantikan jabatan pengabdian, dan doa permohonan restu keluarga.",
    visualTraits: "Pola mahkota terbang bersayap (kanthil) yang dinaungi sepasang burung garuda atau merak berhadapan, serta ornamen pohon hayat di sela-selanya.",
    image: "/images/motifs/batik_wahyu_tumurun.webp",
    variants: [
      {
        name: "Wahyu Tumurun Mahkota Kanthil",
        image: "/images/motifs/batik_wahyu_tumurun_var1.webp",
        description: "Mahkota terbang diapit sepasang burung garuda penjemput anugerah masa depan.",
      },
      {
        name: "Wahyu Tumurun Sogan Alus",
        image: "/images/motifs/batik_wahyu_tumurun_var2.webp",
        description: "Babaran cokelat soga keraton dengan garis ornamen pohon hayat menjulang.",
      },
    ],
    hints: [
      "Namanya bermakna turunnya wahyu atau petunjuk anugerah dari Sang Pencipta.",
      "Kerap dipilih sebagai busana upacara kelulusan wisuda dan upacara pelantikan jabatan penting.",
      "Populer di kedua pusat kebudayaan Jawa: Yogyakarta dan Surakarta.",
      "Memiliki ornamen mahkota bersayap (kanthil) yang diapit sepasang burung garuda berhadapan.",
    ],
  },
  {
    id: "batik_wirasat",
    rawId: "batik_wirasat",
    name: "Wirasat",
    fullName: "Batik Wirasat",
    region: "Surakarta & D.I. Yogyakarta",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Wirasat bermakna firasat atau petuah nasihat orang tua kepada anak-anaknya. Mengingatkan agar anak selalu menempuh jalan kebajikan, menjaga nama baik keluarga, dan menjaga kerukunan hidup berpasangan.",
    usage: "Dikenakan oleh ibu kedua mempelai pada saat malam midodareni dan prosesi ijab kabul.",
    visualTraits: "Paduan beberapa motif ceplok keraton seperti Truntum, Sido Mukti, dan ceplok bintang yang disusun berselang-seling dalam bidang kotak simetris rapi.",
    image: "/images/motifs/batik_wirasat.webp",
    variants: [
      {
        name: "Wirasat Ceplok Paduan",
        image: "/images/motifs/batik_wirasat_var1.webp",
        description: "Gabungan motif Truntum bintang dan Sido Mukti dalam kotak ceplok berselang.",
      },
      {
        name: "Wirasat Nasihat Ibu",
        image: "/images/motifs/batik_wirasat_var2.webp",
        description: "Pewarnaan soga cokelat hangat yang melambangkan kelembutan nasihat orang tua.",
      },
    ],
    hints: [
      "Namanya bermakna firasat atau petuah nasihat bijak orang tua kepada generasi penerus.",
      "Busana kehormatan yang sering dipakai oleh ibu pengantin saat malam midodareni adat Jawa.",
      "Berasal dari lingkungan keraton Surakarta dan Yogyakarta.",
      "Menggabungkan unsur motif Truntum bintang dan Sido Mukti di dalam kotak-kotak teratur.",
    ],
  },
];

// Helper to look up a motif by any identifier
export function getBatikMotifById(id: string): BatikMotif | undefined {
  const cleanId = id.toLowerCase().trim();
  return BATIK_DATASET_20.find(
    (m) =>
      m.id.toLowerCase() === cleanId ||
      m.rawId.toLowerCase() === cleanId ||
      m.name.toLowerCase() === cleanId ||
      m.fullName.toLowerCase() === cleanId
  );
}

export const ALL_20_MOTIF_NAMES = BATIK_DATASET_20.map((m) => m.name);
