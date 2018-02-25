var Customer = require('./models/customer');

exports.signup = function (req, res) {
    
    var newCustomer = new Customer(mapCustomerData(req.body));
    
    newCustomer.save(function (err) {
        if (err) {
            console.error("error saving new customer to database: " + err);
            res.status(422).send(err);
        }
        else{
            res.json({"message": "your account has been created, please check your email for account verification"});
        }
    });
};

exports.signin = function (req, res){
    
};

exports.updateProfile = function(req, res){
    Customer.findByIdAndUpdate(req.params._id, mapCustomerData(req.body),function(err, doc){
        if(err){
            console.error("error updating customer profile:" + err);
            res.status(422).send(err);
        }
        else{
           res.status(204).send(doc);
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
    if (body.password){
        customer.password = body.password;
    }
    if (body.dateOfBirth) {
        customer.dateOfBirth = body.dateOfBirth;
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
    };

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