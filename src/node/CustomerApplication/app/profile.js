var Customer = require('./app/models/customer');

exports.signup = function(req, res){
  var newCustomer  = new Customer();
  
  newCustomer.getCustomerData(req.body);
        // save the bear and check for errors
  newCustomer.save(function(err) {
    if (err){
        res.send(err);
    }
    res.json({
        "message": "your account has been created, please check your email for account verification"}
  );});
};

function getCustomerData(body){
    this.firstName = body.firstName;
    this.lastName = body.lastName;
};

