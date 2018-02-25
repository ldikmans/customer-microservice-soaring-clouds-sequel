
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var upTime;
var Customer = require('./app/models/customer');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database


var router = express.Router();

router.use(function (req, res, next) {
    console.log('call to the server');
    next(); // make sure we go to the next routes and don't stop here
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
    res.json({
        "message": "your account has been created, please check your email for account verification"
    });
});

router.put('/profile/:_id', function (req, res) {
    res.status(204).send();
});

router.post('/signin', function (req, res) {
    res.status(204).send();
});

// all of our routes will be prefixed with /customer
app.use('/customer', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
upTime = new Date();


