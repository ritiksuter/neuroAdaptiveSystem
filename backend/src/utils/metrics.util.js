export const computeEngagement = (interactions, emotions) => {
  const {
    clicks = 0,
    keystrokes = 0,
    focusTime = 0,
    scrolls = 0,
  } = interactions || {};
  const emotionEngagement = emotions?.engagement ?? 0;

  // Weight each factor (you can adjust these)
  const interactionScore = Math.min((clicks + keystrokes + scrolls) / 100, 1);
  const focusScore = Math.min(focusTime / 300, 1); // assume 300 seconds max focus

  // Final engagement is combination of interactions, focus, and emotion-based engagement
  const engagementScore =
    0.4 * interactionScore + 0.4 * focusScore + 0.2 * emotionEngagement;

  return Math.min(Math.max(engagementScore, 0), 1); // clamp between 0–1
};


export const computeCognitiveLoad = ({
  avgResponseTime = 0,
  accuracy = 1,
  confusion = 0,
}) => {
  // High response time + low accuracy + high confusion = high cognitive load
  const responseFactor = Math.min(avgResponseTime / 60, 1); // assuming 60 sec max reasonable
  const accuracyFactor = 1 - accuracy; // lower accuracy increases load
  const confusionFactor = confusion; // already 0–1

  const cognitiveLoad =
    0.4 * responseFactor + 0.4 * accuracyFactor + 0.2 * confusionFactor;
  return Math.min(Math.max(cognitiveLoad, 0), 1); // clamp between 0–1
};


export const computeSessionMetrics = ({ interactionLogs = [], emotionSnapshots = [], attempts = [] }) => {
  // Compute basic interaction summary
  const totalInteractions = interactionLogs.length;
  const clicks = interactionLogs.filter((i) => i.eventType === "click").length;
  const keystrokes = interactionLogs.filter((i) => i.eventType === "keystroke").length;
  const scrolls = interactionLogs.filter((i) => i.eventType === "scroll").length;
  const focusTime = interactionLogs.reduce((sum, i) => sum + (i.eventType === "focus" ? i.payload?.focusDuration || 0 : 0), 0);

  // Average emotion engagement
  const avgEmotionEngagement = emotionSnapshots.length
    ? emotionSnapshots.reduce((sum, e) => sum + (e.engagement || 0), 0) / emotionSnapshots.length
    : 0;

  // Compute engagement
  const engagementScore = computeEngagement({ clicks, keystrokes, focusTime, scrolls }, { engagement: avgEmotionEngagement });

  // Compute average response time and accuracy
  const avgResponseTime = attempts.length
    ? attempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0) / attempts.length
    : 0;
  const accuracy = attempts.length
    ? attempts.reduce((sum, a) => sum + (a.isCorrect ? 1 : 0), 0) / attempts.length
    : 1;

  // Average confusion from emotion snapshots
  const avgConfusion = emotionSnapshots.length
    ? emotionSnapshots.reduce((sum, e) => sum + (e.confusion || 0), 0) / emotionSnapshots.length
    : 0;

  // Cognitive load
  const cognitiveLoad = computeCognitiveLoad({ avgResponseTime, accuracy, confusion: avgConfusion });

  return {
    engagementScore,
    avgResponseTime,
    accuracy,
    cognitiveLoad,
  };
};