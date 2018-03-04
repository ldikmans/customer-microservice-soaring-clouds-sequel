var KafkaAvro = require('kafka-avro');
var kafkaAvro;

exports.initKafkaAvro = function () {
    kafkaAvro = new KafkaAvro(
            {
                kafkaBroker: '129.150.77.116:6667',
                schemaRegistry: 'http://129.150.114.134:8081',
                parseOptions: {wrapUnions: true}
            }
    );
    kafkaAvro.init()
            .then(function () {
                console.log('Kafka Avro Ready to use');

            });
};

exports.publishSignInEvent = function (user) {
    console.log('publising user ' + JSON.stringify(user));
    kafkaAvro.getProducer({
    }).then(function (producer) {
        var topicName = 'a516817-soaring-user-sign-ins';

        producer.on('disconnected', function (arg) {
            console.log('producer disconnected. ' + JSON.stringify(arg));
        });

        producer.on('event.error', function (err) {
            console.error('Error from producer');
            console.error(err);
        });

        producer.on('delivery-report', function (err, report) {
            console.log('in delivery report');
            if (err) {
                console.error('error occurred: ' + err);
            } else {
                console.log('delivery-report: ' + JSON.stringify(report));
            }
        });


        var topic = producer.Topic(topicName, {
            'request.required.acks': 1
        });

        //console.log(kafkaAvro.sr);
        var key = 'testkey';
        var partition = -1;
        producer.produce(topic, partition, user, key);



    });

};

exports.publishCustomerEvent = function (customer) {
    console.log('publishing customer ' + JSON.stringify(customer));
    kafkaAvro.getProducer({
    })

            .then(function (producer) {
                var topicName = 'a516817-soaring-customers';

                producer.on('disconnected', function (arg) {
                    console.log('producer disconnected. ' + JSON.stringify(arg));
                });

                producer.on('event.error', function (err) {
                    console.error('Error from producer');
                    console.error(err);
                });

                producer.on('delivery-report', function (err, report) {
                    if (err) {
                        console.error('error: ' + err);
                    } else {
                        console.log('delivery-report: ' + JSON.stringify(report));
                    }
                });


                var topic = producer.Topic(topicName, {
                    'request.required.acks': 1
                });

                //console.log(kafkaAvro.sr);



                var key = customer._id;
                var partition = -1;
                producer.produce(topic, partition, mapCustomerToAvroCustomer(customer), key);
            });

};

function mapCustomerToAvroCustomer(body){
    
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
    if (body.password) {
        customer.password = {'string': body.password};
    }
    if (body.dateOfBirth) {
        customer.dateOfBirth = {'string': body.dateOfBirth.toString()};
    }
    if (body._id){
        customer._id = {'string': body._id};
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
                    phoneNumber.countryCode = body.phoneNumbers[i].countryCode.toString();
                }
                if (body.phoneNumbers[i].number) {
                    phoneNumber.number = body.phoneNumbers[i].number.toString();
                }
                phoneNumbers.push(phoneNumber);
                phoneNumber = {};
            }
        }
        if (phoneNumbers.length > 0) {
            customer.phoneNumbers = {'array': phoneNumbers};
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
            customer.addresses = {'array': addresses};
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
                    paymentDetail.expirationDate = {'string': body.paymentDetails[i].expirationDate};
                }
                if(body.paymentDetails[i].preferred){
                    paymentDetail.preferred = {'boolean': body.paymentDetails[i].preferred};
                }
                if (body.paymentDetails[i].nameOnCard) {
                    paymentDetail.nameOnCard = body.paymentDetails[i].nameOnCard;
                }
                paymentDetails.push(paymentDetail);
                paymentDetail = {};
            }
        }
        if (paymentDetails.length > 0) {
            customer.paymentDetails = {'array' : paymentDetails};
        }
    }
    ;

    if (body.preferences) {
        preferences = {};
        if (body.preferences.newsLetter) {
            preferences.newsLetter = body.preferences.newsLetter;
        } else {
            preferences.newsLetter = {'boolean': false};
        }
        if (body.preferences.offers) {
            preferences.offers = body.preferences.offers;
        } else {
            preferences.offers = {'boolean': false};
        }
        customer.preferences = preferences;
    }
    console.log('customer: ' + JSON.stringify(customer));
    return customer;
}
;
