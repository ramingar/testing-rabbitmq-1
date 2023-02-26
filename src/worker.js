import amqp from 'amqplib/callback_api'
import config from "./config/config";

const queueAssert = ({exchangeName, channel}) => (error, q) => {
    if (error) throw error

    console.log(`[*] Waiting for messages in ${q.queue}. To exit press CTRL+C`);

    // subscribe to every severity passed through args
    process.argv.slice(2).forEach(key => {
        channel.bindQueue(q.queue, exchangeName, key);
    });
    channel.consume(q.queue, queueConsumer, {noAck: false})
}

const queueConsumer = msg => {
    if (!msg.content) throw new Error('No msg.content')

    console.log(` [x] ${msg.fields.routingKey}: ${msg.content.toString()}!`);
}


// START <-----------------------------------------------------
amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const args     = process.argv.slice(2);
        const key      = (args.length > 0) ? args[0] : 'info';
        const exchange = config.rabbitMQExchangeName;

        channel.assertExchange(exchange, 'topic', {durable: false})
        channel.assertQueue('', {exclusive: true}, queueAssert({exchangeName: exchange, channel, key}));
    })
})