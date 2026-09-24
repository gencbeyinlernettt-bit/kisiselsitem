import React, { useState, useEffect } from 'react';
import {
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Pin,
  Trash2,
  Copy,
  Check,
  Plus,
  Search,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  FileText,
  ListTodo,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { PersonalNote } from '../types';

interface RightSidebarProps {
  notes: PersonalNote[];
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  selectedWeek: number;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onTogglePin,
  selectedWeek,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'notes' | 'clock_focus' | 'scratchpad'>('notes');
  const [noteSearch, setNoteSearch] = useState('');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Scratchpad State with LocalStorage
  const [scratchpad, setScratchpad] = useState(() => {
    return (
      localStorage.getItem('burak_scratchpad') ||
      '# Burak TURGUT Not Defteri\n- 1. Hafta Google Drive bağlantısı kontrol edildi.\n- Haftalık tasarım ve kod güncellemeleri.'
    );
  });
  const [savedStatus, setSavedStatus] = useState(false);

  // Pomodoro Timer State
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  // Weekly tasks
  const [weeklyTasks, setWeeklyTasks] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    const saved = localStorage.getItem(`burak_tasks_w${selectedWeek}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: '1', text: `${selectedWeek}. Hafta tasarım ve arayüz kontrolü`, done: true },
      { id: '2', text: 'Responsive (Mobil/Tablet) ekran testleri', done: true },
      { id: '3', text: 'Canlı bağlantı ve buton işlevsellik kontrolü', done: false },
      { id: '4', text: 'Haftalık dokümantasyon ve not özeti', done: false },
    ];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      if (timerMode === 'focus') {
        alert('🎉 25 dakikalık odak seansı tamamlandı! 5 dakika mola verin.');
        setTimerMode('break');
        setPomodoroSeconds(5 * 60);
      } else {
        alert('☕ Mola bitti! Yeni odak seansına başlayabilirsiniz.');
        setTimerMode('focus');
        setPomodoroSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds, timerMode]);

  useEffect(() => {
    const saved = localStorage.getItem(`burak_tasks_w${selectedWeek}`);
    if (saved) {
      try {
        setWeeklyTasks(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setWeeklyTasks([
      { id: '1', text: `${selectedWeek}. Hafta tasarım ve arayüz kontrolü`, done: selectedWeek <= 18 },
      { id: '2', text: 'Responsive (Mobil/Tablet) ekran testleri', done: selectedWeek <= 18 },
      { id: '3', text: 'Canlı bağlantı ve buton kontrolü', done: selectedWeek <= 18 },
      { id: '4', text: 'Haftalık dokümantasyon ve not özeti', done: false },
    ]);
  }, [selectedWeek]);

  const toggleTask = (taskId: string) => {
    const updated = weeklyTasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t));
    setWeeklyTasks(updated);
    localStorage.setItem(`burak_tasks_w${selectedWeek}`, JSON.stringify(updated));
  };

  const handleScratchpadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setScratchpad(val);
    localStorage.setItem('burak_scratchpad', val);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 1500);
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const hours = currentTime.getHours();
  let greeting = 'İyi Günler';
  if (hours >= 5 && hours < 12) greeting = 'Günaydın';
  else if (hours >= 12 && hours < 18) greeting = 'İyi Günler';
  else if (hours >= 18 && hours < 23) greeting = 'İyi Akşamlar';
  else greeting = 'İyi Geceler';

  const timeString = currentTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const filteredNotes = notes.filter((n) => {
    return (
      n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.category.toLowerCase().includes(noteSearch.toLowerCase())
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <aside className="w-80 lg:w-88 border-l border-slate-200 bg-white flex flex-col shrink-0 z-20 overflow-hidden shadow-xs">
      {/* 1. Live Clock & Greeting Card */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-cyan-800">{greeting}, Burak Bey</span>
          <span className="font-mono text-[11px] text-slate-400">TRT · UTC+3</span>
        </div>

        {/* Digital Clock Display */}
        <div className="flex items-baseline gap-2 mt-1">
          <div className="text-3xl lg:text-4xl font-mono font-extrabold tracking-tight text-slate-900 tabular-nums">
            {timeString}
          </div>
        </div>

        {/* Turkish Date Display */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-cyan-700" />
          <span className="capitalize font-medium">{dateString}</span>
        </div>

        {/* Focus / Pomodoro Bar */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-medium">
              {timerMode === 'focus' ? 'Odak Sayacı' : 'Mola'}
            </span>
            <span className="font-mono font-bold text-cyan-700 tabular-nums">
              {Math.floor(pomodoroSeconds / 60)}:{String(pomodoroSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
              title={isTimerRunning ? 'Duraklat' : 'Başlat'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setPomodoroSeconds(25 * 60);
                setTimerMode('focus');
              }}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
              title="Sıfırla (25 dk)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50 text-xs px-2 pt-1">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'notes'
              ? 'border-cyan-600 text-cyan-800 bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Bana Ait Notlar</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 rounded-full text-slate-700 font-mono font-semibold">
            {notes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scratchpad')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'scratchpad'
              ? 'border-cyan-600 text-cyan-800 bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Karalama</span>
        </button>

        <button
          onClick={() => setActiveTab('clock_focus')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
            activeTab === 'clock_focus'
              ? 'border-cyan-600 text-cyan-800 bg-white font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>Görevler</span>
        </button>
      </div>

      {/* Tab Content 1: Personal Notes */}
      {activeTab === 'notes' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="p-3 border-b border-slate-200 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Notlarda ara..."
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white"
              />
            </div>
            <button
              onClick={onAddNote}
              className="p-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors shadow-xs"
              title="Yeni Not Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/40">
            {sortedNotes.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                {noteSearch ? 'Aramaya uygun not bulunamadı.' : 'Henüz not eklenmedi. Yeni not oluşturun.'}
              </div>
            ) : (
              sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border transition-all text-xs ${
                    note.isPinned
                      ? 'bg-cyan-50/60 border-cyan-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5 leading-snug">
                      {note.isPinned && <Pin className="w-3 h-3 text-cyan-600 fill-cyan-600 shrink-0" />}
                      <span>{note.title}</span>
                    </h3>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleCopyNote(note.id, `${note.title}\n\n${note.content}`)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Metni Kopyala"
                      >
                        {copiedNoteId === note.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => onTogglePin(note.id)}
                        className={`p-1 transition-colors ${
                          note.isPinned ? 'text-cyan-700' : 'text-slate-400 hover:text-slate-700'
                        }`}
                        title={note.isPinned ? 'Sabitlemeyi Kaldır' : 'Başa Sabitle'}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Notu Sil"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-700 text-[11px] whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                    <span className="text-cyan-700 font-semibold">{note.category}</span>
                    <span>{note.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Scratchpad */}
      {activeTab === 'scratchpad' && (
        <div className="flex-1 flex flex-col p-3 overflow-hidden bg-white">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span>Hızlı Karalama (Otomatik Kayıt)</span>
            {savedStatus ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" /> Kaydedildi
              </span>
            ) : (
              <span className="text-slate-400">Yerel Hafıza</span>
            )}
          </div>
          <textarea
            value={scratchpad}
            onChange={handleScratchpadChange}
            placeholder="Geçici komutlar, bağlantılar veya aklınıza gelen kod satırlarını buraya yazın..."
            className="flex-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white resize-none leading-relaxed"
          />
        </div>
      )}

      {/* Tab Content 3: Weekly Tasks */}
      {activeTab === 'clock_focus' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-xs font-bold text-slate-900 mb-1">
              {selectedWeek}. Hafta Kontrol Listesi
            </h3>
            <p className="text-[11px] text-slate-500 mb-3">
              Bu haftaki çalışma adımlarını işaretleyin:
            </p>

            <div className="space-y-2">
              {weeklyTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-start gap-2.5 text-left group p-1.5 rounded hover:bg-slate-200/50 transition-colors cursor-pointer"
                >
                  {task.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 mt-0.5" />
                  )}
                  <span
                    className={`text-xs ${
                      task.done ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Profile Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-600" />
          <span className="font-semibold text-slate-800">Burak TURGUT</span>
        </div>
        <span className="text-slate-500 font-mono">Web Portal</span>
      </div>
    </aside>
  );
};
