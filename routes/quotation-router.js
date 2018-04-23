const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("quotation/list", {navColor : "is-info"});
});

router.get("/new", (req, res, next) => {
  res.render("quotation/new", {navColor: "is-info"});
});

module.exports = router;