import amqp from 'amqplib/callback_api'
import config from "./config/config";
import {random} from "./utils";

const consumer = channel => msg => {
    setTimeout(() => {
        console.log(`    [x] Done - Message: ${msg.content}, Client: ${JSON.parse(msg.content).clientUuid}`);
        channel.ack(msg);
    }, random(0, 4) * 1000);
}


// START <-----------------------------------------------------
amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0

    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const queue = config.rabbitMQQueueName2

        channel.assertQueue(queue, {durable: true});
        channel.prefetch(1);
        console.log(' [*] Awaiting requests');

        channel.consume(queue, consumer(channel))

    })
})