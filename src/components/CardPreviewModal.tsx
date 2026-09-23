import React, { useState } from 'react';
import { SchoolSettings, Student } from '../types/student';
import { StudentCard } from './StudentCard';
import { X, Printer, Edit2, Trash2, RotateCw } from 'lucide-react';

interface CardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  settings: SchoolSettings;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const CardPreviewModal: React.FC<CardPreviewModalProps> = ({
  isOpen,
  onClose,
  student,
  settings,
  onEdit,
  onDelete,
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  if (!isOpen || !student) return null;

  const handlePrintSingle = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xl w-full border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 px-5 py-3.5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span>{student.name}</span>
              <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full font-mono">
                GR: {student.grNo}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              ધોરણ {student.standard} {student.division ? `(${student.division})` : ''} • જન્મ: {student.dob}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card View Canvas */}
        <div className="p-6 bg-slate-100/80 flex flex-col items-center justify-center min-h-[380px]">
          {/* Side Toggle Pill */}
          <div className="flex items-center gap-2 mb-4 bg-white p-1 rounded-xl shadow-xs border border-slate-200">
            <button
              onClick={() => setSide('front')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                side === 'front' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              આગળની બાજુ (Front)
            </button>
            <button
              onClick={() => setSide('back')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                side === 'back' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              પાછળની બાજુ (Back)
            </button>
            <button
              onClick={() => setSide(side === 'front' ? 'back' : 'front')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              title="ફેરવો (Flip Card)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Actual Card Render */}
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <StudentCard
              student={student}
              settings={settings}
              side={side}
              isPrintPreview={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
              સુધારો (Edit)
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(student);
              }}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              ડિલીટ (Delete)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium"
            >
              બંધ કરો
            </button>
            <button
              onClick={handlePrintSingle}
              className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              પ્રિન્ટ કરો (Print)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
