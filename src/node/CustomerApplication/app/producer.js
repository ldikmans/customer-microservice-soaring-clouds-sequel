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
        debug: 'all'
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
            if (err) {
                console.error('error occurred: ' + err);
            } else {
                console.log('delivery-report: ' + JSON.stringify(report));
            }
        });


        var topic = producer.Topic(topicName, {
            'request.required.acks': 1
        });

        console.log(kafkaAvro.sr);



        var key = user._id;
        var partition = -1;
        producer.produce(topic, partition, user, key);
    });

};

exports.publishCustomerEvent = function (customer) {
    console.log('publishing customer');
    kafkaAvro.getProducer({
        log_level: 7
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

                console.log(kafkaAvro.sr);



                var key = customer._id;
                var partition = -1;
                producer.produce(topic, partition, customer, key);
            });

};



