import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFlights } from '@/hooks/useFlights'
import { useBookings } from '@/hooks/useBookings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plane, Users, ArrowRight, Plus, Trash2, CheckCircle } from 'lucide-react'
import { FlightResponse, Passenger } from '@/types'
import { formatCurrency} from '@/lib/utils'
import toast from 'react-hot-toast'

export default function EmployeeBookFlight() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const availabilityId = searchParams.get('availabilityId')

  const { getFlightDetails, loading: flightLoading } = useFlights()
  const { createBooking, loading: bookingLoading } = useBookings()

  const [flight, setFlight] = useState<FlightResponse | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  // Contact Information
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Passengers
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      passengerType: 'ADULT',
      title: 'MR',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'M',
      passportNumber: '',
      passportExpiry: '',
      nationality: '',
    },
  ])

  useEffect(() => {
    if (availabilityId) {
      loadFlightDetails()
    } else {
      toast.error('No flight selected')
      navigate('/employee/flights')
    }
  }, [availabilityId])

  const loadFlightDetails = async () => {
    try {
      const flightData = await getFlightDetails(availabilityId!)
      setFlight(flightData)
    } catch (error) {
      toast.error('Failed to load flight details')
      navigate('/employee/flights')
    }
  }

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        passengerType: 'ADULT',
        title: 'MR',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'M',
        passportNumber: '',
        passportExpiry: '',
        nationality: '',
      },
    ])
  }

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index))
    } else {
      toast.error('At least one passenger is required')
    }
  }

  const updatePassenger = (index: number, field: keyof Passenger, value: any) => {
    const updatedPassengers = [...passengers]
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    }
    setPassengers(updatedPassengers)
  }

  const validateContactInfo = () => {
    if (!contactEmail || !contactPhone) {
      toast.error('Please fill in contact information')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactEmail)) {
      toast.error('Please enter a valid email address')
      return false
    }
    return true
  }

  const validatePassengers = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i]
      if (!p.firstName || !p.lastName || !p.dateOfBirth || !p.passportNumber || !p.passportExpiry || !p.nationality) {
        toast.error(`Please complete all required fields for Passenger ${i + 1}`)
        return false
      }
    }
    return true
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateContactInfo()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      if (validatePassengers()) {
        setCurrentStep(3)
      }
    }
  }

  const handleSubmitBooking = async () => {
    if (!validateContactInfo() || !validatePassengers()) {
      return
    }

    try {
      const bookingRequest = {
        availabilityId: availabilityId!,
        contactEmail,
        contactPhone,
        passengers,
      }

      const booking = await createBooking(bookingRequest)
      toast.success(`Booking created successfully! PNR: ${booking.pnr}`)
      navigate('/employee/bookings')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    }
  }

  if (flightLoading || !flight) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book Flight</h1>
        <p className="text-gray-500 mt-1">Complete your booking in 3 easy steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
            </div>
            <div className="ml-2 text-sm font-medium">
              {step === 1 && 'Contact Info'}
              {step === 2 && 'Passengers'}
              {step === 3 && 'Review'}
            </div>
            {step < 3 && <ArrowRight className="h-5 w-5 mx-4 text-gray-400" />}
          </div>
        ))}
      </div>

      {/* Flight Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{flight.airline || flight.airlineCode}</span>
                </div>
                <Badge variant="secondary">{flight.flightNumber}</Badge>
                <Badge>{flight.cabinClass}</Badge>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{flight.origin}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.departureDateTime || flight.departureDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(flight.departureDateTime || flight.departureDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <div className="text-sm text-gray-500 mb-1">{flight.duration || 'N/A'}</div>
                  <div className="w-full h-0.5 bg-gray-300 relative">
                    <ArrowRight className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 text-primary" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Direct</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">{flight.destination}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.arrivalDateTime || flight.arrivalDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(flight.arrivalDateTime || flight.arrivalDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-end justify-center gap-2 lg:border-l lg:pl-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Price</div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(flight.totalPrice || flight.totalFare || 0)}
                </div>
                <div className="text-xs text-gray-400">{flight.currency}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Contact Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNextStep} size="lg">
                Next: Add Passengers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Passenger Details */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {passengers.map((passenger, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Passenger {index + 1}
                  </CardTitle>
                  {passengers.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePassenger(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Passenger Type *</Label>
                    <Select
                      value={passenger.passengerType}
                      onValueChange={(value) => updatePassenger(index, 'passengerType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADULT">Adult (12+)</SelectItem>
                        <SelectItem value="CHILD">Child (2-11)</SelectItem>
                        <SelectItem value="INFANT">Infant (0-2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Select
                      value={passenger.title}
                      onValueChange={(value) => updatePassenger(index, 'title', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MR">Mr</SelectItem>
                        <SelectItem value="MRS">Mrs</SelectItem>
                        <SelectItem value="MS">Ms</SelectItem>
                        <SelectItem value="MISS">Miss</SelectItem>
                        <SelectItem value="MSTR">Master</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input
                      placeholder="John"
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(index, 'firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input
                      placeholder="Doe"
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(index, 'lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <Input
                      type="date"
                      value={passenger.dateOfBirth}
                      onChange={(e) => updatePassenger(index, 'dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select
                      value={passenger.gender}
                      onValueChange={(value) => updatePassenger(index, 'gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality *</Label>
                    <Input
                      placeholder="e.g., US, UK, LK"
                      value={passenger.nationality}
                      onChange={(e) => updatePassenger(index, 'nationality', e.target.value.toUpperCase())}
                      maxLength={2}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Passport Number *</Label>
                    <Input
                      placeholder="Passport number"
                      value={passenger.passportNumber}
                      onChange={(e) => updatePassenger(index, 'passportNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Expiry *</Label>
                    <Input
                      type="date"
                      value={passenger.passportExpiry}
                      onChange={(e) => updatePassenger(index, 'passportExpiry', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={addPassenger}>
              <Plus className="mr-2 h-4 w-4" />
              Add Passenger
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button onClick={handleNextStep} size="lg">
                Next: Review
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review and Confirm */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span> {contactEmail}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span> {contactPhone}
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div>
                <h3 className="font-semibold mb-2">Passengers ({passengers.length})</h3>
                <div className="space-y-2">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {passenger.title} {passenger.firstName} {passenger.lastName}
                          </span>
                          <Badge variant="secondary">{passenger.passengerType}</Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Passport: {passenger.passportNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(flight.totalPrice || flight.totalFare || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back to Passengers
            </Button>
            <Button
              onClick={handleSubmitBooking}
              size="lg"
              disabled={bookingLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {bookingLoading ? 'Creating Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}