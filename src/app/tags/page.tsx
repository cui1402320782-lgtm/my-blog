import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Tag, Hash } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览文章',
}

export default async function TagsPage() {
  const posts = await getAllPosts()
  
  // 统计所有标签
  const tagMap = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = []
      }
      acc[tag].push(post)
    })
    return acc
  }, {} as Record<string, typeof posts>)
  
  const tags = Object.entries(tagMap).sort((a, b) => b[1].length - a[1].length)
  
  // 计算标签大小
  const maxCount = Math.max(...tags.map(([, posts]) => posts.length))
  const minCount = Math.min(...tags.map(([, posts]) => posts.length))

  const getTagSize = (count: number) => {
    if (maxCount === minCount) return 'text-base'
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.8) return 'text-xl md:text-2xl'
    if (ratio > 0.6) return 'text-lg md:text-xl'
    if (ratio > 0.4) return 'text-base md:text-lg'
    if (ratio > 0.2) return 'text-sm md:text-base'
    return 'text-xs md:text-sm'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面头部 */}
      <div className="bg-gradient-to-b from-[var(--card)] to-[var(--background)] pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 mb-6">
            <Tag className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            文章标签
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            共 {tags.length} 个标签，点击标签查看相关文章
          </p>
        </div>
      </div>

      {/* 标签云 */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {tags.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--muted-foreground)]">暂无标签</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {tags.map(([tag, tagPosts], index) => (
              <Link
                key={tag}
                href={`/tags#${tag}`}
                id={tag}
                className={`group inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-full hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all duration-300 animate-fade-in ${getTagSize(tagPosts.length)}`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Hash className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                <span className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                  {tag}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] group-hover:text-[var(--primary)]/70">
                  ({tagPosts.length})
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* 按标签展示文章 */}
        {tags.length > 0 && (
          <div className="mt-16 space-y-12">
            {tags.map(([tag, tagPosts]) => (
              <section key={tag} id={`section-${tag}`} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-[var(--foreground)]">
                    <span className="text-[var(--primary)]">#</span>
                    {tag}
                  </h2>
                  <span className="px-2.5 py-0.5 text-sm bg-[var(--muted)] text-[var(--muted-foreground)] rounded-full">
                    {tagPosts.length} 篇
                  </span>
                </div>
                
                <div className="grid gap-3">
                  {tagPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/20 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted-foreground)]">
                        <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                        <span>{post.readingTime} 分钟阅读</span>
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
