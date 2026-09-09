import React, { useState, useEffect } from 'react';
import { X, Check, ArrowUpRight, TrendingUp, AlertCircle, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PURTopicDef, ReviewAttempt, Specialty, TopicSummary } from '../types';
import { OFFICIAL_PUR_TOPICS, OFFICIAL_PUR_SPECIALTIES, SPECIALTY_COLORS } from '../data/purTopics';

interface AddScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAttempt: (attempt: Omit<ReviewAttempt, 'id'>) => void;
  initialTopicName?: string;
  initialSpecialty?: Specialty;
  topicSummaries: TopicSummary[];
}

export const AddScoreModal: React.FC<AddScoreModalProps> = ({
  isOpen,
  onClose,
  onSaveAttempt,
  initialTopicName,
  initialSpecialty,
  topicSummaries,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(
    initialSpecialty || OFFICIAL_PUR_SPECIALTIES[0]
  );
  const [topicInput, setTopicInput] = useState<string>(initialTopicName || '');
  const [isCustomTopic, setIsCustomTopic] = useState<boolean>(false);
  const [reviewNumber, setReviewNumber] = useState<number>(1);
  const [correctAnswers, setCorrectAnswers] = useState<number | ''>(21);
  const [totalQuestions, setTotalQuestions] = useState<number | ''>(30);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // When opening or prefilled
  useEffect(() => {
    setValidationError(null);
    if (initialTopicName) {
      setTopicInput(initialTopicName);
      if (initialSpecialty) setSelectedSpecialty(initialSpecialty);

      const existing = topicSummaries.find(
        (t) => t.topicName.toLowerCase() === initialTopicName.toLowerCase()
      );
      if (existing) {
        setReviewNumber(existing.totalReviews + 1);
        const lastTotal = existing.latestAttempt?.totalQuestions || 30;
        setTotalQuestions(lastTotal);
        if (existing.specialty) setSelectedSpecialty(existing.specialty);
      }
    } else {
      const available = OFFICIAL_PUR_TOPICS.filter((t) => t.specialty === selectedSpecialty);
      if (available.length > 0 && (!topicInput || !available.some((t) => t.name === topicInput))) {
        setTopicInput(available[0].name);
      }
    }
  }, [initialTopicName, initialSpecialty, isOpen]);

  // When topicInput changes, automatically recalculate suggested review number
  useEffect(() => {
    if (!topicInput) return;
    const existing = topicSummaries.find(
      (t) => t.topicName.toLowerCase().trim() === topicInput.toLowerCase().trim()
    );
    if (existing) {
      setReviewNumber(existing.totalReviews + 1);
      setSelectedSpecialty(existing.specialty);
    } else {
      setReviewNumber(1);
    }
  }, [topicInput, topicSummaries]);

  if (!isOpen) return null;

  const numCorrect = typeof correctAnswers === 'number' ? correctAnswers : 0;
  const numTotal = typeof totalQuestions === 'number' ? totalQuestions : 0;
  const currentPercentage = numTotal > 0 ? (numCorrect / numTotal) * 100 : 0;

  // Previous attempt info for comparison
  const existingSummary = topicSummaries.find(
    (t) => t.topicName.toLowerCase().trim() === topicInput.toLowerCase().trim()
  );
  const previousAttempt = existingSummary?.latestAttempt;
  const delta = previousAttempt ? currentPercentage - previousAttempt.percentage : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!topicInput.trim()) {
      setValidationError('Por favor indica o selecciona un tema.');
      return;
    }

    if (numTotal <= 0) {
      setValidationError('El total de preguntas debe ser mayor a cero.');
      return;
    }

    if (numCorrect < 0 || numCorrect > numTotal) {
      setValidationError('El número de aciertos no puede ser negativo ni mayor al total.');
      return;
    }

    // Match or create topic ID
    const matchedDef = OFFICIAL_PUR_TOPICS.find(
      (t) => t.name.toLowerCase() === topicInput.toLowerCase()
    );
    const topicId = matchedDef ? matchedDef.id : `custom-${topicInput.toLowerCase().replace(/\s+/g, '-')}`;

    onSaveAttempt({
      topicId,
      topicName: topicInput.trim(),
      specialty: selectedSpecialty,
      reviewNumber,
      correctAnswers: numCorrect,
      totalQuestions: numTotal,
      percentage: Number(currentPercentage.toFixed(1)),
      date,
      notes: notes.trim() || undefined,
    });

    // Fire celebratory confetti if high score or great improvement
    if (currentPercentage >= 85 || (delta !== null && delta >= 15)) {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    onClose();
  };

  const filteredTopics = OFFICIAL_PUR_TOPICS.filter(
    (t) => t.specialty === selectedSpecialty
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registrar Puntaje de Repaso</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Prueba Única de Residencias (PUR)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Specialty Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
              Especialidad PUR
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {OFFICIAL_PUR_SPECIALTIES.map((spec) => {
                const isSelected = selectedSpecialty === spec;
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => {
                      setSelectedSpecialty(spec);
                      setValidationError(null);
                      if (!isCustomTopic) {
                        const inSpec = OFFICIAL_PUR_TOPICS.filter((t) => t.specialty === spec);
                        if (inSpec.length > 0) {
                          setTopicInput(inSpec[0].name);
                        }
                      }
                    }}
                    className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg text-left transition-all border leading-tight ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Tema
              </label>
              <button
                type="button"
                onClick={() => setIsCustomTopic(!isCustomTopic)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {isCustomTopic ? '← Elegir de la lista PUR' : '+ Escribir otro tema'}
              </button>
            </div>

            {isCustomTopic ? (
              <input
                type="text"
                placeholder="Ej: Trastornos del Potasio, ITU complicada..."
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            ) : (
              <select
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {filteredTopics.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.isHighYield ? '★ ' : ''}
                    {t.name}
                  </option>
                ))}
              </select>
            )}

            {existingSummary && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>Historial detectado: {existingSummary.totalReviews} repaso(s) previo(s).</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Último: {existingSummary.latestPercentage.toFixed(1)}%
                </span>
              </p>
            )}
          </div>

          {/* Review Number & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                N° de Repaso
              </label>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold">
                  Repaso
                </span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={reviewNumber}
                  onChange={(e) => setReviewNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-r-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Fecha
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Questions Score (Correct / Total) with Live Percentage Preview */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Puntaje de Preguntas
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Preajustes:</span>
                {[20, 25, 30, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTotalQuestions(preset)}
                    className="px-2 py-0.5 text-xs rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
                  >
                    /{preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Preguntas Correctas
                </label>
                <input
                  type="number"
                  min="0"
                  max={numTotal || 100}
                  placeholder="Ej: 21"
                  value={correctAnswers}
                  onChange={(e) =>
                    setCorrectAnswers(e.target.value === '' ? '' : parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 text-xl font-bold text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Total de Preguntas
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 30"
                  value={totalQuestions}
                  onChange={(e) =>
                    setTotalQuestions(e.target.value === '' ? '' : parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 text-xl font-bold text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900"
                  required
                />
              </div>
            </div>

            {/* Live Percentage & Delta Calculation Display */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Porcentaje obtenido:</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                  <span
                    className={
                      currentPercentage >= 85
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : currentPercentage >= 75
                        ? 'text-teal-600 dark:text-teal-400'
                        : currentPercentage >= 60
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }
                  >
                    {currentPercentage.toFixed(1)}%
                  </span>
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    ({numCorrect} de {numTotal})
                  </span>
                </div>
              </div>

              {/* Delta Comparison */}
              {previousAttempt && delta !== null && (
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Vs. Repaso {previousAttempt.reviewNumber} ({previousAttempt.percentage.toFixed(1)}%):
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 font-bold text-sm px-2.5 py-1 rounded-md mt-0.5 ${
                      delta > 0
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                        : delta < 0
                        ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {delta > 0 ? (
                      <>
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+{delta.toFixed(1)}%</span>
                      </>
                    ) : delta < 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 rotate-180" />
                        <span>{delta.toFixed(1)}%</span>
                      </>
                    ) : (
                      <span>= Igual</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes or Key Pearls */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Notas, Perlas o Dudas del Repaso (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej: Repasar criterios de internación, dosis de antibióticos de 1ra línea o trampas del caso..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Repaso {reviewNumber}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
