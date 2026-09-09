import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  FileSpreadsheet,
  Moon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Target,
  Award,
  AlertTriangle,
  Lightbulb,
  Check,
} from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onOpenAddModal,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'score-registration',
      title: '1. Registro de Puntajes y Repasos',
      subtitle: 'Monitorea tu evolución en cada ciclo de estudio',
      icon: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      badge: 'Básico esencial',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            El secreto para aprobar con alto percentil el <strong>Examen Único de Residencias (PUR)</strong> es la reiteración activa con preguntas múltiple opción. En cada ciclo de estudio, registra cuántas preguntas respondiste correctamente.
          </p>

          {/* Practical User Example */}
          <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3">
            <div className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Ejemplo de Evolución Real</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Repaso 1 */}
              <div className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-blue-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Repaso 1: ITU</span>
                  <span>Hace 14 días</span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">70.0%</span>
                  <span className="text-xs font-mono text-slate-500">21 de 30 aciertos</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full w-[70%] rounded-full" />
                </div>
              </div>

              {/* Repaso 2 */}
              <div className="bg-white dark:bg-slate-850 p-3 rounded-lg border border-emerald-300 dark:border-emerald-800/80 shadow-xs">
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Repaso 2: ITU</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-[11px]">
                    +26.7% Mejora
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">96.7%</span>
                  <span className="text-xs font-mono text-slate-500">29 de 30 aciertos</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[96.7%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Preajustes rápidos:</strong> Selecciona con 1 click paquetes habituales de <strong>/20</strong>, <strong>/25</strong>, <strong>/30</strong> o <strong>/50</strong> preguntas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Temas oficiales o propios:</strong> Escoge de la lista oficial de alta rentabilidad PUR o agrega tus propios temas con el botón "+ Escribir otro tema".
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'spaced-repetition',
      title: '2. ¿Qué repasar hoy? (Repetición Espaciada)',
      subtitle: 'La ciencia para vencer la curva del olvido',
      icon: <BrainCircuit className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      badge: 'Priorización inteligente',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            No pierdas tiempo repasando lo que ya dominas ni pospongas temas difíciles. El widget superior <strong>"¿Qué repasar hoy?"</strong> calcula automáticamente qué temas requieren tu atención inmediata basándose en:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
              <div className="font-bold text-rose-800 dark:text-rose-300 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Urgente / Crítico
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Puntaje <strong>&lt;60%</strong> o temas que llevan <strong>más de 21 días</strong> sin repasar.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
              <div className="font-bold text-amber-800 dark:text-amber-300 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Prioritario
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Puntaje <strong>60% - 74%</strong> o entre <strong>10 y 20 días</strong> desde el último intento.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Consolidado
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Puntaje <strong>≥85%</strong> y repasado recientemente. Puedes espaciarlo más.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Consejo de estudio:</strong> Haz clic directamente en <em>"+ Repasar Ahora"</em> dentro del widget prioritario para registrar tu siguiente ciclo de preguntas sin buscar el tema en la lista.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'mastery-levels',
      title: '3. Semáforo de Dominio PUR',
      subtitle: 'Conoce con certeza tu nivel competitivo para el examen',
      icon: <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Estándar del examen',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            Cada tema se clasifica en 4 categorías visuales claras para que sepas en qué materia enfocar tus horas de estudio antes del día del examen:
          </p>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-black px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                  ≥ 85%
                </span>
                <div>
                  <div className="font-bold text-emerald-900 dark:text-emerald-200">Dominado (Top Percentil)</div>
                  <div className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                    Nivel óptimo para adjudicar en especialidades y hospitales de alta demanda.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-black px-2.5 py-1 rounded-lg bg-teal-600 text-white">
                  75% - 84%
                </span>
                <div>
                  <div className="font-bold text-teal-900 dark:text-teal-200">Sólido (Aprobado Seguro)</div>
                  <div className="text-xs text-teal-800/80 dark:text-teal-300/80">
                    Conocimiento firme; ideal un repaso corto de mantenimiento antes del PUR.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-black px-2.5 py-1 rounded-lg bg-amber-600 text-white">
                  60% - 74%
                </span>
                <div>
                  <div className="font-bold text-amber-900 dark:text-amber-200">Umbral (Zona de Riesgo)</div>
                  <div className="text-xs text-amber-800/80 dark:text-amber-300/80">
                    Aprobado justo; requiere afianzar diagnósticos diferenciales y guías clínicas.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-black px-2.5 py-1 rounded-lg bg-rose-600 text-white">
                  &lt; 60%
                </span>
                <div>
                  <div className="font-bold text-rose-900 dark:text-rose-200">Crítico (Prioridad Urgente)</div>
                  <div className="text-xs text-rose-800/80 dark:text-rose-300/80">
                    No dejes pasar más de 48 horas sin revisar la teoría de este tema.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ai-coach',
      title: '4. Perlas Clave & Trampas de Examen',
      subtitle: 'Puntos de alta rentabilidad PUR sin necesidad de API key',
      icon: <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      badge: '100% Libre y Offline',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            En la tarjeta de cualquier tema encontrarás el botón <strong className="text-indigo-600 dark:text-indigo-400">"Perlas PUR" ✨</strong>. Funciona de manera instantánea y local sin necesidad de configurar ninguna API key:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-indigo-950 dark:text-indigo-200 text-xs">
                  3 Perlas Clave de Alta Rentabilidad (High-Yield Pearls)
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Conceptos exactos, dosis de 1ra línea y criterios de internación que suelen evaluarse en el examen.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-amber-950 dark:text-amber-200 text-xs">
                  Trampa Clásica de Opción Múltiple
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  El distractor típico donde la mayoría de los postulantes se equivoca y cómo neutralizarlo.
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-blue-950 dark:text-blue-200 text-xs">
                  Mini-Test Express Interactivo
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  2 preguntas tipo caso clínico con opciones interactivas y justificación académica inmediata.
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sheets-and-darkmode',
      title: '5. Google Sheets, CSV y Modo Oscuro',
      subtitle: 'Tus datos siempre respaldados y comodidad visual nocturna',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Respaldo & Personalización',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p className="leading-relaxed">
            Nunca perderás tu progreso de estudio gracias a las múltiples opciones de guardado y confort visual:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">
                  Sincronización con Google Sheets (Google Drive)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Crea automáticamente una hoja de cálculo en tu Drive con 2 pestañas: <em>Historial detallado</em> y <em>Resumen por especialidad con porcentajes</em>. Puedes sincronizarla cuantas veces quieras.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-slate-700 text-white shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">
                  Descarga en formato CSV
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ¿Prefieres estudiar sin conexión? Descarga en 1 clic un archivo .CSV compatible con Excel, Numbers o cualquier planilla de cálculo.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">
                  Modo Oscuro para Estudio Nocturno
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Usa el selector en la barra superior (☀️ / 🌙 / 💻) para activar el modo oscuro y descansar la vista en largas jornadas de preparación.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const active = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Guía de Uso: PUR Tracker
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                  {active.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aprende a sacarle el máximo provecho a tu preparación para el examen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((s, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-white text-blue-600'
                      : isCompleted
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-2.5 h-2.5" /> : index + 1}
                </span>
                <span className="hidden sm:inline">{s.title.split('.')[1]?.trim() || s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
            {active.icon}
            <span>{active.title}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
            {active.subtitle}
          </p>

          <div className="pt-2">{active.content}</div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/90 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Paso {currentStep + 1} de {steps.length}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-colors"
              >
                <span>Siguiente paso</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenAddModal) {
                    onOpenAddModal();
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-colors"
              >
                <span>¡Entendido! Registrar un repaso</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
