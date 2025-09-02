const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
// Basic root route for health check
app.get('/', (req, res) => {
  res.send('API is running');
});
app.use('/api', require('./routes/routes'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('Mongo connection failed', e);
    process.exit(1);
  });