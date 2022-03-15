var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var genreRouter = require('./routes/genre');
var adminRouter = require('./routes/admin');


const fileUpload = require('express-fileupload');
var session = require('express-session')
var sessionAuth = require("./middlewares/sessionAuth");


var app = express();
app.use(
  session({
    secret: "keyboard cat",
    cookie: { maxAge: 6000000 },
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(sessionAuth);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({useTempFiles: true}));


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/genre', genreRouter);
app.use('/admin', adminRouter);


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

mongoose
  .connect("mongodb://localhost/FYP", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error Occurred");
    console.log(err);
  });

module.exports = app;
