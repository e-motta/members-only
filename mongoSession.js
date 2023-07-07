const MongoStore = require("connect-mongo");

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_DB,
  collectionName: "member-only-sessions",
  autoRemove: "interval",
  autoRemoveInterval: 60, // In minutes
});

exports.config = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
};
