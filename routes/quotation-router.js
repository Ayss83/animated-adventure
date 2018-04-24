const express = require("express");
const router = express.Router();

const Quotation = require("../models/Quotation");

router.use((req, res, next) => {
  res.locals.navColor = "is-link";
  next();
});

router.get("/", (req, res, next) => {
  if(req.user) {
    // get all quotations from database
    Quotation.find()
    .then(quotationsList => {

      // calculation of total amount for each quotation and setting this value as quotation.amount property
      quotationsList = quotationsList.map(quotation => {
        let amount = 0;
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        quotation.products.forEach(product => {
          amount += product.quantity * product.unitPriceWT * (1 + product.vatRate / 100);
        });
        quotation.amount = amount.toFixed(2) + " €";
        return quotation;
      });
      res.locals.quotationsList = quotationsList;
      res.render("quotation/list");
    })
    .catch(err => {
      next(err);
    });
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/new", (req, res, next) => {
  if(req.user) {
    res.render("quotation/new");
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/view", (req, res, next) => {
  if(req.user) {
    res.render("quotation/view");
  } else {
    res.redirect("/auth/login");
  }
})

module.exports = router;