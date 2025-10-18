import { useState } from 'react'
import { useFlights } from '@/hooks/useFlights'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, ArrowRight, Users } from 'lucide-react'
import { FlightResponse } from '@/types'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function EmployeeFlightSearch() {
  const { searchFlights, loading } = useFlights()
  const [searchResults, setSearchResults] = useState<FlightResponse[]>([])
  const [showResults, setShowResults] = useState(false)

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
          toast.info('No flights found')
      }
    } catch (error) {
      toast.error('Search failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search Flights</h1>
        <p className="text-gray-500 mt-1">Find available flights for customers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Flight Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">From *</Label>
                <Input
                  id="origin"
                  placeholder="e.g., JFK, LAX"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">To *</Label>
                <Input
                  id="destination"
                  placeholder="e.g., JFK, LAX"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure *</Label>
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
                  <Label htmlFor="returnDate">Return *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={departureDate}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Adults</Label>
                <Input
                  type="number"
                  min="1"
                  max="9"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Children</Label>
                <Input
                  type="number"
                  min="0"
                  max="9"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Infants</Label>
                <Input
                  type="number"
                  min="0"
                  max="9"
                  value={infants}
                  onChange={(e) => setInfants(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cabin Class</Label>
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

      {showResults && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{searchResults.length} Flights Found</h2>
          {searchResults.map((flight) => (
            <Card key={flight.availabilityId}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge>{flight.airline}</Badge>
                      <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-2xl font-bold">{flight.origin}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(flight.departureDate).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="text-sm text-gray-500">{flight.duration}</div>
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{flight.destination}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(flight.arrivalDate).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {flight.availableSeats} seats
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(flight.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-500">{flight.currency}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
