const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.navColor = "is-link";
  next();
});

router.get("/", (req, res, next) => {
  res.render("quotation/list");
});

router.get("/new", (req, res, next) => {
  res.render("quotation/new");
});

router.get("/view", (req, res, next) => {
  res.render("quotation/view");
})

module.exports = router;