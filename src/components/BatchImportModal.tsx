import React, { useState, useRef } from 'react';
import { Student } from '../types/student';
import { parseStudentsFromCsv } from '../utils/csvHelper';
import { Download, FileSpreadsheet, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: Student[]) => void;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [csvContent, setCsvContent] = useState('');
  const [parsed, setParsed] = useState<Student[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
        processCsv(text);
      };
      reader.readAsText(file);
    }
  };

  const processCsv = (text: string) => {
    try {
      const students = parseStudentsFromCsv(text);
      if (students.length === 0) {
        setError('CSV ફાઇલમાં કોઈ માન્ય વિદ્યાર્થી મળ્યા નથી.');
        setParsed([]);
      } else {
        setError('');
        setParsed(students);
      }
    } catch {
      setError('CSV ફોર્મેટ યોગ્ય નથી.');
      setParsed([]);
    }
  };

  const handleDownloadTemplate = () => {
    const template =
      'GR_No,Full_Name_Gujarati,Full_Name_English,DOB_YYYY_MM_DD,Standard,Division,Roll_No,Gender,Blood_Group,Parent_Name,Mobile_No,Address\n' +
      '1251,પટેલ ક્રિશ વિનોદભાઈ,Patel Krish Vinodbhai,2016-04-12,૩,A,15,male,B+,વિનોદભાઈ પટેલ,9876543210,નાની ઉમરવાણ\n' +
      '1252,જોષી પ્રિયા મનોજભાઈ,Joshi Priya Manojbhai,2015-09-20,૪,A,06,female,A+,મનોજભાઈ જોષી,9724110000,નાની ઉમરવાણ\n';

    const blob = new Blob(['\uFEFF' + template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Nani_Umarvan_Students_Template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = () => {
    if (parsed.length > 0) {
      onImport(parsed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-emerald-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">CSV / એક્સેલ ફાઇલ દ્વારા વિદ્યાર્થીઓ ઉમેરો</h2>
              <p className="text-xs text-emerald-200">એકસાથે ઘણા વિદ્યાર્થીઓના આઈકાર્ડ બનાવો</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Step 1: Download Template */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-800">નમૂના (Template) ડાઉનલોડ કરો</div>
              <div className="text-[11px] text-slate-500">
                G.R. નંબર, નામ, જન્મ તારીખ સહિતનું Excel / CSV માળખું
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              નમૂનો ડાઉનલોડ
            </button>
          </div>

          {/* Step 2: Upload CSV */}
          <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center bg-emerald-50/40">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-emerald-600 mb-2" />
              <div className="font-bold text-xs text-slate-800 mb-1">
                તૈયાર કરેલી .CSV ફાઇલ અહીં પસંદ કરો
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm mb-3">
                UDISE: 24170307402 માટે વિદ્યાર્થી યાદી એક સાથે અપલોડ થઈ જશે.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                ફાઇલ પસંદ કરો (Select CSV File)
              </button>
            </div>
          </div>

          {/* Parsing Feedback */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {parsed.length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{parsed.length}</strong> વિદ્યાર્થીઓ સફળતાપૂર્વક ચકાસાયા!
                </span>
              </div>
              <span className="font-mono text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                GR: {parsed[0].grNo} થી {parsed[parsed.length - 1].grNo}
              </span>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            રદ કરો
          </button>
          <button
            type="button"
            disabled={parsed.length === 0}
            onClick={handleConfirmImport}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              parsed.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            વિદ્યાર્થીઓ ઉમેરો ({parsed.length})
          </button>
        </div>
      </div>
    </div>
  );
};
