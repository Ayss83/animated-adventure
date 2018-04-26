const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");

authRoutes.get("/auth/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error"), navColor: "is-grey-darker"});
});

authRoutes.post("/auth/login", (req, res, next) => {
  const {username, password} = req.body;
  
  User.findOne({username})
  .then(user => {
    if(!user) {
      res.redirect("/auth/login");
      return;
    }

    const {encryptedPassword} = user;

    // if typed password doesn't match the encrypted password in db
    if(!bcrypt.compareSync(password, encryptedPassword)) {
      res.redirect("/auth/login");
      return;
    }
    
    // req.login() : passport's method for logging a user in
    req.login(user, () => {
      res.redirect("/");
    });
  })
  .catch(err => {
    next(err);
  });
});

authRoutes.get("/auth/signup", (req, res, next) => {
  res.render("auth/signup", {navColor: "is-grey-darker"});
});

authRoutes.post("/auth/signup", (req, res, next) => {
  const {name, username, email, password} = req.body;
  const salt = bcrypt.genSaltSync(10);
  encryptedPassword = bcrypt.hashSync(password, salt);

  if(password === "" || username === "") {
    res.redirect("/signup");
    return;
  }

  User.create({name, username, email, encryptedPassword})
  .then(() => {

    res.redirect("/");
  })
  .catch(err => {
    next(err);
  });
});

authRoutes.get("/auth/logout", (req, res, next) => {
  req.logout();
  res.locals.user = null;
  res.render("auth/logout", {navColor: "is-grey-darker"});
});

module.exports = authRoutes;
