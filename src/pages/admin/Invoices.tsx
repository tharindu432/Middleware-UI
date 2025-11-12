import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, Loader2, RefreshCcw, FileText, User as UserIcon, Send } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { InvoiceResponse } from '@/types'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminInvoices() {
  const { generateInvoices, getAllAgents, generateAgentInvoice, getAdminInvoices, getInvoiceEmailLogs, resendInvoiceEmail, runSchedulerFirstHalf, runSchedulerSecondHalf, loading } = useAdmin()
  const [date, setDate] = useState<string>('')
  const [generated, setGenerated] = useState<InvoiceResponse[] | null>(null)
  const [allInvoices, setAllInvoices] = useState<InvoiceResponse[]>([])
  const [emailLogs, setEmailLogs] = useState<any[]>([])

  // agent-specific generation state
  const [agents, setAgents] = useState<any[]>([])
  const [agentId, setAgentId] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [agentResult, setAgentResult] = useState<InvoiceResponse | null>(null)


  useEffect(() => {
    (async () => {
      try {
        const [agentsList, invoicesList, logs] = await Promise.all([
          getAllAgents(),
          getAdminInvoices(),
          getInvoiceEmailLogs(),
        ])
        setAgents(agentsList || [])
        setAllInvoices((invoicesList as any) || [])
        setEmailLogs(Array.isArray(logs) ? logs : [])
      } catch (e) {
        toast.error('Failed to load initial data')
      }
    })()
  }, [])

  const handleGenerate = async () => {
    const list = await generateInvoices(date || undefined)
    setGenerated(list as any)
  }

  const handleGenerateForAgent = async () => {
    if (!agentId || !startDate || !endDate) return
    const inv = await generateAgentInvoice(agentId, startDate, endDate)
    setAgentResult(inv as any)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generate Invoices</h1>
          <p className="text-gray-500 mt-1">Admin can generate invoices for the current bi-monthly cycle, or for a specific agent within any date range.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cycle Generation (All agents)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3 items-start md:items-end">
          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="date">Date (optional)</label>
            <div className="flex items-center gap-2">
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500">If provided, the system uses that date to determine the cycle (1–15 or 16–end).</div>
          </div>
          <div className="flex-1" />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            Generate Invoices
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate for a Specific Agent</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="agent">Agent</label>
            <div className="flex items-center gap-2">
              <select id="agent" className="border rounded px-3 py-2 w-full" value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                <option value="">Select agent</option>
                {agents.map((a) => (
                  <option key={a.agentId || a.id} value={a.agentId || a.id}>
                    {(a.name || a.agentId)}
                  </option>
                ))}
              </select>
              <UserIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="start">Start date</label>
            <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600" htmlFor="end">End date</label>
            <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">&nbsp;</label>
            <Button onClick={handleGenerateForAgent} disabled={loading || !agentId || !startDate || !endDate} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
              Generate for Agent
            </Button>
          </div>

          {/* Result for agent */}
          {agentResult !== null && (
            <div className="md:col-span-4">
              {agentResult ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{agentResult.invoiceNumber}</TableCell>
                      <TableCell>{agentResult.agentId}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(agentResult.totalAmount)}</TableCell>
                      <TableCell className="text-green-700">{formatCurrency(agentResult.paidAmount)}</TableCell>
                      <TableCell>{agentResult.dueDate ? new Date(agentResult.dueDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={agentResult.status === 'PAID' ? 'default' : agentResult.status === 'OVERDUE' ? 'destructive' : agentResult.status === 'PARTIALLY_PAID' ? 'outline' : 'secondary'}>
                          {agentResult.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-gray-500 text-sm">No eligible tickets found for the specified period.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Last Cycle Generation Result</CardTitle>
        </CardHeader>
        <CardContent>
          {!generated ? (
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" /> No cycle generation run yet. Choose a date (optional) and click Generate.
            </div>
          ) : generated.length === 0 ? (
            <div className="text-gray-500 text-sm">No invoices were generated for the selected period.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generated.map((inv) => (
                  <TableRow key={inv.invoiceId}>
                    <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                    <TableCell>{inv.agentId}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(inv.totalAmount)}</TableCell>
                    <TableCell className="text-green-700">{formatCurrency(inv.paidAmount)}</TableCell>
                    <TableCell>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'PAID' ? 'default' : inv.status === 'OVERDUE' ? 'destructive' : inv.status === 'PARTIALLY_PAID' ? 'outline' : 'secondary'}>
                        {inv.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Invoices</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={async () => {
                try { const list = await getAdminInvoices(); setAllInvoices((list as any) || []); toast.success('Invoices refreshed'); } catch { toast.error('Failed to refresh'); }
              }}>Refresh</Button>
              <Button variant="outline" size="sm" onClick={async () => {
                try { await runSchedulerFirstHalf(); const logs = await getInvoiceEmailLogs(); setEmailLogs(logs || []); } catch { toast.error('Failed to run scheduler'); }
              }}>Run 1–15 Now</Button>
              <Button variant="outline" size="sm" onClick={async () => {
                try { await runSchedulerSecondHalf(); const logs = await getInvoiceEmailLogs(); setEmailLogs(logs || []); } catch { toast.error('Failed to run scheduler'); }
              }}>Run 16–End Now</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {allInvoices.length === 0 ? (
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" /> No invoices available.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allInvoices.map((inv) => (
                  <TableRow key={inv.invoiceId}>
                    <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                    <TableCell>{inv.agentId}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(inv.totalAmount)}</TableCell>
                    <TableCell className="text-green-700">{formatCurrency(inv.paidAmount)}</TableCell>
                    <TableCell>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === 'PAID' ? 'default' : inv.status === 'OVERDUE' ? 'destructive' : inv.status === 'PARTIALLY_PAID' ? 'outline' : 'secondary'}>
                        {inv.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Email logs & verification */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Email Logs (latest 50)</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={async () => {
                try { const logs = await getInvoiceEmailLogs(); setEmailLogs(logs || []); toast.success('Email logs refreshed') } catch { toast.error('Failed to refresh logs') }
              }}>Refresh Logs</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {emailLogs.length === 0 ? (
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" /> No email logs yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailLogs.map((log: any, idx: number) => (
                  <TableRow key={log.emailLogId || idx}>
                    <TableCell className="text-sm">{log.createdAt ? formatDateTime(log.createdAt) : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'SENT' ? 'default' : log.status === 'FAILED' ? 'destructive' : 'secondary'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.triggerSource}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.invoiceNumber || '-'}</TableCell>
                    <TableCell>{log.agentId || '-'}</TableCell>
                    <TableCell>{log.recipientEmail || log.agentEmail || '-'}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={log.message || ''}>{log.message || '-'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={async () => {
                        try { if (!log.invoiceId) { toast.error('No invoice id'); return }
                          await resendInvoiceEmail(log.invoiceId); const logs = await getInvoiceEmailLogs(); setEmailLogs(logs || []);
                        } catch { toast.error('Failed to resend email'); }
                      }}>
                        <Send className="h-4 w-4 mr-1" /> Resend
                      </Button>
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
