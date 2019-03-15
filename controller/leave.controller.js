var leaveModel = require ('../model/leave.model');
var userModel = require('../model/user.model');
let leaveController = {};
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


leaveController.applyLeave = function(req,res){
	// userModel.find({email: req.body.email})
	// console.log("ave che kai=========>",req.body)
	var leave = new leaveModel(req.body);
	console.log("nthi mdtu ke mde che", leave);
	leave.save(function(err,leave){
		if(err) res.status(500).send(err)
			else{	

				// var output = `<!doctype html>
				// 				<html>
				// 				<head>
				// 				<title> title111</title>
				// 				</head>
				// 				<body>
				// 				<div style="width:75%;margin:0 auto;border-radius: 6px;
				// 				box-shadow: 0 1px 3px 0 rgba(0,0,0,.5); 
				// 				border: 1px solid #d3d3d3;">
				// 				<center>
				// 				<img src="https://raoinformationtechnology.com/wp-content/uploads/2018/12/logo-median.png"></center>


				// 				<div style="margin-left:30px;padding:0;">
				// 				<p style="color:black;font-size:20px;">You have a new Leave Application from `+req.body.name+`</p>
								
				// 				<table style="color:black;">
				// 				<tr style="height: 50px;width: 100%;">
				// 				<td><b>Leave Date</b></td>
				// 				<td style="padding-left: 50px;">`+req.body.leaveDate+`</td></tr>

				// 				<tr style="height: 50px;">
				// 				<td><b>Duration</b></td>
				// 				<td style="padding-left: 50px;">`+req.body.duration+`</td></tr>


				// 				<tr  style="height: 50px;">
				// 				<td><b>Type of leave</b></td>
				// 				<td style="padding-left: 50px;">`+req.body.typeOfLeave+`</td></tr>


				// 				<tr style="height: 50px;">
				// 				<td><b>Reason</b></td>
				// 				<td style="padding-left: 50px;">`+req.body.reasonForLeave+`</td></tr>

				// 				</table>
				// 				</div>
				// 				</body>
				// 				</html>
				// 				`;

				// var transporter = nodemailer.createTransport({
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
				// 	html: output
				// };

				// transporter.sendMail(mailOptions, function(error, info){
				// 	if (error) {
				// 		console.log("Error",error);
				// 	} else {
				// 		console.log('Email sent: ' + info.response);
						res.status(200).send(leave)
					}
				});
			// }
		// })
}

leaveController.getLeaves = function(req,res){
	leaveModel.find({status: "pending"})
	.exec((err,status)=>{
		if(err) res.status(500).send(err) 
			else{
				console.log(status)

				res.status(200).send(status)

			}
		})
}

module.exports = leaveController;
