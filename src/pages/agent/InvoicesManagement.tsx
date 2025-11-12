import { useEffect, useMemo, useState } from 'react'
import { useInvoices } from '@/hooks/useInvoices'
import { usePayments } from '@/hooks/usePayments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Download, DollarSign, Calendar, CheckCircle, Clock, XCircle, ChevronDown, ChevronRight, Receipt } from 'lucide-react'
import { InvoiceResponse } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function InvoicesManagement() {
  const { getAllInvoices, downloadInvoicePdf, loading } = useInvoices()
  const { makePayment } = usePayments()
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'UNPAID' | 'OVERDUE'>('ALL')

  // UI state: expanded invoice lines
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Pay modal state
  const [showPay, setShowPay] = useState(false)
  const [payInvoiceId, setPayInvoiceId] = useState<string>('')
  const [payInvoiceNumber, setPayInvoiceNumber] = useState<string>('')
  const [payAmount, setPayAmount] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('BANK_TRANSFER')
  const [transactionId, setTransactionId] = useState<string>('')

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

  const openPayModal = (inv: InvoiceResponse) => {
    const outstanding = inv.totalAmount - inv.paidAmount
    setPayInvoiceId(inv.invoiceId)
    setPayInvoiceNumber(inv.invoiceNumber)
    setPayAmount(outstanding > 0 ? String(outstanding) : '')
    setPaymentMethod('BANK_TRANSFER')
    setTransactionId('')
    setShowPay(true)
  }

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(payAmount)
    if (!payInvoiceId) {
      toast.error('No invoice selected')
      return
    }
    if (isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    try {
      await makePayment({
        invoiceId: payInvoiceId,
        amount: amt,
        paymentMethod,
        transactionId,
      } as any)
      toast.success('Payment successful')
      setShowPay(false)
      await loadInvoices()
    } catch (err) {
      toast.error('Payment failed')
    }
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const mapStatus = (status: string): 'PAID' | 'UNPAID' | 'OVERDUE' | 'PARTIAL' => {
    if (status === 'PENDING') return 'UNPAID'
    if (status === 'PARTIALLY_PAID') return 'PARTIAL'
    if (status === 'PAID') return 'PAID'
    if (status === 'OVERDUE') return 'OVERDUE'
    return 'UNPAID'
  }

  const getStatusBadge = (status: string) => {
    const mapped = mapStatus(status)
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any }> = {
      PAID: { variant: 'default', icon: CheckCircle },
      UNPAID: { variant: 'secondary', icon: Clock },
      OVERDUE: { variant: 'destructive', icon: XCircle },
      PARTIAL: { variant: 'outline', icon: DollarSign },
    }
    const config = variants[mapped] || { variant: 'outline', icon: FileText }
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {mapped}
      </Badge>
    )
  }

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'ALL') return true
    return mapStatus(inv.status) === filter
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
                {filteredInvoices.map((invoice) => {
                  const outstanding = invoice.totalAmount - invoice.paidAmount
                  const isPaid = outstanding <= 0.000001
                  const isExpanded = !!expanded[invoice.invoiceId]
                  return (
                    <>
                      <TableRow key={invoice.invoiceId}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>{invoice.bookingId}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(invoice.totalAmount)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(invoice.paidAmount)}</TableCell>
                        <TableCell className="text-red-600">{formatCurrency(outstanding)}</TableCell>
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
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={isExpanded ? 'secondary' : 'outline'}
                              onClick={() => toggleExpand(invoice.invoiceId)}
                              title={isExpanded ? 'Hide line items' : 'Show line items'}
                            >
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openPayModal(invoice)}
                              disabled={isPaid}
                              title={isPaid ? 'Invoice fully paid' : 'Pay invoice'}
                            >
                              <DollarSign className="h-4 w-4 mr-1" /> Pay
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={9}>
                            <div className="bg-muted/40 rounded-md p-3">
                              <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                                <Receipt className="h-4 w-4" />
                                Per-ticket line items
                              </div>
                              {invoice.lines && invoice.lines.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="text-left text-gray-500">
                                        <th className="py-1 pr-2">Ticket</th>
                                        <th className="py-1 pr-2">Description</th>
                                        <th className="py-1 pr-2">Amount</th>
                                        <th className="py-1 pr-2">Paid</th>
                                        <th className="py-1 pr-2">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {invoice.lines.map(line => (
                                        <tr key={line.invoiceLineId} className="border-t border-gray-200">
                                          <td className="py-1 pr-2">{line.ticketNumber || line.ticketId || '-'}</td>
                                          <td className="py-1 pr-2">{line.description || '-'}</td>
                                          <td className="py-1 pr-2">{formatCurrency(line.amount)}</td>
                                          <td className="py-1 pr-2 text-green-700">{formatCurrency(line.paidAmount)}</td>
                                          <td className="py-1 pr-2">
                                            <Badge variant={line.status === 'PAID' ? 'default' : line.status === 'PARTIALLY_PAID' ? 'outline' : 'secondary'}>
                                              {line.status.replace('_', ' ')}
                                            </Badge>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500">No line items</div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pay Invoice Modal */}
      <Dialog open={showPay} onOpenChange={setShowPay}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Invoice {payInvoiceNumber ? `(${payInvoiceNumber})` : ''}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitPayment} className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                  <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="txn">Transaction ID</Label>
              <Input id="txn" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Reference / slip no." />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowPay(false)}>Cancel</Button>
              <Button type="submit">Pay</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
