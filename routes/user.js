var express = require('express');
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
var router = express.Router();
var userController = require('./../controller/user.controller');

/* GET users listing. */
router.post('/signup',userController.addUser) ;
router.post('/login',userController.logIn ) ;
router.put('/:id',userController.updateUserById);



module.exports = router;
