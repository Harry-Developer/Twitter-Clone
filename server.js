// server.js
var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session')
var tweet = require('./models/tweet');
var login = require('./models/login');
var profile = require('./models/profile')
var app = express();
var port = 3000;

var sess = {
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}

app.use(session(sess))
   
app.use(function(req, res, next) {
    res.locals.loggedin = req.session.loggedin
    res.locals.username = req.session.username
    res.locals.user_id =  req.session.user_id
    next();
})

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());
// use res.render to load up an ejs view file

app.get('/', tweet.getTweets)
app.post('/process-tweet', tweet.sendTweet)
app.get('/delete/:id', tweet.deleteTweet)
app.post('/login', login.login)
app.post('/register', login.register)
app.get('/logout', login.logout)
app.get('/account', tweet.getUserTweets)
app.post('/change-password', login.changePassword)
app.get('/delete-account', login.deleteAccount)
app.get('/profile/:profileName', profile.getInfo)
app.post('/search-user', profile.search)
app.get('/follow-user/:username', profile.followUser)


app.listen(port)
console.log(port + ' is the magic port');