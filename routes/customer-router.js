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

router.get("/:page?", (req, res, next) => {
  if(req.user) {
    let page = req.params.page || 1;

    Customer.find()
    .then(customersList => {
      if(customersList.length <= 10) {
    
        res.locals.customersList = customersList;
        res.render("customer/list");
      } else {
        res.locals.pages = [];

        for(let i = 0; i < Math.ceil(customersList.length / 10); i++) {
          res.locals.pages.push(i+1);
        }
        customersList = customersList.slice(page * 10 - 10, page * 10);
        res.locals.customersList = customersList;
        res.render("customer/list");
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
  const customerToSave = {
    customer : {}
  };

  const inputNames = Object.keys(req.body);
  const customerFields = inputNames.slice(0, 5);

  customerFields.forEach(field => {
    customerToSave.customer[field] = req.body[field];
  });


  const currentCustomer = customerToSave.customer;
  Customer.find({
    firtName: currentCustomer.firtName, 
    lastName: currentCustomer. lastName, 
    phone: currentCustomer.phone,
    email: currentCustomer.email,
    adresse1: currentCustomer.adresse1,
    adresse2: currentCustomer.adresse2,
    zipCode: currentCustomer.zipCode,
    city: currentCustomer.city, 
    })
  .then(customer => {
    if(customer.length === 0) {
      return Customer.create(currentCustomer)
    }
  })
  .then(() => {
    return Customer.create(customerToSave)
  })
  .then(() => {
    res.redirect("/customers/1");
  })
  .catch(err => {
    next(err);
  });
});

module.exports = router;