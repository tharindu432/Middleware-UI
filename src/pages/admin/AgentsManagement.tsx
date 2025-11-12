import { useEffect, useState } from 'react'
import { useAgents } from '@/hooks/useAgents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { AgentRequest } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AgentsManagement() {
  const { getAllAgents, createAgent, deleteAgent, loading, agents } = useAgents()
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<AgentRequest>({
    name: '',
    email: '',
    phone: '',
    password: '',
    creditLimit: 0,
    bankGurantee: 0,
    defaultCurrency: 'USD',
    role: 'AGENT_MANAGER',
  })

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      await getAllAgents()
    } catch (error) {
      console.error('Error loading agents:', error)
    }
  }

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Ensure numeric fields are properly set
      const submitData = {
        ...formData,
        creditLimit: formData.creditLimit || 0,
        bankGurantee: formData.bankGurantee || 0,
      }
      await createAgent(submitData)
      setIsCreateDialogOpen(false)
      resetForm()
      loadAgents()
    } catch (error) {
      console.error('Error creating agent:', error)
    }
  }

  const handleDeleteAgent = async (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        await deleteAgent(agentId)
        loadAgents()
      } catch (error) {
        console.error('Error deleting agent:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      creditLimit: undefined as any,
      bankGurantee: undefined as any,
      defaultCurrency: 'USD',
      role: 'AGENT_MANAGER',
    })
  }

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agents Management</h1>
          <p className="text-gray-500 mt-1">Manage travel agents and their accounts</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agency Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.creditLimit || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setFormData({ ...formData, creditLimit: isNaN(value) ? 0 : value });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankGurantee">Bank Guarantee</Label>
                  <Input
                    id="bankGurantee"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.bankGurantee || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      setFormData({ ...formData, bankGurantee: isNaN(value) ? 0 : value });
                    }}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Create Agent
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search agents..."
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
                <TableHead>Agent ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Current Credit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No agents found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => (
                  <TableRow key={agent.agentId}>
                    <TableCell className="font-medium">{agent.agentId}</TableCell>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{agent.email}</TableCell>
                    <TableCell>{formatCurrency(agent.creditLimit)}</TableCell>
                    <TableCell>{formatCurrency(agent.currentCredit)}</TableCell>
                    <TableCell>
                      <Badge variant={agent.isActive ? 'success' : 'destructive'}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(agent.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAgent(agent.agentId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
