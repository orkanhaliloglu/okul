export type SchoolType = 'Fen' | 'Anadolu' | 'Anadolu İmam Hatip' | 'Sosyal Bilimler' | 'Mesleki ve Teknik';

export interface HighSchool {
    id: string;
    slug: string;
    name: string;
    type: SchoolType;
    city: string;
    district: string;
    score: number; // LGS Base Score (Taban Puan)
    percentile: number; // Yüzdelik Dilim
    quota: number; // Kontenjan
    educationDuration: number; // Öğretim Süresi (Yıl)
    language: string; // Yabancı Dil
    admissionType: 'LGS' | 'OBP'; // Giriş Türü
    // New fields
    description?: string;
    website?: string;
    phone?: string;
    address?: string;
    images?: string[];
    departments?: string[]; // Alanlar (MF, TM, Dil vb. veya Meslek Lisesi bölümleri)
}

export type ScoreType = 'SAY' | 'EA' | 'SÖZ' | 'DİL' | 'TYT';
export type UniversityType = 'Devlet' | 'Vakıf' | 'KKTC';

export interface UniversityProgram {
    id: string;
    slug: string;
    universityName: string;
    programName: string; // Bölüm Adı
    faculty: string;
    type: UniversityType;
    city: string;
    scoreType: ScoreType;
    score: number; // YKS Taban Puan
    ranking: number; // Başarı Sıralaması
    quota: number;
    scholarship?: 'Tam Burslu' | '%50 İndirimli' | '%25 İndirimli' | 'Ücretli'; // Vakıf üniversiteleri için
    // New fields
    description?: string;
    website?: string;
    phone?: string;
    address?: string;
    images?: string[];
}
