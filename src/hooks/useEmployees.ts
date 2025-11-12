import { useState } from 'react'
import { Employee, EmployeeRequest, ApiResponse } from '@/types'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

export const useEmployees = () => {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])

  const getAllEmployees = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<Employee[]>('/employees')
      setEmployees(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createEmployee = async (employeeData: EmployeeRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<ApiResponse<Employee>>('/employees', employeeData)
      toast.success('Employee created successfully!')
      return response.data.data
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateEmployee = async (employeeId: string, employeeData: EmployeeRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.put<ApiResponse<Employee>>(`/employees/${employeeId}`, employeeData)
      toast.success('Employee updated successfully!')
      return response.data.data
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteEmployee = async (employeeId: string) => {
    setLoading(true)
    try {
      await axiosInstance.delete<ApiResponse>(`/employees/${employeeId}`)
      toast.success('Employee deleted successfully!')
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deactivateEmployee = async (employeeId: string) => {
    setLoading(true)
    try {
      await axiosInstance.post<ApiResponse>(`/employees/${employeeId}/deactivate`)
      toast.success('Employee deactivated successfully!')
    } catch (error) {
      console.error('Error deactivating employee:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetEmployeePassword = async (employeeId: string, newPassword: string) => {
    setLoading(true)
    try {
      await axiosInstance.post<ApiResponse>(`/employees/${employeeId}/reset-password`, {
        newPassword,
      })
      toast.success('Password reset successfully!')
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    employees,
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    deactivateEmployee,
    resetEmployeePassword,
  }
}

export default useEmployees;

