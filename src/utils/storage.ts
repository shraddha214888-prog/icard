import { SchoolSettings, Student } from '../types/student';
import { DEFAULT_SCHOOL_SETTINGS, INITIAL_STUDENTS } from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'nani_umarvan_students_v1',
  SETTINGS: 'nani_umarvan_settings_v1',
};

export const getStoredStudents = (): Student[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load students from localStorage', e);
    return INITIAL_STUDENTS;
  }
};

export const saveStudents = (students: Student[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
};

export const getStoredSettings = (): SchoolSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SCHOOL_SETTINGS));
      return DEFAULT_SCHOOL_SETTINGS;
    }
    return { ...DEFAULT_SCHOOL_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
    return DEFAULT_SCHOOL_SETTINGS;
  }
};

export const saveSettings = (settings: SchoolSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};
