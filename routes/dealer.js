var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dealer/dealer-dashboard',{dealer:true})
});

module.exports = router;
