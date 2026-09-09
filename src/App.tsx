import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import {
  BookOpen,
  BarChart3,
  BrainCircuit,
  Plus,
  FileSpreadsheet,
  TrendingUp,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { ReviewAttempt, Specialty, TopicSummary } from './types';
import { INITIAL_ATTEMPTS, OFFICIAL_PUR_TOPICS } from './data/purTopics';
import { computeTopicSummaries } from './lib/spacedRepetition';
import { initAuth } from './lib/firebase';
import { getInitialTheme, applyTheme } from './lib/theme';
import { Navbar } from './components/Navbar';
import { AddScoreModal } from './components/AddScoreModal';
import { TopicList } from './components/TopicList';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SpacedRepetitionWidget } from './components/SpacedRepetitionWidget';
import { AIPearlsModal } from './components/AIPearlsModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { TutorialModal } from './components/TutorialModal';

const LOCAL_STORAGE_KEY = 'pur_tracker_attempts_v1';
const SHEETS_ID_KEY = 'pur_tracker_sheets_id';
const SHEETS_URL_KEY = 'pur_tracker_sheets_url';

export default function App() {
  // Load initial attempts from localStorage or default to seeded data
  const [attempts, setAttempts] = useState<ReviewAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return INITIAL_ATTEMPTS;
  });

  // Google Sheets integration state
  const [spreadsheetId, setSpreadsheetId] = useState<string | undefined>(() => {
    return localStorage.getItem(SHEETS_ID_KEY) || undefined;
  });
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | undefined>(() => {
    return localStorage.getItem(SHEETS_URL_KEY) || undefined;
  });

  // Auth state
  const [user, setUser] = useState<User | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'topics' | 'metrics' | 'spaced'>(
    'topics'
  );

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prefillTopic, setPrefillTopic] = useState<string | undefined>(undefined);
  const [prefillSpecialty, setPrefillSpecialty] = useState<Specialty | undefined>(
    undefined
  );

  const [isAIPearlsModalOpen, setIsAIPearlsModalOpen] = useState(false);
  const [selectedSummaryForAI, setSelectedSummaryForAI] =
    useState<TopicSummary | null>(null);

  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Initialize Theme on mount
  useEffect(() => {
    applyTheme(getInitialTheme());
  }, []);

  // Save attempts to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(attempts));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [attempts]);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Compute topic summaries dynamically
  const topicSummaries = useMemo(() => {
    return computeTopicSummaries(attempts, OFFICIAL_PUR_TOPICS);
  }, [attempts]);

  // Overall statistics
  const totalQuestions = useMemo(() => {
    return attempts.reduce((acc, att) => acc + att.totalQuestions, 0);
  }, [attempts]);

  const overallAverage = useMemo(() => {
    const totalCorrect = attempts.reduce((acc, att) => acc + att.correctAnswers, 0);
    return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  }, [attempts, totalQuestions]);

  // Handlers
  const handleSaveAttempt = (newAttemptData: Omit<ReviewAttempt, 'id'>) => {
    const newAttempt: ReviewAttempt = {
      ...newAttemptData,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    setAttempts((prev) => [...prev, newAttempt]);
  };

  const handleDeleteAttempt = (attemptId: string) => {
    setAttempts((prev) => prev.filter((a) => a.id !== attemptId));
  };

  const handleOpenAddForTopic = (topicName: string, specialty: Specialty) => {
    setPrefillTopic(topicName);
    setPrefillSpecialty(specialty);
    setIsAddModalOpen(true);
  };

  const handleOpenAddGeneral = () => {
    setPrefillTopic(undefined);
    setPrefillSpecialty(undefined);
    setIsAddModalOpen(true);
  };

  const handleOpenAIPearls = (summary: TopicSummary) => {
    setSelectedSummaryForAI(summary);
    setIsAIPearlsModalOpen(true);
  };

  const handleSpreadsheetUpdated = (id: string, url: string) => {
    setSpreadsheetId(id);
    setSpreadsheetUrl(url);
    localStorage.setItem(SHEETS_ID_KEY, id);
    localStorage.setItem(SHEETS_URL_KEY, url);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors">
      {/* Top Navigation */}
      <Navbar
        user={user}
        overallAverage={overallAverage}
        totalQuestions={totalQuestions}
        onOpenAddModal={handleOpenAddGeneral}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        onOpenPriorities={() => setActiveTab('spaced')}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        sheetsUrl={spreadsheetUrl}
        hasSheetsSync={Boolean(spreadsheetId)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Minimal Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Evolución de Repasos
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Preparación para la Prueba Única de Residencias Médicas (PUR)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSheetsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{spreadsheetId ? 'Planilla Sheets' : 'Google Sheets'}</span>
            </button>
            <button
              onClick={handleOpenAddGeneral}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Puntaje</span>
            </button>
          </div>
        </div>

        {/* Minimal Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-px">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('topics')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-colors ${
                activeTab === 'topics'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Temas ({topicSummaries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('spaced')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-colors ${
                activeTab === 'spaced'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>¿Qué repasar hoy?</span>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-colors ${
                activeTab === 'metrics'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Métricas</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] text-slate-400 dark:text-slate-500">
            {attempts.length} repasos guardados
          </span>
        </div>

        {/* Tab Content */}
        {activeTab === 'topics' && (
          <TopicList
            topicSummaries={topicSummaries}
            onAddNextReview={handleOpenAddForTopic}
            onOpenAIPearls={handleOpenAIPearls}
            onDeleteAttempt={handleDeleteAttempt}
            onOpenAddModal={handleOpenAddGeneral}
          />
        )}

        {activeTab === 'spaced' && (
          <div className="space-y-4">
            <SpacedRepetitionWidget
              topicSummaries={topicSummaries}
              onAddNextReview={handleOpenAddForTopic}
              onOpenAIPearls={handleOpenAIPearls}
            />
            {/* Quick list of urgent topics */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Todos los temas para repaso
              </h4>
              <TopicList
                topicSummaries={topicSummaries}
                onAddNextReview={handleOpenAddForTopic}
                onOpenAIPearls={handleOpenAIPearls}
                onDeleteAttempt={handleDeleteAttempt}
                onOpenAddModal={handleOpenAddGeneral}
              />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <ProgressDashboard
            topicSummaries={topicSummaries}
            allAttempts={attempts}
            onOpenAddModal={handleOpenAddGeneral}
          />
        )}
      </main>

      {/* Modals */}
      <AddScoreModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveAttempt={handleSaveAttempt}
        initialTopicName={prefillTopic}
        initialSpecialty={prefillSpecialty}
        topicSummaries={topicSummaries}
      />

      <AIPearlsModal
        isOpen={isAIPearlsModalOpen}
        onClose={() => setIsAIPearlsModalOpen(false)}
        summary={selectedSummaryForAI}
        onStartReview={handleOpenAddForTopic}
      />

      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        user={user}
        attempts={attempts}
        topicSummaries={topicSummaries}
        spreadsheetId={spreadsheetId}
        spreadsheetUrl={spreadsheetUrl}
        onSpreadsheetUpdated={handleSpreadsheetUpdated}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => {
          setIsTutorialOpen(false);
          try {
            localStorage.setItem('pur_tracker_tutorial_seen', 'true');
          } catch (e) {}
        }}
        onOpenAddModal={handleOpenAddGeneral}
      />
    </div>
  );
}
