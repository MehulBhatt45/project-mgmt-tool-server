var attendenceModel = require('../model/attendence.model');
var userModel = require('../model/user.model');
let attendenceController = {};
var moment = require('moment');




attendenceController.employeeAttendence = function(req,res){
	console.log("req body ========>" , req.body);
	var currentEmployee;
	var updatedEmployee;
	var count;
	var previousDifference = 0;
	var difference;
	var currentDate = new Date();
	currentDate = moment(currentDate).format("YYYY-MM-DD");
	currentDate = currentDate+"T00:00:00.000+0000";
	console.log("Current Date =============>" , currentDate);
	userModel.findOne({_id:req.body.userId},function(err,foundEmp){
		console.log("foundemppppppppppppp",foundEmp);
		if(err){
			console.log("You are not registerd")
		}
		if(foundEmp){
			console.log("found student ============+>" , foundEmp);
			currentEmployee = foundEmp._id;
			console.log("cuureeeeeent",currentEmployee);
			console.log("sacho time ",new Date().toLocaleTimeString());
			attendenceModel.findOne({user_Id:currentEmployee , date: currentDate },function(err , updatedEmployee){
				console.log("updated Studemnt ====================>" , updatedEmployee);
				if(updatedEmployee != null){
					console.log("count status in ** updatedEmployee != null** ============>" , updatedEmployee.in_out.length);
					count = updatedEmployee.in_out.length - 1;
					console.log("value of count in updatedEmployee != null" , count);
					if(updatedEmployee.in_out[count].checkOut == null){
						console.log("worked ========+>");
						updatedEmployee.in_out[count].checkOut = new Date();
						previousDifference = updatedEmployee.in_out[count].checkOut - updatedEmployee.in_out[count].checkIn; 
						updatedEmployee.difference = +previousDifference + +updatedEmployee.difference;
						updatedEmployee.save(function(err, upSt){
							if(err){
								res.send(err)
							}
							else{
								console.log("updatedEmployee != null");
								res.send(upSt);
							}
						})
					}
					else{
						updatedEmployee.in_out.push({checkIn: new Date()});
						updatedEmployee.save(function(err , updated){
							if(err) res.send(err);
							else{
								res.send(updated);
							}
						})
						console.log("uemployee");	
					}
				}
				else{	
					console.log( "updatedEmployee == null")
					console.log(new Date().toLocaleTimeString());
					console.log("else ==.cureen",currentEmployee);
					var date = new Date();
					var obj = {
						date: new Date(),
						user_Id: currentEmployee,
						in_out: [{
							checkIn: new Date(),
						}]
					}
					obj.date = moment(obj.date).format("YYYY-MM-DD");
					console.log("obj ================>" , obj);
					console.log("obj.count" , obj);
					var attend = new attendenceModel(obj);
					console.log("attend ===================>" , attend);
					attend.save(function(err,savedStudent){
						console.log("saved");
						res.send(savedStudent);
					})
				}
			})
		}
	})
}

attendenceController.getAttendenceByDateAndId = function(req,res){
	console.log("tested");
	var date = req.body.date;
	date = date + " 00:00:00.000Z";
	req.body.date = date;
	console.log("req . body ===>" , req.body);
	console.log("datee=========",req.body.date);
	attendenceModel.findOne({date: req.body.date , user_Id:req.body.user_Id})
	.exec((err,foundData)=>{
		console.log("found data",foundData);
		if(err) {
			console.log("erooorrrrrrrr",err)
			res.send(err);
		}
		else {
			console.log("response of attendence",foundData);
			res.send(foundData)
		}
	})
}

attendenceController.AllemployeeAttendenceByDate = function(req , res){
	req.body.date = moment(req.body.date).format("YYYY-MM-DD");
	req.body.date = req.body.date+"T00:00:00.000+0000";
	console.log("date ============>" , req.body.date);
	var p = 0;
	var totalTime = 0;
	var milliSeconds ;
	var user = [];
	attendenceModel.find({date: req.body.date})
	.populate('user_Id')
	.exec(function(err , foundStudent){
		console.log("found Student =================>", foundStudent);
		// console.log("found Student =================>",foundStudent[].user_Id);
		const studentLength = foundStudent.length;
		for(var i = 0; i < studentLength; i++) {

			milliSeconds = foundStudent[i].difference;
			console.log("milliSeconds============>" , milliSeconds);
			var  s = milliSeconds/1000;
			var secs = s % 60;
			s = (s - secs) / 60;
			var mins = s % 60;
			var hrs = (s - mins) / 60;
			secs = Math.trunc( secs );
			mins = Math.trunc( mins );
			hrs = Math.trunc( hrs );
			var obj = {

				UserName : foundStudent[i].user_Id.name,
				userId : foundStudent[i].user_Id._id,
				Hours : hrs,
				Minutes : mins,
				Seconds: secs,
				check: foundStudent[i].in_out,
				difference:foundStudent[i].difference
			}
			console.log("obj-----------------------",obj);
			user.push(obj);
		}
		res.send(user);
	})
}

attendenceController.getAttendenceInInterval = function(req , res){

	console.log('body: ', req.body);
	req.body.fromDate = moment(req.body.fromDate).format("YYYY-MM-DD");
	var fromDate = req.body.fromDate+"T00:00:00.000Z";
	req.body.toDate = moment(req.body.toDate).format("YYYY-MM-DD");
	console.log('todDate: ', req.body.toDate);
	var toDate = req.body.toDate+"T00:00:00.000Z";
	console.log('hey tododate: ', toDate);

	var j;
	var k = 0;
	count = 0;
	var nextDate;
	var allItems = [];
	console.log('body: ',typeof fromDate, typeof toDate);
	console.log('body: ',fromDate, toDate);

	attendenceModel.find({date : { $gte: fromDate, $lte: toDate }})
	.populate('user_Id')
	.exec(function(err , foundUser){
		console.log("founduser===============",foundUser);
		for(i = 0; i<foundUser.length; i++){
			console.log("allItems==========", foundUser[i]);

			var obj = {

				UserName : foundUser[i].user_Id.name,
				userId : foundUser[i].user_Id._id,
				check: foundUser[i].in_out,
				difference:foundUser[i].difference
			}
			// console.log("obj-----------------------",obj);
			allItems.push(obj);

		}
		
		res.send(allItems);
	})
}




module.exports = attendenceController;
