import { useEffect, useState } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { Input } from '@/components/ui/input'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { AuditLog } from '@/types'
import { formatDateTime } from '@/lib/utils'

export default function AuditLogs() {
  const { getAuditLogs, loading } = useAdmin()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const data = await getAuditLogs()
      setLogs(data)
    } catch (error) {
      console.error('Error loading audit logs:', error)
    }
  }

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-gray-500 mt-1">Track all system activities and changes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.logId}>
                    <TableCell className="font-medium">{log.logId}</TableCell>
                    <TableCell>{log.userId}</TableCell>
                    <TableCell>
                      <Badge variant="info">{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.entityId}</TableCell>
                    <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
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
