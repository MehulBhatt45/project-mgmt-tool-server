var createError = require('http-errors');
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
var taskRouter = require('./routes/task');
var bugRouter = require('./routes/bug');
var issueRouter = require('./routes/issue');
var requeRouter = require('./routes/requirement');
var commentRouter = require('./routes/comment');
var employeeRouter = require('./routes/employee');

var noticeRouter = require('./routes/notice');
var tasksRouter = require('./routes/tasks');
var app = express();
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
app.use('/task',taskRouter);
app.use('/bug',bugRouter);
app.use('/issue',issueRouter);
app.use('/reque',requeRouter);
app.use('/comment',commentRouter);
app.use('/user', userRouter); 
app.use('/employee',employeeRouter);

app.use('/notice',noticeRouter);

app.use('/tasks' , tasksRouter);
app.post('/email/send-email', emailController.sendEmail);

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
	request('http://localhost:4000/notice/updatenotice',function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});

});


//app.listen(4000);


module.exports = app;
