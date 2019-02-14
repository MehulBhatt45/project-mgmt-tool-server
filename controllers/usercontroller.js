var userModel = require("./../models/usermodel");
var userController = {};


userController.addUser = function(req,res){
	var user = new userModel(req.body);
	user.save(function(err,user){
		console.log(user);
		if(err){
			res.status(500).send(err);
		}
		res.status(200).send(user);
	}) 
	console.log(req.body);
}

userController.logIn = function(req,res){
	console.log("req.method" , req.method);
	if(req.method == 'POST' && req.body.email && req.body.password){
		userModel.findOne( { email : req.body.email , password : req.body.password } )
		.select('-password')
		.exec((err, user)=>{
			if (err) {
				return res.status(500).send( { errMsg : err });
			}else if (user == null) {
				return res.status(403).send( { errMsg : 'User not found' });
			}else{
				return res.status(200).send( { user : user });
			}
		});
	}else{
		return res.status(400).send({errMsg : 'Bad Data'});
	}
}

module.exports = userController; 
