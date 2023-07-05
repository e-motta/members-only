const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const UserSchema = require("./models/users");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserSchema.findOne({ email: username });
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      bcrypt.compare(password, user.hashed_password, (err, res) => {
        if (err) {
          return done(err);
        }
        if (!res) {
          return done(null, false, { message: "Incorrect password." });
        }
      });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserSchema.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
