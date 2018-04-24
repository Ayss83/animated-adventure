const express = require("express");
const router = express.Router();

const Quotation = require("../models/Quotation");

router.use((req, res, next) => {
  res.locals.navColor = "is-link";
  next();
});


router.get("/new", (req, res, next) => {
  if(req.user) {
    res.render("quotation/new");
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/view/:quotationNumber", (req, res, next) => {
  Quotation.find({quotationNumber: req.params.quotationNumber})
  .then(quotation => {
    if(req.user) {
      let amount = 0;
      let total = 0;
      quotation[0].products.forEach(product => {
        amount = product.unitPriceWT * product.quantity * (1 + product.vatRate / 100);
        total += amount;
        product.amount = amount.toFixed(2);
      });
      quotation[0].total = total.toFixed(2);
      res.locals.quotation = quotation[0];
      res.render("quotation/view");
    } else {
      res.redirect("/auth/login");
    }
  })
  .catch(err => {
    next(err);
  })
});

router.get("/:page?", (req, res, next) => {
  if(req.user) {
    let page = req.params.page || 1;

    Quotation.find()
    .then(quotationsList => {
      if(quotationsList.length <= 10) {
        // calculation of total amount for each quotation and setting this value as quotation.amount property
        // convert Date object to string to display it correctly
        quotationsList = quotationsList.map(quotation => {
          let amount = 0;
          quotation.products.forEach(product => {
            amount += product.quantity * product.unitPriceWT * (1 + product.vatRate / 100);
          });
          quotation.amount = amount.toFixed(2) + " €";
          quotation.convertedDate = quotation.date.toLocaleDateString();
          return quotation;
        });
        res.locals.quotationsList = quotationsList;
        res.render("quotation/list");
      } else {
        res.locals.pages = [];

        for(let i = 0; i < Math.ceil(quotationsList.length / 10); i++) {
          res.locals.pages.push(i+1);
        }
        
        quotationsList = quotationsList.slice(page * 10 - 10, page * 10);

        // wet code starting here, factoring required
        quotationsList = quotationsList.map(quotation => {
          let amount = 0;
          quotation.products.forEach(product => {
            amount += product.quantity * product.unitPriceWT * (1 + product.vatRate / 100);
          });
          quotation.amount = amount.toFixed(2) + " €";
          quotation.convertedDate = quotation.date.toLocaleDateString();
          return quotation;
        });
        res.locals.quotationsList = quotationsList;
        res.render("quotation/list");
      }
    })
    .catch(err => {
      next(err);
    });
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;