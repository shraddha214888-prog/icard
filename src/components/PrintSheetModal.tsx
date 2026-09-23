import React, { useState } from 'react';
import { SchoolSettings, Student } from '../types/student';
import { StudentCard } from './StudentCard';
import { X, Printer, CheckSquare, Square, Layers, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrintSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  settings: SchoolSettings;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({
  isOpen,
  onClose,
  students,
  settings,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
}) => {
  const [printFilter, setPrintFilter] = useState<'all' | 'selected'>('all');
  const [printSide, setPrintSide] = useState<'front' | 'back' | 'both'>('front');

  if (!isOpen) return null;

  const targetStudents =
    printFilter === 'selected'
      ? students.filter((s) => selectedIds.includes(s.id))
      : students;

  const handlePrint = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-xs overflow-hidden">
      {/* Control Bar (Hidden when printing via .no-print) */}
      <div className="no-print bg-slate-900 border-b border-slate-700 px-6 py-3 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              A4 આઈકાર્ડ પ્રિન્ટ શીટ (A4 Sheet Print Preview)
              <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                {targetStudents.length} કાર્ડ્સ
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              નાની ઉમરવાણ પ્રા. શાળા • UDISE: 24170307402 • કટીંગ ગાઈડલાઇન સાથે
            </p>
          </div>
        </div>

        {/* Filters and Print Options */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Print Target */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setPrintFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                printFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              બધા ({students.length})
            </button>
            <button
              onClick={() => setPrintFilter('selected')}
              disabled={selectedIds.length === 0}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                printFilter === 'selected'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : selectedIds.length === 0
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              પસંદ કરેલા ({selectedIds.length})
            </button>
          </div>

          {/* Side Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setPrintSide('front')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                printSide === 'front'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              આગળની બાજુ (Front)
            </button>
            <button
              onClick={() => setPrintSide('back')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                printSide === 'back'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              પાછળની બાજુ (Back)
            </button>
            <button
              onClick={() => setPrintSide('both')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                printSide === 'both'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              બંને બાજુ (Both)
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            હમણાં પ્રિન્ટ કરો (Print Now)
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/40 flex justify-center">
        {targetStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-300 bg-white/10 rounded-2xl max-w-md m-auto text-center border border-white/10">
            <Printer className="w-12 h-12 text-slate-400 mb-3" />
            <h3 className="font-bold text-base text-white">કોઈ વિદ્યાર્થી પસંદ નથી</h3>
            <p className="text-xs text-slate-400 mt-1">
              કૃપા કરીને વિદ્યાર્થીઓ પસંદ કરો અથવા &apos;બધા વિદ્યાર્થીઓ&apos; વિકલ્પ રાખો.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-[210mm] space-y-8">
            {/* FRONT SHEET */}
            {(printSide === 'front' || printSide === 'both') && (
              <div className="bg-white p-[10mm] shadow-2xl rounded-sm text-slate-900 min-h-[297mm] box-border border border-slate-300 page-break-after">
                {/* Printable Header strip (visible in print) */}
                <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-4 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">{settings.schoolNameGu} - ઓળખકાર્ડ પ્રિન્ટ શીટ</span>
                  <span>UDISE: {settings.udise} • ધોરણ પ્રમાણિત</span>
                  <span className="font-mono text-slate-500">Page Front • A4</span>
                </div>

                {/* Cards Grid */}
                <div
                  className={`grid ${
                    settings.orientation === 'vertical'
                      ? 'grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4'
                      : 'grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4'
                  } justify-items-center`}
                >
                  {targetStudents.map((student) => (
                    <div key={`front-${student.id}`} className="relative p-1.5 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                      {/* Cutting guide crosshairs */}
                      <span className="absolute -top-1.5 -left-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>
                      <span className="absolute -top-1.5 -right-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>
                      <span className="absolute -bottom-1.5 -left-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>
                      <span className="absolute -bottom-1.5 -right-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>

                      <StudentCard
                        student={student}
                        settings={settings}
                        side="front"
                        isPrintPreview={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BACK SHEET (If selected) */}
            {(printSide === 'back' || printSide === 'both') && (
              <div className="bg-white p-[10mm] shadow-2xl rounded-sm text-slate-900 min-h-[297mm] box-border border border-slate-300 page-break-after">
                <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-4 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">{settings.schoolNameGu} - કાર્ડ પાછળની બાજુ (Back Side)</span>
                  <span>UDISE: {settings.udise}</span>
                  <span className="font-mono text-slate-500">Page Back • A4</span>
                </div>

                <div
                  className={`grid ${
                    settings.orientation === 'vertical'
                      ? 'grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4'
                      : 'grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4'
                  } justify-items-center`}
                >
                  {targetStudents.map((student) => (
                    <div key={`back-${student.id}`} className="relative p-1.5 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
                      <span className="absolute -top-1.5 -left-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>
                      <span className="absolute -top-1.5 -right-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>
                      <span className="absolute -bottom-1.5 -left-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>
                      <span className="absolute -bottom-1.5 -right-1.5 text-slate-400 text-[9px] font-mono leading-none">+</span>

                      <StudentCard
                        student={student}
                        settings={settings}
                        side="back"
                        isPrintPreview={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
