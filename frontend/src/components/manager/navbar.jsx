import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Bell,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { name: 'Tổng quan', href: '/manager/dashboard', icon: LayoutDashboard },
  { name: 'Wall', href: '/manager/wall', icon: MessageSquare },
  { name: 'Quản lý sự kiện', href: '/manager/events', icon: CalendarDays },
  { name: 'Thông báo', href: '/manager/notifications', icon: Bell },
  { name: 'Thông tin hồ sơ', href: '/manager/profile', icon: User },
]

export default function Navbar({ onCollapse }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapse) onCollapse(newCollapsed);
  }

  useEffect(() => {
    const updateBodyOffset = () => {
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
      const width = isDesktop ? (isCollapsed ? 80 : 256) : 0
      document.body.style.paddingLeft = `${width}px`
      document.documentElement.style.setProperty('--sidebar-offset', `${width}px`)
    }
    updateBodyOffset()
    window.addEventListener('resize', updateBodyOffset)
    return () => {
      document.body.style.paddingLeft = ''
      document.documentElement.style.removeProperty('--sidebar-offset')
      window.removeEventListener('resize', updateBodyOffset)
    }
  }, [isCollapsed])

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-green-500 rounded">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Manager Hub</h1>
          </div>
          <button onClick={toggleMobileMenu} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setIsMobileMenuOpen(false)} />}

      <div className={`hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:z-40 h-screen flex-col bg-zinc-900 text-zinc-400 shadow-2xl border-r border-zinc-800/50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`border-b border-zinc-800/50 backdrop-blur-sm ${isCollapsed ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-lg font-bold text-white tracking-tight ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>Manager Hub</h1>
          </div>
          <button onClick={toggleCollapse} className="mt-4 w-full flex items-center justify-center p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg">
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        <nav className={`space-y-1 flex-1 ${isCollapsed ? 'p-2' : 'p-4'}`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center rounded-xl text-sm font-medium ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'} ${
                router.pathname === item.href || router.pathname.startsWith(item.href + '/')
                  ? 'bg-green-500/10 text-green-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon className="w-5 h-5" />
              <span className={`${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
