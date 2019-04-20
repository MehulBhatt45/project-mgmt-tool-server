var userModel = require('../model/user.model');
var taskModel = require('../model/task.model');
var bugModel = require('../model/bug.model');
var projectModel = require('../model/project.model');
var issueModel = require('../model/issue.model');
SALT_WORK_FACTOR = 10;
var async = require('async');
var userController = {};
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');
var dir = require('node-dir');
var _ = require('lodash');

var nodemailer = require ('nodemailer');
const smtpTransport = require ('nodemailer-smtp-transport');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken'); // Import JWT Package
var secret = 'secret'; // Create custom secret for use in JWT


userController.addUser = function(req,res){
	console.log("req body ===>" , req.body);
	userModel.findOne({email: req.body.email})
	.exec((err,founduser)=>{
		if (err) {
			res.status(500).send(err);
		}else if (founduser){
			res.status(400).send('user already exists! ');
		}else{
			var User = new userModel(req.body);
			User.save((err, newUser)=>{
				if (err) {
					res.status(500).send(err);
				}
				else{

				// res.status(200).send(newUser);
				console.log("newuser",newUser);
				var uploadPath = path.join(__dirname, "../uploads/"+newUser._id+"/");
				console.log("userid===>",newUser._id);
				console.log("uploadprofile path===>",uploadPath);
				req.file('profilePhoto').upload({
					maxBytes: 50000000,
					dirname: uploadPath,
					saveAs: function (__newFileStream, next) {
						dir.files(uploadPath, function(err, files) {
							if (err){
								mkdir(uploadPath, 0775);
								return next(undefined, __newFileStream.filename);
							}else {
								return next(undefined, __newFileStream.filename);
							}
						});
					}
				}, function(err, files){
					if (err) {
						console.log(err);
						res.status(500).send(err);
					}else{
						console.log("files==========>",files)
						// res.status(200).send("files uploaded successfully");
						for(var i=0;i<files.length;i++){
							if(_.includes(files[i].filename, '.pdf')){
								var cv = files[i].fd.split('/uploads/').reverse()[0];
							}else{
								var profile = files[i].fd.split('/uploads/').reverse()[0];
							}
						}
						newUser['CV'] = cv;
						newUser['profilePhoto'] = profile;
						userModel.findOneAndUpdate({_id: newUser._id}, {$set: {CV:cv, profilePhoto:profile }}, {upsert:true, new:true}).exec((error,user)=>{
							if (error) res.status(500).send(error);
							res.status(200).send(user);
						})
					}

				})
			}		
		});	
		}			
	})
}

userController.getSingleUser = function(req, res){
	console.log("req.paras ===>" , req.params.userId);
	userModel.findOne({_id:req.params.userId}, function(err,getuser){
		if(err){
			res.status(500).send(err);
		}
		console.log(getuser);
		res.status(200).send(getuser);
	})
}

userController.resetPassword = function(req,res){ 
	console.log(req.body);
	userModel.findOne({ email:req.body.email}).exec((err,user)=>{
		if (err) {
			res.status(500).send(err);
		}else if (user) {
			console.log("====================> USer", user);
			user.comparePassword(req.body.currentPassword, user.password, (error, isMatch)=>{
				if (error){
					return res.status(500).send(error);
				}else if(isMatch){
					user.password = req.body.newPassword;
					user.save();
					console.log(user);
					res.status(200).send(user);
				}
				else{
					return res.status(403).send( { errMsg : 'password incorrect' });	
				}
			});
		}else{
			return res.status(400).send( { errMsg : 'Bad request' });
		}
	})
}

userController.updateUserById = function(req,res){
	var userId = req.params.userId;
	console.log("userId is==============>",userId);
	userModel
	.findByIdAndUpdate({_id:userId},{$set:req.body},{upsert:true, new:true},function(err,getuser){

		if(err){
			res.status(500).send(err);
		}
		else{
			var uploadPath = path.join(__dirname, "../uploads/"+getuser._id+"/");
			console.log("IN UPDATE DETAILS==============>",uploadPath);
			req.file('cv').upload({
				maxBytes: 50000000000000,
				dirname: uploadPath,
				saveAs: function (__newFileStream, next) {
					dir.files(uploadPath, function(err, files) {
						if (err){
							mkdir(uploadPath, 0775);
							return next(undefined, __newFileStream.filename);
						}else {
							return next(undefined, __newFileStream.filename);
						}
					});
				}
			}, function(err, files){
				if (err) {
					console.log(err);
					res.status(500).send(err);
				}else{
					console.log(files);
					console.log("files==========>",files)
					var cv = "";
					if(files && files.length)
						cv = files[0].fd.split('/uploads/').reverse()[0];
					getuser['CV'] = cv;
					userModel.findOneAndUpdate({_id: userId}, {$set: {CV:cv }}, {upsert:true, new:true}).exec((error,user)=>{
						if (error){ 
							res.status(500).send(error);
						}else{
							console.log(user);
							res.status(200).send(user);
						}
					})
				}

			})
		}
	})
}

userController.getAllUsers = function(req, res){
	userModel.find({})
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


userController.getAllProjectManager = function(req, res){
	console.log("all project Manager==>>");
	userModel.find({userRole:'projectManager'})
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

userController.getAllUsersByProjectManager = function(req, res){
	var uniqueArray = [];
	projectModel
	.find({pmanagerId: req.body.pmId})
	.exec((err, project)=>{
		if(err){
			res.status(500).send(err);
		}else{
			_.forEach(project, (pro)=>{
				uniqueArray.push(...pro.Teams);
			})
			userModel
			.find({_id: { $in: uniqueArray }, userRole:'user'})
			.exec((error, users)=>{
				if (err) {
					res.status(500).send(err);
				}else if (users){
					console.log(users);
					res.status(200).send(users);
				}else{
					res.status(404).send( { msg : 'Users not found' });
				}
			})
		}
	})
}


userController.logIn = function(req,res){
	console.log("req.method" , req.body);
	if(req.method == 'POST' && req.body.email && req.body.password){
		userModel.findOne({ email : req.body.email } )
		// .select('-password')
		.exec((err, user)=>{
			// console.log(user, err);
			if (err) {
				return res.status(500).send( { errMsg : err });
			}else if(user){
				user.comparePassword(req.body.password, user.password,(error, isMatch)=>{
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
						return res.status(400).send( { errMsg : 'Password Incorrect' });	
					}
				});
			}else{
				return res.status(403).send( { errMsg : 'User Email is wrong' });
			}
		});
	}else{
		return res.status(400).send({errMsg : 'Bad Data'});
	}
}


userController.changeProfileByUserId = function(req,res){
	console.log("userId is==============>", req.file('profilePhoto'));
	var userId = req.params.id
	var uploadPath = path.join(__dirname, "../uploads/"+userId+"/");
	console.log("IN UPDATE PROFILE=============>",uploadPath);
	req.file('profilePhoto').upload({
		maxBytes: 50000000000000,
		dirname: uploadPath,
		saveAs: function (__newFileStream, next) {
			dir.files(uploadPath, function(err, files) {
				if (err){
					mkdir(uploadPath, 0775);
					return next(undefined, __newFileStream.filename);
				}else {
					return next(undefined, __newFileStream.filename);
				}
			});
		}
	}, function(err, files){
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else{
			console.log(files);
			console.log("files==========>",files)

			var profile = files[0].fd.split('/uploads/').reverse()[0];
			// getuser['profilePhoto'] = profile;
			userModel.findOneAndUpdate({_id: userId}, {$set: {profilePhoto:profile }}, {upsert:true, new:true}).exec((error,user)=>{
				if (error){ 
					res.status(500).send(error);
				}else{
					console.log(user);
					res.status(200).send(user);
				}
			})
		}

	})
	
}

userController.getDevelpoersNotInProjectTeam = function(req, res){
	projectModel
	.findOne({_id: req.params.projectId})
	.exec((err, project)=>{
		if(err)
			res.status(500).send(err)
		else{
			userModel
			.find({_id: {$nin: project.Teams}})
			.exec((error, developers)=>{
				if (err) {
					res.status(500).send(error);
				}else{
					res.status(200).send(developers)
				}
			})
		}
	})
}


userController.forgotPassword = function (req,res) {
	console.log("forgot password");
	userModel.findOne({ email : req.body.email } )
	.exec((err, user)=>{
		if (err) {
			return res.status(500).send( { errMsg : err });
		}else if(user){
			// console.log(user.name);
			user.temporarytoken = jwt.sign({ name: user.name, email: user.email }, secret, { expiresIn: '10min' }); // Create a token for activating account through e-mail
			// console.log(user.temporarytoken);
			var output = "Hello";
			var transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true,
				service: 'gmail',

				auth: {
					user: 'tnrtesting2394@gmail.com',
					pass: 'raoinfotech09'
				}
			});

			var mailOptions = {
				from: 'tnrtesting2394@gmail.com',
				to: req.body.email,
				subject: 'Localhost Forgot Password Request',
				text: 'Hello ' + user.name + ', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="https://raoinfotech-conduct.tk/#/forgotpwd/'+ user.temporarytoken,
				html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password.This link will expires in 10 minutes.<br><br><a href="https://raoinfotech-conduct.tk/#/forgotpwd/' + user.temporarytoken + '">https://raoinfotech-conduct.tk/#/forgotpwd/</a>'
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log("Error",error);
				} else {
					console.log('Email sent: ' + info.response);
					res.status(200).send(user);
				}
			});
		}else{
			return res.status(403).send( { errMsg : 'User not found' });
		}
	});
}
userController.updatePassword = function (req,res) {
	var token = req.body.token;
	jwt.verify(token, secret, function(err, decoded) {
		// console.log(decoded);
		userModel.findOne({ email:decoded.email }).exec((err,user)=>{
			if (err) {
				return res.status(500).send( { errMsg : err });
			}else if(user){
				user.password = req.body.password;
				user.save(function(error, changedUser) {
					if (error) res.status(500).send(error);
					res.status(200).send({ msg:"password changed" });
				});
			}
			else{
				res.status(403).send({ errMsg : "Not authorised" });
			}
		});
	}); 
}


userController.getProjectMngrNotInProject = function(req, res){
	console.log("getProjectMngrNotInProject");
	projectModel
	.findOne({_id: req.params.projectId})
	.exec((err, project)=>{
		if(err)
			res.status(500).send(err)
		else{
			userModel
			.find({$and: [{_id: {$nin: project.pmanagerId}},{userRole:'projectManager'}]})
			.exec((error, developers)=>{
				if (err) {
					res.status(500).send(error);
				}else{
					res.status(200).send(developers)
				}
			})
		}
	})
}

userController.deleteUserById = function(req,res){

	var userId = req.params.userId;
	userModel.findOneAndDelete({_id:userId}).exec(function(err,user){
		console.log("err==========>>>",err);
		res.status(200).send(user);
		console.log("user is========>",user);
	})

}

module.exports = userController; 


