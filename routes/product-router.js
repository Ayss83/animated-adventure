const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.navColor = "is-danger";
  next();
});

router.get("/", (req, res, next) => {
  res.render("product/list");
});

router.get("/new", (req, res, next) => {
  res.render("product/new");
});

router.get("/view", (req, res, next) => {
  res.render("product/view");
})

module.exports = router;