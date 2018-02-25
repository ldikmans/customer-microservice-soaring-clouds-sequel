
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var profile = require('./app/profile');
var upTime;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/customerdb'); // connect to our database

var router = express.Router();

router.use(function (req, res, next) {
    console.log('request: ' + req.baseUrl);
    next(); 
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/customer)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});


router.get('/health', function (req, res) {
    res.json({
        "version": 0.1,
        "status": "OK",
        "uptime": upTime
     });
});

router.post('/profile', function (req, res) {
    profile.signup(req, res);
});

router.put('/profile/:_id', function (req, res) {
    profile.updateProfile(req,res);
});

router.post('/signin', function (req, res) {
    profile.signin(req,res);
});

// all of our routes will be prefixed with /customer
app.use('/customer', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
upTime = new Date();


