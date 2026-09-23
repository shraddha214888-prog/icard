import React from 'react';
import { SchoolSettings, Student } from '../types/student';
import { SchoolEmblem } from './SchoolLogo';
import {
  Plus,
  Printer,
  Sliders,
  RotateCcw,
  Sparkles,
  School,
  IdCard,
} from 'lucide-react';

interface HeaderProps {
  settings: SchoolSettings;
  students: Student[];
  onAddNew: () => void;
  onOpenPrintSheet: () => void;
  onOpenSettings: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  students,
  onAddNew,
  onOpenPrintSheet,
  onOpenSettings,
  onResetData,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner / Gujarat State bar */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200 text-[11px] sm:text-xs">
            ગુજરાત પ્રાથમિક શિક્ષણ વિભાગ • શાળા આઈકાર્ડ નિર્માણ સોફ્ટવેર
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="bg-amber-400 text-blue-950 font-bold px-2 py-0.5 rounded shadow-xs">
            UDISE: {settings.udise}
          </span>
          <span className="text-slate-300 hidden sm:inline">
            સત્ર: {settings.academicYear}
          </span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* School Branding */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <SchoolEmblem size={48} className="shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                {settings.schoolNameGu}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 text-[11px] font-bold rounded-full border border-blue-200">
                <IdCard className="w-3 h-3 text-blue-600" /> આઈકાર્ડ સોફ્ટવેર
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span>{settings.schoolNameEn}</span>
              <span>•</span>
              <span className="font-mono text-blue-700 font-bold">UDISE: {settings.udise}</span>
              <span>•</span>
              <span>કુલ {students.length} વિદ્યાર્થીઓ</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenSettings}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="કાર્ડ કલર, થીમ અને શાળા માહિતી બદલો"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-700" />
            કાર્ડ ડિઝાઇન (Settings)
          </button>

          <button
            onClick={onOpenPrintSheet}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="A4 શીટમાં પ્રિન્ટ કરો"
          >
            <Printer className="w-3.5 h-3.5" />
            A4 પ્રિન્ટ શીટ ({students.length})
          </button>

          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            વિદ્યાર્થી ઉમેરો
          </button>

          <button
            onClick={onResetData}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="નમૂનાનો ડેટા ફરીથી લાવો (Reset Sample Data)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
