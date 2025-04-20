const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const config = require('./config/default');
const userRoutes = require('./routes/user.route');
const roadmapRoutes = require('./routes/roadmap.route');
const threadRoutes = require('./routes/thread.route');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/thread', threadRoutes);

app.listen(config.port, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${config.port}`);
});