export interface Essay {
  title: string;
  summary: string;
  date: string;
  tags: string[];
  confidence: number;
}

export interface Book {
  title: string;
  author: string;
  status: string;
  note: string;
  rating?: number;
}

export const stats = {
  essays: 43,
  papers: 286,
  books: 21,
  revisions: 11,
  retractions: 2
};

export const essays: Essay[] = [
  {
    title: "Mengapa Bonus Demografi Bisa Menjadi Bencana",
    summary: "Jika infrastruktur pendidikan dan lapangan kerja tidak siap, window of opportunity berubah menjadi beban struktural yang sulit diurai.",
    date: "12 Mei 2026",
    tags: ["Demografi", "Ekonomi"],
    confidence: 65
  },
  {
    title: "Hukum dan Ketimpangan: Apakah Sistem Peradilan Kita Netral?",
    summary: "Analisis pola putusan pengadilan dari 2018–2024 menunjukkan disparitas yang konsisten berdasarkan latar belakang ekonomi terdakwa.",
    date: "2 Apr 2026",
    tags: ["Hukum", "Sosiologi"],
    confidence: 80
  },
  {
    title: "Middle Income Trap: Indonesia di Persimpangan",
    summary: "Kombinasi deindustrialisasi prematur, rendahnya nilai tambah ekspor, dan produktivitas tenaga kerja yang stagnan menempatkan Indonesia pada skenario yang familiar secara historis.",
    date: "15 Mar 2026",
    tags: ["Ekonomi"],
    confidence: 70
  },
  {
    title: "Apakah AI Benar-benar Meningkatkan Produktivitas?",
    summary: "Bukti empiris dari studi 2022–2024 lebih ambigu dari narasi publik. Keuntungan produktivitas sangat terkonsentrasi pada jenis pekerjaan dan tingkat keahlian tertentu.",
    date: "28 Feb 2026",
    tags: ["Teknologi", "Ekonomi"],
    confidence: 55
  }
];

export const books: Book[] = [
  {
    title: "The Origins of Political Order",
    author: "Francis Fukuyama",
    status: "Sedang Dibaca",
    note: "Memberikan kerangka historis yang berguna untuk membandingkan pembangunan institusi Indonesia dengan negara lain."
  },
  {
    title: "Why Nations Fail",
    author: "Acemoglu & Robinson",
    status: "Selesai · Mar 2026",
    note: "Argumen institusi inklusif vs. ekstraktif terasa kuat, meski terlalu menyederhanakan peran faktor geografis dan budaya.",
    rating: 4
  },
  {
    title: "The Age of Surveillance Capitalism",
    author: "Shoshana Zuboff",
    status: "Selesai · Feb 2026",
    note: "Mengubah cara saya memandang model bisnis platform digital. Berpengaruh langsung pada esai tentang AI dan produktivitas.",
    rating: 5
  }
];

export const principles = [
  {
    num: "01",
    text: "Opini tetaplah opini. Tapi setiap opini punya dasar yang dapat ditelusuri."
  },
  {
    num: "02",
    text: "Pembaca boleh tidak setuju. Ketidaksepakatan yang beralasan lebih berharga dari validasi."
  },
  {
    num: "03",
    text: "Kesimpulan dapat berubah jika ada bukti atau argumen yang lebih kuat."
  },
  {
    num: "04",
    text: "Transparansi proses berpikir lebih penting daripada terlihat selalu benar."
  }
];