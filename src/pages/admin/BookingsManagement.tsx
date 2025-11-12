import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, Eye } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Passenger {
  passengerId: string
  passengerType: string
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  passportNumber: string
  passportExpiry: string
  nationality: string
}

interface Booking {
  bookingId: string
  pnr: string
  kiuBookingReference: string
  agentId: string
  agentName: string
  status: string
  totalAmount: number
  commission: number
  currency: string
  contactEmail: string
  contactPhone: string
  passengers: Passenger[]
  createdAt: string
  updatedAt: string
}

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [statusFilter])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)

      const response = await axiosInstance.get(`/admin/bookings?${params.toString()}`)
      setBookings(response.data.data || [])
    } catch (error) {
      console.error('Error loading bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'default'
      case 'TICKETED':
        return 'success'
      case 'CANCELLED':
        return 'destructive'
      case 'PENDING':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const filteredBookings = bookings.filter((booking) =>
    booking.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-gray-500 mt-1">View and manage all flight bookings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by PNR, agent, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="TICKETED">Ticketed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button onClick={loadBookings}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PNR</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Passengers</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell className="font-medium">{booking.pnr}</TableCell>
                    <TableCell>{booking.agentName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{booking.contactEmail}</div>
                        <div className="text-gray-500">{booking.contactPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.passengers?.length || 0}</TableCell>
                    <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(booking.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details - {selectedBooking?.pnr}</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">PNR</p>
                    <p className="font-medium">{selectedBooking.pnr}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">KIU Reference</p>
                    <p className="font-medium">{selectedBooking.kiuBookingReference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Agent</p>
                    <p className="font-medium">{selectedBooking.agentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{formatCurrency(selectedBooking.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commission</p>
                    <p className="font-medium">{formatCurrency(selectedBooking.commission)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Email</p>
                    <p className="font-medium">{selectedBooking.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Phone</p>
                    <p className="font-medium">{selectedBooking.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">{formatDate(selectedBooking.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated At</p>
                    <p className="font-medium">{formatDate(selectedBooking.updatedAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Passengers */}
              <Card>
                <CardHeader>
                  <CardTitle>Passengers ({selectedBooking.passengers?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedBooking.passengers?.map((passenger, index) => (
                      <div key={passenger.passengerId} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Passenger {index + 1}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Name</p>
                            <p>{passenger.title} {passenger.firstName} {passenger.lastName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p>{passenger.passengerType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Gender</p>
                            <p>{passenger.gender}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date of Birth</p>
                            <p>{passenger.dateOfBirth}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Passport Number</p>
                            <p>{passenger.passportNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Nationality</p>
                            <p>{passenger.nationality}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
