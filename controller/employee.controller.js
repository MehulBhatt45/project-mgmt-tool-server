var employeeModel = require("../model/employee.model");
// var fileUpload = require('express-fileupload');
let employeeController = {};


employeeController.addEmployee = function(req,res){
	var emp = new employeeModel(req.body);
	// var sampleFile = req.files.file;
	emp.save(function(err,emp){
		if(err){
			res.status(500).send(err);
		}
		// sampleFile(sampleFile.name);
		res.status(200).send(emp);
	})

}

employeeController.updateEmployee = function(req,res){

	employeeModel.findByIdAndUpdate({_id:req.params.id},{$set:req.body},function(err,emp){
		if(err){
			res.status(500).send(err);
		}
		res.status(200).send(emp);

	})
}

employeeController.getEmployee = function(req,res){
	employeeModel.find({},function(err,emp){
		if(err){
			res.status(500).send(err);
		}
		res.status(200).send(emp);
	})
}

employeeController.getEmployeeById = function(req,res){
	employeeModel.findOne({_id:req.params.id},function(err,emp){
		if(err){
			res.status(500).send(err);
		}
		res.status(200).send(emp);
	})
}

employeeController.deleteEmployeeById = function(req,res){
	var developerid = req.params.developerid;
	console.log("id-----()",developerid);
	employeeModel.findOneAndDelete({_id:developerid},function(err,emp){
		if(err){
			res.status(500).send(err);
		}
		res.status(200).send(emp);
		
	})
}



module.exports = employeeController; 
