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
// var mv = require('mv');
// var fileUpload = require('express-fileupload');

// userController.addUser = function(req,res){
// 	console.log("req files =============>" , req.files);
// 	console.log("req body",req.body);
// 	var samplefile = req.files.profilePhoto;
// 	var samplefile1= req.files.CV;
// 	console.log("samplefile==>",samplefile);
// 	samplefile.mv('./uploads/profilePhoto/'+samplefile.name,function(err,result){
// 		samplefile1.mv('./uploads/CV/'+samplefile1.name,function(err,result){
// 			if(err){
// 				console.log(err);
// 				res.status(500).send(err);
// 			}
// 			else{
// 				var profilePhoto='/uploads/profilePhoto/'+samplefile.name;
// 				req.body.profilePhoto=profilePhoto;

// 				var CV='/uploads/profilePhoto/'+samplefile1.name;
// 				req.body.CV=CV;
// 			// console.log(CV);



// 			userModel.findOne({email: req.body.email})
// 			.exec((err,founduser)=>{
// 				if (err) {
// 					res.status(500).send(err);
// 				}else if (founduser){
// 					res.status(400).send('user already exists! ');
// 				}else{
// 					var User = new userModel(req.body);
// 					User.save().then(result=>{
// 						res.status(200).send(result);

// 					})
// 					.catch(err => console.log(err));	

// 				}

// 				// console.log("founduser",founduser);
// 			});
// 		}
// 	});
// 	});
// }
// userController.addUser_without_file = function(req,res){
// 	console.log("req body",req.body);
// 	userModel.findOne({email: req.body.email})
// 	.exec((err,founduser)=>{
// 		if (err) {
// 			res.status(500).send(err);
// 		}else if (founduser){
// 			res.status(400).send('user already exists! ');
// 		}else{
// 			var User = new userModel(req.body);
// 			User.save((error, newUser)=>{
// 				if (err) {
// 					res.status(500).send(err);
// 				}		
// 				res.status(200).send(newUser);
// 				console.log(res);
// 			});
// 		}
// 				// console.log("founduser",founduser);
// 			});
// }


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
								var cv = files[i].fd.split('/')[6]+"/"+files[i].fd.split('/')[7];
							}else{
								var profile = files[i].fd.split('/')[6]+"/"+files[i].fd.split('/')[7];
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
	var uniqueArray = [];
	userModel.findOne({ _id: req.params.userId })
	.exec((err, response) => {
		if (err) {
			return res.status(500).json({
				status: false,
				code: 500,
				message: 'Internal Server Error'
			});
		} else {
			projectModel
			.find({pmanagerId: req.user._id})
			.exec((err, project)=>{
				if (err) {
					res.status(500).send(err);
				}
				_.forEach(project, (pro)=>{
					uniqueArray.push(pro._id);
				})
				console.log(uniqueArray);
				async.parallel(
				{
					task: function (callback) {
						taskModel.find()
						.where({ userId: req.body.userId})
						.where({ projectId: { $in: uniqueArray }})
						.exec((err1, userList) => {
							if (err1) callback([], null);
							callback(null, userList);
						})
					},
					bug: function (callback) {
						bugModel.find()
						.where({ userId: req.body.userId})
						.where({ projectId: { $in: uniqueArray }})
						.exec((err1, userList) => {
							if (err1) callback([], null);
							callback(null, userList);
						})
					},
					issue: function (callback) {
						issueModel.find()
						.where({ userId: req.body.userId})
						.where({ projectId: { $in: uniqueArray }})
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
