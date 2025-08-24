export type UserRole = 'employee' | 'client_approver' | 'admin' | 'payroll' | 'manager'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  client_id?: string
  manager_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  contact_person: string
  contact_email: string
  contact_phone?: string
  time_tracking_method: 'detailed' | 'simple'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  client_id: string
  description?: string
  start_date: string
  end_date?: string
  is_active: boolean
  status: 'active' | 'completed' | 'on-hold'
  budget?: number
  created_at: string
  updated_at: string
}

export interface ProjectAssignment {
  id: string
  user_id: string
  project_id: string
  start_date: string
  end_date?: string
  hourly_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  name: string
  code: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TimeEntry {
  id: string
  user_id: string
  project_id: string
  task_id: string
  date: string
  start_time?: string
  end_time?: string
  total_hours: number // stored in minutes for precision
  notes?: string
  location?: string
  is_submitted: boolean
  is_approved: boolean
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface Timesheet {
  id: string
  user_id: string
  week_start_date: string
  week_end_date: string
  total_hours: number
  status: 'draft' | 'submitted' | 'client_approved' | 'payroll_approved' | 'rejected'
  submitted_at?: string
  client_approved_at?: string
  payroll_approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface ExpenseCategory {
  id: string
  name: string
  description?: string
  spending_limit?: number
  is_billable: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ExpenseItem {
  id: string
  user_id: string
  project_id?: string
  category_id: string
  date: string
  amount: number
  description: string
  receipt_url?: string
  is_billable: boolean
  is_submitted: boolean
  is_approved: boolean
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface ExpenseReport {
  id: string
  user_id: string
  month: string
  year: number
  total_amount: number
  status: 'draft' | 'submitted' | 'client_approved' | 'payroll_approved' | 'rejected'
  submitted_at?: string
  client_approved_at?: string
  payroll_approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface Approval {
  id: string
  approver_id: string
  approver_type: 'client' | 'payroll'
  timesheet_id?: string
  expense_report_id?: string
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  approved_at?: string
  rejected_at?: string
  created_at: string
  updated_at: string
}

export interface RateTable {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RateEntry {
  id: string
  rate_table_id: string
  user_id?: string
  project_id?: string
  hourly_rate: number
  effective_date: string
  end_date?: string
  created_at: string
  updated_at: string
}

// Form types
export interface TimeEntryForm {
  project_id: string
  task_id: string
  date: string
  start_time?: string
  end_time?: string
  total_hours?: number
  notes?: string
  location?: string
}

export interface ExpenseEntryForm {
  project_id?: string
  category_id: string
  date: string
  amount: number
  description: string
  receipt?: File
  is_billable: boolean
}

// Dashboard types
export interface DashboardStats {
  totalHoursThisWeek: number
  totalExpensesThisMonth: number
  pendingApprovals: number
  submittedItems: number
}

export interface EmployeeDashboardStats {
  thisWeekHours: number
  pendingApprovals: number
  totalProjects: number
  totalEntries: number
}

export interface ProjectSummary {
  project: Project
  totalHours: number
  totalExpenses: number
  isActive: boolean
}

export interface ProjectOverviewItem {
  project: {
    id: string
    name: string
    description: string
    is_active: boolean
  }
  totalHours: number
  totalExpenses: number
  isActive: boolean
}

// Export types
export interface ATSExportRow {
  Employee: string
  Client: string
  Project: string
  Task: string
  Date: string
  Hours: number
  Rate: number
  Amount: number
}




