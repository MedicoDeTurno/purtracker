import { AIPearlResponse, Specialty } from '../types';

export interface TopicPearlData {
  pearls: string[];
  commonMistake: string;
  flashQuestions: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }[];
  encouragement: string;
}

export const CURATED_TOPIC_PEARLS: Record<string, TopicPearlData> = {
  'Infecciones del tracto urinario (ITU)': {
    pearls: [
      'Bacteriuria asintomática (BA) solo se trata en embarazadas y previo a procedimientos urológicos invasivos. No tratar en ancianos institucionalizados ni diabéticos sin síntomas.',
      'En cistitis aguda no complicada en mujeres en edad fértil: Nitrofurantoína 100 mg c/12h por 5 días o Fosfomicina 3g dosis única. Evitar fluoroquinolonas como primera línea por resistencia y efectos adversos.',
      'En pielonefritis aguda ambulatoria: Ciprofloxacino 500 mg c/12h o Ceftriaxona 1g IM inicial seguido de cefalosporina oral. Tomar siempre urocultivo previo.',
    ],
    commonMistake:
      'Indicar urocultivo y antibióticos a ancianos con tira reactiva positiva pero sin disuria ni fiebre (bacteriuria asintomática o piuria estéril). ¡Pregunta clásica trampa en el PUR!',
    flashQuestions: [
      {
        question:
          'Mujer de 28 años, cursando embarazo de 12 semanas, asintomática. En urocultivo de control de rutina se aisla E. coli > 100.000 UFC/ml sensible a cefalexina y nitrofurantoína. ¿Cuál es la conducta adecuada?',
        options: [
          'A) No requiere tratamiento por ser asintomática',
          'B) Indicar tratamiento antibiótico reglado y urocultivo de control post-tratamiento',
          'C) Repetir urocultivo en 4 semanas para confirmar',
          'D) Indicar acidificación urinaria con vitamina C exclusivamente',
        ],
        correctAnswerIndex: 1,
        explanation:
          'En embarazadas, la bacteriuria asintomática aumenta el riesgo de pielonefritis, parto prematuro y bajo peso al nacer. Debe tratarse y realizarse urocultivo de control a los 7-14 días.',
      },
      {
        question:
          '¿Cuál es el tratamiento de primera línea recomendado para la cistitis aguda no complicada en una mujer no embarazada según las guías clínicas actuales?',
        options: [
          'A) Ciprofloxacino 500 mg cada 12 hs por 7 días',
          'B) Amoxicilina 500 mg cada 8 hs por 10 días',
          'C) Nitrofurantoína 100 mg cada 12 hs por 5 días o Fosfomicina 3g dosis única',
          'D) Trimetoprima-Sulfametoxazol por 14 días',
        ],
        correctAnswerIndex: 2,
        explanation:
          'Nitrofurantoína y Fosfomicina son los fármacos de primera elección por baja tasa de resistencia y menor daño colateral sobre la microbiota en comparación con quinolonas.',
      },
    ],
    encouragement: '¡Excelente tema de alto rendimiento en el PUR! Dominar ITU garantiza aciertos.',
  },

  'Hipertensión arterial (HTA)': {
    pearls: [
      'Meta tensional estándar: <130/80 mmHg en la mayoría de pacientes con HTA confirmada y riesgo cardiovascular aumentado.',
      'En diabéticos o con proteinuria/ERC: IECA o ARA-II son de primera elección por su efecto nefroprotector (reducen proteinuria).',
      'Crisis hipertensiva: si hay daño de órgano blanco agudo es EMERGENCIA (tratar con vasodilatadores parenterales reduciendo PAM 20-25% en primera hora). Si no hay daño es URGENCIA (manejo oral ambulatorio/observación).',
    ],
    commonMistake:
      'Descender bruscamente la presión arterial con nifedipina sublingual en urgencias hipertensivas sin daño de órgano blanco (puede provocar isquemia miocárdica o cerebral aguda).',
    flashQuestions: [
      {
        question:
          'Varón de 55 años, asintomático, acude a guardia con TA de 190/110 mmHg constatada en dos tomas. Fondo de ojo normal, ECG sin cambios agudos, sin dolor torácico ni déficit neurológico. ¿Cuál es el manejo adecuado?',
        options: [
          'A) Administrar nitroprusiato de sodio intravenoso de inmediato',
          'B) Nifedipina 10 mg sublingual',
          'C) Reposo, reevaluación y ajuste de medicación por vía oral con seguimiento ambulatorio en 24-48 hs',
          'D) Internación en Unidad de Terapia Intensiva',
        ],
        correctAnswerIndex: 2,
        explanation:
          'Se trata de una Urgencia Hipertensiva (sin daño agudo de órgano blanco). El descenso debe ser gradual con fármacos orales para evitar hipotensión isquémica.',
      },
      {
        question:
          '¿Cuál de las siguientes combinaciones de antihipertensivos está CONTRAINDICADA debido a mayor riesgo de hiperpotasemia e insuficiencia renal?',
        options: [
          'A) Enalapril + Amlodipina',
          'B) Losartán + Hidroclorotiazida',
          'C) Enalapril + Losartán (IECA + ARA-II)',
          'D) Amlodipina + Indapamida',
        ],
        correctAnswerIndex: 2,
        explanation:
          'El bloqueo dual del sistema renina-angiotensina (IECA + ARA-II o aliskireno) no aporta beneficios cardiovasculares y aumenta significativamente la hiperpotasemia e insuficiencia renal aguda.',
      },
    ],
    encouragement: '¡La HTA es una de las preguntas fijas en Medicina Interna y Familia del PUR!',
  },

  'Diabetes Mellitus tipo 2': {
    pearls: [
      'Criterios diagnósticos: Glucemia en ayunas ≥126 mg/dl (en 2 tomas), PTOG 2h ≥200 mg/dl, HbA1c ≥6.5% o glucemia al azar ≥200 mg/dl con síntomas cardinales.',
      'Metformina sigue siendo el pilar inicial. Si existe enfermedad cardiovascular aterosclerótica previa o insuficiencia renal/falla cardíaca: priorizar iSGLT2 o arGLP-1 independiente de la HbA1c.',
      'En hipoglucemia severa en paciente inconsciente fuera del hospital: Glucagón 1 mg SC/IM. En ámbito hospitalario: Dextrosa al 10-25% EV.',
    ],
    commonMistake:
      'Suspender metformina por elevación transitoria de transaminasas o indicar sulfonilureas en ancianos con alto riesgo de hipoglucemia prolongada (evitar glibenclamida en adultos mayores).',
    flashQuestions: [
      {
        question:
          'Paciente de 62 años con DM2 e historia de infarto agudo de miocardio hace 2 años y fracción de eyección del 38%. ¿Cuál de los siguientes grupos farmacológicos ha demostrado reducir internaciones por insuficiencia cardíaca y muerte cardiovascular?',
        options: [
          'A) Sulfonilureas (Glibenclamida)',
          'B) Inhibidores de SGLT2 (ej. Dapagliflozina, Empagliflozina)',
          'C) Inhibidores de DPP-4 (Saxagliptina)',
          'D) Tiazolidinedionas (Pioglitazona)',
        ],
        correctAnswerIndex: 1,
        explanation:
          'Los iSGLT2 han demostrado beneficio cardiovascular y reducción de hospitalizaciones por insuficiencia cardíaca y progresión de enfermedad renal en múltiples ensayos clínicos.',
      },
      {
        question:
          '¿Cuál es el valor diagnóstico de glucemia plasmática en ayunas (2 tomas separadas) que define Diabetes Mellitus?',
        options: [
          'A) ≥ 100 mg/dl',
          'B) ≥ 110 mg/dl',
          'C) ≥ 126 mg/dl',
          'D) ≥ 140 mg/dl',
        ],
        correctAnswerIndex: 2,
        explanation:
          'Glucemia plasmática en ayunas ≥126 mg/dl confirmada en dos tomas diferentes es criterio diagnóstico de Diabetes Mellitus.',
      },
    ],
    encouragement: '¡Tema nuclear del examen! Revisar siempre la nefropatía y el pie diabético.',
  },

  'Preeclampsia y eclampsia': {
    pearls: [
      'Definición de Preeclampsia: TA ≥140/90 mmHg después de la semana 20 de gestación + proteinuria (≥300 mg/24h) O en su ausencia, signos de daño de órgano blanco (plaquetopenia <100k, transaminasas x2, creatinina >1.1).',
      'Sulfato de magnesio es la droga de elección para la prevención y tratamiento de convulsiones eclampsicas (esquema de Zuspan o Pritchard). El antídoto ante intoxicación es el Gluconato de Calcio al 10%.',
      'Profilaxis con Aspirina 100-150 mg/día desde la semana 12 a 16 hasta la semana 36 en pacientes con factores de alto riesgo.',
    ],
    commonMistake:
      'Usar diazepam o fenitoína para tratar las convulsiones en eclampsia en lugar de sulfato de magnesio, o no controlar los reflejos osteotendinosos para vigilar intoxicación por magnesio.',
    flashQuestions: [
      {
        question:
          'Gestante de 34 semanas con TA 160/110 mmHg, cefalea intensa y epigastralgia. Se inicia goteo de sulfato de magnesio. Al cabo de 2 horas la paciente presenta reflejo rotuliano abolido y bradipnea (9 rpm). ¿Cuál es la conducta inmediata?',
        options: [
          'A) Aumentar la velocidad de infusión de sulfato de magnesio',
          'B) Suspender infusión de sulfato y administrar Gluconato de Calcio al 10% 1g EV lento',
          'C) Administrar Diazepam 10 mg EV',
          'D) Realizar cesárea de emergencia sin suspender la medicación',
        ],
        correctAnswerIndex: 1,
        explanation:
          'La abolición del reflejo rotuliano y la depresión respiratoria son signos cardinales de intoxicación por magnesio. Debe suspenderse la infusión y administrarse el antídoto específico: Gluconato de Calcio.',
      },
      {
        question:
          '¿Cuál es el antihipertensivo de primera línea recomendado para el manejo de la crisis hipertensiva en el embarazo (TA ≥160/110 mmHg)?',
        options: [
          'A) Enalapril intravenoso',
          'B) Labetalol intravenoso o Nifedipina vía oral',
          'C) Nitroprusiato de sodio',
          'D) Espironolactona',
        ],
        correctAnswerIndex: 1,
        explanation:
          'Labetalol EV, Nifedipina oral o Hidralazina EV son las drogas de primera línea para crisis hipertensivas en embarazadas. Los IECA/ARA-II están formalmente contraindicados por teratogenicidad/toxicidad fetal.',
      },
    ],
    encouragement: '¡Tema estrella en Gineco-Obstetricia! Recordar siempre el sulfato de magnesio.',
  },

  'Apendicitis aguda': {
    pearls: [
      'Secuencia de Murphy: dolor periumbilical/epigástrico que migra a fosa ilíaca derecha en 12-24h, acompañado de anorexia, náuseas y febrícula.',
      'Signo de Blumberg (descompresión dolorosa en FID) indica irritación peritoneal local. En niños y ancianos la presentación suele ser atípica con mayor tasa de perforación.',
      'Estudio de imagen de elección en niños y embarazadas: Ecografía abdominal con compresión graduada. En adultos no embarazados con dudas diagnósticas: TAC abdominopelviana con contraste.',
    ],
    commonMistake:
      'Retrasar la cirugía en espera de estudios innecesarios cuando el cuadro clínico es típico en un adulto joven masculino (el diagnóstico es eminentemente clínico).',
    flashQuestions: [
      {
        question:
          'Varón de 24 años con dolor de 14 horas de evolución que inició en epigastrio y ahora se localiza en fosa ilíaca derecha con Blumberg (+), fiebre de 38°C y leucocitosis de 14.500/mm³ con desviación a la izquierda. ¿Cuál es la conducta adecuada?',
        options: [
          'A) Antibioticoterapia oral y control en 48 hs',
          'B) Resonancia magnética nuclear de abdomen',
          'C) Apendicectomía quirúrgica (laparoscópica o convencional)',
          'D) Colonoscopía de urgencia',
        ],
        correctAnswerIndex: 2,
        explanation:
          'Ante un cuadro clínico clásico de apendicitis aguda en paciente joven, la conducta indicada es la exploración quirúrgica y apendicectomía sin demoras.',
      },
      {
        question:
          'En una mujer de 26 años en su segundo trimestre de embarazo con sospecha de apendicitis aguda, ¿cuál es el estudio de imagen inicial de elección?',
        options: [
          'A) Tomografía computarizada con contraste intravenoso',
          'B) Radiografía simple de abdomen de pie',
          'C) Ecografía abdominal con compresión gradual',
          'D) Gammagrafía con leucocitos marcados',
        ],
        correctAnswerIndex: 2,
        explanation:
          'La ecografía es el método inicial de elección en embarazadas por carecer de radiación ionizante. Si es inconcluyente, se puede recurrir a RMN sin gadolinio o TAC de baja dosis.',
      },
    ],
    encouragement: '¡Tema número 1 de Cirugía General en cualquier examen de residencia médica!',
  },

  'Neumonía adquirida en la comunidad (NAC)': {
    pearls: [
      'Agente etiológico bacteriano más frecuente: Streptococcus pneumoniae (neumococo). En adultos jóvenes ambulatorios considerar también Mycoplasma pneumoniae.',
      'Estratificación de riesgo con CURB-65 (Confusión, Urea >42 mg/dl o BUN >19, Frecuencia respiratoria ≥30, Presión arterial sistólica <90 o diastólica ≤60, Edad ≥65 años). 0-1: ambulatorio; 2: sala general; ≥3: evaluar UTI.',
      'Tratamiento empírico ambulatorio típico: Amoxicilina 1g c/8h o Amoxicilina/Clavulánico. Si sospecha de atípicos o alergia a betalactámicos: Macrólido (Claritromicina/Azitromicina) o Levofloxacino.',
    ],
    commonMistake:
      'Hospitalizar a todos los pacientes ancianos sin evaluar escalas objetivas como CURB-65 o CRB-65, o solicitar radiografía de tórax de control antes de las 4-6 semanas en pacientes que han respondido clínicamente.',
    flashQuestions: [
      {
        question:
          'Hombre de 70 años consulta por tos productiva, fiebre y disnea. Al examen: lúcido, TA 125/80 mmHg, FC 92 lpm, FR 22 rpm, SatO2 96% aire ambiente. Urea en sangre 28 mg/dl. Radiografía muestra condensación en lóbulo inferior derecho. Puntuación CURB-65 = 1 (por edad). ¿Dónde debe realizarse el tratamiento?',
        options: [
          'A) Ingreso en Unidad de Cuidados Intensivos',
          'B) Internación en sala general de clínica médica',
          'C) Tratamiento ambulatorio con pautas de alarma y control en 48 hs',
          'D) Alta definitiva sin seguimiento',
        ],
        correctAnswerIndex: 2,
        explanation:
          'Con CURB-65 de 0 a 1 y sin criterios de descompensación social o hipoxemia severa, el paciente puede recibir tratamiento antimicrobiano ambulatorio seguro.',
      },
      {
        question:
          '¿Cuál es la causa bacteriana más común de Neumonía Adquirida en la Comunidad en todos los grupos etarios de adultos?',
        options: [
          'A) Pseudomonas aeruginosa',
          'B) Streptococcus pneumoniae',
          'C) Klebsiella pneumoniae',
          'D) Staphylococcus aureus meticilino-resistente',
        ],
        correctAnswerIndex: 1,
        explanation:
          'Streptococcus pneumoniae (neumococo) es el microorganismo causal más frecuente de NAC a nivel mundial.',
      },
    ],
    encouragement: '¡Manejo y escala CURB-65 son infaltables en el temario del PUR!',
  },
};

/**
 * Generates tailored PUR high-yield clinical pearls for any topic and specialty without requiring an external API key.
 */
export function getPURClinicalPearls(
  topicName: string,
  specialty: Specialty,
  percentage: number = 0,
  reviewCount: number = 0
): AIPearlResponse {
  // Check exact or partial match in curated repository
  const directMatchKey = Object.keys(CURATED_TOPIC_PEARLS).find(
    (k) =>
      k.toLowerCase() === topicName.toLowerCase() ||
      topicName.toLowerCase().includes(k.toLowerCase().split(' ')[0])
  );

  if (directMatchKey) {
    const data = CURATED_TOPIC_PEARLS[directMatchKey];
    return {
      pearls: data.pearls,
      commonMistake: data.commonMistake,
      flashQuestions: data.flashQuestions,
      encouragement:
        reviewCount > 1
          ? `¡Llevas ${reviewCount} repasos en este tema! Enfócate en las opciones trampa para consolidar el percentil alto en el PUR.`
          : data.encouragement,
    };
  }

  // Specialty-tailored high-yield template
  const specTips: Record<string, { pearls: string[]; mistake: string }> = {
    'Medicina Familiar y Comunitaria': {
      pearls: [
        'En APS y Medicina Familiar, el PUR prioriza prevención primaria/secundaria, cribados según evidencia (guías USPSTF/Ministerio de Salud) y uso racional de fármacos.',
        'Recordar siempre la indicación estricta de vacunas del Calendario Nacional y los criterios de derivación oportuna al segundo nivel.',
        'La entrevista clínica centrada en la persona y el modelo biopsicosocial son ejes transversales evaluados en casos clínicos.',
      ],
      mistake:
        'Solicitar estudios complementarios de alta complejidad o cribados no avalados por evidencia (ej: PSA indiscriminado o radiografía de tórax de rutina en asintomáticos).',
    },
    'Medicina Interna': {
      pearls: [
        'Priorizar siempre la sospecha diagnóstica sindromática previa al tratamiento definitivo.',
        'Criterios de gravedad y estratificación de riesgo antes de definir internación vs. tratamiento ambulatorio.',
        'Interacciones farmacológicas, ajuste de dosis por filtrado glomerular (CKD-EPI) y contraindicaciones absolutas.',
      ],
      mistake:
        'Tratar el valor del laboratorio en lugar del estado clínico del paciente (ej: corrección ultra rápida de hiponatremia con riesgo de desmielinización osmótica).',
    },
    Ginecotología: {
      pearls: [
        'En hemorragia del primer trimestre descartar siempre embarazo ectópico antes de cualquier otra entidad.',
        'Monitoreo fetal, vitalidad y criterios de terminación del embarazo en patología obstétrica de urgencia.',
        'Cáncer de cuello uterino y mama: conocer edades de inicio y frecuencia de tamizaje (PAP/VPH y mamografía).',
      ],
      mistake:
        'Administrar fármacos contraindicados en el embarazo (ej: IECA, ARA-II, tetraciclinas, warfarina) en preguntas de opción múltiple.',
    },
    Cirugía: {
      pearls: [
        'Dolor abdominal agudo: diferenciar abdomen agudo inflamatorio, obstructivo, perforativo, vascular y hemorrágico.',
        'Manejo del paciente politraumatizado según protocolo ATLS: A (vía aérea), B (ventilación), C (circulación/control de hemorragias).',
        'Profilaxis antibiótica quirúrgica: dosis única dentro de los 60 minutos previos a la incisión según tipo de cirugía.',
      ],
      mistake:
        'Indicar analgésicos opioides potentes que enmascaren el cuadro antes de la evaluación médica quirúrgica en abdomen agudo no diagnosticado.',
    },
    Pediatría: {
      pearls: [
        'Hitos del desarrollo psicomotor y curvas de crecimiento (OMS): percentiles <3 o >97 marcan alarma.',
        'Infecciones respiratorias agudas bajas (IRAB): bronquiolitis (manejo de soporte, no usar corticoides ni salbutamol de rutina) y laringitis (dexametasona dosis única).',
        'Deshidratación: evaluar según grados (A, B, C) y priorizar terapia de rehidratación oral (Plan B con sales OMS).',
      ],
      mistake:
        'Indicar antibióticos para bronquiolitis viral o gastroenteritis aguda acuosa sin disentería.',
    },
    Psiquiatría: {
      pearls: [
        'Urgencias psiquiátricas: evaluación del riesgo suicida (preguntar abiertamente NO induce al suicidio y es mandatorio).',
        'Diferenciar síndrome neuroléptico maligno (hipertermia, rigidez en tubo de plomo, aumento de CPK) vs. síndrome serotoninérgico (hiperreflexia, clonus).',
        'Trastornos del estado de ánimo: inicio de antidepresivos tarda 2 a 4 semanas; vigilar activación psicomotriz inicial.',
      ],
      mistake:
        'Indicar benzodiacepinas en pacientes con delirium o intoxicación por depresores del SNC.',
    },
    'Medicina Legal': {
      pearls: [
        'Secreto médico: es un derecho del paciente y deber del profesional. Solo se revela con justa causa o mandato judicial expreso.',
        'Certificado de defunción: causas de muerte (causa inmediata, intermedia y fundamental o básica). Prohibido consignar "paro cardiorrespiratorio" como causa básica.',
        'Lesiones: clasificación legal (leves, graves, gravísimas) según tiempo de curación/inhabilitación laboral.',
      ],
      mistake:
        'Consignar mecanismos de muerte (paro cardiorrespiratorio o shock séptico) como causa básica en el certificado de defunción.',
    },
    Bioética: {
      pearls: [
        'Los cuatro principios de Beauchamp y Childress: Autonomía, Beneficencia, No Maleficencia y Justicia distributiva.',
        'Consentimiento informado: proceso continuo, libre e informado, revocable en cualquier momento sin represalias para el paciente.',
        'Directivas anticipadas y decisiones al final de la vida: limitar el esfuerzo terapéutico no equivale a eutanasia ni a abandono.',
      ],
      mistake:
        'Anteponer el paternalismo médico sobre la voluntad informada de un paciente competente.',
    },
  };

  const currentSpecData = specTips[specialty] || specTips['Medicina Interna'];

  return {
    pearls: [
      `Punto Clave 1 (${topicName}): Revisar las guías de práctica clínica oficiales y consensos nacionales frecuentemente citados en el PUR.`,
      `Punto Clave 2: ${currentSpecData.pearls[0]}`,
      `Punto Clave 3: ${currentSpecData.pearls[1]}`,
    ],
    commonMistake: currentSpecData.mistake,
    flashQuestions: [
      {
        question: `En relación a "${topicName}" en el ámbito de ${specialty}, ¿cuál de las siguientes afirmaciones refleja la mejor práctica clínica actual?`,
        options: [
          `A) La evaluación clínica sistemática y la estratificación de riesgo deben preceder a estudios invasivos`,
          `B) Todo paciente debe ser hospitalizado inmediatamente independientemente de la estabilidad clínica`,
          `C) El tratamiento antibiótico empírico de amplio espectro debe indicarse sin tomar muestras previas`,
          `D) Los controles complementarios deben repetirse diariamente en pacientes ambulatorios asintomáticos`,
        ],
        correctAnswerIndex: 0,
        explanation:
          'La estratificación de riesgo basada en la evidencia permite un uso racional de recursos diagnósticos y terapéuticos, pilar central en las preguntas del examen PUR.',
      },
      {
        question: `¿Cuál es una consideración prioritaria al planificar el seguimiento y tratamiento de "${topicName}"?`,
        options: [
          `A) Ignorar las comorbilidades y centrarse únicamente en el motivo de consulta aislado`,
          `B) Explicar pautas de alarma claras al paciente y consensuar el plan terapéutico`,
          `C) Suspender medicación crónica en todas las consultas sin justificación`,
          `D) Derivar inmediatamente a tercer nivel sin ninguna evaluación básica inicial`,
        ],
        correctAnswerIndex: 1,
        explanation:
          'Las pautas de alarma claras y la educación del paciente son sistemáticamente premiadas en las preguntas de casos clínicos del examen único de residencias.',
      },
    ],
    encouragement: `¡Avanza firme con "${topicName}"! La repetición espaciada y el análisis de errores aseguran tu plaza en la residencia.`,
  };
}
