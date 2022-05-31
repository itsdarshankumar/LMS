const express = require("express");
const router = express.Router();
const bookcontroller = require("../controllers/bookcontroller");

router.get("/", bookcontroller.book);
router.post("/", bookcontroller.booksubmit);
router.get("/admin", bookcontroller.bookapprovalrender);
router.post("/admin", bookcontroller.bookresolve);
router.get("/admin/history", bookcontroller.pastresolve);
router.get("/history", bookcontroller.userresolved);
router.post("/admin/add", bookcontroller.addbook);
router.post("/admin/update", bookcontroller.updatebooks);
router.post("/admin/return", bookcontroller.returnbooks);
module.exports = router;
