// Fully fixed and corrected React Admin Dashboard
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Briefcase, GraduationCap, Search, Menu, X, LogOut, Settings, Home, Calendar } from 'lucide-react';

const API_URL = 'https://a4g-conference-registration-cvjx.onrender.com/api';

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
      const res = await fetch(`${API_URL}/registrations`);
      const json = await res.json();
      const list = json.data || [];

      setStats({
        total: list.length,
        students: list.filter(r => r.registration_type === 'student').length,
        professionals: list.filter(r => r.registration_type === 'professional').length
      });

      const sortedList = [...list].sort((a, b) => {
        return sortOrder === 'asc'
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at);
      });

      setRegistrations(sortedList);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearch = () => {
    let filtered = [...registrations];

    if (filter !== 'all') filtered = filtered.filter(reg => reg.registration_type === filter);

    if (searchQuery) {
      filtered = filtered.filter(reg =>
        reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (reg.company && reg.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredData(filtered);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 border border-gray-800">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>
      <div className="flex items-center justify-between mb-4 relative">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
          <h3 className="text-5xl font-black text-white mb-1">{loading ? '...' : value.toLocaleString()}</h3>
        </div>
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon size={40} className="text-white" />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/80 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-black border-r border-gray-900 z-50 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-900">
            <h1 className={`text-red-600 font-black text-3xl tracking-tighter ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>ADMIN</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {[
              { icon: Home, label: 'Dashboard', view: 'dashboard' },
              { icon: Users, label: 'All Users', view: 'users' },
              { icon: Settings, label: 'Settings', view: 'settings' }
            ].map(item => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.view
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:bg-gray-900'
                }`}
              >
                <item.icon size={22} />
                <span className={`${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-900">
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-500 transition-all">
              <LogOut size={22} />
              <span className={`${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );

  const DashboardView = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-900/30 via-red-950/20 to-black rounded-lg border border-red-900/50 p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-black text-white mb-2">Welcome Back, Admin</h2>
            <p className="text-gray-400 text-lg">Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={20} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Registrations" value={stats.total} icon={BarChart3} color="from-red-600 to-red-800" />
        <StatCard title="Students" value={stats.students} icon={GraduationCap} color="from-blue-600 to-blue-800" />
        <StatCard title="Professionals" value={stats.professionals} icon={Briefcase} color="from-purple-600 to-purple-800" />
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'student', 'professional'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === type ? 'bg-red-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/70 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-red-500 font-black uppercase text-sm text-left">Name</th>
                <th className="px-6 py-4 text-red-500 font-black uppercase text-sm text-left">Email</th>
                <th className="px-6 py-4 text-red-500 font-black uppercase text-sm text-left">Type</th>
                <th className="px-6 py-4 text-red-500 font-black uppercase text-sm text-left">Company</th>
                <th className="px-6 py-4 text-red-500 font-black uppercase text-sm text-left">Phone</th>
                <th
                  className="px-6 py-4 text-red-500 font-black uppercase text-sm text-left cursor-pointer"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  Date {sortOrder === 'asc' ? '↑' : '↓'}
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">Loading users...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">No users found</td>
                </tr>
              ) : (
                filteredData.map((reg, idx) => (
                  <tr key={idx} className="border-t border-gray-800 hover:bg-red-900/10 transition-all">
                    <td className="px-6 py-4 text-white font-semibold">{reg.name}</td>
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
                    <td className="px-6 py-4 text-gray-400">{new Date(reg.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className="p-12 bg-gray-900 rounded-lg border border-gray-800 text-center text-gray-400">
      <Settings size={48} className="mx-auto mb-4 text-gray-500" />
      <h2 className="text-3xl text-white font-black mb-3">Settings Panel</h2>
      <p className="text-gray-400 mb-6">Configure your dashboard preferences.</p>
      <div className="px-6 py-3 bg-gray-800 rounded-lg inline-block">Coming Soon...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className="bg-black/50 backdrop-blur-sm border-b border-gray-900 sticky top-0 z-30">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-3xl font-black text-white capitalize">{activeView}</h1>
            </div>
            <button onClick={fetchData} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold">Refresh</button>
          </div>
        </header>

        <main className="p-6 lg:p-8">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};

export default App;
