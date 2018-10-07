const KafkaAvro = require('kafka-avro');
const logger = require('./logger');

var kafkaAvro;

var kafkaBrokerVar = process.env.KAFKA_BROKER || 'localhost:9092';
var kafkaRegistryVar = process.env.KAFKA_REGISTRY || 'http://129.156.113.125:8081';

//topics as they are defined on Kafka
const SIGNIN_TOPIC = process.env.KAFKA_SIGNIN_TOPIC || 'idcs-1d61df536acb4e9d929e79a92f3414b5-soaringusersignins';
const CUSTOMER_TOPIC = process.env.KAFA_CUSTOMER_TOPIC || 'idcs-1d61df536acb4e9d929e79a92f3414b5-soaringcustomers';

exports.initKafkaAvro = function () {
    kafkaAvro = new KafkaAvro(
            {
                kafkaBroker: kafkaBrokerVar,
                schemaRegistry: kafkaRegistryVar,
                parseOptions: {wrapUnions: true}
            }
    );
    logger.debug("kafkaBroker: " + kafkaBrokerVar);
    logger.debug("kafkaRegistryVar: " + kafkaRegistryVar);
    kafkaAvro.init()
            .then(function () {
                logger.info('Kafka Avro Ready to use');

            });
};

exports.publishSignInEvent = function (user) {
    logger.debug('publising user ' + JSON.stringify(user));
    kafkaAvro.getProducer({
    }).then(function (producer) {
        var topicName = SIGNIN_TOPIC;

        producer.on('disconnected', function (arg) {
            logger.info('producer disconnected. ' + JSON.stringify(arg));
        });

        producer.on('event.error', function (err) {
            logger.error('Error from producer');
            logger.error(err);
        });

        producer.on('delivery-report', function (err, report) {
            logger.info('in delivery report');
            if (err) {
                logger.error('error occurred: ' + err);
            } else {
                logger.info('delivery-report: ' + JSON.stringify(report));
            }
        });


        var topic = producer.Topic(topicName, {
            'request.required.acks': 1
        });

        var key = 'testkey';
        var partition = -1;
        producer.produce(topic, partition, user, key);



    }).catch(function (exception) {
        logger.error("exception: " + exception);
    });

};

exports.publishCustomerEvent = function (customer) {
    logger.debug('publishing customer ' + JSON.stringify(customer));
    kafkaAvro.getProducer({
    })

            .then(function (producer) {
                var topicName = CUSTOMER_TOPIC;

                producer.on('disconnected', function (arg) {
                    logger.info('producer disconnected. ' + JSON.stringify(arg));
                });

                producer.on('event.error', function (err) {
                    logger.error('Error from producer');
                    logger.error(err);
                });

                producer.on('delivery-report', function (err, report) {
                    if (err) {
                        logger.error('error: ' + err);
                    } else {
                        logger.info('delivery-report: ' + JSON.stringify(report));
                    }
                });


                var topic = producer.Topic(topicName, {
                    'request.required.acks': 1
                });

                
                var key = customer._id;
                //var key = 'test_key_from_real_code';
                logger.debug('key: ' + key);
                if (!key) {
                    key = customer.firstName + '_' + customer.lastName;
                }
                var partition = -1;
                newCustomer = mapCustomerToAvroCustomer(customer);
                logger.debug('newCustomer: ' + JSON.stringify(newCustomer));
                producer.produce(topic, partition, newCustomer, key);
            }).catch(function (exception) {
        logger.error("exception: " + exception);
    });

};

function mapCustomerToAvroCustomer(body) {

    var customer = {};

    customer.firstName = body.firstName;
    customer.lastName = body.lastName;
    customer.title = body.title;
    customer.email = body.email;
    customer.dateOfBirth = {"string": body.dateOfBirth.toString()};
    customer._id = {"string": (body._id).toString()};

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
    }
    customer.phoneNumbers = {"array": phoneNumbers};

    ;

    if (body.addresses) {
        var addresses = [];
        var address = {};
        for (i = 0; i < body.addresses.length; i++) {
            if (body.addresses[i]) {
                if (body.addresses[i].type) {
                    address.type = body.addresses[i].type;
                } else {
                    address.type = 'DELIVERY';
                }
                if (body.addresses[i].streetName) {
                    address.streetName = body.addresses[i].streetName;
                } else {
                    address.streetName = 'unknown';
                }
                if (body.addresses[i].streetNumber) {
                    address.streetNumber = body.addresses[i].streetNumber;
                } else {
                    address.streetNumber = 'NA';
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
    }
    customer.addresses = {"array": addresses};

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
                    paymentDetail.expirationDate = {"string": body.paymentDetails[i].expirationDate};
                }
                if (body.paymentDetails[i].preferred) {
                    paymentDetail.preferred = {"boolean": body.paymentDetails[i].preferred};
                } else {
                    paymentDetail.preferred = {"boolean": false};
                }
                if (body.paymentDetails[i].nameOnCard) {
                    paymentDetail.nameOnCard = body.paymentDetails[i].nameOnCard;
                }
                paymentDetails.push(paymentDetail);
                paymentDetail = {};
            }
        }
    }
    ;

    customer.paymentDetails = {"array": paymentDetails};

    if (body.preferences) {
        preferences = {};
        if (body.preferences.newsLetter) {
            preferences.newsLetter = {"boolean": body.preferences.newsLetter};
        } else {
            preferences.newsLetter = {"boolean": false};
        }
        if (body.preferences.offers) {
            preferences.offers = {"boolean": body.preferences.offers};
        } else {
            preferences.offers = {"boolean": false};
        }
    }
    //opt out so if you don't tell us your preferences we don't send anything
    else {
        preferences = {
            "newsLetter": {"boolean": false},
            "offers": {"boolean": false}
        };
    }
    ;
    customer.preferences = preferences;

    return customer;
}
;
