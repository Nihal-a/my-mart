var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helper');
const { use } = require('./dealer');
/* GET home page. */
router.get('/',(req,res)=>{
  userHelpers.getAllVendors().then((vendor)=>{
    res.render('user/home', {user:true,vendor});
  })
  
})
router.get('/vendors-products',(req,res)=>{
  res.render('user/vendors-products',{user:true})
})
module.exports = router;
