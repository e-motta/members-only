const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "Register" });
});

module.exports = router;
