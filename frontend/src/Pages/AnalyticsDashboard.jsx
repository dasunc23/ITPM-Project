import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
   BarChart, Bar,
   PieChart, Pie, Cell,
} from 'recharts';
import Sidebar from '../Components/Sidebar';

const COLORS = ['#a855f7', '#c084fc', '#e9d5ff', '#f3e8ff'];

function AnalyticsDashboard() {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const userRes = await axios.get("/api/users");
            setUsers(userRes.data);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   const totalUsers = users.length || 0;
   const admins = users.filter(u => u.role === 'admin').length || 0;
   const students = users.filter(u => u.role === 'user').length || 0;

   // Pie chart data (Users by Campus)
   const campusCounts = users.reduce((acc, user) => {
      const campus = user.campus || 'Other';
      acc[campus] = (acc[campus] || 0) + 1;
      return acc;
   }, {});
   const campusData = Object.keys(campusCounts)
      .map(key => ({ name: key, value: campusCounts[key] }))
      .sort((a, b) => b.value - a.value).slice(0, 4);

   if (campusData.length === 0) campusData.push({ name: 'Empty', value: 1 });

   // Dummy line chart data since we don't have historical dates
   const growthData = [
      { name: '12 Aug', users: totalUsers * 0.4, admins: admins * 0.4 },
      { name: '13 Aug', users: totalUsers * 0.5, admins: admins * 0.5 },
      { name: '14 Aug', users: totalUsers * 0.55, admins: admins * 0.6 },
      { name: '15 Aug', users: totalUsers * 0.7, admins: admins * 0.8 },
      { name: '16 Aug', users: totalUsers * 0.9, admins: admins * 0.9 },
      { name: '17 Aug', users: totalUsers, admins: admins },
   ];

   // Year Data for horizontal bars
   const yearCounts = users.reduce((acc, user) => {
      const y = user.year || 'Unknown';
      acc[y] = (acc[y] || 0) + 1;
      return acc;
   }, {});
   const topYears = Object.keys(yearCounts)
      .map(key => ({
         name: `Year ${key}`,
         value: yearCounts[key],
         percent: totalUsers ? (yearCounts[key] / totalUsers) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value).slice(0, 4);

   if (loading) return <div className="flex h-screen items-center justify-center">Loading actual data...</div>;

   return (
      <div className="flex min-h-screen bg-[#f8f9fa] font-sans text-gray-800">
         <Sidebar />
         <main className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
               <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
               <div className="flex items-center gap-6">
                  <div className="relative">
                     <input type="text" placeholder="Search stock, order, etc" className="bg-white rounded-full py-2.5 px-6 pl-10 focus:outline-none w-72 text-sm text-gray-600 border border-gray-200 shadow-sm" />
                     <svg className="w-4 h-4 absolute left-4 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
               </div>
            </header>

            {/* Dashboard Grid Container */}
            <div className="flex gap-6">

               {/* Left Column (70%) */}
               <div className="flex-[7] flex flex-col gap-6">

                  {/* Top 3 Cards */}
                  <div className="grid grid-cols-3 gap-6">
                     {/* Card 1 (Purple) */}
                     <div className="bg-[#a855f7] text-white rounded-2xl p-6 shadow-sm relative">
                        <div className="flex justify-between items-start mb-6">
                           <p className="text-purple-100 font-medium">Total Users</p>
                           <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center text-white">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                           </div>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">{totalUsers.toLocaleString()}</h2>
                        <p className="text-xs font-medium text-green-300 mt-4">+3.34% <span className="text-purple-200 font-normal">vs last week</span></p>
                     </div>

                     {/* Card 2 (White) */}
                     <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                           <p className="text-gray-500 font-medium">Total Admins</p>
                           <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                           </div>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-gray-800">{admins.toLocaleString()}</h2>
                        <p className="text-xs font-medium text-red-500 mt-4">-2.80% <span className="text-gray-400 font-normal">vs last week</span></p>
                     </div>

                     {/* Card 3 (White) */}
                     <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                           <p className="text-gray-500 font-medium">Total Students</p>
                           <div className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                           </div>
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-gray-800">{students.toLocaleString()}</h2>
                        <p className="text-xs font-medium text-green-500 mt-4">+8.02% <span className="text-gray-400 font-normal">vs last week</span></p>
                     </div>
                  </div>

                  {/* Middle Row */}
                  <div className="flex gap-6">
                     {/* Registration Analytics */}
                     <div className="flex-[2] bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                           <div>
                              <h3 className="text-lg font-bold text-gray-800">Registration Analytics</h3>
                              <div className="flex items-center gap-4 mt-2">
                                 <div className="flex items-center gap-2"><span className="w-3 h-1.5 bg-[#a855f7] rounded"></span><span className="text-xs font-medium text-gray-500">Students</span></div>
                                 <div className="flex items-center gap-2"><span className="w-3 h-1.5 border border-[#a855f7] border-dashed rounded"></span><span className="text-xs font-medium text-gray-500">Admins</span></div>
                              </div>
                           </div>
                           <button className="bg-[#a855f7] text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-[#9333ea] transition">
                              Last 8 Days
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                           </button>
                        </div>
                        <div className="h-[220px]">
                           <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={growthData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={10} />
                                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                 <Line type="smooth" dataKey="users" stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#fff', stroke: '#a855f7', strokeWidth: 2 }} />
                                 <Line type="smooth" dataKey="admins" stroke="#a855f7" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                              </LineChart>
                           </ResponsiveContainer>
                        </div>
                     </div>

                     {/* Monthly Target */}
                     <div className="flex-[1] bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between relative text-center">
                        <div className="flex justify-between items-center w-full">
                           <h3 className="text-lg font-bold text-gray-800">Monthly Target</h3>
                           <span className="text-gray-400 cursor-pointer">•••</span>
                        </div>

                        {/* Gauge representation */}
                        <div className="relative mx-auto mt-4 w-40 h-20 overflow-hidden">
                           <div className="w-40 h-40 border-[14px] border-[#a855f7] border-b-[#f3e8ff] border-r-[#f3e8ff] rounded-full rotate-45 transform origin-center"></div>
                           <div className="absolute bottom-1 left-0 flex flex-col items-center w-full text-center">
                              <h2 className="text-3xl font-bold text-gray-800">85%</h2>
                              <p className="text-[10px] text-green-500 font-bold">+8.02% <span className="text-gray-400 font-normal">from month</span></p>
                           </div>
                        </div>

                        <div className="mt-4">
                           <p className="text-sm font-bold text-gray-800">Great Progress!</p>
                           <p className="text-xs text-gray-500 mt-1">Our achievement increased by <span className="text-[#a855f7] font-bold">120 users</span>. Let's reach 100% next month!</p>
                        </div>

                        <div className="flex justify-between mt-5 bg-[#faf5ff] p-3 rounded-xl border border-purple-50">
                           <div className="text-center w-1/2 border-r border-purple-100">
                              <p className="text-xs text-gray-500 mb-0.5">Target</p>
                              <p className="text-sm font-bold text-gray-800">1,000</p>
                           </div>
                           <div className="text-center w-1/2">
                              <p className="text-xs text-gray-500 mb-0.5">Users</p>
                              <p className="text-sm font-bold text-gray-800">{totalUsers}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-2 gap-6">
                     {/* Active User */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                           <h3 className="text-lg font-bold text-gray-800">Active User</h3>
                           <span className="text-gray-400 cursor-pointer">•••</span>
                        </div>
                        <div className="mb-6 flex justify-between items-end">
                           <div>
                              <h2 className="text-3xl font-bold text-gray-800">{students}</h2>
                              <p className="text-xs text-gray-500 mt-1 font-medium">Students</p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-bold text-green-500">+8.02%</p>
                              <p className="text-xs text-gray-400 font-medium cursor-pointer">from last month</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           {topYears.length > 0 ? topYears.map((year, i) => (
                              <div key={i}>
                                 <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                                    <span>{year.name}</span>
                                    <span>{year.percent.toFixed(0)}%</span>
                                 </div>
                                 <div className="w-full bg-[#f3e8ff] rounded-full h-2">
                                    <div className="bg-[#a855f7] h-full rounded-full" style={{ width: `${year.percent}%` }}></div>
                                 </div>
                              </div>
                           )) : (
                              <p className="text-sm text-gray-400">No year data found.</p>
                           )}
                        </div>
                     </div>

                     {/* Conversion Rate */}
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-lg font-bold text-gray-800">Account Type Ratio</h3>
                           <button className="bg-[#a855f7] text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                              This Week <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                           </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <div>
                              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase">Students</p>
                              <p className="text-xl font-bold text-gray-800">{students}</p>
                              <p className="text-xs font-bold text-green-500 mt-0.5">+5%</p>
                           </div>
                           <div>
                              <p className="text-xs font-semibold text-gray-400 mb-1 uppercase">Admins</p>
                              <p className="text-xl font-bold text-gray-800">{admins}</p>
                              <p className="text-xs font-bold text-green-500 mt-0.5">+6%</p>
                           </div>
                        </div>

                        {/* Faux Bar Chart visual */}
                        <div className="flex items-end h-[120px] gap-2 pt-4 border-t border-gray-50">
                           <div className="flex-1 bg-[#e9d5ff] hover:bg-[#d8b4fe] transition rounded-t-lg h-[40%]"></div>
                           <div className="flex-1 bg-[#d8b4fe] hover:bg-[#c084fc] transition rounded-t-lg h-[60%]"></div>
                           <div className="flex-1 bg-[#c084fc] hover:bg-[#a855f7] transition rounded-t-lg h-[85%]"></div>
                           <div className="flex-1 bg-[#a855f7] hover:bg-[#9333ea] transition rounded-t-lg h-[100%] shadow-[0_-5px_15px_-5px_#a855f7]"></div>
                           <div className="flex-1 bg-[#a855f7] hover:bg-[#9333ea] transition rounded-t-lg h-[70%] text-opacity-80"></div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column (30%) */}
               <div className="flex-[3] flex flex-col gap-6">

                  {/* Top Categories */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-800">Top Campuses</h3>
                        <button className="text-xs text-gray-400 font-semibold hover:text-[#a855f7] transition">See All</button>
                     </div>

                     <div className="relative h-56 mb-8 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={campusData}
                                 innerRadius={75}
                                 outerRadius={95}
                                 paddingAngle={6}
                                 dataKey="value"
                                 stroke="none"
                                 cornerRadius={4}
                              >
                                 {campusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                 ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                           <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Users</span>
                           <span className="text-3xl font-bold text-gray-800">{totalUsers}</span>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {campusData.map((campus, i) => (
                           <div key={i} className="flex justify-between items-center group">
                              <div className="flex items-center gap-3">
                                 <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                                 <span className="text-sm font-medium text-gray-500 group-hover:text-gray-800 transition">{campus.name}</span>
                              </div>
                              <span className="text-sm font-bold text-gray-800">{campus.value.toLocaleString()} Users</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Traffic Sources */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Traffic Sources</h3>
                        <span className="text-gray-400 cursor-pointer">•••</span>
                     </div>

                     {/* Faux horizontal bar blocks */}
                     <div className="flex h-8 gap-1 mb-6">
                        <div className="bg-[#f3e8ff] rounded-l-md w-[40%]"></div>
                        <div className="bg-[#e9d5ff] w-[30%]"></div>
                        <div className="bg-[#d8b4fe] w-[15%]"></div>
                        <div className="bg-[#c084fc] w-[10%]"></div>
                        <div className="bg-[#a855f7] rounded-r-md w-[5%]"></div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                           <div className="flex items-center gap-2 text-gray-500 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f3e8ff]"></div> Direct Traffic
                           </div>
                           <span className="font-bold text-gray-800">40%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <div className="flex items-center gap-2 text-gray-500 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#e9d5ff]"></div> Organic Search
                           </div>
                           <span className="font-bold text-gray-800">30%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <div className="flex items-center gap-2 text-gray-500 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#d8b4fe]"></div> Social Media
                           </div>
                           <span className="font-bold text-gray-800">15%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <div className="flex items-center gap-2 text-gray-500 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#c084fc]"></div> Referral Traffic
                           </div>
                           <span className="font-bold text-gray-800">10%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                           <div className="flex items-center gap-2 text-gray-500 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></div> Email Campaigns
                           </div>
                           <span className="font-bold text-gray-800">5%</span>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </main>
      </div>
   );
}

export default AnalyticsDashboard;
