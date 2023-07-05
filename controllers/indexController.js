const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

const UserSchema = require("../models/users");

exports.index_get = function (req, res, next) {
  const placeholderMessages = [
    {
      content: {
        title: "Hello World!",
        body: "This is a message from the server.",
      },
      user: {
        full_name: "John Doe",
      },
      created_at_formatted: "Monday, January 1, 1970",
    },
    {
      content: {
        title: "Hello World!",
        body: "This is a message from the server.",
      },
      user: {
        full_name: "John Doe",
      },
      created_at_formatted: "Monday, January 1, 1970",
    },
    {
      content: {
        title: "Hello World!",
        body: "This is a message from the server.",
      },
      user: {
        full_name: "John Doe",
      },
      created_at_formatted: "Monday, January 1, 1970",
    },
    {
      content: {
        title: "Hello World!",
        body: "This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. This is a message from the server. ",
      },
      user: {
        full_name: "John Doe",
      },
      created_at_formatted: "Monday, January 1, 1970",
    },
    {
      content: {
        title: "Hello World!",
        body: "This is a message from the server.",
      },
      user: {
        full_name: "John Doe",
      },
      created_at_formatted: "Monday, January 1, 1970",
    },
    {
      content: {
        title: "Hello World!",
        body: "This is a message from the server.",
      },
      user: {
        full_name: "John Doe",
      },
      created_at_formatted: "Monday, January 1, 1970",
    },
  ];
  const placeHolderUser = null; // { roles: ["member"] }

  res.render("index", {
    title: "Members Only",
    user: placeHolderUser,
    isUserLoggedIn: !!placeHolderUser,
    messages: placeholderMessages,
  });
};

exports.user_create_get = function (req, res, next) {
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
};

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

exports.user_login_post = [
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  function (req, res, next) {
    req.body.username = req.body.email;

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      console.log({ err, user, info });
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
  },
];
