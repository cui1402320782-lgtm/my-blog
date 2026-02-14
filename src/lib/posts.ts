import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 博客文章目录
const postsDirectory = path.join(process.cwd(), 'content/blog')

// 文章类型定义
export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  author: string
  coverImage?: string
  readingTime?: number
}

// 获取所有文章
export function getAllPosts(): Post[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      // 移除文件扩展名获取 slug
      const slug = fileName.replace(/\.mdx?$/, '')

      // 读取文件内容
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // 解析 front matter
      const { data, content } = matter(fileContents)

      // 计算阅读时间（假设每分钟阅读 200 字）
      const words = content.replace(/\s/g, '').length
      const readingTime = Math.ceil(words / 200)

      return {
        slug,
        title: data.title || '无标题',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        excerpt: data.excerpt || content.slice(0, 150) + '...',
        content,
        tags: data.tags || [],
        author: data.author || '匿名',
        coverImage: data.coverImage,
        readingTime,
      } as Post
    })

  // 按日期排序（最新的在前）
  return allPostsData.sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
}

// 根据 slug 获取单篇文章
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      // 尝试 .md 扩展名
      const mdPath = path.join(postsDirectory, `${slug}.md`)
      if (!fs.existsSync(mdPath)) {
        return null
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const words = content.replace(/\s/g, '').length
    const readingTime = Math.ceil(words / 200)

    return {
      slug,
      title: data.title || '无标题',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      content,
      tags: data.tags || [],
      author: data.author || '匿名',
      coverImage: data.coverImage,
      readingTime,
    }
  } catch (error) {
    console.error(`获取文章失败: ${slug}`, error)
    return null
  }
}

// 获取所有标签
export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagsSet = new Set<string>()
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag))
  })
  
  return Array.from(tagsSet).sort()
}

// 根据标签获取文章
export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts()
  return posts.filter((post) => post.tags.includes(tag))
}
