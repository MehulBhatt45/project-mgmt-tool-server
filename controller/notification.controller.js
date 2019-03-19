var notificationModel = require('../model/notification.model');
let notificationController = {};

notificationController.addUser = function(req,res){
	console.log("notificatiion data",req.body);
	var userId = req.body.userId;
	var token = req.body.token;

	notificationModel
	.findOneAndUpdate({userId:userId}, {$set: {token:token}}, { upsert: true, new: true })
	.exec((err , user)=>{
		if (err){
			console.log(err);
			res.status(500).send(err);
		}else if(user){
			user.save();
			res.status(200).send(user);
		}else{
			var notification = new notificationModel(req.body);
			notification.save(function(err,SavedUser){
				if (err) res.status(500).send(err);
				res.status(200).send(SavedUser);
			})
		}	
	})	
}

notificationController.getAllUsers = function(req, res){
	notificationModel.find({})
	.exec((err,users)=>{
		if (err) {
			res.status(500).send(err);
		}else if (users){
			res.status(200).send(users);
			req.session.users = users;
			req.session.userarray = [];

			for(i=0;i<users.length;i++){
				
				req.session.userarray.push(req.session.users[i].token);

			}
			console.log("token array",req.session.userarray);
			
		}else{
			res.status(404).send( { msg : 'Users not found' });
		}
	})
}

notificationController.getUserById = function(req, res){
	userId = req.params.userId;
	notificationModel.findOne({userId:userId})
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


module.exports = notificationController; 
