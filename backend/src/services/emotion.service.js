// services/emotion.service.js
import { EmotionSnapshot } from "../models/emotionSnapshot.model.js";

/**
 * Mock function: replace this with real ML model inference (DeepFace / HuggingFace)
 * Input: image buffer/base64 or frame URL
 * Output: predicted emotions { happy, sad, angry, neutral, surprise, disgust, fear }
 */

export const predictEmotions = async (frameData) => {
  // Placeholder: fake random emotions for testing
  // TODO: Replace with real inference logic
  return {
    happy: Math.random(),
    sad: Math.random(),
    angry: Math.random(),
    neutral: Math.random(),
    surprise: Math.random(),
    disgust: Math.random(),
    fear: Math.random(),
  };
};

/**
 * Computes high-level metrics like engagement, confusion, stress from emotions
 * @param {object} emotions - predicted emotions from ML model
 */

export const computeDerivedMetrics = (emotions) => {
  const engagement = (emotions.happy + emotions.neutral + emotions.surprise) / 3;
  const confusion = emotions.sad + emotions.angry;
  const stress = emotions.angry + emotions.fear + emotions.disgust;

  return {
    engagement: Math.min(Math.max(engagement, 0), 1),
    confusion: Math.min(Math.max(confusion, 0), 1),
    stress: Math.min(Math.max(stress, 0), 1),
  };
};

/**
 * Saves an emotion snapshot to the database
 * @param {Object} params
 * @param {String} params.sessionId
 * @param {String} params.userId
 * @param {Object} params.frameData - image/base64/frame URL
 * @param {String} params.modelVersion
 */

export const saveEmotionSnapshot = async ({ sessionId, userId, frameData, modelVersion = "v1.0" }) => {
  try {
    // 1. Predict emotions from frame
    const emotions = await predictEmotions(frameData);

    // 2. Compute derived metrics
    const { engagement, confusion, stress } = computeDerivedMetrics(emotions);

    // 3. Save to DB
    const snapshot = await EmotionSnapshot.create({
      session: sessionId,
      user: userId,
      emotions,
      engagement,
      confusion,
      stress,
      frameUrl: frameData?.url || null,
      modelVersion,
    });

    return snapshot;
  } catch (err) {
    console.error("Emotion service error:", err.message);
    throw new Error("Failed to process emotion snapshot");
  }
};