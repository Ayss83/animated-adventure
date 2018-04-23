const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.navColor = "is-info";
  next();
});

router.get("/", (req, res, next) => {
  res.render("invoice/list");
});

router.get("/new", (req, res, next) => {
  res.render("invoice/new");
});

router.get("/view", (req, res, next) => {
  res.render("invoice/view");
})

module.exports = router;