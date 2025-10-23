import { useEffect, useState } from 'react'
import { useTickets } from '@/hooks/useTickets'
import { useBookings } from '@/hooks/useBookings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
// @ts-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// @ts-ignore
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Ticket, Search, XCircle, RefreshCw, Plus } from 'lucide-react'
import { TicketResponse, BookingResponse } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function TicketsManagement() {
  const { searchTickets, issueTickets, voidTicket, refundTicket, loading } = useTickets()
  const { searchBookings } = useBookings()
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState('')

  // Search filters
  const [ticketNumberSearch, setTicketNumberSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    loadTickets()
    loadBookings()
  }, [])

  const loadTickets = async () => {
    try {
      const data = await searchTickets()
      setTickets(data)
    } catch (error) {
      toast.error('Failed to load tickets')
    }
  }

  const loadBookings = async () => {
    try {
      const data = await searchBookings()
      // Filter only confirmed bookings without tickets
      setBookings(data.filter(b => b.status === 'CONFIRMED'))
    } catch (error) {
      console.error('Failed to load bookings')
    }
  }

  const handleSearch = async () => {
    try {
      const data = await searchTickets(
        ticketNumberSearch || undefined,
        statusFilter !== 'ALL' ? statusFilter : undefined
      )
      setTickets(data)
    } catch (error) {
      toast.error('Search failed')
    }
  }

  const handleIssueTicket = async () => {
    if (!selectedBooking) {
      toast.error('Please select a booking')
      return
    }

    try {
      await issueTickets({ bookingId: selectedBooking })
      setShowIssueDialog(false)
      setSelectedBooking('')
      loadTickets()
      loadBookings()
    } catch (error) {
      toast.error('Failed to issue ticket')
    }
  }

  const handleVoidTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to void this ticket?')) return

    try {
      await voidTicket(ticketId)
      loadTickets()
    } catch (error) {
      toast.error('Failed to void ticket')
    }
  }

  const handleRefundTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to refund this ticket?')) return

    try {
      await refundTicket(ticketId)
      loadTickets()
    } catch (error) {
      toast.error('Failed to refund ticket')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ISSUED: 'default',
      VOIDED: 'destructive',
      REFUNDED: 'secondary',
      USED: 'outline',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tickets Management</h1>
          <p className="text-gray-500 mt-1">Issue and manage tickets</p>
        </div>
        <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Issue Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="booking">Select Booking *</Label>
                <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a confirmed booking" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookings.map((booking) => (
                      <SelectItem key={booking.bookingId} value={booking.bookingId}>
                        {booking.pnr} - {booking.flight.origin} to {booking.flight.destination} ({booking.passengers.length} pax)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleIssueTicket} disabled={loading || !selectedBooking} className="flex-1">
                  Issue Ticket
                </Button>
                <Button variant="outline" onClick={() => setShowIssueDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticketNumber">Ticket Number</Label>
              <Input
                id="ticketNumber"
                placeholder="Enter ticket number"
                value={ticketNumberSearch}
                onChange={(e) => setTicketNumberSearch(e.target.value)}
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
                  <SelectItem value="ISSUED">Issued</SelectItem>
                  <SelectItem value="VOIDED">Voided</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                  <SelectItem value="USED">Used</SelectItem>
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
                  setTicketNumberSearch('')
                  setStatusFilter('ALL')
                  loadTickets()
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tickets found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Taxes</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                    <TableCell>{ticket.bookingId}</TableCell>
                    <TableCell>{ticket.passengerId}</TableCell>
                    <TableCell>{formatCurrency(ticket.fareAmount)}</TableCell>
                    <TableCell>{formatCurrency(ticket.taxAmount)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(ticket.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(ticket.issuedAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {ticket.status === 'ISSUED' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVoidTicket(ticket.ticketId)}
                              title="Void Ticket"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRefundTicket(ticket.ticketId)}
                              title="Refund Ticket"
                            >
                              <RefreshCw className="h-4 w-4" />
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
    </div>
  )
}
