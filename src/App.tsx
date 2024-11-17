import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查 localStorage
    const sessionId = localStorage.getItem('stripeSessionId')
    
    if (sessionId) {
      verifyPayment(sessionId)
    } else {
      setIsLoading(false)
    }

    // 检查 URL 参数
    const queryParams = new URLSearchParams(window.location.search)
    const newSessionId = queryParams.get('session_id')
    
    if (newSessionId) {
      localStorage.setItem('stripeSessionId', newSessionId)
      verifyPayment(newSessionId)
      // 清除 URL 参数
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const verifyPayment = async (sessionId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://localhost:3000/verify-payment/${sessionId}`)
      const data = await response.json()
      
      if (data.isPremium) {
        setIsPremium(true)
      }
    } catch (error) {
      console.error('验证支付状态失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

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