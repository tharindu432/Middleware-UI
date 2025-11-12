import { useEffect, useState } from 'react'
import { useBookings } from '@/hooks/useBookings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Eye, XCircle, RefreshCw, Plane, Users } from 'lucide-react'
import { BookingResponse } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function BookingsManagement() {
  const { searchBookings, getBookingDetails, cancelBooking, reconfirmBooking, loading } = useBookings()
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Search filters
  const [pnrSearch, setPnrSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      const data = await searchBookings()
      setBookings(data)
    } catch (error) {
      toast.error('Failed to load bookings')
    }
  }

  const handleSearch = async () => {
    try {
      const data = await searchBookings(
        pnrSearch || undefined,
        statusFilter !== 'ALL' ? statusFilter : undefined
      )
      setBookings(data)
    } catch (error) {
      toast.error('Search failed')
    }
  }

  const handleViewDetails = async (bookingId: string) => {
    try {
      const booking = await getBookingDetails(bookingId)
      setSelectedBooking(booking)
      setShowDetails(true)
    } catch (error) {
      toast.error('Failed to load booking details')
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await cancelBooking(bookingId)
      loadBookings()
    } catch (error) {
      toast.error('Failed to cancel booking')
    }
  }

  const handleReconfirm = async (bookingId: string) => {
    try {
      await reconfirmBooking(bookingId)
      loadBookings()
    } catch (error) {
      toast.error('Failed to reconfirm booking')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      CONFIRMED: 'default',
      PENDING: 'secondary',
      CANCELLED: 'destructive',
      TICKETED: 'default',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-gray-500 mt-1">Manage your flight bookings</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pnr">PNR / Booking Reference</Label>
              <Input
                id="pnr"
                placeholder="Enter PNR"
                value={pnrSearch}
                onChange={(e) => setPnrSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="TICKETED">Ticketed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} disabled={loading} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPnrSearch('')
                  setStatusFilter('ALL')
                  loadBookings()
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PNR</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell className="font-medium">{booking.pnr}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{booking.flight.origin}</span>
                        <Plane className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold">{booking.flight.destination}</span>
                      </div>
                      <div className="text-xs text-gray-500">{booking.flight.airline} {booking.flight.flightNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {booking.passengers.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(booking.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{formatCurrency(booking.totalAmount)}</div>
                      <div className="text-xs text-gray-500">{booking.currency}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(booking.bookingId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {booking.status === 'CONFIRMED' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReconfirm(booking.bookingId)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.bookingId)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">PNR</Label>
                  <p className="font-semibold text-lg">{selectedBooking.pnr}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">Booking Date</Label>
                  <p>{formatDateTime(selectedBooking.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Total Amount</Label>
                  <p className="font-semibold text-lg">
                    {formatCurrency(selectedBooking.totalAmount)} {selectedBooking.currency}
                  </p>
                </div>
              </div>

              {/* Flight Details */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Flight Details
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500">Airline</Label>
                        <p>{selectedBooking.flight.airline}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Flight Number</Label>
                        <p>{selectedBooking.flight.flightNumber}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">From</Label>
                        <p className="font-semibold">{selectedBooking.flight.origin}</p>
                        <p className="text-sm text-gray-500">{formatDateTime(selectedBooking.flight.departureDate)}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">To</Label>
                        <p className="font-semibold">{selectedBooking.flight.destination}</p>
                        <p className="text-sm text-gray-500">{formatDateTime(selectedBooking.flight.arrivalDate)}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Cabin Class</Label>
                        <p>{selectedBooking.flight.cabinClass}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Duration</Label>
                        <p>{selectedBooking.flight.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Passengers */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Passengers ({selectedBooking.passengers.length})
                </h3>
                <div className="space-y-3">
                  {selectedBooking.passengers.map((passenger, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-gray-500">Name</Label>
                            <p className="font-semibold">
                              {passenger.title} {passenger.firstName} {passenger.lastName}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Type</Label>
                            <Badge variant="secondary">{passenger.passengerType}</Badge>
                          </div>
                          <div>
                            <Label className="text-gray-500">Gender</Label>
                            <p>{passenger.gender === 'M' ? 'Male' : 'Female'}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Date of Birth</Label>
                            <p>{passenger.dateOfBirth}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Passport</Label>
                            <p>{passenger.passportNumber}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Nationality</Label>
                            <p>{passenger.nationality}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
