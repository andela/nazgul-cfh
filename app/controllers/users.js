/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const avatars = require('./avatars').all();
require('dotenv').config();


/**
 * Auth callback
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.authCallback = (req, res) => {
  res.redirect('/chooseavatars');
};

/**
 * Show login form
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.signin = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Show sign up form
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.signup = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Logout
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.checkAvatar = (req, res) => {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

/**
 * Create user
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {any} token and redirect to homepage
 */
exports.create = (req, res, next) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);

        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save((err) => {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user,
            });
          }
          req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/#!/');
          });
        });
      } else {
        return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};

/**
 * Create User
 *
 * @param {object} req
 * @param {object} res
 * @returns {object} return jwt token
 */
exports.signUp = (req, res) => {
  const {
    name, email, password
  } = req.body;
  if (name && password && email) {
    User.findOne({
      email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save((err, newUser) => {
          if (err) {
            return res.status(500).json({
              error: 'Internal Server Error'
            });
          }
          const payload = {
            _id: newUser._id,
            email: newUser.email
          };
          const token = jwt.sign({
            payload,
          }, process.env.SECRET);
          return res.status(201).json({
            message: 'User Created Successfully',
            token
          });
        });
      } else {
        return res.status(409).json({
          error: 'User already exists'
        });
      }
    });
  } else {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }
};


/**
 * Assign avatar to user
 *
 * @param {object} req
 * @param {object} res
 * @returns {object} return jwt token
 */
exports.avatars = (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};
/**
 * Adds donation
 *
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount &&
      req.body.crowdrise_donation_id &&
      req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i += 1) {
            if (user.donations[i].crowdrise_donation_id ===
              req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            console.log('Validated donation');
            user.donations.push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

/**
 *  Show profile
 *
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.show = (req, res) => {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 *
 * @param {object} req
 * @param {object} res
 * @returns {void}
 */
exports.me = (req, res) => {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 * @param {obj} req
 * @param {obj} res
 * @param {obj} next
 * @param {number} id
 * @returns {void}
 */
exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};
