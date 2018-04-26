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

router.get("/:page?", (req, res, next) => {
  if(req.user) {
    let page = req.params.page || 1;

    Product.find()
    .then(productsList => {
      if(productsList.length <= 10) {
    
        res.locals.productsList = productsList;
        res.render("product/list");
      } else {
        res.locals.pages = [];

        for(let i = 0; i < Math.ceil(productsList.length / 10); i++) {
          res.locals.pages.push(i+1);
        }
        productsList = productsList.slice(page * 10 - 10, page * 10);
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
  const productToSave = {
    product : {}
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