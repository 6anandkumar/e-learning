const express = require('express')
const bodyParser = require('body-parser')
var session = require('express-session');
const app = express()
const PORT = process.env.port || 3000
app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

//using pug template engine
app.set('view engine','pug')
app.set('views','./views')

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// include routes
var routes = require('./routes/index');
app.use('/', routes);

//app.locals.studentData = require('./data/student.json')

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(PORT)