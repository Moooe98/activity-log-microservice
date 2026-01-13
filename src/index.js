const express = require('express');
const connectDB = require('./config/db');
const routes = require('./interfaces/routes');

const app = express();
const PORT = 3000;

app.use(express.json());

connectDB();

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(` API Server running on port ${PORT}`);
});