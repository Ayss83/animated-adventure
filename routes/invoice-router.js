const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer");

router.use((req, res, next) => {
  res.locals.navColor = "is-info";
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

    Invoice.find({invoiceNumber: {$regex: today, $options: "i"}})
    .then(invoices => {
      let currentMax = 0;

      invoices.forEach(invoice => {
        Number(invoice.invoiceNumber.split("-")[1]) > currentMax ? currentMax = Number(invoice.invoiceNumber.split("-")[1]) : null;
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
      res.render("invoice/new");
    })
    .catch(err => {
      next(err);
    })
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/delete/:invoiceId", (req, res, next) => {
  Invoice.findByIdAndRemove(req.params.invoiceId)
  .then(() => {
    res.redirect("/invoices/1");
  })
  .catch(err => {
    next(err);
  })
});

router.get("/paid/:invoiceId", (req, res, next) => {
  if(req.user) {
    Invoice.findByIdAndUpdate(req.params.invoiceId, {paid: true})
    .then(() => {
      res.redirect("/invoices/1");
    })
    .catch(err => {
      next(err);
    })
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/view/:invoiceNumber", (req, res, next) => {
  Invoice.find({invoiceNumber: req.params.invoiceNumber})
  .then(invoice => {
    if(req.user) {
      let amount = 0;
      let total = 0;
      invoice[0].products.forEach(product => {
        amount = product.unitPriceWT * product.quantity * (1 + product.vatRate / 100);
        total += amount;
        product.amount = amount.toFixed(2);
      });
      invoice[0].total = total.toFixed(2);
      res.locals.invoice = invoice[0];
      res.render("invoice/view");
    } else {
      res.redirect("/auth/login");
    }
  })
  .catch(err => {
    next(err);
  })
})

router.get("/:page?", (req, res, next) => {
  if(req.user) {
    let page = req.params.page || 1;

    Invoice.find()
    .then(invoicesList => {
      if(invoicesList.length <= 10) {
        
        invoicesList = invoicesList.map(invoice => {
          let amount = 0;
          invoice.products.forEach(product => {
            amount += product.quantity * product.unitPriceWT * (1 + product.vatRate / 100);
          });
          invoice.amount = amount.toFixed(2) + " €";
          invoice.convertedDate = invoice.date.toLocaleDateString();
          return invoice;
        });
        res.locals.invoicesList = invoicesList;
        res.render("invoice/list");
      } else {
        res.locals.pages = [];

        for(let i = 0; i < Math.ceil(invoicesList.length / 10); i++) {
          res.locals.pages.push(i+1);
        }
        
        invoicesList = invoicesList.slice(page * 10 - 10, page * 10);

        // wet code starting here, factoring required
        invoicesList = invoicesList.map(invoice => {
          let amount = 0;
          invoice.products.forEach(product => {
            amount += product.quantity * product.unitPriceWT * (1 + product.vatRate / 100);
          });
          invoice.amount = amount.toFixed(2) + " €";
          invoice.convertedDate = invoice.date.toLocaleDateString();
          return invoice;
        });
        res.locals.invoicesList = invoicesList;
        res.render("invoice/list");
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
  const invoiceToSave = {
    customer : {},
    products : []
  };

  const inputNames = Object.keys(req.body);
  const invoiceFields = inputNames.slice(0, 2);
  const customerFields = inputNames.slice(2, 10);
  const productFields = inputNames.slice(10);
  const productsNumber = productFields.length / 4;

  invoiceFields.forEach(field => {
    invoiceToSave[field] = req.body[field]
  });

  customerFields.forEach(field => {
    invoiceToSave.customer[field] = req.body[field];
  });

  for(let i = 0; i < productsNumber; i++) {
    const currentProduct = {};
    for(let j = 0; j < 4; j++) {
      const currentProductFields = ["designation", "quantity", "unitPriceWT", "vatRate"]
      const fieldToRetrieve = productFields.shift();
      currentProduct[currentProductFields[j]] = req.body[fieldToRetrieve];
    }
    invoiceToSave.products.push(currentProduct);
  }

  const currentCustomer = invoiceToSave.customer;
  Customer.find({lastName: currentCustomer.lastName, firstName: currentCustomer.firstName})
  .then(customer => {
    if(customer.length === 0) {
      return Customer.create(currentCustomer)
    }
  })
  .then(() => {
    return Invoice.create(invoiceToSave)
  })
  .then(() => {
    res.redirect("/invoices/1");
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;