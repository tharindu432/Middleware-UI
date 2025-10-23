import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// @ts-ignore
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore
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

interface Ticket {
  ticketId: string
  ticketNumber: string
  bookingId: string
  pnr: string
  passenger: Passenger
  status: string
  issueDate: string
  fareAmount: number
  taxAmount: number
  totalAmount: number
  currency: string
  voidDate?: string
  refundDate?: string
  refundAmount?: number
}

export default function TicketsManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [statusFilter])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)

      const response = await axiosInstance.get(`/admin/tickets?${params.toString()}`)
      setTickets(response.data.data || [])
    } catch (error) {
      console.error('Error loading tickets:', error)
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return 'success'
      case 'VOIDED':
        return 'destructive'
      case 'REFUNDED':
        return 'secondary'
      case 'PENDING':
        return 'default'
      default:
        return 'default'
    }
  }

  const filteredTickets = tickets.filter((ticket) =>
    ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${ticket.passenger.firstName} ${ticket.passenger.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tickets Management</h1>
        <p className="text-gray-500 mt-1">View and manage all issued tickets</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ticket number, PNR, or passenger name..."
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
              <option value="ISSUED">Issued</option>
              <option value="VOIDED">Voided</option>
              <option value="REFUNDED">Refunded</option>
            </select>
            <Button onClick={loadTickets}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Number</TableHead>
                <TableHead>PNR</TableHead>
                <TableHead>Passenger</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                    <TableCell>{ticket.pnr}</TableCell>
                    <TableCell>
                      {ticket.passenger.title} {ticket.passenger.firstName} {ticket.passenger.lastName}
                    </TableCell>
                    <TableCell>{formatCurrency(ticket.fareAmount)}</TableCell>
                    <TableCell>{formatCurrency(ticket.taxAmount)}</TableCell>
                    <TableCell>{formatCurrency(ticket.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.issueDate ? formatDate(ticket.issueDate) : '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(ticket)}
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

      {/* Ticket Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details - {selectedTicket?.ticketNumber}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket Number</p>
                    <p className="font-medium">{selectedTicket.ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PNR</p>
                    <p className="font-medium">{selectedTicket.pnr}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge variant={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="font-medium">
                      {selectedTicket.issueDate ? formatDate(selectedTicket.issueDate) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fare Amount</p>
                    <p className="font-medium">{formatCurrency(selectedTicket.fareAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tax Amount</p>
                    <p className="font-medium">{formatCurrency(selectedTicket.taxAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium text-lg">{formatCurrency(selectedTicket.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Currency</p>
                    <p className="font-medium">{selectedTicket.currency}</p>
                  </div>
                  {selectedTicket.voidDate && (
                    <div>
                      <p className="text-sm text-gray-500">Void Date</p>
                      <p className="font-medium">{formatDate(selectedTicket.voidDate)}</p>
                    </div>
                  )}
                  {selectedTicket.refundDate && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Refund Date</p>
                        <p className="font-medium">{formatDate(selectedTicket.refundDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Refund Amount</p>
                        <p className="font-medium">{formatCurrency(selectedTicket.refundAmount || 0)}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Passenger Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {selectedTicket.passenger.title} {selectedTicket.passenger.firstName}{' '}
                      {selectedTicket.passenger.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passenger Type</p>
                    <p className="font-medium">{selectedTicket.passenger.passengerType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{selectedTicket.passenger.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{selectedTicket.passenger.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passport Number</p>
                    <p className="font-medium">{selectedTicket.passenger.passportNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passport Expiry</p>
                    <p className="font-medium">{selectedTicket.passenger.passportExpiry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="font-medium">{selectedTicket.passenger.nationality}</p>
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
