import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { AIPearlResponse, TopicSummary, Specialty } from '../types';
import { getPURClinicalPearls } from '../data/purClinicalPearls';

interface AIPearlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: TopicSummary | null;
  onStartReview: (topicName: string, specialty: Specialty) => void;
}

export const AIPearlsModal: React.FC<AIPearlsModalProps> = ({
  isOpen,
  onClose,
  summary,
  onStartReview,
}) => {
  const [data, setData] = useState<AIPearlResponse | null>(null);

  // Selected answers for the 2 flash questions: { [questionIndex]: selectedOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isOpen && summary) {
      const pearls = getPURClinicalPearls(
        summary.topicName,
        summary.specialty,
        summary.latestPercentage,
        summary.totalReviews
      );
      setData(pearls);
      setSelectedAnswers({});
      setRevealedQuestions({});
    } else {
      setData(null);
      setSelectedAnswers({});
      setRevealedQuestions({});
    }
  }, [isOpen, summary?.topicId, summary?.totalReviews, summary?.latestPercentage]);

  if (!isOpen || !summary) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Perlas Clave PUR: {summary.topicName}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {summary.specialty} • Puntaje actual:{' '}
                {summary.totalReviews > 0 ? `${summary.latestPercentage.toFixed(1)}%` : 'Sin repasos'}{' '}
                (Ciclo {summary.totalReviews})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {data && (
            <div className="space-y-5">
              {/* High-Yield Pearls Section */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-indigo-900 dark:text-indigo-300 font-bold text-xs sm:text-sm">
                  <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>3 Perlas Clave de Examen (High-Yield Pearls)</span>
                </div>
                <div className="space-y-2">
                  {data.pearls?.map((pearl, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/40 text-slate-800 dark:text-slate-200 text-xs sm:text-sm flex items-start gap-2.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{pearl}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Exam Trap / Distractor */}
              {data.commonMistake && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 text-xs sm:text-sm space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Trampa Clásica de Opción Múltiple en el PUR</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    {data.commonMistake}
                  </p>
                </div>
              )}

              {/* Practice Questions */}
              {data.flashQuestions && data.flashQuestions.length > 0 && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold text-xs sm:text-sm">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Mini-Test de Retención Express</span>
                  </div>

                  <div className="space-y-3">
                    {data.flashQuestions.map((fq, qIndex) => {
                      const userSelected = selectedAnswers[qIndex];
                      const isAnswered = userSelected !== undefined;
                      const isCorrect = userSelected === fq.correctAnswerIndex;

                      return (
                        <div
                          key={qIndex}
                          className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-750 space-y-2.5"
                        >
                          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                            Pregunta #{qIndex + 1}
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white leading-snug">
                            {fq.question}
                          </p>

                          {/* Options */}
                          <div className="space-y-1.5 pt-1">
                            {fq.options?.map((opt, optIdx) => {
                              const isThisSelected = userSelected === optIdx;
                              const isThisCorrect = optIdx === fq.correctAnswerIndex;

                              let btnClasses =
                                'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
                              if (isAnswered) {
                                if (isThisCorrect) {
                                  btnClasses =
                                    'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 font-medium';
                                } else if (isThisSelected) {
                                  btnClasses =
                                    'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-200 font-medium';
                                } else {
                                  btnClasses =
                                    'bg-slate-100/40 dark:bg-slate-850/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={isAnswered}
                                  onClick={() => {
                                    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIdx }));
                                    setRevealedQuestions((prev) => ({ ...prev, [qIndex]: true }));
                                  }}
                                  className={`w-full p-2 text-xs rounded-lg border text-left flex items-center justify-between transition-all ${btnClasses}`}
                                >
                                  <span>{opt}</span>
                                  {isAnswered && isThisCorrect && (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                                  )}
                                  {isAnswered && isThisSelected && !isThisCorrect && (
                                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation Box when answered */}
                          {isAnswered && (
                            <div
                              className={`p-2.5 rounded-lg text-xs leading-relaxed border ${
                                isCorrect
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200'
                                  : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
                              }`}
                            >
                              <div className="font-semibold mb-0.5">
                                {isCorrect ? '✅ Respuesta correcta' : '❌ Respuesta incorrecta'}
                              </div>
                              <p className="text-slate-700 dark:text-slate-300">{fq.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Encouragement */}
              {data.encouragement && (
                <div className="text-center py-1 text-xs italic text-slate-500 dark:text-slate-400">
                  "{data.encouragement}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onClose();
              onStartReview(summary.topicName, summary.specialty);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-2xs transition-colors"
          >
            <span>Registrar Repaso {summary.totalReviews + 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
