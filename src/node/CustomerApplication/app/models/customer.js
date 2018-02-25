var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PhoneNumberSchema = new Schema({
    type: {type: String, required:true},
    countryCode: {type: Number, required: true},
    number: {type: Number, requred: true}
});

var AddressSchema = new Schema({
      type: {type: String},
      streetName: {type: String},
      streetNumer: {type: String},
      city: {type: String},
      postcode: {type: String},
      country: {type: String}
});
  
var PaymentDetailSchema = new Schema({
      type: {type: String},
      cardNumber: {type: String},
      expirationDate: {type: String},
      preferred: {type:Boolean},
      nameOnCard: {type: String}
});

var PreferencesSchema = new Schema({
      newsLetter: {type: Boolean},
      offers: {type: Boolean}
});

var CustomerSchema   = new Schema({
  firstName: {type:String},
  lastName: {type:String},
  title: {type: String},
  email: {type: String, unique: true, lowercase: true},
  password: {type: String},
  dateOfBirth: {type: Date},
  phoneNumbers: [PhoneNumberSchema],
  addresses: [AddressSchema],
  paymentDetails: [PaymentDetailSchema],
  preferences: PreferencesSchema
});

module.exports = mongoose.model('Customer', CustomerSchema);


