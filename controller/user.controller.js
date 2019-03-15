var userModel = require('../model/user.model');
var taskModel = require('../model/task.model');
var bugModel = require('../model/bug.model');
var projectModel = require('../model/project.model');
var issueModel = require('../model/issue.model');
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
		console.log(getuser)
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

	var userId = req.params.id
	console.log("userId is==============>",userId);
	userModel
	.findByIdAndUpdate({_id:userId},{$set:req.body},{upsert:true, new:true},function(err,getuser){

		if(err){
			res.status(500).send(err);
		}
		else{
			var uploadPath = path.join(__dirname, "../uploads/"+getuser._id+"/");
			console.log(uploadPath);
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
					var cv = files[0].fd.split('/uploads/').reverse()[0];
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
	// console.log("req.method" , req.method);
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


userController.changeProfileByUserId = function(req,res){
	var userId = req.params.id
	console.log("userId is==============>",userId);
	userModel
	.findByIdAndUpdate({_id:userId},{$set:req.body},{upsert:true, new:true},function(err,getuser){

		if(err){
			res.status(500).send(err);
		}
		else{
			var uploadPath = path.join(__dirname, "../uploads/"+getuser._id+"/");
			console.log(uploadPath);
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
					getuser['profilePhoto'] = profile;
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
	})
	
}



userController.changeProfileByUserId = function(req,res){
	userModel.find({_id:req.params.userId}, function(err,user){
		// 
		
		if (err) {
			res.status(500).send(err);
		}else{
			var uploadPath = path.join(__dirname, "../uploads/"+user._id+"/");
			console.log(uploadPath);
			req.file('uploadfile').upload({
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
					res.status(200).send(files);
				}

			})
		}
	})
}

// userController.uploadFile = function(req,res){
// 	console.log("uploadfile=======>",req.body);
// 	var files = [];
// 	var upload_file = {
// 		fileName : files	
// 	};

// 	var postFile = new userModel(upload_file);
// 	console.log("postFile",postFile);
// 	postFile.save(function(error,file){
// 		if (error) {
// 			return res.status(500).send(error);
// 		}else{
// 			for(var i = 0; i < req.files.uploadFile.length; i++){
// 				console.log("sampleFile", req.files.uploadFile[i]);				
// 				var sampleFile = req.files.uploadFile[i];
// 				sampleFile.mv('./uploads/'+sampleFile.name, function(err) {
// 					if (err){
// 						return res.status(500).send(err);
// 					}else{
// 					}
// 				});
// 				var fileName = sampleFile.name;
// 				var fileNameArr = fileName.split("\\");
// 				fileName  = fileNameArr[2];
// 				files.push("/uploads/"+sampleFile.name);
// 				console.log(files);
// 				file.fileName = files;
// 				file.save();
// 			}
// 			res.status(200).send(file);
// 		}
// 	});
// 	console.log(req.body);
// }	



module.exports = userController; 

