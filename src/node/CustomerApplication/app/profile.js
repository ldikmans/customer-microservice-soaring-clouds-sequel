var Customer = require('./app/models/customer');

exports.signup = function(req, res){
  var newCustomer  = new Customer();
  
  newCustomer.getCustomerData(req.body);
        // save the bear and check for errors
  newCustomer.save(function(err) {
    if (err){
        console.error("error saving new customer to database: " + err);
        res.send(err);
    }
    res.json({
        "message": "your account has been created, please check your email for account verification"}
  );});
};

function getCustomerData(body){
    if(body.firstName){
        this.firstName = body.firstName;
    }
    if(body.lastName){
        this.lastName = body.lastName;
    }
    if(body.title){
        this.title = body.title;
    }
    if(body.email){
        this.email = body.email;
    }
    if(body.dateOfBirth){
        this.dateOfBirth = body.dateOfBirth;
    }
    if(body.phoneNumber){
        for(i = 0; i < body.phoneNumber.length; i++){
            if(body.phoneNumber[i]){
                if(body.phoneNumber[i].type){
                    this.phoneNumber[i].type = body.phoneNumber[i].type;
                }
                if(body.phoneNumber[i].countryCode){
                    this.phoneNumber[i].countryCode = body.phoneNumber[i].countryCode;
                }
                if(body.phoneNumber[i].number){
                    this.phoneNumber[i].number = body.phoneNumber[i].number;
                }
            }
        }
    };
    if(body.address){
       for(i = 0; i < body.address.length; i++){
            if(body.address[i]){
                if(body.address[i].type){
                    this.address[i].type = body.address[i].type;
                }
                if(body.address[i].streetName){
                    this.address[i].streetName = body.address[i].streetName;
                }
                if(body.address[i].streetNumber){
                    this.address[i].streetNumber = body.address[i].streetNumber;
                }
                if(body.address[i].city){
                    this.address[i].city = body.address[i].city;
                }
                if(body.address[i].postcode){
                    this.address[i].postcode = body.address[i].postcode;
                }
                if(body.address[i].country){
                    this.address[i].country = body.address[i].country;
                }
            }
       }
    }
    if(body.paymentDetails){
        if(body.paymentDetails.type){
            this.paymentDetails.type = body.paymentDetails.type;
        }
        if(body.paymentDetails.cardNumber){
            this.paymentDetails.cardNumber = body.paymentDetails.cardNumber;
        }
        if(body.paymentDetails.expirationDate){
            this.paymentDetails.expirationDate = body.paymentDetails.expirationDate;
        }
        if(body.paymentDetails.nameOnCard){
            this.paymentDetails.nameOnCard = body.paymentDetails.nameOnCard;
        }
    };
    
    if(body.preferences){
        if(body.preferences.newsLetter){
            this.preferences.newsLetter = body.preferences.newsLetter;
        }
        else{
            this.preferences.newsLetter = false;
        }
        if(body.preferences.offers){
            this.preferences.offers = body.preferences.offers;
        }
        else{
            this.preferences.offers = false;
        }
    }
};