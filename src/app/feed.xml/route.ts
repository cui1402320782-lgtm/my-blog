import RSS from 'rss'
import { getAllPosts } from '@/lib/posts'

// 静态导出配置
export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllPosts()

  const feed = new RSS({
    title: '我的博客',
    description: '技术分享与生活记录',
    site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com',
    feed_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com'}/feed.xml`,
    language: 'zh-CN',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} 博客作者`,
    managingEditor: 'your-email@example.com',
    webMaster: 'your-email@example.com',
    ttl: 60,
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourblog.com'}/blog/${post.slug}`,
      guid: post.slug,
      date: post.date,
      author: post.author,
      categories: post.tags,
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
