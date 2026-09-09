import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  AlertCircle,
} from 'lucide-react';
import { TopicSummary, Specialty } from '../types';

interface SpacedRepetitionWidgetProps {
  topicSummaries: TopicSummary[];
  onAddNextReview: (topicName: string, specialty: Specialty) => void;
  onOpenAIPearls: (summary: TopicSummary) => void;
}

export const SpacedRepetitionWidget: React.FC<SpacedRepetitionWidgetProps> = ({
  topicSummaries,
  onAddNextReview,
  onOpenAIPearls,
}) => {
  // Sort by urgency score
  const dueTopics = topicSummaries.filter((t) => t.isDueForReview || t.latestPercentage < 75);
  const topPriorities = (dueTopics.length > 0 ? dueTopics : topicSummaries).slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              ¿Qué repasar hoy?
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Recomendaciones según tiempo transcurrido, puntaje crítico y curva de olvido.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Topics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {topPriorities.map((item, index) => {
          const isCritical = item.latestPercentage < 60;
          return (
            <div
              key={item.topicId}
              className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                    #{index + 1} · {item.specialty.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                      isCritical
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : item.latestPercentage < 75
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {item.latestPercentage > 0 ? `${item.latestPercentage.toFixed(0)}%` : 'Sin datos'}
                  </span>
                </div>

                <h4 className="font-semibold text-slate-900 dark:text-white text-xs line-clamp-1 mb-1">
                  {item.topicName}
                </h4>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2.5 line-clamp-2 flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  <span>{item.priorityReason}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                <button
                  onClick={() => onOpenAIPearls(item)}
                  className="p-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors text-[11px] flex items-center gap-0.5"
                  title="Perlas clave PUR"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>Perlas</span>
                </button>
                <button
                  onClick={() => onAddNextReview(item.topicName, item.specialty)}
                  className="ml-auto px-2 py-1 text-[11px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1"
                >
                  <span>Repaso {item.totalReviews + 1}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
