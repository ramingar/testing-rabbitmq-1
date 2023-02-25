import amqp from 'amqplib/callback_api'
import config from "./config/config";

const queueConsumer = (msg) => {
    console.log(`[x] Received: ${msg.content.toString()}`)
}


amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const queue = config.rabbitMQQueueName;

        channel.assertQueue(queue, {durable: false});
        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, queueConsumer, {noAck: true})
    })
})