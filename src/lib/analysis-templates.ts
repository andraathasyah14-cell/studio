export interface Question {
  id: string;
  text: string;
  placeholder: string;
}

export interface Section {
  title: string;
  questions: Question[];
}

export interface Template {
  id: string;
  title: string;
  sections: Section[];
}

export const ANALYSIS_TEMPLATES: Record<string, Template> = {
  academic: {
    id: 'academic',
    title: 'Analisis Paper Akademik',
    sections: [
      {
        title: 'A. Ringkasan Penelitian',
        questions: [
          { id: 'aq1', text: 'Apa pertanyaan penelitian (research question) yang ingin dijawab?', placeholder: 'Tuliskan pertanyaan utama...' },
          { id: 'aq2', text: 'Mengapa penelitian ini penting?', placeholder: 'Signifikansi penelitian...' },
          { id: 'aq3', text: 'Apa tujuan utama penelitian?', placeholder: 'Objective penelitian...' },
        ]
      },
      {
        title: 'B. Metode Penelitian',
        questions: [
          { id: 'bq1', text: 'Data apa yang digunakan?', placeholder: 'Jenis data (primer/sekunder)...' },
          { id: 'bq2', text: 'Dari mana data tersebut diperoleh?', placeholder: 'Sumber data...' },
          { id: 'bq3', text: 'Metode penelitian apa yang digunakan?', placeholder: 'Kualitatif/Kuantitatif/Lainnya...' },
          { id: 'bq4', text: 'Apakah metode tersebut tepat untuk menjawab pertanyaan penelitian? Mengapa?', placeholder: 'Evaluasi metodologi...' },
        ]
      },
      {
        title: 'C. Temuan Utama',
        questions: [
          { id: 'cq1', text: 'Apa hasil atau temuan utamanya?', placeholder: 'Hasil kunci...' },
          { id: 'cq2', text: 'Apakah hasil tersebut sesuai dengan hipotesis peneliti?', placeholder: 'Konfirmasi/Penolakan hipotesis...' },
          { id: 'cq3', text: 'Apa implikasi dari temuan tersebut?', placeholder: 'Dampak temuan...' },
        ]
      },
      {
        title: 'D. Kritik dan Evaluasi',
        questions: [
          { id: 'dq1', text: 'Apa kekuatan utama penelitian ini?', placeholder: 'Kelebihan penelitian...' },
          { id: 'dq2', text: 'Apa kelemahan penelitian ini?', placeholder: 'Limitasi penelitian...' },
          { id: 'dq3', text: 'Apakah terdapat keterbatasan pada data atau metode?', placeholder: 'Keterbatasan teknis...' },
          { id: 'dq4', text: 'Adakah potensi bias atau faktor yang belum diperhitungkan?', placeholder: 'Potensi bias...' },
        ]
      },
      {
        title: 'E. Respons Pribadi',
        questions: [
          { id: 'eq1', text: 'Apakah hasil penelitian ini meyakinkan? Mengapa?', placeholder: 'Opini kredibilitas...' },
          { id: 'eq2', text: 'Apakah terdapat interpretasi alternatif?', placeholder: 'Sudut pandang lain...' },
          { id: 'eq3', text: 'Penelitian lanjutan apa yang diperlukan?', placeholder: 'Rekomendasi riset...' },
          { id: 'eq4', text: 'Apa implikasi bagi kebijakan atau praktik?', placeholder: 'Penerapan di lapangan...' },
        ]
      }
    ]
  },
  news: {
    id: 'news',
    title: 'Analisis Berita',
    sections: [
      {
        title: '1. Memahami Berita',
        questions: [
          { id: 'nq1', text: 'Apa fakta atau informasi utama dalam berita?', placeholder: 'Informasi 5W+1H...' },
          { id: 'nq2', text: 'Apa yang sebenarnya terjadi?', placeholder: 'Intisari peristiwa...' },
        ]
      },
      {
        title: '2. Analisis Penyebab',
        questions: [
          { id: 'nq3', text: 'Mengapa hal ini terjadi?', placeholder: 'Akar masalah...' },
          { id: 'nq4', text: 'Faktor apa yang mendorong peristiwa tersebut?', placeholder: 'Katalisator...' },
        ]
      },
      {
        title: '3. Analisis Pihak Terdampak',
        questions: [
          { id: 'nq5', text: 'Siapa yang diuntungkan?', placeholder: 'Penerima manfaat...' },
          { id: 'nq6', text: 'Siapa yang dirugikan?', placeholder: 'Pihak yang menanggung risiko...' },
        ]
      },
      {
        title: '4. Analisis Dampak',
        questions: [
          { id: 'nq7', text: 'Apa sisi positifnya?', placeholder: 'Peluang...' },
          { id: 'nq8', text: 'Kebijakan atau peristiwa ini berpotensi menghasilkan apa?', placeholder: 'Proyeksi...' },
          { id: 'nq9', text: 'Apa risikonya?', placeholder: 'Bahaya laten...' },
          { id: 'nq10', text: 'Apa dampak jangka panjangnya?', placeholder: 'Efek masa depan...' },
        ]
      },
      {
        title: '5. Membaca Secara Kritis',
        questions: [
          { id: 'nq11', text: 'Apa yang mungkin luput dari pemberitaan?', placeholder: 'Blind spot...' },
          { id: 'nq12', text: 'Perspektif siapa yang kurang terwakili?', placeholder: 'Suara minoritas/terpinggirkan...' },
        ]
      },
      {
        title: '6. Refleksi Pribadi',
        questions: [
          { id: 'nq13', text: 'Apa kesimpulan pribadi terhadap berita tersebut?', placeholder: 'Penilaian akhir...' },
        ]
      }
    ]
  },
  issue: {
    id: 'issue',
    title: 'Analisis Isu',
    sections: [
      {
        title: '1. Identifikasi Isu',
        questions: [
          { id: 'iq1', text: 'Apa isu yang sedang terjadi?', placeholder: 'Konteks isu...' },
          { id: 'iq2', text: 'Mengapa isu ini muncul?', placeholder: 'Latar belakang...' },
        ]
      },
      {
        title: '2. Analisis Aktor & Insentif',
        questions: [
          { id: 'iq3', text: 'Insentif siapa yang sedang bermain?', placeholder: 'Motivasi aktor...' },
          { id: 'iq4', text: 'Siapa yang mendapat manfaat?', placeholder: 'Beneficiary...' },
          { id: 'iq5', text: 'Siapa yang menanggung biaya?', placeholder: 'Cost-bearer...' },
        ]
      },
      {
        title: '3. Analisis Masalah',
        questions: [
          { id: 'iq6', text: 'Apa akar masalahnya?', placeholder: 'Root cause...' },
          { id: 'iq7', text: 'Apakah terdapat trade-off?', placeholder: 'Kompromi yang sulit...' },
          { id: 'iq8', text: 'Apa saja sisi/perspektif yang berbeda?', placeholder: 'Sisi lain isu...' },
        ]
      },
      {
        title: '4. Analisis Dampak',
        questions: [
          { id: 'iq9', text: 'Apa dampak jangka pendeknya?', placeholder: 'Immediate impact...' },
          { id: 'iq10', text: 'Apa dampak jangka panjangnya?', placeholder: 'Legacy impact...' },
        ]
      },
      {
        title: '5. Evaluasi & Posisi',
        questions: [
          { id: 'iq11', text: 'Apa posisi atau penilaian pribadi terhadap isu ini?', placeholder: 'Posisi argumen...' },
          { id: 'iq12', text: 'Mengapa mengambil posisi tersebut?', placeholder: 'Justifikasi...' },
        ]
      },
      {
        title: '6. Arah Solusi',
        questions: [
          { id: 'iq13', text: 'Solusi apa yang dapat ditawarkan?', placeholder: 'Rekomendasi solusi...' },
          { id: 'iq14', text: 'Langkah apa yang paling realistis?', placeholder: 'Practical steps...' },
        ]
      }
    ]
  }
};

export const generateTemplateText = (templateId: string): string => {
  const template = ANALYSIS_TEMPLATES[templateId];
  if (!template) return '';

  return template.sections.map(section => {
    const questions = section.questions.map(q => `- ${q.text}\n\n[Tulis jawaban Anda di sini]\n`).join('\n');
    return `### ${section.title}\n\n${questions}`;
  }).join('\n\n---\n\n');
};
