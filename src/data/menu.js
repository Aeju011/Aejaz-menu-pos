export const categories = [
  { id: 'c1', name: 'Beverages', icon: '☕' },
  { id: 'c2', name: 'Snacks', icon: '🍟' },
  { id: 'c3', name: 'Meals', icon: '🍽️' },
  { id: 'c4', name: 'Desserts', icon: '🍰' },
  { id: 'c5', name: 'Healthy', icon: '🥗' },
  { id: 'c6', name: 'Combos', icon: '🎁' },
];

export const items = [
  { id: 'i1', categoryId: 'c1', name: 'Masala Tea', description: 'Classic Nepali spiced tea', price: 45, imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80', tags: ['Best Seller'], stock: 50, modifiers: [{ id: 'm1', name: 'Extra Spicy', price: 5 }] },
  { id: 'i2', categoryId: 'c1', name: 'Espresso', description: 'Intense black espresso', price: 85, imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80', tags: ['Strong'], stock: 30, modifiers: [{ id: 'm2', name: 'Add Milk', price: 10 }] },
  { id: 'i3', categoryId: 'c2', name: 'Paneer Samosa', description: 'Crispy cottage cheese samosa', price: 45, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', tags: ['Vegetarian'], stock: 20, modifiers: [{ id: 'm3', name: 'Green Chutney', price: 0 }] },
  { id: 'i4', categoryId: 'c2', name: 'French Fries', description: 'Golden crunchy fries', price: 120, imageUrl: 'https://images.unsplash.com/photo-1587735512732-216ea3c7a1cf?auto=format&fit=crop&w=400&q=80', tags: ['Popular'], stock: 15, modifiers: [{ id: 'm4', name: 'Cheese Dip', price: 20 }] },
  { id: 'i5', categoryId: 'c3', name: 'Chicken Momo', description: 'Steamed chicken dumplings', price: 170, imageUrl: 'https://images.unsplash.com/photo-1626776870264-38efc6b8a7a1?auto=format&fit=crop&w=400&q=80', tags: ['Best Seller'], stock: 25, modifiers: [{ id: 'm5', name: 'Extra Sauce', price: 10 }] },
  { id: 'i6', categoryId: 'c3', name: 'Veg Fried Rice', description: 'Mixed vegetable fried rice', price: 210, imageUrl: 'https://images.unsplash.com/photo-1601050691394-2f4c1f48e129?auto=format&fit=crop&w=400&q=80', tags: [], stock: 18, modifiers: [{ id: 'm6', name: 'Egg', price: 50 }] },
  { id: 'i7', categoryId: 'c4', name: 'Lava Cake', description: 'Warm chocolate lava cake', price: 180, imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80', tags: ['Dessert'], stock: 12, modifiers: [{ id: 'm7', name: 'Ice Cream', price: 40 }] },
  { id: 'i8', categoryId: 'c5', name: 'Quinoa Salad', description: 'Fresh quinoa salad bowl', price: 240, imageUrl: 'https://images.unsplash.com/photo-1556228724-4a7fafea0176?auto=format&fit=crop&w=400&q=80', tags: ['Healthy'], stock: 20, modifiers: [{ id: 'm8', name: 'Extra Avocado', price: 35 }] },
  { id: 'i9', categoryId: 'c5', name: 'Smoothie Bowl', description: 'Mixed berry smoothie bowl', price: 220, imageUrl: 'https://images.unsplash.com/photo-1542728920-a1f0f2f10012?auto=format&fit=crop&w=400&q=80', tags: ['Gluten-Free'], stock: 22, modifiers: [{ id: 'm9', name: 'Chia Seeds', price: 15 }] },
  { id: 'i10', categoryId: 'c6', name: 'Veg Thali Combo', description: 'Rice, dal, sabzi, roti combo', price: 350, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', tags: ['Combo'], stock: 14, modifiers: [] },
  { id: 'i11', categoryId: 'c6', name: 'Tea + Samosa', description: 'Chai and 2 samosas combo', price: 85, imageUrl: 'https://images.unsplash.com/photo-1523402515376-2ca7f06c5a6b?auto=format&fit=crop&w=400&q=80', tags: ['Combo'], stock: 40, modifiers: [] },
  { id: 'i12', categoryId: 'c6', name: 'Momo + Noodles', description: 'Chicken momo with veg noodles', price: 300, imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80', tags: ['Combo'], stock: 20, modifiers: [] },
];

export const combos = [
  { id: 'combo1', name: 'Breakfast', items: ['i1', 'i3'], discount: 20 },
  { id: 'combo2', name: 'Lunch', items: ['i5', 'i6'], discount: 30 },
  { id: 'combo3', name: 'Snack', items: ['i4', 'i2'], discount: 15 },
];

export const tables = [
  { id: 't1', name: 'Table 1', seats: 2, status: 'available' },
  { id: 't2', name: 'Table 2', seats: 4, status: 'available' },
  { id: 't3', name: 'Table 3', seats: 6, status: 'available' },
  { id: 't4', name: 'Table 4', seats: 2, status: 'available' },
  { id: 't5', name: 'Table 5', seats: 4, status: 'available' },
  { id: 't6', name: 'Table 6', seats: 8, status: 'available' },
  { id: 't7', name: 'Table 7', seats: 2, status: 'available' },
  { id: 't8', name: 'Table 8', seats: 4, status: 'available' },
];
