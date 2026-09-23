export interface Student {
  id: string;
  grNo: string; // General Register Number (G.R. No. - જનરલ રજિસ્ટર નંબર)
  name: string; // Student Full Name (વિદ્યાર્થીનું પૂરું નામ)
  nameEn?: string; // English transliteration or secondary name
  dob: string; // Date of Birth (જન્મ તારીખ: YYYY-MM-DD)
  standard: string; // ધોરણ (1 to 8 or Balvatika)
  division?: string; // વર્ગ (A, B, etc.)
  rollNo?: string; // હાજરી નંબર
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string; // બ્લડ ગ્રૂપ (A+, B+, O+, AB+, etc.)
  parentName: string; // પિતા/વાલીનું નામ
  contactNumber: string; // સંપર્ક/મોબાઈલ નંબર
  address: string; // સરનામું (ગામ: નાની ઉમરવાણ)
  photoUrl: string; // Photo Data URL or Avatar URL
  aadhaarNo?: string; // આધાર / UID નંબર (optional)
}

export type CardTheme = 'navy-gold' | 'emerald-green' | 'saffron-blue' | 'maroon-classic' | 'modern-teal';
export type CardOrientation = 'vertical' | 'horizontal';

export interface SchoolSettings {
  schoolNameGu: string;
  schoolNameEn: string;
  udise: string;
  subTitleGu: string;
  subTitleEn: string;
  talukaDistrict: string;
  academicYear: string;
  principalSignTextGu: string;
  principalSignTextEn: string;
  schoolPhone: string;
  schoolAddress: string;
  theme: CardTheme;
  orientation: CardOrientation;
  showQrCode: boolean;
  showBarcode: boolean;
  showBloodGroup: boolean;
  showAddress: boolean;
  showParentName: boolean;
  showRollNo: boolean;
  showAadhaar: boolean;
  logoUrl?: string;
  principalSignUrl?: string;
  customAccentColor?: string;
  useCustomAccentColor?: boolean;
  customBorderColor?: string;
}

export type Language = 'gu' | 'en';
