const { sendLogToKafka } = require('../infrastructure/producer');
const LogModel = require('../domain/LogModel');

// 1. POST: Create a new log entry and send to Kafka
exports.createLog = async (req, res) => {
  const { userId, action, metadata } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ error: 'userId and action are required' });
  }

  const logData = { userId, action, metadata };


  await sendLogToKafka(logData);

  res.status(202).json({ message: 'Log received and queued for processing.' });
};

// 2. GET: Fetch logs from MongoDB with Pagination
exports.getLogs = async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    const filter = userId ? { userId } : {};

    const logs = await LogModel.find(filter)
      .sort({ timestamp: -1 }) 
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await LogModel.countDocuments(filter);

    res.json({
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};