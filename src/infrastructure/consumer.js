const kafka = require('../config/kafka');
const LogModel = require('../domain/LogModel');
const connectDB = require('../config/db');

const consumer = kafka.consumer({ groupId: 'log-processing-group' });

const runConsumer = async () => {
  await connectDB();

  await consumer.connect();
  console.log(' Kafka Consumer Connected');

  await consumer.subscribe({ topic: 'user-activity-logs', fromBeginning: true });


  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = message.value.toString();
      const logData = JSON.parse(payload);

      try {
        await LogModel.create(logData);
        console.log(` Processed & Saved: ${logData.action} for user ${logData.userId}`);
      } catch (err) {
        console.error(' Error saving to DB:', err);
      }
    },
  });
};


runConsumer();