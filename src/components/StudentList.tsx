import React, { useState, useMemo } from 'react';
import { SchoolSettings, Student } from '../types/student';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Download,
  Filter,
  LayoutGrid,
  List,
  Printer,
  Calendar,
  Hash,
  User,
  Users
} from 'lucide-react';
import { StudentCard } from './StudentCard';

interface StudentListProps {
  students: Student[];
  settings: SchoolSettings;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onAddNew: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onViewCard: (student: Student) => void;
  onBatchDelete: (ids: string[]) => void;
  onOpenBatchImport: () => void;
  onExportCsv: () => void;
  onOpenPrintSheet: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  settings,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onAddNew,
  onEdit,
  onDelete,
  onViewCard,
  onBatchDelete,
  onOpenBatchImport,
  onExportCsv,
  onOpenPrintSheet,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const standards = ['all', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', 'બાલવાટિકા'];

  // Filter students by search term and standard
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nameEn && s.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.grNo.includes(searchTerm) ||
        (s.parentName && s.parentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.dob && s.dob.includes(searchTerm));

      const matchesStandard =
        selectedStandard === 'all' || s.standard === selectedStandard;

      return matchesSearch && matchesStandard;
    });
  }, [students, searchTerm, selectedStandard]);

  const areAllFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedIds.includes(s.id));

  const handleToggleSelectAllFiltered = () => {
    if (areAllFilteredSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="વિદ્યાર્થીનું નામ, G.R. નંબર કે જન્મ તારીખ શોધો..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                સાફ કરો
              </button>
            )}
          </div>

          {/* Action Buttons: Add Student & Batch Print */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onAddNew}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              નવો વિદ્યાર્થી (Add Student)
            </button>

            <button
              onClick={onOpenPrintSheet}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              A4 પ્રિન્ટ શીટ ({selectedIds.length > 0 ? selectedIds.length : students.length})
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="યાદી વ્યૂ (Table View)"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="કાર્ડ ગેલેરી (Card Gallery)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Toolbar: Standards filter & Quick utilities */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Class / Standard Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> ધોરણ:
            </span>
            {standards.map((std) => (
              <button
                key={std}
                onClick={() => setSelectedStandard(std)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedStandard === std
                    ? 'bg-blue-900 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {std === 'all' ? `બધા (${students.length})` : `ધોરણ ${std}`}
              </button>
            ))}
          </div>

          {/* Excel / CSV Tools & Batch Actions */}
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={() => onBatchDelete(selectedIds)}
                className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                પસંદ કરેલા {selectedIds.length} ડિલીટ કરો
              </button>
            )}

            <button
              onClick={onOpenBatchImport}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="CSV આયાત કરો"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              CSV ઉમેરો
            </button>

            <button
              onClick={onExportCsv}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
              title="CSV ડાઉનલોડ કરો"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              એક્સપોર્ટ
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Content */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            કોઈ વિદ્યાર્થી મળ્યા નથી
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            શોધવામાં આવેલા શબ્દ કે પસંદ કરેલા ધોરણ માટે કોઈ વિદ્યાર્થી નોંધાયેલ નથી.
          </p>
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            નવા વિદ્યાર્થીનું નામ ઉમેરો
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                  <th className="p-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleToggleSelectAllFiltered}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      title={areAllFilteredSelected ? 'બધા નાપસંદ કરો' : 'બધા પસંદ કરો'}
                    >
                      {areAllFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3">ફોટો</th>
                  <th className="p-3">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-blue-600" /> G.R. નંબર
                    </span>
                  </th>
                  <th className="p-3">વિદ્યાર્થીનું નામ</th>
                  <th className="p-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" /> જન્મ તારીખ
                    </span>
                  </th>
                  <th className="p-3">ધોરણ/વર્ગ</th>
                  <th className="p-3">બ્લડ ગ્રૂપ</th>
                  <th className="p-3">વાલી / સંપર્ક</th>
                  <th className="p-3 text-right">ક્રિયાઓ (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const isSelected = selectedIds.includes(student.id);
                  const avatarFallback =
                    student.gender === 'female'
                      ? 'https://api.dicebear.com/7.x/adventurer/svg?seed=Girl' + student.grNo
                      : 'https://api.dicebear.com/7.x/adventurer/svg?seed=Boy' + student.grNo;

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50/70' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleSelect(student.id)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="p-3">
                        <div className="w-9 h-11 rounded border border-amber-400 overflow-hidden bg-slate-100 shadow-xs shrink-0">
                          <img
                            src={student.photoUrl || avatarFallback}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = avatarFallback;
                            }}
                          />
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-mono font-bold text-xs border border-blue-200">
                          {student.grNo}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {student.name}
                        </div>
                        {student.nameEn && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            {student.nameEn}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                          {formatDate(student.dob)}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-semibold text-slate-800">
                          ધોરણ {student.standard} {student.division ? `(${student.division})` : ''}
                        </span>
                        {student.rollNo && (
                          <div className="text-[11px] text-slate-500">
                            રોલ નં: {student.rollNo}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        {student.bloodGroup ? (
                          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200 text-xs">
                            {student.bloodGroup}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="text-slate-800 font-medium truncate max-w-[130px]">
                          {student.parentName || '-'}
                        </div>
                        {student.contactNumber && (
                          <div className="text-[11px] text-slate-500 font-mono">
                            {student.contactNumber}
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewCard(student)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                            title="આઈકાર્ડ જુઓ (View ID Card)"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEdit(student)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            title="માહિતી સુધારો (Edit)"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDelete(student)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="વિદ્યાર્થી ડિલીટ કરો (Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              કુલ વિદ્યાર્થીઓ: <strong>{filteredStudents.length}</strong> / <strong>{students.length}</strong>
            </span>
            <span>
              શાળા: <strong className="text-slate-900">{settings.schoolNameGu}</strong> • UDISE: <strong className="font-mono text-blue-900">{settings.udise}</strong>
            </span>
          </div>
        </div>
      ) : (
        /* CARD GALLERY VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="transform transition-transform group-hover:-translate-y-1">
                <StudentCard
                  student={student}
                  settings={settings}
                  side="front"
                  isPrintPreview={false}
                />
              </div>

              {/* Action Bar beneath each card */}
              <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-200">
                <button
                  onClick={() => onViewCard(student)}
                  className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> જુઓ
                </button>
                <button
                  onClick={() => onEdit(student)}
                  className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> સુધારો
                </button>
                <button
                  onClick={() => onDelete(student)}
                  className="p-1 rounded text-rose-600 hover:bg-rose-50"
                  title="ડિલીટ કરો"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
