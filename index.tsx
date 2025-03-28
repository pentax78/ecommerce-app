import { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const Home: NextPage = () => {
  const [cart, setCart] = useState<{product: Product; quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const featuredProducts: Product[] = [
    {
      id: 1,
      name: 'Premium Laptop',
      price: 1299.99,
      image: '/images/laptop.jpg',
      category: 'Electronics',
      description: 'High-performance laptop with 16GB RAM and 1TB SSD'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 199.99,
      image: '/images/headphones.jpg',
      category: 'Audio',
      description: 'Noise-cancelling wireless headphones with 30h battery life'
    },
    {
      id: 3,
      name: 'Smart Fitness Watch',
      price: 249.99,
      image: '/images/watch.jpg',
      category: 'Fitness',
      description: 'Track your workouts and health metrics with precision'
    }
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id 
            ? {...item, quantity: item.quantity + 1} 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      // 1. Create Stripe checkout session
      const stripe = await stripePromise;
      const { data } = await axios.post('/api/checkout', {
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        customer: {
          name: 'John Doe', // In real app, get from form
          email: 'john@example.com'
        }
      });

      // 2. Create invoice in 1C
      await axios.post('/api/accounting/create-invoice', {
        orderNumber: data.id,
        customer: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: cartTotal,
        status: 'pending'
      });

      // 3. Redirect to Stripe
      await stripe?.redirectToCheckout({ sessionId: data.id });

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>NextShop - Your Premium E-Commerce Destination</title>
        <meta name="description" content="Discover amazing products at great prices" />
      </Head>

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-xl z-50 w-80 transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex border-b pb-4">
                    <Image 
                      src={item.product.image}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                      <div className="flex items-center mt-1">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 border rounded-l"
                        >
                          -
                        </button>
                        <span className="px-3 border-t border-b">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 border rounded-r"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600">NextShop</h1>
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        {/* ... (same hero section as before) ... */}
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="relative h-64">
                  <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                  <p className="text-gray-800 font-medium mt-2">${product.price.toFixed(2)}</p>
                  <div className="mt-4 flex justify-between">
                    <Link href={`/products/${product.id}`}>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                    </Link>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... (rest of the sections remain the same) ... */}
    </>
  );
};

export default Home;
