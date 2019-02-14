var express = require('express');
var router = express.Router();
var userController = require("./../controllers/usercontroller");

/* GET users listing. */
router.post('/',userController.addUser) ;
router.post('/login',userController.logIn ) ;

module.exports = router;
