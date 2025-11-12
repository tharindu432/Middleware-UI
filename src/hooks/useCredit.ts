import { useState } from 'react'
import { CreditTransaction, CreditTopupRequest, ApiResponse } from '@/types'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

export const useCredit = () => {
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])

  const getCreditBalance = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<number>>('/credit/balance')
      setBalance(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching credit balance:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getCreditTransactions = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<CreditTransaction[]>>('/credit/transactions')
      setTransactions(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching credit transactions:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }


  const requestCreditTopup = async (topupData: CreditTopupRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<ApiResponse<CreditTransaction>>('/credit/topup', topupData)
      toast.success('Credit top-up requested successfully!')
      return response.data.data
    } catch (error) {
      console.error('Error requesting credit top-up:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getTopupHistory = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<CreditTransaction[]>>('/credit/topups')
      return response.data.data
    } catch (error) {
      console.error('Error fetching top-up history:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    balance,
    transactions,
    getCreditBalance,
    getCreditTransactions,
    requestCreditTopup,
    getTopupHistory,
  }
}
