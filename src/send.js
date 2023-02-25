import amqp from 'amqplib/callback_api'
import config from './config/config'

amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const queue = config.rabbitMQQueueName;
        const msg   = 'Hello World!!';

        channel.assertQueue(queue, {durable: false});
        channel.sendToQueue(queue, Buffer.from(msg));

        setTimeout(() => {
            connection.close();
            process.exit(0)
        }, 500);
    })
})