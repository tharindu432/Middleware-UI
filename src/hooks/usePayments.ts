import { useState } from 'react'
import { PaymentRequest, PaymentResponse } from '@/types'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

export const usePayments = () => {
  const [loading, setLoading] = useState(false)
  const [payments, setPayments] = useState<PaymentResponse[]>([])

  const makePayment = async (paymentData: PaymentRequest) => {
    setLoading(true)
    try {
      // Ensure payment method matches backend enum naming
      const payload: PaymentRequest = {
        ...paymentData,
        paymentMethod: (paymentData.paymentMethod || '').toUpperCase(),
      } as any

      const response = await axiosInstance.post<PaymentResponse>('/payments/pay', payload)
      toast.success('Payment processed successfully!')
      return response.data
    } catch (error: any) {
      console.error('Error making payment:', error)
      // Re-throw so callers can show the message
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getPaymentHistory = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<PaymentResponse[]>('/payments')
      setPayments(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching payment history:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getPaymentDetails = async (paymentId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<PaymentResponse>(`/payments/${paymentId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching payment details:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    payments,
    makePayment,
    getPaymentHistory,
    getPaymentDetails,
  }
}
