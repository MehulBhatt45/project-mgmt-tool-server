var timeLogModel = require('../model/timeLog.model');
var taskModel = require('../model/tasks.model');
let timeLogController = {};









timeLogController.addTimeLog = function(req,res){
	console.log("rewq . body ==>" , req.body);
	var currentTask;
	var updatedTask;
	var count;
	var previousDifference = 0;
	var difference;
	var diff;
	taskModel.find({uniqueId:req.body.uniqueId},function(err,foundTask){
		console.log("foundemppppppppppppp",foundTask);
		if(err){
			console.log("task not found")
		}
		if(foundTask){
			console.log("found task ============+>" , foundTask);
			currentTask = foundTask[0]._id;
			console.log('curruntTask',currentTask);
			console.log(new Date().toLocaleTimeString());
			timeLogModel.findOne({taskId:currentTask},function(err , updatedTask){
				console.log("updated task ====================>" , updatedTask);
				if(updatedTask != null){
					count = updatedTask.log.length - 1;
					console.log("value of count in updatedtask != null" , count);
					if(updatedTask.log[count].endTime == null){
						console.log("worked ========+>");
						updatedTask.log[count].endTime = new Date();
						console.log('endtimeeeeeeeeeeeee===========>',updatedTask.log[count].endTime);
						previousDifference = updatedTask.log[count].endTime.getTime() - updatedTask.log[count].startTime.getTime(); 
						console.log('previousDifference',previousDifference);
						updatedTask.difference = +previousDifference + +updatedTask.difference;
						// diff = updatedTask.difference.getTime();
						console.log('updatedTask.difference================>',updatedTask.difference);
						// console.log('updatedTask.difference',diff);
						updatedTask.save(function(err, upSt){
							if (err) res.send(err);
							console.log("updatedTask != null");
							res.send(upSt);
						})
					}
					else{
						updatedTask.log.push({startTime: new Date()});
						updatedTask.save(function(err , updated){
							if(err) res.send(err);
							res.send(updated);
						})
						console.log("hailu halo");	
					}

				}

				else{	
					console.log( "updatedTask == null")
					console.log(new Date().toLocaleTimeString());
					console.log("else");
					var date = new Date();
					var obj = {
						
						taskId: currentTask,
						log: [{
							startTime: new Date(),
						}]
					}
					
					console.log("obj ================>" , obj);
					console.log("obj.count" , obj);
					var timelog = new timeLogModel(obj);
					console.log("timelog ===================>" , timelog);
					timelog.save(function(err,savedTask){
						console.log("saved");
						res.send(savedTask);
					})
				}
			})
		}
	})

}
	// // taskModel.findOne({_id:req.params.id}).exec((err, taskFound)=>{
	// // 	if(err){
	// // 		res.status(500).send(err);
	// // 	}
	// // else if(taskFound){
	// // 		console.log('taskfound==========>',taskFound);
	// req.body = {
	// 	log: [{
	// 		startTime: Date.now()
	// 	}
	// 	]
	// }
	// var timeLogData = new timeLogModel(req.body);
	// timeLogData.save(function(err,timelog){
	// 	console.log("time log ====>" , timelog);
	// 	res.send(timelog);		
	// 	if(err){
	// 		console.log("shdfgshfyrtfyetgretghhhhhhbjh")
	// 		res.status(500).send(err);
	// 	}else if(timelog){
	// 		console.log('timelog',timelog);
	// 		var outerLen = timelog.log.length;
	// 		console.log("lengths",outerLen);
	// 		// if(new Date(timelog.log[outerLen-1].date).toDateString() == new Date().toDateString()){
	// 			// console.log(new Date().toDateString());
	// 			if(timelog.log[outerLen-1].endTime == null ){

	// 				timelog.endTime=Date.now();
	// 				console.log('timeLogController',timelog.endTime);

	// 				var difference = timelog.log[outerLen-1].endTime.getTime() - timelog.log[outerLen-1].startTime.getTime();

	// 				timelog.difference = difference;

	// 				timelog.save((errr,attends)=>{
	// 					if(errr){
	// 						console.log("jhfgdyduftrutfryug")
	// 						res.status(500).send(errr);
	// 					}else{
	// 						console.log("dhsfgd")
	// 						res.status(200).send(attends);
	// 					}

	// 				})
	// 			}else{
	// 				var data = {
	// 					log:[{startTime:Date.now(),endTime:null}]
	// 				}

	// 				var att = new timeLogModel(data);

	// 				att.save((error,attendance)=>{

	// 					if(error){
	// 						console.log("gsdfhsfg")
	// 						res.status(500).send(error);
	// 					}else{
	// 						console.log("res",attendance)
	// 						res.status(200).send(attendance);
	// 					}
	// 				})
	// 			}


	// 		}

	// 	})	


	module.exports = timeLogController;






