const express = require("express");
const router = express.Router();
const bookcontroller = require("../controllers/bookcontroller");

router.get("/", bookcontroller.book);
router.post("/", bookcontroller.booksubmit);

module.exports = router;
