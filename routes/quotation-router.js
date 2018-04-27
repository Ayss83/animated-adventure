const express = require("express");
const router = express.Router();
const pdf = require("pdfjs");
const fs = require("fs");

const Quotation = require("../models/Quotation");
const Customer = require("../models/Customer");

router.use((req, res, next) => {
  res.locals.navColor = "is-link";
  next();
});

router.get("/new", (req, res, next) => {
  if(req.user) {
    const currentDate = new Date();
    let currentMonth;

    if(currentDate.getMonth() + 1 < 10) {
      currentMonth = "0" + (currentDate.getMonth() + 1);
    } else {
      currentMonth = currentDate.getMonth() + 1;
    }
    const today = currentDate.getFullYear() + currentMonth + currentDate.getDate();

    Quotation.find({quotationNumber: {$regex: today, $options: "i"}})
    .then(quotations => {
      let currentMax = 0;

      quotations.forEach(quotation => {
        Number(quotation.quotationNumber.split("-")[1]) > currentMax ? currentMax = Number(quotation.quotationNumber.split("-")[1]) : null;
      });
      
      let newNumber;

      if(currentMax + 1 >= 10) {
        newNumber = "0" + (currentMax + 1);
      } else if(currentMax + 1 >= 100) {
        newNumber = (currentMax + 1).toString();
      } else {
        newNumber = "00" + (currentMax + 1);
      }

      res.locals.number = today + "-" + newNumber;
      res.render("quotation/new");
    })
    .catch(err => {
      next(err);
    })
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/pdf", (req, res, next) => {
  const doc = new pdf.Document({ font: new pdf.Font(require('pdfjs/font/Helvetica.json')), fontSize: 35 });

  doc.cell().text().add("Document will be generated here");
  doc.pipe(fs.createWriteStream('output.pdf'))
  res.locals.doc = doc;
  res.render("quotation/pdf");
  doc.end()
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
  });
});

router.get("/delete/:quotationId", (req, res, next) => {
  Quotation.findByIdAndRemove(req.params.quotationId)
  .then(() => {
    res.redirect("/quotations/1");
  })
  .catch(err => {
    next(err);
  })
});

router.get("/accepted/:quotationId", (req, res, next) => {
  if(req.user) {
    Quotation.findByIdAndUpdate(req.params.quotationId, {accepted: true})
    .then(() => {
      res.redirect("/quotations/1");
    })
    .catch(err => {
      next(err);
    })
  } else {
    res.redirect("/auth/login");
  }
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

router.post("/new", (req, res, next) => {
  const quotationToSave = {
    customer : {},
    products : []
  };

  const inputNames = Object.keys(req.body);
  const quotationFields = inputNames.slice(0, 2);
  const customerFields = inputNames.slice(2, 10);
  const productFields = inputNames.slice(10);
  const productsNumber = productFields.length / 4;

  quotationFields.forEach(field => {
    quotationToSave[field] = req.body[field]
  });

  customerFields.forEach(field => {
    quotationToSave.customer[field] = req.body[field];
  });

  for(let i = 0; i < productsNumber; i++) {
    const currentProduct = {};
    for(let j = 0; j < 4; j++) {
      const currentProductFields = ["designation", "quantity", "unitPriceWT", "vatRate"]
      const fieldToRetrieve = productFields.shift();
      currentProduct[currentProductFields[j]] = req.body[fieldToRetrieve];
    }
    quotationToSave.products.push(currentProduct);
  }

  const currentCustomer = quotationToSave.customer;
  Customer.find({lastName: currentCustomer.lastName, firstName: currentCustomer.firstName})
  .then(customer => {
    if(customer.length === 0) {
      return Customer.create(currentCustomer)
    }
  })
  .then(() => {
    return Quotation.create(quotationToSave)
  })
  .then(() => {
    res.redirect("/quotations/1");
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;