import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Trash2,
  Star,
} from 'lucide-react';
import { TopicSummary } from '../types';

interface TopicCardProps {
  summary: TopicSummary;
  onAddNextReview: (topicName: string, specialty: any) => void;
  onOpenAIPearls: (summary: TopicSummary) => void;
  onDeleteAttempt: (attemptId: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  summary,
  onAddNextReview,
  onOpenAIPearls,
  onDeleteAttempt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreBadge = () => {
    if (summary.totalReviews === 0) {
      return {
        text: 'Sin repasos',
        cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
      };
    }
    const score = summary.latestPercentage;
    if (score >= 85) {
      return {
        text: `${score.toFixed(1)}%`,
        cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
      };
    }
    if (score >= 75) {
      return {
        text: `${score.toFixed(1)}%`,
        cls: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60',
      };
    }
    if (score >= 60) {
      return {
        text: `${score.toFixed(1)}%`,
        cls: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60',
      };
    }
    return {
      text: `${score.toFixed(1)}%`,
      cls: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60',
    };
  };

  const scoreBadge = getScoreBadge();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between">
      <div>
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {summary.specialty}
            </span>
            {summary.isHighYield && (
              <span
                className="inline-flex items-center text-[10px] font-medium text-amber-600 dark:text-amber-400"
                title="Tema frecuente PUR"
              >
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                Alto rendimiento
              </span>
            )}
          </div>

          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${scoreBadge.cls}`}
          >
            {scoreBadge.text}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
          {summary.topicName}
        </h3>

        {/* Progress & Evolution (Minimalist) */}
        {summary.totalReviews > 0 ? (
          <div className="space-y-2 mb-3">
            {/* Evolution Pills Strip */}
            <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              {summary.attempts.map((att, idx) => (
                <React.Fragment key={att.id}>
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[11px] ${
                      idx === summary.attempts.length - 1
                        ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    R{att.reviewNumber}: {att.percentage.toFixed(0)}%
                  </span>
                  {idx < summary.attempts.length - 1 && (
                    <span className="text-slate-300 dark:text-slate-600 text-[10px]">→</span>
                  )}
                </React.Fragment>
              ))}

              {summary.deltaPercentage !== 0 && summary.totalReviews > 1 && (
                <span
                  className={`inline-flex items-center text-[11px] font-semibold ml-1 ${
                    summary.deltaPercentage > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {summary.deltaPercentage > 0 ? '+' : ''}
                  {summary.deltaPercentage.toFixed(1)}%
                </span>
              )}
            </div>

            {/* Minimal Slim Progress Bar */}
            <div className="relative w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  summary.latestPercentage >= 85
                    ? 'bg-emerald-500'
                    : summary.latestPercentage >= 75
                    ? 'bg-teal-500'
                    : summary.latestPercentage >= 60
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, summary.latestPercentage))}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-400/70 dark:bg-slate-600"
                style={{ left: '75%' }}
                title="Meta 75%"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
            Sin repasos registrados
          </p>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {summary.totalReviews > 0 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <span>{summary.totalReviews} {summary.totalReviews === 1 ? 'repaso' : 'repasos'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Pendiente
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenAIPearls(summary)}
            title="Ver perlas clínicas clave y preguntas de práctica"
            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline text-[11px]">Perlas PUR</span>
          </button>

          <button
            onClick={() => onAddNextReview(summary.topicName, summary.specialty)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Repaso {summary.totalReviews + 1}</span>
          </button>
        </div>
      </div>

      {/* Expanded History Modal / Drawer inline */}
      {isExpanded && summary.attempts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          {summary.attempts.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Repaso {att.reviewNumber}:
                </span>
                <span>{att.correctAnswers}/{att.totalQuestions} ({att.percentage.toFixed(1)}%)</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  {att.date}
                </span>
              </div>

              <button
                onClick={() => {
                  if (confirm(`¿Eliminar Repaso ${att.reviewNumber} de ${summary.topicName}?`)) {
                    onDeleteAttempt(att.id);
                  }
                }}
                title="Eliminar este intento"
                className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
