const User = require("../models/user");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

passport.use(
  new LocalStrategy(async (userName, password, done) => {
    try {
      const user = await User.find({ user_name: userName });

      if (!user) {
        return done(null, false, { message: "Incorrect user name" });
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password);

      if (!doesPasswordMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
