import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import Sidebar from '../Components/Sidebar';

const userRoleData = [
  { role: 'Students', count: 240, fill: '#3B82F6' },
  { role: 'Admins', count: 12, fill: '#10B981' }
];

const userDistributionData = [
  { name: 'Engineering', value: 120, fill: '#3B82F6' },
  { name: 'Business', value: 70, fill: '#10B981' },
  { name: 'Arts', value: 35, fill: '#F59E0B' },
  { name: 'Science', value: 27, fill: '#EF4444' }
];

const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 145 },
  { month: 'Mar', users: 168 },
  { month: 'Apr', users: 190 },
  { month: 'May', users: 215 },
  { month: 'Jun', users: 252 }
];

const summaryCards = [
  {
    title: 'Total Users',
    value: '252',
    change: '+8% this month',
    icon: '👥',
    description: 'Active and registered users',
    accent: 'from-blue-100 to-blue-200',
    valueColor: 'text-blue-700'
  },
  {
    title: 'Admins',
    value: '12',
    change: '+1 since last week',
    icon: '🛡️',
    description: 'Admin accounts with access',
    accent: 'from-green-100 to-green-200',
    valueColor: 'text-green-700'
  },
  {
    title: 'Students',
    value: '240',
    change: '+6% growth',
    icon: '🎓',
    description: 'Students currently enrolled',
    accent: 'from-purple-100 to-purple-200',
    valueColor: 'text-purple-700'
  }
];

function AnalyticsDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <section className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Admin Analytics</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900">Dashboard Insights</h1>
            
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Export Report
              </button>
              <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                Refresh Data
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mb-8">
          {summaryCards.map((card) => (
            <div key={card.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br p-6 shadow-sm shadow-slate-200/50">
              <div className={`rounded-3xl bg-white/90 p-5 backdrop-blur-sm shadow-sm border border-slate-200`}> 
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{card.title}</p>
                    <p className={`mt-3 text-3xl font-semibold ${card.valueColor}`}>{card.value}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                    {card.icon}
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500">{card.description}</p>
                <p className="mt-4 text-sm font-medium text-slate-700">{card.change}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Users by Role</h2>
                <p className="text-sm text-slate-500">Admin and student user segmentation.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">Real-time</span>
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userRoleData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="role" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">User Distribution</h2>
                <p className="text-sm text-slate-500">Distribution across faculties and departments.</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Stable</span>
            </div>
            <div className="mt-6 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">User Growth Over Time</h2>
                <p className="text-sm text-slate-500">Monthly growth trend for platform users.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-900" />
                Users
              </div>
            </div>
            <div className="mt-6 h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AnalyticsDashboard;
