import { WeeklyProject } from '../types';

export const DEFAULT_PROJECTS: WeeklyProject[] = Array.from({ length: 30 }, (_, index) => {
  const weekNum = index + 1;
  const isFirstWeek = weekNum === 1;

  return {
    id: weekNum,
    week: weekNum,
    title: `${weekNum}. Hafta`,
    category: `Haftalık Çalışma`,
    description: isFirstWeek
      ? '1. Hafta tasarım ve uygulama çalışması klasörü (Google Drive).'
      : `${weekNum}. Hafta tasarım ve uygulama çalışması.`,
    techStack: isFirstWeek
      ? ['Google Drive', 'Tasarım Dosyaları', 'Web Uygulaması']
      : ['Web Uygulaması', 'Tasarım', 'Kod'],
    status: isFirstWeek ? 'completed' : weekNum <= 18 ? 'completed' : weekNum <= 24 ? 'in_progress' : 'planned',
    demoUrl: isFirstWeek
      ? 'https://drive.google.com/drive/folders/1hfZlMNNYNK88_kUF2qibZDDMYlcFu0F0?usp=sharing'
      : `#hafta-${weekNum}`,
    githubUrl: undefined,
    completedDate: isFirstWeek ? 'Eylül 2026' : undefined,
    notes: isFirstWeek
      ? '1. Hafta tasarım dosyalarına ve dokümanlarına yukarıdaki Google Drive bağlantısından erişebilirsiniz.'
      : `${weekNum}. hafta çalışma notları.`,
    highlights: isFirstWeek
      ? [
          'Google Drive klasör bağlantısı tanımlandı',
          'Tasarım ve proje dokümanları hazır',
          'Tek tıkla doğrudan klasöre erişim',
        ]
      : [
          `${weekNum}. hafta tasarım arayüzü`,
          'Responsive mobil & masaüstü uyumu',
          'Canlı bağlantı entegrasyonu',
        ],
  };
});

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: '1. Hafta Drive Bağlantısı',
    content: '1. Hafta uygulama ve tasarım klasörü Google Drive üzerinde paylaşıma açıldı:\nhttps://drive.google.com/drive/folders/1hfZlMNNYNK88_kUF2qibZDDMYlcFu0F0?usp=sharing',
    category: 'Önemli' as const,
    createdAt: 'Bugün',
    isPinned: true,
  },
  {
    id: 'note-2',
    title: 'Haftalık İlerleme Planı',
    content: 'Her haftanın çalışmasını tamamladıkça sol menüdeki ilgili haftanın üzerine tıklayıp detayları ve bağlantıları güncelleyebilirsiniz.',
    category: 'Haftalık Görev' as const,
    createdAt: 'Dün',
    isPinned: true,
  },
  {
    id: 'note-3',
    title: 'Açık Tema ve Düzen',
    content: 'Arayüz tasarımı sade, ferah ve okunabilir açık renk paletine uyarlandı.',
    category: 'Genel' as const,
    createdAt: '24 Eylül 2026',
    isPinned: false,
  },
];
