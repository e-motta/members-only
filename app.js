const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

const logger = require("./logger");
const useDatabase = require("./database");
const mongoSession = require("./mongoSession");
const passport = require("./auth");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");

const app = express();

useDatabase().catch((err) => console.error(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(session(mongoSession.config));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  logger.info(`User ID: ${req.user?._id}`);
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  logger.error(`STATUS ${err.status || 500}: ${err.stack}`);
  res.render("error");
});

module.exports = app;
