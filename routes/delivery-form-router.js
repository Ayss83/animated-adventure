const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  res.locals.navColor = "is-success";
  next();
});

router.get("/", (req, res, next) => {
  res.render("delivery/list");
});

router.get("/new", (req, res, next) => {
  res.render("delivery/new");
});

router.get("/view", (req, res, next) => {
  res.render("delivery/view");
})

module.exports = router;