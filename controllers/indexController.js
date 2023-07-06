const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("../auth");

const UserSchema = require("../models/users");
const MessageSchema = require("../models/messages");

exports.index_get = asyncHandler(async function (req, res, next) {
  const messages = await MessageSchema.find({})
    .sort({ created_at: -1 })
    .populate("user")
    .exec();

  res.render("index", {
    title: "Members Only",
    user: res.locals.currentUser,
    isUserLoggedIn: !!res.locals.currentUser,
    messages,
  });
});

exports.user_create_get = asyncHandler(function (req, res, next) {
  if (res.locals.currentUser) {
    res.redirect("/");
    return;
  }

  res.render("signup", {
    title: "Sign Up",
    user: null,
    isUserLoggedIn: false,
    newUser: {
      first_name: "",
      last_name: "",
      email: "",
    },
    errors: [],
  });
});

exports.user_create_post = [
  body("first_name", "First name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email").custom(async (value) => {
    value = value.toLowerCase();
    const emailExists = await UserSchema.exists({ email: value });
    if (emailExists) {
      throw new Error("Email already in use.");
    }
  }),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmPassword", "Confirm password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password.");
    }
    return true;
  }),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const { first_name, last_name, email, password } = req.body;

    if (!errors.isEmpty()) {
      res.render("signup", {
        title: "Sign Up",
        user: null,
        isUserLoggedIn: false,
        newUser: {
          first_name,
          last_name,
          email,
        },
        errors: errors.array(),
      });
      return;
    }

    try {
      bcrypt.hash(password, 10, async (err, hashed_password) => {
        if (err) {
          return next(err);
        }

        const user = new UserSchema({
          first_name,
          last_name,
          email,
          hashed_password,
          roles: [],
          created_at: new Date(),
        });

        await user.save();
        res.redirect("/login?signup=success");
      });
    } catch (err) {
      next(err);
    }
  }),
];

exports.user_login_get = function (req, res, next) {
  if (res.locals.currentUser) {
    res.redirect("/");
    return;
  }

  res.render("login", {
    title: "Log In",
    user: { email: "" },
    isUserLoggedIn: false,
    message: req.query.signup
      ? "Sign up successful! Please log in to continue"
      : null,
    errors: [],
  });
};

exports.user_login_post = asyncHandler(function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("login", {
        title: "Log In",
        user: { email: req.body.email },
        isUserLoggedIn: false,
        message: null,
        errors: [info.message],
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/");
    });
  })(req, res, next);
});

exports.user_logout_get = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.new_message_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    res.redirect("/login");
    return;
  }

  res.render("new_message", {
    title: "New Message",
    user: res.locals.currentUser,
    isUserLoggedIn: !!res.locals.currentUser,
    message: {
      title: "",
      body: "",
    },
    errors: [],
  });
};

exports.new_message_post = [
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("body", "Body must not be empty.").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const { title, body } = req.body;

    if (!errors.isEmpty()) {
      res.render("new_message", {
        title: "New Message",
        user: res.locals.currentUser,
        isUserLoggedIn: !!res.locals.currentUser,
        message: {
          title,
          body,
        },
        errors: errors.array(),
      });
      return;
    }

    try {
      const message = new MessageSchema({
        content: {
          title,
          body,
        },
        user: res.locals.currentUser._id,
        created_at: new Date(),
      });

      await message.save();
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }),
];

exports.members_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    res.redirect("/login");
    return;
  }

  res.render("members", {
    title: "Membership",
    user: res.locals.currentUser,
    isUserLoggedIn: !!res.locals.currentUser,
    errors: [],
  });
};

exports.members_post = [
  body("membership", "Membership must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("membership").custom(async (value) => {
    if (value !== process.env.MEMBERSHIP_CODE && value !== "cancel-486b129") {
      throw new Error("Invalid membership code.");
    }
    return true;
  }),

  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const { membership } = req.body;

    if (membership === "cancel-486b129") {
      try {
        const user = await UserSchema.findById(res.locals.currentUser._id);
        user.roles = user.roles.filter((role) => role !== "member");
        await user.save();

        res.redirect("/");
        return;
      } catch (err) {
        next(err);
      }
    }

    if (!errors.isEmpty()) {
      res.render("members", {
        title: "Membership",
        user: res.locals.currentUser,
        isUserLoggedIn: !!res.locals.currentUser,
        errors: errors.array(),
      });
      return;
    }

    try {
      if (membership === process.env.MEMBERSHIP_CODE) {
        const user = await UserSchema.findById(res.locals.currentUser._id);
        user.roles = [...user.roles, "member"];
        await user.save();

        res.redirect("/");
      }
    } catch (err) {
      next(err);
    }
  }),
];
