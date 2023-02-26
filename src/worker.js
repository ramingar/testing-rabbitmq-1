import amqp from 'amqplib/callback_api'
import config from "./config/config";

const fibonacci = n => (n <= 1) ? n : fibonacci(n - 1) + fibonacci(n - 2);

const reply = channel => msg => {
    const n = parseInt(msg.content.toString());
    console.log(` [.] fib(${n})`);
    const result = fibonacci(n);

    channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()), {correlationId: msg.properties.correlationId});

    channel.ack(msg);
}


// START <-----------------------------------------------------
amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const queue = config.rabbitMQQueueName

        channel.assertQueue(queue, {durable: false});
        channel.prefetch(1);
        console.log(' [x] Awaiting RPC requests');

        channel.consume(queue, reply(channel))

    })
})