import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types/student';
import { X, Upload, Camera, Sparkles, User, Hash, Calendar } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
  existingStudents: Student[];
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  existingStudents,
}) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    nameEn: '',
    grNo: '',
    dob: '',
    standard: '૧',
    division: 'A',
    rollNo: '',
    gender: 'male',
    bloodGroup: 'B+',
    parentName: '',
    contactNumber: '',
    address: 'નાની ઉમરવાણ',
    photoUrl: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set next suggested GR No if creating new
  useEffect(() => {
    if (studentToEdit) {
      setFormData(studentToEdit);
    } else {
      let nextGr = '1251';
      if (existingStudents.length > 0) {
        const grNumbers = existingStudents
          .map((s) => parseInt(s.grNo, 10))
          .filter((n) => !isNaN(n));
        if (grNumbers.length > 0) {
          nextGr = `${Math.max(...grNumbers) + 1}`;
        }
      }

      setFormData({
        name: '',
        nameEn: '',
        grNo: nextGr,
        dob: '2016-06-01',
        standard: '૧',
        division: 'A',
        rollNo: `${(existingStudents.length % 30) + 1}`,
        gender: 'male',
        bloodGroup: 'B+',
        parentName: '',
        contactNumber: '',
        address: 'નાની ઉમરવાણ',
        photoUrl: '',
      });
    }
    setErrors({});
  }, [studentToEdit, isOpen, existingStudents]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'ફોટો સાઇઝ 5MB કરતાં ઓછી હોવી જોઈએ' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePresetAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const gender = formData.gender === 'female' ? 'Girl' : 'Boy';
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${gender}_${seed}`;
    setFormData((prev) => ({ ...prev, photoUrl: avatar }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'વિદ્યાર્થીનું નામ દાખલ કરવું ફરજિયાત છે (Name is required)';
    }

    if (!formData.grNo?.trim()) {
      newErrors.grNo = 'G.R. નંબર દાખલ કરવો ફરજિયાત છે (G.R. No is required)';
    } else {
      // Check duplicate GR number unless editing the same record
      const isDuplicate = existingStudents.some(
        (s) => s.grNo.trim() === formData.grNo?.trim() && s.id !== studentToEdit?.id
      );
      if (isDuplicate) {
        newErrors.grNo = `G.R. નંબર ${formData.grNo} પહેલેથી નોંધાયેલ છે`;
      }
    }

    if (!formData.dob) {
      newErrors.dob = 'જન્મ તારીખ પસંદ કરવી ફરજિયાત છે (Birthdate is required)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const studentToSave: Student = {
      id: studentToEdit ? studentToEdit.id : `stud-${Date.now()}`,
      grNo: formData.grNo!.trim(),
      name: formData.name!.trim(),
      nameEn: formData.nameEn?.trim() || '',
      dob: formData.dob!,
      standard: formData.standard || '૧',
      division: formData.division || 'A',
      rollNo: formData.rollNo?.trim() || '',
      gender: formData.gender as 'male' | 'female' | 'other',
      bloodGroup: formData.bloodGroup || 'B+',
      parentName: formData.parentName?.trim() || '',
      contactNumber: formData.contactNumber?.trim() || '',
      address: formData.address?.trim() || 'નાની ઉમરવાણ',
      photoUrl: formData.photoUrl || '',
    };

    onSave(studentToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" />
              {studentToEdit ? 'વિદ્યાર્થી માહિતીમાં સુધારો કરો (Edit Student)' : 'નવો વિદ્યાર્થી ઉમેરો (Add New Student)'}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              નાની ઉમરવાણ પ્રાથમિક શાળા • UDISE: 24170307402
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
            title="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Photo & Quick Avatar Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group shrink-0">
              <div className="w-24 h-28 rounded-lg overflow-hidden border-2 border-amber-400 bg-slate-200 shadow-sm flex items-center justify-center">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Student"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                    <Camera className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-[10px] leading-tight">ફોટો નથી</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-sm font-semibold text-slate-800">
                વિદ્યાર્થી ફોટો (Student Photo)
              </div>
              <p className="text-xs text-slate-500">
                પાસપોર્ટ સાઇઝ ફોટો અપલોડ કરો અથવા ડિફોલ્ટ અવતાર પસંદ કરો
              </p>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  ફોટો અપલોડ કરો
                </button>
                <button
                  type="button"
                  onClick={generatePresetAvatar}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  અવતાર બનાવો
                </button>
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, photoUrl: '' }))}
                    className="text-xs text-rose-600 hover:text-rose-700 underline px-1"
                  >
                    દૂર કરો
                  </button>
                )}
              </div>
              {errors.photo && <p className="text-xs text-red-600">{errors.photo}</p>}
            </div>
          </div>

          {/* PRIMARY FIELDS: G.R. NUMBER & BIRTHDAY (High priority as requested) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
            <div>
              <label className="block text-xs font-bold text-blue-950 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-blue-700" />
                G.R. નંબર (General Register No.) <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="text"
                value={formData.grNo || ''}
                onChange={(e) => setFormData({ ...formData, grNo: e.target.value })}
                placeholder="દા.ત. 1245"
                className={`w-full px-3 py-2 bg-white rounded-lg border text-sm font-bold font-mono focus:outline-none focus:ring-2 ${
                  errors.grNo ? 'border-red-500 focus:ring-red-200' : 'border-amber-300 focus:ring-blue-300'
                }`}
              />
              {errors.grNo ? (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.grNo}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-0.5">શાળાના જનરલ રજિસ્ટર મુજબ નંબર</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                જન્મ તારીખ (Date of Birth) <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className={`w-full px-3 py-2 bg-white rounded-lg border text-sm font-bold focus:outline-none focus:ring-2 ${
                  errors.dob ? 'border-red-500 focus:ring-red-200' : 'border-amber-300 focus:ring-amber-300'
                }`}
              />
              {errors.dob ? (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.dob}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-0.5">કાર્ડ પર ડી/એમ/વાઈ સ્વરૂપે દેખાશે</p>
              )}
            </div>
          </div>

          {/* NAME SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                વિદ્યાર્થીનું પૂરું નામ (ગુજરાતીમાં) <span className="text-rose-600 font-bold">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="દા.ત. પટેલ આરવ મહેશભાઈ"
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-300'
                }`}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                નામ (અંગ્રેજીમાં - English Name)
              </label>
              <input
                type="text"
                value={formData.nameEn || ''}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="Ex. Patel Aarav Maheshbhai"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* CLASS & DIVISION & ROLL NO */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                ધોરણ (Standard) <span className="text-rose-600 font-bold">*</span>
              </label>
              <select
                value={formData.standard || '૧'}
                onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="બાલવાટિકા">બાલવાટિકા</option>
                <option value="૧">ધોરણ ૧</option>
                <option value="૨">ધોરણ ૨</option>
                <option value="૩">ધોરણ ૩</option>
                <option value="૪">ધોરણ ૪</option>
                <option value="૫">ધોરણ ૫</option>
                <option value="૬">ધોરણ ૬</option>
                <option value="૭">ધોરણ ૭</option>
                <option value="૮">ધોરણ ૮</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                વર્ગ (Division)
              </label>
              <select
                value={formData.division || 'A'}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="A">વર્ગ A</option>
                <option value="B">વર્ગ B</option>
                <option value="C">વર્ગ C</option>
                <option value="">કોઈ નહિ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                હાજરી નંબર (Roll No)
              </label>
              <input
                type="text"
                value={formData.rollNo || ''}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="દા.ત. 12"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* GENDER & BLOOD GROUP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                જાતિ (Gender)
              </label>
              <div className="flex items-center gap-4 py-1.5">
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={() => setFormData({ ...formData, gender: 'male' })}
                    className="text-blue-600"
                  />
                  કુમાર (Boy)
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={() => setFormData({ ...formData, gender: 'female' })}
                    className="text-pink-600"
                  />
                  કન્યા (Girl)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                રક્ત જૂથ (Blood Group)
              </label>
              <select
                value={formData.bloodGroup || 'B+'}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="">ખબર નથી</option>
              </select>
            </div>
          </div>

          {/* PARENT DETAILS & CONTACT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                વાલી / પિતાનું નામ (Parent Name)
              </label>
              <input
                type="text"
                value={formData.parentName || ''}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="દા.ત. મહેશભાઈ પટેલ"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                સંપર્ક / મોબાઈલ નંબર (Mobile No.)
              </label>
              <input
                type="tel"
                value={formData.contactNumber || ''}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="દા.ત. 9876543210"
                maxLength={10}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              રહેઠાણનું સરનામું (Address)
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="દા.ત. નાની ઉમરવાણ, સ્કૂલ ફળિયું"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              રદ કરો (Cancel)
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {studentToEdit ? 'સુધારો સાચવો (Update Card)' : 'વિદ્યાર્થી ઉમેરો (Save Student)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
