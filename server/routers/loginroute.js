
const express = require("express");
const router = express.Router();
const logincontroller = require("../controllers/logincontroller");

router.get("/", logincontroller.login);
router.get("/signup", logincontroller.signup);
router.post("/signup", logincontroller.signupentry);
router.post("/", logincontroller.loginsubmit);
router.get("/logout", logincontroller.logout);

module.exports = router;