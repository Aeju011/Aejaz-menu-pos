import React, { createContext, useContext, useEffect, useReducer } from "react";
import { items as MENU_ITEMS } from "../data/menu";

const CartContext = createContext();

const initialInventory = MENU_ITEMS.reduce((acc, item) => {
  acc[item.id] = item.stock || 0;
  return acc;
}, {});

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
        id: `${now.getTime()}`,
        items: state.items,
        subtotal: action.payload.subtotal,
        tax: action.payload.tax,
        tip: action.payload.tip,
        discount: action.payload.discount,
        total: action.payload.total,
        type: action.payload.type,
        table: action.payload.table,
        cashier: action.payload.cashier,
        paymentMethod: action.payload.paymentMethod,
        splitBill: action.payload.splitBill,
        customerPhone: action.payload.customerPhone || "",
        status: "pending",
        date: now.toLocaleString(),
        timestamp: now.getTime(),
      };

      const updatedSales = { ...state.salesSummary };
      updatedSales.totalSales += order.total;
      updatedSales.orderCount += 1;
      if (order.paymentMethod === "Cash") updatedSales.cashCount += order.total;
      if (order.paymentMethod === "Card") updatedSales.cardCount += order.total;
      if (order.paymentMethod === "UPI") updatedSales.upiCount += order.total;

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
        orderHistory: [order, ...state.orderHistory],
        kitchenQueue: [...state.kitchenQueue, order],
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
      return {
        ...state,
        inventory: { ...state.inventory, [itemId]: current + Number(amount) },
      };
    }

    case "selectTable":
      return { ...state, selectedTable: action.payload };

    case "toggleDarkMode":
      return { ...state, darkMode: !state.darkMode };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, defaultState, loadState);

  useEffect(() => {
    localStorage.setItem("sajha_pos_state", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
