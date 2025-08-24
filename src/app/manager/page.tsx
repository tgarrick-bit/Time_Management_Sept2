'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Clock, DollarSign, Users, FileText, Eye, X, ChevronRight } from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';

interface TimesheetEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
  amount: number;
}

interface ExpenseEntry {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  receipt_url?: string;
}

interface ReviewModalData {
  employee: { id: string; name: string };
  type: 'timesheet' | 'expense';
  data: TimesheetEntry[] | ExpenseEntry[];
  count: number;
}

export default function ManagerDashboard() {
  const { appUser } = useAuth();
  const router = useRouter();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewModalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // All employee data with time approver information
  const allEmployees = [
    { id: 'emp1', name: 'Mike Chen', initials: 'MC', department: 'Tech Infrastructure', hours: 26, expenses: 0, timeApprover: 'manager-demo' },
    { id: 'emp2', name: 'Sarah Johnson', initials: 'SJ', department: 'Software Development', hours: 37.5, expenses: 245.8, timeApprover: 'manager-demo' },
    { id: 'emp3', name: 'David Kim', initials: 'DK', department: 'Data Analysis', hours: 22, expenses: 156.3, timeApprover: 'manager2-demo' },
    { id: 'emp4', name: 'Lisa Garcia', initials: 'LG', department: 'Software Development', hours: 40, expenses: 0, timeApprover: 'manager3-demo' },
  ];

  // Filter employees assigned to current manager
  const employees = allEmployees.filter(emp => emp.timeApprover === (appUser?.id || 'manager-demo'));

  const handleReviewClick = async (employeeId: string, type: 'timesheet' | 'expense') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/manager/approvals?employee=${employeeId}&type=${type}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReviewData(data);
        setShowReviewModal(true);
      } else {
        alert('Error loading data: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Review failed:', error);
      alert('Failed to load review data: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAll = async () => {
    if (!reviewData) return;
    
    setIsApproving(true);
    try {
      const response = await fetch('/api/manager/Approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee: reviewData.employee.id,
          type: reviewData.type,
          action: 'approve_all'
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON, got ${contentType}`);
      }

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Successfully approved all ${reviewData.type} entries for ${reviewData.employee.name}!`);
        setShowReviewModal(false);
        setReviewData(null);
      } else {
        throw new Error(result.error || 'Approval failed');
      }
      
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed: ' + (error as Error).message);
    } finally {
      setIsApproving(false);
    }
  };

  const closeModal = () => {
    setShowReviewModal(false);
    setReviewData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {appUser ? `${appUser.first_name} ${appUser.last_name}` : 'Manager'}!</h1>
            <p className="text-gray-600">ABC Corporation • Manager Dashboard</p>
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
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => router.push('/manager/timesheets')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Timesheets</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter(emp => emp.hours > 0).length}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 transition-colors mt-2" />
          </div>

          <div 
            onClick={() => router.push('/manager/expenses')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter(emp => emp.expenses > 0).length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors mt-2" />
          </div>

          <div 
            onClick={() => router.push('/manager/financial')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${employees.reduce((sum, emp) => sum + emp.expenses, 0).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors mt-2" />
          </div>

          <div 
            onClick={() => router.push('/manager/contractors')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Team</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors mt-2" />
          </div>
        </div>

        {/* Contractors List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Team Overview</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee.initials}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">{employee.hours} hrs this week</span>
                        {employee.expenses > 0 && (
                          <span className="text-sm text-gray-600">${employee.expenses} expenses</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleReviewClick(employee.id, 'timesheet')}
                      disabled={isLoading}
                      className={`px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Loading...' : 'Review Timesheet'}
                    </button>
                    
                    {employee.expenses > 0 && (
                      <button
                        onClick={() => handleReviewClick(employee.id, 'expense')}
                        disabled={isLoading}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Loading...' : 'Review Expenses'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {reviewData.type === 'timesheet' ? 'Timesheet Review' : 'Expense Review'}
                </h3>
                <p className="text-sm text-gray-600">
                  {reviewData.employee.name} • {reviewData.count} entries
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {reviewData.type === 'timesheet' ? (
                <div className="space-y-4">
                  {(reviewData.data as TimesheetEntry[]).map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{entry.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString()} • {entry.hours} hours
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${entry.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {(reviewData.data as ExpenseEntry[]).map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{entry.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.date).toLocaleDateString()} • {entry.category}
                          </p>
                          {entry.receipt_url && (
                            <p className="text-xs text-blue-600 mt-1">Receipt available</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${entry.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleApproveAll}
                disabled={isApproving}
                className={`px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors ${
                  isApproving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isApproving ? 'Approving...' : 'Approve All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}