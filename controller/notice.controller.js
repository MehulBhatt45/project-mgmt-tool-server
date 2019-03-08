var noticeModel = require('./../model/notice.model');
let noticeController = {};
var _ = require('lodash');

noticeController.addNoticeWithoutImage = function(req,res){

	var Notice = new noticeModel(req.body);
	Notice.save((error, newNotice)=>{
		if (error) {
			res.status(500).send(error);
		}		
		res.status(200).send(newNotice);
	});
}

noticeController.addNoticeWithImage = function(req,res){

	console.log("reuested file",req.files.uploadFile);
	console.log("uploadfile=======>",req.body);
	var files = [];
	var Notice_data = {
		title : req.body.title,
		desc : req.body.desc,
		published : req.body.published,
		images : files,
		expireon : req.body.expireon
	};

	var notice = new noticeModel(Notice_data);
	console.log("Notice_data",Notice_data);
	notice.save(function(error,savedNotice){
		if (error) {
			return res.status(500).send(error);
		}else{
			if(req.files.uploadFile.length>0){
				for(var i = 0; i < req.files.uploadFile.length; i++){
					var sampleFile = req.files.uploadFile[i];
					sampleFile.mv('./uploads/notice/'+sampleFile.name, function(err) {
						if (err){
							return res.status(500).send(err);
						}
					});
					var images = sampleFile.name;
					var imagesArr = images.split("\\");
					images  = imagesArr[2];
					files.push("/uploads/notice/"+sampleFile.name);
					console.log("files array==>>>",files);
					savedNotice.images = files;
					savedNotice.save();
				}
			}else{
				var sampleFile = req.files.uploadFile;
				sampleFile.mv('./uploads/notice/'+sampleFile.name, function(err) {
					if (err){
						return res.status(500).send(err);
					}
				});
				var images = sampleFile.name;
				var imagesArr = images.split("\\");
				images  = imagesArr[2];
				files.push("/uploads/notice/"+sampleFile.name);
				console.log("files array==>>>",files);
				savedNotice.images = files;
				savedNotice.save();
			}
			res.status(200).send(savedNotice);
		}
	});
	console.log(req.body);
}

noticeController.deleteNotice = function(req,res){
	var noticeId = req.params.noticeId;
	noticeModel.findOneAndDelete({_id:noticeId}).exec(function(err,deletedNotice){
		if (err) res.status(500).send(err);
		else{
			res.status(200).send(deletedNotice);
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
					// console.log("notice date",notices[i].expireon);
					// console.log("system dte",date);
					// console.log("greater");
				}
				else{
					// console.log("notice date",notices[i].expireon);
					// console.log("system dte",date);
					// console.log("smaller");
					notices[i].published = false;
					notices[i].save();
				}


			}
		}
	})
}

module.exports = noticeController; 
