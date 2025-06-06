import React, { createContext, useContext, useState, useEffect } from 'react';
import CartItemService from '../services/CartItemService';

interface CartContextType {
    cartItemsCount: number;
    updateCartItemsCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItemsCount, setCartItemsCount] = useState(0);

    const updateCartItemsCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setCartItemsCount(0);
                return;
            }

            const items = await CartItemService.getCartItems(token);
            setCartItemsCount(items.length);
        } catch (error) {
            console.error('Error updating cart items count:', error);
            setCartItemsCount(0);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            updateCartItemsCount();
        }
    }, []);

    return (
        <CartContext.Provider value={{ cartItemsCount, updateCartItemsCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 