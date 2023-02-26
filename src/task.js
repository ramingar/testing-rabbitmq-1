import amqp from 'amqplib/callback_api'
import {random, uuid} from './utils'
import config from './config/config'

/**
 * IMPORTANT NOTE: remember to configure RabbitMQ with queue-mode to lazy to store the messages on disk
 * sudo rabbitmqctl set_policy Lazy "^task_queue_*$" '{"queue-mode":"lazy"}' --apply-to queues
 */

amqp.connect(config.rabbitMQUrl, (error0, connection) => {
    if (error0) throw error0                                                                    // no connection to RabbitMQ

    connection.createChannel((error1, channel) => {
        if (error1) throw error1                                                                // can't establish a channel with RabbitMQ

        const queue   = config.rabbitMQQueueName1;
        const payload = {...config.exampleJSONs[random(0, 3)], clientUuid: uuid()};

        channel.assertQueue(queue, {durable: true});                                            // durable = save the queue
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {persistent: true});   // persistent = store in disk

        console.log(` [*] Message sent to ${queue}`);
        setTimeout(() => {
            connection.close()
        }, 500)
    })
})