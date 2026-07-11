export interface TrainingProject {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  attendeeCount: number;
  instructorCount: number;
  attendeesDescription: string;
  notes: string;
}

export interface ScheduleItem {
  id: string;
  day: number; // e.g., 23
  timeSlot: 'early_morning' | 'breakfast' | 'morning' | 'lunch' | 'afternoon' | 'evening';
  timeSlotLabel: string; // e.g., "ตื่นนอน 05.00-06.15 น."
  timeRange: string;
  activity: string;
  coordinator: string;
  monkInCharge: string;
}

export interface StaffRow {
  id: string;
  order: number;
  division: string; // หน่วยงาน
  monkWP1: number; // พระ WP1
  monkWP2: number; // พระ WP2
  monkWP3: number; // พระ WP3
  maleStaff: number; // ชาย
  femaleStaff: number; // หญิง
  vipStaff: number; // ผู้ใหญ่
  attendeeStaff: number; // ผู้เข้าร่วมอบรม
  instructorStaff: number; // ครูฝึก
  travelDetail: string; // การเดินทาง
  responsibility: string; // หน้าที่
}

export interface SpeechPreset {
  id: string;
  speechType: 'report_opening' | 'open' | 'monk_opening' | 'report_closing' | 'close_monk';
  title: string;
  reporter: string;
  recipientOrSpeaker: string;
  tone: 'formal' | 'inspiring' | 'compassionate' | 'short' | 'long';
  content: string;
  customPrompt?: string;
}

export interface BudgetItem {
  id: string;
  category: 'income' | 'expense';
  title: string;
  amount: number;
  quantity: number;
  unitPrice: number;
  note: string;
}

export interface EvaluationResult {
  objectivesMet: boolean;
  scoreProductivity: number; // 1-5
  scoreDiscipline: number; // 1-5
  scoreMindfulness: number; // 1-5
  swotStrengths: string;
  swotWeaknesses: string;
  swotOpportunities: string;
  swotThreats: string;
  summaryComments: string;
}
