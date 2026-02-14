import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FolderOpen, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '分类',
  description: '按分类浏览文章',
}

export default async function CategoriesPage() {
  const posts = await getAllPosts()
  
  // 提取所有分类（这里使用第一个标签作为分类）
  const categoryMap = posts.reduce((acc, post) => {
    const category = post.tags[0] || '未分类'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(post)
    return acc
  }, {} as Record<string, typeof posts>)
  
  const categories = Object.entries(categoryMap).sort((a, b) => b[1].length - a[1].length)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面头部 */}
      <div className="bg-gradient-to-b from-[var(--card)] to-[var(--background)] pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 mb-6">
            <FolderOpen className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            文章分类
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            共 {categories.length} 个分类，{posts.length} 篇文章
          </p>
        </div>
      </div>

      {/* 分类内容 */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--muted-foreground)]">暂无分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(([category, categoryPosts], index) => (
              <Link
                key={category}
                href={`/tags#${category}`}
                className="group p-6 bg-[var(--card)] rounded-xl border border-[var(--border)] hover:border-[var(--primary)]/20 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
                      <FolderOpen className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      {category}
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                    <FileText className="w-4 h-4" />
                    {categoryPosts.length}
                  </span>
                </div>
                
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                  {categoryPosts.slice(0, 3).map(p => p.title).join('、')}
                  {categoryPosts.length > 3 && ' 等'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
