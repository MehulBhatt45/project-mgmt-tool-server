var express = require('express');
var router = express.Router();
var userController = require('./../controller/user.controller');

/* GET users listing. */
router.post('/',userController.addUser) ;
router.get('/',userController.getUser);
router.put('/',userController.updateUserById);
router.put('/',userController.deleteUserById);
router.post('/login',userController.logIn ) ;


module.exports = router;
