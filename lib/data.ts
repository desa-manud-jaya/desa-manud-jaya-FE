export const destinations = [
  {
    id: "bukit-panorama-lestari",
    name: "Bukit Panorama Lestari",
    type: "Wisata Alam",
    subtitle: "Sunrise & Trekking",
    description:
      "Bukit dengan jalur trekking ringan \u00b130 menit, menawarkan pemandangan matahari terbit dan hamparan sawah organik.",
    ecoValue:
      "Jalur trekking berbahan alami, tanpa kendaraan bermotor.",
    activities: [
      "Sunrise trekking",
      "Fotografi alam",
      "Edukasi konservasi lereng",
    ],
    image: "/images/bukit-panorama.jpg",
    eco: true,
  },
  {
    id: "air-terjun-tirta-manud",
    name: "Air Terjun Tirta Manud",
    type: "Wisata Alam",
    subtitle: "Hidden Waterfall",
    description:
      "Air terjun alami dengan kolam dangkal dan sistem pembatasan pengunjung per hari.",
    ecoValue:
      "Sistem kuota kunjungan untuk mencegah overcapacity.",
    activities: [
      "Trekking hutan ringan",
      "Berenang",
      "Edukasi ekosistem air",
    ],
    image: "/images/air-terjun.jpg",
    eco: true,
  },
  {
    id: "kampung-sawah-organik",
    name: "Kampung Sawah Organik Mandiri",
    type: "Agro-Tourism",
    subtitle: "Pertanian Organik",
    description:
      "Area persawahan organik yang dikelola warga desa.",
    ecoValue:
      "Tanpa pestisida kimia, sistem irigasi ramah lingkungan.",
    activities: [
      "Belajar menanam padi",
      "Membajak sawah tradisional",
      "Panen sayur organik",
    ],
    image: "/images/sawah-organik.jpg",
    eco: true,
  },
  {
    id: "desa-adat-manud",
    name: "Desa Adat Manud",
    type: "Wisata Budaya",
    subtitle: "Warisan Budaya",
    description:
      "Area rumah tradisional dan balai budaya desa.",
    ecoValue: "Pelestarian budaya dan arsitektur tradisional.",
    activities: [
      "Workshop kerajinan bambu",
      "Belajar tarian tradisional",
      "Cerita sejarah desa",
    ],
    image: "/images/desa-adat.jpg",
    eco: false,
  },
  {
    id: "kedai-kopi-lembah-hijau",
    name: "Kedai Kopi Lembah Hijau",
    type: "UMKM & Kuliner",
    subtitle: "Farm-to-Cup Coffee",
    description:
      "Kedai kopi lokal dengan konsep farm-to-cup.",
    ecoValue:
      "Menggunakan kopi hasil kebun lokal & sedotan bambu.",
    activities: ["Coffee tasting", "Workshop roasting sederhana"],
    image: "/images/kedai-kopi.jpg",
    eco: true,
  },
  {
    id: "kolam-edukasi-perikanan",
    name: "Kolam Edukasi Perikanan Berkelanjutan",
    type: "Edukasi Lingkungan",
    subtitle: "Bioflok System",
    description:
      "Kolam budidaya ikan dengan sistem bioflok ramah lingkungan.",
    ecoValue: "Sistem bioflok ramah lingkungan untuk budidaya ikan.",
    activities: [
      "Edukasi budidaya ikan",
      "Tangkap ikan & masak bersama",
    ],
    image: "/images/kolam-edukasi.jpg",
    eco: true,
  },
  {
    id: "hutan-konservasi-manud",
    name: "Hutan Konservasi Manud Hijau",
    type: "Eco-Tourism & Edukasi",
    subtitle: "Konservasi Alam",
    description:
      "Area konservasi kecil dengan jalur interpretasi lingkungan.",
    ecoValue: "Kawasan konservasi untuk pelestarian flora dan fauna lokal.",
    activities: ["Tree planting", "Edukasi flora lokal", "Bird watching"],
    image: "/images/hutan-konservasi.jpg",
    eco: true,
  },
  {
    id: "sungai-lestari-manud",
    name: "Sungai Lestari Manud",
    type: "Soft Adventure",
    subtitle: "River Activities",
    description:
      "Sungai untuk arum jeram, tubing ringan & river walk.",
    ecoValue: "Pembatasan plastik & pengawasan sampah.",
    activities: [
      "Arum jeram",
      "River tubing ringan",
      "Edukasi kebersihan sungai",
    ],
    image: "/images/sungai-lestari.jpg",
    eco: true,
  },
];

export const packages = [
  {
    id: "sunrise-eco-escape",
    title: "Sunrise Eco Escape",
    duration: "1 Hari (05.00 \u2013 15.00)",
    price: 275000,
    eco: true,
    itinerary: [
      "05.00 \u2013 Sunrise trekking di Bukit Panorama Lestari",
      "07.30 \u2013 Sarapan lokal di Kedai Kopi Lembah Hijau",
      "09.00 \u2013 Edukasi sawah di Kampung Sawah Organik Mandiri",
      "11.30 \u2013 Makan siang organik",
      "13.00 \u2013 Workshop singkat eco-living",
      "15.00 \u2013 Selesai",
    ],
    includes: [
      "Guide local",
      "Sarapan & makan siang",
      "Tiket masuk lokasi",
      "Donasi konservasi",
    ],
  },
  {
    id: "adventure-sehari",
    title: "Adventure Sehari di Manud",
    duration: "1 Hari",
    price: 325000,
    eco: true,
    itinerary: [
      "07.00 \u2013 Sarapan pagi",
      "08.00 \u2013 Trekking ke Air Terjun Tirta Manud",
      "10.00 \u2013 River tubing di Sungai Lestari",
      "12.30 \u2013 Makan siang",
      "14.00 \u2013 Coffee tasting lokal",
      "16.00 \u2013 Selesai",
    ],
    includes: [
      "Guide local",
      "Sarapan & makan siang",
      "Tiket masuk lokasi",
      "Donasi konservasi",
    ],
  },
  {
    id: "eco-living-experience",
    title: "Eco Living Experience",
    duration: "2 Hari 1 Malam",
    price: 675000,
    eco: true,
    itinerary: [
      "Hari 1: Trekking Bukit Panorama, Air Terjun Tirta Manud, Workshop kerajinan di Desa Adat, Pertunjukan budaya malam",
      "Hari 2: Aktivitas di Kampung Sawah Organik, Edukasi perikanan bioflok, Penutupan",
    ],
    includes: [
      "Guide local",
      "Sarapan, makan siang, & makan malam",
      "Tiket masuk lokasi",
      "Donasi konservasi",
    ],
  },
  {
    id: "family-green-getaway",
    title: "Family Green Getaway",
    duration: "2 Hari 1 Malam",
    price: 725000,
    eco: true,
    itinerary: [
      "Hari 1: Desa Adat, Workshop bambu, Kuliner tradisional, Api unggun malam",
      "Hari 2: Kolam Edukasi Perikanan, Petik sayur organik, Makan siang keluarga",
    ],
    includes: [
      "Guide local",
      "Sarapan, makan siang, & makan malam",
      "Tiket masuk lokasi",
      "Donasi konservasi",
    ],
  },
  {
    id: "sustainable-village-immersion",
    title: "Sustainable Village Immersion",
    duration: "3 Hari 2 Malam",
    price: 1250000,
    eco: true,
    itinerary: [
      "Hari 1: Trekking Sunrise, Air Terjun, Coffee session, Cultural night",
      "Hari 2: Sawah organik, Tree planting di Hutan Konservasi, River tubing",
      "Hari 3: Edukasi perikanan, UMKM tour",
    ],
    includes: [
      "Guide local",
      "Sarapan, makan siang & makan malam",
      "Tiket masuk lokasi",
      "Donasi konservasi",
    ],
  },
  {
    id: "corporate-eco-retreat",
    title: "Corporate Eco Retreat",
    duration: "3 Hari 2 Malam",
    price: 1450000,
    eco: true,
    itinerary: [
      "Hari 1: Team building games, Coffee session, Workshop sustainability, Dinner budaya",
      "Hari 2: Trekking & Air Terjun, Tree planting, River tubing",
      "Hari 3: Edukasi perikanan, UMKM tour, Local product shopping",
    ],
    includes: [
      "Guide local",
      "Sarapan, makan siang & makan malam",
      "Tiket masuk lokasi",
      "Donasi konservasi",
    ],
  },
];

export function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
