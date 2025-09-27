import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building, TrendingUp, AlertTriangle,
  CheckCircle, Clock, BarChart3, PieChart,
  Activity, Shield, Calendar, MapPin,
  Eye, Plus, Settings, Bell
} from 'lucide-react';
import { useState } from 'react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.userType !== 'employer') {
    navigate('/login');
    return null;
  }

  // Mock data for employer dashboard
  const stats = {
    totalWorkers: 245,
    activeWorkers: 220,
    complianceRate: 78,
    pendingCheckups: 15,
    criticalCases: 3,
    sites: 8
  };

  const recentActivities = [
    {
      id: 1,
      type: 'checkup_completed',
      message: 'Ramesh Kumar completed health checkup',
      time: '2 hours ago',
      severity: 'normal'
    },
    {
      id: 2,
      type: 'compliance_alert',
      message: '5 workers have low compliance scores',
      time: '4 hours ago',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'new_worker',
      message: 'New worker Vijay Kumar registered',
      time: '1 day ago',
      severity: 'info'
    },
    {
      id: 4,
      type: 'critical_alert',
      message: 'Critical health condition reported for Amit Singh',
      time: '2 days ago',
      severity: 'critical'
    }
  ];

  const sites = [
    { name: 'Site A - Thiruvananthapuram', workers: 45, compliance: 85, status: 'active' },
    { name: 'Factory B - Kochi', workers: 38, compliance: 92, status: 'active' },
    { name: 'Farm C - Wayanad', workers: 28, compliance: 65, status: 'warning' },
    { name: 'Site D - Kozhikode', workers: 52, compliance: 78, status: 'active' },
    { name: 'Factory A - Ernakulam', workers: 41, compliance: 88, status: 'active' },
    { name: 'Construction Site E', workers: 41, compliance: 72, status: 'warning' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkup_completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'compliance_alert': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'new_worker': return <Plus className="w-5 h-5 text-blue-600" />;
      case 'critical_alert': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSiteStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Employer Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name || 'Employer'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                <Plus className="w-5 h-5 inline mr-2" />
                Add Worker
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5 inline mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWorkers}</p>
                <p className="text-sm text-green-600 mt-1">+12 this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Workers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeWorkers}</p>
                <p className="text-sm text-green-600 mt-1">{`${Math.round((stats.activeWorkers/stats.totalWorkers)*100)}% active`}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
                <p className="text-sm text-yellow-600 mt-1">+5% from last month</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Checkups</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingCheckups}</p>
                <p className="text-sm text-red-600 mt-1">Requires attention</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/workers')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Manage Workers</p>
                    <p className="text-sm text-gray-600">View and manage all workers</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/reports')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Reports</p>
                    <p className="text-sm text-gray-600">Health compliance reports</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/severity-assessment')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Severity Assessment</p>
                    <p className="text-sm text-gray-600">Assess health severity levels</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/notifications')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Bell className="w-8 h-8 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-600">View alerts and updates</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Sites Overview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sites Overview</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All Sites
                </button>
              </div>
              <div className="space-y-4">
                {sites.slice(0, 4).map((site, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{site.name}</p>
                        <p className="text-sm text-gray-600">{site.workers} workers</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Compliance</p>
                        <p className="font-medium text-gray-900">{site.compliance}%</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSiteStatusColor(site.status)}`}>
                        {site.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Critical Alerts */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Critical Alerts</h3>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {stats.criticalCases}
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Critical Health Condition</p>
                      <p className="text-xs text-red-700 mt-1">Amit Singh requires immediate medical attention</p>
                      <p className="text-xs text-red-600 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Overdue Checkups</p>
                      <p className="text-xs text-yellow-700 mt-1">{stats.pendingCheckups} workers need checkups</p>
                      <p className="text-xs text-yellow-600 mt-1">Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={`p-3 border rounded-lg ${getActivityColor(activity.severity)}`}>
                    <div className="flex items-start space-x-3">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Compliance Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Good (≥80%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average (60-79%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Poor (<60%)</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;