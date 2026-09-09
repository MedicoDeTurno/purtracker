import React from 'react';
import {
  TrendingUp,
  Target,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { TopicSummary, ReviewAttempt } from '../types';

interface ProgressDashboardProps {
  topicSummaries: TopicSummary[];
  allAttempts: ReviewAttempt[];
  onOpenAddModal: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  topicSummaries,
  allAttempts,
}) => {
  const totalQuestions = allAttempts.reduce((acc, att) => acc + att.totalQuestions, 0);
  const totalCorrect = allAttempts.reduce((acc, att) => acc + att.correctAnswers, 0);
  const globalAverage = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  // Counts by status (only for topics that have recorded reviews)
  const reviewedTopics = topicSummaries.filter((t) => t.totalReviews > 0);
  const masteredCount = reviewedTopics.filter((t) => t.latestPercentage >= 85).length;
  const solidCount = reviewedTopics.filter((t) => t.latestPercentage >= 75 && t.latestPercentage < 85).length;
  const thresholdCount = reviewedTopics.filter((t) => t.latestPercentage >= 60 && t.latestPercentage < 75).length;
  const criticalCount = reviewedTopics.filter((t) => t.latestPercentage < 60).length;

  // Multi-review topics with evolution
  const multiReviewTopics = reviewedTopics.filter((t) => t.totalReviews > 1);
  const averageImprovement =
    multiReviewTopics.length > 0
      ? multiReviewTopics.reduce((sum, t) => sum + t.deltaPercentage, 0) / multiReviewTopics.length
      : 0;

  // Specialty Breakdown
  const specialtyStats: Record<string, { total: number; correct: number; count: number }> = {};
  allAttempts.forEach((att) => {
    if (!specialtyStats[att.specialty]) {
      specialtyStats[att.specialty] = { total: 0, correct: 0, count: 0 };
    }
    specialtyStats[att.specialty].total += att.totalQuestions;
    specialtyStats[att.specialty].correct += att.correctAnswers;
    specialtyStats[att.specialty].count += 1;
  });

  return (
    <div className="space-y-5">
      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Global Score */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Promedio General
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {globalAverage.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Meta: ≥75%
          </p>
        </div>

        {/* Card 2: Average Delta on Repasos */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Mejora Promedio
          </span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {averageImprovement >= 0 ? '+' : ''}
            {averageImprovement.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {multiReviewTopics.length} temas con 2+ ciclos
          </p>
        </div>

        {/* Card 3: Questions Answered */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Preguntas Realizadas
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {totalQuestions}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {totalCorrect} aciertos totales
          </p>
        </div>

        {/* Card 4: Temas con Repaso */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Cobertura del Temario
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {reviewedTopics.length} / {topicSummaries.length}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {criticalCount} en riesgo (&lt;60%)
          </p>
        </div>
      </div>

      {/* Mastery Status Strip */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Estado de los temas estudiados ({reviewedTopics.length})
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span>Dominados (≥85%)</span>
            <span className="font-bold">{masteredCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-teal-50/70 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 flex items-center justify-between">
            <span>Sólidos (75-84%)</span>
            <span className="font-bold">{solidCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span>Umbral (60-74%)</span>
            <span className="font-bold">{thresholdCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 flex items-center justify-between">
            <span>Críticos (&lt;60%)</span>
            <span className="font-bold">{criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Comparison: Evolution Table */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Evolución por Tema (R1 → R2 → R3)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Puntajes obtenidos en cada ciclo sucesivo de estudio
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {reviewedTopics.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Aún no hay repasos registrados. Registra tu primer puntaje para ver la progresión.
            </div>
          ) : (
            reviewedTopics.map((topic) => {
              const hasMultiple = topic.attempts.length > 1;
              return (
                <div
                  key={topic.topicId}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {topic.topicName}
                    </div>
                    <span className="text-[11px] text-slate-400">{topic.specialty}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Pills of attempts */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      {topic.attempts.map((att) => (
                        <span
                          key={att.id}
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          R{att.reviewNumber}: {att.percentage.toFixed(0)}%
                        </span>
                      ))}
                    </div>

                    {hasMultiple && (
                      <span
                        className={`font-semibold text-xs ${
                          topic.deltaPercentage > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {topic.deltaPercentage > 0 ? '+' : ''}
                        {topic.deltaPercentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Specialty Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Rendimiento por Especialidad
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Object.entries(specialtyStats).map(([specName, data]) => {
            const avg = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            return (
              <div
                key={specName}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {specName}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {avg.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      avg >= 85
                        ? 'bg-emerald-500'
                        : avg >= 75
                        ? 'bg-teal-500'
                        : avg >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(4, avg))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {data.correct}/{data.total} preguntas · {data.count} repasos
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
