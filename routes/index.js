const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  if(req.user) {
    res.render('dashboard', {navColor: "is-primary"});
  } else {
    res.redirect("/auth/login");
  }
});


module.exports = router;
