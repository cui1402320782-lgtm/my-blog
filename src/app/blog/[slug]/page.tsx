import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { GiscusComments } from '@/components/GiscusComments'
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* 文章头部 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
        </header>

        {/* 文章内容 */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 评论 */}
        <GiscusComments slug={post.slug} />
      </article>

      {/* Footer */}
      <footer className="border-t dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} 我的博客. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
