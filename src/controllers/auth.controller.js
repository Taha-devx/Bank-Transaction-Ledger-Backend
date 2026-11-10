const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
/**
 * - User register controller
 * - /api/auth/register
 */
async function userRegisterController(req, res) {
    try {
        const { email, name, password } = req.body;

        const isExists = await userModel.findOne({ email });
        if (isExists) {
            return res.status(422).json({
                message: 'User already exists with this email',
                status: 'failed',
            });
        }

        const user = await userModel.create({
            email,
            password,
            name,
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '3d',
        });

        res.cookie('token', token);

        return res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
            token,
        });

        await emailService.userRegistrationEmail(user.email, user.name);


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/**
 * - User login Controller,
 * - /api/auth/login
 */
async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Email or password is INVALID',
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Email or password is INVALID',
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '3d',
        });

        res.cookie('token', token);

        return res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
            token,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/**
 * - User Logout Controller,
 * - /api/auth/logout
 */
async function userLogoutController(req, res) {
    try {
        res.clearCookie('token');

        return res.status(200).json({
            message: 'Logged out successfully',
            status: 'success',
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
};
