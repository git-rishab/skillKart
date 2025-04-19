const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const config = require('./config/default');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);

app.get('/test', async (req, res) => {
    try {
        res.json({ 'server': "ok" })
    } catch (error) {
        res.status(500).json({ errorMessage: 'Server error', error });
    }
});

app.listen(config.port, () => {
    dotenv.config();
    connectDB();
    console.log(`Server is running on http://localhost:${config.port}`);
});