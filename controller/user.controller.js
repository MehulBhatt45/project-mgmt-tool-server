var userModel = require('../model/user.model');
var taskModel = require('../model/task.model');
var bugModel = require('../model/bug.model');
var issueModel = require('../model/issue.model');
var async = require('async');
var userController = {};
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

userController.addUser = function(req,res){
	userModel.findOne({email: req.body.email})
	.exec((err,founduser)=>{
		if (err) {
			res.status(500).send(err);
		}else if (founduser){
			res.status(400).send('user already exists! ');
		}else{
			var User = new userModel(req.body);
			User.save((error, newUser)=>{
				if (err) {
					res.status(500).send(err);
				}		
				res.status(200).send(newUser);
			});
		}
	})
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

userController.getAllUsers = function(req, res){
	userModel.find({userRole: 'user'})
	.exec((err,users)=>{
		if (err) {
			res.status(500).send(err);
		}else if (users){
			res.status(200).send(users);
		}else{
			res.status(404).send( { msg : 'Users not found' });
		}
	})
}

userController.logIn = function(req,res){
	// console.log("req.method" , req.method);
	if(req.method == 'POST' && req.body.email && req.body.password){
		userModel.findOne({ email : req.body.email } )
		// .select('-password')
		.exec((err, user)=>{
			// console.log(user, err);
			if (err) {
				return res.status(500).send( { errMsg : err });
			}else if(user){
				user.comparePassword(req.body.password,(error, isMatch)=>{
					if (error){
						return res.status(403).send( { errMsg : 'User not found' });
					}else if(isMatch){
						var role = user.userRole;
						(user.userRole==='user')?req.session.user = user:req.session.projectManager = user;
						req.session.authenticated = true;
						console.log("SESSION=============>",req.session.user, req.session.projectManager);
						const payload = {user};
						var token = jwt.sign(payload,'pmt');
						console.log("Token = ",token);
						return res.status(200).send({data:user,
							token: token});
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

userController.getUserWorkLogs = function(req,res){
	userModel.findOne({ _id: req.body.userId })
	.exec((err, response) => {
		if (err) {
			return res.status(500).json({
				status: false,
				code: 500,
				message: 'Internal Server Error'
			});
		} else {
			async.parallel(
			{
				task: function (callback) {
					taskModel.find()
					.where({ userId: req.body.userId})
					.exec((err1, userList) => {
						if (err1) callback([], null);
						callback(null, userList);
					})
				},
				bug: function (callback) {
					bugModel.find()
					.where({ userId: req.body.userId})
					.exec((err1, userList) => {
						if (err1) callback([], null);
						callback(null, userList);
					})
				},
				issue: function (callback) {
					issueModel.find()
					.where({ userId: req.body.userId})
					.exec((err1, userList) => {
						if (err1) callback([], null);
						callback(null, userList);
					})
				}
			}, function (err, results) {
				return res.status(200).json({
					status: true,
					code: 200,
					data: results
				});
			});
		}

	})
}

module.exports = userController; 
