import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const stripe = new Stripe('sk_test_51QLSpCK1ceZmaWi8poexAUieZRYHG2PfLJ3bnuhzHHIRoAQRETBuBQTwH3SQtVXNTq35BhsRAvcG8T0KYhydg4hn00MtsVGuPS');
const app = express();

// 重要：webhook 路由必须在其他中间件之前
const webhookMiddleware = express.raw({ type: 'application/json' });

// Webhook 路由
app.post('/webhook', webhookMiddleware, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = "whsec_a9641f837afd4a06800e913c8cde79e770c008b0cbbfd58beae16f8dd636c1a4";

  try {
    console.log('收到 webhook 事件');
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );

    console.log('事件类型:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('支付成功:', session);
      // 这里可以存储支付状态
    }

    res.json({received: true});
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// 其他路由使用 JSON 中间件
app.use(cors());
app.use(express.json());

// 验证支付状态的接口
app.get('/verify-payment/:sessionId', async (req, res) => {
  try {
    console.log('验证支付 sessionId:', req.params.sessionId);
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    console.log('支付状态:', session.payment_status);
    res.json({ isPremium: session.payment_status === 'paid' });
  } catch (error) {
    console.error('验证支付错误:', error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
}); 