var Customer = require('./models/customer');

exports.signup = function (req, res) {
    
    var newCustomer = new Customer(mapCustomerData(req.body));
    
    console.log("newCustomer = " + JSON.stringify(newCustomer));
    // save the bear and check for errors
    newCustomer.save(function (err) {
        if (err) {
            console.error("error saving new customer to database: " + err);
            res.send(err);
        }
        else{
            res.json({"message": "your account has been created, please check your email for account verification"});
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
    if (body.dateOfBirth) {
        customer.dateOfBirth = body.dateOfBirth;
    }
  
    if (body.phoneNumber) {
        var phoneNumbers = [];
        var phoneNumber = {};
        for (i = 0; i < body.phoneNumber.length; i++) {
            if (body.phoneNumber[i]) {
                if (body.phoneNumber[i].type) {
                    phoneNumber.type = body.phoneNumber[i].type;
                }
                if (body.phoneNumber[i].countryCode) {
                    phoneNumber.countryCode = body.phoneNumber[i].countryCode;
                }
                if (body.phoneNumber[i].number) {
                    phoneNumber.number = body.phoneNumber[i].number;
                }
                phoneNumbers.push(phoneNumber);
            }
            phoneNumber = {};
        }
        if (phoneNumbers.length > 0) {
            customer.phoneNumbers = phoneNumbers;
        }
    }
    ;

    if (body.address) {
        var addresses = [];
        var address = {};
        for (i = 0; i < body.address.length; i++) {
            if (body.address[i]) {
                if (body.address[i].type) {
                    address.type = body.address[i].type;
                }
                if (body.address[i].streetName) {
                    address.streetName = body.address[i].streetName;
                }
                if (body.address[i].streetNumber) {
                    address.streetNumber = body.address[i].streetNumber;
                }
                if (body.address[i].city) {
                    address.city = body.address[i].city;
                }
                if (body.address[i].postcode) {
                    address.postcode = body.address[i].postcode;
                }
                if (body.address[i].country) {
                    address.country = body.address[i].country;
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

                if (body.paymentDetails.type) {
                    paymentDetail.type = body.paymentDetails.type;
                }
                if (body.paymentDetails.cardNumber) {
                    paymentDetail.cardNumber = body.paymentDetails.cardNumber;
                }
                if (body.paymentDetails.expirationDate) {
                    paymentDetail.expirationDate = body.paymentDetails.expirationDate;
                }
                if (body.paymentDetails.nameOnCard) {
                    paymentDetail.nameOnCard = body.paymentDetails.nameOnCard;
                }
                paymentDetails.push(paymentDetail);
                paymentDetail = {};
            }
        }
        if (paymentDetails.length > 0) {
            paymentDetails.push(paymentDetail);
        }
        customer.paymentDetails = paymentDetails;
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
    console.log ("customer: " + JSON.stringify(customer));
    return customer;
}
;