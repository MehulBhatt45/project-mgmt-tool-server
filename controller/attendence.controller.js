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
	var difference = moment(difference).format("YYYY-MM-DD");
	var currentDate = new Date;
	currentDate = moment(currentDate).format("YYYY-MM-DD");
	currentDate = currentDate+"T00:00:00.000+0000";
	console.log("Current Date =============>" , currentDate);
	userModel.find({_id:req.body._id},function(err,foundEmp){
		console.log("foundemppppppppppppp",foundEmp);
		if(err){
			console.log("You are not registerd")
		}
		if(foundEmp){
			console.log("found student ============+>" , foundEmp);
			currentEmployee = foundEmp[0]._id;
			console.log("cuureeeeeent",currentEmployee);
			console.log(new Date().toLocaleTimeString());
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
						console.log("hailu halo");	
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
	attendenceModel.findOne({date: req.body.date , user_Id:req.body.user_Id})
	.exec((err,foundData)=>{
		if(err) {res.send(err);}
		else {res.send(foundData)}
	})
}

	module.exports = attendenceController;
