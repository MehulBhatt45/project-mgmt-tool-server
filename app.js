var createError = require('http-errors');
var fs = require('fs');

var http = require('http');
var https = require('https');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var cors = require('cors');

var async = require('async');
var crypto = require('crypto');
// var mv = require('move-file');

const SALT_WORK_FACTOR = 10;
var cron = require('node-cron');
var request = require('request');
var skipper = require('skipper')
//All Controller Router Variable deifne hear
var emailController = require('./controller/email.controller.js');
var userRouter = require('./routes/user');
var projectRouter = require('./routes/project');
var taskRouter = require('./routes/tasks');
var bugRouter = require('./routes/bug');
var issueRouter = require('./routes/issue');
var requeRouter = require('./routes/requirement');
var commentRouter = require('./routes/comment');
var employeeRouter = require('./routes/employee');
var leaveRouter = require('./routes/leave');
var notificationRouter = require('./routes/notification');
var sendNotificationRouter = require('./routes/sendNotification');
var noticeRouter = require('./routes/notice');


// var tasksRouter = require('./routes/tasks')
var timeLogRouter = require('./routes/timeLog');

var sprintRouter = require('./routes/sprint');

var pushNotification = require('./service/push-notification.service');
var attendenceRouter = require('./routes/attendence');




// https
// var privateKey = fs.readFileSync('/var/www/html/project_mgmt_tool/client/ssl/server.key', 'utf8');
// var certificate = fs.readFileSync('/var/www/html/project_mgmt_tool/client/ssl/server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};


var app = express();
// app.use(fileUpload());xc
app.set('superSecret', 'pmt');
// Define mongoose Component


mongoose.connect('mongodb://localhost:27017/projectMngtTool', {useNewUrlParser: true})


.then(() => console.log("Connected"))
.catch(err => console.log(err));

// view engine setup`
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// app.set('view engine', 'html');

app.use(session({
	secret: 'ssshhhhh',
	resave: true,
	saveUninitialized: true
}));

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(skipper());

//All Controller Router deifne hear
app.use('/project',projectRouter);
app.use('/tasks',taskRouter);
app.use('/bug',bugRouter);
app.use('/issue',issueRouter);
app.use('/reque',requeRouter);
app.use('/comment',commentRouter);
app.use('/user', userRouter); 
app.use('/employee',employeeRouter);
app.use('/notice',noticeRouter);
// app.use('/tasks' , tasksRouter);
app.use('/leave',leaveRouter);
app.post('/email/send-email', emailController.sendEmail);
app.use('/notification',notificationRouter);
app.use('/timeLog',timeLogRouter);

app.use('/sendNotification',sendNotificationRouter);

app.use('/sprint',sprintRouter);
app.use('/attendence',attendenceRouter);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
		return res.status(200).json({});
	}
	else{
		next();

	}
});
app.use(function(req, res, next) {
	next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
res.status(err.status || 500);
res.render('error');
});


cron.schedule('0 0 * * *', () => {
	console.log('running a task every minute');
	request('http://localhost:4001/notice/updatenotice',function (error, response, body) {
 console.log('error:', error); // Print the error if one occurred
 console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
 console.log('body:', body); // Print the HTML for the Google homepage.
});

});

//API Calling for all User to notify

request('http://localhost:4001/notification/allUsers',function (error, response, body) {
 console.log('error:', error); // Print the error if one occurred
 console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
});


// var secureServer = https.createServer(credentials, app);
// var secureServer = http.createServer(app);
// secureServer.listen(4000);
// secureServer.on('error',function(err){
// console.error('Error starting the server = ',err);
// });
// secureServer.on('listening', function(){
// console.log("Secure Server listening 443")
// });

// app.list`en(4000);

//pushnotification calling



module.exports = app;
