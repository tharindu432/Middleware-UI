import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/StatCard'
// @ts-ignore
import { useAdmin } from '@/hooks/useAdmin'
import { Users, DollarSign, Plane, TrendingUp } from 'lucide-react'
import { DashboardStatistics } from '@/types'

export default function AdminDashboard() {
  const { getDashboardStats, loading } = useAdmin()
  const [stats, setStats] = useState<DashboardStatistics | null>(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Agents"
          value={stats?.totalAgents || 0}
          icon={Users}
          description={`${stats?.activeAgents || 0} active agents`}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          description="All time revenue"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Plane}
          description={`${stats?.todayBookings || 0} today`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats?.monthlyRevenue || 0).toLocaleString()}`}
          icon={TrendingUp}
          description="This month"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Credit Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              {stats?.pendingTopups || 0} pending approvals
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-primary">
                {stats?.creditUtilization || 0}%
              </div>
              <p className="text-gray-500 mt-2">Average utilization</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
