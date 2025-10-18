import { SetStateAction, useEffect, useState} from 'react'
import {useCredit} from '@/hooks/useCredit'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
// @ts-ignore
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
// @ts-ignore
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
// @ts-ignore
import {Textarea} from '@/components/ui/input'
import {Wallet, TrendingUp, TrendingDown, Plus, History, DollarSign, ArrowUpCircle, ArrowDownCircle} from 'lucide-react'
import {CreditTransaction} from '@/types'
import {formatCurrency, formatDateTime} from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CreditManagement() {
    const {getCreditBalance, getCreditTransactions, requestCreditTopup, getTopupHistory, loading} = useCredit()
    const [balance, setBalance] = useState<number>(0)
    const [transactions, setTransactions] = useState<CreditTransaction[]>([])
    const [topups, setTopups] = useState<CreditTransaction[]>([])
    const [showTopupDialog, setShowTopupDialog] = useState(false)

    // Topup form
    const [topupAmount, setTopupAmount] = useState('')
    const [topupNotes, setTopupNotes] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [balanceData, transactionsData, topupsData] = await Promise.all([
                getCreditBalance(),
                getCreditTransactions(),
                getTopupHistory(),
            ])
            setBalance(balanceData)
            setTransactions(transactionsData)
            setTopups(topupsData)
        } catch (error) {
            toast.error('Failed to load credit data')
        }
    }

    const handleRequestTopup = async (e: React.FormEvent) => {
        e.preventDefault()

        const amount = parseFloat(topupAmount)
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        try {
            await requestCreditTopup({
                amount,
                requestNotes: topupNotes,
            })
            setShowTopupDialog(false)
            setTopupAmount('')
            setTopupNotes('')
            loadData()
        } catch (error) {
            toast.error('Failed to request top-up')
        }
    }

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'CREDIT':
            case 'TOPUP':
                return <ArrowUpCircle className="h-5 w-5 text-green-500"/>
            case 'DEBIT':
                return <ArrowDownCircle className="h-5 w-5 text-red-500"/>
            default:
                return <DollarSign className="h-5 w-5 text-gray-500"/>
        }
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            APPROVED: 'default',
            PENDING: 'secondary',
            REJECTED: 'destructive',
            COMPLETED: 'default',
        }
        return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
    }

    const totalCredits = transactions.filter(t => t.type === 'CREDIT' || t.type === 'TOPUP').reduce((sum, t) => sum + t.amount, 0)
    const totalDebits = transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0)
    const pendingTopups = topups.filter(t => t.status === 'PENDING')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Credit Management</h1>
                    <p className="text-gray-500 mt-1">Manage your credit balance and top-ups</p>
                </div>
                <Dialog open={showTopupDialog} onOpenChange={setShowTopupDialog}>
                    <DialogTrigger asChild>
                        <Button size="lg">
                            <Plus className="mr-2 h-5 w-5"/>
                            Request Top-up
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Request Credit Top-up</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleRequestTopup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    value={topupAmount}
                                    onChange={(e) => setTopupAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add any notes or comments"
                                    value={topupNotes}
                                    onChange={(e: { target: { value: SetStateAction<string> } }) => setTopupNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowTopupDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{formatCurrency(balance)}</div>
            <p className="text-sm text-gray-500 mt-2">Available credit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</div>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Total Debits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</div>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Top-ups */}
      {pendingTopups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Pending Top-up Requests ({pendingTopups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTopups.map((topup) => (
                <div key={topup.transactionId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <ArrowUpCircle className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-semibold">{formatCurrency(topup.amount)}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(topup.createdAt)}</p>
                      {topup.description && (
                        <p className="text-sm text-gray-600 mt-1">{topup.description}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(topup.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="font-medium">{transaction.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{transaction.description || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <span className={transaction.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'}>
                        {transaction.type === 'DEBIT' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{formatCurrency(transaction.balance)}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(transaction.createdAt)}</div>
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
