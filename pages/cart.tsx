import { useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Premium Laptop',
      price: 1200,
      quantity: 1,
      image: '/images/laptop.jpg'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 250,
      quantity: 2,
      image: '/images/headphones.jpg'
    }
  ]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link href="/products">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex border-b py-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover mr-4"
                />
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 border rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 border rounded-r"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t my-4"></div>
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
