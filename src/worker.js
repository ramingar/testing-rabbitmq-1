import amqp from 'amqplib/callback_api'
import config from "./config/config";

const queueAssert = ({exchangeName, channel}) => (error, q) => {
    if (error) throw error

    console.log(`[*] Waiting for messages in ${q.queue}. To exit press CTRL+C`);

    channel.bindQueue(q.queue, exchangeName, '');
    channel.consume(q.queue, queueConsumer, {noAck: false})
}

const queueConsumer = msg => {
    if (!msg.content) throw new Error('No msg.content')

    console.log(`[x] Received: ${msg.content.toString()}`);
    console.log(` [x] Done for ${msg.content.toString()}!`);
}


// START <-----------------------------------------------------
amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const exchange = config.rabbitMQExchangeName;
        channel.assertExchange(exchange, 'fanout', {durable: false})
        channel.assertQueue('', {exclusive: true}, queueAssert({exchangeName: exchange, channel}));
    })
})