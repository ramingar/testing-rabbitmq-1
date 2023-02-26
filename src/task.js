import amqp from 'amqplib/callback_api'
import config from './config/config'

amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0
    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        const args     = process.argv.slice(4);
        const msg      = args.slice(1).join(' ') || 'Hello World!';
        const key      = (args.length > 0) ? args[0] : 'anonymous.info';
        const exchange = config.rabbitMQExchangeName;

        channel.assertExchange(exchange, 'topic', {durable: false});
        channel.publish(exchange, key, Buffer.from(msg))

        console.log(` [x] Sent ${msg}`);

        setTimeout(() => {
            connection.close();
            process.exit(0)
        }, 500);
    })
})