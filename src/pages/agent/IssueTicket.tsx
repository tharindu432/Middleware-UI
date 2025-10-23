import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useBookings } from '@/hooks/useBookings'
import { useTickets } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plane, Users, CheckCircle, AlertCircle, Ticket as TicketIcon, CreditCard } from 'lucide-react'
import { BookingResponse } from '@/types'
import { formatCurrency} from '@/lib/utils'
import toast from 'react-hot-toast'

export default function IssueTicket() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  const { getBookingDetails, loading: bookingLoading } = useBookings()
  const { issueTickets, loading: ticketLoading } = useTickets()

  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails()
    } else {
      toast.error('No booking selected')
      navigate('/agent/my-bookings')
    }
  }, [bookingId])

  const loadBookingDetails = async () => {
    try {
      const bookingData = await getBookingDetails(bookingId!)

      if (bookingData.status !== 'CONFIRMED') {
        toast.error('Only confirmed bookings can be ticketed')
        navigate('/agent/my-bookings')
        return
      }

      setBooking(bookingData)
    } catch (error) {
      toast.error('Failed to load booking details')
      navigate('/agent/my-bookings')
    }
  }

  const handleIssueTicket = async () => {
    if (!confirmed) {
      toast.error('Please confirm the booking details before issuing tickets')
      return
    }

    try {
      const tickets = await issueTickets({ bookingId: bookingId! })
      toast.success(`${tickets.length} ticket(s) issued successfully!`)
      navigate('/agent/my-tickets')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to issue tickets')
    }
  }

  if (bookingLoading || !booking) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalTicketAmount = booking.totalAmount

  // @ts-ignore
    // @ts-ignore
    return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Issue Ticket</h1>
        <p className="text-gray-500 mt-1">Review booking details and issue tickets</p>
      </div>

      {/* Warning Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please review all booking details carefully before issuing tickets. Once tickets are issued,
          they cannot be cancelled without penalties.
        </AlertDescription>
      </Alert>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TicketIcon className="h-5 w-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-500">PNR</Label>
              <p className="font-semibold text-lg">{booking.pnr}</p>
            </div>
            <div>
              <Label className="text-gray-500">Status</Label>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                {booking.status}
              </Badge>
            </div>
            <div>
              <Label className="text-gray-500">Booking Date</Label>
              <p>{new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-gray-500">Total Amount</Label>
              <p className="font-semibold text-lg text-primary">
                {formatCurrency(booking.totalAmount)} {booking.currency}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{booking.flight?.origin || 'N/A'}</div>
                  <div className="text-sm text-gray-500">
                    {booking.flight?.departureDateTime || booking.flight?.departureDate 
                      ? new Date(booking.flight.departureDateTime || booking.flight.departureDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.flight?.departureDateTime || booking.flight?.departureDate
                      ? new Date(booking.flight.departureDateTime || booking.flight.departureDate).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-1">{booking.flight?.duration || 'N/A'}</div>
                  <Plane className="h-5 w-5 text-primary rotate-90" />
                  <div className="text-xs text-gray-400 mt-1">Direct</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">{booking.flight?.destination || 'N/A'}</div>
                  <div className="text-sm text-gray-500">
                    {booking.flight?.arrivalDateTime || booking.flight?.arrivalDate
                      ? new Date(booking.flight.arrivalDateTime || booking.flight.arrivalDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.flight?.arrivalDateTime || booking.flight?.arrivalDate
                      ? new Date(booking.flight.arrivalDateTime || booking.flight.arrivalDate).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-gray-500">Airline</Label>
                <p className="font-semibold">{booking.flight?.airline || booking.flight?.airlineCode || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-500">Flight Number</Label>
                <p className="font-semibold">{booking.flight?.flightNumber || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-500">Cabin Class</Label>
                <Badge variant="secondary">{booking.flight?.cabinClass || 'N/A'}</Badge>
              </div>
              <div>
                <Label className="text-gray-500">Available Seats</Label>
                <p>{booking.flight?.availableSeats || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Passengers ({booking.passengers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-500">Passenger {index + 1}</Label>
                    <p className="font-semibold">
                      {passenger.title} {passenger.firstName} {passenger.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Type</Label>
                    <Badge variant="secondary">{passenger.passengerType}</Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Date of Birth</Label>
                    <p>{passenger.dateOfBirth}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Gender</Label>
                    <p>{passenger.gender === 'M' ? 'Male' : 'Female'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Passport Number</Label>
                    <p className="font-mono">{passenger.passportNumber}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Passport Expiry</Label>
                    <p>{passenger.passportExpiry}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Nationality</Label>
                    <p>{passenger.nationality}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Ticket Price</Label>
                    <p className="font-semibold text-primary">
                      {formatCurrency(booking.totalAmount / booking.passengers.length)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">Email</Label>
              <p>{booking.contactEmail}</p>
            </div>
            <div>
              <Label className="text-gray-500">Phone</Label>
              <p>{booking.contactPhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Number of Passengers</span>
              <span className="font-semibold">{booking.passengers.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Base Fare (per passenger)</span>
              <span>{formatCurrency(booking.totalAmount / booking.passengers.length)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(booking.totalAmount)}</span>
            </div>
            {booking.commission && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Commission</span>
                <span>-{formatCurrency(booking.commission)}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">
                {formatCurrency(totalTicketAmount)} {booking.currency}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation */}
      <Card className="border-2 border-primary">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="confirm" className="text-sm cursor-pointer">
              <p className="font-semibold">I confirm that:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li>All passenger details are correct and match their travel documents</li>
                <li>Flight details and travel dates are verified</li>
                <li>Payment has been received or will be processed</li>
                <li>I understand that tickets cannot be cancelled without penalties once issued</li>
              </ul>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/agent/my-bookings')}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          onClick={handleIssueTicket}
          disabled={!confirmed || ticketLoading}
          className="bg-green-600 hover:bg-green-700"
        >
          {ticketLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Issuing Tickets...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Issue {booking.passengers.length} Ticket{booking.passengers.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
