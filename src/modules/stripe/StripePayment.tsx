import { useState, useEffect } from 'react'

interface StripePaymentProps {
  apiUrl: string;
  paymentLink: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: Error) => void;
}

export const useStripePayment = ({
  apiUrl,
  paymentLink,
  onPaymentSuccess,
  onPaymentError
}: StripePaymentProps) => {
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const verifyPayment = async (sessionId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/verify-payment/${sessionId}`)
      const data = await response.json()
      
      if (data.isPremium) {
        setIsPremium(true)
        onPaymentSuccess?.()
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      onPaymentError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const newSessionId = queryParams.get('session_id')
    
    if (newSessionId) {
      localStorage.setItem('stripeSessionId', newSessionId)
      verifyPayment(newSessionId)
      window.history.replaceState({}, '', window.location.pathname)
    } else {
      const sessionId = localStorage.getItem('stripeSessionId')
      if (sessionId) {
        verifyPayment(sessionId)
      } else {
        setIsLoading(false)
      }
    }
  }, [])

  const reset = () => {
    setIsPremium(false)
    localStorage.removeItem('stripeSessionId')
  }

  return {
    isPremium,
    isLoading,
    reset,
    paymentLink
  }
} 