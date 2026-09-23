import { Student } from '../types/student';

export const exportStudentsToCsv = (students: Student[]) => {
  const headers = [
    'GR_No',
    'Full_Name_Gujarati',
    'Full_Name_English',
    'DOB_YYYY_MM_DD',
    'Standard',
    'Division',
    'Roll_No',
    'Gender',
    'Blood_Group',
    'Parent_Name',
    'Mobile_No',
    'Address',
  ];

  const rows = students.map((s) => [
    `"${s.grNo}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${(s.nameEn || '').replace(/"/g, '""')}"`,
    `"${s.dob}"`,
    `"${s.standard}"`,
    `"${s.division || ''}"`,
    `"${s.rollNo || ''}"`,
    `"${s.gender}"`,
    `"${s.bloodGroup || ''}"`,
    `"${(s.parentName || '').replace(/"/g, '""')}"`,
    `"${s.contactNumber || ''}"`,
    `"${(s.address || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Nani_Umarvan_Students_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseStudentsFromCsv = (csvText: string): Student[] => {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parsedStudents: Student[] = [];
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 2 || !cols[0] || !cols[1]) continue;

    parsedStudents.push({
      id: 'stud-import-' + Date.now() + '-' + i,
      grNo: cols[0] || '',
      name: cols[1] || '',
      nameEn: cols[2] || '',
      dob: cols[3] || '2015-01-01',
      standard: cols[4] || '૧',
      division: cols[5] || 'A',
      rollNo: cols[6] || `${i}`,
      gender: cols[7]?.toLowerCase() === 'female' ? 'female' : 'male',
      bloodGroup: cols[8] || 'B+',
      parentName: cols[9] || '',
      contactNumber: cols[10] || '',
      address: cols[11] || 'નાની ઉમરવાણ',
      photoUrl: '',
    });
  }

  return parsedStudents;
};
