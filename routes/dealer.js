var express = require('express');
const dealerHelper = require('../helpers/dealer-helper');
var router = express.Router();
const dealerHelpers = require('../helpers/dealer-helper')
// const verifyLogin = (req, res, next) => {
//   if (req.session.logedIn) {
//     next()
//   } else {
//     res.redirect('/dealer/login')
//   }
// }
const verifyLogIn = ((req, res, next) => {
  if (req.session.logedIn) {
    next()
  } else {
    res.render('dealer/login')
  }
})

/* GET home page. */
router.get('/', function (req, res, next) {
  let dealer = req.session.dealer
  if (dealer) {
    res.render('dealer/dealer-dashboard', { dealer })
  } else {
    res.redirect('/dealer/login')
  }
});
router.get('/login', (req, res) => {
  if (req.session.dealer) {
    res.redirect('/dealer')
  } else {
    res.render('dealer/login', { loginErr: req.session.loginErr })
    req.session.loginErr = false
  }
})
router.post('/login', (req, res) => {
  dealerHelpers.findBannedDealers(req.body).then((status) => {
    if (status) {
      res.render('dealer/banned-vendor')
    } else {
      dealerHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
          req.session.logedIn = true
          req.session.dealer = response.dealer
          res.redirect('/dealer')
        } else {
          req.session.loginErr = "Invalid Email or Password"
          res.redirect('/dealer/login')
        }
      })
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.logedIn = false
  req.session.destroy()
  res.redirect('/dealer')
})
router.get('/order-history', verifyLogIn, (req, res) => {
  let dealer = req.session.dealer
  res.render('dealer/order-history', { dealer, view: true })
})
router.get('/feedback', verifyLogIn, (req, res) => {
  let dealer = req.session.dealer
  res.render('dealer/feedback', { dealer })
})
router.get('/users', verifyLogIn, (req, res) => {
  let dealer = req.session.dealer
  res.render('dealer/users', { dealer })
})
router.get('/settings', verifyLogIn, (req, res) => {
  let dealer = req.session.dealer
  res.render('dealer/settings', { dealer })
})
router.get('/dealer/add-user', verifyLogIn, (req, res) => {
  let dealer = req.session.dealer
  res.render('dealer/add-user', { dealer })
})
router.get('/dealer/edit-user', verifyLogIn, (req, res) => {
  let dealer = req.session.dealer
  res.render('dealer/edit-user', { dealer })
})
router.get('/products', verifyLogIn, async (req, res) => {
  let dealer = req.session.dealer
  let dealerId = req.session.dealer._id
  let products = await dealerHelper.getVendorProduct(dealerId)
  res.render('dealer/products', { dealer, products })
})
router.get('/add-products', verifyLogIn, (req, res) => {
  res.render('dealer/add-products')
})
router.post('/add-product', verifyLogIn, (req, res) => {
  let dealerId = req.session.dealer._id
  console.log(req.files.Image);
  dealerHelper.addProduct(dealerId, req.body).then(() => {
    let image = req.files.Image
    let id = req.body._id
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/dealer/products')
      } else {
        console.log(err);
      }
    })
  })
})
router.get('/edit-product/', verifyLogIn, async (req, res) => {
  let dealerId = req.session.dealer._id
  let proId = req.query.id
  let product = await dealerHelpers.getProductDetails(dealerId, proId)
  res.render('dealer/edit-product', { product })
})
router.post('/edit-product/:id',verifyLogIn,(req,res)=>{
  let dealerId = req.session.dealer._id
  let proId = req.params.id
  dealerHelpers.updateProduct(proId,req.body,dealerId).then(()=>{
    res.redirect('/dealer/products')
    if (req.files.Image) {
      let image = req.files.Image
      let id = req.params.id
      image.mv('./public/product-images/' + id + '.jpg',)
      console.log("image success");
    } else {
      console.log("image upload error");
    }
  })
})
router.get('/delete-product/:id',verifyLogIn,(req, res) => {
  let proId = req.params.id
  let dealerId = req.session.dealer._id
  console.log(proId);
  dealerHelpers.deleteProduct(dealerId,proId).then(()=>{
    res.redirect('/dealer/products')
  })
})
module.exports = router;
