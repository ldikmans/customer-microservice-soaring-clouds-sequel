const Customer = require('./models/customer');
const bcrypt = require('bcrypt');
const publisher = require('./producer');
const logger = require('./logger');
var publish = process.env.PUBLISH || false;


exports.getCustomers = function (req, res) {
    var query = {};
    if (req.query.username || req.query.email){
        query = {email: req.query.username};
    }
    Customer.find(query, function (error, customers) {
        if (error) {
            logger.error("error finding users " +  err);
            res.status(500).send();
        } else if (!customers) {
            var err = new Error('No Customers found');
            logger.error(err);
            res.status(500).send(err);
        } else {
            logger.debug("returning " + customers.length + " customers");
            res.status(200).send(customers);
        }
    });
};

exports.getCustomer = function(req, res){
    var id = req.params._id;
    logger.debug("fetching profile data for customer with id: " + id);

    Customer.findById(id, function (err, customer) {
        if (err) {
            logger.error('error finding the customer: ' + err);
            res.status(500).send(err);
        }
        else if(!customer || !customer._id){
            var err = "Customer with id " + id + " not found";
            logger.error (err);
            res.status(404).send();
        } else  {
            logger.debug("sending customer with id " + id);
            res.status(200).send(customer);
        }
    });
};

exports.deleteCustomer = function (req, res) {
    var id = req.params._id;

    Customer.findOneAndRemove({_id: id}, function (err) {
        if (err) {
            logger.error('error deleting the customer' + err);
            res.status(500).send(err);
        } else {
            logger.debug('customer deleted');
            res.status(204).send();
        }
    });
};

exports.signup = function (req, res) {

    var newCustomer = new Customer(mapCustomerData(req.body));

    newCustomer.save(function (err, newCustomer) {
        if (err) {
            logger.error("error saving new customer to database: " + err);
            res.status(422).send(err);
        } else {
            if(publish){
                logger.debug("publishing customer: " + JSON.stringify(newCustomer));
                publisher.publishCustomerEvent(newCustomer);
            }
            res.json({"message": "your account has been created, please check your email for account verification"});
        }
    });
};

exports.signin = function (req, res) {

    var username = req.body.username;
    logger.debug('signing in with username:' + username);
    Customer.findOne({email: username}, function (error, customer) {
        if (error) {
            logger.error("error looking up user: " + err);
            res.status(401).send();
        } else if (!customer) {
            var err = new Error('Customer not found');
            logger.error(err);
            res.status(401).send("username or password incorrect");
        } else {
            bcrypt.compare(req.body.password, customer.password, function (err, result) {
                if (err) {
                    logger.error(err);
                    res.status(500).send("internal server error");
                } else if (result === false) {
                    logger.error("password incorrect");
                    res.status(403).send("username or password incorrect");
                }
                if (result === true) {
                    var user = {
                        'username': customer.email,
                        'firstName': customer.firstName,
                        'lastName': customer.lastName,
                        '_id:': customer._id
                    };
                    if(publish){
                      logger.debug('calling producer with user ' + JSON.stringify(user));
                      publisher.publishSignInEvent(user);
                    }
                    logger.debug('sending customer with id ' + customer._id);
                    res.status(200).send(customer);
                }
            });
        }
    });
};

exports.updateProfile = function (req, res) {
    Customer.findByIdAndUpdate(req.params._id, mapCustomerData(req.body), {new:true}, function (err, doc) {
        if (err) {
            logger.error("error updating customer profile:" + err);
            res.status(422).send(err);
        } else if (!doc || !doc._id){
            logger.error("customer with id " + req.params._id + " not found");
            res.status(404).send();
        }else{
           if(publish){
                logger.debug('calling producer with user: ' + JSON.stringify(doc));
                publisher.publishCustomerEvent(doc);
            }
            logger.debug('updated customer: ' + doc);
            res.status(200).send(doc);
        }
    });
};

function mapCustomerData(body) {
    var customer = {};
    if (body.firstName) {
        customer.firstName = body.firstName;
    }
    if (body.lastName) {
        customer.lastName = body.lastName;
    }
    if (body.title) {
        customer.title = body.title;
    }
    if (body.email) {
        customer.email = body.email;
    }
    //it is not allowed to make the password empty
    if (body.password && body.password.length > 0 ) {
        customer.password = body.password;
    }
    if (body.dateOfBirth) {
        customer.dateOfBirth = body.dateOfBirth;
    }
    if (body._id){
        customer._id = body._id;
    }

    if (body.phoneNumbers) {
        var phoneNumbers = [];
        var phoneNumber = {};
        for (i = 0; i < body.phoneNumbers.length; i++) {
            if (body.phoneNumbers[i]) {
                if (body.phoneNumbers[i].type) {
                    phoneNumber.type = body.phoneNumbers[i].type;
                }
                if (body.phoneNumbers[i].countryCode) {
                    phoneNumber.countryCode = body.phoneNumbers[i].countryCode;
                }
                if (body.phoneNumbers[i].number) {
                    phoneNumber.number = body.phoneNumbers[i].number;
                }
                phoneNumbers.push(phoneNumber);
                phoneNumber = {};
            }
        }
        if (phoneNumbers.length > 0) {
            customer.phoneNumbers = phoneNumbers;
        }
    }
    ;

    if (body.addresses) {
        var addresses = [];
        var address = {};
        for (i = 0; i < body.addresses.length; i++) {
            if (body.addresses[i]) {
                if (body.addresses[i].type) {
                    address.type = body.addresses[i].type;
                }
                if (body.addresses[i].streetName) {
                    address.streetName = body.addresses[i].streetName;
                }
                if (body.addresses[i].streetNumber) {
                    address.streetNumber = body.addresses[i].streetNumber;
                }
                if (body.addresses[i].city) {
                    address.city = body.addresses[i].city;
                }
                if (body.addresses[i].postcode) {
                    address.postcode = body.addresses[i].postcode;
                }
                if (body.addresses[i].country) {
                    address.country = body.addresses[i].country;
                }
                addresses.push(address);
                address = {};
            }
        }
        if (addresses.length > 0) {
            customer.addresses = addresses;
        }
    }
    if (body.paymentDetails) {
        var paymentDetails = [];
        var paymentDetail = {};
        for (i = 0; i < body.paymentDetails.length; i++) {
            if (body.paymentDetails[i]) {

                if (body.paymentDetails[i].type) {
                    paymentDetail.type = body.paymentDetails[i].type;
                }
                if (body.paymentDetails[i].cardNumber) {
                    paymentDetail.cardNumber = body.paymentDetails[i].cardNumber;
                }
                if (body.paymentDetails[i].expirationDate) {
                    paymentDetail.expirationDate = body.paymentDetails[i].expirationDate;
                }
                if(body.paymentDetails[i].preferred){
                    paymentDetail.preferred = body.paymentDetails[i].preferred;
                }
                if (body.paymentDetails[i].nameOnCard) {
                    paymentDetail.nameOnCard = body.paymentDetails[i].nameOnCard;
                }
                paymentDetails.push(paymentDetail);
                paymentDetail = {};
            }
        }
        if (paymentDetails.length > 0) {
            customer.paymentDetails = paymentDetails;
        }
    }
    ;

    if (body.preferences) {
        preferences = {};
        if (body.preferences.newsLetter) {
            preferences.newsLetter = body.preferences.newsLetter;
        } else {
            preferences.newsLetter = false;
        }
        if (body.preferences.offers) {
            preferences.offers = body.preferences.offers;
        } else {
            preferences.offers = false;
        }
        customer.preferences = preferences;
    }
    return customer;
}
;