import express from 'express';
import Stripe from 'stripe';

export function setupStripeModule(app, stripeSecretKey, webhookSecret) {
  const stripe = new Stripe(stripeSecretKey);
  const router = express.Router();

  // Webhook 处理
  router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
      
      // 处理支付成功事件
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // 处理支付成功逻辑
        console.log('Payment successful:', session);
      }

      res.json({received: true});
    } catch (err) {
      console.error('Webhook Error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // 验证支付状态
  router.get('/verify-payment/:sessionId', async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      const isPremium = session.payment_status === 'paid';
      res.json({ isPremium });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
} 