// User Types
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'AGENT_MANAGER' | 'AGENT_USER' | 'EMPLOYEE'
export type UserType = 'ADMIN' | 'AGENT' | 'EMPLOYEE'

export interface User {
  id: string
  email: string
  role: UserRole
  userType: UserType
  name?: string
  agentId?: string
}

export interface LoginRequest {
  email: string
  password: string
  userType: UserType
}

export interface JwtResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

// Agent Types
export interface Agent {
  agentId: string
  name: string
  email: string
  phone: string
  creditLimit: number
  currentCredit: number
  bankGurantee: number
  defaultCurrency: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AgentRequest {
  agentId?: string
  name: string
  email: string
  phone: string
  password?: string
  creditLimit: number
  bankGurantee: number
  defaultCurrency: string
  role: UserRole
}

export interface AgentStatistics {
  totalBookings: number
  totalRevenue: number
  creditUtilization: number
  activeEmployees: number
  pendingPayments: number
}

// Employee Types
export interface Employee {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  agentId: string
  isActive: boolean
  createdAt: string
}

export interface EmployeeRequest {
  firstName: string
  lastName: string
  email: string
  password?: string
  role: UserRole
}

// Flight Types
export interface FlightSearchRequest {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  children?: number
  infants?: number
  cabinClass?: string
}

export interface FlightResponse {
  availabilityId: string
  origin: string
  destination: string
  departureDate: string
  arrivalDate: string
  airline: string
  flightNumber: string
  cabinClass: string
  totalPrice: number
  currency: string
  availableSeats: number
  duration: string
}

// Booking Types
export interface Passenger {
  passengerType: 'ADULT' | 'CHILD' | 'INFANT'
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'M' | 'F'
  passportNumber: string
  passportExpiry: string
  nationality: string
}

export interface BookingRequest {
  availabilityId: string
  contactEmail: string
  contactPhone: string
  passengers: Passenger[]
}

export interface BookingResponse {
  bookingId: string
  pnr: string
  status: string
  totalAmount: number
  currency: string
  passengers: Passenger[]
  createdAt: string
  flight: FlightResponse
}

// Ticket Types
export interface TicketResponse {
  ticketId: string
  ticketNumber: string
  bookingId: string
  passengerId: string
  status: string
  issuedAt: string
  fare: number
  taxes: number
  total: number
}

export interface TicketIssueRequest {
  bookingId: string
}

// Credit Types
export interface CreditTransaction {
  transactionId: string
  agentId: string
  type: 'DEBIT' | 'CREDIT' | 'TOPUP'
  amount: number
  balance: number
  description: string
  createdAt: string
  status: string
}

export interface CreditTopupRequest {
  amount: number
  requestNotes: string
}

// Invoice Types
export interface InvoiceResponse {
  invoiceId: string
  invoiceNumber: string
  bookingId: string
  agentId: string
  totalAmount: number
  paidAmount: number
  status: string
  dueDate: string
  createdAt: string
}

// Payment Types
export interface PaymentRequest {
  invoiceId: string
  amount: number
  paymentMethod: string
  transactionId: string
}

export interface PaymentResponse {
  paymentId: string
  invoiceId: string
  amount: number
  paymentMethod: string
  transactionId: string
  status: string
  createdAt: string
}

// Report Types
export interface SalesReportResponse {
  totalSales: number
  totalBookings: number
  totalRevenue: number
  period: {
    startDate: string
    endDate: string
  }
  data: any[]
}

// Dashboard Types
export interface DashboardStatistics {
  totalAgents: number
  activeAgents: number
  totalBookings: number
  totalRevenue: number
  pendingTopups: number
  todayBookings: number
  monthlyRevenue: number
  creditUtilization: number
}

export interface DashboardStats {
  totalAgents: number
  activeAgents: number
  totalBookings: number
  totalRevenue: number
  pendingTopups: number
  todayBookings: number
  monthlyRevenue: number
  creditUtilization: number
}

// Credit Approval Types
export interface CreditTopupApproval {
  topupId: string
  agentId: string
  agentName: string
  amount: number
  requestNotes: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requestedAt: string
  processedAt?: string
  processedBy?: string
  rejectionReason?: string
}

// System Types
export interface SystemSetting {
  settingKey: string
  settingValue: string
  description: string
  updatedAt: string
}

export interface SystemSettings {
  [key: string]: string | number | boolean
}

export interface AuditLog {
  logId: string
  userId: string
  action: string
  entityType: string
  entityId: string
  timestamp: string
  details: string
}

export interface SyncLog {
  syncId: string
  syncType: string
  status: string
  startTime: string
  endTime: string
  recordsProcessed: number
  errors: string
}

// API Response
export interface ApiResponse<T = any> {
  message: string
  data: T
}
