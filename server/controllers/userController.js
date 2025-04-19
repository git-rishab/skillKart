const User = require('../models/User');
const bcrypt = require('bcrypt');
const config = require('../config/default');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(2);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: 'Server Error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            config.jwtSecret || process.env.JWT_SECRET || 'your-default-secret-key',
            { expiresIn: config.jwtExpiresIn || '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, message: "Login Successful" });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}

module.exports = {
    createUser,
    loginUser
}