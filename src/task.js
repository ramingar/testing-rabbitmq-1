import amqp from 'amqplib/callback_api'
import config from './config/config'

amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const msg      = process.argv.slice(2).join(' ') || "Hello World!";
        const exchange = config.rabbitMQExchangeName;

        channel.assertExchange(exchange, 'fanout', {durable: false});
        channel.publish(exchange, '', Buffer.from(msg))

        console.log(` [x] Sent ${msg}`);

        setTimeout(() => {
            connection.close();
            process.exit(0)
        }, 500);
    })
})