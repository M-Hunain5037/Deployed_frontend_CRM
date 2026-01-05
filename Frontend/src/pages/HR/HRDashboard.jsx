import React, { useState, useEffect } from 'react';
import HrSidebar from '../../components/HrSidebar';
import { DashboardHeader, RoleBasedNav } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';

const HRDashboard = () => {
  const { role } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [stats, setStats] = useState([
    { label: 'Total Team Members', value: '0', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { label: 'Present Today', value: '0', icon: Calendar, color: 'from-green-500 to-emerald-600' },
    { label: 'Pending Applications', value: '0', icon: FileText, color: 'from-orange-500 to-red-600' },
    { label: 'Avg Attendance', value: '0%', icon: TrendingUp, color: 'from-purple-500 to-pink-600' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔐 Token:', token ? 'Present' : 'Missing');
      
      // Fetch total employees
      console.log('📥 Fetching employees...');
      const employeesResponse = await fetch('http://localhost:5000/api/v1/onboarding/employees', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const employeesData = await employeesResponse.json();
      console.log('📊 Employees response:', employeesData);
      const totalEmployees = employeesData.data ? employeesData.data.length : 0;
      console.log('👥 Total employees:', totalEmployees);

      // Fetch today's attendance records
      console.log('📥 Fetching attendance...');
      const attendanceResponse = await fetch('http://localhost:5000/api/v1/attendance/all', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const attendanceDataRaw = await attendanceResponse.json();
      console.log('📊 Attendance response:', attendanceDataRaw);
      
      // Filter for today
      const today = new Date().toISOString().split('T')[0];
      console.log('📅 Today date:', today);
      const todayAttendance = attendanceDataRaw.data 
        ? attendanceDataRaw.data.filter(r => r.attendance_date === today && (r.status === 'Present' || r.status === 'Late'))
        : [];
      console.log('✅ Today attendance count:', todayAttendance.length);
      const presentToday = todayAttendance.length;

      // Calculate average attendance (approximation - count present + late as present)
      const allAttendance = attendanceDataRaw.data || [];
      const presentCount = allAttendance.filter(r => r.status === 'Present' || r.status === 'Late').length;
      const totalRecords = allAttendance.length || 1;
      const avgAttendance = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 94;

      // For pending applications, we'll use a static value as there's no pending status tracking
      // In a real app, this would check for employees marked as 'pending approval'
      const pendingApps = 0;

      setStats([
        { label: 'Total Team Members', value: totalEmployees.toString(), icon: Users, color: 'from-blue-500 to-cyan-600' },
        { label: 'Present Today', value: presentToday.toString(), icon: Calendar, color: 'from-green-500 to-emerald-600' },
        { label: 'Pending Applications', value: pendingApps.toString(), icon: FileText, color: 'from-orange-500 to-red-600' },
        { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: TrendingUp, color: 'from-purple-500 to-pink-600' }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      // Keep default values on error
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <HrSidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="HR Dashboard" 
          subtitle="Manage your team and monitor attendance"
        />
        <RoleBasedNav role={role} />

        <div className="flex-1 overflow-y-auto px-8 py-10">
          <div className="max-w-7xl mx-auto">
            {/* Stats Grid */}
            <div className="mb-12">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-blue-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
                          <p className="text-4xl font-bold text-gray-900 mt-3 group-hover:text-blue-600 transition">
                            {loading ? '...' : stat.value}
                          </p>
                        </div>
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-opacity-30 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Welcome Message */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to HR Portal</h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
                </div>
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  Manage your team efficiently with comprehensive tools for attendance tracking, employee management, and application processing.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 transition">
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="font-bold text-blue-900 mb-2 text-lg">Team Management</h3>
                    <p className="text-sm text-blue-700 leading-relaxed">View and manage team members</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:border-green-300 transition">
                    <div className="text-3xl mb-3">📋</div>
                    <h3 className="font-bold text-green-900 mb-2 text-lg">Attendance</h3>
                    <p className="text-sm text-green-700 leading-relaxed">Monitor attendance records</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 hover:shadow-lg transition-shadow duration-300 h-fit sticky top-24">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
                  <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mt-2"></div>
                </div>
                <div className="space-y-4">
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold tracking-wide uppercase">
                    Mark Attendance
                  </button>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 text-sm font-semibold tracking-wide uppercase">
                    View Team
                  </button>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 text-sm font-semibold tracking-wide uppercase">
                    Process Applications
                  </button>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-300 text-sm font-semibold tracking-wide uppercase">
                    Generate Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
