import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查 URL 中的支付会话 ID
    const queryParams = new URLSearchParams(window.location.search)
    const newSessionId = queryParams.get('session_id')
    
    if (newSessionId) {
      console.log('检测到支付会话ID:', newSessionId)
      // 存储支付会话 ID
      localStorage.setItem('stripeSessionId', newSessionId)
      // 验证支付状态
      verifyPayment(newSessionId)
      // 清除 URL 参数
      window.history.replaceState({}, '', window.location.pathname)
    } else {
      // 检查本地存储的支付会话 ID
      const sessionId = localStorage.getItem('stripeSessionId')
      if (sessionId) {
        console.log('使用存储的支付会话ID验证:', sessionId)
        verifyPayment(sessionId)
      } else {
        setIsLoading(false)
      }
    }
  }, [])

  // 向后端验证支付状态
  const verifyPayment = async (sessionId: string) => {
    try {
      setIsLoading(true)
      console.log('正在验证支付状态...')
      
      // 调用后端接口验证支付
      const response = await fetch(`http://localhost:3000/verify-payment/${sessionId}`)
      const data = await response.json()
      
      console.log('支付验证结果:', data)
      
      // 如果支付成功，更新状态为高级账户
      if (data.isPremium) {
        console.log('支付成功，升级为高级账户')
        setIsPremium(true)
      }
    } catch (error) {
      console.error('验证支付失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 重置账户状态
  const handleReset = () => {
    setIsPremium(false)
    localStorage.removeItem('stripeSessionId')
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  return (
    <div className="container">
      <h1>{isPremium ? '高级账户' : '普通账户'}</h1>
      
      {!isPremium && (
        <a 
        // Stripe 支付链接
          href="https://buy.stripe.com/test_eVaeXIbw3brt6nCaEE" 
          className="upgrade-button"
        >
          升级到高级账户
        </a>
      )}
      
      <button onClick={handleReset} className="reset-button">
        恢复
      </button>
    </div>
  )
}

export default App