var express = require("express");
    path = require("path"),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    mqttBroker = require('./mqtt/mqttBroker'),
    config = require('./config');

mongoose.Promise = global.Promise;
// Connect to mongodb
mongoose.connect(config.mongodb, function(err) {
    if (err) throw err;
    console.log("Successfully connected to mongodb");
});

// Start app
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

// Registering middlewares to the app
app.use(favicon(path.join(__dirname, "public/images/favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// We use memory to store session info
app.use(session({
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 60 * 1000 },
  saveUninitialized: true,
  resave: true,
}));


// Register routes
app.use(require('./routes/led'));
app.use(require('./routes/air'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err
  });
});


module.exports = app;
