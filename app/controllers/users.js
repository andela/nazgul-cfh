/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
  const payload = {
    _id: req.user._id
  };
  const token = jwt.sign({
    payload,
  }, process.env.SECRET);
  const userData = {
    token,
    username: req.user.username
  };
  res.cookie('userData', JSON.stringify(userData));
  res.redirect('/#!/');
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
    res.redirect('/#!');
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

const searchFriend = (req, res) => {
  const isEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([ \.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  };
  const searchByEmail = () =>
    (
      User.findOne({
        email: req.body.search
      }).exec((err, friend) => {
        if (err) {
          return res.status(500).send({ error: 'An error occured' });
        }
        if (!friend) {
          return res.status(200).send({ message: 'No friends found' });
        }
        if (friend._id == req.decoded._id) {
          return res.status(200).send({ message: 'You cannot search for yourself' });
        }
        res.status(200).send({ message: 'success', user: friend });
      })
    );

  const searchByUsername = () =>
    (
      User.findOne({
        username: req.body.search
      }).exec((err, friend) => {
        if (err) {
          return res.status(500).send({ error: 'An error occured' });
        }
        if (!friend) {
          return res.status(200).send({ message: 'No friends found' });
        }
        if (friend._id == req.decoded._id) {
          return res.status(200).send({ message: 'You cannot search for yourself' });
        }
        return res.status(200).send({ message: 'success', user: friend });
      })
    );
  if (isEmail(req.body.search)) {
    return searchByEmail();
  }
  return searchByUsername();
};

const inviteUserByEmail = (req, res) => {
  const mailOptions = {
    from: 'nazgul-cfh',
    to: req.body.emailOfUserToBeInvited,
    subject: 'Invite to nazgul cfh game',
    text: `Hey!!,You have been invited to join this current 
    game \n ${req.body.link}`,
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).send({ error: 'an error occurred' });
    }
    return res.status(200).send({
      message: 'invite successfully sent',
      id: info.messageId
    });
  });
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
    name, email, password, username
  } = req.body;
  if (name && password && email && username) {
    User.findOne({
      $or: [
        { email }, { username }
      ]
    }).exec((err, existingUser) => {
      if (err) {
        return res.status(500).json({
          error: 'Internal Server Error'
        });
      }
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists'
        });
      }
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
          _id: newUser._id
        };
        const token = jwt.sign(
          {
            payload,
          }, process.env.SECRET,
          { expiresIn: '10h' }
        );
        return res.status(201).json({
          token,
          username: newUser.username
        });
      });
    });
  } else {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }
};

/**
 * Login User and send a generated token using user's username and id
 *
 * @param {object} req
 * @param {object} res
 * @returns {object} return jwt token
 */
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  User.findOne({
    email,
  }).exec((err, user) => {
    if (err) {
      return res.json.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      }, process.env.SECRET,
      { expiresIn: '10h' },
    );
    res.status(200).json({
      token,
      username: user.username
    });
  });
};

/**
 * Verify user's token. If verified mount user's details on req and proceed
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} return next()
 */
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).send({ error: 'Oops, An error occured please log in again' });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({ error: 'You have to login First' });
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

exports.searchFriend = searchFriend;
exports.inviteUserByEmail = inviteUserByEmail;
