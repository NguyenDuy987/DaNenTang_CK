// Import necessary modules
const express = require('express');
const router = express.Router();
const User = require('../server/models/User'); // Assuming you have a User model

// API endpoint to update user information
const getUserInfo = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user information
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller để cập nhật thông tin người dùng
const updateUserInfo = async (req, res) => {
    try {
        // Tìm người dùng theo ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Cập nhật thông tin người dùng
        Object.keys(updateFields).forEach((field) => {
            user[field] = updateFields[field];
        });

        // Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Xuất các hàm controller để sử dụng trong route
module.exports = {
    getUserInfo,
    updateUserInfo,
};