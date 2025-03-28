import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function OrderSuccess() {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    // Here you could send the session_id to your API to verify the payment
    // and update the order status in your database
  }, [session_id]);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-lg mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
          {session_id && (
            <span className="block mt-2 text-sm">
              Order reference: {session_id}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/account/orders">
            <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
              View Your Orders
            </button>
          </Link>
          <Link href="/products">
            <button className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50 transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
