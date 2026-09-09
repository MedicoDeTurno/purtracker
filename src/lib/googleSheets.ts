import { ReviewAttempt, TopicSummary } from '../types';

export interface SyncResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  rowsWritten: number;
}

export async function exportToGoogleSheets(
  accessToken: string,
  attempts: ReviewAttempt[],
  topicSummaries: TopicSummary[],
  existingSpreadsheetId?: string
): Promise<SyncResult> {
  let spreadsheetId = existingSpreadsheetId;

  // Step 1: If no spreadsheet ID exists, create a new one
  if (!spreadsheetId) {
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `PUR Tracker - Registro y Progreso de Repasos (${new Date().toLocaleDateString('es-AR')})`,
        },
        sheets: [
          {
            properties: {
              title: 'Historial de Repasos',
              gridProperties: { frozenRowCount: 1 },
            },
          },
          {
            properties: {
              title: 'Resumen por Tema',
              gridProperties: { frozenRowCount: 1 },
            },
          },
        ],
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.error?.message || 'Error al crear la planilla de Google Sheets');
    }

    const createData = await createRes.json();
    spreadsheetId = createData.spreadsheetId;
  }

  // Step 2: Build Historial data rows
  const historialHeaders = [
    'Fecha',
    'Tema',
    'Especialidad',
    'N° Repaso',
    'Correctas',
    'Total Preguntas',
    'Porcentaje (%)',
    'Notas / Dudas',
  ];

  const sortedAttempts = [...attempts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const historialRows = sortedAttempts.map((att) => [
    att.date,
    att.topicName,
    att.specialty,
    `Repaso ${att.reviewNumber}`,
    att.correctAnswers,
    att.totalQuestions,
    `${att.percentage.toFixed(1)}%`,
    att.notes || '',
  ]);

  const historialPayload = {
    values: [historialHeaders, ...historialRows],
  };

  // Step 3: Build Resumen por Tema rows
  const resumenHeaders = [
    'Tema',
    'Especialidad',
    'Total Repasos',
    '1° Puntaje (%)',
    'Último Puntaje (%)',
    'Evolución (%)',
    'Estado Actual',
    'Última Fecha',
  ];

  const resumenRows = topicSummaries.map((s) => [
    s.topicName,
    s.specialty,
    s.totalReviews,
    `${s.firstPercentage.toFixed(1)}%`,
    `${s.latestPercentage.toFixed(1)}%`,
    `${s.deltaPercentage >= 0 ? '+' : ''}${s.deltaPercentage.toFixed(1)}%`,
    s.status === 'mastered'
      ? 'Excelente (≥85%)'
      : s.status === 'solid'
      ? 'Sólido (75-84%)'
      : s.status === 'threshold'
      ? 'Umbral (60-74%)'
      : 'Crítico (<60%)',
    s.latestAttempt?.date || '',
  ]);

  const resumenPayload = {
    values: [resumenHeaders, ...resumenRows],
  };

  // Push Historial sheet
  const updateHistorialRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Historial de Repasos'!A1:H?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historialPayload),
    }
  );

  if (!updateHistorialRes.ok) {
    const err = await updateHistorialRes.json();
    throw new Error(err.error?.message || 'Error al actualizar el historial en Google Sheets');
  }

  // Push Resumen sheet (best effort if sheet exists)
  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Resumen por Tema'!A1:H?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumenPayload),
      }
    );
  } catch (e) {
    console.warn('Could not update second tab:', e);
  }

  return {
    spreadsheetId: spreadsheetId!,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    rowsWritten: historialRows.length,
  };
}
