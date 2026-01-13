const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true
  },
  action: { 
    type: String, 
    required: true 
  },
  metadata: { 
    type: Object, 
    required: false 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

module.exports = mongoose.model('Log', LogSchema);