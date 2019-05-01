
var taskModel = require('./../model/task.model');
var projectModel = require('../model/project.model');
var _ = require('lodash');
let taskController = {};
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


 // function generateOutput([]);
 // generateOutput = [title,desc,startDate,dueDate,priority];
 // (title = req.body.title,desc = req.body.desc,startDate = req.body.startDate,dueDate = req.body.dueDate,priority = req.body.priority)

 

// const sendmail = require('sendmail')();

taskController.addTask = function(req,res){		
	// if(!req.body.assignTo && req.user.userRole != 'projectManager'){
	// 	req.body['assignTo'] = req.user._id;
	// }

	req.body['createdBy'] = req.body.createdBy;
	req.body['startDate'] = Date.now()
	var task = new taskModel(req.body);
	task.save(function(err,Savedtask){
		// console.log("saved task", Savedtask);
		projectModel.findOne({_id: Savedtask.projectId})
		.exec((err, resp)=>{
			if (err) res.status(500).send(err);
			resp.taskId.push(Savedtask._id);
			if(!_.includes(resp.Teams, Savedtask.assignTo)){
				resp.Teams.push(Savedtask.assignTo);
				// task.save(function(errr,Priortask){
				// 	taskModel.findOne({priority:Priortask.priority})
				// 	.exec((error,res)=>{
				// 		if(error){
				// 			console.log("error");
				// 		}else{
				// 			console.log("==============>>>>>>>",res);
				// 			if(res == High){
				// 				console.log("highhhh....")
				// 			}else if(res == Medium){
				// 				console.log("medium")
				// 			}else{
				// 				console.log("low..")
				// 			}
				// 		}
				// 	})
				// })
			var priority1 = req.body.priority;
			var color;
			if(priority1 == 'high'){
				color = "#f33838";
			}else if(priority1 == 'medium'){
				color = "#ffc202";
			}else{
				color = "#0087ff";
			}
			
			var output = `<!doctype html>
			<html>
			<head>
			<title> title111</title>
			</head>
			<body>
			<div style="width:75%;margin:0 auto;border-radius: 6px;
			box-shadow: 0 1px 3px 0 rgba(0,0,0,.5); 
			border: 1px solid #d3d3d3;">
			<center>
			<img src="https://raoinformationtechnology.com/wp-content/uploads/2018/12/logo-median.png"></center>
			
			
			<div style="margin-left:30px;padding:0;">
			<p style="color:black;font-size:20px;">You have been assigned a <span style="text-transform:uppercase;color:`+color+`">`+priority1+`</span> priority task.</p>
			<p style="color:black;font-size:16px;">Please,Complete Your Task before deadline.</p>
			<table style="color:black;">
			<tr style="height: 50px;width: 100%;">
			<td><b>Title</b></td>
			<td style="padding-left: 50px;">`+req.body.title+`</td></tr>

			<tr style="height: 50px;">
			<td><b>Description</b></td>
			<td style="padding-left: 50px;">`+req.body.desc+`</td></tr>


			<tr  style="height: 50px;">
			<td><b>Priority</b></td>
			<td style="padding-left: 50px;">`+req.body.priority+`</td></tr>


			</table>
			</div>
			</body>
			</html>
			`;


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
				to: 'foramtrada232@gmail.com',
				subject: 'Testing Email',
				text: 'Hi, this is a testing email from node server',
				html: output
			};

			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log("Error",error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			// function sendMail(){
//create the path of email template folder 
// var templateDir = path.join("../views/email.pug", "../", 'templates', 'testMailTemplate')

//     var testMailTemplate = new EmailTemplate(templateDir)
//       var transporter = nodemailer.createTransport({
// 	host: "smtp.gmail.com",
// 	port: 465,
// 	secure: true,
// 	service: 'gmail',
// 	auth: {
// 		user: 'tnrtesting2394@gmail.com',
// 		pass: 'raoinfotech09'
// 	}
// });


// var mailOptions = {
// 	from: 'tnrtesting2394@gmail.com',
// 	to: 'foramtrada232@gmail.com',
// 	subject: 'Testing Email',
// 	text: 'Hi, this is a testing email from node server',
// 	html:templates
// };



//     testMailTemplate.render(mailOptions, function (err, temp) {
//         if (err) {
//             console.log("error", err);

//         } else {
//              transporter.sendMail(mailOptions, function(error, info){
// 				if (error) {
// 					console.log("Error",error);
// 				} else {
// 					console.log('Email sent: ' + info.response);
// 				}
// 			});
//         }

//     })

// }

			// sendmail({
			// 	from: 'mehul.2287884@gmail.com',
			// 	to: 'vivekkbharda@gmail.com ',
			// 	subject: 'test sendmail',
			// 	html: 'Mail of test sendmail ',
			// }, function(err, reply) {
			// 	console.log(err && err.stack);
			// 	console.dir(reply);
			// });
			
			
			resp.save();
			res.status(200).send(Savedtask);
			console.log("sucess");
		}
	})
})
}




taskController.getAllTask = function(req,res){
	taskModel.find({}).exec(function(err,tasks){
		if (err) res.status(500).send(err);
		else if(tasks) res.status(200).send(tasks);
		else res.status(404).send("Not Found");
	})
}

taskController.deleteTaskById = function(req,res){
	var taskId = req.params.taskId;
	taskModel.findOneAndDelete({_id:taskId}).exec(function(err,deletedtask){
		if (err) res.status(500).send(err);
		else if(deletedtask){
			projectModel.findOne({_id: deletedtask.projectId})
			.exec((err, resp)=>{
				if (err) res.status(400).send(err);
				else if(resp){
					resp.taskId.splice(_.findIndex(resp.taskId, deletedtask._id), 1);
					resp.save();
					res.status(200).send(deletedtask);
				}else{
					res.status(404).send("Not Found");		
				}
			})
		}else{
			res.status(404).send("Not Found");
		}
	})

}


taskController.getTaskById = function(req,res){
	var taskId = req.params.taskId;
	console.log("task ID===========>>>>>",taskId);
	taskModel.findOne({_id:taskId}).exec(function(err,singletask){
		if (err) res.status(500).send(err);
		else if(singletask) res.status(200).send(singletask);
		else res.status(404).send("Not Found");
	})

}

taskController.updateTaskById = function(req,res){
	var taskId = req.params.taskId;
	taskModel.findOneAndUpdate({_id:taskId},{$set:req.body},{upsert:true, new:true},function(err,Updatedtask){
		if (err) res.status(500).send(err);
		else if(Updatedtask) {
			projectModel.findOne({_id: Updatedtask.projectId})
			.exec((err, resp)=>{
				if (err) res.status(404).send(err);
				if(!_.includes(resp.Teams, Updatedtask.assignTo))
					resp.Teams.push(Updatedtask.assignTo);
				resp.save();
				res.status(200).send(Updatedtask);

			})
		}
		else res.status(404).send("Not Found");
	})
}

taskController.updateTaskStatusById = function(req,res){
	var taskId = req.params.taskId;
	if(req.body.status!=='complete'){
		taskModel.findOne({_id: taskId}).exec((err, task)=>{
			if (err) res.status(500).send(err);
			else if(task){
				var timelog = task.timelog;
				timelog.push({
					operation: "shifted to "+req.body.status+" from "+task.status,
					dateTime: Date.now(),
					operatedBy: req.body.operatorId
				})
				taskModel.findOneAndUpdate({_id:taskId},{$set:{status: req.body.status, timelog: timelog, startDate: req.body.status=='in progress'?Date.now():'' }},{upsert:true, new:true},function(err,Updatedtask){
					if (err) res.status(400).send(err);
					else if(Updatedtask) res.status(200).send(Updatedtask);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}

taskController.updateTaskStatusToComplete = function(req,res){
	var taskId = req.params.taskId;
	console.log("req . body of complete ======>" , req.body);
	if(req.body.status==='complete'){
		taskModel.findOne({_id: taskId}).exec((err, task)=>{
			if (err) res.status(500).send(err);
			else if(task){
				taskModel.findOneAndUpdate({_id:taskId},{$set:{status: req.body.status, completedAt: Date.now()}},{upsert:true, new:true},function(err,Updatedtask){
					if (err) res.status(400).send(err);
					else if(Updatedtask) res.status(200).send(Updatedtask);
					else res.status(404).send("Not Found");
				})
			}
			else res.status(404).send("Not Found");
		})
	}else{
		res.status(403).send("Bad Request");
	}
}

taskController.getUserLogsByTaskId = function(req,res){
	var taskId = req.params.taskId;
	taskModel.findOne({_id: taskId}).exec((err, task)=>{
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else if(task){
			taskModel.find({ "timelog": {$elemMatch: { operatedBy: req.body.userId }}}).exec((error, taskLog)=>{
				if(error){
					console.log(error);
				}
				res.status(200).send(taskLog);
			})
		}
		else res.status(404).send("Not Found");
	})
}


module.exports = taskController;