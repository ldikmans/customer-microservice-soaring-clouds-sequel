
const express = require('express');
const cors = require('cors'); 
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const profile = require('./app/profile');
const producer = require('./app/producer');
const port = process.env.PORT || 8080;
const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDB = process.env.MONGO_DB || 'customerdb';


var upTime;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var dbURL = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDB;
console.log('dbURL: ' + dbURL)

mongoose.connect(dbURL, function(error){
    console.error("error while connecting to database", error);
}); 

producer.initKafkaAvro();

var router = express.Router();

app.use(cors());
app.options('*', cors()); // include before other routes

app.configure(function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


router.use(function (req, res, next) {
    console.log('request: ' + req.baseUrl);
    next();
});

// test route to make sure everything is working (accessed at GET http://{host}:{port}/customer)
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

        .get(function(req, res){
            profile.getCustomer(req, res);
        })
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
