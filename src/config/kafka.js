const { Kafka } = require('kafkajs');

const saslMechanism = process.env.KAFKA_USERNAME ? {
  mechanism: 'plain', 
  username: process.env.KAFKA_USERNAME,
  password: process.env.KAFKA_PASSWORD
} : undefined;

const ssl = !!process.env.KAFKA_USERNAME; 

const kafka = new Kafka({
  clientId: 'activity-log-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  ssl: ssl, 
  sasl: saslMechanism,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

module.exports = kafka;