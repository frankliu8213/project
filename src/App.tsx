import { useStripePayment } from './modules/stripe/StripePayment'
import { PaymentButtons } from './modules/stripe/components/PaymentButtons'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL
const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK

function App() {
  const { isPremium, isLoading, reset, paymentLink } = useStripePayment({
    apiUrl: API_URL,
    paymentLink: STRIPE_PAYMENT_LINK,
    onPaymentSuccess: () => {
      console.log('Payment successful!')
    },
    onPaymentError: (error) => {
      console.error('Payment failed:', error)
    }
  })

  if (isLoading) {
    return <div>加载中...</div>
  }

  return (
    <div className="container">
      <h1>{isPremium ? '高级账户' : '普通账户'}</h1>
      <PaymentButtons 
        isPremium={isPremium}
        paymentLink={paymentLink}
        onReset={reset}
      />
    </div>
  )
}

export default App