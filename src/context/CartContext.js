import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';

// Khởi tạo Context
export const CartContext = createContext();


// Khởi tạo giá trị mặc định cho Context
const initialState = {
    cartItems: [],
    total: 0,
};

// Hàm reducer xử lý các action
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'INITIALIZE_CART':
            // Khởi tạo giỏ hàng
            return {
                ...state,
                cartItems: action.payload,
                total: calculateTotal(action.payload),
            };
        case 'ADD_TO_CART':
            // Thêm sản phẩm vào giỏ hàng
            const newItem = action.payload;
            newItem.quantity = 1;
            const updatedCart = [...state.cartItems.cartItems[0].products.quantity, newItem];
            return {
                ...state,
                cartItems: updatedCart,
                total: calculateTotal(updatedCart),
            };
        case 'REMOVE_FROM_CART':
            // Xóa sản phẩm khỏi giỏ hàng
            const updatedCartRemove = state.cartItems.filter((item) => item.id !== action.payload.id);
            return {
                ...state,
                cartItems: updatedCartRemove,
                total: calculateTotal(updatedCartRemove),
            };
        case 'UPDATE_QUANTITY':
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            const updatedCartUpdate = state.cartItems.map((item) =>
                item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
            );
            return {
                ...state,
                cartItems: updatedCartUpdate,
                total: calculateTotal(updatedCartUpdate),
            };
        case 'DELETE_CART':
            // Xóa toàn bộ giỏ hàng
            return {
                ...state,
                cartItems: [],
                total: 0,
            };
        default:
            return state;
    }
};

// Hàm tính tổng giá trị của giỏ hàng
const calculateTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Component Provider sử dụng Context và reducer
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { token } = useAuth();
    const { user } = useAuth();
    useEffect(() => {
        if (token) {
            fetchCartFromAPI();
        }
    }, [token]);
    // Hàm fetch giỏ hàng từ API (thay thế với API endpoint của bạn)
    const fetchCartFromAPI = async () => {
        try {
            const userId = jwtDecode(token).userId;
            //const userId = user;

            console.log("userId " + userId);
            const response = await fetch(`http://10.0.2.2:3000/carts/${userId}`);
            const data = await response.json();

            if (true) {
                // Wait for all product details requests to complete
                const productDetails = data;
                console.log(productDetails);

                dispatch({ type: 'INITIALIZE_CART', payload: productDetails });
            } else {
                console.log('No cart data found.');
            }
        } catch (error) {
            console.error('Error fetching cart data from API:', error);
        }
    };

    // Gọi hàm fetchCartFromAPI khi CartProvider được khởi tạo



    return <CartContext.Provider value={{ state, dispatch, fetchCartFromAPI }}>{children}</CartContext.Provider>;
};

// Hook để lấy giá trị từ Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
