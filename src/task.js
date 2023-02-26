import amqp from 'amqplib/callback_api'
import config from './config/config'

const generateUuid = () => Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();

amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0

    connection.createChannel((error1, channel) => {
        if (error1) throw error1

        channel.assertQueue('', {exclusive: true}, (error2, queue) => {
            if (error2) throw error2

            const args          = process.argv.slice(4);
            const correlationId = generateUuid();
            const num           = parseInt(args[0]);

            channel.consume(queue.queue, msg => {
                if (msg.properties.correlationId === correlationId) {
                    console.log(` [.] Got ${msg.content.toString()}`);
                    setTimeout(() => {
                        connection.close();
                        process.exit(0)
                    }, 500);
                }
            })

            console.log(` [x] Requesting fib(${num})`);
            channel.sendToQueue(
                config.rabbitMQQueueName,
                Buffer.from(num.toString()),
                {
                    correlationId: correlationId,
                    replyTo      : queue.queue
                }
            );
        });
    })
})