var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helper');
const { use } = require('./dealer');
/* GET home page. */
router.get('/',async(req,res)=>{
  let vendor = await userHelpers.getAllVendors()
  console.log(">>>>>>>>>>>",vendor);
  res.render('user/home', {user:true,vendor});
})

// router.get('/', function (req, res, next) {
//   let vendor =await userHelpers.getAllVendors()
//   res.render('user/home', { user:true });
// });

module.exports = router;
