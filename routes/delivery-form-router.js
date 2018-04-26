const express = require("express");
const router = express.Router();

const DeliveryForm = require("../models/DeliveryForm");
const Customer = require("../models/Customer");

router.use((req, res, next) => {
  res.locals.navColor = "is-success";
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

    DeliveryForm.find({deliveryNumber: {$regex: today, $options: "i"}})
    .then(deliveries => {
      let currentMax = 0;

      deliveries.forEach(delivery => {
        Number(delivery.deliveryNumber.split("-")[1]) > currentMax ? currentMax = Number(delivery.deliveryNumber.split("-")[1]) : null;
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
      res.render("delivery/new");
    })
    .catch(err => {
      next(err);
    })
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/view/:deliveryNumber", (req, res, next) => {
  DeliveryForm.find({deliveryNumber: req.params.deliveryNumber})
  .then(delivery => {
    if(req.user) {
      let amount = 0;
      let total = 0;
      
      res.locals.delivery = delivery[0];
      res.render("delivery/view");
    } else {
      res.redirect("/auth/login");
    }
  })
  .catch(err => {
    next(err);
  });
})

router.get("/:page?", (req, res, next) => {
  if(req.user) {
    let page = req.params.page || 1;

    DeliveryForm.find()
    .then(deliverysList => {
      if(deliverysList.length <= 10) {

        deliverysList = deliverysList.map(delivery => {
          let amount = 0;
          delivery.products.forEach(product => {
            amount += product.quantity * product.unitPriceWT * (1 + product.vatRate / 100);
          });
          delivery.amount = amount.toFixed(2) + " €";
          delivery.convertedDate = delivery.date.toLocaleDateString();
          return delivery;
        });
        res.locals.deliverysList = deliverysList;
        res.render("delivery/list");
      } else {
        res.locals.pages = [];

        for(let i = 0; i < Math.ceil(deliverysList.length / 10); i++) {
          res.locals.pages.push(i+1);
        }
        
        deliverysList = deliverysList.slice(page * 10 - 10, page * 10);

        // wet code starting here, factoring required
        deliverysList = deliverysList.map(delivery => {
          let amount = 0;
          delivery.products.forEach(product => {
            amount += product.quantity * product.unitPriceWT * (1 + product.vatRate / 100);
          });
          delivery.amount = amount.toFixed(2) + " €";
          delivery.convertedDate = delivery.date.toLocaleDateString();
          return delivery;
        });
        res.locals.deliverysList = deliverysList;
        res.render("delivery/list");
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