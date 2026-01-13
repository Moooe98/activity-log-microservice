const kafka = require('../config/kafka');

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log(' Kafka Producer Connected');
};

const sendLogToKafka = async (logData) => {
  try {
    await producer.send({
      topic: 'user-activity-logs', 
      messages: [
        { value: JSON.stringify(logData) }
      ],
    });
    console.log(` Message sent to Kafka: ${logData.action}`);
  } catch (error) {
    console.error(' Error sending message', error);
  }
};


connectProducer();

module.exports = { sendLogToKafka };