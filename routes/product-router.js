const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

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

router.get("/delete/:productId", (req, res, next) => {
  Product.findByIdAndRemove(req.params.productId)
  .then(() => {
    res.redirect("/products/1");
  })
  .catch(err => {
    next(err);
  })
});

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
  const productFields = inputNames.slice(0, 5);

  productFields.forEach(field => {
    productToSave.product[field] = req.body[field];
  });


  const currentProduct = productToSave.product;
  Product.find({
    productName: currentProduct.productName, 
    date: currentProduct.date,
    designation: currentProduct.designation,
    unitPriceWT: currentProduct.unitPriceWT,
    vatRate: currentProduct.vatRate
    })
  .then(product => {
    if(product.length === 0) {
      return Product.create(currentProduct)
    }
  })
  .then(() => {
    return Product.create(productToSave)
  })
  .then(() => {
    res.redirect("/products/1");
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;