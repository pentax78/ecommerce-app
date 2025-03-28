import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { accountingService } from '../../../services/accounting';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
  typescript: true
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        // Update order status in database
        await accountingService.updateInvoiceStatus({
          payment_id: session.id,
          status: 'paid',
          payment_date: new Date().toISOString()
        });
        
        console.log(`Successfully processed payment for session: ${session.id}`);
      } catch (error) {
        console.error(`Error updating order status: ${error}`);
      }
      break;

    case 'checkout.session.expired':
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout session expired: ${expiredSession.id}`);
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${paymentIntent.id}`);
      break;

    case 'charge.refunded':
      const charge = event.data.object as Stripe.Charge;
      console.log(`Charge refunded: ${charge.id}`);
      
      try {
        // Update order status to refunded
        await accountingService.updateInvoiceStatus({
          payment_id: charge.payment_intent as string,
          status: 'refunded',
          payment_date: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error updating refund status: ${error}`);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}

export const config = {
  api: {
    bodyParser: false
  }
};
