import { useState } from 'react'
import { BookingRequest, BookingResponse } from '@/types'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

export const useBookings = () => {
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<BookingResponse[]>([])

  const createBooking = async (bookingData: BookingRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<BookingResponse>('/bookings', bookingData)
      toast.success('Booking created successfully!')
      return response.data
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getBookingDetails = async (bookingId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<BookingResponse>(`/bookings/${bookingId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching booking details:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchBookings = async (pnr?: string, status?: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<BookingResponse[]>('/bookings', {
        params: { pnr, status },
      })
      setBookings(response.data)
      return response.data
    } catch (error) {
      console.error('Error searching bookings:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<BookingResponse>(`/bookings/${bookingId}/cancel`)
      toast.success('Booking cancelled successfully!')
      return response.data
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const reconfirmBooking = async (bookingId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<BookingResponse>(`/bookings/${bookingId}/reconfirm`)
      toast.success('Booking reconfirmed successfully!')
      return response.data
    } catch (error) {
      console.error('Error reconfirming booking:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    bookings,
    createBooking,
    getBookingDetails,
    searchBookings,
    cancelBooking,
    reconfirmBooking,
  }
}
