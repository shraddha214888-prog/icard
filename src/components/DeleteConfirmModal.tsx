import React from 'react';
import { Student } from '../types/student';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  student,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center gap-3 text-rose-600 mb-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                વિદ્યાર્થી ડિલીટ કરવો છે? (Delete Student)
              </h3>
              <p className="text-xs text-slate-500">આ પ્રક્રિયા પૂર્વવત્ કરી શકાશે નહીં.</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700 mb-5">
            <div className="flex justify-between">
              <span className="text-slate-500">વિદ્યાર્થીનું નામ:</span>
              <strong className="text-slate-900">{student.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">G.R. નંબર:</span>
              <strong className="font-mono text-blue-900">{student.grNo}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ધોરણ:</span>
              <span>{student.standard} {student.division ? `(${student.division})` : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">જન્મ તારીખ:</span>
              <span className="font-mono">{student.dob}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              ના, રદ કરો (Cancel)
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              હા, ડિલીટ કરો (Delete)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
