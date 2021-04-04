var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const flash = require('connect-flash');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
require('dotenv').config()

const mongoose = require('mongoose')
// SESSION
const session = require('express-session')



app.use(
	session({
	  secret: 'keyboard cat',
	  resave: false,
		saveUninitialized: false,
	  cookie:{maxAge: 3600000}
	})
)
// PASSPORT
const passport = require('passport');
const { ensureAuth } = require('./middleware/auth');
require('./config/passport')(passport)

// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());


app.use('/auth', authRouter);

app.use(ensureAuth)
app.use('/', indexRouter);
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


//CONNECT DATABASE: MONGO ATLAS
mongoose.connect(process.env.DB_CONNECTION,
	{
		useNewUrlParser:true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch(err => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});

module.exports = app;
