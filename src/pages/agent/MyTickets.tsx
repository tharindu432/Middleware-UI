import { useEffect, useState } from 'react'
import { useTickets } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// @ts-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// @ts-ignore
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Eye, Ticket as TicketIcon, User, FileText, Download } from 'lucide-react'
import { TicketResponse } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function MyTickets() {
  const { searchTickets, getTicketDetails, voidTicket, refundTicket, loading } = useTickets()
  const [tickets, setTickets] = useState<TicketResponse[]>([])
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Search filters
  const [ticketSearch, setTicketSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const data = await searchTickets()
      setTickets(data)
    } catch (error) {
      toast.error('Failed to load tickets')
    }
  }

  const handleSearch = async () => {
    try {
      const data = await searchTickets(
        ticketSearch || undefined,
        statusFilter !== 'ALL' ? statusFilter : undefined
      )
      setTickets(data)
    } catch (error) {
      toast.error('Search failed')
    }
  }

  const handleViewDetails = async (ticketId: string) => {
    try {
      const ticket = await getTicketDetails(ticketId)
      setSelectedTicket(ticket)
      setShowDetails(true)
    } catch (error) {
      toast.error('Failed to load ticket details')
    }
  }

  const handleVoidTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to void this ticket? This action cannot be undone.')) return

    try {
      await voidTicket(ticketId)
      toast.success('Ticket voided successfully')
      loadTickets()
      setShowDetails(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to void ticket')
    }
  }

  const handleRefundTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to refund this ticket?')) return

    try {
      await refundTicket(ticketId)
      toast.success('Ticket refunded successfully')
      loadTickets()
      setShowDetails(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to refund ticket')
    }
  }

  // @ts-ignore
    const handleDownloadTicket = (ticket: TicketResponse) => {
    // TODO: Implement ticket download/print functionality
    toast.success('Downloading ticket...')
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ISSUED: 'bg-green-100 text-green-800 border-green-300',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      VOIDED: 'bg-red-100 text-red-800 border-red-300',
      REFUNDED: 'bg-blue-100 text-blue-800 border-blue-300',
    }
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <p className="text-gray-500 mt-1">View and manage issued tickets</p>
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
              <Label htmlFor="ticketNumber">Ticket Number / PNR</Label>
              <Input
                id="ticketNumber"
                placeholder="Enter ticket number or PNR"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="VOIDED">Voided</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
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
                  setTicketSearch('')
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
              <TicketIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No tickets found</p>
              <p className="text-sm mt-2">Tickets will appear here after you issue them from bookings</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>PNR</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell className="font-medium font-mono">{ticket.ticketNumber}</TableCell>
                    <TableCell className="font-semibold">{ticket.pnr}</TableCell>
                    <TableCell>
                      {ticket.passenger && (
                        <div>
                          <p className="font-semibold">
                            {ticket.passenger.title} {ticket.passenger.firstName}{' '}
                            {ticket.passenger.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {ticket.passenger.passengerType}
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {ticket.issuedAt
                          ? new Date(ticket.issuedAt).toLocaleDateString()
                          : 'Pending'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ticket.issuedAt &&
                          new Date(ticket.issuedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{formatCurrency(ticket.totalAmount)}</div>
                      <div className="text-xs text-gray-500">{ticket.currency}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(ticket.ticketId)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {ticket.status === 'ISSUED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadTicket(ticket)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
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

      {/* Ticket Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Ticket Number</Label>
                  <p className="font-semibold text-lg font-mono">{selectedTicket.ticketNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">PNR</Label>
                  <p className="font-semibold">{selectedTicket.pnr}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Issue Date</Label>
                  <p>
                    {selectedTicket.issueDate
                      ? formatDateTime(selectedTicket.issueDate)
                      : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Passenger Details */}
              {selectedTicket.passenger && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Passenger Information
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-500">Name</Label>
                          <p className="font-semibold">
                            {selectedTicket.passenger.title} {selectedTicket.passenger.firstName}{' '}
                            {selectedTicket.passenger.lastName}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Type</Label>
                          <Badge variant="secondary">
                            {selectedTicket.passenger.passengerType}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-gray-500">Gender</Label>
                          <p>
                            {selectedTicket.passenger.gender === 'M' ? 'Male' : 'Female'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Date of Birth</Label>
                          <p>{selectedTicket.passenger.dateOfBirth}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Passport Number</Label>
                          <p className="font-mono">{selectedTicket.passenger.passportNumber}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Nationality</Label>
                          <p>{selectedTicket.passenger.nationality}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Fare Breakdown */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Fare Breakdown
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare</span>
                        <span className="font-semibold">
                          {formatCurrency(selectedTicket.fareAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & Fees</span>
                        <span className="font-semibold">
                          {formatCurrency(selectedTicket.taxAmount)}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-bold text-lg">
                        <span>Total Amount</span>
                        <span className="text-primary">
                          {formatCurrency(selectedTicket.totalAmount)} {selectedTicket.currency}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Void/Refund Information */}
              {(selectedTicket.status === 'VOIDED' || selectedTicket.status === 'REFUNDED') && (
                <div>
                  <h3 className="font-semibold mb-3">
                    {selectedTicket.status === 'VOIDED' ? 'Void' : 'Refund'} Information
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-500">
                            {selectedTicket.status === 'VOIDED' ? 'Void Date' : 'Refund Date'}
                          </Label>
                          <p>
                            {selectedTicket.status === 'VOIDED'
                              ? selectedTicket.voidDate
                                ? formatDateTime(selectedTicket.voidDate)
                                : 'N/A'
                              : selectedTicket.refundDate
                              ? formatDateTime(selectedTicket.refundDate)
                              : 'N/A'}
                          </p>
                        </div>
                        {selectedTicket.status === 'REFUNDED' && selectedTicket.refundAmount && (
                          <div>
                            <Label className="text-gray-500">Refund Amount</Label>
                            <p className="font-semibold text-lg">
                              {formatCurrency(selectedTicket.refundAmount)} {selectedTicket.currency}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between gap-2 pt-4 border-t">
                <div className="flex gap-2">
                  {selectedTicket.status === 'ISSUED' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadTicket(selectedTicket)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleVoidTicket(selectedTicket.ticketId)}
                      >
                        Void Ticket
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRefundTicket(selectedTicket.ticketId)}
                      >
                        Refund Ticket
                      </Button>
                    </>
                  )}
                </div>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
