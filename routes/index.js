const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
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
  const placeHolderUser = { roles: ["member"] };

  res.render("index", {
    user: placeHolderUser,
    isUserLoggedIn: !!placeHolderUser,
    messages: placeholderMessages,
  });
});

module.exports = router;
