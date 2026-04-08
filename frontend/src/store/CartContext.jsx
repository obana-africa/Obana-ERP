import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.find(i => i.id === action.payload.id);
      if (exists) return state.map(i =>
        i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
      );
      return [...state, { ...action.payload, qty: 1 }];
    }
    case 'DECREASE_QTY':
      return state
        .map(i => i.id === action.payload ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0);
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);