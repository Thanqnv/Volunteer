"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Flame } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useManagerDashboard } from "@/hooks/useManagerDashboard";

// === Palette từ dự án (Primary Emerald + Accent Orange) ===
const CHART_COLORS = ["#10B981", "#E8604C", "#06B6D4", "#F59E0B"];

export default function ManagerDashboard() {
  const { stats, newEvents, trending, monthlyStats, loading } = useManagerDashboard();

  if (loading) {
    return <div className="p-8">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 text-[hsl(var(--foreground))] p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-orange-500 bg-clip-text">
            Bảng điều khiển tình nguyện viên
          </h1>
          <p className="text-gray-600">
            Tổng hợp hoạt động, sự kiện và mức độ tương tác cộng đồng
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Tổng sự kiện",
              value: stats.totalEvents,
              desc: "Sự kiện đã tổ chức",
            },
            {
              title: "Tổng thành viên",
              value: stats.totalMembers,
              desc: "Người tham gia các hoạt động",
            },
            {
              title: "Bài viết gần đây",
              value: stats.recentPosts,
              desc: "Tin bài & trao đổi mới",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="bg-white/80 border border-emerald-100 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] duration-300 rounded-2xl"
            >
              <CardHeader>
                <CardTitle className="text-emerald-600">{item.title}</CardTitle>
                <CardDescription className="text-3xl font-bold text-gray-900">
                  {item.value}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-500">{item.desc}</CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Line Chart */}
          <Card className="bg-white/90 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-emerald-600">
                Thống kê hoạt động theo tháng
              </CardTitle>
              <CardDescription>
                Biểu đồ tổng hợp số sự kiện, thành viên và bài viết
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="members"
                    stroke="#E8604C"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#06B6D4"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-white/90 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-emerald-600">
                Tỷ lệ sự kiện theo mức độ tương tác
              </CardTitle>
              <CardDescription>
                Phân bố lượt thành viên và tương tác
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trending.map((ev) => ({
                      name: ev.title,
                      value: ev.deltaMembers + ev.deltaLikes,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {trending.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Event Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/90 border border-gray-200 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-emerald-600">
                Sự kiện mới công bố
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {newEvents.map((ev) => (
                  <li
                    key={ev.id}
                    className="p-4 bg-emerald-50 hover:bg-emerald-100 transition-all rounded-xl shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {ev.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Đăng: {ev.publishedAt} • {ev.posts} tin
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">
                      {ev.members} thành viên
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50 border border-orange-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-orange-600 flex items-center gap-2 text-lg font-bold">
                <Flame className="text-orange-500 animate-pulse" size={22} />
                Sự kiện thu hút (Trending)
              </CardTitle>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                Cập nhật mới nhất
              </span>
            </CardHeader>

            <CardContent>
              <ul className="space-y-4">
                {trending.map((ev, i) => (
                  <li
                    key={ev.id}
                    className={`
            relative overflow-hidden p-5 rounded-xl border transition-all duration-300
            ${i % 2 === 0
                        ? "bg-gradient-to-r from-orange-100/80 to-rose-100/80"
                        : "bg-gradient-to-r from-yellow-100/80 to-orange-50/80"
                      }
            hover:scale-[1.02] hover:shadow-md group
          `}
                  >
                    <div className="flex justify-between items-center">
                      {/* Thông tin sự kiện */}
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
                          {ev.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          +{ev.deltaMembers} thành viên • +{ev.deltaLikes} lượt
                          tương tác
                        </div>
                      </div>

                      {/* Biểu tượng HOT */}
                      <div className="flex items-center gap-1 font-extrabold animate-bounce">
                        <Flame
                          className="text-orange-500 animate-flicker drop-shadow-[0_0_6px_rgba(249,115,22,0.7)]"
                          size={18}
                        />
                        <span className="uppercase tracking-wide bg-clip-text text-orange-500 bg-gradient-to-r from-orange-500 to-red-500">
                          HOT
                        </span>
                      </div>
                    </div>

                    {/* Thanh nhiệt huyết hiển thị mức độ */}
                    <div className="mt-3 h-2 w-full bg-orange-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-grow"
                        style={{
                          width: `${Math.min(
                            (ev.deltaMembers + ev.deltaLikes) / 3,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
