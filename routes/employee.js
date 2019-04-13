var express = require('express');
var router = express.Router();
var employeeController = require('./../controller/employee.controller');

router.post('/addEmp',employeeController.addEmployee);
router.get('/getEmp',employeeController.getEmployee);
router.get('/getEmpById',employeeController.getEmployeeById);
router.put('/updateEmp',employeeController.updateEmployee);
router.delete('/deleteEmp/:developerid',employeeController.deleteEmployeeById);

module.exports = router;