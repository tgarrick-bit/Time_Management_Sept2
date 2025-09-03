'use client';

// src/app/manager/page.tsx

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import RoleGuard from '@/components/auth/RoleGuard';
import type { Database } from '@/types/supabase';
import type { Employee } from '@/types';
import { 
  Clock, 
  FileText, 
  Receipt, 
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Calendar,
  Eye,
  Check,
  X,
  Filter,
  Download,
  DollarSign,
  Briefcase,
  LogOut,
  Search,
  ChevronDown,
  Image as ImageIcon,
  Paperclip,
  User,
  MapPin,
  Building,
  CreditCard
} from 'lucide-react';

interface TimecardDetail {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_department?: string;
  week_ending: string;
  total_hours: number;
  total_overtime: number;
  total_amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  notes?: string;
  entries?: TimecardEntry[];
}

interface TimecardEntry {
  id: string;
  date: string;
  project_id: string;
  project_name: string;
  project_code: string;
  hours: number;
  overtime_hours: number;
  description: string;
}

interface ExpenseDetail {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  employee_department?: string;
  expense_date: string;
  amount: number;
  category: string;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  receipt_urls: string[];
  project_id?: string;
  project_name?: string;
  vendor?: string;
  payment_method?: string;
  notes?: string;
}

interface FilterOptions {
  dateRange: 'all' | 'today' | 'week' | 'month' | 'custom';
  type: 'all' | 'timecards' | 'expenses';
  status: 'all' | 'submitted' | 'approved' | 'rejected';
  employee: string;
  project: string;
  department: string;
  customStartDate?: string;
  customEndDate?: string;
}

interface Project {
  id: string;
  name: string;
  code: string;
  client?: string;
}

export default function ManagerDashboard() {
  const [manager, setManager] = useState<Employee | null>(null);
  const [timecards, setTimecards] = useState<TimecardDetail[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDetail[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedItem, setSelectedItem] = useState<TimecardDetail | ExpenseDetail | null>(null);
  const [itemType, setItemType] = useState<'timecard' | 'expense' | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'week',
    type: 'all',
    status: 'submitted',
    employee: 'all',
    project: 'all',
    department: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    pendingTimecards: 0,
    pendingExpenses: 0,
    totalTeamMembers: 0,
    weeklyHours: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
    totalPendingAmount: 0,
    overtimeAlerts: 0
  });

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current manager
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Get manager data
      const { data: managerData } = await supabase
        .from('employees')
        .select('*')
        .eq('id', user.id)
        .single();

      if (managerData) {
        setManager(managerData);
        
        // Check role
        if (managerData.role !== 'manager' && managerData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
      }

      // Fetch all employees for filtering
      const { data: employeesData } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true);
      
      setEmployees(employeesData || []);

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active');
      
      setProjects(projectsData || []);

      // Build date filter
      let dateFilter = {};
      const now = new Date();
      switch (filters.dateRange) {
        case 'today':
          dateFilter = { start: now.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = { start: weekAgo.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFilter = { start: monthAgo.toISOString().split('T')[0], end: now.toISOString().split('T')[0] };
          break;
        case 'custom':
          if (filters.customStartDate && filters.customEndDate) {
            dateFilter = { start: filters.customStartDate, end: filters.customEndDate };
          }
          break;
      }

      // Fetch timecards with employee info
      if (filters.type === 'all' || filters.type === 'timecards') {
        let timecardsQuery = supabase
          .from('timesheets')
          .select(`
            *,
            employees!timesheets_employee_id_fkey (
              id,
              first_name,
              last_name,
              email,
              department
            )
          `);

        if (filters.status !== 'all') {
          timecardsQuery = timecardsQuery.eq('status', filters.status);
        }
        if (filters.employee !== 'all') {
          timecardsQuery = timecardsQuery.eq('employee_id', filters.employee);
        }

        const { data: timecardsData } = await timecardsQuery;

        const formattedTimecards = (timecardsData || []).map(tc => ({
          id: tc.id,
          employee_id: tc.employee_id,
          employee_name: tc.employees ? `${tc.employees.first_name} ${tc.employees.last_name}` : 'Unknown',
          employee_email: tc.employees?.email || '',
          employee_department: tc.employees?.department,
          week_ending: tc.week_ending,
          total_hours: tc.total_hours || 0,
          total_overtime: 0,
          total_amount: tc.total_hours * 25, // Example rate
          status: tc.status,
          submitted_at: tc.submitted_at,
          approved_at: tc.approved_at,
          approved_by: tc.approved_by,
          notes: tc.comments
        }));

        setTimecards(formattedTimecards);
      }

      // Fetch expenses with employee info
      if (filters.type === 'all' || filters.type === 'expenses') {
        let expensesQuery = supabase
          .from('expenses')
          .select(`
            *,
            employees!expenses_employee_id_fkey (
              id,
              first_name,
              last_name,
              email,
              department
            ),
            projects!expenses_project_id_fkey (
              id,
              name,
              code
            )
          `);

        if (filters.status !== 'all') {
          expensesQuery = expensesQuery.eq('status', filters.status);
        }
        if (filters.employee !== 'all') {
          expensesQuery = expensesQuery.eq('employee_id', filters.employee);
        }
        if (filters.project !== 'all') {
          expensesQuery = expensesQuery.eq('project_id', filters.project);
        }

        const { data: expensesData } = await expensesQuery;

        const formattedExpenses = (expensesData || []).map(exp => ({
          id: exp.id,
          employee_id: exp.employee_id,
          employee_name: exp.employees ? `${exp.employees.first_name} ${exp.employees.last_name}` : 'Unknown',
          employee_email: exp.employees?.email || '',
          employee_department: exp.employees?.department,
          expense_date: exp.expense_date,
          amount: exp.amount,
          category: exp.category,
          description: exp.description || '',
          status: exp.status,
          submitted_at: exp.submitted_at,
          approved_at: exp.approved_at,
          approved_by: exp.approved_by,
          receipt_urls: exp.receipt_url ? [exp.receipt_url] : [],
          project_id: exp.project_id,
          project_name: exp.projects?.name,
          notes: exp.comments
        }));

        setExpenses(formattedExpenses);
      }

      // Calculate stats
      calculateStats();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const pendingTimecards = timecards.filter(t => t.status === 'submitted').length;
    const pendingExpenses = expenses.filter(e => e.status === 'submitted').length;
    const weeklyHours = timecards.reduce((sum, t) => sum + t.total_hours, 0);
    const totalPendingAmount = 
      timecards.filter(t => t.status === 'submitted').reduce((sum, t) => sum + t.total_amount, 0) +
      expenses.filter(e => e.status === 'submitted').reduce((sum, e) => sum + e.amount, 0);
    const overtimeAlerts = timecards.filter(t => t.total_overtime > 0).length;
    const approvedThisWeek = 
      timecards.filter(t => t.status === 'approved').length +
      expenses.filter(e => e.status === 'approved').length;
    const rejectedThisWeek = 
      timecards.filter(t => t.status === 'rejected').length +
      expenses.filter(e => e.status === 'rejected').length;

    setStats({
      pendingTimecards,
      pendingExpenses,
      totalTeamMembers: employees.length,
      weeklyHours,
      approvedThisWeek,
      rejectedThisWeek,
      totalPendingAmount,
      overtimeAlerts
    });
  };

  const handleApprove = async (id: string, type: 'timecard' | 'expense') => {
    setProcessing(true);
    try {
      const table = type === 'timecard' ? 'timesheets' : 'expenses';
      const { error } = await supabase
        .from(table)
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: manager?.id
        })
        .eq('id', id);

      if (!error) {
        await fetchDashboardData();
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error approving:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id: string, type: 'timecard' | 'expense', reason?: string) => {
    setProcessing(true);
    try {
      const table = type === 'timecard' ? 'timesheets' : 'expenses';
      const { error } = await supabase
        .from(table)
        .update({ 
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: manager?.id,
          comments: reason
        })
        .eq('id', id);

      if (!error) {
        await fetchDashboardData();
        setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    } finally {
      setProcessing(false);
    }
  };

  const openDetailView = async (item: TimecardDetail | ExpenseDetail, type: 'timecard' | 'expense') => {
    setSelectedItem(item);
    setItemType(type);
    
    // Fetch additional details if timecard
    if (type === 'timecard') {
      // Fetch timecard entries
      const { data: entries } = await supabase
        .from('timesheet_entries')
        .select(`
          *,
          projects!timesheet_entries_project_id_fkey (
            id,
            name,
            code
          )
        `)
        .eq('timesheet_id', item.id);

      if (entries) {
        (item as TimecardDetail).entries = entries.map(e => ({
          id: e.id,
          date: e.date,
          project_id: e.project_id,
          project_name: e.projects?.name || 'Unknown Project',
          project_code: e.projects?.code || '',
          hours: e.hours,
          overtime_hours: 0,
          description: e.description || ''
        }));
        setSelectedItem({...item});
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 border-gray-300',
      submitted: 'bg-amber-50 text-amber-700 border-amber-300',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      rejected: 'bg-red-50 text-red-700 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      travel: MapPin,
      meals: CreditCard,
      supplies: Briefcase,
      equipment: Building,
      other: Receipt
    };
    const Icon = icons[category.toLowerCase()] || Receipt;
    return <Icon className="h-4 w-4" />;
  };

  // Filter combined items
  const filteredItems = [
    ...(filters.type === 'all' || filters.type === 'timecards' ? 
      timecards.map(t => ({...t, itemType: 'timecard' as const})) : []),
    ...(filters.type === 'all' || filters.type === 'expenses' ? 
      expenses.map(e => ({...e, itemType: 'expense' as const})) : [])
  ].filter(item => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return item.employee_name.toLowerCase().includes(search) ||
             item.employee_email.toLowerCase().includes(search) ||
             ('description' in item && item.description?.toLowerCase().includes(search));
    }
    return true;
  }).sort((a, b) => new Date(b.submitted_at || '').getTime() - new Date(a.submitted_at || '').getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e31c79] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['manager', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#05202E] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Manager Dashboard - West End Workforce
                  </h1>
                  <span className="text-xs text-gray-300">Review & Approve</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-200">{manager?.email}</span>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-sm text-gray-200 hover:text-white"
                >
                  Employee View
                </button>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/auth/login');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-200 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-[#e31c79] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Timecards</p>
                  <p className="text-2xl font-bold text-[#05202E]">{stats.pendingTimecards}</p>
                </div>
                <Clock className="h-8 w-8 text-[#e31c79]" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#e31c79] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Expenses</p>
                  <p className="text-2xl font-bold text-[#05202E]">{stats.pendingExpenses}</p>
                </div>
                <Receipt className="h-8 w-8 text-[#e31c79]" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#05202E] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Amount</p>
                  <p className="text-2xl font-bold text-[#05202E]">
                    {formatCurrency(stats.totalPendingAmount)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-[#05202E]" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#05202E] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overtime Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.overtimeAlerts}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by employee name, email, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79] focus:border-transparent"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4 pt-4 border-t">
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value as any})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79]"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>

                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value as any})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79]"
                >
                  <option value="all">All Types</option>
                  <option value="timecards">Timecards Only</option>
                  <option value="expenses">Expenses Only</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79]"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={filters.employee}
                  onChange={(e) => setFilters({...filters, employee: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79]"
                >
                  <option value="all">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.project}
                  onChange={(e) => setFilters({...filters, project: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79]"
                >
                  <option value="all">All Projects</option>
                  {projects.map(proj => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name} ({proj.code})
                    </option>
                  ))}
                </select>

                <select
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e31c79]"
                >
                  <option value="all">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="sales">Sales</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                </select>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-[#05202E]">
                Review Items ({filteredItems.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                  <p className="text-gray-600">No items to review</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Adjust your filters to see more items
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openDetailView(item, item.itemType)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                          item.itemType === 'timecard' ? 'bg-blue-50' : 'bg-pink-50'
                        }`}>
                          {item.itemType === 'timecard' ? 
                            <Clock className={`h-5 w-5 ${
                              item.itemType === 'timecard' ? 'text-blue-600' : 'text-[#e31c79]'
                            }`} /> :
                            getCategoryIcon((item as ExpenseDetail).category)
                          }
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium text-[#05202E]">
                              {item.employee_name}
                            </p>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.itemType === 'timecard' ? 'Timecard' : 'Expense'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {item.itemType === 'timecard' ? (
                              <>
                                <span>Week ending: {formatDate((item as TimecardDetail).week_ending)}</span>
                                <span>•</span>
                                <span>{(item as TimecardDetail).total_hours} hours</span>
                                <span>•</span>
                                <span>{formatCurrency((item as TimecardDetail).total_amount)}</span>
                              </>
                            ) : (
                              <>
                                <span>{formatDate((item as ExpenseDetail).expense_date)}</span>
                                <span>•</span>
                                <span>{(item as ExpenseDetail).category}</span>
                                <span>•</span>
                                <span>{formatCurrency((item as ExpenseDetail).amount)}</span>
                                <span>•</span>
                                <span>{(item as ExpenseDetail).description}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'submitted' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(item.id, item.itemType);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(item.id, item.itemType);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailView(item, item.itemType);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedItem && itemType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#05202E]">
                      {itemType === 'timecard' ? 'Timecard Review' : 'Expense Review'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted by {selectedItem.employee_name} on {formatDate(selectedItem.submitted_at || '')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Employee Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-[#05202E] mb-3">Employee Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{selectedItem.employee_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{selectedItem.employee_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium">{selectedItem.employee_department || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {itemType === 'timecard' ? (
                  // Timecard Details
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-[#05202E] mb-3">Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Week Ending</p>
                          <p className="font-semibold text-lg">
                            {formatDate((selectedItem as TimecardDetail).week_ending)}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Total Hours</p>
                          <p className="font-semibold text-lg">
                            {(selectedItem as TimecardDetail).total_hours}
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Overtime</p>
                          <p className="font-semibold text-lg">
                            {(selectedItem as TimecardDetail).total_overtime}
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-semibold text-lg">
                            {formatCurrency((selectedItem as TimecardDetail).total_amount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold text-[#05202E] mb-3">Time Entries by Project</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {(selectedItem as TimecardDetail).entries?.map((entry) => (
                              <tr key={entry.id}>
                                <td className="px-4 py-3 text-sm">{formatDate(entry.date)}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div>
                                    <p className="font-medium">{entry.project_name}</p>
                                    <p className="text-gray-500">{entry.project_code}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">{entry.hours}</td>
                                <td className="px-4 py-3 text-sm">{entry.description}</td>
                              </tr>
                            )) || (
                              <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                  No detailed entries available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  // Expense Details
                  <>
                    <div className="mb-6">
                      <h3 className="font-semibold text-[#05202E] mb-3">Expense Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">{formatDate((selectedItem as ExpenseDetail).expense_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-medium text-lg">{formatCurrency((selectedItem as ExpenseDetail).amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{(selectedItem as ExpenseDetail).category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Project</p>
                          <p className="font-medium">{(selectedItem as ExpenseDetail).project_name || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium">{(selectedItem as ExpenseDetail).description}</p>
                        </div>
                      </div>
                    </div>

                    {(selectedItem as ExpenseDetail).receipt_urls.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-[#05202E] mb-3">Receipts</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {(selectedItem as ExpenseDetail).receipt_urls.map((url, index) => (
                            <div key={index} className="border rounded-lg p-4 text-center">
                              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#e31c79] hover:underline"
                              >
                                View Receipt {index + 1}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Notes */}
                {selectedItem.notes && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#05202E] mb-3">Notes</h3>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                      {selectedItem.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedItem.status === 'submitted' && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(selectedItem.id, itemType)}
                      disabled={processing}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleApprove(selectedItem.id, itemType)}
                      disabled={processing}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}