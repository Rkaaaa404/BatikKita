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
  image: string;
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
      "Melambangkan keterbukaan, keramahan budi, dan kegembiraan masyarakat Betawi yang majemuk serta selalu menjaga keharmonisan budaya.",
    usage: "Sangat pantas dikenakan untuk busana pesta adat Abang None, perayaan hari besar kota Jakarta, dan resepsi budaya.",
    visualTraits: "Warna cerah menyala seperti oranye, merah, dan kuning dengan ornamen ikonik Ondel-ondel, pucuk rebung, atau kembang kelapa.",
    image: "/images/batik-mega-mendung.jpg",
    hints: [
      "Motif ini lahir dari kebudayaan suku pesisir ibu kota yang terkenal dengan keterbukaan dan keramahan warganya.",
      "Termasuk rumpun batik Pesisiran dengan ciri khas warna riang gembira dan kontras menyala.",
      "Erat kaitannya dengan sentra batik di Jakarta seperti Setu Babakan dan Palmerah.",
      "Menampilkan ornamen ikonik khas seperti Ondel-ondel, Monas, pucuk rebung, dan pohon Rasamala.",
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
      "Bokor bermakna wadah sajen sesaji, kencono berarti emas murni. Melambangkan wadah berkah kebaikan, kewibawaan spiritual, dan kemurnian derajat kepemimpinan.",
    usage: "Dikenakan dalam upacara adat sakral keraton dan pertemuan resmi para sesepuh bangsawan.",
    visualTraits: "Pola belah ketupat atau ceplok geometri berulang dengan ornamen mangkuk berhias sulur dedaunan melingkar.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Nama motif ini terinspirasi dari wadah logam mulia tempat penyimpanan sesaji dan berkah di istana raja.",
      "Termasuk rumpun batik Keraton Jawa Mataram dengan struktur geometri ceplok belah ketupat teratur.",
      "Lahir dari kehalusan tradisi seni batik Kraton Ngayogyakarta dan Surakarta Hadiningrat.",
      "Memiliki ciri khas bidang belah ketupat berulang yang melingkungi motif wadah emas dan sulur tanaman merambat.",
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
      "Berasal dari kata Belanda boeket (rangkaian bunga). Melambangkan keindahan yang mekar, keanggunan wanita, dan keharmonisan akulturasi budaya Eropa dengan seni membatik Jawa.",
    usage: "Sangat digemari untuk busana kebaya pesta, wisuda, perhelatan pernikahan, dan busana santai elegan.",
    visualTraits: "Rangkaian karangan bunga mawar, tulip, atau seruni dengan kehadiran burung merak dan kupu-kupu berlatar warna pastel cerah.",
    image: "/images/batik-mega-mendung.jpg",
    hints: [
      "Nama motif ini berasal dari kata serapan bahasa Belanda yang berarti rangkaian bunga indah nan mekar.",
      "Termasuk rumpun batik Pesisiran atau Batik Belanda yang berkembang pesat pada era kolonial abad ke-19.",
      "Merupakan adikarya kebanggaan para pembatik peranakan di kota pesisir Pekalongan, Jawa Tengah.",
      "Ditandai dengan gambar karangan bunga besar (buket) yang ditemani burung merak, kupu-kupu, dan latar warna cerah lembut.",
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
      "Pohon Batang Garing melambangkan hubungan vertikal manusia dengan Sang Pencipta serta hubungan horizontal dengan alam semesta dan sesama makhluk.",
    usage: "Dikenakan dalam upacara adat Tiwah, festival budaya Isen Mulang, serta seragam resmi kenegaraan Kalimantan.",
    visualTraits: "Lengkungan sulur khas ukiran Dayak, motif burung enggang gading, tameng telawang, dan pohon kehidupan Batang Garing.",
    image: "/images/batik-parang-rusak.jpg",
    hints: [
      "Motif ini lahir dari kearifan suku pedalaman pulau terbesar di Nusantara yang kaya akan hutan belantara.",
      "Termasuk rumpun Batik Nusantara Kontemporer yang memadukan teknik canting dengan seni ukir tradisional.",
      "Berasal dari sentra kebudayaan suku Dayak di Kalimantan Tengah dan Kalimantan Timur.",
      "Menampilkan ornamen Batang Garing (Pohon Kehidupan), burung enggang gading, dan liukan sulur tameng telawang.",
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
      "Simbol keteraturan kosmos alam semesta dan keharmonisan religi. Pola delapan arah melambangkan penjuru mata angin pembawa berkah Ilahi.",
    usage: "Digunakan dalam upacara adat sedekah laut, perayaan keagamaan, serta busana formal kaum pria dan wanita.",
    visualTraits: "Pola geometri simetris delapan arah (bintang/roset) tanpa gambar makhluk bernyawa, dipengaruhi kain sutra patola Gujarat.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Motif ini lahir dari akulturasi saudagar muslim Timur Tengah dan Gujarat di kota pelabuhan pesisir Jawa.",
      "Termasuk rumpun batik Pesisiran geometris yang tidak menggambarkan makhluk hidup sesuai kaidah religi.",
      "Menjadi motif legendaris dan lambang resmi kota batik Pekalongan, Jawa Tengah.",
      "Menampilkan pola lingkaran dan bintang delapan penjuru simetris yang terinspirasi dari kain tenun patola India.",
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
      "Empat kelopak buah aren melambangkan Sedulur Papat Lima Pancer, kesucian hati nurani, keadilan tanpa pandang bulu, dan pengendalian diri.",
    usage: "Sangat luwes dipakai untuk upacara keraton, rapat dinas kenegaraan, hingga busana kerja modern.",
    visualTraits: "Empat elips lonjong bersilang menyentuh lingkaran titik pusat, menyerupai irisan buah kolang-kaling.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Motif kuno ini terinspirasi dari buah tanaman aren di pedesaan Jawa dan melambangkan kemurnian niat.",
      "Termasuk rumpun batik Keraton tertua yang dahulu tergolong kelompok batik larangan para bangsawan.",
      "Erat kaitannya dengan filosofi hidup masyarakat Mataram di Yogyakarta dan Surakarta.",
      "Berbentuk empat kelopak lonjong bersilang mengelilingi satu titik pusat, menyerupai potongan buah kolang-kaling.",
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
      "Naga Liong melambangkan kekuatan spiritual agung, pengayoman, keberuntungan, dan penolak bala dari mara bahaya.",
    usage: "Dipakai saat perayaan Imlek, pernikahan peranakan Tionghoa-Jawa, serta festival budaya pesisir.",
    visualTraits: "Sosok naga bertanduk meliuk gagah di antara mega mendung dan burung hong, dengan warna merah getih pitik khas Lasem.",
    image: "/images/batik-mega-mendung.jpg",
    hints: [
      "Motif ini lahir dari akulturasi mendalam etnis Tionghoa dan perajin lokal di kota Tiongkok Kecil di pesisir utara Jawa.",
      "Termasuk rumpun batik Tiga Negeri atau Pesisiran Lasem yang sarat nilai historis.",
      "Sentra utamanya berada di kecamatan Lasem, kabupaten Rembang, Jawa Tengah.",
      "Menampilkan wujud naga perkasa (Liong) yang meliuk anggun ditemani awan dan burung phoenix (burung hong).",
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
      "Awan pembawa hujan melambangkan kesabaran hati, ketenangan jiwa, dan kepala dingin laksana awan sejuk penyejuk bumi.",
    usage: "Sangat luwes untuk busana kerja kantor, busana santai etnik, dan perhelatan seni internasional.",
    visualTraits: "Lapisan awan berulang dengan gradasi 5 sampai 7 undak warna biru tua ke putih atau merah dengan garis lengkung lancip.",
    image: "/images/batik-mega-mendung.jpg",
    hints: [
      "Terinspirasi dari fenomena awan di langit yang membawa berkah hujan dan kesuburan bagi bumi Nusantara.",
      "Termasuk rumpun batik Pesisiran Cirebon yang dipengaruhi oleh pernikahan Sunan Gunung Jati dengan Putri Ong Tien.",
      "Merupakan ikon budaya paling terkenal dari kota pelabuhan Cirebon, Jawa Barat.",
      "Berbentuk gumpalan awan berlapis-lapis dengan gradasi warna berulang dan lengkungan garis lancip segitiga.",
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
      "Garis diagonal ombak samudra tak terputus melambangkan semangat pantang menyerah, keteguhan watak ksatria, dan kepemimpinan berwibawa.",
    usage: "Dipakai oleh sultan, pangeran, dan pejabat negara dalam acara perhelatan sakral serta wisuda perguruan tinggi.",
    visualTraits: "Larik-larik diagonal miring menyerupai huruf S berkesinambungan yang diselingi motif ornamen mlinjon tajam.",
    image: "/images/batik-parang-rusak.jpg",
    hints: [
      "Terinspirasi oleh kekuatan ombak laut selatan yang tak henti-hentinya memecah karang, simbol jiwa pantang menyerah.",
      "Termasuk kelompok Batik Larangan (Awisan Ndalem) yang dahulu hanya boleh dikenakan raja dan keturunannya.",
      "Merupakan pusaka identitas utama dari Kraton Mataram di Yogyakarta dan Surakarta.",
      "Memiliki ciri khas garis diagonal miring berulang menyerupai deretan huruf S yang saling berkait tanpa jeda.",
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
      "Sekar berarti bunga, jagad berarti alam semesta. Melambangkan keindahan keragaman suku dan budaya di dunia yang menyatu dalam keharmonisan.",
    usage: "Busana terhormat yang sering dipilih oleh tokoh masyarakat, intelektual, dan tamu agung dalam acara budaya.",
    visualTraits: "Peta bidang berlekuk-lekuk menyerupai pulau dunia, di mana setiap bidang memuat cuplikan motif batik berbeda.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Nama motif ini secara harfiah bermakna bunga dunia, merayakan keindahan keanekaragaman ciptaan Tuhan.",
      "Termasuk rumpun batik Keraton yang menuntut keahlian tertinggi karena memadukan banyak motif sekaligus.",
      "Sangat masyhur di kedua pusat kebudayaan Jawa: Yogyakarta dan Surakarta.",
      "Ditandai dengan pola tak beraturan menyerupai pulau-pulau benua, di mana setiap bidang diisi motif batik yang berbeda.",
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
      "Sido berarti menjadi terus menerus, luhur bermakna berbudi pekerti mulia dan berderajat terhormat. Doa agar pemakainya mencapai keluhuran budi dan martabat mulia.",
    usage: "Dikenakan oleh pengantin putri saat upacara midodareni serta perhelatan penghormatan leluhur.",
    visualTraits: "Pola ceplok kotak simetris berisi ornamen tahta, candi, pohon hayat, dan garuda bersayap satu.",
    image: "/images/batik-parang-rusak.jpg",
    hints: [
      "Bagian dari trilogi motif Sido yang mendoakan pemakainya mencapai derajat kemuliaan dan keluhuran budi pekerti.",
      "Termasuk rumpun batik Keraton yang sarat muatan doa spiritual mendalam bagi kehidupan bermasyarakat.",
      "Berasal dari sentra pembatikan keraton di Surakarta dan Yogyakarta.",
      "Menampilkan bidang ceplok geometris rapi berisi ornamen simbolik tahta kedudukan, pohon hayat, dan sayap garuda.",
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
      "Mukti melambangkan kemakmuran, kecukupan rezeki, dan kebahagiaan sejati lahir batin. Harapan agar pemakainya senantiasa hidup sejahtera.",
    usage: "Busana wajib bagi pasangan pengantin Jawa saat prosesi ijab kabul dan panggih manten.",
    visualTraits: "Ceplok kotak berulang dengan ornamen kupu-kupu, ornamen garuda, dan pohon hayat dengan latar sogan kekuningan hangat.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Nama motif ini secara harfiah berarti terus-menerus dalam kemuliaan dan kemakmuran, harapan bagi pasangan pengantin.",
      "Termasuk rumpun batik Keraton yang menjadi busana adat paling sakral dalam upacara pernikahan adat Jawa.",
      "Lahir dari kehalusan tradisi seni batik Kraton Kasunanan Surakarta Hadiningrat.",
      "Menampilkan pola kotak-kotak berulang yang diisi ornamen kupu-kupu, burung garuda, dan pohon hayat berlatar sogan.",
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
      "Mulyo berarti mulia dan tenteram. Melambangkan doa agar rumah tangga senantiasa dilimpahi ketentraman jiwa dan dijauhkan dari marabahaya.",
    usage: "Dikenakan oleh kedua mempelai dalam upacara perkawinan adat gaya Yogyakarta.",
    visualTraits: "Pola kotak ceplok berselang-seling dengan ornamen rumah adat, meru, dan garuda berlatar putih bersih (pethak).",
    image: "/images/batik-parang-rusak.jpg",
    hints: [
      "Salah satu dari keluarga motif Sido yang mendoakan keluarga baru senantiasa dilimpahi kemuliaan dan ketenteraman hidup.",
      "Termasuk rumpun batik Keraton Yogyakarta yang terkenal dengan warna latar putih bersih (pethak) yang anggun.",
      "Diciptakan dan dipelihara di lingkungan istana Kesultanan Ngayogyakarta Hadiningrat.",
      "Memiliki susunan ceplok simetris berisi ornamen rumah adat (bale), gunung meru, dan sayap burung garuda.",
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
      "Gabungan gajah, garuda, naga, dan singa melambangkan persahabatan empat kebudayaan dunia (Hindu, Islam, Tiongkok, Barat) serta kepemimpinan yang adil dan toleran.",
    usage: "Kain pusaka kehormatan yang sering dipajang sebagai karya seni luhur atau dikenakan dalam resepsi agung.",
    visualTraits: "Wujud satwa mitologi berkepala naga, berbelalai gajah memegang senjata trisula, bersayap garuda, dan berbadan singa.",
    image: "/images/batik-mega-mendung.jpg",
    hints: [
      "Terinspirasi dari kereta kencana pusaka keraton Kasepuhan yang menggabungkan empat unsur kebudayaan besar dunia.",
      "Termasuk rumpun batik Keraton Cirebon yang sarat dengan simbol persaudaraan antarbangsa dan toleransi.",
      "Merupakan mahakarya kebanggaan masyarakat Cirebon di samping motif Mega Mendung.",
      "Menampilkan wujud satwa mitologi berkepala naga, berbelalai gajah bersenjata trisula, dan bersayap garuda gagah perkasa.",
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
      "Sri berarti cahaya keanggunan dan kemakmuran, katon berarti tampak terlihat. Melambangkan pancaran aura kemuliaan, kecantikan budi, dan keteduhan.",
    usage: "Busana terhormat untuk upacara khidmat kraton, wisuda, dan pertemuan keluarga besar.",
    visualTraits: "Ornamen pohon hayat diapit sepasang burung merak yang anggun, dinaungi mahkota bercahaya kemuliaan.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Nama motif ini bermakna cahaya kemakmuran yang tampak nyata memancar dari dalam diri pemakainya.",
      "Termasuk rumpun batik Keraton klasik dengan tata warna sogan dan kontur ornamen yang sangat luwes lembut.",
      "Populer di lingkungan keraton Surakarta dan Yogyakarta sebagai busana para putri bangsawan.",
      "Memiliki ornamen pohon hayat diapit sepasang burung anggun dan hiasan mahkota kemuliaan.",
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
      "Tri bermakna tiga, busono bermakna busana atau keindahan. Melambangkan tiga pilar keluhuran budi manusia Jawa: Cipta (pikiran), Rasa (hati), dan Karsa (kehendak).",
    usage: "Dikenakan dalam perhelatan adat penting, wisuda adat, dan acara seremonial budaya.",
    visualTraits: "Tiga kelompok ornamen utama (ragam flora bunga, fauna burung, dan ornamen air tanah) yang berpadu serasi harmonis.",
    image: "/images/batik-parang-rusak.jpg",
    hints: [
      "Nama motif ini terinspirasi dari filosofi tiga pilar keindahan budi pekerti manusia: cipta, rasa, dan karsa.",
      "Termasuk rumpun batik Keraton Surakarta yang mengutamakan keseimbangan estetika dan filosofi moral.",
      "Diciptakan oleh empu batik di lingkungan Kasunanan Surakarta Hadiningrat.",
      "Menampilkan komposisi harmonis tiga unsur alam: ragam hias flora berbunga, burung garuda, dan aliran air tanah.",
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
      "Tujuh ragam tumbuhan dan hewan mencerminkan keharmonisan akulturasi budaya lokal dengan pedagang Tiongkok, Arab, dan Eropa di pesisir utara.",
    usage: "Busana pesta, pertemuan kasual formal, dan festival seni nusantara.",
    visualTraits: "Tujuh jenis ornamen flora dan fauna (kupu-kupu, burung, daun, bunga) yang dipadu dalam warna cerah semarak.",
    image: "/images/batik-mega-mendung.jpg",
    hints: [
      "Motif ini terkenal karena memadukan tujuh unsur kehidupan flora dan fauna dalam satu helai kain mori yang semarak.",
      "Termasuk rumpun batik Pesisiran khas kota Pekalongan yang sangat dinamis dan kaya warna.",
      "Lahir dari percampuran budaya leluhur Jawa dengan saudagar lintas benua di pesisir utara Jawa Tengah.",
      "Menampilkan tujuh ornamen berbeda seperti kupu-kupu, burung, kuncup bunga, dan dedaunan yang disusun artistik cerah.",
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
      "Tumaruntum bermakna tumbuh bersemi kembali. Lambang cinta abadi tanpa syarat yang tak lekang oleh waktu, doa restu tulus orang tua kepada anak tercinta.",
    usage: "Busana wajib yang dikenakan orang tua pengantin saat prosesi pernikahan adat Jawa.",
    visualTraits: "Bunga melati kecil menyerupai taburan bintang malam berlatar gelap hitam pekat (morodadi) dengan isen cecek rapi.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Terinspirasi dari kisah cinta permaisuri raja yang mekar kembali setelah memandang gemerlap bintang di langit malam.",
      "Diciptakan oleh Kanjeng Ratu Beruk di lingkungan Kraton Kasunanan Surakarta pada abad ke-18.",
      "Sering dikenakan orang tua kedua mempelai saat upacara pernikahan sebagai doa cinta kasih abadi.",
      "Memiliki ornamen bunga melati kecil atau bintang berkerlip yang tersebar merata di atas latar kain hitam pekat.",
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
      "Wahyu berarti berkah dan petunjuk Ilahi, tumurun berarti turun. Doa pengharapan agar pemakainya senantiasa dilimpahi berkah keluhuran derajat, kemuliaan hidup, dan petunjuk Tuhan.",
    usage: "Dikenakan saat upacara wisuda, pelantikan jabatan, dan doa permohonan restu masa depan.",
    visualTraits: "Pola mahkota terbang bersayap (kanthil) dinaungi sepasang burung garuda atau merak berhadapan, serta ornamen pohon hayat.",
    image: "/images/batik-parang-rusak.jpg",
    hints: [
      "Nama motif ini bermakna turunnya wahyu atau petunjuk berkah dari Sang Pencipta bagi hamba-Nya yang tekun.",
      "Termasuk kelompok batik Keraton Jawa klasik yang sarat permohonan kemuliaan kedudukan dan masa depan cerah.",
      "Banyak diproduksi dengan ketelitian tinggi di sentra batik Yogyakarta dan Surakarta.",
      "Memiliki ciri khas ornamen mahkota terbang (kanthil) diapit sepasang burung garuda berhadapan dan pohon hayat.",
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
      "Wirasat berarti firasat atau nasihat luhur orang tua kepada anak-anaknya agar selalu menempuh jalan kebajikan dan keharmonisan hidup berumah tangga.",
    usage: "Dikenakan oleh para ibu pengantin saat malam midodareni dan ijab kabul.",
    visualTraits: "Gabungan beberapa motif keraton seperti Truntum, Sido Mukti, dan ceplok bintang dalam bidang-bidang simetris rapi.",
    image: "/images/batik-kawung.jpg",
    hints: [
      "Nama motif ini bermakna firasat atau petuah nasihat bijak dari orang tua kepada generasi penerus.",
      "Termasuk rumpun batik Keraton Surakarta yang sering dikenakan ibu pengantin saat upacara pernikahan adat.",
      "Lahir dari kepedulian para tetua adat di lingkungan keraton Jawa Mataram.",
      "Menggabungkan elemen motif Truntum, Sido Mukti, dan ceplok bunga dalam satu bidang kain yang sangat anggun.",
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

// Helper to get all 20 motif names
export const ALL_20_MOTIF_NAMES: string[] = BATIK_DATASET_20.map((m) => m.name);
