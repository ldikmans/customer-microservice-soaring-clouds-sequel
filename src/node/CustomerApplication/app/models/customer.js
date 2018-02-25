var mongoose     = require(mongoose);
var Schema       = mongoose.Schema;

var CustomerSchema   = new Schema({
  firstName: {type:String},
  lastName: {type:String},
  title: {type: String},
  email: {type: String, match: '/[a-z]@[a-z].[a-z]/', unique: true},
  dateOfBirth: {type: Date},
  _id: {type: Schema.Types.ObjectId},
  phonenumber: [PhoneNumberSchema],
  address: [AddressSchema],
  paymentDetails: PaymentDetailsSchema,
  preferences: PreferencesSchema
});

var PhoneNumberSchema = new Schema({
    type: {tye: String, required:true},
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
  
var PaymentDetailsSchema = new Schema({
      type: {type: String},
      cardNumber: {type: String},
      expirationDate: {type: String},
      nameOnCard: {type: String}
});

var PreferencesSchema = new Schema({
      newsLetter: {type: Boolean},
      offers: {type: Boolean}
});

module.exports = mongoose.model('Customer', CustomerSchema);


