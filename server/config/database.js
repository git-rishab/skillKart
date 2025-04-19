const mongoose = require('mongoose');
const config = require('./default');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;