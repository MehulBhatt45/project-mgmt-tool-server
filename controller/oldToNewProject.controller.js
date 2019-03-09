var userModel = require('../model/user.model');
var taskModel = require('../model/task.model');
var bugModel = require('../model/bug.model');
var projectModel = require('../model/project.model');
var issueModel = require('../model/issue.model');
var tasksModel = require('../model/tasks.model');
var _ = require('lodash');
var allTask = []

let oldToNewProject = {};

oldToNewProject.convertProjects = function(req , res){
	var p = 0;
	var q = 0;
	oldProject_id = [];
	newProject_id = [];
	projectModel.find({})
	.exec((err , foundProjects)=>{
		console.log("Found Projects ====>" , foundProjects[0]._id);
		for(var i = 0 ; i< foundProjects.length; i++){
			console.log("first i ==========>" , i);
			var newProject = {};
			newProject['title'] = foundProjects[i].title;
			newProject['desc'] = foundProjects[i].desc;
			newProject['pmanagerId'] = foundProjects[i].pmanagerId;
			newProject['tasks'] = [];
			newProject['Teams'] = [];
			newProject['Status'] = foundProjects[i].Status;
			newProject['uniqueId'] = foundProjects[i].uniqueId;
			//console.log("new projects ===>" , newProject);
			for(var j = 0; j<foundProjects[i].taskId.length; j++ ){
				newProject['tasks'].push(foundProjects[i].taskId[j]);
			}
			for(var j = 0; j<foundProjects[i].IssueId.length; j++){
				newProject['tasks'].push(foundProjects[i].IssueId[j]);
			}
			for(var j = 0; j<foundProjects[i].BugId.length; j++){
				newProject['tasks'].push(foundProjects[i].BugId[j]);
			}
			for(var j = 0; j<foundProjects[i].Teams.length; j++){
				newProject['Teams'].push(foundProjects[i].Teams[j]);	
			}
			console.log("new out=========>" , newProject_id);
			console.log("foundProjects[i]._id" , " i======>",i , foundProjects[i]._id);
				//oldProject_id.push(foundProjects[i]._id);
				projectModel.findOneAndUpdate({_id: foundProjects[i]._id} , newProject , {upsert: true , new: true} , function(err , savedProject){
					res.status(200).send(savedProject);
				})
			}
		})
}

oldToNewProject.getAllIssues = function(req , res){
	var count = 1;
	var pid = req.params.pid;
	console.log("pid ==>" , pid);
	issueModel.find({projectId: pid})
	.lean()	
	.exec((err , foundIssue)=>{
		console.log("all isuue=============>" , foundIssue);
		for(var i = 0; i< foundIssue.length; i++){
			var type = foundIssue[i].uniqueId.split("-");
		//	console.log("type ====>" , type[0]);
			foundIssue[i].projectId = foundIssue[i].projectId._id; 
			foundIssue[i]['type'] = type[0];
			foundIssue[i].uniqueId = "pmt-" + +count;
			allTask.push(foundIssue[i]);
			count++;
		}

		//console.log("all isuue=============>" , foundIssue);
		//console.log("all task ====================>" , allTask.length);	
		//count =  allTask.length;
		//console.log("fter run ====>" , count);
		bugModel.find({projectId: pid})
		.lean()
		.exec((err , foundBugs)=>{
			bugCount = count;
			console.log("BUGCOUNT ========>", bugCount);
			for(var b = 0; b<foundBugs.length; b++){
				foundBugs[b].projectId = foundBugs[b].projectId._id;
				var type = foundBugs[b].uniqueId.split("-");
				console.log("type of bug ========>" , type);
				foundBugs[b]['type'] = type[0]
				console.log("foundBugs[b]['type'] =====>" ,foundBugs[b]['type'] );
				foundBugs[b].uniqueId = "pmt-" + +bugCount;
				//console.log("fond bugs =====>" , )
				allTask.push(foundBugs[b]);
				bugCount++;
			}
			//console.log("all task ====================>" , allTask.length);
			//console.log("allcount ====================>" , bugCount);
			taskModel.find({projectId: pid})
			.lean()
			.exec((err , foundTask)=>{
				taskCount = bugCount;
				for(var t = 0; t<foundTask.length; t++){
					foundTask[t].projectId = foundTask[t].projectId._id;
					var type = foundTask[t].uniqueId.split("-");
					foundTask[t]['type'] = type[0]
					foundTask[t].uniqueId = "pmt-" + +taskCount;
				//console.log("fond tugs =====>" , )
				allTask.push(foundTask[t]);
				taskCount++;
				}
				console.log("all task after task ====================>" , allTask.length);
				//tattoo = new tasksModel(allTask);
				tasksModel.insertMany(allTask);
			})	
		})
	})
}

oldToNewProject.updateAllUser = function(req , res){
	var newUser;
	userArr = [];
	userModel.find({})
	.lean()
	.exec((err , foundUsers)=>{
		//if(err) res.send("err");
			_.forEach(foundUsers, (user)=>{
				tasksModel
				.find({assignTo: user._id})
				.select('_id')
				.exec((err, resp)=>{
					if (err) { resp.status(500).send(err) }
					console.log("=========================>", [...resp]);
					user.tasks = [];
					for(var j=0; j<[...resp].length;j++){
						user.tasks.push([...resp][j]._id);
					}
					userModel.findOneAndUpdate({_id:user._id}, user, {new:true, upsert:true}, function(err, update){
						if (err) {
							res.send(err);
						}
						console.log("done");
					})
				})
			})

		//}
	})
}



module.exports = oldToNewProject;