const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require('bcrypt');
const client = require('./connection');
const controller = require('./controller')
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
const {LocalStorage}= require('node-localstorage');
localStorage = new LocalStorage('./scratch')
router.use(bodyparser.json());


router.get('/',(req,res)=>{
  res.render('index.ejs');
});
router.get('/register',(req,res)=>{
  res.render('register.ejs');
});
router.post('/login', controller.login);
router.post('/register', controller.register);
module.exports = router;
