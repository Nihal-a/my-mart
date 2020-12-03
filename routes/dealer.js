var express = require('express');
var router = express.Router();
const dealerHelpers=require('../helpers/dealer-helper')

/* GET home page. */
router.get('/', function(req, res, next) {
  let dealer=req.session.dealer
  if(dealer){
    res.render('dealer/dealer-dashboard',{dealer})
  }else{
    res.redirect('/dealer/login')
  }
});
router.get('/login',(req,res)=>{
  if(req.session.dealer){
    res.redirect('/dealer')
  }else{
    res.render('dealer/login', { loginErr: req.session.loginErr })
    req.session.loginErr = false
  }
})
router.post('/login',(req,res)=>{
    dealerHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        req.session.logedIn=true
        req.session.dealer=response.dealer
        res.redirect('/dealer')
      }else{
        req.session.loginErr = "Invalid Email or Password"
        res.redirect('/dealer/login')
      }
    })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/dealer')
})
module.exports = router;
