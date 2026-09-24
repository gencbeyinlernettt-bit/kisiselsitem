import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  CircleDashed,
  Layers,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  Edit3
} from 'lucide-react';
import { WeeklyProject, ProjectStatus } from '../types';

interface WeeklyMenuProps {
  projects: WeeklyProject[];
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  onEditProject: (project: WeeklyProject) => void;
  searchQuery: string;
}

export const WeeklyMenu: React.FC<WeeklyMenuProps> = ({
  projects,
  selectedWeek,
  onSelectWeek,
  onEditProject,
  searchQuery,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([selectedWeek]);
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [activeRange, setActiveRange] = useState<'all' | '1-10' | '11-20' | '21-30'>('all');

  const toggleWeekAccordion = (weekNumber: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber)
        ? prev.filter((w) => w !== weekNumber)
        : [...prev, weekNumber]
    );
    onSelectWeek(weekNumber);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Tamamlandı</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Geliştiriliyor</span>
          </span>
        );
      case 'planned':
        return (
          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <CircleDashed className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Planlandı</span>
          </span>
        );
    }
  };

  // Filter projects by search, status, and range
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      !searchQuery ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${proj.week}` === searchQuery.trim() ||
      `hafta ${proj.week}`.includes(searchQuery.toLowerCase()) ||
      `${proj.week}. hafta`.includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || proj.status === statusFilter;

    const matchesRange =
      activeRange === 'all'
        ? true
        : activeRange === '1-10'
        ? proj.week >= 1 && proj.week <= 10
        : activeRange === '11-20'
        ? proj.week >= 11 && proj.week <= 20
        : proj.week >= 21 && proj.week <= 30;

    return matchesSearch && matchesStatus && matchesRange;
  });

  return (
    <aside
      className={`relative transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col shrink-0 z-20 ${
        isCollapsed ? 'w-16' : 'w-76 sm:w-82'
      }`}
    >
      {/* Top Header of Sidebar */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Haftalık Menü</h2>
              <p className="text-[10px] text-slate-500">1. Hafta – 30. Hafta Listesi</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto text-cyan-600 p-1">
            <Layers className="w-5 h-5" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 transition-colors"
          title={isCollapsed ? 'Menüyü Genişlet' : 'Kompakt Moda Geç'}
          aria-label="Menü genişliğini değiştir"
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Range controls when expanded */}
      {!isCollapsed && (
        <div className="p-3 border-b border-slate-200 space-y-2.5 bg-white">
          {/* Range tabs (1-10, 11-20, 21-30) */}
          <div className="flex items-center justify-between text-[11px] bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveRange('all')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                activeRange === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü (30)
            </button>
            <button
              onClick={() => setActiveRange('1-10')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                activeRange === '1-10'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-10
            </button>
            <button
              onClick={() => setActiveRange('11-20')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                activeRange === '11-20'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              11-20
            </button>
            <button
              onClick={() => setActiveRange('21-30')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                activeRange === '21-30'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              21-30
            </button>
          </div>

          {/* Quick status filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'text-cyan-800 bg-cyan-50 border border-cyan-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'completed'
                  ? 'text-emerald-800 bg-emerald-50 border border-emerald-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Tamamlanan
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'in_progress'
                  ? 'text-amber-800 bg-amber-50 border border-amber-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Geliştirilen
            </button>
            <button
              onClick={() => setStatusFilter('planned')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'planned'
                  ? 'text-slate-800 bg-slate-100 border border-slate-300 font-semibold'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Planlanan
            </button>
          </div>
        </div>
      )}

      {/* 30-Week Scrollable Menu List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-slate-50/50">
        {filteredProjects.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs px-3">
            Filtreye uygun hafta bulunamadı.
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const isSelected = selectedWeek === proj.week;
            const isExpanded = expandedWeeks.includes(proj.week);

            if (isCollapsed) {
              // Collapsed mode: Compact numbered button
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    onSelectWeek(proj.week);
                    if (!expandedWeeks.includes(proj.week)) {
                      setExpandedWeeks([proj.week]);
                    }
                  }}
                  className={`w-full group relative py-2 flex flex-col items-center justify-center rounded-lg text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title={`${proj.title}`}
                >
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600">H</span>
                  <span className="text-xs">{String(proj.week).padStart(2, '0')}</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      proj.status === 'completed'
                        ? 'bg-emerald-500'
                        : proj.status === 'in_progress'
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                  />
                </button>
              );
            }

            // Expanded Mode: Accordion Item
            return (
              <div
                key={proj.id}
                className={`rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-50/80 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Clickable Header row for Week */}
                <button
                  onClick={() => toggleWeekAccordion(proj.week)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left gap-2 group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Week badge number */}
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}
                    >
                      {String(proj.week).padStart(2, '0')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {proj.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        {getStatusBadge(proj.status)}
                      </div>
                    </div>
                  </div>

                  {/* Expand / Collapse Chevron */}
                  <div className="text-slate-400 group-hover:text-slate-700 shrink-0 ml-1">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {/* Dropdown / Accordion Body */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-200/80 space-y-2 text-xs text-slate-600 bg-slate-50/70 rounded-b-lg">
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Action Links & Edit */}
                    <div className="pt-1.5 flex items-center justify-between gap-1.5 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[11px] font-medium transition-colors shadow-xs"
                          title="Bağlantıyı yeni sekmede aç"
                        >
                          <span>{proj.week === 1 ? 'Drive Bağlantısını Aç' : 'Aç'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditProject(proj);
                          }}
                          className="inline-flex items-center gap-1 px-1.5 py-1 text-slate-500 hover:text-cyan-700 hover:bg-slate-200 rounded transition-colors text-[11px]"
                          title="Bu haftanın bağlantısını düzenle"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span className="text-[10px]">Düzenle</span>
                        </button>

                        <button
                          onClick={() => onSelectWeek(proj.week)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                          title="Projeyi ekranda göster"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom status */}
      {!isCollapsed && (
        <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Toplam: 30 Hafta</span>
          <span className="font-mono text-cyan-700 font-semibold">1. Hafta – 30. Hafta</span>
        </div>
      )}
    </aside>
  );
};
