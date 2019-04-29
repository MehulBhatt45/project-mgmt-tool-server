var noticeModel = require('./../model/notice.model');
let noticeController = {};
var _ = require('lodash');
var dir = require('node-dir');
var mkdir = require('mkdirp');
var path = require('path');
var fs = require('fs');

noticeController.addNotice = function(req,res){

	var Notice = new noticeModel(req.body);
	Notice.save((error, newNotice)=>{
		if (error) {
			res.status(500).send(error);
		}else{
			var uploadPath = path.join(__dirname, "../uploads/notice/"+newNotice._id+"/");
			console.log(uploadPath);
			req.file('uploadfile').upload({
				maxBytes: 500000000,
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
					res.status(415).send(err);
				}else{
					console.log(files);
					var fileNames=[];
					if(files.length>0){
						_.forEach(files, (gotFile)=>{
							fileNames.push(gotFile.fd.split('/uploads/').reverse()[0])
						})
					}
					noticeModel
					.findOneAndUpdate({_id: newNotice._id}, {$set: {images: fileNames}}, { upsert: true, new: true })
					.exec((err , notice)=>{
						if (err) {
							console.log(err);
							res.status(404).send(err);
						}else{
							res.status(200).send(notice);
						}	
					})
				}
			})
		}	
	});
}

noticeController.updateNoticeById = function(req,res){
	var noticeId = req.params.noticeId;
	console.log("notice Id to update=>>>>>",noticeId);
	req.body.images = req.body.images?req.body.images.split(','):req.body.images[0];

	noticeModel
	.findOneAndUpdate({_id:noticeId},req.body,{ upsert: true, new: true },function(err,newNotice){

		if(err){
			res.status(500).send(err);

		}else{
			var uploadPath = path.join(__dirname, "../uploads/notice/"+newNotice._id+"/");
			console.log(uploadPath);
			req.file('images').upload({
				maxBytes: 500000000,
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
					res.status(415).send(err);
				}else{
					console.log(files);
					var fileNames=req.body.images;
					if(files.length>0){
						_.forEach(files, (gotFile)=>{
							fileNames.push(gotFile.fd.split('/uploads/').reverse()[0])
						})
					}
					req.body['images'] = fileNames;
					noticeModel
					.findOneAndUpdate({_id: newNotice._id}, {$set: {images: fileNames}}, { upsert: true, new: true })
					.exec((err , notice)=>{
						if (err) {
							console.log(err);
							res.status(404).send(err);
						}else{
							res.status(200).send(notice);
						}	
					})
				}
			})
		}

	})
}
noticeController.getAllNotice = function(req,res){

	noticeModel.find({}).exec(function(err,Notices){
		if (err) res.status(500).send(err);
		else{
			res.status(200).send(Notices);
		}
	})
}

noticeController.getNoticeById = function(req,res){

	noticeId = req.params.noticeId;

	noticeModel.findOne({_id:noticeId}).exec(function(err,Notices){
		if (err) res.status(500).send(err);
		else{
			res.status(200).send(Notices);
		}
	})
}

noticeController.updateNotice = function(req,res){

	noticeModel.find({}).exec(function(err,notices){
		if(err) res.status(500).send(err);
		else{
			var q = new Date();
			var m = q.getMonth();
			var d = q.getDay();
			var y = q.getFullYear();
			var date = new Date();
			console.log("notice length",notices.length);

			for(i=0;i<notices.length;i++)
			{

				console.log(notices[i].expireon);
				console.log(date);
				if (notices[i].expireon>date){
				}
				else{
					notices[i].published = false;
					notices[i].save();
				}


			}
		}
	})
}

noticeController.deleteNoticeById = function(req,res){

	var noticeId = req.params.noticeId;
	console.log("notice Id to update=>>>>>",noticeId);

	noticeModel.deleteOne({_id : noticeId} , function(err , removed){
		if(err) res.send(err);
		else res.status(200).send(removed);
	});
}


noticeController.changePhotoById = function(req,res){
	console.log("userId is==============>");
	var noticeId = req.params.noticeId
	var uploadPath = path.join(__dirname, "../uploads/notice/"+noticeId+"/");
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
			noticeModel.findOneAndUpdate({_id: noticeId}, {$set: {images:profile }}, {upsert:true, new:true}).exec((error,user)=>{
				if (error){ 
					res.status(404).send(error);
				}else{
					console.log(user);
					res.status(200).send(user);
				}
			})
		}

	})
	
}




module.exports = noticeController; 
