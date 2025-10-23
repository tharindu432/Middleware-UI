import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFlights } from '@/hooks/useFlights'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plane, Users, ArrowRight } from 'lucide-react'
import { FlightResponse } from '@/types'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function FlightSearch() {
  const navigate = useNavigate()
  const { searchFlights, loading } = useFlights()
  const [searchResults, setSearchResults] = useState<FlightResponse[]>([])
  const [showResults, setShowResults] = useState(false)

  // Search form state
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabinClass, setCabinClass] = useState('ECONOMY')
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!origin || !destination || !departureDate) {
      toast.error('Please fill in all required fields')
      return
    }

    if (tripType === 'round-trip' && !returnDate) {
      toast.error('Please select a return date')
      return
    }

    try {
      const results = await searchFlights({
        origin,
        destination,
        departureDate,
        returnDate: tripType === 'round-trip' ? returnDate : undefined,
        adults,
        children,
        infants,
        cabinClass,
      })
      setSearchResults(results)
      setShowResults(true)
      if (results.length === 0) {
        // @ts-ignore
          toast.info('No flights found for your search criteria')
      }
    } catch (error) {
      toast.error('Failed to search flights. Please try again.')
    }
  }

  const handleBookFlight = (flight: FlightResponse) => {
    // Navigate to booking page with flight details
    navigate(`/agent/book-flight?availabilityId=${flight.availabilityId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Flights</h1>
        <p className="text-gray-500 mt-1">Find available flights for your customers</p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Flight Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={tripType === 'one-way' ? 'default' : 'outline'}
                onClick={() => setTripType('one-way')}
              >
                One Way
              </Button>
              <Button
                type="button"
                variant={tripType === 'round-trip' ? 'default' : 'outline'}
                onClick={() => setTripType('round-trip')}
              >
                Round Trip
              </Button>
            </div>

            {/* Origin and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">From (Origin) *</Label>
                <Input
                  id="origin"
                  placeholder="e.g., JFK, LAX, LHR"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">To (Destination) *</Label>
                <Input
                  id="destination"
                  placeholder="e.g., JFK, LAX, LHR"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date *</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              {tripType === 'round-trip' && (
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate || new Date().toISOString().split('T')[0]}
                    required={tripType === 'round-trip'}
                  />
                </div>
              )}
            </div>

            {/* Passengers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults">Adults (12+)</Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  max="9"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="children">Children (2-11)</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  max="9"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="infants">Infants (0-2)</Label>
                <Input
                  id="infants"
                  type="number"
                  min="0"
                  max="9"
                  value={infants}
                  onChange={(e) => setInfants(parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Cabin Class */}
            <div className="space-y-2">
              <Label htmlFor="cabinClass">Cabin Class</Label>
              <Select value={cabinClass} onValueChange={setCabinClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ECONOMY">Economy</SelectItem>
                  <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="FIRST">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              <Search className="mr-2 h-5 w-5" />
              {loading ? 'Searching...' : 'Search Flights'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {showResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {searchResults.length} Flight{searchResults.length !== 1 ? 's' : ''} Found
            </h2>
            <Button variant="outline" onClick={() => setShowResults(false)}>
              New Search
            </Button>
          </div>

          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No flights available for the selected criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search parameters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {searchResults.map((flight) => (
                <Card key={flight.availabilityId} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Flight Info */}
                      <div className="lg:col-span-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Plane className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-lg">{flight.airline || flight.airlineCode}</span>
                          </div>
                          <Badge variant="secondary">{flight.flightNumber}</Badge>
                          <Badge>{flight.cabinClass}</Badge>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Departure */}
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

                          {/* Duration */}
                          <div className="flex-1 flex flex-col items-center">
                            <div className="text-sm text-gray-500 mb-1">{flight.duration || 'N/A'}</div>
                            <div className="w-full h-0.5 bg-gray-300 relative">
                              <ArrowRight className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 text-primary" />
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Direct</div>
                          </div>

                          {/* Arrival */}
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

                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{flight.availableSeats} seats available</span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Book */}
                      <div className="lg:col-span-4 flex flex-col items-end justify-center gap-4 lg:border-l lg:pl-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Total Price</div>
                          <div className="text-3xl font-bold text-primary">
                            {formatCurrency(flight.totalPrice || flight.totalFare || 0)}
                          </div>
                          <div className="text-xs text-gray-400">{flight.currency}</div>
                        </div>
                        <Button
                          onClick={() => handleBookFlight(flight)}
                          size="lg"
                          className="w-full lg:w-auto"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
