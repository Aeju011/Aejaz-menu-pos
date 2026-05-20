import React, { createContext, useContext, useEffect, useReducer } from "react";
import { items as MENU_ITEMS } from "../data/menu";

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const CartContext = createContext();

const initialInventory = MENU_ITEMS.reduce((acc, item) => {
  acc[item.id] = item.stock || 0;
  return acc;
}, {});

// API functions
const api = {
  async saveOrder(order) {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving order:', error);
      return null;
    }
  },

  async getOrders() {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  async updateInventory(itemId, stock) {
    try {
      const response = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, stock })
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating inventory:', error);
      return null;
    }
  },

  async getInventory() {
    try {
      const response = await fetch(`${API_BASE}/inventory`);
      const data = await response.json();
      return data.reduce((acc, item) => {
        acc[item.itemId] = item.stock;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return {};
    }
  }
};

const defaultState = {
  items: [],
  orderHistory: [],
  recentItems: [],
  kitchenQueue: [],
  favorites: [],
  darkMode: false,
  salesSummary: { totalSales: 0, cashCount: 0, cardCount: 0, upiCount: 0, orderCount: 0 },
  inventory: initialInventory,
  loyaltyRecords: {},
  selectedTable: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem("sajha_pos_state");
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      inventory: { ...defaultState.inventory, ...(parsed.inventory || {}) },
      items: Array.isArray(parsed.items) ? parsed.items : defaultState.items,
      orderHistory: Array.isArray(parsed.orderHistory) ? parsed.orderHistory : defaultState.orderHistory,
      kitchenQueue: Array.isArray(parsed.kitchenQueue) ? parsed.kitchenQueue : defaultState.kitchenQueue,
      recentItems: Array.isArray(parsed.recentItems) ? parsed.recentItems : defaultState.recentItems,
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : defaultState.favorites,
    };
  } catch (e) {
    return defaultState;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const item = action.payload;
      const stockLeft = state.inventory[item.id] ?? item.stock ?? 0;
      const existing = state.items.find(x => x.id === item.id);
      const currentQty = existing ? existing.qty : 0;

      if (stockLeft <= 0) {
        alert(`Out of stock: ${item.name}`);
        return state;
      }
      if (existing && currentQty + 1 > stockLeft) {
        alert(`Only ${stockLeft} left for ${item.name}`);
        return state;
      }

      if (existing) {
        return {
          ...state,
          items: state.items.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x),
          recentItems: [item.id, ...state.recentItems.filter(i => i !== item.id)].slice(0, 10),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...item, qty: 1, selectedModifiers: item.selectedModifiers || [] }],
        recentItems: [item.id, ...state.recentItems.filter(i => i !== item.id)].slice(0, 10),
      };
    }

    case "remove":
      return { ...state, items: state.items.filter(x => x.id !== action.payload) };

    case "increment": {
      const item = state.items.find(x => x.id === action.payload);
      if (!item) return state;
      const stockLeft = state.inventory[item.id] ?? 0;
      if (item.qty + 1 > stockLeft) {
        alert(`Only ${stockLeft} left for ${item.name}`);
        return state;
      }
      return {
        ...state,
        items: state.items.map(x => x.id === action.payload ? { ...x, qty: x.qty + 1 } : x),
      };
    }

    case "decrement":
      return {
        ...state,
        items: state.items
          .map(x => x.id === action.payload ? { ...x, qty: Math.max(1, x.qty - 1) } : x)
          .filter(x => x.qty > 0),
      };

    case "clear":
      return { ...state, items: [] };

    case "checkout": {
      const now = new Date();
      const order = {
        items: state.items,
        total: action.payload.total,
        paymentMethod: action.payload.paymentMethod.toLowerCase(),
        tableId: action.payload.table,
        timestamp: now,
        status: "pending"
      };

      // Save to backend (we'll handle the response in the component)
      // For now, keep local state for immediate UI feedback
      const localOrder = {
        id: `${now.getTime()}`,
        ...order,
        date: now.toLocaleString(),
        subtotal: action.payload.subtotal,
        tax: action.payload.tax,
        tip: action.payload.tip,
        discount: action.payload.discount,
        type: action.payload.type,
        cashier: action.payload.cashier,
        splitBill: action.payload.splitBill,
        customerPhone: action.payload.customerPhone || "",
      };

      const updatedSales = { ...state.salesSummary };
      updatedSales.totalSales += order.total;
      updatedSales.orderCount += 1;
      if (order.paymentMethod === "cash") updatedSales.cashCount += order.total;
      if (order.paymentMethod === "card") updatedSales.cardCount += order.total;
      if (order.paymentMethod === "upi") updatedSales.upiCount += order.total;

      const updatedInventory = { ...state.inventory };
      order.items.forEach(item => {
        if (item.id in updatedInventory) {
          updatedInventory[item.id] = Math.max(0, updatedInventory[item.id] - item.qty);
        }
      });

      const loyaltyRecords = { ...state.loyaltyRecords };
      if (order.customerPhone) {
        const points = Math.floor(order.total / 100);
        loyaltyRecords[order.customerPhone] = (loyaltyRecords[order.customerPhone] || 0) + points;
      }

      return {
        ...state,
        items: [],
        orderHistory: [localOrder, ...state.orderHistory],
        kitchenQueue: [...state.kitchenQueue, localOrder],
        salesSummary: updatedSales,
        inventory: updatedInventory,
        loyaltyRecords,
      };
    }

    case "updateOrderStatus": {
      const { orderId, status } = action.payload;
      return {
        ...state,
        kitchenQueue: state.kitchenQueue.map(o => (o.id === orderId ? { ...o, status } : o)),
      };
    }

    case "toggleFavorite": {
      const id = action.payload;
      const currentFavorites = Array.isArray(state.favorites) ? state.favorites : [];
      const isFavorite = currentFavorites.includes(id);
      return {
        ...state,
        favorites: isFavorite ? currentFavorites.filter(f => f !== id) : [id, ...currentFavorites],
      };
    }

    case "restock": {
      const { itemId, amount } = action.payload;
      const current = state.inventory[itemId] ?? 0;
      const newStock = current + Number(amount);
      // Update backend (we'll handle response in component)
      return {
        ...state,
        inventory: { ...state.inventory, [itemId]: newStock },
      };
    }

    case "selectTable":
      return { ...state, selectedTable: action.payload };

    case "toggleDarkMode":
      return { ...state, darkMode: !state.darkMode };

    case "LOAD_DATA":
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, defaultState, loadState);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load data from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 5000);
        });

        const [orders, inventory] = await Promise.race([
          Promise.all([
            api.getOrders(),
            api.getInventory()
          ]),
          timeoutPromise
        ]);

        // Load local state for UI preferences
        const localPrefs = JSON.parse(localStorage.getItem("sajha_pos_prefs") || '{}');

        dispatch({
          type: 'LOAD_DATA',
          payload: {
            orderHistory: orders.map(order => ({
              ...order,
              id: order._id,
              date: new Date(order.timestamp).toLocaleString(),
              subtotal: order.total * 0.9, // approximate
              tax: order.total * 0.1,
              tip: 0,
              discount: 0,
              type: 'dine-in',
              cashier: 'System',
              splitBill: false,
              customerPhone: ''
            })),
            inventory: { ...initialInventory, ...inventory },
            // Keep local preferences
            favorites: localPrefs.favorites || [],
            darkMode: localPrefs.darkMode || false,
            recentItems: localPrefs.recentItems || [],
            selectedTable: localPrefs.selectedTable
          }
        });
      } catch (error) {
        console.error('Error loading data from backend, using local data:', error);
        // Fallback to local data if backend fails
        const localPrefs = JSON.parse(localStorage.getItem("sajha_pos_prefs") || '{}');
        dispatch({
          type: 'LOAD_DATA',
          payload: {
            orderHistory: [],
            inventory: initialInventory,
            favorites: localPrefs.favorites || [],
            darkMode: localPrefs.darkMode || false,
            recentItems: localPrefs.recentItems || [],
            selectedTable: localPrefs.selectedTable
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to backend when relevant state changes
  const prevInventoryRef = React.useRef(initialInventory);

  useEffect(() => {
    if (isLoading) return;

    const prevInventory = prevInventoryRef.current;
    Object.entries(state.inventory).forEach(([itemId, stock]) => {
      if (prevInventory[itemId] !== stock) {
        api.updateInventory(itemId, stock);
      }
    });
    prevInventoryRef.current = state.inventory;

    const localPrefs = {
      favorites: state.favorites,
      darkMode: state.darkMode,
      recentItems: state.recentItems,
      selectedTable: state.selectedTable
    };
    localStorage.setItem("sajha_pos_prefs", JSON.stringify(localPrefs));
  }, [state.inventory, state.favorites, state.darkMode, state.recentItems, state.selectedTable, isLoading]);

  // Custom checkout function that saves to backend
  const checkout = async (payload) => {
    dispatch({ type: 'checkout', payload });

    const order = {
      items: state.items,
      subtotal: payload.subtotal,
      tax: payload.tax,
      tip: payload.tip,
      discount: payload.discount,
      total: payload.total,
      paymentMethod: payload.paymentMethod.toLowerCase(),
      tableId: payload.table,
      type: payload.type,
      cashier: payload.cashier,
      splitBill: payload.splitBill,
      customerPhone: payload.customerPhone,
      status: 'pending'
    };

    const savedOrder = await api.saveOrder(order);
    if (savedOrder) {
      console.log('Order saved to database:', savedOrder._id);
    } else {
      console.error('Failed to save order to database');
    }
    return savedOrder;
  };

  const contextValue = {
    state,
    dispatch,
    checkout,
    isLoading
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return {
    state: context.state,
    dispatch: context.dispatch,
    checkout: context.checkout,
    isLoading: context.isLoading
  };
}
