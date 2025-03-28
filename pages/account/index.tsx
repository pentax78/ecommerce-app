import Link from 'next/link';

export default function AccountDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <nav className="space-y-2">
            <Link href="/account">
              <a className="block px-4 py-2 bg-gray-100 rounded font-medium">Dashboard</a>
            </Link>
            <Link href="/account/orders">
              <a className="block px-4 py-2 hover:bg-gray-100 rounded">My Orders</a>
            </Link>
            <Link href="/account/settings">
              <a className="block px-4 py-2 hover:bg-gray-100 rounded">Account Settings</a>
            </Link>
            <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded">
              Logout
            </button>
          </nav>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">Recent Orders</h3>
                <p className="text-gray-600">You have 3 recent orders</p>
                <Link href="/account/orders">
                  <a className="text-blue-600 hover:underline mt-2 inline-block">View all</a>
                </Link>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium mb-2">Account Details</h3>
                <p className="text-gray-600">John Doe</p>
                <p className="text-gray-600">john.doe@example.com</p>
                <Link href="/account/settings">
                  <a className="text-blue-600 hover:underline mt-2 inline-block">Edit</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
