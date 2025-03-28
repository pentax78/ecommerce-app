import Link from 'next/link';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductsPage() {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: 'Premium Laptop',
      price: 1200,
      description: 'High-performance laptop with SSD storage',
      image: '/images/laptop.jpg'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 250,
      description: 'Noise-cancelling Bluetooth headphones',
      image: '/images/headphones.jpg'
    },
    {
      id: 3,
      name: 'Smartphone',
      price: 800,
      description: 'Latest model with advanced camera',
      image: '/images/phone.jpg'
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                <Link href={`/checkout/${product.id}`}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
