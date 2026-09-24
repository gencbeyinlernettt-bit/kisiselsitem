import React, { useState } from 'react';
import {
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Edit3,
  CheckCircle2,
  Clock,
  CircleDashed,
  Layers,
  Code2,
  FolderOpen,
  Info,
  Maximize2
} from 'lucide-react';
import { WeeklyProject, ProjectStatus } from '../types';

interface ProjectShowcaseProps {
  project: WeeklyProject;
  onEditProject: () => void;
  onToggleStatus: (newStatus: ProjectStatus) => void;
  allProjects: WeeklyProject[];
  onSelectWeek: (week: number) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  project,
  onEditProject,
  onToggleStatus,
  allProjects,
  onSelectWeek,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'specs' | 'timeline'>('preview');

  const getStatusInfo = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Tamamlandı',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
          icon: CheckCircle2,
        };
      case 'in_progress':
        return {
          label: 'Geliştirme Aşamasında',
          color: 'text-amber-800 bg-amber-50 border-amber-300',
          icon: Clock,
        };
      case 'planned':
        return {
          label: 'Planlandı',
          color: 'text-slate-700 bg-slate-100 border-slate-300',
          icon: CircleDashed,
        };
    }
  };

  const statusInfo = getStatusInfo(project.status);
  const isFirstWeek = project.week === 1;

  const getContainerWidth = () => {
    switch (deviceView) {
      case 'desktop':
        return 'w-full';
      case 'tablet':
        return 'max-w-3xl w-full';
      case 'mobile':
        return 'max-w-sm w-full';
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-y-auto bg-slate-100/70 text-slate-900">
      {/* Top Showcase Hero Bar */}
      <div className="p-4 lg:p-6 border-b border-slate-200 bg-white shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 flex-wrap">
              <span className="font-mono text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                HAFTA {String(project.week).padStart(2, '0')} / 30
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">Haftalık Uygulama Çalışması</span>
            </div>

            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
              {project.title}
            </h2>
            <p className="text-xs lg:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Action Buttons & Status Selector */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {/* Status Dropdown */}
            <select
              value={project.status}
              onChange={(e) => onToggleStatus(e.target.value as ProjectStatus)}
              aria-label="Hafta durumu"
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold focus:outline-none cursor-pointer transition-colors ${statusInfo.color}`}
            >
              <option value="completed">✓ Tamamlandı</option>
              <option value="in_progress">⏳ Geliştiriliyor</option>
              <option value="planned">⚪ Planlandı</option>
            </select>

            {/* Launch Demo Link */}
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              title="Bağlantıyı yeni sekmede aç"
            >
              <span>{isFirstWeek ? 'Google Drive Klasörünü Aç' : 'Uygulamayı Aç'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Edit Project Button */}
            <button
              onClick={onEditProject}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Bu haftanın bağlantısını değiştir"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Düzenle</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Bağlantı Hedefi:</span>
            <span className="font-mono text-cyan-800 truncate max-w-md bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {project.demoUrl}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Çalışma Önizlemesi
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hafta Notları
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Hafta Matrisi
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 p-4 lg:p-6 flex flex-col items-center">
        {activeTab === 'preview' && (
          <div className="w-full flex flex-col items-center">
            {/* Device Frame Simulator Controls */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-3 text-xs text-slate-500 px-2">
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    deviceView === 'desktop' ? 'bg-slate-100 text-cyan-800' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Masaüstü Görünümü"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView('tablet')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    deviceView === 'tablet' ? 'bg-slate-100 text-cyan-800' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Tablet Görünümü (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    deviceView === 'mobile' ? 'bg-slate-100 text-cyan-800' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Mobil Görünümü (375px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-cyan-700 hover:text-cyan-800 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Yeni Sekmede Başlat</span>
                </a>
              </div>
            </div>

            {/* Simulated Browser Frame (Light) */}
            <div
              className={`transition-all duration-300 ${getContainerWidth()} rounded-xl border border-slate-300 bg-white shadow-md overflow-hidden`}
            >
              {/* Chrome top bar */}
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>

                <div className="flex-1 max-w-md mx-auto px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-700 flex items-center justify-center gap-2 truncate shadow-2xs">
                  <span className="text-emerald-600 font-semibold">https://</span>
                  <span className="truncate">{project.demoUrl.replace(/^https?:\/\//, '')}</span>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  {deviceView === 'desktop' ? '1440×900' : deviceView === 'tablet' ? '768×1024' : '375×812'}
                </div>
              </div>

              {/* Viewport Surface */}
              <div className="relative min-h-[440px] bg-slate-50/60 flex flex-col justify-center items-center p-8 text-center">
                <div className="max-w-xl w-full p-6 sm:p-8 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-2xs">
                    <FolderOpen className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-xs font-mono text-cyan-800 font-bold tracking-wider uppercase bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                      {project.title}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-3">
                      {isFirstWeek ? '1. Hafta Google Drive Çalışma Klasörü' : `${project.title} Uygulama Alanı`}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Highlights / Features */}
                  {project.highlights && (
                    <div className="text-left bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2 text-slate-700">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Çalışma Detayları
                      </div>
                      {project.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Primary Launch Action */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      <span>{isFirstWeek ? 'Google Drive Bağlantısına Git' : 'Uygulamayı Yeni Sekmede Başlat'}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={onEditProject}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Bağlantıyı Düzenle</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-[11px] text-slate-500">
                  {isFirstWeek
                    ? '1. Hafta doğrudan tanımlanan Google Drive klasörüne yönlendirilmektedir.'
                    : 'Diğer haftaların bağlantılarını düzenleyip kendi çalışma linklerinizi kaydedebilirsiniz.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Specs & Notes */}
        {activeTab === 'specs' && (
          <div className="w-full max-w-4xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>Hafta Künyesi</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Hafta</span>
                    <span className="font-bold text-slate-900">{project.title}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Durum</span>
                    <span className="capitalize font-semibold">{statusInfo.label}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Bağlantı Türü</span>
                    <span>{isFirstWeek ? 'Google Drive Klasörü' : 'Web Uygulaması'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Hedef URL</span>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-700 font-mono hover:underline truncate max-w-[220px]"
                    >
                      {project.demoUrl}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                  <Code2 className="w-4 h-4" />
                  <span>Burak'ın Haftalık Notları</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  {project.notes || 'Bu hafta için henüz özel not girilmemiş.'}
                </p>
                <div className="text-[11px] text-slate-500">
                  "Haftayı Düzenle" butonundan bu alana dilediğiniz açıklamayı yazabilirsiniz.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 30-Week Visual Matrix Timeline */}
        {activeTab === 'timeline' && (
          <div className="w-full max-w-5xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">30 Haftalık Çalışma Matrisi</h3>
                <p className="text-xs text-slate-500">Görüntülemek istediğiniz haftayı seçin:</p>
              </div>
              <div className="text-xs font-mono font-bold text-cyan-800">
                {allProjects.filter((p) => p.status === 'completed').length} / 30 Tamamlandı
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {allProjects.map((p) => {
                const isSelected = p.week === project.week;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectWeek(p.week)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-950 shadow-xs ring-1 ring-cyan-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-slate-900">{p.title}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          p.status === 'completed'
                            ? 'bg-emerald-500'
                            : p.status === 'in_progress'
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                        title={p.status}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {p.week === 1 ? 'Google Drive' : 'Uygulama'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
