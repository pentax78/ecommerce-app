import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { accountingService } from '../../services/accounting';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-03-16'
});

interface CheckoutRequest {
  items: Array<{
    id: number;
    quantity: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customer } = req.body as CheckoutRequest;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Product ${item.id}`
          },
          unit_amount: 10000 // $100.00 in cents
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/order/canceled`,
      customer_email: customer.email,
      metadata: {
        customer_name: customer.name,
        customer_phone: customer.phone
      }
    });

    // Create invoice in 1C accounting system
    await accountingService.createInvoice({
      customer,
      items,
      payment_id: session.id,
      total_amount: items.reduce((sum, item) => sum + (item.quantity * 10000), 0) / 100,
      currency: 'USD',
      status: 'pending'
    });

    return res.status(200).json({ id: session.id });
  } catch (error: any) {
    console.error('Checkout processing error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
