import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/StatCard'
import { useAgents } from '@/hooks/useAgents'
import { useCredit } from '@/hooks/useCredit'
import { Calendar, Ticket, DollarSign, Wallet } from 'lucide-react'
import { AgentStatistics } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function AgentDashboard() {
  const { getAgentStatistics, loading: statsLoading } = useAgents()
  const { getCreditBalance, balance } = useCredit()
  const [stats, setStats] = useState<AgentStatistics | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [statsData] = await Promise.all([
        getAgentStatistics(),
        getCreditBalance(),
      ])
      setStats(statsData)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your bookings and track performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          description="All time bookings"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          description="Total earnings"
        />
        <StatCard
          title="Credit Balance"
          value={formatCurrency(balance)}
          icon={Wallet}
          description={`${stats?.creditUtilization || 0}% utilized`}
        />
        <StatCard
          title="Active Employees"
          value={stats?.activeEmployees || 0}
          icon={Ticket}
          description="Team members"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/agent/flights"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">Search Flights</h3>
              <p className="text-sm text-gray-500">Find and book flights for your customers</p>
            </a>
            <a
              href="/agent/bookings"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">View Bookings</h3>
              <p className="text-sm text-gray-500">Manage your existing bookings</p>
            </a>
            <a
              href="/agent/credit"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold">Request Credit</h3>
              <p className="text-sm text-gray-500">Top up your credit balance</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-orange-500">
                {formatCurrency(stats?.pendingPayments || 0)}
              </div>
              <p className="text-gray-500 mt-2">Outstanding amount</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
