import React, { useState } from 'react';
import { CardTheme, SchoolSettings, Student } from '../types/student';
import { StudentCard } from './StudentCard';
import { INITIAL_STUDENTS } from '../data/initialData';
import {
  Palette,
  Check,
  Sliders,
  X,
  Pipette,
  RotateCw,
  RefreshCw,
  Sparkles,
  Eye,
  Layers,
  Settings as SettingsIcon,
} from 'lucide-react';
import { PRESET_ACCENT_COLORS, isValidHex, normalizeHex } from '../utils/colorUtils';

interface CardSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SchoolSettings;
  onSave: (newSettings: SchoolSettings) => void;
  sampleStudent?: Student;
}

export const CardSettingsModal: React.FC<CardSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  sampleStudent,
}) => {
  const [formSettings, setFormSettings] = useState<SchoolSettings>({
    ...settings,
    customAccentColor: settings.customAccentColor || '#1e3a8a',
    useCustomAccentColor: settings.useCustomAccentColor ?? false,
    customBorderColor: settings.customBorderColor || settings.customAccentColor || '#1e3a8a',
  });

  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [syncBorderWithAccent, setSyncBorderWithAccent] = useState(
    !settings.customBorderColor || settings.customBorderColor === settings.customAccentColor
  );
  const [hexInput, setHexInput] = useState(formSettings.customAccentColor || '#1e3a8a');
  const [borderHexInput, setBorderHexInput] = useState(
    formSettings.customBorderColor || formSettings.customAccentColor || '#1e3a8a'
  );
  const [activeTabMobile, setActiveTabMobile] = useState<'settings' | 'preview'>('settings');

  if (!isOpen) return null;

  const demoStudent = sampleStudent || INITIAL_STUDENTS[0];

  const presetThemes: { id: CardTheme; name: string; defaultHex: string; colors: string }[] = [
    { id: 'navy-gold', name: 'શાહી નેવી અને ગોલ્ડ (Navy & Gold)', defaultHex: '#1e3a8a', colors: 'from-blue-900 to-amber-500' },
    { id: 'emerald-green', name: 'હરિયાળું લીલું (Emerald Green)', defaultHex: '#047857', colors: 'from-emerald-700 to-amber-400' },
    { id: 'saffron-blue', name: 'કેસરી અને રોયલ બ્લુ (Saffron & Blue)', defaultHex: '#ea580c', colors: 'from-amber-600 to-blue-900' },
    { id: 'maroon-classic', name: 'ક્લાસિક મરૂન (Maroon Academic)', defaultHex: '#881337', colors: 'from-rose-950 to-amber-400' },
    { id: 'modern-teal', name: 'આધુનિક ટીલ (Modern Teal)', defaultHex: '#0f766e', colors: 'from-teal-800 to-cyan-400' },
  ];

  // Handle custom accent color changes
  const handleAccentColorChange = (newHex: string) => {
    const normalized = normalizeHex(newHex);
    setHexInput(normalized);

    setFormSettings((prev) => {
      const next: SchoolSettings = {
        ...prev,
        useCustomAccentColor: true,
        customAccentColor: normalized,
      };

      if (syncBorderWithAccent) {
        next.customBorderColor = normalized;
        setBorderHexInput(normalized);
      }
      return next;
    });
  };

  // Handle separate border color changes
  const handleBorderColorChange = (newBorderHex: string) => {
    const normalized = normalizeHex(newBorderHex);
    setBorderHexInput(normalized);
    setFormSettings((prev) => ({
      ...prev,
      customBorderColor: normalized,
    }));
  };

  // Toggle sync border with accent
  const handleToggleSyncBorder = (synced: boolean) => {
    setSyncBorderWithAccent(synced);
    if (synced) {
      const accent = formSettings.customAccentColor || '#1e3a8a';
      setBorderHexInput(accent);
      setFormSettings((prev) => ({
        ...prev,
        customBorderColor: accent,
      }));
    }
  };

  // Handle preset theme selection
  const handleSelectPresetTheme = (themeId: CardTheme, defaultHex: string) => {
    setFormSettings((prev) => ({
      ...prev,
      theme: themeId,
      useCustomAccentColor: false,
    }));
    // also update hex inputs in case user wants to customize based on this theme
    setHexInput(defaultHex);
    if (syncBorderWithAccent) {
      setBorderHexInput(defaultHex);
    }
  };

  const handleSave = () => {
    onSave(formSettings);
    onClose();
  };

  const currentColor = formSettings.useCustomAccentColor
    ? formSettings.customAccentColor || '#1e3a8a'
    : presetThemes.find((t) => t.id === formSettings.theme)?.defaultHex || '#1e3a8a';

  const currentBorderColor = formSettings.useCustomAccentColor
    ? formSettings.customBorderColor || currentColor
    : '#cbd5e1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-5 py-3.5 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600/30 border border-blue-400/40 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                <span>કાર્ડ ડિઝાઇન અને થીમ સેટિંગ્સ</span>
                {formSettings.useCustomAccentColor ? (
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <span className="w-2 h-2 rounded-full border border-slate-900/30" style={{ backgroundColor: currentColor }}></span>
                    કસ્ટમ કલર સક્રિય
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded-full font-medium">
                    પૂર્વવ્યાખ્યાયિત થીમ
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-300">
                આઈકાર્ડનો કસ્ટમ એકસેન્ટ કલર, બોર્ડર અને હેડર રંગ ગતિશીલ રીતે બદલો
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="બંધ કરો (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile View Switcher (Tabs) */}
        <div className="lg:hidden flex border-b border-slate-200 bg-slate-100 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTabMobile('settings')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTabMobile === 'settings'
                ? 'bg-white text-blue-700 border-b-2 border-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            સેટિંગ્સ અને રંગ પસંદગી
          </button>
          <button
            type="button"
            onClick={() => setActiveTabMobile('preview')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 transition-colors ${
              activeTabMobile === 'preview'
                ? 'bg-white text-blue-700 border-b-2 border-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            લાઈવ કાર્ડ પ્રિવ્યૂ
            <span
              className="w-2.5 h-2.5 rounded-full border border-white shadow-xs"
              style={{ backgroundColor: currentColor }}
            ></span>
          </button>
        </div>

        {/* Main 2-Column Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* LEFT COLUMN: Settings Controls (Scrollable) */}
          <div
            className={`lg:col-span-7 p-4 sm:p-5 overflow-y-auto space-y-5 border-r border-slate-200 ${
              activeTabMobile === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* 1. Custom Accent Color Picker Section (HIGHLIGHTED) */}
            <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/40 relative space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 text-white rounded-lg shadow-xs">
                    <Pipette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      કસ્ટમ એકસેન્ટ રંગ (Custom Accent Color)
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">
                        નવી સુવિધા
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      કાર્ડનું હેડર અને બોર્ડર આપોઆપ આ રંગ અનુસાર અપડેટ થશે
                    </p>
                  </div>
                </div>

                {/* Enable / Disable toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setFormSettings((prev) => ({
                      ...prev,
                      useCustomAccentColor: !prev.useCustomAccentColor,
                    }))
                  }
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    formSettings.useCustomAccentColor
                      ? 'bg-blue-700 text-white shadow-xs hover:bg-blue-800'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {formSettings.useCustomAccentColor ? 'કસ્ટમ રંગ સક્રિય છે' : 'કસ્ટમ રંગ વાપરો'}
                </button>
              </div>

              {/* Color Swatches Grid */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  લોકપ્રિય શાળા રંગ પેલેટ (Popular School Swatches):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {PRESET_ACCENT_COLORS.map((color) => {
                    const isSelected =
                      formSettings.useCustomAccentColor &&
                      (formSettings.customAccentColor?.toLowerCase() === color.hex.toLowerCase());

                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleAccentColorChange(color.hex)}
                        className={`group relative p-1.5 rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 ring-2 ring-blue-400 bg-white shadow-sm'
                            : 'border-slate-200 hover:border-slate-400 bg-white/80'
                        }`}
                        title={`${color.nameGu} (${color.hex})`}
                      >
                        <div
                          className="w-7 h-7 rounded-full shadow-inner border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                        </div>
                        <span className="text-[9px] font-medium text-slate-700 text-center leading-tight truncate w-full">
                          {color.nameGu}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Wheel & Hex Input row */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <input
                      type="color"
                      id="customAccentColorPicker"
                      value={formSettings.customAccentColor || '#1e3a8a'}
                      onChange={(e) => handleAccentColorChange(e.target.value)}
                      className="w-10 h-10 p-0 rounded-lg border border-slate-300 cursor-pointer overflow-hidden"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="customAccentColorPicker"
                      className="block text-xs font-bold text-slate-800 cursor-pointer hover:text-blue-600"
                    >
                      કલર વ્હીલમાંથી પસંદ કરો
                    </label>
                    <span className="text-[10px] text-slate-500">
                      કોઈપણ ચોક્કસ રંગ કોડ (Color Picker)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Hex:</span>
                  <input
                    type="text"
                    value={hexInput}
                    maxLength={7}
                    placeholder="#1E3A8A"
                    onChange={(e) => {
                      const val = e.target.value;
                      setHexInput(val);
                      if (isValidHex(val)) {
                        handleAccentColorChange(val);
                      }
                    }}
                    className="w-24 px-2 py-1 text-xs font-mono font-bold rounded border border-slate-300 uppercase focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <div
                    className="w-6 h-6 rounded border border-slate-300 shadow-inner"
                    style={{ backgroundColor: formSettings.customAccentColor || '#1e3a8a' }}
                  ></div>
                </div>
              </div>

              {/* Card Border Color Customization */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncBorderWithAccent}
                      onChange={(e) => handleToggleSyncBorder(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-400 w-4 h-4 cursor-pointer"
                    />
                    <span>કાર્ડની બોર્ડર પણ આ જ રંગની રાખવી (Sync border with header)</span>
                  </label>

                  <div
                    className="w-5 h-5 rounded border-2 shadow-xs"
                    style={{ borderColor: currentBorderColor, backgroundColor: currentBorderColor + '20' }}
                    title="બોર્ડર રંગ પૂર્વાવલોકન"
                  ></div>
                </div>

                {/* If independent border color is desired */}
                {!syncBorderWithAccent && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 animate-in fade-in duration-100">
                    <span className="text-[11px] text-slate-600 font-medium">
                      સ્વતંત્ર બોર્ડર રંગ (Custom Border Color):
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formSettings.customBorderColor || '#1e3a8a'}
                        onChange={(e) => handleBorderColorChange(e.target.value)}
                        className="w-7 h-7 p-0 rounded border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={borderHexInput}
                        maxLength={7}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBorderHexInput(val);
                          if (isValidHex(val)) {
                            handleBorderColorChange(val);
                          }
                        }}
                        className="w-20 px-2 py-0.5 text-xs font-mono rounded border border-slate-300 uppercase focus:ring-2 focus:ring-blue-400 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Preset Themes (Standard Options) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-blue-600" />
                  પૂર્વવ્યાખ્યાયિત થીમ્સ (Default Themes)
                </label>
                {formSettings.useCustomAccentColor && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentPreset = presetThemes.find((t) => t.id === formSettings.theme);
                      handleSelectPresetTheme(
                        formSettings.theme,
                        currentPreset ? currentPreset.defaultHex : '#1e3a8a'
                      );
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> થીમ પર પાછા ફરો
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetThemes.map((t) => {
                  const isThemeSelected = !formSettings.useCustomAccentColor && formSettings.theme === t.id;

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectPresetTheme(t.id, t.defaultHex)}
                      className={`p-2.5 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer text-left ${
                        isThemeSelected
                          ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-full bg-gradient-to-tr ${t.colors} shadow-xs border border-white shrink-0`}
                        ></span>
                        <span className="text-xs truncate">{t.name}</span>
                      </div>
                      {isThemeSelected && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Card Orientation */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                કાર્ડનું માપ / આકાર (Card Orientation)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormSettings({ ...formSettings, orientation: 'vertical' })}
                  className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                    formSettings.orientation === 'vertical'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className="w-7 h-11 rounded-sm border shrink-0 transition-colors"
                    style={{
                      backgroundColor: currentColor,
                      borderColor: currentBorderColor,
                    }}
                  ></div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">ઊભું કાર્ડ (Vertical)</div>
                    <div className="text-[10px] text-slate-500">લેનયાર્ડ બેજ (Lanyard ID)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormSettings({ ...formSettings, orientation: 'horizontal' })}
                  className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                    formSettings.orientation === 'horizontal'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className="w-11 h-7 rounded-sm border shrink-0 transition-colors"
                    style={{
                      backgroundColor: currentColor,
                      borderColor: currentBorderColor,
                    }}
                  ></div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">આડું કાર્ડ (Horizontal)</div>
                    <div className="text-[10px] text-slate-500">પોકેટ બેજ (Pocket ID)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. School Details Inputs */}
            <div className="space-y-3 border-t border-slate-200 pt-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> શાળા વિગતો (School Details)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    શાળાનું નામ (ગુજરાતી)
                  </label>
                  <input
                    type="text"
                    value={formSettings.schoolNameGu}
                    onChange={(e) => setFormSettings({ ...formSettings, schoolNameGu: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    શાળાનું નામ (English)
                  </label>
                  <input
                    type="text"
                    value={formSettings.schoolNameEn}
                    onChange={(e) => setFormSettings({ ...formSettings, schoolNameEn: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    UDISE નંબર
                  </label>
                  <input
                    type="text"
                    value={formSettings.udise}
                    onChange={(e) => setFormSettings({ ...formSettings, udise: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    શૈક્ષણિક વર્ષ (Academic Year)
                  </label>
                  <input
                    type="text"
                    value={formSettings.academicYear}
                    onChange={(e) => setFormSettings({ ...formSettings, academicYear: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. Display Toggles */}
            <div className="space-y-2 border-t border-slate-200 pt-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">કાર્ડ પર શું દર્શાવવું</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.showBarcode}
                    onChange={(e) => setFormSettings({ ...formSettings, showBarcode: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  બારકોડ (Barcode)
                </label>

                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.showQrCode}
                    onChange={(e) => setFormSettings({ ...formSettings, showQrCode: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  QR કોડ (QR Code)
                </label>

                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.showBloodGroup}
                    onChange={(e) => setFormSettings({ ...formSettings, showBloodGroup: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  બ્લડ ગ્રૂપ (Blood Group)
                </label>

                <label className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.showAddress}
                    onChange={(e) => setFormSettings({ ...formSettings, showAddress: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  સરનામું (Address)
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Live Preview (Sticky on desktop) */}
          <div
            className={`lg:col-span-5 bg-slate-100 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto ${
              activeTabMobile === 'settings' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              {/* Preview Header Bar */}
              <div className="flex items-center justify-between gap-2 mb-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-blue-50 text-blue-700">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      લાઇવ કાર્ડ પ્રિવ્યૂ (Live Preview)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {formSettings.orientation === 'vertical' ? 'ઊભું કાર્ડ (54×86mm)' : 'આડું કાર્ડ (86×54mm)'}
                    </div>
                  </div>
                </div>

                {/* Flip Card Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewSide('front')}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      previewSide === 'front'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    આગળ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewSide('back')}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      previewSide === 'back'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    પાછળ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewSide((prev) => (prev === 'front' ? 'back' : 'front'))}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                    title="ફેરવો (Flip)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Color Indicators */}
              <div className="mb-3 px-3 py-2 bg-white rounded-lg border border-slate-200 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">હેડર રંગ:</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner"
                    style={{ backgroundColor: currentColor }}
                  ></span>
                  <span className="font-mono font-bold text-slate-800">{currentColor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">બોર્ડર રંગ:</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-inner"
                    style={{ backgroundColor: currentBorderColor }}
                  ></span>
                  <span className="font-mono font-bold text-slate-800">{currentBorderColor}</span>
                </div>
              </div>

              {/* Real-time Dynamic Student Card Preview */}
              <div className="flex justify-center items-center py-2 min-h-[460px]">
                <div className="transform scale-95 sm:scale-100 transition-all duration-200 drop-shadow-lg">
                  <StudentCard
                    student={demoStudent}
                    settings={formSettings}
                    side={previewSide}
                    isPrintPreview={false}
                  />
                </div>
              </div>
            </div>

            {/* Helper note at bottom of preview */}
            <div className="mt-2 text-center text-[10.5px] text-slate-500 bg-white/70 py-1.5 px-3 rounded-lg border border-slate-200">
              💡 તમે ડાબી બાજુથી રંગ બદલશો કે તરત જ આ કાર્ડની <strong>બોર્ડર અને હેડર</strong> તાત્કાલિક અપડેટ થશે.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            {formSettings.useCustomAccentColor ? (
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentColor }}
                ></span>
                કસ્ટમ એકસેન્ટ કલર ({currentColor}) પસંદ કરેલ છે
              </span>
            ) : (
              <span>થીમ મોડ પસંદ કરેલ છે</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              રદ કરો
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              સેટિંગ્સ સાચવો (Apply Settings)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
