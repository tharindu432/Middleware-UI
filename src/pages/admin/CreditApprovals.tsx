import { useEffect, useState } from 'react'
// @ts-ignore
import { useAdmin } from '@/hooks/useAdmin'
import { Button } from '@/components/ui/button'
// @ts-ignore
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle } from 'lucide-react'
import { CreditTopupApproval } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function CreditApprovals() {
  const { approveCreditTopup, rejectCreditTopup, getPendingCreditApprovals, loading } = useAdmin()
  const [topups, setTopups] = useState<CreditTopupApproval[]>([])

  useEffect(() => {
    loadTopups()
  }, [])

  const loadTopups = async () => {
    try {
      const data = await getPendingCreditApprovals()
      setTopups(data)
    } catch (error) {
      console.error('Error loading top-ups:', error)
    }
  }

  const handleApprove = async (topupId: string) => {
    try {
      await approveCreditTopup(topupId)
      loadTopups()
    } catch (error) {
      console.error('Error approving top-up:', error)
    }
  }

  const handleReject = async (topupId: string) => {
    try {
      await rejectCreditTopup(topupId, 'Rejected by admin')
      loadTopups()
    } catch (error) {
      console.error('Error rejecting top-up:', error)
    }
  }

  const pendingTopups = topups.filter((t) => t.status === 'PENDING')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Credit Approvals</h1>
        <p className="text-gray-500 mt-1">Review and approve credit top-up requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTopups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(pendingTopups.reduce((sum, t) => sum + t.amount, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Agent ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : pendingTopups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No pending approvals
                  </TableCell>
                </TableRow>
              ) : (
                pendingTopups.map((topup) => (
                  <TableRow key={topup.transactionId}>
                    <TableCell className="font-medium">{topup.transactionId}</TableCell>
                    <TableCell>{topup.agentId}</TableCell>
                    <TableCell>{formatCurrency(topup.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="info">{topup.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning">{topup.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(topup.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(topup.transactionId)}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(topup.transactionId)}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
