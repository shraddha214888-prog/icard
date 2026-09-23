import React, { useState, useEffect } from 'react';
import { SchoolSettings, Student } from './types/student';
import {
  getStoredSettings,
  getStoredStudents,
  saveSettings,
  saveStudents,
} from './utils/storage';
import { DEFAULT_SCHOOL_SETTINGS, INITIAL_STUDENTS } from './data/initialData';
import { exportStudentsToCsv } from './utils/csvHelper';
import { Header } from './components/Header';
import { StudentList } from './components/StudentList';
import { StudentFormModal } from './components/StudentFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CardPreviewModal } from './components/CardPreviewModal';
import { PrintSheetModal } from './components/PrintSheetModal';
import { CardSettingsModal } from './components/CardSettingsModal';
import { BatchImportModal } from './components/BatchImportModal';
import {
  Users,
  GraduationCap,
  Printer,
  Sparkles,
  CheckCircle,
  FileCheck,
  ShieldCheck,
  IdCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [studentToPreview, setStudentToPreview] = useState<Student | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [isPrintSheetOpen, setIsPrintSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBatchImportOpen, setIsBatchImportOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial load
  useEffect(() => {
    setStudents(getStoredStudents());
    setSettings(getStoredSettings());
  }, []);

  // Sync to storage
  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    saveStudents(newStudents);
  };

  const updateSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Handlers
  const handleAddNew = () => {
    setStudentToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsFormOpen(true);
  };

  const handleSaveStudent = (saved: Student) => {
    if (studentToEdit) {
      // Edit
      const updated = students.map((s) => (s.id === saved.id ? saved : s));
      updateStudents(updated);
      showToast(`વિદ્યાર્થી "${saved.name}" ની માહિતી સફળતાપૂર્વક અપડેટ કરવામાં આવી.`);
    } else {
      // Add new
      const updated = [saved, ...students];
      updateStudents(updated);
      showToast(`નવો વિદ્યાર્થી "${saved.name}" (GR: ${saved.grNo}) ઉમેરાયો.`);
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      } catch {
        // ignore
      }
    }
  };

  const handleDeleteRequest = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      const updated = students.filter((s) => s.id !== studentToDelete.id);
      updateStudents(updated);
      setSelectedIds((prev) => prev.filter((id) => id !== studentToDelete.id));
      showToast(`વિદ્યાર્થી "${studentToDelete.name}" (GR: ${studentToDelete.grNo}) ડિલીટ કર્યો.`);
      setIsDeleteOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleBatchDelete = (ids: string[]) => {
    if (window.confirm(`શું તમે પસંદ કરેલા ${ids.length} વિદ્યાર્થીઓને ડિલીટ કરવા માંગો છો?`)) {
      const updated = students.filter((s) => !ids.includes(s.id));
      updateStudents(updated);
      setSelectedIds([]);
      showToast(`${ids.length} વિદ્યાર્થીઓ ડિલીટ કર્યા.`);
    }
  };

  const handleViewCard = (student: Student) => {
    setStudentToPreview(student);
    setIsPreviewOpen(true);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(students.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleExportCsv = () => {
    exportStudentsToCsv(students);
    showToast('વિદ્યાર્થીઓની Excel/CSV ફાઇલ ડાઉનલોડ થઈ ગઈ.');
  };

  const handleImportCsv = (imported: Student[]) => {
    // Avoid duplicate GR numbers
    const existingGrs = new Set(students.map((s) => s.grNo));
    const newOnes = imported.filter((s) => !existingGrs.has(s.grNo));
    const combined = [...students, ...newOnes];
    updateStudents(combined);
    showToast(`${newOnes.length} નવા વિદ્યાર્થીઓ સફળતાપૂર્વક ઉમેરાયા.`);
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'શું તમે ડિફોલ્ટ નમૂનાનો ડેટા ફરીથી લાવવા માંગો છો? તમારા ફેરફારો પુનઃસ્થાપિત થશે.'
      )
    ) {
      updateStudents(INITIAL_STUDENTS);
      updateSettings(DEFAULT_SCHOOL_SETTINGS);
      setSelectedIds([]);
      showToast('શાળા અને વિદ્યાર્થીઓનો નમૂનાનો ડેટા પુનઃસ્થાપિત કરાયો.');
    }
  };

  // Quick stats
  const totalStudents = students.length;
  const maleCount = students.filter((s) => s.gender === 'male').length;
  const femaleCount = students.filter((s) => s.gender === 'female').length;
  const uniqueStandards = new Set(students.map((s) => s.standard)).size;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Toast message popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        settings={settings}
        students={students}
        onAddNew={handleAddNew}
        onOpenPrintSheet={() => setIsPrintSheetOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* School Overview & Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                કુલ વિદ્યાર્થીઓ
              </div>
              <div className="text-xl font-black text-slate-900 leading-tight">
                {totalStudents}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                સક્રિય ધોરણો
              </div>
              <div className="text-xl font-black text-slate-900 leading-tight">
                {uniqueStandards} ધોરણ
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <IdCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                કુમાર / કન્યા
              </div>
              <div className="text-sm font-bold text-slate-900 leading-tight">
                <span className="text-blue-700">{maleCount}</span> / <span className="text-pink-600">{femaleCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                આઈકાર્ડ પ્રિન્ટ
              </div>
              <button
                onClick={() => setIsPrintSheetOpen(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 underline flex items-center gap-1 cursor-pointer"
              >
                A4 શીટ તૈયાર કરો →
              </button>
            </div>
          </div>
        </div>

        {/* Informative Guidance Banner for Teachers */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 font-bold text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              નાની ઉમરવાણ પ્રાથમિક શાળા • UDISE 24170307402
            </div>
            <h2 className="text-base sm:text-lg font-bold">
              વિદ્યાર્થીઓના આઈકાર્ડ સરળતાથી બનાવો અને પ્રિન્ટ કરો
            </h2>
            <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
              દરેક વિદ્યાર્થીના કાર્ડમાં <strong>જનરલ રજિસ્ટર નંબર (G.R. No.)</strong> અને <strong>જન્મ તારીખ (Birthday)</strong> મુખ્ય સ્વરૂપે દર્શાવાય છે. તમે નવો વિદ્યાર્થી ઉમેરી શકો છો, સુધારી શકો છો અથવા ડિલીટ કરી શકો છો.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              + નવું નામ ઉમેરો
            </button>
            <button
              onClick={() => setIsPrintSheetOpen(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
            >
              A4 પ્રિન્ટ શીટ
            </button>
          </div>
        </div>

        {/* Student List & Grid */}
        <StudentList
          students={students}
          settings={settings}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
          onViewCard={handleViewCard}
          onBatchDelete={handleBatchDelete}
          onOpenBatchImport={() => setIsBatchImportOpen(true)}
          onExportCsv={handleExportCsv}
          onOpenPrintSheet={() => setIsPrintSheetOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-800">
            {settings.schoolNameGu} (Nani Umarvan Primary School)
          </p>
          <p>
            UDISE કોડ: <strong className="font-mono text-blue-900">{settings.udise}</strong> • શિક્ષણ વિભાગ, ગુજરાત સરકાર
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            વિદ્યાર્થી આઈકાર્ડ સોફ્ટવેર • G.R. નંબર અને જન્મ તારીખ સાથે ઓળખપત્ર નિર્માણ
          </p>
        </div>
      </footer>

      {/* Modals */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
        existingStudents={students}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        student={studentToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <CardPreviewModal
        isOpen={isPreviewOpen}
        student={studentToPreview}
        settings={settings}
        onClose={() => setIsPreviewOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <PrintSheetModal
        isOpen={isPrintSheetOpen}
        students={students}
        settings={settings}
        selectedIds={selectedIds}
        onClose={() => setIsPrintSheetOpen(false)}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      <CardSettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        sampleStudent={students[0] || INITIAL_STUDENTS[0]}
        onClose={() => setIsSettingsOpen(false)}
        onSave={updateSettings}
      />

      <BatchImportModal
        isOpen={isBatchImportOpen}
        onClose={() => setIsBatchImportOpen(false)}
        onImport={handleImportCsv}
      />
    </div>
  );
}
