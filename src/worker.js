import amqp from 'amqplib/callback_api'
import config from "./config/config";

const queueConsumer = channel => msg => {
    const secs = msg.content.toString().split('.').length - 1;
    console.log(`[x] Received: ${msg.content.toString()}`);

    setTimeout(function () {
        console.log(` [x] Done for ${msg.content.toString()}!`);
        channel.ack(msg)
    }, secs * 1000);
}


amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const queue = config.rabbitMQQueueName;

        channel.assertQueue(queue, {durable: true});
        channel.prefetch(1);  // no round-robin dispatch, instead RabbitMQ will deliver the message to the next free worker
        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, queueConsumer(channel), {noAck: false})
    })
})