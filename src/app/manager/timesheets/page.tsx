'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { ChevronLeft, Search, Eye, Download, BarChart3, PieChart, CheckCircle, UserPlus, FolderOpen } from 'lucide-react'
import NotificationBell from '@/components/notifications/NotificationBell'

interface TimesheetEntry {
  id: string
  employee: {
    id: string
    name: string
    avatar: string
    department: string
  }
  date: string
  jobTitle: string
  hours: number
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  timeApprover: string
}

export default function TimesheetReviewPage() {
  const router = useRouter()
  const { appUser } = useAuth()
  const { createNotification } = useNotifications()
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetEntry | null>(null)

  // All timesheet data with time approver information
  const allTimesheetData: TimesheetEntry[] = [
    {
      id: 'ts1',
      employee: { id: 'emp1', name: 'Mike Chen', avatar: 'MC', department: 'Tech Infrastructure' },
      date: '2025-08-20',
      jobTitle: 'Senior Frontend Developer',
      hours: 8,
      amount: 600,
      status: 'pending',
      submittedAt: '2025-08-20T17:00:00Z',
      timeApprover: 'manager-demo'
    },
    {
      id: 'ts2', 
      employee: { id: 'emp1', name: 'Mike Chen', avatar: 'MC', department: 'Tech Infrastructure' },
      date: '2025-08-19',
      jobTitle: 'Senior Frontend Developer',
      hours: 7.5,
      amount: 562.5,
      status: 'pending',
      submittedAt: '2025-08-19T18:30:00Z',
      timeApprover: 'manager-demo'
    },
    {
      id: 'ts3',
      employee: { id: 'emp2', name: 'Sarah Johnson', avatar: 'SJ', department: 'Software Development' },
      date: '2025-08-20',
      jobTitle: 'Full Stack Developer',
      hours: 8,
      amount: 640,
      status: 'pending',
      submittedAt: '2025-08-20T16:45:00Z',
      timeApprover: 'manager-demo'
    },
    {
      id: 'ts4',
      employee: { id: 'emp3', name: 'David Kim', avatar: 'DK', department: 'Data Analysis' },
      date: '2025-08-19',
      jobTitle: 'Data Analyst',
      hours: 6.5,
      amount: 487.5,
      status: 'pending',
      submittedAt: '2025-08-19T15:20:00Z',
      timeApprover: 'manager2-demo'
    }
  ]

  // Filter timesheets by assigned employees
  const mockTimesheetData = allTimesheetData.filter(timesheet => 
    timesheet.timeApprover === (appUser?.id || 'manager-demo')
  )

  const filteredTimesheets = mockTimesheetData.filter(timesheet => {
    const matchesSearch = timesheet.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timesheet.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !departmentFilter || timesheet.employee.department === departmentFilter
    const matchesStatus = !statusFilter || timesheet.status === statusFilter
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(filteredTimesheets.map(t => t.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleViewDetails = (timesheet: TimesheetEntry) => {
    setSelectedTimesheet(timesheet)
    setShowDetailsModal(true)
  }

  const handleApprove = async (id: string) => {
    try {
      const timesheet = mockTimesheetData.find(t => t.id === id);
      if (!timesheet) {
        throw new Error('Timesheet not found');
      }

      // Create in-app notification for employee
      createNotification(
        'timesheet_approved',
        timesheet.employee.id,
        `timesheet_${id}`,
        'timesheet',
        {
          employeeName: timesheet.employee.name,
          period: `Week of ${timesheet.date}`,
          totalHours: timesheet.hours,
          approvedDate: new Date().toLocaleDateString(),
          managerName: appUser ? `${appUser.first_name} ${appUser.last_name}` : 'Manager'
        }
      );

      const response = await fetch('/api/manager/Approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee: timesheet.employee.id,
          type: 'timesheet',
          action: 'approve_all',
          managerName: appUser ? `${appUser.first_name} ${appUser.last_name}` : 'Manager',
          employeeData: {
            name: timesheet.employee.name,
            period: `Week of ${timesheet.date}`,
            hours: timesheet.hours,
            amount: timesheet.amount,
            project: timesheet.jobTitle
          }
        })
      })
      
      if (response.ok) {
        const result = await response.json();
        alert(`Timesheet approved successfully! ${result.notificationsSent ? 'Notifications sent.' : ''}`);
        // In a real app, you would refresh the data here
      } else {
        throw new Error('Approval failed')
      }
    } catch (error) {
      console.error('Approval failed:', error)
      alert('Approval failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleReject = async (id: string) => {
    try {
      const timesheet = mockTimesheetData.find(t => t.id === id);
      if (!timesheet) {
        throw new Error('Timesheet not found');
      }

      // Create in-app notification for employee
      createNotification(
        'timesheet_rejected',
        timesheet.employee.id,
        `timesheet_${id}`,
        'timesheet',
        {
          employeeName: timesheet.employee.name,
          period: `Week of ${timesheet.date}`,
          totalHours: timesheet.hours,
          rejectedDate: new Date().toLocaleDateString(),
          managerName: appUser ? `${appUser.first_name} ${appUser.last_name}` : 'Manager',
          reason: 'Please review and correct issues'
        }
      );

      const response = await fetch('/api/manager/Reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee: timesheet.employee.id,
          type: 'timesheet',
          action: 'reject',
          managerName: appUser ? `${appUser.first_name} ${appUser.last_name}` : 'Manager',
          employeeData: {
            name: timesheet.employee.name,
            period: `Week of ${timesheet.date}`,
            hours: timesheet.hours,
            amount: timesheet.amount,
            project: timesheet.jobTitle
          },
          reason: 'Please review and correct issues'
        })
      })
      
      if (response.ok) {
        const result = await response.json();
        alert(`Timesheet rejected successfully! ${result.notificationsSent ? 'Notifications sent.' : ''}`);
        // In a real app, you would refresh the data here
      } else {
        throw new Error('Rejection failed')
      }
    } catch (error) {
      console.error('Rejection failed:', error)
      alert('Rejection failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleBulkApprove = async () => {
    if (selectedItems.length === 0) return
    
    try {
      // In a real app, you would send a bulk approval request
      alert(`Approving ${selectedItems.length} timesheets...`)
      setSelectedItems([])
    } catch (error) {
      console.error('Bulk approval failed:', error)
      alert('Bulk approval failed')
    }
  }

  const handleBulkReject = async () => {
    if (selectedItems.length === 0) return
    
    try {
      // In a real app, you would send a bulk rejection request
      alert(`Rejecting ${selectedItems.length} timesheets...`)
      setSelectedItems([])
    } catch (error) {
      console.error('Bulk rejection failed:', error)
      alert('Bulk rejection failed')
    }
  }

  const exportReport = (format: string) => {
    alert(`Exporting timesheet report as ${format}...`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/WE logo FC Mar2024.png" 
              alt="West End Workforce Logo" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {appUser ? `${appUser.first_name} ${appUser.last_name}` : 'Manager'}!</h1>
              <p className="text-gray-600">West End Workforce • Manager Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <NotificationBell className="text-gray-600 hover:text-pink-600" />
            
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
              {appUser ? `${appUser.first_name?.[0] || ''}${appUser.last_name?.[0] || ''}` : 'M'}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{appUser ? `${appUser.first_name} ${appUser.last_name}` : 'Manager'}</div>
              <div className="text-xs text-gray-500">Manager</div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title Section */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/manager')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Pending Timesheets</h2>
              <p className="text-gray-600">Review and approve contractor timesheets</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg border">
              <span className="text-sm text-gray-500">Total Pending</span>
              <div className="text-lg font-semibold text-gray-900">{mockTimesheetData.filter(t => t.status === 'pending').length} timesheets</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border">
              <span className="text-sm text-gray-500">Total Hours</span>
              <div className="text-lg font-semibold text-gray-900">{mockTimesheetData.reduce((sum, t) => sum + t.hours, 0)} hrs</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border">
              <span className="text-sm text-gray-500">Total Amount</span>
              <div className="text-lg font-semibold text-gray-900">${mockTimesheetData.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter/Search Section */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by contractor name or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Departments</option>
              <option value="Tech Infrastructure">Tech Infrastructure</option>
              <option value="Software Development">Software Development</option>
              <option value="Data Analysis">Data Analysis</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => exportReport('csv')}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button 
              onClick={handleBulkApprove}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Approve All Visible
            </button>
          </div>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === filteredTimesheets.length && filteredTimesheets.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contractor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTimesheets.map((timesheet) => (
              <tr key={timesheet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(timesheet.id)}
                    onChange={() => handleSelectItem(timesheet.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                      {timesheet.employee.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{timesheet.employee.name}</div>
                      <div className="text-sm text-gray-500">{timesheet.employee.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(timesheet.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{timesheet.jobTitle}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{timesheet.hours} hrs</td>
                <td className="px-6 py-4 text-sm text-gray-900">${timesheet.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(timesheet.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => handleViewDetails(timesheet)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleApprove(timesheet.id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium hover:bg-green-200"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(timesheet.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions Footer */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedItems.length} timesheet{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <button 
                onClick={() => setSelectedItems([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleBulkReject}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
              >
                Reject Selected
              </button>
              <button 
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                Approve Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timesheet Details Modal */}
      {showDetailsModal && selectedTimesheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Timesheet Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contractor</label>
                  <p className="text-gray-900">{selectedTimesheet.employee.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <p className="text-gray-900">{selectedTimesheet.employee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{new Date(selectedTimesheet.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hours</label>
                  <p className="text-gray-900">{selectedTimesheet.hours} hrs</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Job Title</label>
                  <p className="text-gray-900">{selectedTimesheet.jobTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-gray-900 font-semibold">${selectedTimesheet.amount}</p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleReject(selectedTimesheet.id)}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleApprove(selectedTimesheet.id)}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
