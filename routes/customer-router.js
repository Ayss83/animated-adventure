const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.navColor = "is-warning";
  next();
});

router.get("/", (req, res, next) => {
  res.render("customer/list");
});

router.get("/new", (req, res, next) => {
  res.render("customer/new");
});

router.get("/view", (req, res, next) => {
  res.render("customer/view");
})

module.exports = router;