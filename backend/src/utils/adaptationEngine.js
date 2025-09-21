/**
 * Simple rule-based adaptation engine
 * Returns an array of recommended adaptive actions based on session metrics
 */

export const decideAdaptiveActions = (metrics) => {
  const actions = [];
  
  if (!metrics) return actions;
  
  const { engagementScore=1, cognitiveLoad=0, accuracy=1 } = metrics;

  // Low engagement → gamify or simplify
  if (engagementScore < 0.4) {
    actions.push({
      actionType: "gamify",
      reason: "Low engagement detected",
    });
    actions.push({
      actionType: "simplify",
      reason: "Low engagement detected",
    });
  }

  // High cognitive load → suggest break or hint
  if (cognitiveLoad > 0.6) {
    actions.push({
      actionType: "suggestBreak",
      reason: "High cognitive load",
    });
    actions.push({
      actionType: "hint",
      reason: "High cognitive load",
    });
  }

  // Low accuracy → challenge or hint
  if (accuracy < 0.5) {
    actions.push({
      actionType: "challenge",
      reason: "Low accuracy observed",
    });
  }

  // Additional rules can be added or ML model predictions can replace these
  return actions;
};
