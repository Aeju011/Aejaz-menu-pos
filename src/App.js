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
            <div className="card-image" style={{ backgroundImage: `url(${item.imageUrl})` }} />
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
  const { state, dispatch } = useCart();
  const [tip, setTip] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [splitBill, setSplitBill] = useState(1);

  const subtotal = state.items.reduce((acc, item) => {
    const itemPrice = item.totalPrice || item.price || 0;
    return acc + itemPrice * item.qty;
  }, 0);
  const tax = Number((subtotal * 0.13).toFixed(0));
  const total = Math.max(0, subtotal + tax + Number(tip || 0) - Number(discount || 0));

  const handleCheckout = () => {
    if (state.items.length === 0) return;
    if (!paymentMethod) { alert("Select payment method"); return; }
    if ((paymentMethod === 'Card' || paymentMethod === 'UPI') && !gateway) { alert("Select gateway (Razorpay / PayU) for digital payment"); return; }
    if (userRole !== 'cashier' && userRole !== 'manager') { alert('Only cashier/manager may checkout'); return; }
    if (!window.confirm(`Confirm Rs ${total} (${paymentMethod}${gateway ? ' / ' + gateway : ''})?`)) return;

    dispatch({
      type: "checkout",
      payload: { subtotal, tax, tip: Number(tip), discount: Number(discount), total, type, table, cashier, paymentMethod, splitBill: Number(splitBill), customerPhone }
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
  const { state, dispatch } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [table, setTable] = useState("Table 1");
  const [type, setType] = useState("Dine-in");
  const [cashier, setCashier] = useState("Cashier A");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [gateway, setGateway] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("cashier");
  const [deliveryJson, setDeliveryJson] = useState("");
  const [currentView, setCurrentView] = useState("menu");

  const customerPoints = customerPhone ? (state.loyaltyRecords[customerPhone] || 0) : 0;
  const topSellingItems = Object.values((Array.isArray(state.orderHistory) ? state.orderHistory : []).reduce((acc, order) => {
    (order.items || []).forEach(item => {
      const itemId = item?.id || item?.name || 'unknown';
      if (!acc[itemId]) acc[itemId] = { id: itemId, name: item?.name || 'Unknown item', qty: 0 };
      acc[itemId].qty += item?.qty || 0;
    });
    return acc;
  }, {})).sort((a, b) => b.qty - a.qty).slice(0, 5);

  const handleLogin = () => {
    if (loginUser === 'admin' && loginPass === '123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
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

  if (!isLoggedIn) {
    return (
      <div className="app-shell">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: 'linear-gradient(90deg, #0f9d58, #42a5f5)' }}>
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>🍽️ Sajha POS Login</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', background: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '8px' }}>
            <input type="text" placeholder="Username" value={loginUser} onChange={e => setLoginUser(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="password" placeholder="Password" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button onClick={handleLogin} style={{ padding: '10px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
          </div>
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
        orders.forEach((o, idx) => {
          const now = new Date();
          const id = `d-${now.getTime()}-${idx}`;
          const converted = {
            id,
            items: (o.items || []).map(name => MENU_ITEMS.find(i => i.name === name) || { name, qty: 1, price: 0 }),
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
            status: "pending",
            date: now.toLocaleString(),
          };
          dispatch({ type: "checkout", payload: converted });
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
            <button onClick={() => setIsLoggedIn(false)}>Logout</button>
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
