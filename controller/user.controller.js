var userModel = require('./../model/user.model');
var userController = {};
var bcrypt = require('bcryptjs');


userController.addUser = function(req,res){
	userModel.findOne({email: req.body.email})
	.exec((err,user)=>{
		if (err) {
			res.status(500).send(err);
		}
		else if (user){res.status(400).send('user already exists! '); }
		else{
		// Insert  new user if they do not exist 
		var User = new userModel({
			name: req.body.name,
			userRoll: req.body.userRoll,
			email: req.body.email,
			password: req.body.password
		});
		User.save();
		res.status(200).send(User);
	}
})
	console.log("body=====>>>>",req.body);
}

userController.updateUserById = function(req,res){
	userModel.findOneAndUpdate({_id:req.params.id},{$set:req.body},function(err,getuser){
		if(err){
			res.status(500).send(err);
		}
		res.status(200).send(getuser);
	})
	console.log(req.body);
}

// 

userController.logIn = function(req,res){
	console.log("req.method" , req.method);
	if(req.method == 'POST' && req.body.email && req.body.password){
		userModel.findOne({ email : req.body.email } )
		// .select('-password')
		.exec((err, user)=>{
			console.log(user, err);
			if (err) {
				return res.status(500).send( { errMsg : err });
			}else if(user){
				bcrypt.compare(req.body.password,user.password, function(error, isMatch) {
					console.log(isMatch, error);
					if (error){
						return res.status(403).send( { errMsg : 'User not found' });
					}else if(isMatch){
						return res.status(200).send( { user : user });
					}else{
						return res.status(403).send( { errMsg : 'Password Incorrect' });	
					}
				});
			}else{
				return res.status(403).send( { errMsg : 'User not found' });
			}
		});
	}else{
		return res.status(400).send({errMsg : 'Bad Data'});
	}
}


module.exports = userController; 
