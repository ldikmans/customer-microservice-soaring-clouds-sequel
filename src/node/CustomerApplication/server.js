
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var profile = require('./app/profile');
var producer = require('./app/producer');

var upTime;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost:27017/customerdb'); // connect to our database

producer.initKafkaAvro();

var router = express.Router();

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
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


app.route('/customer/profile')

        .get(function (req, res) {
            profile.getCustomers(req, res);
        })

        .post(function (req, res) {
            profile.signup(req, res);
        });


app.route('/customer/profile/:_id')

        .put(function (req, res) {
            profile.updateProfile(req, res);
        })
        .delete(function (req, res) {
            profile.deleteCustomer(req, res);
        });

router.post('/signin', function (req, res) {
    profile.signin(req, res);
});

// all of our routes will be prefixed with /customer
app.use('/customer', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
upTime = new Date();


