import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { SearchBox } from '@/components/SearchBox'
import { Calendar, Clock, Tag } from 'lucide-react'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link href="/" className="text-2xl font-bold hover:text-blue-600 transition-colors">
                我的博客
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                技术分享与生活记录
              </p>
            </div>
            <SearchBox />
          </div>
          
          <nav className="flex gap-6 mt-6">
            <Link href="/" className="text-blue-600 font-medium">首页</Link>
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">文章</Link>
            <a href="/feed.xml" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">RSS</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">最新文章</h1>
          <p className="text-gray-600 dark:text-gray-400">
            共 {posts.length} 篇文章
          </p>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p>还没有文章，开始写第一篇吧！</p>
              <p className="text-sm mt-2">在 content/blog/ 目录下创建 .mdx 文件</p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="border-b dark:border-gray-700 pb-8 last:border-0"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readingTime} 分钟阅读
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {post.tags.join(', ') || '无标签'}
                  </span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  阅读更多 →
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 我的博客. All rights reserved.</p>
          <p className="text-sm mt-2">
            使用 Next.js + MDX 构建
          </p>
        </div>
      </footer>
    </div>
  )
}
