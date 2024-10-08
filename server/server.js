const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import thư viện jsonwebtoken
const User = require('./models/User');
const Cart = require('./models/Cart');
const Comment = require('./models/Comment');
const Order = require('./models/Order');
const ResetToken = require('./models/ResetToken');
const Favorites = require('./models/Favorites');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Thay đổi secret key này

app.use(cors());
app.use(bodyParser.json());
// API endpoint để lấy thông tin người dùng
//app.get('/users/:userId', userController.getUserInfo);

app.delete('/favorites/:userId/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        // Find the user's cart
        const favorite = await Favorites.findOne({ userId });

        if (!favorite) {
            return res.status(404).json({ error: 'fav not found' });
        }

        // Remove the product from the cart
        favorite.products = favorite.products.filter((product) => product.productId !== productId);

        // Save the updated cart
        await favorite.save();

        res.json(favorite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/favorites/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const favorite = await Favorites.findOne({ userId });

        if (!favorite) {
            return res.status(404).json({ error: 'Favorite not found' });
        }

        res.json(favorite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/favorites/:userId/add', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId, productTitle, productImage, price, description, authors, categories, rate, count } = req.body;


        // Find the user's cart or create a new one
        let favorite = await Favorites.findOne({ userId });

        if (!favorite) {
            favorite = new Favorites({ userId, date: new Date(), products: [] });
        }

        // Check if the product is already in the cart
        const existingProductIndex = favorite.products.findIndex((product) => product.productId === productId);

        if (existingProductIndex !== -1) {
            // If the product is already in the cart, update the quantity
        } else {
            // If the product is not in the cart, add it
            // You need to fetch product details from your database based on the productId
            //const productDetails = await fetchProductDetails(productId);

            // Add the new product to the cart
            favorite.products.push({
                productId,
                productTitle,
                productImage,
                price,
                description,
                authors,
                categories,
                rate,
                count,
            });
        }

        // Save the updated cart
        await favorite.save();

        res.json(favorite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "ab7e72c2c776b2",
        pass: "5accd0753c3d0f"
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Tạo mã đặt lại mật khẩu ngẫu nhiên
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu mã đặt lại mật khẩu vào cơ sở dữ liệu
    try {
        const userResetToken = new ResetToken({
            email,
            token: resetToken,
            expiresAt: new Date(Date.now() + 3600000), // Hết hạn sau 1 giờ
        });

        await userResetToken.save();

        // Thiết lập nội dung email
        const mailOptions = {
            from: 'gasgu2k6@gmail.com', // Thay thế bằng địa chỉ email của bạn
            to: email,
            subject: 'Password Reset Request',
            text: `Your password reset code is: ${resetToken}`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Password reset code sent successfully.' });
    } catch (error) {
        console.error('Error sending email or saving reset token:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Endpoint để kiểm tra mã đặt lại mật khẩu
app.post('/api/verify-reset-code', async (req, res) => {
    const { email, resetCode } = req.body;

    try {
        // Tìm mã đặt lại mật khẩu trong cơ sở dữ liệu
        const userResetToken = await ResetToken.findOne({
            email,
            token: resetCode,
            expiresAt: { $gt: new Date() }, // Mã phải còn hiệu lực
        });

        if (userResetToken) {
            res.status(200).json({ success: true, message: 'Reset code is valid.' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid reset code.' });
        }
    } catch (error) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        // Kiểm tra xem email có tồn tại trong hệ thống hay không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.password = newPassword
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully.' });
    }
    catch (error) {
        console.error('Error update failed:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }


});


app.get('/orders/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId });

        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).json({ error: 'No orders found for the user' });
        }
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/orders', async (req, res) => {
    try {
        const { userId, TotalPrice, deliveryAddress, products } = req.body;

        const order = new Order({
            userId,
            date: new Date(),
            deliveryAddress,
            products,
            TotalPrice,
            status: 'In Transit', // Trạng thái mặc định là 'In Transit'
        });

        const savedOrder = await order.save();
        res.json({ success: true, savedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// API endpoint để cập nhật thông tin người dùng
app.put('/users/:userId', async (req, res) => {
    try {
        // Lấy userId từ đường dẫn
        const userId = req.params.userId;

        // Tìm người dùng trong cơ sở dữ liệu dựa trên userId
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin người dùng từ dữ liệu trong request body
        const updateFields = req.body;

        Object.keys(updateFields).forEach((field) => {
            user[field] = updateFields[field];
        });

        // Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
        await user.save();

        // Trả về thông tin người dùng sau khi cập nhật
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra' });
    }
});

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


// Get cart by user ID
app.get('/carts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add product to cart
app.post('/carts/:userId/add', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId, quantity, productTitle, productImage, price } = req.body;

        // Find the user's cart or create a new one
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, date: new Date(), products: [] });
        }

        // Check if the product is already in the cart
        const existingProductIndex = cart.products.findIndex((product) => product.productId === productId);

        if (existingProductIndex !== -1) {
            // If the product is already in the cart, update the quantity
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // If the product is not in the cart, add it
            // You need to fetch product details from your database based on the productId
            //const productDetails = await fetchProductDetails(productId);

            // Add the new product to the cart
            cart.products.push({
                productId,
                productTitle,
                productImage,
                quantity,
                price,
            });
        }

        // Save the updated cart
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper function to fetch product details based on productId
const fetchProductDetails = async (productId) => {
    // Implement your logic to fetch product details from the database
    // This is just a placeholder, replace it with your actual implementation
    return {
        productId,
        productTitle: 'Your Product Title',
        productImage: 'Your Product Image URL',
        price: 10.99, // Replace with the actual price
    };
};


app.put('/carts/:userId/increase', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Check if the product is in the cart
        const existingProduct = cart.products.find((product) => product.productId === productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found in the cart' });
        }

        // Increase the quantity of the product
        existingProduct.quantity += 1;

        // Save the updated cart
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Decrease product quantity in cart
app.put('/carts/:userId/decrease', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Check if the product is in the cart
        const existingProduct = cart.products.find((product) => product.productId === productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found in the cart' });
        }

        // Decrease the quantity of the product
        existingProduct.quantity = Math.max(existingProduct.quantity - 1, 0);

        // Save the updated cart
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/carts/:userId/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        // Find the user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Remove the product from the cart
        cart.products = cart.products.filter((product) => product.productId !== productId);

        // Save the updated cart
        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/carts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Xóa giỏ hàng dựa trên userId
        await Cart.deleteOne({ userId });

        res.json({ success: true, message: 'Cart deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/comments/New', async (req, res) => {
    const { userId, date, comment, rating, image, bookTitle } = req.body;
    try {
        const newComment = new Comment({
            userId,
            date,
            comment,
            rating,
            image,
            bookTitle,
        });
        newComment.save();
        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/comments/user/:userId', async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.params.userId })
            .populate('userId');
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/comments/book/:bookTitle', async (req, res) => {
    try {
        const comments = await Comment.find({ bookTitle: req.params.bookTitle })
            .populate('userId');
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        comment.comment = req.body.comment;
        comment.rating = req.body.rating;
        comment.image = req.body.image;
        comment.save();
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/comments/delete/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        await Comment.deleteOne({ _id: commentId });
        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

mongoose.connect('mongodb+srv://20520469:duynguyen@cluster0.eigzfab.mongodb.net/DaNenTang', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
