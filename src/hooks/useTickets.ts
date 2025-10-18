import { useState } from 'react'
import { TicketIssueRequest, TicketResponse } from '@/types'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

export const useTickets = () => {
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<TicketResponse[]>([])

  const issueTickets = async (issueData: TicketIssueRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<TicketResponse[]>('/tickets/issue', issueData)
      toast.success('Tickets issued successfully!')
      return response.data
    } catch (error) {
      console.error('Error issuing tickets:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getTicketDetails = async (ticketId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<TicketResponse>(`/tickets/${ticketId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching ticket details:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchTickets = async (ticketNumber?: string, status?: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<TicketResponse[]>('/tickets', {
        params: { ticketNumber, status },
      })
      setTickets(response.data)
      return response.data
    } catch (error) {
      console.error('Error searching tickets:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const voidTicket = async (ticketId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<TicketResponse>(`/tickets/${ticketId}/void`)
      toast.success('Ticket voided successfully!')
      return response.data
    } catch (error) {
      console.error('Error voiding ticket:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refundTicket = async (ticketId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<TicketResponse>(`/tickets/${ticketId}/refund`)
      toast.success('Ticket refunded successfully!')
      return response.data
    } catch (error) {
      console.error('Error refunding ticket:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    tickets,
    issueTickets,
    getTicketDetails,
    searchTickets,
    voidTicket,
    refundTicket,
  }
}
