import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/StatCard'
import { Calendar, Ticket, Plane, CheckCircle } from 'lucide-react'

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome! Here's your workspace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Bookings"
          value={0}
          icon={Calendar}
          description="This month"
        />
        <StatCard
          title="Tickets Issued"
          value={0}
          icon={Ticket}
          description="This month"
        />
        <StatCard
          title="Flights Searched"
          value={0}
          icon={Plane}
          description="This week"
        />
        <StatCard
          title="Completed Tasks"
          value={0}
          icon={CheckCircle}
          description="This week"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <a
            href="/employee/flights"
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">Search Flights</h3>
            <p className="text-sm text-gray-500">Find available flights for customers</p>
          </a>
          <a
            href="/employee/bookings"
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">View Bookings</h3>
            <p className="text-sm text-gray-500">Check booking status and details</p>
          </a>
          <a
            href="/employee/tickets"
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">Manage Tickets</h3>
            <p className="text-sm text-gray-500">Issue and manage tickets</p>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
