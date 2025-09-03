'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Printer,
  Mail,
  FileSpreadsheet
} from 'lucide-react';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
}

interface PayrollData {
  employee_id: string;
  employee_name: string;
  employee_type: string;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  hourly_rate: number;
  regular_pay: number;
  overtime_pay: number;
  total_pay: number;
  client: string;
  department: string;
  period_start: string;
  period_end: string;
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('payroll');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportSummary, setReportSummary] = useState({
    totalEmployees: 0,
    totalHours: 0,
    totalRegularHours: 0,
    totalOvertimeHours: 0,
    totalPay: 0,
    averageHoursPerEmployee: 0
  });

  const supabase = createClientComponentClient();
  const router = useRouter();

  const reportTypes: ReportType[] = [
    {
      id: 'payroll',
      name: 'Payroll Export',
      description: 'Export timesheet data for payroll processing',
      icon: FileSpreadsheet,
      color: 'bg-green-500'
    },
    {
      id: 'billing',
      name: 'Client Billing',
      description: 'Generate billing reports for clients',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      id: 'utilization',
      name: 'Employee Utilization',
      description: 'Track employee hours and productivity',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      id: 'missing',
      name: 'Missing Timesheets',
      description: 'Identify employees who haven\'t submitted',
      icon: AlertCircle,
      color: 'bg-yellow-500'
    },
    {
      id: 'overtime',
      name: 'Overtime Analysis',
      description: 'Review overtime hours by employee and department',
      icon: Clock,
      color: 'bg-red-500'
    },
    {
      id: 'project',
      name: 'Project Summary',
      description: 'Hours and costs by project',
      icon: FileText,
      color: 'bg-indigo-500'
    }
  ];

  useEffect(() => {
    // Set default date range (current pay period)
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    setStartDate(sunday.toISOString().split('T')[0]);
    setEndDate(saturday.toISOString().split('T')[0]);

    fetchClients();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      generateReport();
    }
  }, [selectedReport, startDate, endDate, selectedClient, selectedDepartment]);

  const fetchClients = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('id, name')
        .eq('active', true);
      
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await supabase
        .from('employees')
        .select('department')
        .not('department', 'is', null);
      
      const uniqueDepts = [...new Set(data?.map(d => d.department) || [])];
      setDepartments(uniqueDepts);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('timecards')
        .select(`
          *,
          employee:employee_id (
            first_name,
            last_name,
            employee_type,
            hourly_rate,
            department,
            client:client_id (
              name
            )
          )
        `)
        .gte('work_date', startDate)
        .lte('work_date', endDate)
        .eq('status', 'approved');

      if (selectedClient !== 'all') {
        query = query.eq('employee.client_id', selectedClient);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process data for payroll report
      const processedData: PayrollData[] = [];
      const employeeTotals: { [key: string]: PayrollData } = {};

      data?.forEach(timecard => {
        const employeeId = timecard.employee_id;
        const employee = timecard.employee;
        
        if (!employeeTotals[employeeId]) {
          employeeTotals[employeeId] = {
            employee_id: employeeId,
            employee_name: `${employee.first_name} ${employee.last_name}`,
            employee_type: employee.employee_type,
            regular_hours: 0,
            overtime_hours: 0,
            total_hours: 0,
            hourly_rate: employee.hourly_rate || 0,
            regular_pay: 0,
            overtime_pay: 0,
            total_pay: 0,
            client: employee.client?.name || 'Unassigned',
            department: employee.department || 'Unassigned',
            period_start: startDate,
            period_end: endDate
          };
        }

        employeeTotals[employeeId].regular_hours += timecard.regular_hours || 0;
        employeeTotals[employeeId].overtime_hours += timecard.overtime_hours || 0;
        employeeTotals[employeeId].total_hours += timecard.total_hours || 0;
      });

      // Calculate pay
      Object.values(employeeTotals).forEach(employee => {
        employee.regular_pay = employee.regular_hours * employee.hourly_rate;
        employee.overtime_pay = employee.overtime_hours * employee.hourly_rate * 1.5;
        employee.total_pay = employee.regular_pay + employee.overtime_pay;
        processedData.push(employee);
      });

      // Apply department filter if needed
      let filteredData = processedData;
      if (selectedDepartment !== 'all') {
        filteredData = processedData.filter(d => d.department === selectedDepartment);
      }

      setPayrollData(filteredData);

      // Calculate summary
      const summary = {
        totalEmployees: filteredData.length,
        totalHours: filteredData.reduce((sum, d) => sum + d.total_hours, 0),
        totalRegularHours: filteredData.reduce((sum, d) => sum + d.regular_hours, 0),
        totalOvertimeHours: filteredData.reduce((sum, d) => sum + d.overtime_hours, 0),
        totalPay: filteredData.reduce((sum, d) => sum + d.total_pay, 0),
        averageHoursPerEmployee: 0
      };
      summary.averageHoursPerEmployee = summary.totalEmployees > 0 
        ? summary.totalHours / summary.totalEmployees 
        : 0;

      setReportSummary(summary);

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // This would use a library like xlsx to export
    // For now, we'll create a CSV
    const headers = [
      'Employee Name',
      'Employee Type',
      'Client',
      'Department',
      'Regular Hours',
      'Overtime Hours',
      'Total Hours',
      'Hourly Rate',
      'Regular Pay',
      'Overtime Pay',
      'Total Pay'
    ];

    const csvContent = [
      headers.join(','),
      ...payrollData.map(row => [
        row.employee_name,
        row.employee_type,
        row.client,
        row.department,
        row.regular_hours,
        row.overtime_hours,
        row.total_hours,
        row.hourly_rate,
        row.regular_pay.toFixed(2),
        row.overtime_pay.toFixed(2),
        row.total_pay.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Reports &amp; Export</h1>
                <p className="text-sm text-gray-300">Generate reports and export data</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/auth/logout')}
              className="px-4 py-2 bg-pink text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Report Types */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Report Types
          </h2>
          <div className="space-y-2">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                  selectedReport === report.id
                    ? 'bg-navy text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  selectedReport === report.id ? 'bg-white/20' : report.color
                } text-white`}>
                  <report.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{report.name}</p>
                  <p className={`text-xs mt-1 ${
                    selectedReport === report.id ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {report.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-navy mb-4">Report Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink focus:border-transparent"
                >
                  <option value="all">All Clients</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Employees</p>
              <p className="text-2xl font-bold text-navy">{reportSummary.totalEmployees}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Hours</p>
              <p className="text-2xl font-bold text-navy">{reportSummary.totalHours.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Regular Hours</p>
              <p className="text-2xl font-bold text-blue-600">{reportSummary.totalRegularHours.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Overtime Hours</p>
              <p className="text-2xl font-bold text-orange-600">{reportSummary.totalOvertimeHours.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Total Payroll</p>
              <p className="text-2xl font-bold text-green-600">${reportSummary.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Avg Hours/Employee</p>
              <p className="text-2xl font-bold text-purple-600">{reportSummary.averageHoursPerEmployee.toFixed(1)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-navy">Payroll Details</h3>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-pink text-white rounded-lg hover:bg-pink-600 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export to Excel
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink mx-auto"></div>
                <p className="mt-4 text-gray-600">Generating report...</p>
              </div>
            ) : payrollData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Regular
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        OT
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Hrs
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Pay
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payrollData.map((row) => (
                      <tr key={row.employee_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{row.employee_name}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            row.employee_type === 'W2' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {row.employee_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.client}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {row.department}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          {row.regular_hours.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-orange-600">
                          {row.overtime_hours.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                          {row.total_hours.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          ${row.hourly_rate.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">
                          ${row.total_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-gray-900">
                        Totals
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">
                        {reportSummary.totalRegularHours.toFixed(1)}
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-orange-600">
                        {reportSummary.totalOvertimeHours.toFixed(1)}
                      </td>
                      <td className="px-6 py-3 text-sm text-right font-semibold text-gray-900">
                        {reportSummary.totalHours.toFixed(1)}
                      </td>
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-sm text-right font-bold text-green-600">
                        ${reportSummary.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No data available for the selected parameters</p>
                <p className="text-sm mt-2">Try adjusting your date range or filters</p>
              </div>
            )}
          </div>

          {/* Export Format Note */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Export Format</h4>
                <p className="text-sm text-blue-700">
                  This report exports in a format compatible with Tracker payroll system. 
                  The CSV file includes all necessary fields for direct import including employee IDs, 
                  hours breakdown, and calculated pay amounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}