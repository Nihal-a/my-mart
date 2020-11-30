var express = require('express');
const { response } = require('../app');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helper')
/* GET users listing. */
const verifyLogin = (req, res, next) => {
  if (req.session.logedIn) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}
router.get('/', function (req, res, next) {
  let admin = req.session.user
  if (admin) {
    adminHelpers.getAllVendors().then((vendors) => {
      res.render('admin/dashboard', { admin, vendors });
    })
  } else {
    res.redirect('/admin/login')
  }

});
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin')
  } else {
    res.render('admin/login', { loginErr: req.session.loginErr })
    req.session.loginErr = false
  }

})
router.post('/login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.logedIn = true
      req.session.user = response.user
      res.redirect('/admin')
    } else {
      req.session.loginErr = "Invalid Email or Password"
      res.redirect('/admin/login')
    }
  })

})
router.get('/settings', (req, res) => {
  let admin = req.session.user
  if (admin) {
    res.render('admin/settings', { admin })
  } else {
    res.redirect('/admin')
  }
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin')
})
router.get('/admin/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/admin')
})
router.get('/add-vendor', verifyLogin, (req, res) => {
  res.render('admin/add-vendor')
})
router.post('/add-vendor', (req, res) => {
  console.log(req.body);
  console.log(req.files.Image);
  adminHelpers.addVendor(req.body).then((id) => {
    let image = req.files.Image
    image.mv('./public/vendor-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('/admin')
      } else {
        console.log(err);
      }
    })
  })
})
router.get('/delete-vendor/:id',(req,res)=>{
  let proId=req.params.id
  adminHelpers.deleteVendor(proId).then((response)=>{
    res.redirect('/admin')
  })
})
router.get('/edit-vendor/',async(req,res)=>{
 let venId=req.query.id
 let vendor=await adminHelpers.getVenderDetails(venId)
   console.log(vendor);
   res.render('admin/edit-vendor',{vendor})
})
router.post('/edit-vendor/:id',(req,res)=>{
  adminHelpers.updateVendor(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})
module.exports = router;
