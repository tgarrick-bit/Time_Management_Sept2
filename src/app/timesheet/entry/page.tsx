'use client'

import { useState } from 'react'

interface TimeEntry {
  id: string
  day: string
  project: string
  hours: number
  description: string
}

export default function TimesheetEntryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [formData, setFormData] = useState({
    day: '',
    project: '',
    hours: 8,
    description: ''
  })

  const projects = [
    'Metro Hospital - Nursing Staff',
    'Downtown Office - Security',
    'City Schools - Substitute Teachers',
    'Riverside Manufacturing'
  ]

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dates = ['Aug 11', 'Aug 12', 'Aug 13', 'Aug 14', 'Aug 15', 'Aug 16', 'Aug 17']

  const handleAddTimeEntry = () => {
    if (!formData.day || !formData.project || formData.hours <= 0) {
      alert('Please fill in all required fields')
      return
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      day: formData.day,
      project: formData.project,
      hours: formData.hours,
      description: formData.description
    }

    setTimeEntries([...timeEntries, newEntry])
    setFormData({ day: '', project: '', hours: 8, description: '' })
    setIsModalOpen(false)
  }

  const getEntriesForDay = (day: string) => {
    return timeEntries.filter(entry => entry.day === day)
  }

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + entry.hours, 0).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Timesheet</h1>
              <p className="text-gray-600">View and manage your time entries</p>
            </div>
          </div>
        </div>

        {/* Beautiful Weekly Timesheet */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#e31c79] px-8 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="text-white hover:text-gray-100 transition-colors p-3 rounded-full hover:bg-[#c4186a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Weekly Timesheet</h1>
                <p className="text-base text-white font-medium">
                  Week of Aug 11 - Aug 17, 2025
                </p>
              </div>
              
              <button className="text-white hover:text-gray-100 transition-colors p-3 rounded-full hover:bg-[#c4186a]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="text-white font-bold text-xl">
              Total Hours: {getTotalHours()}
            </div>
          </div>

          {/* Week Grid */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-7 gap-6 mb-10">
              {days.map((day, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 min-h-[220px] hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-4">
                    <div className="font-bold text-gray-800 text-xl mb-1">{day}</div>
                    <div className="text-[#e31c79] font-semibold text-base">
                      {dates[index]}
                    </div>
                  </div>
                  
                  {/* Time entries for this day */}
                  <div className="space-y-3">
                    {getEntriesForDay(day).map((entry) => (
                      <div key={entry.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-semibold text-gray-800 text-sm truncate mb-1">{entry.project}</div>
                        <div className="text-[#e31c79] font-bold text-sm">{entry.hours}h</div>
                        {entry.description && (
                          <div className="text-gray-600 text-xs mt-2 line-clamp-2">{entry.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Time Entry Button */}
            <div className="text-center">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-[#e31c79] text-white rounded-xl hover:bg-[#c4186a] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
              >
                Add Time Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-10 py-8 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">Add Time Entry</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-3 rounded-full hover:bg-gray-50"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Week of Aug 11 - Aug 17, 2025
              </p>
            </div>
            
            <div className="px-10 py-8 space-y-8">
              {/* Day Selection */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-4">Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e31c79] focus:border-[#e31c79] transition-all duration-200 bg-white hover:border-gray-300 text-base"
                >
                  <option value="">Select a day</option>
                  {days.map((day, index) => (
                    <option key={index} value={day}>
                      {day} {dates[index]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-4">Project</label>
                <select
                  value={formData.project}
                  onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                  className="w-full p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e31c79] focus:border-[#e31c79] transition-all duration-200 bg-white hover:border-gray-300 text-base"
                >
                  <option value="">Select a project</option>
                  {projects.map((project, index) => (
                    <option key={index} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              {/* Hours Input */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-4">Hours</label>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="16"
                  value={formData.hours || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, hours: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e31c79] focus:border-[#e31c79] transition-all duration-200 bg-white hover:border-gray-300 text-base"
                  placeholder="Enter hours worked (e.g., 8.5)"
                />
                <p className="text-sm text-gray-500 mt-3">Increments of 0.25, max 16 hours</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-4">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e31c79] focus:border-[#e31c79] transition-all duration-200 bg-white hover:border-gray-300 resize-none text-base"
                  placeholder="Enter description..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="px-10 py-8 border-t border-gray-100 flex space-x-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-8 py-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTimeEntry}
                className="flex-1 px-8 py-4 bg-[#e31c79] text-white rounded-xl hover:bg-[#c4186a] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
