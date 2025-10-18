import { useState } from 'react'
import { useReports } from '@/hooks/useReports'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Download } from 'lucide-react'

export default function Reports() {
  const { getSalesReport, getBookingReport, getFinancialReport, loading } = useReports()
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  })

  const handleGenerateReport = async (reportType: string) => {
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        alert('Please select date range')
        return
      }

      switch (reportType) {
        case 'sales':
          await getSalesReport(dateRange.startDate, dateRange.endDate)
          break
        case 'bookings':
          await getBookingReport(dateRange.startDate, dateRange.endDate)
          break
        case 'financial':
          await getFinancialReport(dateRange.startDate, dateRange.endDate)
          break
      }
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and view business reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="bookings">Booking Report</TabsTrigger>
          <TabsTrigger value="financial">Financial Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Sales Report
                </span>
                <Button onClick={() => handleGenerateReport('sales')} disabled={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Select date range and click "Generate Report" to view sales data
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Booking Report
                </span>
                <Button onClick={() => handleGenerateReport('bookings')} disabled={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Select date range and click "Generate Report" to view booking data
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Financial Report
                </span>
                <Button onClick={() => handleGenerateReport('financial')} disabled={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Select date range and click "Generate Report" to view financial data
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
