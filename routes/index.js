const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", indexController.index_get);

router.get("/signup", indexController.user_create_get);

router.post("/signup", indexController.user_create_post);

router.get("/login", indexController.user_login_get);

router.post("/login", indexController.user_login_post);

router.get("/logout", indexController.user_logout_get);

router.get("/new_message", indexController.new_message_get);

router.post("/new_message", indexController.new_message_post);

router.get("/members", indexController.members_get);

router.post("/members", indexController.members_post);

module.exports = router;
