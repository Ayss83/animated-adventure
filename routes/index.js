const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('dashboard', {navColor: "is-primary"});
});

router.get('/quotations', (req, res, next) => {
  res.render('quotations');
});

router.get('/invoices', (req, res, next) => {
  res.render('invoices');
});

router.get('/delivreryforms', (req, res, next) => {
  res.render('delivreryforms');
});

router.get('/customers', (req, res, next) => {
  res.render('customers');
});

router.get('/products', (req, res, next) => {
  res.render('products');
});

router.get('/customers', (req, res, next) => {
  res.render('customers');
});


module.exports = router;
