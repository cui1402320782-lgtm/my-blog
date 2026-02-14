import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Calendar, Clock, Archive } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '归档',
  description: '按时间顺序浏览所有文章',
}

export default async function ArchivesPage() {
  const posts = await getAllPosts()
  
  // 按年份分组
  const groupedPosts = posts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {} as Record<number, typeof posts>)
  
  const years = Object.keys(groupedPosts).map(Number).sort((a, b) => b - a)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面头部 */}
      <div className="bg-gradient-to-b from-[var(--card)] to-[var(--background)] pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 mb-6">
            <Archive className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            文章归档
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            共 {posts.length} 篇文章，记录技术成长的点点滴滴
          </p>
        </div>
      </div>

      {/* 归档内容 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {years.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--muted-foreground)]">暂无文章</p>
          </div>
        ) : (
          <div className="space-y-12">
            {years.map((year) => (
              <section key={year} className="animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">{year}</h2>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {groupedPosts[year].length} 篇
                  </span>
                </div>
                
                <div className="space-y-2">
                  {groupedPosts[year].map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-lg hover:bg-[var(--card)] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)] sm:w-32 flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(post.date).toLocaleDateString('zh-CN', {
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {post.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime} 分钟</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
