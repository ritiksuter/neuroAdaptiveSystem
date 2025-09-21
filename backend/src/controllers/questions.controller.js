import { Question } from "../models/question.model.js";

// CREATE a new question
export const createQuestion = async (req, res, next) => {
  try {
    const { title, content, type, choices, correctAnswer, difficulty, tags, estimatedTime } = req.body;

    const question = await Question.create({
      title,
      content,
      type,
      choices,
      correctAnswer,
      difficulty,
      tags,
      estimatedTime,
      createdBy: req.user?.id, // assuming auth middleware sets req.user
    });

    return res.status(201).json({
      message: "Question created successfully",
      question,
    });
  } catch (err) {
    next(err);
  }
};


// GET all questions (with optional filtering by type, difficulty, tags)
export const getAllQuestions = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.difficulty) filter.difficulty = Number(req.query.difficulty);
    if (req.query.tags) filter.tags = { $in: req.query.tags.split(",").map(tag => tag.toLowerCase().trim()) };

    const questions = await Question.find(filter).populate("createdBy", "name email role");

    return res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
};


// GET a single question by ID
export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate("createdBy", "name email role");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};


// UPDATE a question by ID
export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const question = await Question.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email role");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({
      message: "Question updated successfully",
      question,
    });
  } catch (err) {
    next(err);
  }
};


// DELETE a question by ID
export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    next(err);
  }
};