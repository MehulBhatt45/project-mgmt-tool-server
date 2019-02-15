var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


//All Controller Router Variable deifne hear

var usersRouter = require('./routes/users');
var projectRouter = require('./routes/project');
var taskRouter = require('./routes/task');
var bugRouter = require('./routes/bug');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//All Controller Router deifne hear
app.use('/users', usersRouter);
app.use('/project',projectRouter);
app.use('/task',taskRouter);
app.use('/bug',bugRouter);


// catch 404 and forward to error handler
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

// Define mongoose Component
mongoose.connect('mongodb://localhost:27017/projectMngtTool', {useNewUrlParser: true})
.then(() => console.log("Connected"))
.catch(err => console.log(err));

app.listen(4000);

module.exports = app;
