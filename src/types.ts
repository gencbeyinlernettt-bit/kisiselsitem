export type ProjectStatus = 'completed' | 'in_progress' | 'planned';

export interface WeeklyProject {
  id: number; // 1 to 30
  week: number;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  demoUrl: string;
  githubUrl?: string;
  completedDate?: string;
  notes?: string;
  highlights?: string[];
  thumbnail?: string;
}

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  category: 'Genel' | 'Fikir' | 'Kod' | 'Haftalık Görev' | 'Önemli';
  createdAt: string;
  isPinned?: boolean;
}

export interface ScratchpadData {
  text: string;
  updatedAt: string;
}
