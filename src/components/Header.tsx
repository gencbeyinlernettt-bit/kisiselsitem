import React from 'react';
import { Plus, ExternalLink, Search, CheckCircle2, Clock } from 'lucide-react';
import { WeeklyProject } from '../types';

interface HeaderProps {
  activeProject: WeeklyProject;
  completedCount: number;
  totalCount: number;
  onOpenNewNote: () => void;
  onOpenEditModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProject,
  completedCount,
  totalCount,
  onOpenNewNote,
  onOpenEditModal,
  searchQuery,
  onSearchChange,
}) => {
  const percent = Math.round((completedCount / totalCount) * 100);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Zone 1: Wordmark / Brand Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <img
            src="/src/assets/images/avatar_burak_profile_1790235191569.jpg"
            alt="Burak TURGUT"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shadow-xs"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
            title="Aktif"
          />
        </div>

        <div>
          <h1 className="text-base lg:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Burak TURGUT Web Portal
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>30 Haftalık Çalışma Portalı</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-cyan-700 font-semibold">{activeProject.title} Seçili</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation & Quick Search */}
      <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Hafta ara (örn: 1. Hafta, 14)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Primary Actions & Progress */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Progress badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">İlerleme</span>
            <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">
              {completedCount}/{totalCount} Hafta (%{percent})
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center relative">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                className="stroke-slate-200"
                strokeWidth="3.5"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                className="stroke-cyan-600 transition-all duration-500"
                strokeWidth="3.5"
                strokeDasharray="88"
                strokeDashoffset={88 - (88 * percent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[9px] font-bold font-mono text-cyan-700">%{percent}</span>
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={onOpenNewNote}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Hızlı Not</span>
        </button>

        <button
          onClick={onOpenEditModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
          title="Seçili haftanın bağlantısını düzenle"
        >
          <span>Haftayı Düzenle</span>
        </button>
      </div>
    </header>
  );
};
