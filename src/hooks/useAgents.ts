import { useState } from 'react'
import { Agent, AgentRequest, AgentStatistics, ApiResponse } from '@/types'
import axiosInstance from '@/lib/axios'
import toast from 'react-hot-toast'

export const useAgents = () => {
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [profile, setProfile] = useState<Agent | null>(null)

  // Agent profile endpoints
  const getAgentProfile = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<Agent>>('/agents/profile')
      setProfile(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching agent profile:', error)
      throw error
    } finally {
      setLoading(false)
    }

  }

  const updateAgentProfile = async (profileData: AgentRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.put<ApiResponse<Agent>>('/agents/profile', profileData)
      setProfile(response.data.data)
      toast.success('Profile updated successfully!')
      return response.data.data
    } catch (error) {
      console.error('Error updating agent profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getAgentStatistics = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<ApiResponse<AgentStatistics>>('/agents/statistics')
      return response.data.data
    } catch (error) {
      console.error('Error fetching agent statistics:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Admin endpoints for managing agents
  const getAllAgents = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get<Agent[]>('/admin/agents')
      setAgents(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching all agents:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createAgent = async (agentData: AgentRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.post<ApiResponse<Agent>>('/admin/agents', agentData)
      toast.success('Agent created successfully!')
      return response.data.data
    } catch (error) {
      console.error('Error creating agent:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateAgent = async (agentId: string, agentData: AgentRequest) => {
    setLoading(true)
    try {
      const response = await axiosInstance.put<ApiResponse<Agent>>(`/admin/agents/${agentId}`, agentData)
      toast.success('Agent updated successfully!')
      return response.data.data
    } catch (error) {
      console.error('Error updating agent:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteAgent = async (agentId: string) => {
    setLoading(true)
    try {
      await axiosInstance.delete(`/admin/agents/${agentId}`)
      toast.success('Agent deleted successfully!')
    } catch (error) {
      console.error('Error deleting agent:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    agents,
    profile,
    getAgentProfile,
    updateAgentProfile,
    getAgentStatistics,
    getAllAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  }
}
