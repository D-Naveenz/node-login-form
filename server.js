// Load .env file
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
// console.log(process.env)

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import { users } from './db.js';

import initPassport from './passport-config.js';
// import indexRouter from './routes/index.js';
import registerRouter from './routes/register.js';

const app = express();
initPassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id),
);

// view engine setup
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', express.static('public'));
app.use('/', express.static('node_modules/bootstrap/dist/'));
app.use('/', express.static('node_modules/font-awesome/'));

// app.use('/', indexRouter);
app.use('/reg', registerRouter);

/* GET home page. */
app.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index', { title: 'NodeGuru', name: req.user.name });
});

/* GET login page. */
app.get('/login', (req, res, next) => {
  res.render('login', { title: 'NodeGuru'})
})

/* POST login page. */
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

app.listen(3000);
