const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;

const categoryRouter = require('./routes/category');
const dishRouter = require('./routes/dish');
const ingredientsRouter = require('./routes/ingredients');
const stockRouter = require('./routes/stock');
const cookedDishSummaryRouter = require('./routes/cookedDishSummary');
const authRouter = require('./routes/auth');
const navRouter = require('./routes/nav');
const cookRouter = require('./routes/cook');

const auth_params = require('./custom_model/auth_params');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/category', categoryRouter);
app.use('/dish', dishRouter);
app.use('/ingredient', ingredientsRouter);
app.use('/stock', stockRouter);
app.use('/cookedDish', cookedDishSummaryRouter);
app.use('/auth', authRouter);
app.use('/cook', cookRouter);
app.use('/nav', navRouter);

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

const passportOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: auth_params.SECRET
};

app.use(passport.initialize());
app.use(passport.session());

passport.use(new JwtStrategy(passportOpts, (jwtPayload, done) => {
  const expirationDate = new Date(jwtPayload.exp * 1000);
  if(expirationDate < new Date()){
    return done(null, false);
  }
  done(null, jwtPayload);
}));

module.exports = app;
