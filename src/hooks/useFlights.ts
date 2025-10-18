import { useState } from 'react'
import { FlightSearchRequest, FlightResponse } from '@/types'
import axiosInstance from '@/lib/axios'

export const useFlights = () => {
  const [loading, setLoading] = useState(false)
  const [flights, setFlights] = useState<FlightResponse[]>([])

  const searchFlights = async (searchParams: FlightSearchRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<FlightResponse[]>('/flights/search', {
        params: searchParams,
      })
      setFlights(response.data)
      return response.data
    } catch (error) {
      console.error('Error searching flights:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getFlightDetails = async (availabilityId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<FlightResponse>(`/flights/${availabilityId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching flight details:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getFareRules = async (fareId: string) => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<string>(`/flights/fares/${fareId}/rules`)
      return response.data
    } catch (error) {
      console.error('Error fetching fare rules:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    flights,
    searchFlights,
    getFlightDetails,
    getFareRules,
  }
}
