var express = require('express');
const dealerHelper = require('../helpers/dealer-helper');
var router = express.Router();
const dealerHelpers=require('../helpers/dealer-helper')
// const verifyLogin = (req, res, next) => {
//   if (req.session.logedIn) {
//     next()
//   } else {
//     res.redirect('/dealer/login')
//   }
// }
const verifyLogIn=((req,res,next)=>{
  if(req.session.logedIn){
    next()
  }else{
    res.render('dealer/login')
  }
})

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
  req.session.logedIn=false
  req.session.destroy()
  res.redirect('/dealer')
})
router.get('/order-history',verifyLogIn,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/order-history',{dealer,view:true})
})
router.get('/feedback',verifyLogIn,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/feedback',{dealer})
})
router.get('/users',verifyLogIn,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/users',{dealer})
})
router.get('/settings',verifyLogIn,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/settings',{dealer})
})
router.get('/dealer/add-user',verifyLogIn,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/add-user',{dealer})
})
router.get('/dealer/edit-user',verifyLogIn,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/edit-user',{dealer})
})
router.get('/products',verifyLogIn,(req,res)=>{
  let dealer=req.session.dealer
  res.render('dealer/products',{dealer})
})
router.get('/add-products',verifyLogIn,(req,res)=>{
  res.render('dealer/add-products')
})
router.post('/add-product',verifyLogIn,(req,res)=>{
  let dealerId=req.session.dealer._id
  console.log(req.files.Image);
  dealerHelper.addProduct(dealerId,req.body).then((id)=>{
    let image = req.files.Image
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/dealer')
      } else {
        console.log(err);
      }
    })
  })
})
module.exports = router;
