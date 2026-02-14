'use client'

import Link from 'next/link'
import { Heart, Github, Twitter, Mail, Rss } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  // 计算博客运行时间（示例：从2024年开始）
  const startDate = new Date('2024-01-01')
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <footer className="border-t bg-[var(--card)] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 博客信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">我的博客</h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              记录技术成长，分享生活点滴。在这里，我分享关于前端开发、后端技术以及个人思考的内容。
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:your@email.com"
                className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <Link
                href="/feed.xml"
                className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                aria-label="RSS"
              >
                <Rss className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/archives" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  归档
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  分类
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  标签
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>

          {/* 统计信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">博客统计</h3>
            <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <p>已运行时间: {diffDays} 天</p>
              <p>最后更新: {now.toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              © {currentYear} 我的博客. All rights reserved.
            </p>
            <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> using 
              <a 
                href="https://nextjs.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline"
              >
                Next.js
              </a>
              +
              <a 
                href="https://tailwindcss.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline"
              >
                Tailwind CSS
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
