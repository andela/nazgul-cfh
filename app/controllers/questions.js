/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Question = mongoose.model('Question');

/**
 * Find question by id
 * @param { object } req
 * @param { object } res
 * @param { function } next
 * @param { integer } id
 * @returns { void }
 */
exports.question = function (req, res, next, id) {
  Question.load(id, (err, question) => {
    if (err) return next(err);
    if (!question) return next(new Error(`Failed to load question ${id}`));
    req.question = question;
    next();
  });
};

/**
 * Show an question
 * @param { object } req
 * @param { object } res
 * @returns { void }
 */
exports.show = function (req, res) {
  res.jsonp(req.question);
};

/**
 * List of Questions
 * @param { object } req
 * @param { object } res
 * @returns { void }
 */
exports.all = function (req, res) {
  Question.find({ official: true, numAnswers: { $lt: 3 } })
    .select('-_id')
    .exec((err, questions) => {
      if (err) {
        res.render('error', {
          status: 500
        });
      } else {
        res.jsonp(questions);
      }
    });
};

/**
 * List of Questions (for Game class)
 * @param { string } region
 * @param { function } cb
 * @returns { void }
 */
exports.allQuestionsForGame = function (region, cb) {
  Question.find({
    region,
    official: true,
    numAnswers: { $lt: 3 }
  })
    .select('-_id')
    .exec((err, questions) => {
      cb(questions);
    });
};
