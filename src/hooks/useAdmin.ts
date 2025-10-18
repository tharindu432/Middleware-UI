import { useState } from 'react'
import { DashboardStats, AuditLog, SystemSettings, CreditTopupApproval, ApiResponse } from '@/types'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

export const useAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null)

  // Dashboard
  const getDashboardStats = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<DashboardStats>>('/admin/dashboard')
      setDashboardStats(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Credit Approvals
  const getPendingCreditApprovals = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<CreditTopupApproval[]>>('/admin/credit-approvals/pending')
      return response.data.data
    } catch (error) {
      console.error('Error fetching pending credit approvals:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const approveCreditTopup = async (topupId: string) => {
    setLoading(true)
    try {
      await axiosInstance.post<ApiResponse>(`/admin/credit-approvals/${topupId}/approve`)
      toast.success('Credit top-up approved successfully!')
    } catch (error) {
      console.error('Error approving credit top-up:', error)
      toast.error('Failed to approve credit top-up')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const rejectCreditTopup = async (topupId: string, reason: string) => {
    setLoading(true)
    try {
      await axiosInstance.post<ApiResponse>(`/admin/credit-approvals/${topupId}/reject`, { reason })
      toast.success('Credit top-up rejected')
    } catch (error) {
      console.error('Error rejecting credit top-up:', error)
      toast.error('Failed to reject credit top-up')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Audit Logs
  const getAuditLogs = async (startDate?: string, endDate?: string, userType?: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<AuditLog[]>>('/admin/audit-logs', {
        params: { startDate, endDate, userType },
      })
      setAuditLogs(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // System Settings
  const getSystemSettings = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<SystemSettings>>('/admin/settings')
      setSystemSettings(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching system settings:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateSystemSettings = async (settings: Partial<SystemSettings>) => {
    setLoading(true)
    try {
      const response = await axiosInstance.put<ApiResponse<SystemSettings>>('/admin/settings', settings)
      setSystemSettings(response.data.data)
      toast.success('System settings updated successfully!')
      return response.data.data
    } catch (error) {
      console.error('Error updating system settings:', error)
      toast.error('Failed to update system settings')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    dashboardStats,
    auditLogs,
    systemSettings,
    getDashboardStats,
    getPendingCreditApprovals,
    approveCreditTopup,
    rejectCreditTopup,
    getAuditLogs,
    getSystemSettings,
    updateSystemSettings,
  }
}
