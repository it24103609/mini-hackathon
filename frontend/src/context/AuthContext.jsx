import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medfind_token') || '');
  const [loading, setLoading] = useState(true);
  
  // Shopping Cart State for Patients
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('medfind_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('medfind_cart', JSON.stringify(cart));
  }, [cart]);

  // Load user profile on app start
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('medfind_token', res.data.token);
        return { success: true, message: res.data.message, user: res.data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        if (res.data.token) {
          setToken(res.data.token);
          setUser(res.data.user);
          localStorage.setItem('medfind_token', res.data.token);
        }
        return { success: true, message: res.data.message, user: res.data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    }
  };

  // Logout handler
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('medfind_token');
  };

  // Cart operations
  const addToCart = (medicine, qty = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.medicine._id === medicine._id);
      if (existing) {
        return prevCart.map((item) =>
          item.medicine._id === medicine._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevCart, { medicine, quantity: qty, price: medicine.price }];
    });
  };

  const removeFromCart = (medicineId) => {
    setCart((prevCart) => prevCart.filter((item) => item.medicine._id !== medicineId));
  };

  const updateCartQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.medicine._id === medicineId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
