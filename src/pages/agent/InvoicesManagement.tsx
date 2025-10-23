import { useEffect, useState } from 'react'
import { useInvoices } from '@/hooks/useInvoices'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// @ts-ignore
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Download, DollarSign, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import { InvoiceResponse } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function InvoicesManagement() {
  const { getAllInvoices, downloadInvoicePdf, loading } = useInvoices()
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'UNPAID' | 'OVERDUE'>('ALL')

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await getAllInvoices()
      setInvoices(data)
    } catch (error) {
      toast.error('Failed to load invoices')
    }
  }

  const handleDownload = async (invoiceId: string) => {
    try {
      await downloadInvoicePdf(invoiceId)
      toast.success('Invoice downloaded successfully')
    } catch (error) {
      toast.error('Failed to download invoice')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      PAID: { variant: 'default', icon: CheckCircle },
      UNPAID: { variant: 'secondary', icon: Clock },
      OVERDUE: { variant: 'destructive', icon: XCircle },
      PARTIAL: { variant: 'outline', icon: DollarSign },
    }
    const config = variants[status] || { variant: 'outline', icon: FileText }
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'ALL') return true
    return inv.status === filter
  })

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalPaid = filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalOutstanding = totalAmount - totalPaid

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-gray-500 mt-1">View and download invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredInvoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(totalAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'ALL' ? 'default' : 'outline'}
          onClick={() => setFilter('ALL')}
        >
          All
        </Button>
        <Button
          variant={filter === 'PAID' ? 'default' : 'outline'}
          onClick={() => setFilter('PAID')}
        >
          Paid
        </Button>
        <Button
          variant={filter === 'UNPAID' ? 'default' : 'outline'}
          onClick={() => setFilter('UNPAID')}
        >
          Unpaid
        </Button>
        <Button
          variant={filter === 'OVERDUE' ? 'default' : 'outline'}
          onClick={() => setFilter('OVERDUE')}
        >
          Overdue
        </Button>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invoices found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.bookingId}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell className="text-green-600">{formatCurrency(invoice.paidAmount)}</TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(invoice.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(invoice.invoiceId)}
                          disabled={loading}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
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
