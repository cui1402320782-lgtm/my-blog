import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Calendar, Clock, Tag, ArrowRight, BookOpen } from 'lucide-react'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--card)] to-[var(--background)] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              探索技术的边界
            </h1>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-8 leading-relaxed">
              记录学习历程，分享技术心得。在这里，我分享关于前端开发、后端架构以及编程思维的内容。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#posts"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl border-2 border-blue-800"
              >
                <BookOpen className="w-5 h-5" />
                浏览文章
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-xl font-bold text-lg hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl border-2 border-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white dark:border-slate-200"
              >
                了解更多
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* 装饰性背景元素 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-[var(--card)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">{posts.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">文章总数</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                {new Set(posts.flatMap(p => p.tags)).size}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">标签数量</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                {posts.reduce((acc, p) => acc + p.readingTime, 0)}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">阅读分钟</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">
                {posts.length > 0 ? new Date(posts[0].date).getFullYear() : new Date().getFullYear()}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">开始年份</p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <main id="posts" className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2">最新文章</h2>
          <p className="text-[var(--muted-foreground)]">
            探索技术世界的精彩文章，持续更新中...
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card)] rounded-xl border border-[var(--border)]">
            <BookOpen className="w-16 h-16 mx-auto text-[var(--muted-foreground)] mb-4" />
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">还没有文章</h3>
            <p className="text-[var(--muted-foreground)] mb-6">开始写你的第一篇文章吧！</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              在 content/blog/ 目录下创建 .mdx 文件
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8 hover:shadow-lg hover:border-[var(--primary)]/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  {/* 日期 */}
                  <div className="flex-shrink-0 md:w-24 text-center md:text-left">
                    <div className="inline-flex md:block items-center gap-2 text-sm text-[var(--muted-foreground)]">
                      <Calendar className="w-4 h-4 md:hidden" />
                      <span className="font-medium">
                        {new Date(post.date).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="hidden md:block text-xs text-[var(--muted-foreground)] mt-1">
                      {new Date(post.date).getFullYear()}
                    </p>
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-[var(--muted-foreground)] mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {/* 阅读时间 */}
                      <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                        <Clock className="w-4 h-4" />
                        {post.readingTime} 分钟阅读
                      </span>

                      {/* 标签 */}
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[var(--muted-foreground)]" />
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 text-xs rounded-full bg-[var(--tag-bg)] text-[var(--tag-text)] font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2.5 py-0.5 text-xs rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 箭头 */}
                  <div className="hidden md:flex items-center">
                    <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 查看更多 */}
        {posts.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              查看全部文章
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
