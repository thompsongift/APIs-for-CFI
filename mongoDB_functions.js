const {
  candidateData,
  scoreData,
  candidateQuestion,
} = require("./mongooseSchema");
const { shuffleArray } = require("./important_functions");

const saveNewUser = async (newAccount) => {
  try {
    const savedUser = await candidateData.insertMany(newAccount, {
      ordered: false,
    });
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

// finds a user from the data base
const findUser = async (Parameter) => {
  try {
    const account = await candidateData.findOne(Parameter).exec();
    if (account) {
      return account;
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    console.error("Error finding user:", err.message);
  }
};

const testUser = async () => {
  try {
    const account = await scoreData
      .findOne({ student_id: "68a3eb6e725b23e727e2b7b4" })
      .exec();
    if (account) {
      return account.exam_progress;
    } else {
      throw new Error("User not found");
    }
  } catch (err) {
    console.error("Error finding user:", err.message);
  }
};

// get questons from the database

const getLogInStatus = async ({ _id }) => {
  try {
    const value = await scoreData.findOne({ student_id: _id }).exec();
    if (!value) {
      return [];
    }
    const { started, submitted, exam_progress, time_remaining } = value;

    if (started && !submitted) {
      return exam_progress;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error getting user:", err.message);
    throw err;
  }
};

const getStatus = async ({ _id }) => {
  try {
    const value = await scoreData.findOne({ student_id: _id }).exec();
    if (!value) {
      return { started: false, time_remaining: 300, malpractice: false };
    }
    const { started, time_remaining, malpractice } = value;

    return { started, time_remaining, malpractice };
  } catch (err) {
    console.error("Error getting user:", err.message);
    throw err;
  }
};

const setStatus = async ({ _id }) => {
  try {
    await scoreData.updateOne({ student_id: _id }, { $set: { started: true } });
  } catch (err) {
    console.error("Error setting user:", err.message);
    throw err;
  }
};

const setStatusAdmin = async ({ _id }) => {
  try {
    await scoreData.updateOne(
      { student_id: _id },
      { $set: { malpractice: false, loggedIn: false } }
    );
  } catch (err) {
    console.error("Error setting user:", err.message);
    throw err;
  }
};

const setMalpractice = async ({ _id }) => {
  try {
    await scoreData.updateOne(
      { student_id: _id },
      { $set: { malpractice: true, loggedIn: false } }
    );
  } catch (err) {
    console.error("Error setting user:", err.message);
    throw err;
  }
};

const getAllStudentInfo = async () => {
  try {
    let allUsers = await candidateData.find({}).exec();
    let allUserData = await scoreData.find({}).exec();

    if (!allUsers) {
      throw new Error("No users found");
    }

    allUsers = allUsers.map(({ _doc }) => {
      return _doc;
    });
    allUserData = allUserData.map(({ _doc }) => {
      return _doc;
    });

    let data = allUsers.map(
      ({ _id, first_name, middle_name, last_name, phone_number }) => {
        const scoreData = allUserData.find(({ student_id }) => {
          return student_id.toString() === _id.toString();
        });
        if (!scoreData) {
          return {
            _id,
            name: `${last_name} ${first_name} ${middle_name}`,
            phone_number,
            submitted: false,
            score: 0,
            loggedIn: false,
            malpractice: false,
            started: false,
          };
        }
        const { submitted, score, loggedIn, malpractice, started } = scoreData;
        return {
          _id,
          name: `${last_name} ${first_name} ${middle_name}`,
          phone_number,
          submitted,
          score,
          loggedIn,
          malpractice,
          started,
        };
      }
    );
    return data;
  } catch (err) {
    console.error("Error getting user:", err.message);
    throw err;
  }
};

const getTotalScoreQuestion = async () => {
  try {
    let questions = await candidateQuestion.find({}).exec();
    if (!questions) {
      throw new Error("Questions not found");
    }
    let data = questions
      .map(({ is_mcq }) => {
        if (is_mcq) {
          return 1.5;
        } else {
          return 9;
        }
      })
      .reduce((a, b) => a + b, 0);
    return data;
  } catch (err) {
    console.error("Error gettiing questions:", err.message);
    throw err;
  }
};

const getAllQuestion = async ({ _id }) => {
  try {
    let logIn = await getLogInStatus({ _id });

    let questions = await candidateQuestion.find({}).exec();
    if (!questions) {
      throw new Error("Questions not found");
    }

    if (logIn.length > 0) {
      logIn = logIn.map(({ index, value, answered }) => {
        const { _doc } = questions[index];
        const { is_mcq, question_text, options, answer_text } = _doc;
        return {
          is_mcq,
          question_text,
          options,
          answer_text,
          value: value,
          answered: answered,
          index: index,
        };
      });
      return logIn;
    } else {
      questions = shuffleArray(
        questions.map(
          ({ is_mcq, question_text, options, answer_text }, index) => {
            return {
              is_mcq,
              question_text,
              options,
              answer_text,
              answered: false,
              value: "",
              index: index,
            };
          }
        )
      );

      return questions;
    }
  } catch (err) {
    console.error("Error gettiing questions:", err.message);
    throw err;
  }
};

// Check and update users online status via ID
const logInStatusHandler = async ({ _id }) => {
  try {
    const value = await scoreData.findOne({ student_id: _id }).exec();
    if (!value) {
      await scoreData.create({ student_id: _id, loggedIn: true });
      return true;
    } else if (value.loggedIn) {
      throw new Error("User already logged into the exam");
    } else if (value.submitted) {
      throw new Error("User already completed the exam");
    } else if (value.malpractice) {
      throw new Error(
        "You have been suspended from the exam ask admin for help"
      );
    } else if (!value.loggedIn) {
      await scoreData.updateOne(
        { student_id: _id },
        { $set: { loggedIn: true } }
      );
      return true;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

const submitHandler = async ({ _id, score, submitted, started, loggedIn }) => {
  try {
    await scoreData.updateOne(
      { student_id: _id },
      {
        $set: {
          started: true,
          score: score,
          submitted: submitted,
          started: started,
          loggedIn: loggedIn,
        },
      }
    );
  } catch (error) {
    console.error("Error submitting score:", error);
    throw error;
  }
};

const UpdateUserHandler = async ({ _id, updated_data, time_remaining }) => {
  try {
    await scoreData.updateOne(
      { student_id: _id },
      {
        $set: {
          exam_progress: updated_data,
          time_remaining: time_remaining,
        },
      }
    );
  } catch (error) {
    console.error("Error submitting score:", error);
    throw error;
  }
};

//update user information
const updateUser = async (Parameter, num) => {
  try {
    await candidateData.updateOne(Parameter, { $set: { name: num } }).exec();
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

//delete user information
const deleteUser = async (Parameter) => {
  try {
    await candidateData.deleteOne(Parameter).exec();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

module.exports = {
  saveNewUser,
  findUser,
  updateUser,
  deleteUser,
  getAllQuestion,
  logInStatusHandler,
  submitHandler,
  UpdateUserHandler,
  testUser,
  getStatus,
  setStatus,
  setMalpractice,
  getAllStudentInfo,
  getTotalScoreQuestion,
  setStatusAdmin,
};

//68a3eb6e725b23e727e2b7b4
