import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { WeeklyProject, ProjectStatus } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: WeeklyProject;
  onSave: (updatedProject: WeeklyProject) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const [title, setTitle] = useState(project.title);
  const [demoUrl, setDemoUrl] = useState(project.demoUrl);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [description, setDescription] = useState(project.description);
  const [notes, setNotes] = useState(project.notes || '');

  useEffect(() => {
    setTitle(project.title);
    setDemoUrl(project.demoUrl);
    setStatus(project.status);
    setDescription(project.description);
    setNotes(project.notes || '');
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WeeklyProject = {
      ...project,
      title: title.trim() || `${project.week}. Hafta`,
      demoUrl: demoUrl.trim() || '#',
      status,
      description: description.trim(),
      notes: notes.trim(),
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded border border-cyan-200">
              {project.title}
            </span>
            <h2 className="text-sm font-bold text-slate-900">Hafta Bilgilerini Düzenle</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Hafta İsmi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Proje Durumu</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
            >
              <option value="completed">✓ Tamamlandı</option>
              <option value="in_progress">⏳ Geliştiriliyor</option>
              <option value="planned">⚪ Planlandı</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Canlı Link / Google Drive Bağlantısı
            </label>
            <input
              type="text"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono text-[11px] focus:outline-none focus:border-cyan-600 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Burak'ın Notları</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Bu haftanın tasarım ve uygulama notları..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
