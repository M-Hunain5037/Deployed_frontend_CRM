// Frontend/src/pages/HR/EmployeeManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HrSidebar from '../../components/HrSidebar';
import { 
  Users, Search, Plus, Edit, Trash2, Eye, Download, Filter,
  Mail, Phone, MapPin, Calendar, Briefcase, X, Loader
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api/v1';

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [employees, setEmployees] = useState([]);

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/employees`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setEmployees(data.data);
      } else {
        setEmployees([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments from employees
  const departments = ['All', ...new Set(employees.map(emp => emp.department || 'N/A'))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${API_URL}/employees/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setEmployees(employees.filter(emp => emp.id !== id));
        } else {
          alert('Failed to delete employee');
        }
      } catch (err) {
        console.error('Error deleting employee:', err);
        alert('Failed to delete employee');
      }
    }
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HrSidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-500 text-base mt-2">Manage and organize your team members</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/hr/onboarding')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                <Plus className="w-5 h-5" />
                Onboard Employee
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Total Employees</p>
                      <p className="text-4xl font-bold text-gray-900 mt-4">{employees.length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Active Staff</p>
                      <p className="text-4xl font-bold text-gray-900 mt-4">
                        {employees.filter(e => e.status === 'Active').length}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Departments</p>
                      <p className="text-4xl font-bold text-gray-900 mt-4">
                        {new Set(employees.map(e => e.department)).size}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-orange-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">New This Month</p>
                      <p className="text-4xl font-bold text-gray-900 mt-4">
                        {employees.filter(e => {
                          const joinDate = new Date(e.join_date || e.joinDate);
                          const now = new Date();
                          return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                        }).length}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search employees by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm">
                    <Download className="w-5 h-5" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Employee ID</th>
                      <th className="text-left py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Employee</th>
                      <th className="text-left py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="text-left py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Department</th>
                      <th className="text-left py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Position</th>
                      <th className="text-left py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Join Date</th>
                      <th className="text-left py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="text-center py-5 px-7 text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="py-12 px-7 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader className="w-5 h-5 animate-spin text-blue-500" />
                            <span className="text-gray-600 font-medium">Loading employees...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-12 px-7 text-center">
                          <span className="text-gray-500">No employees found</span>
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-blue-50 transition-colors duration-150 group">
                          <td className="py-5 px-7">
                            <span className="font-bold text-blue-600 text-sm bg-blue-50 px-4 py-2 rounded-lg group-hover:bg-blue-100">{employee.employee_id}</span>
                          </td>
                          <td className="py-5 px-7">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {employee.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{employee.name}</p>
                                <p className="text-xs text-gray-500">{employee.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-7">
                            <div className="flex items-center gap-2 text-gray-700 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{employee.phone || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="py-5 px-7">
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                              {employee.department || 'N/A'}
                            </span>
                          </td>
                          <td className="py-5 px-7">
                            <p className="text-gray-900 font-medium text-sm">{employee.position || 'N/A'}</p>
                          </td>
                          <td className="py-5 px-7">
                            <p className="text-gray-700 text-sm font-medium">
                              {employee.join_date ? new Date(employee.join_date).toLocaleDateString() : 'N/A'}
                            </p>
                          </td>
                          <td className="py-5 px-7">
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wide">
                              {employee.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-5 px-7">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => handleViewDetails(employee)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all font-medium"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all font-medium"
                                title="Edit"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(employee.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all font-medium"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {filteredEmployees.length === 0 && (
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Employee modal removed; use Onboard Employee page instead */}

      {/* Employee Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-3xl">
              <h2 className="text-2xl font-bold">Employee Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-bold uppercase tracking-wide">ID: {selectedEmployee.employee_id}</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">{selectedEmployee.name}</h3>
                  <p className="text-slate-600 text-lg">{selectedEmployee.position || 'N/A'}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {selectedEmployee.status || 'Active'}
                    </span>
                    {selectedEmployee.request_password_change && (
                      <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        Change Password Required
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Email</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Phone</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Department</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.department || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Join Date</p>
                    <p className="text-slate-800 font-semibold">
                      {selectedEmployee.join_date ? new Date(selectedEmployee.join_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl col-span-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Address</p>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.address || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl col-span-2">
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Base Salary</p>
                    <p className="text-slate-800 font-semibold">
                      {selectedEmployee.base_salary ? `PKR ${Number(selectedEmployee.base_salary).toLocaleString()}` : '—'}
                    </p>
                  </div>
                  <div className="ml-6">
                    <p className="text-xs text-slate-600 font-medium">Total Compensation</p>
                    <p className="text-slate-800 font-semibold">{`$${Number(selectedEmployee.totalCompensation || selectedEmployee.baseSalary || 0).toLocaleString()}`}</p>
                  </div>
                </div>
                {(selectedEmployee.laptop || selectedEmployee.charger || selectedEmployee.mouse || selectedEmployee.keyboard || selectedEmployee.monitor || selectedEmployee.other) && (
                  <div className="col-span-2 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Resources Issued</p>
                    <div className="mt-3 grid gap-2">
                      {selectedEmployee.laptop && (
                        <div className="flex items-center justify-between text-sm">Laptop {selectedEmployee.laptopSerial && `• ${selectedEmployee.laptopSerial}`}</div>
                      )}
                      {selectedEmployee.charger && (
                        <div className="flex items-center justify-between text-sm">Charger {selectedEmployee.chargerSerial && `• ${selectedEmployee.chargerSerial}`}</div>
                      )}
                      {selectedEmployee.mouse && (
                        <div className="flex items-center justify-between text-sm">Mouse {selectedEmployee.mouseSerial && `• ${selectedEmployee.mouseSerial}`}</div>
                      )}
                      {selectedEmployee.keyboard && (
                        <div className="flex items-center justify-between text-sm">Keyboard {selectedEmployee.keyboardSerial && `• ${selectedEmployee.keyboardSerial}`}</div>
                      )}
                      {selectedEmployee.monitor && (
                        <div className="flex items-center justify-between text-sm">Monitor {selectedEmployee.monitorSerial && `• ${selectedEmployee.monitorSerial}`}</div>
                      )}
                      {selectedEmployee.other && (
                        <div className="flex items-center justify-between text-sm">{selectedEmployee.otherName} {selectedEmployee.otherSerial && `• ${selectedEmployee.otherSerial}`}</div>
                      )}
                      {selectedEmployee.resourcesNote && (
                        <div className="text-sm text-gray-700 mt-2">Note: {selectedEmployee.resourcesNote}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
