const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const logger = require('../logger');

const SALTROUNDS = 10;

var PhoneNumberSchema = new Schema({
    type: {type: String, required: true},
    countryCode: {type: Number, required: true},
    number: {type: Number, requred: true}
});

var AddressSchema = new Schema({
    type: {type: String, required: true},
    streetName: {type: String, required: true},
    streetNumber: {type: String, required: true},
    city: {type: String, required: true},
    postcode: {type: String, required: true},
    country: {type: String, required: true}
});

var PaymentDetailSchema = new Schema({
    type: {type: String, required: true},
    cardNumber: {type: String, required: true},
    expirationDate: {type: String},
    preferred: {type: Boolean},
    nameOnCard: {type: String, required: true}
});

var PreferencesSchema = new Schema({
    newsLetter: {type: Boolean, required: true},
    offers: {type: Boolean, required: true}
});

var CustomerSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    title: {type: String, required: true},
    email: {type: String, unique: true, lowercase: true, required: true},
    password: {type: String},
    dateOfBirth: {type: Date, required: true},
    phoneNumbers: [PhoneNumberSchema],
    addresses: [AddressSchema],
    paymentDetails: [PaymentDetailSchema],
    preferences: PreferencesSchema
});

CustomerSchema.pre('save', function (next) {
    var customer = this;
    bcrypt.hash(customer.password, SALTROUNDS, function (err, hash) {
        if (err) {
            logger.error("err");
            return next(err);
        }
        customer.password = hash;
        next();
    });
});

CustomerSchema.pre('findOneAndUpdate', async function () {


    var passwordToHash = this.getUpdate().password;
    if (passwordToHash && passwordToHash.length > 0)  {
        var hashedPassword = await bcrypt.hash(passwordToHash, SALTROUNDS)
        logger.debug("hash in then: " + hashedPassword);
        this.findOneAndUpdate({}, {password: hashedPassword});
    }


});

//Make sure the password is not shown
CustomerSchema.set('toJSON', {
    getters: true,
    transform: (doc, customer, options) => {
        delete customer.password;
        return customer;
    }
});



module.exports = mongoose.model('Customer', CustomerSchema);


