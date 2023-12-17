const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import thư viện jsonwebtoken
const User = require('./models/User');
const Cart = require('./models/Cart');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Thay đổi secret key này

app.use(cors());
app.use(bodyParser.json());

app.get('/users/:userId', async (req, res) => {
    try {
        // Lấy userId từ đường dẫn
        const userId = req.params.userId;

        // Tìm người dùng trong cơ sở dữ liệu dựa trên userId
        const user = await User.findById(userId);

        if (user) {
            // Trả về thông tin người dùng
            res.json({ success: true, user });
        } else {
            res.json({ success: false, message: 'Người dùng không tồn tại' });
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra' });
    }
});

// Endpoint đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ username, password });

    if (user) {
        // Tạo và trả về token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
        res.json({ success: true, message: 'Đăng nhập thành công', token });
    } else {
        res.json({ success: false, message: 'Tên người dùng hoặc mật khẩu không đúng' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, email, phoneNumber, houseNumber, street, city } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.json({ success: false, message: 'Tên người dùng đã tồn tại' });
        }

        // Tạo người dùng mới
        const newUser = new User({
            username,
            password, // Cần mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            firstName,
            lastName,
            email,
            phoneNumber,
            houseNumber,
            street,
            city,
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        res.json({ success: true, message: 'Đăng ký thành công' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra' });
    }
});

// Endpoint to get the user's shopping cart
app.get('/carts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.find({ userId: userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    }
    catch (error) {
        console.error('Error during get cart:', error);
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra' });
    }



});


mongoose.connect('mongodb+srv://20520469:duynguyen@cluster0.eigzfab.mongodb.net/DaNenTang', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
