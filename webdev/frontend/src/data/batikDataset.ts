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
      "Mencerminkan keterbukaan dan kehangatan warga Batavia dalam menyambut keberagaman etnis. Ornamen Ondel-ondel dan pucuk rebung menjadi simbol penangkal bala serta harapan agar kehidupan warga selalu berkembang lurus ke atas seperti tunas bambu muda.",
    usage: "Busana resmi festival Abang None Jakarta, seragam seremonial hari ulang tahun kota, dan busana santai pesta adat.",
    visualTraits: "Figur sepasang boneka raksasa Ondel-ondel (pria berbusana merah dan wanita berbusana kuning jingga) berhiaskan kembang kelapa di kepala, diapit lajur pinggiran flora warna-warni di atas latar kain hitam pekat.",
    image: "/images/motifs/batik_betawi.webp",
    variants: [
      {
        name: "Pucuk Rebung Tumpal Merah-Toska",
        image: "/images/motifs/batik_betawi_var1.webp",
        description: "Deretan tumpal segitiga pucuk rebung berwarna biru toska dan kuning emas di atas latar merah menyala, melambangkan pertumbuhan lurus dan penolak bala.",
      },
      {
        name: "Panorama Kampung Batavia & Rumah Kebaya",
        image: "/images/motifs/batik_betawi_var2.webp",
        description: "Lukisan narasi perkampungan Betawi berlatar merah-jingga dengan rumah adat kebaya, pohon kelapa, dan keceriaan warga pesisir.",
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
    region: "D.I. Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Bokor bermakna wadah logam sesaji, sedangkan kencono berarti emas murni. Motif pusaka Mataram ini memuat doa agar pemakainya menjadi wadah yang menampung kebajikan, rezeki halal, serta menjaga kejernihan hati dalam mengabdi.",
    usage: "Dikenakan oleh sesepuh dan keluarga bangsawan dalam upacara adat midodareni dan pertemuan seremonial kraton.",
    visualTraits: "Pola ceplok teratur berlatar cokelat soga dengan ornamen wadah bertutup bersepuh oranye keemasan, dikelilingi sulur dedaunan melengkung simetris.",
    image: "/images/motifs/batik_bokor_kencono.webp",
    variants: [
      {
        name: "Bokor Kencono Babaran Wedelan Biru-Putih",
        image: "/images/motifs/batik_bokor_kencono_var1.webp",
        description: "Pewarnaan babaran wedelan biru nila dengan aksen isen putih pethak halus di sekeliling wadah kencana.",
      },
      {
        name: "Bokor Kencono Sulur Keemasan Solo",
        image: "/images/motifs/batik_bokor_kencono_var2.webp",
        description: "Dominasi warna kuning soga keemasan dengan sulur tanaman melingkar yang anggun khas sentra Surakarta.",
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
    visualTraits: "Rangkaian karangan bunga seruni dan iris dengan sentuhan warna pastel merah muda dan ungu lilac, dipadu bidang selang-seling khas kain pesisiran.",
    image: "/images/motifs/batik_buketan.webp",
    variants: [
      {
        name: "Buket Biru Porselen Latar Pethak",
        image: "/images/motifs/batik_buketan_var1.webp",
        description: "Rangkaian bunga biru berlatar kain putih gading menyerupai keanggunan keramik porselen Tiongkok-Eropa.",
      },
      {
        name: "Buket Krisan & Kupu-kupu Latar Gelap",
        image: "/images/motifs/batik_buketan_var2.webp",
        description: "Karangan bunga krisan merah-oranye yang ditemani kupu-kupu terbang di atas latar biru malam pekat.",
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
    province: "Kalimantan Tengah & Timur",
    island: "Kalimantan",
    category: "Batik Nusantara",
    philosophy:
      "Pohon Batang Garing menggambarkan hubungan manusia dengan Sang Pencipta (Ranying Hatalla) serta keharusan menjaga kelestarian rimba raya. Tameng telawang dan sulur kelakai melambangkan perlindungan diri dan ketangguhan hidup di pedalaman Borneo.",
    usage: "Busana upacara adat Tiwah, festival budaya Isen Mulang, serta pakaian dinas resmi instansi di Kalimantan.",
    visualTraits: "Latar merah menyala berpadu dengan ornamen sulur lengkung khas ukir kayu Dayak berwarna biru elektrik dan krem keemasan, dibingkai motif tumpal runcing di bagian tepinya.",
    image: "/images/motifs/batik_dayak.webp",
    variants: [
      {
        name: "Kelakai & Tumpal Tameng Telawang Hitam",
        image: "/images/motifs/batik_dayak_var1.webp",
        description: "Sulur tanaman pakis kelakai berwarna jingga dan putih di atas latar hitam arang, dilengkapi border geometris tameng telawang.",
      },
      {
        name: "Batang Garing & Rumah Betang Rimba",
        image: "/images/motifs/batik_dayak_var2.webp",
        description: "Pohon kehidupan suci Batang Garing dan arsitektur Rumah Betang di atas latar hijau lumut gelap lambang keagungan rimba Kalimantan.",
      },
    ],
    hints: [
      "Lahir dari kearifan suku penghuni pedalaman hutan tropis terbesar di Indonesia.",
      "Memadukan teknik canting lilin dengan ragam ukir kayu khas perisai dan rumah betang.",
      "Banyak diproduksi di Palangka Raya, Pontianak, dan Balikpapan.",
      "Memuat gambar Batang Garing (Pohon Kehidupan) dan sulur ukiran melengkung berulang.",
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
      "Terinspirasi dari tenun sutra Patola asal Gujarat, India. Pola bintang delapan penjuru melambangkan keteraturan arah mata angin pembawa berkah, tanpa menggambar makhluk bernyawa sesuai anjuran syariat para saudagar muslim di pesisir utara.",
    usage: "Kain upacara sedekah laut di pesisir utara, perayaan hari besar Islam, dan busana formal pria.",
    visualTraits: "Pola lingkaran roset geometris padat dengan taburan titik-titik simetris berlatar kuning cerah, diisi warna merah menyala, hijau toska, dan biru tua khas pesisir Pekalongan.",
    image: "/images/motifs/batik_jlamprang.webp",
    variants: [
      {
        name: "Jlamprang Roset Tiga Warna Merah-Hijau-Biru",
        image: "/images/motifs/batik_jlamprang_var1.webp",
        description: "Bintang delapan kelopak di dalam lingkaran mandala modern dengan warna merah marun, hijau toska, dan biru laut berlatar putih perak.",
      },
      {
        name: "Jlamprang Geometris Hitam-Emas Klasik",
        image: "/images/motifs/batik_jlamprang_var2.webp",
        description: "Garis luar lingkaran lingkaran hitam tegas berpadu rona cokelat keemasan menyerupai tenun Patola Gujarat abad pertengahan.",
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
    region: "D.I. Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Empat kelopak buah aren yang menyentuh titik poros melambangkan Sedulur Papat Lima Pancer: empat arah mata angin yang bermuara pada satu pusat kesadaran batin. Mengajarkan kejujuran, keadilan, dan pengendalian diri lahir batin.",
    usage: "Busana keraton abdi dalem, pertemuan dinas resmi, wisuda sarjana, dan busana kemeja kerja pria.",
    visualTraits: "Irisan empat elips buah aren lonjong bersilang menyentuh lingkaran poros pusat berlatar sogan cokelat keemasan hangat, dihiasi titik isen cecek rapi di setiap sudut.",
    image: "/images/motifs/batik_kawung.webp",
    variants: [
      {
        name: "Kawung Latar Pethak / Krem Cerah",
        image: "/images/motifs/batik_kawung_var1.webp",
        description: "Kelopak elips dengan garis kontur cokelat tua kemerahan di atas latar putih gading (pethak) khas gaya Ngayogyakarta.",
      },
      {
        name: "Kawung Wedelan Latar Ireng / Hitam",
        image: "/images/motifs/batik_kawung_var2.webp",
        description: "Kontras tegas kelopak kawung putih bersinar di atas latar kain hitam kelengan (wedelan) pekat.",
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
      "Makhluk naga sakral (Liong) melambangkan keberuntungan, kekuasaan alam, dan perlindungan dari marabahaya. Memperlihatkan keterbukaan kota Lasem sebagai tempat bertemunya tradisi canting Jawa dengan kebudayaan Tionghoa peranakan.",
    usage: "Perayaan Tahun Baru Imlek, resepsi pernikahan peranakan Tionghoa-Jawa, dan festival budaya pesisir utara.",
    visualTraits: "Sosok naga langit perkasa meliuk bebas dengan sisik toska-keemasan di atas hamparan kain merah menyala getih pitik khas Lasem, ditemani kuncup bunga krisan mekar.",
    image: "/images/motifs/batik_liong.webp",
    variants: [
      {
        name: "Liong Lasem Merah Marun Pesisir",
        image: "/images/motifs/batik_liong_var1.webp",
        description: "Naga berkumis meliuk anggun di atas kain merah marun tua dengan taburan bunga seruni warna-warni yang luwes.",
      },
      {
        name: "Sunggingan Kepala Naga Latar Pethak",
        image: "/images/motifs/batik_liong_var2.webp",
        description: "Goresan canting detail pada kepala naga bertanduk dan bertaring tajam di atas latar kain mori putih bersih.",
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
    visualTraits: "Gumpalan awan mendung berundak meliuk lancip segitiga dengan gradasi tujuh lapis warna biru indigo, toska cerah, dan putih bersih yang meneduhkan jiwa khas pusaka Keraton Cirebon.",
    image: "/images/motifs/batik_mega_mendung_v2.webp",
    variants: [
      {
        name: "Mega Mendung Gradasi Royal Blue Klasik",
        image: "/images/motifs/batik_mega_mendung_var1.webp",
        description: "Pola awan mendung bergradasi tujuh lapis biru pekat dan biru langit di atas latar biru malam, melambangkan kedalaman kesabaran dan keteduhan jiwa.",
      },
      {
        name: "Mega Mendung Awan Indigo Latar Scarlet",
        image: "/images/motifs/batik_mega_mendung_var2.webp",
        description: "Liukan awan biru indigo dengan kontur putih tajam di atas latar merah marun scarlet, menampilkan akulturasi seni rupa Cirebon dan Tionghoa yang semarak.",
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
    region: "D.I. Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Larangan",
    philosophy:
      "Deretan ombak laut selatan yang tak pernah surut memecah karang terjal. Melambangkan semangat pantang menyerah, keteguhan watak ksatria, dan kepemimpinan berwibawa yang tidak boleh terputus dalam mengarungi gelombang kehidupan.",
    usage: "Pakaian wajib raja, pangeran, dan wisudawan kehormatan dalam upacara resmi kenegaraan serta upacara wisuda.",
    visualTraits: "Larik-larik diagonal miring bersudut 45 derajat menyerupai susunan huruf S berkait tajam berlatar gelap pekat, diselingi ornamen taji mlinjon putih tegas di sela-selanya.",
    image: "/images/motifs/batik_parang.webp",
    variants: [
      {
        name: "Parang Klitik Sogan Keemasan",
        image: "/images/motifs/batik_parang_var1.webp",
        description: "Susunan larik diagonal lebih rapat dan halus dengan pewarnaan kuning sogan keemasan khas sentra Surakarta Hadiningrat.",
      },
      {
        name: "Parang Latar Pethak / Putih Bersih",
        image: "/images/motifs/batik_parang_var2.webp",
        description: "Bentuk larik diagonal cokelat gelap berlatar mori putih bersih (pethak) khas gaya Ngayogyakarta yang berkarakter gagah.",
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
    region: "D.I. Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Sekar bermakna bunga, jagad bermakna alam semesta. Menggambarkan keindahan keberagaman suku, bahasa, dan budaya dunia yang dapat hidup berdampingan secara damai dalam satu kesatuan yang utuh dan serasi.",
    usage: "Busana terhormat untuk pembicara seminar kebudayaan, pejabat negara, dan tamu undangan upacara adat.",
    visualTraits: "Bidang-bidang berlekuk menyerupai peta kepulauan dunia dalam balutan cokelat sogan hangat, di mana setiap bidang diisi motif ceplok berbeda seperti Truntum, Kawung, dan lereng kembang.",
    image: "/images/motifs/batik_sekarjagad.webp",
    variants: [
      {
        name: "Sekar Jagad Latar Pethak Ngayogyakarta",
        image: "/images/motifs/batik_sekarjagad_var1.webp",
        description: "Pulau-pulau motif berlekuk di atas latar putih gading (pethak) dengan isen ceplok hitam-putih yang kontras dan berwibawa.",
      },
      {
        name: "Sekar Jagad Pesisiran Merah Terakota",
        image: "/images/motifs/batik_sekarjagad_var2.webp",
        description: "Pewarnaan merah jingga terakota yang hangat dan menyala, memuat mozaik ornamen flora fauna yang dinamis.",
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
    region: "Surakarta (Solo)",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Sido berarti menjadi terus menerus, luhur bermakna berbudi pekerti mulia dan berderajat terhormat. Doa restu agar pemakainya mencapai keluhuran budi, martabat tinggi, dan senantiasa menjadi panutan masyarakat.",
    usage: "Dikenakan calon pengantin putri pada malam midodareni dan upacara peringatan leluhur.",
    visualTraits: "Pola kotak ceplok belah ketupat berulang berlatar sogan gelap pekat, memuat ornamen singgasana tahta kemuliaan dan sayap burung garuda bersayap tunggal (lar).",
    image: "/images/motifs/batik_sidoluhur.webp",
    variants: [
      {
        name: "Ceplok Tahta Sogan Keemasan",
        image: "/images/motifs/batik_sidoluhur_var1.webp",
        description: "Bidang belah ketupat berbingkai garis sogan cokelat keemasan hangat berisi tahta singgasana di atas latar gelap.",
      },
      {
        name: "Sido Luhur Aksen Pethak Bersinar",
        image: "/images/motifs/batik_sidoluhur_var2.webp",
        description: "Pewarnaan sogan kemerahan berpadu aksen putih bersih pada sayap garuda dan tahta kemuliaan.",
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
      "Mukti bermakna kemakmuran, kecukupan pangan sandang, dan kebahagiaan batin. Doa restu bagi pengantin baru agar bahtera rumah tangganya senantiasa dilimpahi rezeki halal, kemuliaan hidup, dan ketenteraman jiwa.",
    usage: "Kain sakral wajib bagi kedua mempelai saat prosesi ijab kabul dan upacara panggih manten adat Jawa.",
    visualTraits: "Pola kotak ceplok diagonal berlatar sogan merah-cokelat Mataram, memuat ornamen kupu-kupu pembawa kabar gembira, singgasana tahta, dan sayap garuda bertabur isen cecek.",
    image: "/images/motifs/batik_sidomukti.webp",
    variants: [
      {
        name: "Sido Mukti Sogan Solo Alus Keemasan",
        image: "/images/motifs/batik_sidomukti_var1.webp",
        description: "Pewarnaan soga kuning kecokelatan keemasan hangat khas Kasunanan Surakarta dengan isen cecek sangat rapat dan halus.",
      },
      {
        name: "Sido Mukti Babaran Nila Biru (Wedelan)",
        image: "/images/motifs/batik_sidomukti_var2.webp",
        description: "Varian wedelan bernuansa biru nila lembut berlatar cerah, menampilkan ornamen kupu-kupu dan singgasana tahta pengantin.",
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
      "Mulyo bermakna mulia, terhormat, dan tenteram. Mengandung harapan agar keluarga baru yang dibina selalu dilimpahi ketenteraman batin, keluhuran budi, serta dihindarkan dari godaan pertikaian.",
    usage: "Dikenakan oleh kedua mempelai dalam upacara perkawinan adat gaya Kasultanan Yogyakarta.",
    visualTraits: "Pola kotak ceplok berulang berlatar sogan keemasan hangat, memuat ornamen rumah adat pelindung (bale), pohon hayat, dan sayap burung garuda bersayap tunggal.",
    image: "/images/motifs/batik_sidomulyo.webp",
    variants: [
      {
        name: "Sido Mulyo Latar Pethak Ngayogyakarta",
        image: "/images/motifs/batik_sidomulyo_var1.webp",
        description: "Latar mori putih bersih (pethak) khas Yogyakarta dengan kontur hitam kecokelatan tegas berhias kupu-kupu dan bale adat.",
      },
      {
        name: "Sido Mulyo Ceplok Kontras Bale & Garuda",
        image: "/images/motifs/batik_sidomulyo_var2.webp",
        description: "Garis batas belah ketupat tebal berwarna cokelat tua di atas latar putih gading dengan ornamen rumah pelindung keluarga.",
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
      "Wujud satwa mitologi agung yang menggabungkan belalai gajah (Hindu), sayap garuda (Islam), kepala naga (Tiongkok), dan badan singa (Eropa). Menjadi simbol toleransi dan persahabatan antarbangsa di Keraton Kasepuhan Cirebon.",
    usage: "Kain pusaka kehormatan yang dipajang sebagai karya seni wastra agung atau dikenakan pada upacara budaya keraton.",
    visualTraits: "Komposisi utuh Kereta Kencana Singa Barong pusaka Panembahan Losari tahun 1549, menampilkan sepasang satwa mitologi berpayung kerajaan, roda pedati kencana, kawanan burung hong di angkasa, dan batu karang wadasan di dasarnya.",
    image: "/images/motifs/batik_singa_barong_v2.webp",
    variants: [
      {
        name: "Singa Barong Tatah Berulang",
        image: "/images/motifs/batik_singa_barong_var1.webp",
        description: "Susunan lajur berulang satwa singa berkepala naga dan sayap garuda berlatar pethak dengan tumpal wadasan khas Cirebon.",
      },
      {
        name: "Detail Satwa Pusaka Singa Barong",
        image: "/images/motifs/batik_singa_barong_var2.webp",
        description: "Sorotan dekat ornamen satwa mitologi berkepala naga belalai gajah memegang trisula di bawah naungan payung kerajaan.",
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
    region: "D.I. Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Sri bermakna cahaya kemakmuran dan keanggunan, katon bermakna tampak nyata. Menggambarkan pancaran kebaikan budi, kewibawaan lahiriah, dan ketenteraman yang terpancar nyata dari diri pemakainya.",
    usage: "Busana upacara adat keraton bagi putri bangsawan, wisuda, dan pertemuan keluarga besar.",
    visualTraits: "Sepasang sayap burung merak dan mahkota keemasan yang memancarkan pendar kuning menyala, berpadu sulur daun rimbun di atas latar cokelat soga gelap pekat.",
    image: "/images/motifs/batik_srikaton.webp",
    variants: [
      {
        name: "Srikaton Babaran Wedelan Biru Malam",
        image: "/images/motifs/batik_srikaton_var1.webp",
        description: "Hamparan motif merak berulang dengan warna biru wedelan dan aksen putih pethak halus menyerupai langit malam penuh bintang.",
      },
      {
        name: "Srikaton Sogan Solo Alus Kupu-kupu & Lar",
        image: "/images/motifs/batik_srikaton_var2.webp",
        description: "Goresan sogan Solo keemasan lembut yang menampilkan ornamen kupu-kupu diapit sepasang sayap garuda dan cecek rapat.",
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
      "Tri bermakna tiga, busono bermakna busana atau keindahan budi pekerti. Mengingatkan tiga pilar moral manusia Jawa dalam bertindak: Cipta (kekuatan akal pikiran), Rasa (kepekaan hati nurani), dan Karsa (kehendak teguh berbuat kebaikan).",
    usage: "Dikenakan dalam perhelatan adat penting, wisuda adat, dan upacara seremonial budaya Jawa.",
    visualTraits: "Paduan harmonis satwa burung garuda terbang meliuk di antara dedaunan mekar dan pusaran air berlatar cokelat soga dengan semburat biru wedelan.",
    image: "/images/motifs/batik_tribusono.webp",
    variants: [
      {
        name: "Tribusono Garuda Lereng Alus",
        image: "/images/motifs/batik_tribusono_var1.webp",
        description: "Sayap burung garuda megah meliuk di atas lajur diagonal dengan isen cecek jala keemasan berlatar cokelat pekat.",
      },
      {
        name: "Tribusono Kupu-kupu & Kembang Latar Pethak",
        image: "/images/motifs/batik_tribusono_var2.webp",
        description: "Ornamen kupu-kupu dan bunga seruni anggun berlatar krem cerah dengan goresan canting yang luwes dan lembut.",
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
      "Tumaruntum berarti tumbuh bersemi kembali. Diciptakan oleh Kanjeng Ratu Kencana (Ratu Beruk) saat memandang taburan bintang di langit malam, melambangkan cinta sejati tanpa syarat yang selalu tumbuh mekar dan tak pernah padam oleh waktu.",
    usage: "Busana wajib yang dikenakan oleh orang tua kedua mempelai pada hari upacara pernikahan adat Jawa.",
    visualTraits: "Taburan kuntum bunga melati roset kecil berwarna cokelat sogan keemasan di atas latar morodadi hitam pekat, menyerupai kemilau bintang malam di angkasa.",
    image: "/images/motifs/batik_truntum.webp",
    variants: [
      {
        name: "Truntum Wedelan Biru Malam",
        image: "/images/motifs/batik_truntum_var1.webp",
        description: "Bintang melati bertabur putih-keemasan di atas babaran biru nila (indigo) pekat yang merefleksikan hamparan langit malam tempat Ratu Kencana merenung.",
      },
      {
        name: "Truntum Sogan Orang Tua Pengantin",
        image: "/images/motifs/batik_truntum_var2.webp",
        description: "Kuntum bintang melati berpadu intan belah ketupat putih dengan latar cokelat sogan hangat, busana sakral penuntun pernikahan adat Jawa.",
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
    visualTraits: "Rangkaian bunga seruni mekar dan kuncup daun anggun berhiaskan aksen biru toska dan jingga di atas latar hitam bertekstur isen cecek sulur.",
    image: "/images/motifs/batik_tujuh_rupa.webp",
    variants: [
      {
        name: "Tujuh Rupa Merak Toska & Kupu-kupu Cerah",
        image: "/images/motifs/batik_tujuh_rupa_var1.webp",
        description: "Paduan burung merak anggun bersayap toska keemasan, kupu-kupu, dan kuntum bunga mekar warna-warni yang sangat hidup.",
      },
      {
        name: "Tujuh Rupa Flora Semarak Pesisir",
        image: "/images/motifs/batik_tujuh_rupa_var2.webp",
        description: "Kupu-kupu dan ranting dedaunan mekar berlatar cokelat tanah dengan isen titik cecek yang menyelimuti seluruh helai kain.",
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
    region: "Surakarta (Solo)",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Wahyu berarti petunjuk dan anugerah Tuhan, tumurun berarti turun menghampiri. Memuat doa restu pengharapan agar pemakainya dikaruniai petunjuk hidup, kemudahan dalam menuntut ilmu, serta masa depan yang terang benderang.",
    usage: "Dikenakan saat wisuda perguruan tinggi, pelantikan jabatan pengabdian, dan doa permohonan restu keluarga.",
    visualTraits: "Pola mahkota terbang bersayap (kanthil) yang dinaungi sepasang burung garuda berhadapan dan ornamen pohon hayat berlatar cokelat soga tua klasik.",
    image: "/images/motifs/batik_wahyu_tumurun.webp",
    variants: [
      {
        name: "Wahyu Tumurun Sogan Solo Alus Isen Cecek",
        image: "/images/motifs/batik_wahyu_tumurun_var1.webp",
        description: "Pewarnaan sogan cokelat keemasan hangat dengan goresan isen cecek rapat dan mahkota kanthil putih bersinar.",
      },
      {
        name: "Wahyu Tumurun Latar Pethak / Krem Cerah",
        image: "/images/motifs/batik_wahyu_tumurun_var2.webp",
        description: "Ornamen mahkota kanthil dan burung terbang di atas latar kain kuning gading cerah dengan garis kontur cokelat tegas.",
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
    region: "Surakarta (Solo)",
    province: "Jawa Tengah",
    island: "Jawa",
    category: "Batik Keraton",
    philosophy:
      "Wirasat bermakna firasat atau petuah nasihat bijak orang tua kepada anak-anaknya. Mengingatkan agar anak selalu menempuh jalan kebajikan, menjaga kehormatan keluarga, dan memelihara kerukunan hidup berpasangan.",
    usage: "Dikenakan oleh ibu kedua mempelai pada saat malam midodareni dan prosesi ijab kabul.",
    visualTraits: "Lajur belah ketupat bergelombang berlatar sogan cokelat kemerahan hangat, memuat ornamen ceplok selang-seling antara Truntum bintang dan dedaunan semesta.",
    image: "/images/motifs/batik_wirasat.webp",
    variants: [
      {
        name: "Wirasat Ceplok Truntum & Medalion Emas",
        image: "/images/motifs/batik_wirasat_var1.webp",
        description: "Petak catur belah ketupat berselang-seling antara taburan bintang Truntum hitam dan ornamen medalion emas bersinar.",
      },
      {
        name: "Wirasat Babaran Wedelan Tiga Warna",
        image: "/images/motifs/batik_wirasat_var2.webp",
        description: "Perpaduan warna biru wedelan indigo, sogan keemasan, dan latar pethak putih bersinar pada medalion ceplok geometris.",
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
