import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

// 初始化 Stripe，需要填入你的 Secret Key
const stripe = new Stripe('sk_test_51QLSpCK1ceZmaWi8poexAUieZRYHG2PfLJ3bnuhzHHIRoAQRETBuBQTwH3SQtVXNTq35BhsRAvcG8T0KYhydg4hn00MtsVGuPS');
const app = express();

// Webhook 需要使用 raw 格式的请求体，必须在其他中间件之前配置
const webhookMiddleware = express.raw({ type: 'application/json' });

// 处理 Stripe Webhook 回调的路由
app.post('/webhook', webhookMiddleware, async (req, res) => {
  // 获取 Stripe 签名，用于验证请求来自 Stripe
  const sig = req.headers['stripe-signature'];
    // Webhook Secret，用于验证 Webhook 请求的合法性
  const endpointSecret = "whsec_a9641f837afd4a06800e913c8cde79e770c008b0cbbfd58beae16f8dd636c1a4";

  try {
    console.log('收到 Stripe Webhook 事件');
    // 验证并构造事件对象
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );

    console.log('Stripe 事件类型:', event.type);

    // 处理支付成功事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('支付成功，会话信息:', session);
      // 这里可以添加更新用户会员状态的逻辑
    }

    res.json({received: true});
  } catch (err) {
    console.error('Webhook 处理错误:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// 其他路由的中间件
app.use(cors());
app.use(express.json());

// 验证支付状态的接口
app.get('/verify-payment/:sessionId', async (req, res) => {
  try {
    console.log('正在验证支付状态，会话ID:', req.params.sessionId);
    // 从 Stripe 获取支付会话信息
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    console.log('Stripe 返回的支付状态:', session.payment_status);
    // 返回支付状态给前端
    res.json({ isPremium: session.payment_status === 'paid' });
  } catch (error) {
    console.error('验证支付出错:', error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('服务器运行在端口 3000');
}); 