import React from 'react';
import { SchoolSettings, Student } from '../types/student';
import { BarcodeSvg, QRCodeSvg } from '../utils/barcode';
import { SchoolEmblem } from './SchoolLogo';
import { User, Droplet, Phone, MapPin, Calendar, Hash, Award } from 'lucide-react';
import { adjustHexBrightness, hexToRgba, isLightColor } from '../utils/colorUtils';

interface StudentCardProps {
  student: Student;
  settings: SchoolSettings;
  side?: 'front' | 'back';
  isPrintPreview?: boolean;
}

// Format YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '--/--/----';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  settings,
  side = 'front',
  isPrintPreview = false,
}) => {
  const isVertical = settings.orientation === 'vertical';

  // Theme palettes
  const getThemeStyles = () => {
    switch (settings.theme) {
      case 'emerald-green':
        return {
          headerBg: 'bg-emerald-800 text-white',
          headerAccent: 'border-b-4 border-amber-400',
          grBadge: 'bg-emerald-700 text-white border border-emerald-600',
          dobBadge: 'bg-amber-50 text-amber-900 border border-amber-200',
          footerBg: 'bg-emerald-900 text-emerald-100',
          accentText: 'text-emerald-800',
          subBar: 'bg-emerald-700 text-white',
        };
      case 'saffron-blue':
        return {
          headerBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
          headerAccent: 'border-b-4 border-blue-900',
          grBadge: 'bg-blue-900 text-white border border-blue-800',
          dobBadge: 'bg-orange-50 text-orange-900 border border-orange-200',
          footerBg: 'bg-slate-900 text-slate-200',
          accentText: 'text-orange-700',
          subBar: 'bg-blue-900 text-white',
        };
      case 'maroon-classic':
        return {
          headerBg: 'bg-rose-950 text-white',
          headerAccent: 'border-b-4 border-amber-500',
          grBadge: 'bg-rose-900 text-white border border-rose-800',
          dobBadge: 'bg-amber-50 text-amber-900 border border-amber-200',
          footerBg: 'bg-rose-950 text-rose-100',
          accentText: 'text-rose-900',
          subBar: 'bg-rose-900 text-white',
        };
      case 'modern-teal':
        return {
          headerBg: 'bg-teal-800 text-white',
          headerAccent: 'border-b-4 border-cyan-400',
          grBadge: 'bg-teal-700 text-white border border-teal-600',
          dobBadge: 'bg-cyan-50 text-teal-900 border border-teal-200',
          footerBg: 'bg-slate-900 text-cyan-100',
          accentText: 'text-teal-800',
          subBar: 'bg-teal-700 text-white',
        };
      case 'navy-gold':
      default:
        return {
          headerBg: 'bg-blue-950 text-white',
          headerAccent: 'border-b-4 border-amber-400',
          grBadge: 'bg-blue-900 text-white border border-blue-800',
          dobBadge: 'bg-amber-50 text-amber-950 border border-amber-200',
          footerBg: 'bg-blue-950 text-blue-100',
          accentText: 'text-blue-950',
          subBar: 'bg-blue-900 text-white',
        };
    }
  };

  const theme = getThemeStyles();

  // Dynamic custom accent color overrides
  const isCustomColor = Boolean(settings.useCustomAccentColor && settings.customAccentColor);
  const accentColor = settings.customAccentColor || '#1e3a8a';
  const borderColor = settings.customBorderColor || accentColor;
  const isLight = isCustomColor ? isLightColor(accentColor) : false;

  const dynamicCardBorderStyle: React.CSSProperties = isCustomColor
    ? {
        borderColor: borderColor,
        borderWidth: '2.5px',
        borderStyle: 'solid',
        boxShadow: `0 4px 18px -2px ${hexToRgba(borderColor, 0.28)}`,
      }
    : {};

  const dynamicHeaderStyle: React.CSSProperties = isCustomColor
    ? {
        background: `linear-gradient(135deg, ${accentColor} 0%, ${adjustHexBrightness(accentColor, -25)} 100%)`,
        color: isLight ? '#0f172a' : '#ffffff',
        borderBottom: `3.5px solid ${isLight ? adjustHexBrightness(accentColor, -35) : '#fbbf24'}`,
      }
    : {};

  const dynamicSubBarStyle: React.CSSProperties = isCustomColor
    ? {
        backgroundColor: adjustHexBrightness(accentColor, -15),
        color: isLight ? '#0f172a' : '#ffffff',
      }
    : {};

  const dynamicAccentTextStyle: React.CSSProperties = isCustomColor
    ? {
        color: isLight ? adjustHexBrightness(accentColor, -40) : accentColor,
      }
    : {};

  // Avatar placeholder if student photo isn't provided
  const avatarFallback = student.gender === 'female'
    ? 'https://api.dicebear.com/7.x/adventurer/svg?seed=Girl' + student.grNo
    : 'https://api.dicebear.com/7.x/adventurer/svg?seed=Boy' + student.grNo;

  // ==================== VERTICAL FRONT ====================
  if (isVertical && side === 'front') {
    return (
      <div
        className={`relative overflow-hidden bg-white rounded-xl shadow-md border ${
          isCustomColor ? '' : 'border-slate-300'
        } flex flex-col justify-between select-none card-print-container ${
          isPrintPreview ? 'w-[54mm] h-[86mm] text-[10px]' : 'w-[300px] h-[475px] text-xs'
        }`}
        style={{
          boxSizing: 'border-box',
          ...dynamicCardBorderStyle,
        }}
      >
        {/* Background watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035]">
          <SchoolEmblem size={isPrintPreview ? 100 : 160} />
        </div>

        {/* Lanyard Hole Guide */}
        <div className="w-full flex justify-center pt-1 no-print">
          <div className="w-8 h-1.5 rounded-full bg-slate-200 border border-slate-300"></div>
        </div>

        {/* Header */}
        <div
          className={`${isCustomColor ? '' : theme.headerBg + ' ' + theme.headerAccent} px-2.5 py-2 text-center relative z-10 shadow-sm`}
          style={dynamicHeaderStyle}
        >
          <div className="flex items-center justify-between gap-1.5">
            <SchoolEmblem size={isPrintPreview ? 26 : 38} />
            <div className="flex-1 text-center">
              <h1 className={`font-bold tracking-tight leading-tight text-[11px] sm:text-[13px] ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {settings.schoolNameGu}
              </h1>
              <p className={`text-[8px] sm:text-[9.5px] font-medium tracking-wide leading-none mt-0.5 ${isLight ? 'text-slate-700' : 'text-amber-300'}`}>
                {settings.schoolNameEn}
              </p>
            </div>
            <div className="w-6 shrink-0 flex flex-col items-center">
              <span className={`text-[7px] font-mono leading-none ${isLight ? 'text-slate-700' : 'text-white/80'}`}>UDISE</span>
              <span className={`text-[7.5px] font-bold font-mono leading-tight ${isLight ? 'text-slate-950' : 'text-amber-300'}`}>
                {settings.udise.slice(-6)}
              </span>
            </div>
          </div>

          <div className={`mt-1 flex items-center justify-center gap-2 border-t pt-0.5 text-[8px] sm:text-[9px] ${isLight ? 'border-slate-400 text-slate-800' : 'border-white/20 text-slate-200'}`}>
            <span>UDISE: <strong className={isLight ? 'text-slate-950 font-mono' : 'text-white font-mono'}>{settings.udise}</strong></span>
            <span>•</span>
            <span>વર્ષ: <strong className={isLight ? 'text-slate-950' : 'text-white'}>{settings.academicYear}</strong></span>
          </div>
        </div>

        {/* Identity Badge Strip */}
        <div
          className={`${isCustomColor ? '' : theme.subBar} py-0.5 px-3 flex items-center justify-between text-[9px] font-bold tracking-wider uppercase`}
          style={dynamicSubBarStyle}
        >
          <span>વિદ્યાર્થી ઓળખ કાર્ડ</span>
          <span>STUDENT ID</span>
        </div>

        {/* Middle Content */}
        <div className="px-3 py-1.5 flex flex-col items-center flex-1 justify-between z-10">
          {/* Photo & Key Badges */}
          <div className="flex items-center justify-center gap-3 w-full my-1">
            <div className="relative group">
              <div
                className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border-2 shadow-sm bg-slate-100 flex items-center justify-center"
                style={{ borderColor: isCustomColor ? borderColor : undefined }}
              >
                <img
                  src={student.photoUrl || avatarFallback}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = avatarFallback;
                  }}
                />
              </div>
              <div
                className="absolute -bottom-2 -right-1 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow"
                style={{ backgroundColor: isCustomColor ? accentColor : '#f59e0b' }}
              >
                ધો. {student.standard}
              </div>
            </div>

            {/* Crucial G.R. & Birthday Cards */}
            <div className="flex flex-col gap-1.5 flex-1 max-w-[130px]">
              {/* G.R. NUMBER - Highlighted */}
              <div
                className="bg-blue-50/70 border-2 rounded-lg p-1 text-center shadow-xs"
                style={{ borderColor: isCustomColor ? borderColor : '#2563eb' }}
              >
                <div
                  className="text-[8px] font-bold uppercase tracking-wider flex items-center justify-center gap-0.5"
                  style={{ color: isCustomColor ? accentColor : '#1e3a8a' }}
                >
                  <Hash className="w-2.5 h-2.5" /> G.R. નંબર
                </div>
                <div
                  className="text-[14px] sm:text-[16px] font-black font-mono leading-tight"
                  style={{ color: isCustomColor ? accentColor : '#172554' }}
                >
                  {student.grNo || '----'}
                </div>
              </div>

              {/* BIRTHDAY - Highlighted */}
              <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-1 text-center shadow-xs">
                <div className="text-[8px] font-bold text-amber-900 uppercase tracking-wider flex items-center justify-center gap-0.5">
                  <Calendar className="w-2.5 h-2.5" /> જન્મ તારીખ
                </div>
                <div className="text-[11px] sm:text-[12px] font-extrabold text-amber-950 font-mono leading-tight">
                  {formatDate(student.dob)}
                </div>
              </div>
            </div>
          </div>

          {/* Student Name */}
          <div className="text-center w-full my-1 border-b border-dashed border-slate-200 pb-1">
            <div
              className={`font-bold text-[13px] sm:text-[15px] leading-tight ${isCustomColor ? '' : theme.accentText}`}
              style={dynamicAccentTextStyle}
            >
              {student.name}
            </div>
            {student.nameEn && (
              <div className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-600 tracking-wide mt-0.5">
                {student.nameEn}
              </div>
            )}
          </div>

          {/* Detailed Info Grid */}
          <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] sm:text-[10px] text-slate-700 bg-slate-50/80 p-1.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">ધોરણ/વર્ગ:</span>
              <strong className="text-slate-900">{student.standard} {student.division ? `(${student.division})` : ''}</strong>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">હાજરી નં:</span>
              <strong className="text-slate-900">{student.rollNo || '-'}</strong>
            </div>

            {settings.showBloodGroup && student.bloodGroup && (
              <div className="flex items-center gap-1">
                <Droplet className="w-2.5 h-2.5 text-red-500 shrink-0" />
                <span className="text-slate-500 font-medium">બ્લડ ગ્રૂપ:</span>
                <strong className="text-red-700">{student.bloodGroup}</strong>
              </div>
            )}

            {settings.showParentName && student.parentName && (
              <div className="flex items-center gap-1 col-span-2 truncate">
                <User className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span className="text-slate-500 font-medium">વાલી:</span>
                <span className="font-semibold text-slate-800 truncate">{student.parentName}</span>
              </div>
            )}

            <div className="flex items-center gap-1 col-span-2">
              <Phone className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span className="text-slate-500 font-medium">મોબાઈલ:</span>
              <strong className="font-mono text-slate-900">{student.contactNumber || '---'}</strong>
            </div>

            {settings.showAddress && (
              <div className="flex items-center gap-1 col-span-2 truncate text-[8.5px]">
                <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                <span className="text-slate-600 truncate">{student.address || 'નાની ઉમરવાણ'}</span>
              </div>
            )}
          </div>

          {/* Barcode / Bottom verification */}
          {settings.showBarcode && (
            <div className="w-full flex items-center justify-center pt-1">
              <BarcodeSvg value={`GR-${student.grNo}`} showText={false} height={20} className="w-full max-w-[170px]" />
            </div>
          )}
        </div>

        {/* Footer with Principal Signature */}
        <div className="px-3 py-1 flex items-end justify-between bg-slate-100 border-t border-slate-200 text-[8px] z-10">
          <div className="flex items-center gap-1.5">
            {settings.showQrCode && (
              <QRCodeSvg value={`UDISE:${settings.udise}|GR:${student.grNo}|NAME:${student.name}|DOB:${student.dob}`} size={28} />
            )}
            <div className="leading-tight text-slate-500 text-[7px]">
              <div>માન્ય શૈક્ષણિક વર્ષ</div>
              <div className="font-bold text-slate-700">{settings.academicYear}</div>
            </div>
          </div>

          <div className="text-center pb-0.5">
            <div className="w-20 border-b border-slate-400 mb-0.5 border-dashed"></div>
            <div className="font-bold text-slate-800 text-[8px]">{settings.principalSignTextGu}</div>
            <div className="text-[6.5px] text-slate-500 leading-none">{settings.principalSignTextEn}</div>
          </div>
        </div>

        {/* Bottom colored trim */}
        <div
          className={`h-1.5 w-full ${isCustomColor ? '' : theme.subBar}`}
          style={dynamicSubBarStyle}
        ></div>
      </div>
    );
  }

  // ==================== VERTICAL BACK ====================
  if (isVertical && side === 'back') {
    return (
      <div
        className={`relative overflow-hidden bg-white rounded-xl shadow-md border ${
          isCustomColor ? '' : 'border-slate-300'
        } flex flex-col justify-between select-none card-print-container ${
          isPrintPreview ? 'w-[54mm] h-[86mm] text-[10px]' : 'w-[300px] h-[475px] text-xs'
        }`}
        style={dynamicCardBorderStyle}
      >
        <div
          className={`${isCustomColor ? '' : theme.headerBg + ' border-b-2 border-amber-400'} px-3 py-2 text-center relative z-10 shadow-sm`}
          style={dynamicHeaderStyle}
        >
          <div className={`text-[11px] font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>{settings.schoolNameGu}</div>
          <div className={`text-[8px] ${isLight ? 'text-slate-700' : 'text-amber-300'}`}>વિદ્યાર્થી કાર્ડ નિયમો & સૂચનાઓ</div>
        </div>

        <div className="p-3 text-[9px] sm:text-[10px] space-y-2 text-slate-700 flex-1">
          <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-900">
            <strong className="block text-[10px] mb-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" /> મહત્વની સૂચના:
            </strong>
            <ul className="list-disc list-inside space-y-0.5 text-[8.5px] leading-relaxed">
              <li>આ ઓળખપત્ર વિદ્યાર્થીએ શાળા દરમિયાન હંમેશાં સાથે રાખવું.</li>
              <li>કાર્ડ ખોવાઈ જાય તો તરત જ આચાર્યશ્રીનો સંપર્ક કરવો.</li>
              <li>આ કાર્ડ માત્ર શૈક્ષણિક ઓળખ માટે માન્ય છે.</li>
            </ul>
          </div>

          <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 border-b pb-0.5 text-[9.5px]">શાળા માહિતી (School Info)</div>
            <div><strong>UDISE કોડ:</strong> <span className="font-mono">{settings.udise}</span></div>
            <div><strong>સરનામું:</strong> {settings.schoolAddress}</div>
            <div><strong>સંપર્ક:</strong> {settings.schoolPhone}</div>
          </div>

          <div className="space-y-1 bg-blue-50 p-2 rounded-lg border border-blue-200 text-[8.5px]">
            <div className="font-bold text-blue-900">કટોકટીમાં સંપર્ક:</div>
            <div>વાલી: <strong>{student.parentName}</strong> ({student.contactNumber})</div>
            <div>રહેઠાણ: {student.address}</div>
          </div>
        </div>

        <div className="p-3 flex items-center justify-between bg-slate-100 border-t border-slate-200">
          <QRCodeSvg value={`UDISE:${settings.udise}|GR:${student.grNo}|DOB:${student.dob}`} size={34} />
          <div className="text-right">
            <div className="w-24 border-b border-slate-400 mb-0.5 border-dashed"></div>
            <div className="text-[8px] font-bold text-slate-800">{settings.principalSignTextGu}</div>
            <div className="text-[6.5px] text-slate-500">Nani Umarvan Pri. School</div>
          </div>
        </div>

        <div
          className={`h-1.5 w-full ${isCustomColor ? '' : theme.subBar}`}
          style={dynamicSubBarStyle}
        ></div>
      </div>
    );
  }

  // ==================== HORIZONTAL FRONT ====================
  if (!isVertical && side === 'front') {
    return (
      <div
        className={`relative overflow-hidden bg-white rounded-xl shadow-md border ${
          isCustomColor ? '' : 'border-slate-300'
        } flex flex-col justify-between select-none card-print-container ${
          isPrintPreview ? 'w-[86mm] h-[54mm] text-[9.5px]' : 'w-[475px] h-[300px] text-xs'
        }`}
        style={dynamicCardBorderStyle}
      >
        {/* Header */}
        <div
          className={`${isCustomColor ? '' : theme.headerBg + ' ' + theme.headerAccent} px-3 py-1.5 flex items-center justify-between`}
          style={dynamicHeaderStyle}
        >
          <div className="flex items-center gap-2">
            <SchoolEmblem size={isPrintPreview ? 26 : 36} />
            <div>
              <div className={`font-bold text-[12px] sm:text-[14px] leading-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                {settings.schoolNameGu}
              </div>
              <div className={`text-[8px] sm:text-[9.5px] ${isLight ? 'text-slate-700' : 'text-amber-300'} font-medium`}>
                {settings.schoolNameEn}
              </div>
            </div>
          </div>
          <div className="text-right text-[8px]">
            <div className={`font-bold px-1.5 py-0.5 rounded text-[8px] ${isLight ? 'bg-slate-950 text-amber-300' : 'bg-amber-400 text-slate-950'}`}>
              UDISE: {settings.udise}
            </div>
            <div className={`${isLight ? 'text-slate-700' : 'text-slate-300'} mt-0.5`}>{settings.academicYear}</div>
          </div>
        </div>

        {/* Body Horizontal */}
        <div className="px-3 py-2 flex items-center gap-3 flex-1">
          {/* Photo */}
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border-2 shadow-sm bg-slate-100 flex items-center justify-center"
              style={{ borderColor: isCustomColor ? borderColor : '#f59e0b' }}
            >
              <img
                src={student.photoUrl || avatarFallback}
                alt={student.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = avatarFallback;
                }}
              />
            </div>
            <div className="mt-1 text-[8px] font-bold text-center bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              ધોરણ: {student.standard} {student.division ? `(${student.division})` : ''}
            </div>
          </div>

          {/* Details & Badges */}
          <div className="flex-1 space-y-1">
            <div className="border-b border-slate-200 pb-1">
              <div
                className={`font-bold text-[13px] sm:text-[15px] leading-tight ${isCustomColor ? '' : theme.accentText}`}
                style={dynamicAccentTextStyle}
              >
                {student.name}
              </div>
              {student.nameEn && (
                <div className="text-[9.5px] text-slate-600 font-medium">
                  {student.nameEn}
                </div>
              )}
            </div>

            {/* Big Highlights: G.R. & Birthday */}
            <div className="grid grid-cols-2 gap-2 py-0.5">
              <div
                className="bg-blue-50/70 border rounded p-1 text-center"
                style={{ borderColor: isCustomColor ? borderColor : '#3b82f6' }}
              >
                <span
                  className="text-[7.5px] uppercase font-bold block"
                  style={{ color: isCustomColor ? accentColor : '#1e40af' }}
                >
                  G.R. નંબર
                </span>
                <span
                  className="text-[13px] font-black font-mono"
                  style={{ color: isCustomColor ? accentColor : '#172554' }}
                >
                  {student.grNo || '----'}
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-500 rounded p-1 text-center">
                <span className="text-[7.5px] uppercase font-bold text-amber-900 block">જન્મ તારીખ</span>
                <span className="text-[11px] font-extrabold font-mono text-amber-950">{formatDate(student.dob)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8.5px] sm:text-[9.5px] text-slate-700">
              <div>હાજરી નં: <strong>{student.rollNo || '-'}</strong></div>
              <div>રક્તજૂથ: <strong className="text-red-600">{student.bloodGroup || '-'}</strong></div>
              <div className="col-span-2 truncate">વાલી: <strong>{student.parentName}</strong> ({student.contactNumber})</div>
              <div className="col-span-2 truncate text-[8px] text-slate-500">સરનામું: {student.address}</div>
            </div>
          </div>

          {/* QR code and verification right column */}
          <div className="flex flex-col items-center justify-between h-full py-1 shrink-0">
            <QRCodeSvg value={`UDISE:${settings.udise}|GR:${student.grNo}|DOB:${student.dob}`} size={38} />
            <div className="text-center mt-2">
              <div className="w-16 border-b border-slate-400 mb-0.5 border-dashed"></div>
              <div className="text-[7.5px] font-bold text-slate-800">{settings.principalSignTextGu}</div>
            </div>
          </div>
        </div>

        {/* Footer Barcode */}
        <div className="bg-slate-100 px-3 py-0.5 border-t border-slate-200 flex items-center justify-between text-[7px] text-slate-600">
          <span>મુ.પો. નાની ઉમરવાણ પ્રા. શાળા</span>
          <BarcodeSvg value={`GR-${student.grNo}`} showText={false} height={14} className="max-w-[120px]" />
          <span>સત્ર {settings.academicYear}</span>
        </div>
      </div>
    );
  }

  // ==================== HORIZONTAL BACK ====================
  return (
    <div
      className={`relative overflow-hidden bg-white rounded-xl shadow-md border ${
        isCustomColor ? '' : 'border-slate-300'
      } flex flex-col justify-between select-none card-print-container ${
        isPrintPreview ? 'w-[86mm] h-[54mm] text-[9.5px]' : 'w-[475px] h-[300px] text-xs'
      }`}
      style={dynamicCardBorderStyle}
    >
      <div
        className={`${isCustomColor ? '' : theme.headerBg} px-3 py-1.5 flex items-center justify-between`}
        style={dynamicHeaderStyle}
      >
        <span className={`font-bold text-[11px] ${isLight ? 'text-slate-950' : 'text-white'}`}>{settings.schoolNameGu} - નિયમાવલી</span>
        <span className={`text-[8px] ${isLight ? 'text-slate-700' : 'text-amber-300'}`}>UDISE: {settings.udise}</span>
      </div>

      <div className="p-3 text-[8.5px] sm:text-[9.5px] space-y-1.5 text-slate-700 flex-1">
        <div className="bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-900 leading-snug">
          <strong>સૂચના:</strong> આ કાર્ડ વિદ્યાર્થીએ દરરોજ શાળામાં લાવવું ફરજિયાત છે. કાર્ડ ખોવાય તો તુરંત વર્ગશિક્ષક કે આચાર્યશ્રીને જાણ કરવી.
        </div>
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded border border-slate-200 text-[8px]">
          <div>
            <strong>શાળા:</strong> નાની ઉમરવાણ પ્રા. શાળા<br />
            <strong>UDISE:</strong> {settings.udise}
          </div>
          <div>
            <strong>સંપર્ક:</strong> {settings.schoolPhone}<br />
            <strong>ગામ:</strong> નાની ઉમરવાણ, ગુજરાત
          </div>
        </div>
      </div>

      <div className="bg-slate-100 px-3 py-1 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[7.5px] text-slate-500">Identity Card strictly for official school usage</span>
        <div className="text-right">
          <div className="w-20 border-b border-slate-400 mb-0.5 border-dashed"></div>
          <span className="text-[7.5px] font-bold text-slate-800">{settings.principalSignTextGu}</span>
        </div>
      </div>
    </div>
  );
};
