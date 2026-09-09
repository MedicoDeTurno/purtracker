export type Specialty =
  | 'Medicina Familiar y Comunitaria'
  | 'Medicina Interna'
  | 'Ginecotología'
  | 'Cirugía'
  | 'Pediatría'
  | 'Psiquiatría'
  | 'Medicina Legal'
  | 'Bioética'
  | 'Clínica Médica'
  | 'Cirugía General'
  | 'Tocoginecología'
  | 'Salud Pública y Legal'
  | 'Especialidades';

export interface ReviewAttempt {
  id: string;
  topicId: string;
  topicName: string;
  specialty: Specialty;
  reviewNumber: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  date: string; // ISO string or YYYY-MM-DD
  notes?: string;
  timeSpentMinutes?: number;
}

export interface PURTopicDef {
  id: string;
  name: string;
  specialty: Specialty;
  isHighYield: boolean;
  typicalQuestionsCount?: number;
  itemNumber?: number;
}

export type ScoreStatus = 'critical' | 'threshold' | 'solid' | 'mastered' | 'unreviewed';

export interface TopicSummary {
  topicId: string;
  topicName: string;
  specialty: Specialty;
  isHighYield: boolean;
  attempts: ReviewAttempt[];
  firstAttempt?: ReviewAttempt;
  latestAttempt?: ReviewAttempt;
  firstPercentage: number;
  latestPercentage: number;
  highestPercentage: number;
  deltaPercentage: number; // e.g. +26.7%
  totalReviews: number;
  status: ScoreStatus;
  urgencyScore: number; // calculated for spaced repetition
  daysSinceLastReview: number;
  isDueForReview: boolean;
  priorityReason: string;
}

export interface GoogleSheetsSyncInfo {
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  lastSyncedAt?: string;
  status: 'idle' | 'syncing' | 'synced' | 'error';
  errorMessage?: string;
}

export interface FlashQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AIPearlResponse {
  pearls: string[];
  commonMistake: string;
  flashQuestions: FlashQuestion[];
  encouragement: string;
}
