
const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const profile = require('./app/profile');
const producer = require('./app/producer');
const logger = require('./app/logger');

const port = process.env.PORT || 8080;
const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDB = process.env.MONGO_DB || 'customerdb';

const app = express();
var upTime;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var dbURL = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoDB;
logger.debug('dbURL: ' + dbURL);

mongoose.connect(dbURL);

producer.initKafkaAvro();

var router = express.Router();

app.use(cors());
app.options('*', cors()); // include before other routes

router.use(function (req, res, next) {
    logger.debug('request: ' + req.baseUrl);
    next();
});

// test route to make sure everything is working (accessed at GET http://{host}:{port}/customer)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});


router.get('/health', function (req, res) {
    res.json({
        "version": "2.0.1",
        "status": "OK",
        "uptime": upTime
    });
});

app.route('/customer/profile/:_id')

        .get(function(req, res){
            logger.debug("getting profile details");
            profile.getCustomer(req, res);
        })
        .put(function (req, res) {
            logger.debug("updating profile details");
            profile.updateProfile(req, res);
        })
        .delete(function (req, res) {
            logger.debug("deleting customer profile");
            profile.deleteCustomer(req, res);
        });

app.route('/customer/profile')

        .get(function (req, res) {
            logger.debug("fetching customers");
            profile.getCustomers(req, res);
        })

        .post(function (req, res) {
            logger.debug("signup");
            profile.signup(req, res);
        });



router.post('/signin', function (req, res) {
    logger.debug("signing in");
    profile.signin(req, res);
});

// all of our routes will be prefixed with /customer
app.use('/customer', router);

// START THE SERVER
// =============================================================================
app.listen(port);
logger.info('Magic happens on port ' + port);
upTime = new Date();
