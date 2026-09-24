import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WeeklyMenu } from './components/WeeklyMenu';
import { ProjectShowcase } from './components/ProjectShowcase';
import { RightSidebar } from './components/RightSidebar';
import { EditProjectModal } from './components/EditProjectModal';
import { AddNoteModal } from './components/AddNoteModal';
import { DEFAULT_PROJECTS, INITIAL_NOTES } from './data/defaultProjects';
import { WeeklyProject, PersonalNote, ProjectStatus } from './types';

export default function App() {
  // 1. Projects State with localStorage persistence (v2 for updated week titles & Drive link)
  const [projects, setProjects] = useState<WeeklyProject[]>(() => {
    const saved = localStorage.getItem('burak_portal_projects_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure week 1 has the drive link
        if (parsed && Array.isArray(parsed) && parsed.length === 30) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
    return DEFAULT_PROJECTS;
  });

  // 2. Selected Week: Default to Week 1
  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    const saved = localStorage.getItem('burak_portal_selected_week_v2');
    return saved ? parseInt(saved, 10) : 1;
  });

  // 3. Personal Notes State with localStorage persistence
  const [notes, setNotes] = useState<PersonalNote[]>(() => {
    const saved = localStorage.getItem('burak_portal_notes_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
    return INITIAL_NOTES;
  });

  // 4. UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<WeeklyProject | null>(null);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Sync projects to localStorage
  useEffect(() => {
    localStorage.setItem('burak_portal_projects_v2', JSON.stringify(projects));
  }, [projects]);

  // Sync notes to localStorage
  useEffect(() => {
    localStorage.setItem('burak_portal_notes_v2', JSON.stringify(notes));
  }, [notes]);

  // Sync selected week
  const handleSelectWeek = (week: number) => {
    setSelectedWeek(week);
    localStorage.setItem('burak_portal_selected_week_v2', week.toString());
  };

  // Find active project
  const activeProject =
    projects.find((p) => p.week === selectedWeek) ||
    projects[0] ||
    DEFAULT_PROJECTS[0];

  // Completed count
  const completedCount = projects.filter((p) => p.status === 'completed').length;

  // Project update handler
  const handleSaveProject = (updated: WeeklyProject) => {
    setProjects((prev) =>
      prev.map((p) => (p.week === updated.week ? updated : p))
    );
  };

  // Direct status toggle
  const handleToggleStatus = (newStatus: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.week === selectedWeek ? { ...p, status: newStatus } : p))
    );
  };

  // Edit project trigger
  const handleOpenEditModal = (proj?: WeeklyProject) => {
    setEditingProject(proj || activeProject);
    setIsEditModalOpen(true);
  };

  // Add note handler
  const handleAddNote = (newNoteData: Omit<PersonalNote, 'id' | 'createdAt'>) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newNote: PersonalNote = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      createdAt: dateFormatted,
    };

    setNotes((prev) => [newNote, ...prev]);
  };

  // Delete note handler
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Toggle pin handler
  const handleTogglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 antialiased select-none">
      {/* 1. Header Bar: Burak TURGUT Web Portal */}
      <Header
        activeProject={activeProject}
        completedCount={completedCount}
        totalCount={projects.length}
        onOpenNewNote={() => setIsAddNoteModalOpen(true)}
        onOpenEditModal={() => handleOpenEditModal(activeProject)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Main 3-Column Studio Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: 30-Week Clickable Menu (Compact, expandable accordion/dropdown) */}
        <WeeklyMenu
          projects={projects}
          selectedWeek={selectedWeek}
          onSelectWeek={handleSelectWeek}
          onEditProject={handleOpenEditModal}
          searchQuery={searchQuery}
        />

        {/* Center: Selected Week Project Showcase & Workspace */}
        <ProjectShowcase
          project={activeProject}
          onEditProject={() => handleOpenEditModal(activeProject)}
          onToggleStatus={handleToggleStatus}
          allProjects={projects}
          onSelectWeek={handleSelectWeek}
        />

        {/* Right: Personal Notes & Live Clock Dashboard */}
        <RightSidebar
          notes={notes}
          onAddNote={() => setIsAddNoteModalOpen(true)}
          onDeleteNote={handleDeleteNote}
          onTogglePin={handleTogglePinNote}
          selectedWeek={selectedWeek}
        />
      </div>

      {/* Edit Project Modal */}
      {isEditModalOpen && editingProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onSave={handleSaveProject}
        />
      )}

      {/* Add Note Modal */}
      {isAddNoteModalOpen && (
        <AddNoteModal
          isOpen={isAddNoteModalOpen}
          onClose={() => setIsAddNoteModalOpen(false)}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
}
