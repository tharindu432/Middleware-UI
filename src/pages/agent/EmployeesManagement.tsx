import { useEffect, useState } from 'react'
import { useEmployees } from '@/hooks/useEmployees'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserPlus, Edit, Trash2, UserX, Key, Users, CheckCircle, XCircle } from 'lucide-react'
import { Employee } from '@/types'
import { formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function EmployeesManagement() {
  const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, deactivateEmployee, resetEmployeePassword, loading } = useEmployees()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'EMPLOYEE'>('EMPLOYEE')

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees()
      setEmployees(data)
    } catch (error) {
      toast.error('Failed to load employees')
    }
  }

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setRole('EMPLOYEE')
    setSelectedEmployee(null)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createEmployee({
        firstName,
        lastName,
        email,
        password,
        role,
      })
      setShowCreateDialog(false)
      resetForm()
      loadEmployees()
    } catch (error) {
      toast.error('Failed to create employee')
    }
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFirstName(employee.firstName)
    setLastName(employee.lastName)
    setEmail(employee.email)
    setRole(employee.role as 'EMPLOYEE')
    setShowEditDialog(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return

    try {
      await updateEmployee(selectedEmployee.employeeId, {
        firstName,
        lastName,
        email,
        role,
      })
      setShowEditDialog(false)
      resetForm()
      loadEmployees()
    } catch (error) {
      toast.error('Failed to update employee')
    }
  }

  const handleDelete = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return

    try {
      await deleteEmployee(employeeId)
      loadEmployees()
    } catch (error) {
      toast.error('Failed to delete employee')
    }
  }

  const handleDeactivate = async (employeeId: string) => {
    if (!confirm('Are you sure you want to deactivate this employee?')) return

    try {
      await deactivateEmployee(employeeId)
      loadEmployees()
    } catch (error) {
      toast.error('Failed to deactivate employee')
    }
  }

  const handleResetPassword = async (employeeId: string) => {
    const newPassword = prompt('Enter new password:')
    if (!newPassword) return

    try {
      await resetEmployeePassword(employeeId, newPassword)
    } catch (error) {
      toast.error('Failed to reset password')
    }
  }

  const activeEmployees = employees.filter(e => e.isActive).length
  const inactiveEmployees = employees.filter(e => !e.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-gray-500 mt-1">Manage your team members</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="lg">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={role} onValueChange={(val) => setRole(val as 'EMPLOYEE')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                    {/*<SelectItem value="AGENT_MANAGER">Agent Manager</SelectItem>*/}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  Create Employee
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{inactiveEmployees}</div>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No employees yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {employee.isActive ? (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDateTime(employee.createdAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(employee)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(employee.employeeId)}
                          title="Reset Password"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        {employee.isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeactivate(employee.employeeId)}
                            title="Deactivate"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(employee.employeeId)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name *</Label>
                <Input
                  id="editFirstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name *</Label>
                <Input
                  id="editLastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role *</Label>
              <Select value={role} onValueChange={(val) => setRole(val as 'EMPLOYEE')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                  {/*<SelectItem value="AGENT_MANAGER"></SelectItem>*/}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                Update Employee
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowEditDialog(false); resetForm(); }}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
