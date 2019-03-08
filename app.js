var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var cors = require('cors');
const SALT_WORK_FACTOR = 10;

//All Controller Router Variable deifne hear

var userRouter = require('./routes/user');
var projectRouter = require('./routes/project');
var taskRouter = require('./routes/task');
var bugRouter = require('./routes/bug');
var issueRouter = require('./routes/issue');
var requeRouter = require('./routes/requirement');
var commentRouter = require('./routes/comment');

var app = express();
app.use(fileUpload());
app.set('superSecret', 'pmt');
// Define mongoose Component
mongoose.connect('mongodb://localhost:/projectMngtTool', {useNewUrlParser: true})
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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('skipper')());

//All Controller Router deifne hear
app.use('/project',projectRouter);
app.use('/task',taskRouter);
app.use('/bug',bugRouter);
app.use('/issue',issueRouter);
app.use('/reque',requeRouter);
app.use('/comment',commentRouter);
app.use('/user', userRouter);


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


 //app.listen(4000);

module.exports = app;
