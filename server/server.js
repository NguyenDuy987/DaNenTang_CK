const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import thư viện jsonwebtoken
const User = require('./models/User');
const Cart = require('./models/Cart');
const Comment = require('./models/Comment');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Thay đổi secret key này

app.use(cors());
app.use(bodyParser.json());
// API endpoint để lấy thông tin người dùng
//app.get('/users/:userId', userController.getUserInfo);

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
    const { userId, date, comment, rating, bookTitle } = req.body;
    try {
        const newComment = new Comment({
            userId,
            date,
            comment,
            rating,
            bookTitle,
        });
        newComment.save();
        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/comments/:userId', async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.params.userId })
            .populate('userId');
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/comments/:bookTitle', async (req, res) => {
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
        comment.save();
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        comment.delete();
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

mongoose.connect('mongodb+srv://20520469:duynguyen@cluster0.eigzfab.mongodb.net/DaNenTang', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
