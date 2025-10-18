import { useState } from 'react'
import { SalesReportResponse } from '@/types'
import axiosInstance from '@/lib/axios'

export const useReports = () => {
  const [loading, setLoading] = useState(false)

  const getSalesReport = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<SalesReportResponse>('/reports/sales', {
        params: { startDate, endDate },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching sales report:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getBookingReport = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<SalesReportResponse>('/reports/bookings', {
        params: { startDate, endDate },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching booking report:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getFinancialReport = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<SalesReportResponse>('/reports/financial', {
        params: { startDate, endDate },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching financial report:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getAgentPerformanceReport = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<SalesReportResponse>('/reports/agent-performance', {
        params: { startDate, endDate },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching agent performance report:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getCreditUtilizationReport = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<SalesReportResponse>('/reports/credit-utilization')
      return response.data
    } catch (error) {
      console.error('Error fetching credit utilization report:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getRouteAnalysisReport = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<SalesReportResponse>('/reports/route-analysis', {
        params: { startDate, endDate },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching route analysis report:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    getSalesReport,
    getBookingReport,
    getFinancialReport,
    getAgentPerformanceReport,
    getCreditUtilizationReport,
    getRouteAnalysisReport,
  }
}
