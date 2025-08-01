// utils/rabbitmq.js
const amqp = require('amqplib')

let channel = null
let connection = null

async function connectRabbitMQ() {
  if (channel) return channel

  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost'

  connection = await amqp.connect(RABBITMQ_URL)
  channel = await connection.createChannel()

  console.log('[✅] Connected to RabbitMQ')
  return channel
}

async function publishToQueue(queueName, messageObj) {
  const channel = await connectRabbitMQ()
  await channel.assertQueue(queueName, { durable: true })
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(messageObj)), {
    persistent: true,
  })
  console.log(`[📤] Published to ${queueName}`, messageObj)
}

async function consumeQueue(queueName, callback) {
  const channel = await connectRabbitMQ()
  await channel.assertQueue(queueName, { durable: true })

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString())
      await callback(data)
      channel.ack(msg)
    }
  })

  console.log(`[👂] Listening on ${queueName}`)
}

module.exports = { connectRabbitMQ, publishToQueue, consumeQueue }
