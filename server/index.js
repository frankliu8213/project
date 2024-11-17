import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupStripeModule } from './modules/stripe';

// 加载环境变量
dotenv.config();

const app = express();

// 配置 CORS
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

// 使用 Stripe 模块
app.use('/api', setupStripeModule(
  app,
  process.env.STRIPE_SECRET_KEY,
  process.env.STRIPE_WEBHOOK_SECRET
));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 