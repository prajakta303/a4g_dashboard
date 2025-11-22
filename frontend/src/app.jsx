import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Briefcase, GraduationCap, Search, Menu, X, LogOut, Settings, Home, TrendingUp, Calendar } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [registrations, setRegistrations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState({ total: 0, students: 0, professionals: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSearch();
  }, [filter, searchQuery, registrations, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [countsRes, regsRes] = await Promise.all([
        fetch(`${API_URL}/counts`),
        fetch(`${API_URL}/registrations?sort=${sortOrder}`)
      ]);
      
      const counts = await countsRes.json();
      const regs = await regsRes.json();
      
      setStats({
        total: counts.total || 0,
        students: counts.students || 0,
        professionals: counts.professionals || 0
      });
      setRegistrations(regs.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = [...registrations];
    
    if (filter !== 'all') {
      filtered = filtered.filter(reg => reg.registration_type === filter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(reg =>
        reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.company && reg.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredData(filtered);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 border border-gray-800 hover:border-red-900 transition-all duration-300 group relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
          <h3 className="text-5xl font-black text-white mb-1 group-hover:scale-105 transition-transform duration-300">
            {loading ? '...' : value.toLocaleString()}
          </h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-green-500 text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center opacity-90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
          <Icon size={40} className="text-white" />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-black border-r border-gray-900 z-50 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-900">
            <h1 className={`text-red-600 font-black text-3xl tracking-tighter transition-opacity ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'
            }`}>
              ADMIN
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { icon: Home, label: 'Dashboard', view: 'dashboard' },
              { icon: Users, label: 'All Users', view: 'users' },
              { icon: Settings, label: 'Settings', view: 'settings' },
            ].map((item) => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.view
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <item.icon size={22} />
                <span className={`font-medium transition-opacity ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-900">
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-500 transition-all">
              <LogOut size={22} />
              <span className={`font-medium transition-opacity ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'
              }`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );

  const DashboardView = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-900/30 via-red-950/20 to-black rounded-lg border border-red-900/50 p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-black text-white mb-2">Welcome Back, Admin</h2>
            <p className="text-gray-400 text-lg">Here's what's happening with your conference today.</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={20} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Registrations"
          value={stats.total}
          icon={BarChart3}
          color="from-red-600 to-red-800"
          trend="+12% from last week"
        />
        <StatCard
          title="Students"
          value={stats.students}
          icon={GraduationCap}
          color="from-blue-600 to-blue-800"
          trend="+8% from last week"
        />
        <StatCard
          title="Professionals"
          value={stats.professionals}
          icon={Briefcase}
          color="from-purple-600 to-purple-800"
          trend="+15% from last week"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white">Recent Registrations</h2>
          <button
            onClick={() => setActiveView('users')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all hover:scale-105"
          >
            View All Users
          </button>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading recent registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No registrations yet</div>
          ) : (
            registrations.slice(0, 6).map((reg, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-gray-800 hover:border-red-900 hover:bg-red-900/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-xl">
                    {reg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold group-hover:text-red-400 transition-colors">{reg.name}</p>
                    <p className="text-gray-400 text-sm">{reg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    reg.registration_type === 'student'
                      ? 'bg-blue-900/50 text-blue-400 border border-blue-700'
                      : 'bg-purple-900/50 text-purple-400 border border-purple-700'
                  }`}>
                    {reg.registration_type}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(reg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Registration Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Students</span>
                <span className="text-white font-bold">{stats.total > 0 ? Math.round((stats.students / stats.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.total > 0 ? (stats.students / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Professionals</span>
                <span className="text-white font-bold">{stats.total > 0 ? Math.round((stats.professionals / stats.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.total > 0 ? (stats.professionals / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-black/50 border border-gray-800 rounded-lg hover:border-red-900 hover:bg-red-900/10 transition-all text-white font-medium">
              Export All Data
            </button>
            <button className="w-full text-left px-4 py-3 bg-black/50 border border-gray-800 rounded-lg hover:border-red-900 hover:bg-red-900/10 transition-all text-white font-medium">
              Send Email Notification
            </button>
            <button className="w-full text-left px-4 py-3 bg-black/50 border border-gray-800 rounded-lg hover:border-red-900 hover:bg-red-900/10 transition-all text-white font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'student', 'professional'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === type
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/70 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-4 text-red-500 font-black uppercase text-sm tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-red-500 font-black uppercase text-sm tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-red-500 font-black uppercase text-sm tracking-wider">Type</th>
                <th className="text-left px-6 py-4 text-red-500 font-black uppercase text-sm tracking-wider">Company</th>
                <th className="text-left px-6 py-4 text-red-500 font-black uppercase text-sm tracking-wider">Phone</th>
                <th className="text-left px-6 py-4 text-red-500 font-black uppercase text-sm tracking-wider cursor-pointer hover:text-red-400 transition-colors"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                  Date {sortOrder === 'asc' ? '↑' : '↓'}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 mt-4">Loading users...</p>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((reg, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-800 hover:bg-red-900/10 transition-all duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold">
                          {reg.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold group-hover:text-red-400 transition-colors">{reg.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{reg.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        reg.registration_type === 'student'
                          ? 'bg-blue-900/50 text-blue-400 border border-blue-700'
                          : 'bg-purple-900/50 text-purple-400 border border-purple-700'
                      }`}>
                        {reg.registration_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{reg.company || '-'}</td>
                    <td className="px-6 py-4 text-gray-400">{reg.phone || '-'}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-gray-400">
        <span>Showing {filteredData.length} of {registrations.length} users</span>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-white transition-all"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
          <Settings size={48} className="text-gray-600" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Settings Panel</h2>
        <p className="text-gray-400 text-lg">Configure your dashboard preferences and system settings</p>
        <div className="mt-8 inline-block px-6 py-3 bg-gray-800 rounded-lg text-gray-500">
          Coming Soon...
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-gray-900 sticky top-0 z-30">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-900 rounded-lg"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-3xl font-black text-white">
                {activeView === 'dashboard' && 'Dashboard'}
                {activeView === 'users' && 'All Users'}
                {activeView === 'settings' && 'Settings'}
              </h1>
            </div>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all hover:scale-105 shadow-lg shadow-red-600/30"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;