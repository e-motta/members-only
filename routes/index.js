const express = require("express");
const router = express.Router();

const controller = require("../controller");

router.get("/", controller.index_get);

router.get("/signup", controller.user_create_get);

router.post("/signup", controller.user_create_post);

router.get("/login", controller.user_login_get);

router.post("/login", controller.user_login_post);

router.get("/logout", controller.user_logout_get);

router.get("/new_message", controller.new_message_get);

router.post("/new_message", controller.new_message_post);

router.get("/members", controller.members_get);

router.post("/members", controller.members_post);

module.exports = router;
