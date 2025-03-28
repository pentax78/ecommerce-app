import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to Our Store</h1>
      <nav>
        <ul className="nav-list">
          <li><Link href="/products">Products</Link></li>
          <li><Link href="/cart">Shopping Cart</Link></li>
          <li><Link href="/account">My Account</Link></li>
        </ul>
      </nav>
    </div>
  );
}
