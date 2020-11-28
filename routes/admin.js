var express = require('express');
const { response } = require('../app');
var router = express.Router();
const adminHelpers=require('../helpers/admin-helper')
/* GET users listing. */
const verifyLogin=(req,res,next)=>{
  if(req.session.logedIn){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
router.get('/', function(req, res, next) {
  let user=req.session.user
  if(user){
    res.render('admin/dashboard',{user,style:'dashboard.css'});
  }else{
    res.redirect('/admin/login')  
  }
  
});
router.get('/login',(req,res)=>{
  if(req.session.user){
    res.redirect('/admin')
  }else{
    res.render('admin/login',{loginErr:req.session.loginErr})
    req.session.loginErr=false
  }
  
})
router.post('/login',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    console.log("res---",response);
    if(response.status){
      req.session.logedIn=true
      req.session.user=response.user
      res.redirect('/admin')
    }else{
      req.session.loginErr="Invalid Email or Password"
      res.redirect('/admin/login')
    }
  })
    
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
  
})

module.exports = router;
