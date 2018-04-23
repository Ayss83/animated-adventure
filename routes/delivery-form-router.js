const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.navColor = "is-success";
  next();
});

router.get("/", (req, res, next) => {
  res.render("delivery-form/list");
});

router.get("/new", (req, res, next) => {
  res.render("delivery-form/new");
});

router.get("/view", (req, res, next) => {
  res.render("delivery-form/view");
})

module.exports = router;