import { useState } from 'react'
import { InvoiceResponse } from '@/types'
import axiosInstance from '@/lib/axios'

export const useInvoices = () => {
  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([])

  const getAllInvoices = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<InvoiceResponse[]>('/invoices')
      setInvoices(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getInvoiceDetails = async (invoiceId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<InvoiceResponse>(`/invoices/${invoiceId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching invoice details:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoicePdf = async (invoiceId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob',
      })

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice_${invoiceId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading invoice PDF:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    invoices,
    getAllInvoices,
    getInvoiceDetails,
    downloadInvoicePdf,
  }
}
