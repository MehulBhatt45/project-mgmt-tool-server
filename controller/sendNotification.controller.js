var notificationModel = require('../model/notification.model');
var sendnotificationModel = require('../model/sendNotification.model');
var projectModel = require('../model/project.model');
var userModel = require('../model/user.model');
let sendnotificationController = {};
var pushNotification = require('./../service/push-notification.service');


sendnotificationController.addNotification = function(req, res){
	var temp =  req.body.sendTo;
				console.log("send to ===>" , temp);
				temp =  temp.split(",");
				console.log("send to after===>" , temp);
				req.body.sendTo = temp;
				// console.log(req.body);
	console.log("bodyyyyyyyyyy=====>",req.body);
	// var notification = new sendnotificationModel(req.body);
	projectModel.findOne({_id: req.body.projectId})
	.exec((err,projectId)=>{
		if (err){
			res.status(500).send(err);
		}else{
			console.log("project name=========>",projectId);
			console.log("pmanagerIdpmanagerId====>",projectId.pmanagerId);
	// notification.save(function(err,SavedUser){
		// console.log("saved========>",SavedUser);
		console.log("req.body.sendTo.length=======>",req.body.sendTo.length);
		if (err) {
			console.log("errrr",err);
			res.status(500).send(err);
		}else{
			if(req.body.sendTo.length > 1){
				console.log("first============================>");
				var obj = {
				"subject": "You have new notification from Pmanager.",
				"content": projectId.uniqueId +" team," +req.body.content+".Regards " + req.body.pmanagerName+ ".",
				"sendTo": req.body.sendTo,
				"type" : "other"
			}
			}else{
				console.log("Second=========================================>");
			var obj = {
				"subject": "You have new notification from Pmanager.",
				"content": "You have new notice from " +req.body.pmanagerName+ ".",
				"sendTo": req.body.sendTo,
				"type" : "other"
			}
		}
			console.log("saved object===>",obj);
			var notification = sendnotificationModel(obj);
			notification.save(function(err,SavedUser){
			console.log("objj===========>",SavedUser);
			notificationModel
			.find({userId: SavedUser.sendTo})
			.exec((err, user)=>{
				console.log("userr====>",user);
				if (err) {
					console.log("err",err);
					res.status(500).send(err);
				}else{
					req.session.user = user;
					req.session.userarray = [];
					console.log("length===>",user.length);
					for(i=0;i<user.length;i++){
						req.session.userarray.push(req.session.user[i].token);
					console.log("arrayyyy===>");
					console.log("token array======>",req.session.userarray);
					}
					pushNotification.postCode(obj.subject,obj.content,req.session.userarray);
				}
			})
			res.status(200).send(SavedUser);
			})
		}
	// });
}
})
}


sendnotificationController.getNotificationByUserId = function(req,res){
	var sendTo = req.params.id;
 sendnotificationModel.find({sendTo : sendTo})
 .populate('sendTo , projectId')
 .exec((err,user)=>{
 	if (err) {
 		res.status(500).send(err);
 	}else{
 		console.log("userrr=>>>",user);
 		res.status(200).send(user);
 	}
 })
}

	module.exports = sendnotificationController; 






// { createdAt: 2019-04-12T07:16:04.833Z,
//   sendTo: 
//    [ 5cad9f0d960c922a21c27bfb,
//      5cad9ecd960c922a21c27bfa,
//      5ca8897bfaa8ba4bd3baae26,
//      5c890f2a63e53c39366fa8cc ],
//   projectId: 5caec61885bbe21bd44440e2,
//   type: 'other',
//   priority: null,
//   _id: 5cb03b376de97530a6b18ac1,
//   subject: ' nbh',
//   content: 'come in confrence room.',
//   __v: 0 }
// { pmanagerName: 'Foram',
//   projectId: '5caec61885bbe21bd44440e2',
//   subject: ' nbh',
//   content: 'come in confrence room.',
//   sendTo: 
//    [ '5cad9f0d960c922a21c27bfb',
//      '5cad9ecd960c922a21c27bfa',
//      '5ca8897bfaa8ba4bd3baae26',
//      '5c890f2a63e53c39366fa8cc' ] }

