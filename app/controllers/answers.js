/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const Answer = mongoose.model('Answer');

/**
 * Find answer by id
 * @param {object} req
 * @param {object} res
 * @param {functio} next
 * @param {integer} id
 * @returns { void }
 */
exports.answer = function (req, res, next, id) {
  Answer.load(id, (err, answer) => {
    if (err) return next(err);
    if (!answer) return next(new Error(`Failed to load answer ${id}`));
    req.answer = answer;
    next();
  });
};

/**
 * Show an answer
 * @param {object} req
 * @param {object} res
 * @returns { void }
 */
exports.show = function (req, res) {
  res.jsonp(req.answer);
};

/**
 * List of Answers
 * @param {object} req
 * @param {object} res
 * @returns { void }
 */
exports.all = function (req, res) {
  Answer.find({ official: true })
    .select('-_id')
    .exec((err, answers) => {
      if (err) {
        res.render('error', {
          status: 500
        });
      } else {
        res.jsonp(answers);
      }
    });
};

/**
 * fetches all answers
 * @param { string } region
 * @param { function } cb
 * @returns { void }
 */
exports.allAnswersForGame = function (region, cb) {
  Answer.find({
    region,
    official: true
  })
    .select('-_id')
    .exec((err, answers) => {
      cb(answers);
    });
};
