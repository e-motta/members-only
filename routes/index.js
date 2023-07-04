const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

router.get("/", indexController.index_get);

router.get("/signup", indexController.user_create_get);

router.post("/signup", indexController.user_create_post);

router.get("/login", indexController.user_login_get);

router.post("/login", indexController.user_login_post);

module.exports = router;
