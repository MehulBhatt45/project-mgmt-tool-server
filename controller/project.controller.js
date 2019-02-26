var projectModel = require('../model/project.model');
let projectController = {};

projectController.addProject = function(req,res){
	projectModel
	.find({})
	.sort({"_id" : -1})
	.limit(1)
	.exec((err, project)=>{
		if (err) {
			console.log(err);
			res.status(500).send(err);
		}else if(project && project.length==1){
			var maxUniqeId = project[0].uniqueId;
			var length = maxUniqeId.length;
			var trimmedString = maxUniqeId.substring(8, length);
			var number = parseInt(trimmedString)+1;
			var text = "PROJECT"
			var unique = text+"-"+number;
			var project = new projectModel(req.body);
			project['uniqueId'] = unique;
			project.save().then(result => {
				res.status(200).json(result);
			})
			.catch(err => console.log(err));
		}else{
			var project = new projectModel(req.body);
			var text = "PROJECT"
			var unique = text+"-"+1;
			project['uniqueId'] = unique;
			project.save().then(result => {
				res.status(200).json(result);
			})
			.catch(err => console.log(err));
		}
	})


}

projectController.getAllProject = function(req,res){

	projectModel.find({}).populate('Teams').exec(function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console 2",projects);
	})

}

projectController.getProjectById = function(req,res){

	var projectId = req.params.projectId;
	projectModel
	.findOne({_id:projectId})
	.populate('pmanagerId taskId IssueId BugId Teams')
	.populate({
    	path: 'taskId IssueId BugId',
    	populate: { path: 'assignTo' }
  	})
	.exec(function(err,projects){
		if (err) {
			res.status(500).send(err);
		}else if(projects){
			res.status(200).send(projects);
		}else{
			res.status(404).send("NOT FOUND");
		}
	})

}

projectController.deleteProjectById = function(req,res){

	var projectId = req.params.projectId;
	projectModel.findOneAndDelete({_id:projectId}).exec(function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console 4",projects);
	})

}

projectController.updateProjectById = function(req,res){

	var projectId = req.params.projectId;

	projectModel.findOneAndUpdate({_id:projectId},{$set:req.body},{upsert:true},function(err,projects){
		console.log("err==========>>>",err);
		res.status(200).send(projects);
		console.log("saved console 5",projects);
	})

}

projectController.getAllProjectOrderByTitle = function(req,res){
	projectModel.find({})
	.sort({'title': -1})
	.exec(function(err,project){
		console.log("err==========>>>",err);
		res.send(project);
		console.log(project);
	})

}


module.exports = projectController;