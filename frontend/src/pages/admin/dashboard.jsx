'use client'

import { Plane, Users, RefreshCw, TrendingUp, Calendar, Eye, Lock, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, Tooltip, AreaChart, Area } from 'recharts'
import { useStatistics } from '@/hooks/useStatistics'

const chartData = [
  { month: "January", pageViews: 3200, orders: 2400, desktop: 73 },
  { month: "February", pageViews: 2800, orders: 1800, desktop: 85 },
  { month: "March", pageViews: 4200, orders: 3200, desktop: 214 },
  { month: "April", pageViews: 3600, orders: 2600, desktop: 73 },
  { month: "May", pageViews: 4500, orders: 3400, desktop: 209 },
  { month: "June", pageViews: 3900, orders: 2900, desktop: 214 },
  { month: "July", pageViews: 4100, orders: 3100, desktop: 110 },
  { month: "August", pageViews: 3700, orders: 2700, desktop: 100 },
  { month: "September", pageViews: 4300, orders: 3300, desktop: 136 },
  { month: "October", pageViews: 3500, orders: 2500, desktop: 118 },
  { month: "November", pageViews: 4600, orders: 3600, desktop: 190 },
  { month: "December", pageViews: 4000, orders: 3000, desktop: 120 },
]

const weeklyData = [
  { day: "Monday", pageViews: 3200, orders: 2400 },
  { day: "Tuesday", pageViews: 2800, orders: 1800 },
  { day: "Wednesday", pageViews: 4200, orders: 3200 },
  { day: "Thursday", pageViews: 3800, orders: 2800 },
  { day: "Friday", pageViews: 4800, orders: 3800 },
  { day: "Saturday", pageViews: 3400, orders: 2200 },
  { day: "Sunday", pageViews: 4000, orders: 3000 },
]

const aircraftData = [
  { name: 'Giáo dục', value: 3 },
  { name: 'Môi trường', value: 6 },
  { name: 'Y tế', value: 3 },
  { name: 'Cộng đồng', value: 5 }
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

export default function Dashboard() {
  const { data } = useStatistics()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Tổng Quan</h1>
          <p className="text-gray-600">Theo dõi và phân tích hiệu suất hoạt động</p>
        </div>

        {/* Stats Cards - Improved with better spacing and icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 font-medium mb-1">Tổng số thành viên</p>
                    <h3 className="text-3xl font-bold text-white mb-2">15,500</h3>
                    <span className="inline-flex items-center text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-100 font-medium mb-1">Tổng số sự kiện</p>
                    <h3 className="text-3xl font-bold text-white mb-2">3,300</h3>
                    <span className="inline-flex items-center text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8.2%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-100 font-medium mb-1">Tỉ lệ tăng trưởng</p>
                    <h3 className="text-3xl font-bold text-white mb-2">+24%</h3>
                    <span className="inline-flex items-center text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.5%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-500 to-rose-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-rose-100 font-medium mb-1">Tài khoản bị khóa</p>
                    <h3 className="text-3xl font-bold text-white mb-2">42</h3>
                    <span className="inline-flex items-center text-xs font-semibold text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      -6.8%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Row - Better proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart - Takes 2 columns */}
          <Card className="lg:col-span-2 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Thống kê theo tháng</CardTitle>
                  <CardDescription className="text-sm text-gray-500 mt-1">Số lượng đăng ký và hoạt động hàng tháng</CardDescription>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Sự kiện mở</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-800 rounded-full"></div>
                    <span className="text-gray-600">Sự kiện hủy</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickFormatter={(value) => value.slice(0, 3)}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#e5e7eb"
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#e5e7eb"
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                    name="Sự kiện được mở"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#1e40af"
                    strokeWidth={3}
                    dot={{ fill: '#1e40af', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7 }}
                    name="Sự kiện bị hủy"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Page Views - Compact */}
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Lượt xem</CardTitle>
                  <CardDescription className="text-sm text-gray-500 mt-1">Tổng lượt xem sự kiện</CardDescription>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="text-4xl font-bold text-gray-900">3,277,320</h3>
                <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +15.3% so với tuần trước
                </p>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData}>
                  <Bar dataKey="pageViews" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Equal sizing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-bold text-gray-900">Số sự kiện được tạo</CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">Phân tích theo từng tháng trong năm</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => value.slice(0, 3)}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#e5e7eb"
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    stroke="#e5e7eb"
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="desktop" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-bold text-gray-900">Phân loại sự kiện</CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">Phân bố theo loại hình hoạt động</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={aircraftData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {aircraftData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {aircraftData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.value} sự kiện</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Year Overview - Full width */}
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Tổng quan cả năm</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  Biểu đồ số lượng sự kiện trong 12 tháng
                </CardDescription>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg font-medium">
                January - December 2024
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#e5e7eb"
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="desktop"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDesktop)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="border-t border-gray-100 pt-4 bg-gray-50">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-600">Tăng 5.2%</p>
                  <p className="text-xs text-gray-500">So với tháng trước</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">1,450</p>
                <p className="text-xs text-gray-500">Tổng sự kiện năm nay</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}