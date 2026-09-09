import { PURTopicDef, ReviewAttempt, ScoreStatus, TopicSummary } from '../types';

export function computeTopicSummaries(
  attempts: ReviewAttempt[],
  definedTopics: PURTopicDef[]
): TopicSummary[] {
  // Group attempts by topicId or topicName
  const grouped: Record<string, ReviewAttempt[]> = {};

  attempts.forEach((att) => {
    const key = att.topicId || att.topicName.toLowerCase().trim();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(att);
  });

  const now = new Date().getTime();
  const summaries: TopicSummary[] = [];
  const processedTopicIds = new Set<string>();

  // 1. Process all topics with attempts
  Object.entries(grouped).forEach(([key, list]) => {
    // Sort chronological
    const sorted = [...list].sort((a, b) => {
      if (a.reviewNumber !== b.reviewNumber) {
        return a.reviewNumber - b.reviewNumber;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const first = sorted[0];
    const latest = sorted[sorted.length - 1];
    const firstScore = first.percentage;
    const latestScore = latest.percentage;
    const highest = Math.max(...sorted.map((a) => a.percentage));
    const delta = sorted.length > 1 ? latestScore - firstScore : 0;

    const topicDef = definedTopics.find(
      (t) =>
        t.id === latest.topicId ||
        t.name.toLowerCase().trim() === latest.topicName.toLowerCase().trim()
    );

    if (topicDef) {
      processedTopicIds.add(topicDef.id);
    }
    if (latest.topicId) {
      processedTopicIds.add(latest.topicId);
    }

    const isHighYield = topicDef ? topicDef.isHighYield : false;

    // Determine status based on latest score
    let status: ScoreStatus = 'critical';
    if (latestScore >= 85) status = 'mastered';
    else if (latestScore >= 75) status = 'solid';
    else if (latestScore >= 60) status = 'threshold';
    else status = 'critical';

    // Days since last review
    const lastDate = new Date(latest.date).getTime();
    const daysSince = Math.max(0, Math.floor((now - lastDate) / (1000 * 60 * 60 * 24)));

    // Optimal interval in days based on mastery and repetition count
    let optimalIntervalDays = 3;
    if (status === 'mastered') {
      optimalIntervalDays = sorted.length >= 3 ? 30 : 21;
    } else if (status === 'solid') {
      optimalIntervalDays = sorted.length >= 2 ? 14 : 9;
    } else if (status === 'threshold') {
      optimalIntervalDays = 5;
    } else {
      optimalIntervalDays = 2; // Critical
    }

    const isDue = daysSince >= optimalIntervalDays;

    // Calculate urgency score (higher = should study first)
    const urgency =
      (100 - latestScore) * (isHighYield ? 1.35 : 1.0) + (daysSince / optimalIntervalDays) * 30;

    let priorityReason = '';
    if (status === 'critical') {
      priorityReason = `Puntaje bajo (${latestScore.toFixed(0)}%). Refuerzo urgente recomendado.`;
    } else if (isDue) {
      priorityReason = `Pasaron ${daysSince} días desde el último repaso (intervalo óptimo: ${optimalIntervalDays}d).`;
    } else if (status === 'threshold') {
      priorityReason = `Puntaje en umbral (${latestScore.toFixed(0)}%). Conviene subir a zona de confort (≥75%).`;
    } else {
      priorityReason = `Tema afianzado (${latestScore.toFixed(0)}%). Mantener con repaso periódico.`;
    }

    summaries.push({
      topicId: topicDef ? topicDef.id : key,
      topicName: latest.topicName,
      specialty: latest.specialty,
      isHighYield,
      attempts: sorted,
      firstAttempt: first,
      latestAttempt: latest,
      firstPercentage: firstScore,
      latestPercentage: latestScore,
      highestPercentage: highest,
      deltaPercentage: delta,
      totalReviews: sorted.length,
      status,
      urgencyScore: urgency,
      daysSinceLastReview: daysSince,
      isDueForReview: isDue,
      priorityReason,
    });
  });

  // 2. Add unreviewed official topics from definedTopics
  definedTopics.forEach((def) => {
    if (!processedTopicIds.has(def.id)) {
      summaries.push({
        topicId: def.id,
        topicName: def.name,
        specialty: def.specialty,
        isHighYield: def.isHighYield,
        attempts: [],
        firstPercentage: 0,
        latestPercentage: 0,
        highestPercentage: 0,
        deltaPercentage: 0,
        totalReviews: 0,
        status: 'unreviewed',
        urgencyScore: def.isHighYield ? 45 : 30,
        daysSinceLastReview: 0,
        isDueForReview: false,
        priorityReason: 'Tema oficial PUR 2026 pendiente de primer repaso.',
      });
    }
  });

  // Sort by urgency descending (topics with reviews and high urgency first, then pending)
  return summaries.sort((a, b) => {
    // If one has reviews and the other doesn't, prioritize reviewed topics with urgent needs
    if (a.totalReviews > 0 && b.totalReviews === 0) {
      return a.urgencyScore >= 40 ? -1 : 1;
    }
    if (b.totalReviews > 0 && a.totalReviews === 0) {
      return b.urgencyScore >= 40 ? 1 : -1;
    }
    return b.urgencyScore - a.urgencyScore;
  });
}
