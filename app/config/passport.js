
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    // Login
    // Check if email exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: 'No user with this email' });
    }

    bcrypt.compare(password, user.password).then(match => {
      if (match) {
        return done(null, user, { message: 'Logged in successfully' });
      }

      return done(null, false, { message: 'Wrong username or password' });
    }).catch(err => {
      return done(null, false, { message: 'Something went wrong' });
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
//   req.user
}

module.exports = init;
