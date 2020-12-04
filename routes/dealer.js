var express = require('express');
var router = express.Router();
const dealerHelpers=require('../helpers/dealer-helper')
const verifyLogin = (req, res, next) => {
  if (req.session.logedIn) {
    next()
  } else {
    res.redirect('/dealer/login')
  }
}

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
  dealerHelpers.findBannedDealers(req.body).then((status)=>{
    if(status){
      res.render('dealer/banned-vendor')
    }else{
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
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/dealer')
})
router.get('/order-history',verifyLogin,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/order-history',{dealer})
})

module.exports = router;
