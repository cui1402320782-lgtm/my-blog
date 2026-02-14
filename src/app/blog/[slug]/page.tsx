import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { GiscusComments } from '@/components/GiscusComments'
import { Calendar, Clock, Tag, ArrowLeft, User, Edit3 } from 'lucide-react'
import type { Metadata } from 'next'
import { marked } from 'marked'

// 配置 marked 为同步模式
marked.setOptions({
  async: false,
})

// 生成静态参数
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 生成元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // 将 Markdown 转换为 HTML（同步版本）
  const htmlContent = marked.parse(post.content) as string

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 文章头部背景 */}
      <div className="bg-gradient-to-b from-[var(--card)] to-[var(--background)] pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 返回按钮 */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </div>

      {/* 文章内容 */}
      <article className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* 文章头部信息 */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-[var(--muted-foreground)]">
            {/* 作者 */}
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            
            {/* 日期 */}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            
            {/* 阅读时间 */}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} 分钟阅读
            </span>
            
            {/* 编辑时间 */}
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" />
              更新于 {new Date(post.date).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </header>

        {/* 分割线 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-10" />

        {/* 文章内容 */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* 标签区域 */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">文章标签</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags#${tag}`}
                  className="px-4 py-2 bg-[var(--tag-bg)] text-[var(--tag-text)] rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 文章导航 */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回文章列表
            </Link>
            
            <Link
              href="/archives"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              查看归档
            </Link>
          </div>
        </div>

        {/* 评论区 */}
        <div className="mt-12">
          <GiscusComments slug={post.slug} />
        </div>
      </article>

      <Footer />
    </div>
  )
}
