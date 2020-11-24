var express = require('express');
const { response } = require('../app');
var router = express.Router();
const adminHelpers=require('../helpers/admin-helper')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard');
});
router.get('/login',(req,res)=>{
  res.render('admin/login')
})
router.post('/login',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    console.log("res---",response);
    if(response.status){
      res.redirect('/admin')
    }else{
      res.redirect('/admin/login')
    }
  })
    
})
module.exports = router;
