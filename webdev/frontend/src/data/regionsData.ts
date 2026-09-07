export interface RegionData {
  id: string;
  name: string;
  shortName: string;
  province: string;
  island: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  description: string;
}

export interface MotifCard {
  id: string;
  name: string;
  regionId: string;
  regionLabel: string;
  category: string;
  philosophy: string;
  image: string;
}

/**
 * 7 Sentra Geografis Resmi Dataset (Koordinat Peta Nyata)
 * Deskripsi tidak membocorkan nama motif secara eksplisit agar mengasah pemahaman pemain.
 */
export const REGIONS_DATA: RegionData[] = [
  {
    id: "jakarta",
    name: "DKI Jakarta (Betawi)",
    shortName: "Jakarta",
    province: "DKI Jakarta",
    island: "Jawa",
    lat: -6.2088,
    lng: 106.8456,
    radiusMeters: 28000,
    description: "Sentra wastra pesisiran barat Pulau Jawa dengan corak multikultural yang riang dan bersahabat.",
  },
  {
    id: "cirebon",
    name: "Cirebon",
    shortName: "Cirebon",
    province: "Jawa Barat",
    island: "Jawa",
    lat: -6.732,
    lng: 108.5523,
    radiusMeters: 30000,
    description: "Pesisir utara Jawa Barat, pertemuan peradaban maritim, keraton kesultanan, dan akulturasi Tiongkok.",
  },
  {
    id: "pekalongan",
    name: "Pekalongan",
    shortName: "Pekalongan",
    province: "Jawa Tengah",
    island: "Jawa",
    lat: -6.8886,
    lng: 109.6753,
    radiusMeters: 32000,
    description: "Kota Kreatif Dunia UNESCO, episentrum inovasi warna cerah dan keterbukaan ragam hias pesisir.",
  },
  {
    id: "yogyakarta",
    name: "D.I. Yogyakarta",
    shortName: "Yogyakarta",
    province: "D.I. Yogyakarta",
    island: "Jawa",
    lat: -7.7956,
    lng: 110.3695,
    radiusMeters: 32000,
    description: "Keraton Mataram, episentrum seni adiluhung dengan pakem geometris sakral berlatar putih gading.",
  },
  {
    id: "surakarta",
    name: "Surakarta (Solo)",
    shortName: "Solo",
    province: "Jawa Tengah",
    island: "Jawa",
    lat: -7.5755,
    lng: 110.8243,
    radiusMeters: 32000,
    description: "Keraton Kasunanan dan Mangkunegaran, kaya makna filosofis kehidupan berlatar cokelat sogan hangat.",
  },
  {
    id: "lasem",
    name: "Lasem (Rembang)",
    shortName: "Lasem",
    province: "Jawa Tengah",
    island: "Jawa",
    lat: -6.6917,
    lng: 111.4528,
    radiusMeters: 30000,
    description: "Tiongkok Kecil di pesisir utara, mahakarya persaudaraan lintas etnis dengan pewarnaan merah khas.",
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    shortName: "Kalimantan",
    province: "Kalimantan Tengah",
    island: "Kalimantan",
    lat: -1.6815,
    lng: 113.3823,
    radiusMeters: 75000,
    description: "Wastra pedalaman hutan Borneo, sarat simbol kosmologi semesta dan penjagaan kelestarian alam raya.",
  },
];

/**
 * 10 Kartu Motif Resmi untuk Game Batik Map
 * Filosofi disesuaikan tanpa membocorkan nama daerah/kota secara langsung.
 */
export const MOTIF_CARDS: MotifCard[] = [
  {
    id: "batik_kawung",
    name: "Batik Kawung",
    regionId: "yogyakarta",
    regionLabel: "D.I. Yogyakarta",
    category: "Batik Keraton",
    philosophy: "Empat kelopak aren melambangkan kemurnian hati, keadilan, dan harmoni semesta.",
    image: "/images/motifs/batik_kawung.webp",
  },
  {
    id: "batik_parang",
    name: "Batik Parang",
    regionId: "yogyakarta",
    regionLabel: "D.I. Yogyakarta",
    category: "Batik Larangan",
    philosophy: "Ombak samudra tak terputus lambang keteguhan kepemimpinan yang pantang surut.",
    image: "/images/motifs/batik_parang.webp",
  },
  {
    id: "batik_mega_mendung",
    name: "Batik Mega Mendung",
    regionId: "cirebon",
    regionLabel: "Cirebon",
    category: "Batik Pesisiran",
    philosophy: "Awan berundak penyejuk di tengah terik, lambang kesabaran dan ketenangan emosi.",
    image: "/images/motifs/batik_mega_mendung_v2.webp",
  },
  {
    id: "batik_jlamprang",
    name: "Batik Jlamprang",
    regionId: "pekalongan",
    regionLabel: "Pekalongan",
    category: "Batik Pesisiran",
    philosophy: "Pola geometris delapan penjuru mata angin hasil akulturasi seni Patola Gujarat dan Arab.",
    image: "/images/motifs/batik_jlamprang.webp",
  },
  {
    id: "batik_betawi",
    name: "Batik Betawi",
    regionId: "jakarta",
    regionLabel: "DKI Jakarta",
    category: "Batik Pesisiran",
    philosophy: "Ornamen figur ikonik dan pucuk rebung menyuarakan keramahan serta keceriaan masyarakat pesisir.",
    image: "/images/motifs/batik_betawi.webp",
  },
  {
    id: "batik_liong",
    name: "Batik Liong",
    regionId: "lasem",
    regionLabel: "Lasem (Rembang)",
    category: "Batik Pesisiran",
    philosophy: "Naga mitologis dan warna merah getih pitik wujud akulturasi luhur lambang kemakmuran abadi.",
    image: "/images/motifs/batik_liong.webp",
  },
  {
    id: "batik_dayak",
    name: "Batik Dayak",
    regionId: "kalimantan",
    regionLabel: "Kalimantan",
    category: "Batik Nusantara",
    philosophy: "Pohon Batang Garing dan tameng telawang penjaga keseimbangan kosmis serta harmoni manusia dan alam.",
    image: "/images/motifs/batik_dayak.webp",
  },
  {
    id: "batik_singa_barong",
    name: "Batik Singa Barong",
    regionId: "cirebon",
    regionLabel: "Cirebon",
    category: "Batik Keraton",
    philosophy: "Kereta kencana mitologis berkepala naga dan bersayap garuda, simbol persatuan empat peradaban dunia.",
    image: "/images/motifs/batik_singa_barong_v2.webp",
  },
  {
    id: "batik_sidomukti",
    name: "Batik Sido Mukti",
    regionId: "surakarta",
    regionLabel: "Surakarta (Solo)",
    category: "Batik Keraton",
    philosophy: "Doa suci agar senantiasa dilimpahi kehidupan mulia, tenteram lahir batin, dan berbudi luhur.",
    image: "/images/motifs/batik_sidomukti.webp",
  },
  {
    id: "batik_buketan",
    name: "Batik Buketan",
    regionId: "pekalongan",
    regionLabel: "Pekalongan",
    category: "Batik Pesisiran",
    philosophy: "Rangkaian karangan bunga mekar cerah bergaya naturalis hasil adaptasi seni rupa flora Eropa.",
    image: "/images/motifs/batik_buketan.webp",
  },
];
