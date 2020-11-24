var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard');
});
router.get('/login',(req,res)=>{
  res.render('admin/login')
})
router.post('/login',(req,res)=>{
  
})
module.exports = router;
