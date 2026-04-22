const natural = require("natural");

// const checkShortAnswer = (userAnswer, correctAnswer) => {
//   const cleanUser = userAnswer.trim().toLowerCase();
//   const cleanCorrect = correctAnswer.trim().toLowerCase();

//   //Jaro-Winkler is good for names/words
//   const score = natural.JaroWinklerDistance(cleanUser, cleanCorrect);
//   return score > 0.86; //tweak threshold
// };

const tokenizer = new natural.WordTokenizer();
const checkLongAnswer = (userAnswer, correctAnswer) => {
  if (correctAnswer.length <= 0) {
    return 0.96;
  }
  const cleanUser = userAnswer.trim().toLowerCase();
  const cleanCorrect = correctAnswer.trim().toLowerCase();
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(tokenizer.tokenize(cleanCorrect));
  tfidf.addDocument(tokenizer.tokenize(cleanUser));

  const vec1 = [],
    vec2 = [];
  tfidf.listTerms(0).forEach((term) => {
    vec1.push(term.tfidf);
    const match = tfidf.listTerms(1).find((t) => t.term === term.term);
    vec2.push(match ? match.tfidf : 0);
  });

  const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);

  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  const value = dot / (mag1 * mag2);
  if (!value) {
    return 0;
  }
  return value;
};

const examScorer = (obj) => {
  let data = obj
    .map(({ value, is_mcq, correct_answer }) => {
      if (is_mcq) {
        return value == correct_answer ? 1.5 : 0;
      } else {
        return checkLongAnswer(value, correct_answer) >= 0.9 ? 9 : 0;
      }
    })
    .reduce((a, b) => a + b, 0);
  return data;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// console.log(
//   checkLongAnswer(
//     "To make efficient and effective christain leaders, who are sound in spirit, soul and body excelling in their choosen field be delibrately",
//     "To raise efficient and effective christain leaders and disciples of God, who are sound in spirit, soul and body excelling in their choosen field be delibrate training"
//   )
// );

module.exports = { examScorer, shuffleArray };
