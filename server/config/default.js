require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};