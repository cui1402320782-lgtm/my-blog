'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchBox } from './SearchBox'
import { ThemeToggle } from './ThemeToggle'
import { Home, Archive, FolderOpen, Tag, User, Rss } from 'lucide-react'

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/archives', label: '归档', icon: Archive },
  { href: '/categories', label: '分类', icon: FolderOpen },
  { href: '/tags', label: '标签', icon: Tag },
  { href: '/about', label: '关于', icon: User },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[var(--card)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
          >
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              我的博客
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:block">
              <SearchBox />
            </div>
            
            {/* RSS */}
            <Link
              href="/feed.xml"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
              title="RSS 订阅"
            >
              <Rss className="w-4 h-4" />
            </Link>
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

// 移动端菜单组件
function MobileMenu() {
  return (
    <div className="md:hidden">
      {/* 简化的移动端导航 - 在底部固定显示 */}
    </div>
  )
}
