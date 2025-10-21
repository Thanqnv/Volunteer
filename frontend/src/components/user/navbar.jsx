import Link from 'next/link'
import { useRouter } from 'next/router'
import { LayoutDashboard, Plane, Users, MessageSquare, BellRing, UserCircle } from 'lucide-react'

const navItems = [
    {
        name: 'Tổng quan',
        href: '/user/dashboard',
        icon: LayoutDashboard
    },
    {
        name: 'Lịch sử hoạt động',
        href: '/user/participants',
        icon: Users
    },
    {
        name: 'Kênh trao đổi',
        href: '/user/channel',
        icon: MessageSquare
    },
    {
        name: 'Thông báo',
        href: '/user/notify',
        icon: BellRing
    },
    {
        name: 'Cài đặt tài khoản',
        href: '/user/profile',
        icon: UserCircle
    }
]

export default function Navbar() {
    const router = useRouter()
    return (
        <div className="h-screen w-64 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 text-zinc-400 shadow-2xl border-r border-zinc-800/50">
            <div className="p-6 border-b border-zinc-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 group">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-all duration-300 group-hover:scale-110">
                        <Plane className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-white tracking-tight">Volunteer Hub</h1>
                </div>
            </div>
            <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = router.pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                transition-all duration-300 ease-out overflow-hidden
                                ${isActive
                                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 shadow-lg shadow-green-500/10'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }
                            `}
                        >
                            {/* Active indicator bar */}
                            <div className={`
                                absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full
                                transition-all duration-300
                                ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                            `} />

                            {/* Hover background effect */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl
                                transition-opacity duration-300
                                ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                            `} />

                            {/* Icon with glow effect */}
                            <div className={`
                                relative z-10 transition-all duration-300
                                ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                            `}>
                                <item.icon className={`
                                    w-5 h-5 transition-all duration-300
                                    ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''}
                                `} />
                            </div>

                            {/* Text */}
                            <span className="relative z-10 transition-all duration-300">
                                {item.name}
                            </span>

                            {/* Shimmer effect on hover */}
                            <div className={`
                                absolute inset-0 -translate-x-full group-hover:translate-x-full
                                bg-gradient-to-r from-transparent via-white/5 to-transparent
                                transition-transform duration-1000 ease-in-out
                                ${isActive ? 'hidden' : ''}
                            `} />
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}