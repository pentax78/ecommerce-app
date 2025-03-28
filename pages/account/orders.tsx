import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrderHistory() {
  const orders: Order[] = [
    {
      id: 'ORD-12345',
      date: '2023-05-15',
      status: 'delivered',
      total: 1450,
      items: [
        { name: 'Premium Laptop', quantity: 1, price: 1200 },
        { name: 'Wireless Mouse', quantity: 1, price: 250 }
      ]
    },
    {
      id: 'ORD-12344',
      date: '2023-04-28',
      status: 'shipped',
      total: 800,
      items: [
        { name: 'Smartphone', quantity: 1, price: 800 }
      ]
    }
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <nav className="space-y-2">
            <Link href="/account">
              <a className="block px-4 py-2 hover:bg-gray-100 rounded">Dashboard</a>
            </Link>
            <Link href="/account/orders">
              <a className="block px-4 py-2 bg-gray-100 rounded font-medium">My Orders</a>
            </Link>
            <Link href="/account/settings">
              <a className="block px-4 py-2 hover:bg-gray-100 rounded">Account Settings</a>
            </Link>
          </nav>
        </div>
        
        <div className="md:col-span-3">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-lg mb-4">You haven't placed any orders yet</p>
              <Link href="/products">
                <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                    <div>
                      <span className="font-medium mr-4">Order #{order.id}</span>
                      <span className="text-gray-600 text-sm">{order.date}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link href={`/account/orders/${order.id}`}>
                        <a className="text-blue-600 hover:underline">View Details</a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
