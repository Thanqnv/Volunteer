import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { LayoutDashboard, Plane, CalendarDays, User, Users, UserPen, FileText, TicketCheck, Menu, X } from 'lucide-react'

const navItems = [
  {
    name: 'Tổng quan',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Quản lý sự kiện',
    href: '/admin/eventManage',
    icon: CalendarDays
  },
  {
    name: 'Quản lý thành viên',
    href: '/admin/customers',
    icon: Users
  },
  {
    name: 'Quản lý admin',
    href: '/admin/members',
    icon: UserPen
  },
  {
    name: 'Hồ sơ cá nhân',
    href: '/admin/profile',
    icon: User
  },
  {
    name: 'Dashboard',
    href: '/admin/events',
    icon: User
  }
]

export default function Navbar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-green-500 rounded">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Volunteer Hub</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-zinc-900 text-zinc-400 shadow-2xl border-r border-zinc-800 z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                router.pathname === item.href
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-white hover:bg-green-500/10 hover:text-green-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-screen w-64 bg-zinc-900 text-zinc-400">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-green-500 rounded">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Volunteer Hub</h1>
          </div>
        </div>
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                router.pathname === item.href
                  ? 'bg-green-500/10 text-green-500'
                  : 'text-white hover:bg-green-500/10 hover:text-green-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}