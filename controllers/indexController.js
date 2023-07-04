const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm_password", "Confirm password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password.");
    }
    return true;
  }),
  asyncHandler(async function (req, res, next) {
    const errors = validationResult(req);

    const { first_name, last_name, email, password } = req.body;

    const user = new UserSchema({
      first_name,
      last_name,
      email,
      hashed_password: password,
      roles: [],
      created_at: new Date(),
    });

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

    res.redirect("/");
  }),
];

exports.user_login_get = function (req, res, next) {
  res.render("login", { title: "Log In", user: null, isUserLoggedIn: false });
};

exports.user_login_post = function (req, res, next) {
  const { email, password } = req.body;

  res.redirect("/");
};
