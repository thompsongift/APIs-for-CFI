const mongoose = require("mongoose");
const candidateSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Name is required."],
    minlength: [2, "Name must be at least 2 characters."],
    maxlength: [50, "Name cannot exceed 50 characters."],
  },
  middle_name: {
    type: String,
    required: false,
    minlength: [2, "Name must be at least 2 characters."],
    maxlength: [50, "Name cannot exceed 50 characters."],
  },
  last_name: {
    type: String,
    required: [true, "Name is required."],
    minlength: [2, "Name must be at least 2 characters."],
    maxlength: [50, "Name cannot exceed 50 characters."],
  },
  phone_number: {
    type: String,
    required: true,
    unique: [true, "Phone number is already being used"],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email is already being used"],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});
const scoreSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "data",
    required: true,
    unique: [true, "ID is already being used"],
  },
  score: {
    type: Number,
    default: 0,
  },
  started: {
    type: Boolean,
    default: false,
  },
  loggedIn: {
    type: Boolean,
    default: false,
  },
  malpractice: {
    type: Boolean,
    default: false,
  },
  submitted: {
    type: Boolean,
    default: false,
  },
  exam_progress: [
    {
      _id: false,
      value: {
        type: String,
      },
      index: {
        type: Number,
      },
      is_mcq: {
        type: Boolean,
      },
      answered: {
        type: Boolean,
      },
    },
  ],
  time_remaining: {
    type: Number,
    default: 60 * 20,
  },
});
const questionSchema = new mongoose.Schema({
  question_text: {
    type: String,
    required: [true, "Question text is required."],
    minlength: [5, "Question text must be at least 5 characters."],
    maxlength: [500, "Question text cannot exceed 500 characters."],
  },
  is_mcq: {
    type: Boolean,
    required: true, // must always specify whether it's MCQ or not
  },
  // For multiple choice
  options: [
    {
      _id: false,
      option_text: {
        type: String,
        minlength: [1, "Option text must be at least 1 character."],
        maxlength: [100, "Option text cannot exceed 100 characters."],
      },
      is_correct: {
        type: Boolean,
      },
    },
    { _id: false },
  ],
  // For QA type
  answer_text: {
    type: String,
    minlength: [1, "Answer must have at least 1 character."],
    maxlength: [500, "Answer cannot exceed 500 characters."],
  },
});

const candidateData = mongoose.model("data", candidateSchema);
const scoreData = mongoose.model("score", scoreSchema);
const candidateQuestion = mongoose.model("questions", questionSchema);
module.exports = { candidateData, scoreData, candidateQuestion };
