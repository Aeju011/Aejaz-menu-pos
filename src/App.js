import React, { useMemo, useState, useEffect } from "react";
import { CartProvider, useCart } from "./context/CartContext";
import { categories, items as MENU_ITEMS, combos, tables } from "./data/menu";
import "./App.css";

function SearchBar({ value, onChange }) {
  return (
    <input
      className="searchbar"
      type="text"
      placeholder="🔍 Search menu..."
      value={value}
      onChange={onChange}
    />
  );
}

const getItemImageUrl = (item) => {
  // Comprehensive food image mapping - unique images for each item
  const foodImageMap = {
    // Beverages (10)
    'Masala Tea': 'https://images.unsplash.com/photo-1597318376707-ea20236bf2e8?auto=format&fit=crop&w=400&q=80',
    'Espresso': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
    'Cold Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    'Ginger Lemon': 'https://images.unsplash.com/photo-1585936694993-b0236cff01cf?auto=format&fit=crop&w=400&q=80',
    'Iced Tea': 'https://images.unsplash.com/photo-1542043464749-8e51c335b7d2?auto=format&fit=crop&w=400&q=80',
    'Mint Mojito Mocktail': 'https://images.unsplash.com/photo-1551024724-5cd335803d4e?auto=format&fit=crop&w=400&q=80',
    'Lemonade': 'https://images.unsplash.com/photo-1526318472351-bc8d61f7ebf5?auto=format&fit=crop&w=400&q=80',
    'Cappuccino': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
    'Green Tea': 'https://images.unsplash.com/photo-1597318210614-cd673ccc2e73?auto=format&fit=crop&w=400&q=80',
    'Filter Coffee': 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?auto=format&fit=crop&w=400&q=80',
    // Snacks (10)
    'Paneer Samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    'French Fries': 'https://images.unsplash.com/photo-1587735512732-216ea3c7a1cf?auto=format&fit=crop&w=400&q=80',
    'Aloo Tikki': 'https://images.unsplash.com/photo-1518976024611-48854e8efb3d?auto=format&fit=crop&w=400&q=80',
    'Veg Spring Roll': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
    'Chicken Pakora': 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f5e6?auto=format&fit=crop&w=400&q=80',
    'Cheese Balls': 'https://images.unsplash.com/photo-1589985643862-16bed818b442?auto=format&fit=crop&w=400&q=80',
    'Hummus Plate': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    'Nachos': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80',
    'Onion Bhaji': 'https://images.unsplash.com/photo-1578476122103-44c8128e71c9?auto=format&fit=crop&w=400&q=80',
    'Garlic Bread': 'https://images.unsplash.com/photo-1555939594-58d7cb561049?auto=format&fit=crop&w=400&q=80',
    // Meals (10)
    'Chicken Momo': 'https://images.unsplash.com/photo-1626776870264-38efc6b8a7a1?auto=format&fit=crop&w=400&q=80',
    'Veg Fried Rice': 'https://images.unsplash.com/photo-1601050691394-2f4c1f48e129?auto=format&fit=crop&w=400&q=80',
    'Dal Bhat': 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=400&q=80',
    'Chowmein': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=400&q=80',
    'Tandoori Chicken': 'https://images.unsplash.com/photo-1584233364833-5e6216bb5723?auto=format&fit=crop&w=400&q=80',
    'Paneer Butter Masala': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
    'Vegetable Biryani': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80',
    'Chicken Curry': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    'Mutton Sekuwa': 'https://images.unsplash.com/photo-1633557499155-b2f0f9926c9d?auto=format&fit=crop&w=400&q=80',
    'Spaghetti': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80',
    // Desserts (10)
    'Lava Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    'Gulab Jamun': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80',
    'Rasmalai': 'https://images.unsplash.com/photo-1587305652673-1b0d16bbbd60?auto=format&fit=crop&w=400&q=80',
    'Kulfi': 'https://images.unsplash.com/photo-1565288207996-c9fdfd48c562?auto=format&fit=crop&w=400&q=80',
    'Jalebi': 'https://images.unsplash.com/photo-1549399541-0faa6f692b09?auto=format&fit=crop&w=400&q=80',
    'Fruit Salad': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    'Brownie': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
    'Mango Pudding': 'https://images.unsplash.com/photo-1505252585461-04db1267ae5b?auto=format&fit=crop&w=400&q=80',
    'Cheesecake Slice': 'https://images.unsplash.com/photo-1542827635-5a3e4b06d5a9?auto=format&fit=crop&w=400&q=80',
    'Donut': 'https://images.unsplash.com/photo-1563805042-7684f3dab8c3?auto=format&fit=crop&w=400&q=80',
    // Healthy (10)
    'Quinoa Salad': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80',
    'Smoothie Bowl': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80',
    'Sprout Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    'Avocado Toast': 'https://images.unsplash.com/photo-1484723313321-ca210f7b2da7?auto=format&fit=crop&w=400&q=80',
    'Oats Porridge': 'https://images.unsplash.com/photo-1505253213133-d5f5c7f4ab66?auto=format&fit=crop&w=400&q=80',
    'Protein Shake': 'https://images.unsplash.com/photo-1617127365659-c0bbe3b348e6?auto=format&fit=crop&w=400&q=80',
    'Quinoa Wrap': 'https://images.unsplash.com/photo-1599021237292-c3aa33e3202f?auto=format&fit=crop&w=400&q=80',
    'Greek Yogurt Bowl': 'https://images.unsplash.com/photo-1488477181946-6428a0291840?auto=format&fit=crop&w=400&q=80',
    'Grilled Veg Platter': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    'Beetroot Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    // Combos (10)
    'Veg Thali Combo': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
    'Tea + Samosa': 'https://images.unsplash.com/photo-1597318376707-ea20236bf2e8?auto=format&fit=crop&w=400&q=80',
    'Momo + Noodles': 'https://images.unsplash.com/photo-1626776870264-38efc6b8a7a1?auto=format&fit=crop&w=400&q=80',
    'Breakfast Special Combo': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80',
    'Snack Time Combo': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80',
    'Dinner for Two Combo': 'https://images.unsplash.com/photo-1601050691394-2f4c1f48e129?auto=format&fit=crop&w=400&q=80',
    'Party Platter Combo': 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f5e6?auto=format&fit=crop&w=400&q=80',
    'Healthy Duo Combo': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80',
    'Sweet Indulgence Combo': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    'Family Sharing Combo': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
  };
  
  // Return mapped image or category-based fallback
  if (foodImageMap[item.name]) {
    return foodImageMap[item.name];
  }
  
  // Fallback to category-based food images
  const categoryFallbacks = {
    'c1': 'https://images.unsplash.com/photo-1597318376707-ea20236bf2e8?auto=format&fit=crop&w=400&q=80',
    'c2': 'https://images.unsplash.com/photo-1587735512732-216ea3c7a1cf?auto=format&fit=crop&w=400&q=80',
    'c3': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    'c4': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
    'c5': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    'c6': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80',
  };
  
  return categoryFallbacks[item.categoryId] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
};

function MenuList({ categoryId, onSelectItem, searchQuery, inventory, favorites = [], onToggleFavorite }) {
  const list = useMemo(() => {
    const filtered = MENU_ITEMS.filter(item => item.categoryId === categoryId);
    if (!searchQuery) return filtered;
    return filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [categoryId, searchQuery]);

  return (
    <div className="menu-grid">
      {list.length === 0 && <p>No items found.</p>}
      {list.map(item => {
        const stock = inventory[item.id] ?? item.stock ?? 0;
        const isOut = stock <= 0;
        const isFavorite = favorites.includes(item.id);
        return (
          <div
            key={item.id}
            className={`card ${isOut ? 'out-of-stock' : ''}`}
            onClick={() => !isOut && onSelectItem(item)}
          >
            <div className="card-image" style={{ backgroundImage: `url(${getItemImageUrl(item)})` }} />
            <div className="card-body">
              <div className="card-head-row">
                <h4>{item.name}</h4>
                <div className="card-head-actions">
                  {stock <= 5 && stock > 0 && <span className="low-stock">⚠️ Low</span>}
                  <button
                    className={`favorite-button ${isFavorite ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                    aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
                  >
                    {isFavorite ? '★' : '☆'}
                  </button>
                </div>
              </div>
              <p>{item.description}</p>
              <div className="tag-row">
                {item.tags.map(tag => <span key={`${item.id}-${tag}`} className="badge">{tag}</span>)}
              </div>
              <div className="stock-line">Stock: {stock}</div>
              <div className="price-row">
                <span className="price">Rs {item.price}</span>
                <button disabled={isOut} onClick={(e) => { e.stopPropagation(); if (!isOut) onSelectItem(item); }}>
                  {isOut ? 'Out' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ItemModal({ item, onClose, onAdd }) {
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [note, setNote] = useState("");
  const modifierPrice = selectedModifiers.reduce((s, mod) => s + (mod.price || 0), 0);
  const totalPrice = item.price + modifierPrice;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        {item.modifiers && item.modifiers.length > 0 && (
          <div className="modal-section">
            <h3>Add-ons</h3>
            {item.modifiers.map(mod => (
              <label key={mod.id} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedModifiers.some(m => m.id === mod.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedModifiers([...selectedModifiers, mod]);
                    else setSelectedModifiers(selectedModifiers.filter(m => m.id !== mod.id));
                  }}
                />
                {mod.name} (+Rs {mod.price})
              </label>
            ))}
          </div>
        )}

        <textarea
          className="item-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Special instruction (extra spicy, no onion...)"
        />

        <p className="modal-price">Total: Rs {totalPrice}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onClose}>Close</button>
          <button className="btn-add" onClick={() => onAdd({ ...item, selectedModifiers, note, totalPrice })}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

function RecentItems({ recentItemIds, onAdd }) {
  const items = recentItemIds.map(id => MENU_ITEMS.find(i => i.id === id)).filter(Boolean).slice(0, 5);
  return (
    <div className="recent-card">
      <h4>⏱️ Recent</h4>
      <div className="recent-list">
        {items.map(item => (
          <button key={item.id} onClick={() => onAdd(item)}>{item.name}</button>
        ))}
      </div>
    </div>
  );
}

function FavoritesSection({ items, onAdd }) {
  return (
    <div className="favorite-card">
      <h4>⭐ Favorites</h4>
      {items.length === 0 ? (
        <p>Add favorites from the menu to quickly reorder them.</p>
      ) : (
        <div className="favorite-list">
          {items.map(item => (
            <button key={item.id} onClick={() => onAdd(item)}>{item.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function ComboPresets({ onAddCombo }) {
  return (
    <div className="combo-card">
      <h4>🎁 Combos</h4>
      <div className="combo-list">
        {combos.map(combo => (
          <button key={combo.id} onClick={() => onAddCombo(combo)}>{combo.name} (-Rs {combo.discount})</button>
        ))}
      </div>
    </div>
  );
}

function QRCard({ url }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    if (!navigator.clipboard) {
      window.prompt('Copy the menu link:', url);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      window.alert('Menu link copied to clipboard!');
    } catch (err) {
      window.prompt('Copy the menu link:', url);
    }
  };

  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Sajha QR Menu</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8fbff; }
            .qr-print { display: flex; flex-direction: column; align-items: center; gap: 18px; padding: 28px; }
            .qr-print img { width: 320px; height: 320px; border: 1px solid #dbe7f3; border-radius: 24px; }
            .qr-print h1 { margin: 0; font-size: 24px; color: #102a43; }
            .qr-print p { margin: 0; font-size: 16px; color: #475569; text-align: center; max-width: 420px; }
            .qr-print .url { word-break: break-all; color: #2563eb; }
          </style>
        </head>
        <body>
          <div class="qr-print">
            <h1>Sajha Menu QR</h1>
            <img src="${qrSrc}" alt="Scan to open Sajha menu" />
            <p>Scan this QR code to open the restaurant menu on any mobile device.</p>
            <p class="url">${url}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="dashboard-card qr-card">
      <h4>📱 QR Menu</h4>
      <img className="qr-image" src={qrSrc} alt="Scan to open Sajha menu" />
      <p className="qr-link">Tap “Copy menu link” to share or use “Print QR” for a poster-friendly version.</p>
      <div className="qr-actions">
        <button className="qr-copy" onClick={copyLink}>Copy menu link</button>
        <button className="qr-copy" onClick={printQR}>Print QR</button>
      </div>
    </div>
  );
}

function RestockCard({ inventory = {}, onRestock }) {
  const lowItems = MENU_ITEMS.filter(item => ((inventory[item.id] ?? item.stock ?? 0) <= 5));
  const [amounts, setAmounts] = useState({});

  return (
    <div className="dashboard-card">
      <h4>🔧 Restock</h4>
      {lowItems.length === 0 ? (
        <p>Inventory levels are healthy.</p>
      ) : (
        lowItems.map(item => (
          <div key={item.id} className="restock-row">
            <div>{item.name}: {inventory[item.id] ?? item.stock ?? 0} left</div>
            <div className="restock-input-row">
              <input
                type="number"
                min="1"
                placeholder="Add"
                value={amounts[item.id] || ''}
                onChange={e => setAmounts({ ...amounts, [item.id]: e.target.value })}
              />
              <button onClick={() => {
                const amount = Number(amounts[item.id] || 0);
                if (!amount || amount <= 0) return alert('Enter quantity');
                onRestock(item.id, amount);
                setAmounts({ ...amounts, [item.id]: '' });
              }}>Restock</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function TopSellingCard({ topItems = [] }) {
  return (
    <div className="dashboard-card">
      <h4>🔥 Top Selling Items</h4>
      {topItems.length === 0 ? (
        <p>No sales yet</p>
      ) : (
        <div>
          {topItems.map(item => (
            <div key={item.id}>{item.name}: {item.qty} sold</div>
          ))}
        </div>
      )}
    </div>
  );
}

function SalesDashboard({ sales }) {
  return (
    <div className="dashboard-card">
      <h4>📊 Today's Sales</h4>
      <div>Total: Rs {sales.totalSales}</div>
      <div>Orders: {sales.orderCount}</div>
      <div>💵 {sales.cashCount} | 💳 {sales.cardCount} | 📱 {sales.upiCount}</div>
    </div>
  );
}

function LoyaltyInfo({ phone, points }) {
  if (!phone) return null;
  return (
    <div className="loyalty-card">
      <h4>🤝 Loyalty</h4>
      <div>Phone: {phone}</div>
      <div>Points: {points}</div>
      <div>Next reward at {100 - (points % 100)} pts</div>
    </div>
  );
}

function openPrintWindow(title, htmlContent) {
  const w = window.open('', '_blank', 'width=640,height=760');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>${title}</title><style>
    body{font-family:Arial,Helvetica,sans-serif;margin:16px;color:#222}
    .kot-card{border:1px dashed #444;padding:12px;border-radius:8px;}
    .kot-header{text-align:center;margin-bottom:10px;}
    .kot-items{margin-top:10px;}
    .kot-items li{margin-bottom:6px;}
    .kot-meta{font-size:13px;margin:6px 0;}
  </style></head><body><div class="kot-card">${htmlContent}</div></body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 200);
}

function printKitchenTicket(order) {
  const itemRows = order.items.map(item => {
    const modText = item.selectedModifiers ? item.selectedModifiers.map(m => m.name).join(', ') : '';
    const noteText = item.note ? `<div><strong>Note:</strong> ${item.note}</div>` : '';
    return `<li><strong>${item.name} x${item.qty}</strong> ${modText ? `<small>[${modText}]</small>` : ''}${noteText}</li>`;
  }).join('');

  const html = `
    <div class="kot-header">
      <h2>KOT: #${order.id.slice(-4)}</h2>
      <div class="kot-meta">Table: ${order.table} · ${order.type} · ${order.status.toUpperCase()}</div>
      <div class="kot-meta">Cashier: ${order.cashier} · ${order.date}</div>
    </div>
    <ol class="kot-items">${itemRows}</ol>
    <hr />
    <div class="kot-meta"><strong>Total:</strong> Rs ${order.total}</div>
  `;

  openPrintWindow(`KOT ${order.id}`, html);
}

function formatElapsed(timestamp) {
  if (!timestamp) return '0m';
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function KitchenQueue({ orders, onUpdateStatus, currentRole }) {
  return (
    <div className="kitchen-card">
      <h4>👩‍🍳 Kitchen Queue</h4>
      {orders.length === 0 && <p>No pending</p>}
      {orders.filter(o => o.status !== 'completed').map(order => (
        <div key={order.id} className={`queue-card status-${order.status}`}>
          <div className="queue-summary"><strong>#{order.id.slice(-4)}</strong> | Table {order.table} | {order.type}</div>
          <div className="queue-summary">{order.items.length} items · Rs {order.total}</div>
          <div className="queue-summary">Age: {formatElapsed(order.timestamp)}</div>
          <div className="queue-status">Status: <span>{order.status}</span></div>
          <div className="queue-buttons">
            {currentRole !== 'waiter' && order.status === 'pending' && <button onClick={() => onUpdateStatus(order.id, 'preparing')}>Start</button>}
            {currentRole !== 'waiter' && order.status === 'preparing' && <button onClick={() => onUpdateStatus(order.id, 'ready')}>Ready</button>}
            {currentRole === 'manager' && <button onClick={() => onUpdateStatus(order.id, 'completed')}>Complete</button>}
            <button onClick={() => printKitchenTicket(order)}>Print KOT</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Cart({ table, type, cashier, paymentMethod, setPaymentMethod, gateway, setGateway, customerPhone, userRole }) {
  const { state, dispatch, checkout } = useCart();
  const [tip, setTip] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [splitBill, setSplitBill] = useState(1);

  const subtotal = state.items.reduce((acc, item) => {
    const itemPrice = item.totalPrice || item.price || 0;
    return acc + itemPrice * item.qty;
  }, 0);
  const tax = Number((subtotal * 0.13).toFixed(0));
  const total = Math.max(0, subtotal + tax + Number(tip || 0) - Number(discount || 0));

  const handleCheckout = async () => {
    if (state.items.length === 0) return;
    if (!paymentMethod) { alert("Select payment method"); return; }
    if ((paymentMethod === 'Card' || paymentMethod === 'UPI') && !gateway) { alert("Select gateway (Razorpay / PayU) for digital payment"); return; }
    if (userRole !== 'cashier' && userRole !== 'manager') { alert('Only cashier/manager may checkout'); return; }
    if (!window.confirm(`Confirm Rs ${total} (${paymentMethod}${gateway ? ' / ' + gateway : ''})?`)) return;

    await checkout({
      subtotal, tax, tip: Number(tip), discount: Number(discount), total, type, table, cashier, paymentMethod, splitBill: Number(splitBill), customerPhone
    });
    setTip(0); setDiscount(0); setSplitBill(1);
    alert('Payment successful via ' + (gateway || paymentMethod));
  };

  const printReceipt = () => {
    const today = new Date().toLocaleString();
    const itemRows = state.items.map(i => {
      const price = i.totalPrice || i.price || 0;
      const modText = i.selectedModifiers ? i.selectedModifiers.map(m => m.name).join(', ') : '';
      const noteText = i.note ? `<div><small>Note: ${i.note}</small></div>` : '';
      return `<li><strong>${i.name} x${i.qty}</strong> Rs ${price * i.qty}${modText ? `<div style="font-size:11px;margin-left:8px;">Addons: ${modText}</div>` : ''}${noteText}</li>`;
    }).join('');

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111;">
        <h2 style="text-align:center;margin-bottom:10px;">SAJHA POS Receipt</h2>
        <div><strong>Table:</strong> ${table} | <strong>Type:</strong> ${type}</div>
        <div><strong>Cashier:</strong> ${cashier} | <strong>Date:</strong> ${today}</div>
        <ol style="margin-top:10px;">${itemRows}</ol>
        <hr />
        <div>Subtotal: Rs ${subtotal}</div>
        <div>Tax: Rs ${tax}</div>
        ${tip > 0 ? `<div>Tip: Rs ${tip}</div>` : ''}
        ${discount > 0 ? `<div>Discount: Rs ${discount}</div>` : ''}
        <div><strong>Total: Rs ${total}</strong></div>
        <div>Method: ${paymentMethod}${gateway ? ` / ${gateway}` : ''}</div>
        ${customerPhone ? `<div>Phone: ${customerPhone}</div>` : ''}
      </div>
    `;

    openPrintWindow('SAJHA POS Receipt', html);
  };

  return (
    <div className="cart-box">
      <h2>🛒 Cart ({state.items.length})</h2>
      {state.items.length === 0 && <p>Empty</p>}
      {state.items.map((item, idx) => (
        <div key={`${item.id}-${idx}`} className="cart-row">
          <div>{item.name} x{item.qty}</div>
          <div>Rs {((item.totalPrice || item.price || 0) * item.qty).toFixed(0)}</div>
          <div className="cart-buttons">
            <button onClick={() => dispatch({ type: "decrement", payload: item.id })}>−</button>
            <button onClick={() => dispatch({ type: "increment", payload: item.id })}>+</button>
            <button onClick={() => dispatch({ type: "remove", payload: item.id })}>✕</button>
          </div>
        </div>
      ))}
      {state.items.length > 0 && (
        <>
          <hr />
          <p>Subtotal: Rs {subtotal}</p>
          <p>Tax: Rs {tax}</p>
          <div className="small-input">
            <input type="number" placeholder="Tip" min="0" value={tip} onChange={e => setTip(e.target.value)} />
            <input type="number" placeholder="Discount" min="0" value={discount} onChange={e => setDiscount(e.target.value)} />
            <input type="number" placeholder="Split" min="1" value={splitBill} onChange={e => setSplitBill(e.target.value)} />
          </div>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="">Payment</option>
            <option value="Cash">💵 Cash</option>
            <option value="Card">💳 Card</option>
            <option value="UPI">📱 UPI</option>
          </select>
          {(paymentMethod === 'Card' || paymentMethod === 'UPI') && (
            <select value={gateway} onChange={e => setGateway(e.target.value)}>
              <option value="">Select gateway</option>
              <option value="Razorpay">Razorpay</option>
              <option value="PayU">PayU</option>
            </select>
          )}
          <p className="total">Total: Rs {total}</p>
          {Number(splitBill) > 1 && <p>Per person: Rs {(total / Number(splitBill)).toFixed(0)}</p>}
          <button className="pay-btn" onClick={handleCheckout}>Pay & Complete</button>
          <button className="print-btn" onClick={printReceipt}>🧾 Print</button>
        </>
      )}
    </div>
  );
}

function AppContent() {
  const { state, dispatch, checkout, isLoading } = useCart();
  const [storedUsers, setStoredUsers] = useState(() => {
    try {
      const raw = localStorage.getItem('sajha_pos_users');
      return raw ? JSON.parse(raw) : [{ username: 'admin', password: '123', role: 'manager' }];
    } catch (err) {
      return [{ username: 'admin', password: '123', role: 'manager' }];
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('sajha_pos_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [loginUser, setLoginUser] = useState(currentUser?.username || '');
  const [loginPass, setLoginPass] = useState('');
  const [registerUser, setRegisterUser] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [registerPassConfirm, setRegisterPassConfirm] = useState('');
  const [registerRole, setRegisterRole] = useState('cashier');
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [table, setTable] = useState("Table 1");
  const [type, setType] = useState("Dine-in");
  const [cashier, setCashier] = useState(currentUser?.username || "Cashier A");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [gateway, setGateway] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState(currentUser?.role || "cashier");
  const [deliveryJson, setDeliveryJson] = useState("");
  const [currentView, setCurrentView] = useState("menu");
  const [dbOrders, setDbOrders] = useState([]);
  const [dbInventory, setDbInventory] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState("");
  const [dbLastRefreshed, setDbLastRefreshed] = useState(null);
  const API_BASE = "http://localhost:5000/api";

  const customerPoints = customerPhone ? (state.loyaltyRecords[customerPhone] || 0) : 0;
  const pageUrl = window?.location?.href || '';
  const topSellingItems = Object.values((Array.isArray(state.orderHistory) ? state.orderHistory : []).reduce((acc, order) => {
    (order.items || []).forEach(item => {
      const itemId = item?.id || item?.name || 'unknown';
      if (!acc[itemId]) acc[itemId] = { id: itemId, name: item?.name || 'Unknown item', qty: 0 };
      acc[itemId].qty += item?.qty || 0;
    });
    return acc;
  }, {})).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const saveUsers = (users) => {
    setStoredUsers(users);
    localStorage.setItem('sajha_pos_users', JSON.stringify(users));
  };

  const handleLogin = () => {
    const user = storedUsers.find(u => u.username === loginUser && u.password === loginPass);
    if (!user) {
      setAuthError('Invalid username or password');
      return;
    }
    setCurrentUser(user);
    setIsLoggedIn(true);
    setRole(user.role);
    setCashier(user.username);
    localStorage.setItem('sajha_pos_current_user', JSON.stringify(user));
    setAuthError('');
  };

  const handleRegister = () => {
    if (!registerUser || !registerPass || !registerPassConfirm) {
      setAuthError('Please fill all registration fields');
      return;
    }
    if (registerPass !== registerPassConfirm) {
      setAuthError('Passwords do not match');
      return;
    }
    if (storedUsers.some(u => u.username === registerUser)) {
      setAuthError('Username already exists');
      return;
    }
    const user = { username: registerUser, password: registerPass, role: registerRole };
    const nextUsers = [...storedUsers, user];
    saveUsers(nextUsers);
    setAuthMode('login');
    setAuthError('Account created successfully. Please login.');
    setRegisterUser('');
    setRegisterPass('');
    setRegisterPassConfirm('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('sajha_pos_current_user');
    setRole('cashier');
    setCashier('Cashier A');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        const item = MENU_ITEMS.find(i => i.id === `i${num}`);
        if (item) dispatch({ type: "add", payload: item });
      }
      if (e.key === "s" || e.key === "S") {
        document.querySelector('.searchbar')?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [dispatch]);

  const refreshDbData = async () => {
    setDbLoading(true);
    setDbError("");

    try {
      const [ordersRes, inventoryRes] = await Promise.all([
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/inventory`),
      ]);

      if (!ordersRes.ok) throw new Error('Orders fetch failed');
      if (!inventoryRes.ok) throw new Error('Inventory fetch failed');

      const orders = await ordersRes.json();
      const inventory = await inventoryRes.json();
      setDbOrders(orders);
      setDbInventory(inventory);
      setDbLastRefreshed(new Date());
    } catch (err) {
      console.error(err);
      setDbError('Failed to load database records.');
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    if (currentView !== 'data') return;
    refreshDbData();
  }, [currentView]);

  if (!isLoggedIn) {
    return (
      <div className="app-shell">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: 'linear-gradient(90deg, #0f9d58, #42a5f5)' }}>
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>🍽️ Sajha POS Access</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '340px', background: 'rgba(255,255,255,0.94)', padding: '22px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <button onClick={() => { setAuthMode('login'); setAuthError(''); }} style={{ flex: 1, marginRight: '6px', padding: '10px', borderRadius: '6px', border: authMode === 'login' ? '2px solid #2E7D32' : '1px solid #ccc', background: authMode === 'login' ? '#E8F5E9' : '#fff' }}>Login</button>
              <button onClick={() => { setAuthMode('register'); setAuthError(''); }} style={{ flex: 1, marginLeft: '6px', padding: '10px', borderRadius: '6px', border: authMode === 'register' ? '2px solid #2E7D32' : '1px solid #ccc', background: authMode === 'register' ? '#E8F5E9' : '#fff' }}>Register</button>
            </div>
            {authMode === 'login' ? (
              <>
                <input type="text" placeholder="Username" value={loginUser} onChange={e => setLoginUser(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="password" placeholder="Password" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <button onClick={handleLogin} style={{ padding: '12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Login</button>
              </>
            ) : (
              <>
                <input type="text" placeholder="Choose username" value={registerUser} onChange={e => setRegisterUser(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="password" placeholder="Password" value={registerPass} onChange={e => setRegisterPass(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="password" placeholder="Confirm password" value={registerPassConfirm} onChange={e => setRegisterPassConfirm(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <select value={registerRole} onChange={e => setRegisterRole(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="cashier">Cashier</option>
                  <option value="manager">Manager</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="waiter">Waiter</option>
                </select>
                <button onClick={handleRegister} style={{ padding: '12px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Create account</button>
              </>
            )}
            {authError && <div style={{ padding: '10px', background: '#fdecea', color: '#b71c1c', borderRadius: '6px' }}>{authError}</div>}
            <div style={{ fontSize: '14px', color: '#333' }}>
              {authMode === 'login' ? (
                <>Need an account? <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} style={{ border: 'none', padding: 0, color: '#0d47a1', textDecoration: 'underline', cursor: 'pointer', background: 'transparent' }}>Register</button></>
              ) : (
                <>Already registered? <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} style={{ border: 'none', padding: 0, color: '#0d47a1', textDecoration: 'underline', cursor: 'pointer', background: 'transparent' }}>Login</button></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app-shell">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: 'linear-gradient(90deg, #0f9d58, #42a5f5)' }}>
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>🍽️ Loading Sajha POS...</h1>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #4CAF50', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const handleAddCombo = (combo) => {
    combo.items.forEach(itemId => {
      const item = MENU_ITEMS.find(i => i.id === itemId);
      if (item) dispatch({ type: "add", payload: item });
    });
  };

  const onUpdateOrderStatus = (orderId, status) => dispatch({ type: "updateOrderStatus", payload: { orderId, status } });

  const importDeliveryOrders = () => {
    try {
      const orders = JSON.parse(deliveryJson);
      if (Array.isArray(orders)) {
        orders.forEach(async (o, idx) => {
          const converted = {
            subtotal: o.subtotal || 0,
            tax: o.tax || 0,
            tip: o.tip || 0,
            discount: o.discount || 0,
            total: o.total || 0,
            type: "Delivery",
            table: "Delivery",
            cashier: cashier,
            paymentMethod: o.paymentMethod || "UPI",
            splitBill: 1,
            customerPhone: o.customerPhone || "",
          };
          await checkout(converted);
        });
        alert(`Imported ${orders.length} delivery orders`);
      } else {
        alert("Enter valid JSON array");
      }
    } catch (er) {
      alert("JSON parse failed");
    }
  };

  if (currentView === 'kitchen') {
    return (
      <div className={`app-shell ${state.darkMode ? 'dark' : ''}`}>
        <header>
          <div className="header-top">
            <h1>👩‍🍳 Kitchen Display</h1>
            <div>
              <button className="dark-toggle" onClick={() => dispatch({ type: "toggleDarkMode" })}>{state.darkMode ? '☀️' : '🌙'}</button>
            </div>
          </div>
          <div className="top-controls">
            <select value={currentView} onChange={e => setCurrentView(e.target.value)}>
              <option value="menu">🍽️ Menu</option>
              <option value="kitchen">👩‍🍳 Kitchen</option>
              <option value="dashboard">📊 Dashboard</option>
              <option value="history">📜 History</option>
              <option value="data">🗄️ Data</option>
            </select>
          </div>
        </header>
        <div style={{ padding: '20px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <KitchenQueue orders={state.kitchenQueue} onUpdateStatus={onUpdateOrderStatus} currentRole={role} />
        </div>
      </div>
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className={`app-shell ${state.darkMode ? 'dark' : ''}`}>
        <header>
          <div className="header-top">
            <h1>📊 Dashboard</h1>
            <div>
              <button className="dark-toggle" onClick={() => dispatch({ type: "toggleDarkMode" })}>{state.darkMode ? '☀️' : '🌙'}</button>
            </div>
          </div>
          <div className="top-controls">
            <select value={currentView} onChange={e => setCurrentView(e.target.value)}>
              <option value="menu">🍽️ Menu</option>
              <option value="kitchen">👩‍🍳 Kitchen</option>
              <option value="dashboard">📊 Dashboard</option>
              <option value="history">📜 History</option>
              <option value="data">🗄️ Data</option>
            </select>
          </div>
        </header>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <SalesDashboard sales={state.salesSummary} />
          <div className="dashboard-card">
            <h4>📦 Inventory Alerts</h4>
            {Object.entries(state.inventory).filter(([id, qty]) => qty <= 5).map(([id, qty]) => {
              const item = MENU_ITEMS.find(i => i.id === id);
              return <div key={id}>{item?.name}: {qty} left</div>;
            })}
            {Object.values(state.inventory).every(q => q > 5) && <p>All good!</p>}
          </div>
          <div className="dashboard-card">
            <h4>🤝 Loyalty</h4>
            {Object.entries(state.loyaltyRecords).slice(0, 10).map(([phone, points]) => (
              <div key={phone}>{phone}: {points} pts</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'history') {
    return (
      <div className={`app-shell ${state.darkMode ? 'dark' : ''}`}>
        <header>
          <div className="header-top">
            <h1>📜 Order History</h1>
            <div>
              <button className="dark-toggle" onClick={() => dispatch({ type: "toggleDarkMode" })}>{state.darkMode ? '☀️' : '🌙'}</button>
            </div>
          </div>
          <div className="top-controls">
            <select value={currentView} onChange={e => setCurrentView(e.target.value)}>
              <option value="menu">🍽️ Menu</option>
              <option value="kitchen">👩‍🍳 Kitchen</option>
              <option value="dashboard">📊 Dashboard</option>
              <option value="history">📜 History</option>
              <option value="data">🗄️ Data</option>
            </select>
          </div>
        </header>
        <div style={{ padding: '20px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          {state.orderHistory.length === 0 && <p>No orders yet</p>}
          {state.orderHistory.map(order => (
            <div key={order.id} className="queue-card">
              <div><strong>#{order.id.slice(-4)}</strong> | {order.date} | Rs {order.total} | {order.paymentMethod}</div>
              <div>Table: {order.table} | Type: {order.type} | Cashier: {order.cashier}</div>
              <div>Items: {order.items.map(i => `${i.name} x${i.qty}`).join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentView === 'data') {
    return (
      <div className={`app-shell ${state.darkMode ? 'dark' : ''}`}>
        <header>
          <div className="header-top">
            <h1>🗄️ Database Inspector</h1>
            <div>
              <button className="dark-toggle" onClick={() => dispatch({ type: "toggleDarkMode" })}>{state.darkMode ? '☀️' : '🌙'}</button>
            </div>
          </div>
          <div className="top-controls">
            <select value={currentView} onChange={e => setCurrentView(e.target.value)}>
              <option value="menu">🍽️ Menu</option>
              <option value="kitchen">👩‍🍳 Kitchen</option>
              <option value="dashboard">📊 Dashboard</option>
              <option value="history">📜 History</option>
              <option value="data">🗄️ Data</option>
            </select>
            <button onClick={refreshDbData} style={{ marginLeft: '12px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}>Refresh</button>
          </div>
        </header>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="dashboard-card">
            <h4>🧾 Orders from MongoDB</h4>
            {dbLoading ? <p>Loading...</p> : dbError ? <p>{dbError}</p> : dbOrders.length === 0 ? <p>No orders found.</p> : dbOrders.map(order => (
              <div key={order._id || order.id} className="queue-card">
                <div><strong>#{(order._id || order.id).toString().slice(-4)}</strong> | {new Date(order.timestamp).toLocaleString()} | Rs {order.total}</div>
                <div>Table: {order.tableId || order.table} | Type: {order.type}</div>
                <div>Payment: {order.paymentMethod} | Status: {order.status}</div>
                <div>Items: {order.items?.map(i => `${i.name} x${i.qty}`).join(', ')}</div>
              </div>
            ))}
          </div>
          <div className="dashboard-card">
            <h4>📦 Inventory from MongoDB</h4>
            {dbLoading ? <p>Loading...</p> : dbError ? <p>{dbError}</p> : dbInventory.length === 0 ? <p>No inventory found.</p> : dbInventory.map(item => (
              <div key={item._id || item.itemId} style={{ marginBottom: '10px' }}>
                <strong>{item.itemId}</strong>: {item.stock} in stock
              </div>
            ))}
            {dbLastRefreshed && <p style={{ marginTop: '12px', fontSize: '13px', color: '#555' }}>Last refreshed: {dbLastRefreshed.toLocaleTimeString()}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-shell ${state.darkMode ? 'dark' : ''}`}>
      <header>
        <div className="header-top">
          <h1>🍽️ Sajha POS</h1>
          <div>
            Role: <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="cashier">Cashier</option>
              <option value="kitchen">Kitchen</option>
              <option value="manager">Manager</option>
              <option value="waiter">Waiter</option>
            </select>
            <button onClick={handleLogout}>Logout</button>
            <button className="dark-toggle" onClick={() => dispatch({ type: "toggleDarkMode" })}>{state.darkMode ? '☀️' : '🌙'}</button>
          </div>
        </div>
        <div className="top-controls">
          <select value={table} onChange={e => setTable(e.target.value)}>{tables.map(t => <option key={t.id} value={t.name}>{t.name} ({t.seats} seats)</option>)}</select>
          <select value={type} onChange={e => setType(e.target.value)}>{['Dine-in','Takeaway','Delivery'].map(v => <option key={v}>{v}</option>)}</select>
          <input value={cashier} onChange={e => setCashier(e.target.value)} placeholder="Cashier" />
          <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Customer phone" />
          <select value={currentView} onChange={e => setCurrentView(e.target.value)}>
            <option value="menu">🍽️ Menu</option>
            <option value="kitchen">👩‍🍳 Kitchen</option>
            <option value="dashboard">📊 Dashboard</option>
            <option value="history">📜 History</option>
            <option value="data">🗄️ Data</option>
          </select>
        </div>
      </header>

      <div className="layout">
        <aside className="category-list">
          {categories.map(cat => (<button key={cat.id} className={activeCat === cat.id ? 'active' : ''} onClick={() => setActiveCat(cat.id)}>{cat.icon} {cat.name}</button>))}
          <div className="delivery-import">
            <h4>Delivery import</h4>
            <textarea value={deliveryJson} onChange={e => setDeliveryJson(e.target.value)} placeholder='[{"items":["Masala Tea"],"total":100}]' style={{minHeight:'80px'}} />
            <button onClick={importDeliveryOrders}>Import</button>
          </div>
        </aside>

        <main>
          <SearchBar value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <FavoritesSection items={state.favorites.map(id => MENU_ITEMS.find(i => i.id === id)).filter(Boolean)} onAdd={(item) => dispatch({ type: 'add', payload: item })} />
          <RecentItems recentItemIds={state.recentItems} onAdd={(item) => dispatch({ type: 'add', payload: item })} />
          <ComboPresets onAddCombo={handleAddCombo} />
          <MenuList categoryId={activeCat} onSelectItem={setSelectedItem} searchQuery={searchQuery} inventory={state.inventory} favorites={state.favorites} onToggleFavorite={(id) => dispatch({ type: 'toggleFavorite', payload: id })} />
        </main>

        <aside className="cart-panel">
          <LoyaltyInfo phone={customerPhone} points={customerPoints} />
          <SalesDashboard sales={state.salesSummary} />
          <TopSellingCard topItems={topSellingItems} />
          <QRCard url={pageUrl} />
          <RestockCard inventory={state.inventory} onRestock={(itemId, amount) => dispatch({ type: 'restock', payload: { itemId, amount } })} />
          <Cart table={table} type={type} cashier={cashier} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} gateway={gateway} setGateway={setGateway} customerPhone={customerPhone} userRole={role} />
          <KitchenQueue orders={state.kitchenQueue} onUpdateStatus={onUpdateOrderStatus} currentRole={role} />
        </aside>
      </div>

      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onAdd={(item) => { dispatch({ type: "add", payload: item }); setSelectedItem(null); }} />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
