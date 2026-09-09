import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { googleSignIn, getAccessToken } from '../lib/firebase';
import { exportToGoogleSheets } from '../lib/googleSheets';
import { ReviewAttempt, TopicSummary } from '../types';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  attempts: ReviewAttempt[];
  topicSummaries: TopicSummary[];
  spreadsheetUrl?: string;
  spreadsheetId?: string;
  onSpreadsheetUpdated: (id: string, url: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  user,
  attempts,
  topicSummaries,
  spreadsheetUrl,
  spreadsheetId,
  onSpreadsheetUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(spreadsheetUrl);
  const [currentId, setCurrentId] = useState<string | undefined>(spreadsheetId);

  if (!isOpen) return null;

  const handleConnectAndSync = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let token = getAccessToken();

      // If not logged in, trigger Google Sign-In popup with Sheets & Drive scopes
      if (!user || !token) {
        const res = await googleSignIn();
        if (!res?.accessToken) {
          throw new Error('No se pudo autenticar con Google');
        }
        token = res.accessToken;
      }

      const syncResult = await exportToGoogleSheets(
        token,
        attempts,
        topicSummaries,
        currentId
      );

      setCurrentId(syncResult.spreadsheetId);
      setCurrentUrl(syncResult.spreadsheetUrl);
      onSpreadsheetUpdated(syncResult.spreadsheetId, syncResult.spreadsheetUrl);
      setSuccessMessage(
        `¡Planilla sincronizada con éxito! Se registraron ${syncResult.rowsWritten} repasos en tu Google Drive.`
      );
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || 'Error al sincronizar con Google Sheets. Verifica los permisos de tu cuenta.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Fecha',
      'Tema',
      'Especialidad',
      'N_Repaso',
      'Correctas',
      'Total',
      'Porcentaje',
      'Notas',
    ];
    const rows = attempts.map((a) => [
      `"${a.date}"`,
      `"${a.topicName.replace(/"/g, '""')}"`,
      `"${a.specialty}"`,
      `"${a.reviewNumber}"`,
      `"${a.correctAnswers}"`,
      `"${a.totalQuestions}"`,
      `"${a.percentage.toFixed(1)}%"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `PUR_Repasos_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/60 dark:bg-slate-850/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Sincronización con Google Sheets
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tu registro oficial PUR directamente en tu Google Drive
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Exporta y actualiza automáticamente una planilla formateada con tu historial completo de repasos, evolución porcentual y estado de dominio por especialidad.
          </p>

          {/* Account Status */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 flex items-center justify-between">
            <div className="text-xs">
              <div className="font-bold text-slate-800 dark:text-slate-200">Cuenta de Google:</div>
              <div className="text-slate-500 dark:text-slate-400 font-medium">
                {user ? user.email : 'No conectado'}
              </div>
            </div>
            {user ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
              </span>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">Se solicitará acceso al sincronizar</span>
            )}
          </div>

          {/* Structure Info */}
          <div className="bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="font-bold text-slate-800 dark:text-slate-200">Estructura de la planilla:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>
                <strong>Pestaña 1 - Historial de Repasos:</strong> Fechas, temas, aciertos, total de preguntas, porcentajes y notas.
              </li>
              <li>
                <strong>Pestaña 2 - Resumen por Tema:</strong> Primer puntaje %, último puntaje %, variación (+%) y semáforo PUR.
              </li>
            </ul>
          </div>

          {/* Messages */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Link to Open Spreadsheet */}
          {currentUrl && (
            <div className="pt-2">
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-2xs transition-colors"
              >
                <span>Abrir mi planilla en Google Sheets</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Main Action Button */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleConnectAndSync}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-2xs transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sincronizando con Google Sheets...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>
                    {currentId ? 'Actualizar Planilla en Google Sheets' : 'Crear y Sincronizar Planilla'}
                  </span>
                </>
              )}
            </button>

            {/* Offline CSV Download fallback */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Descargar copia de seguridad en formato CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
