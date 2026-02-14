import Fuse from 'fuse.js'
import { getAllPosts, Post } from './posts'

// 搜索选项
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'content', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'excerpt', weight: 0.1 },
  ],
  threshold: 0.4,        // 模糊匹配阈值
  ignoreLocation: true,  // 忽略匹配位置（对中文更友好）
  minMatchCharLength: 2, // 最小匹配字符数
  includeScore: true,    // 包含匹配分数
  includeMatches: false, // 不包含匹配详情
}

// 搜索文章
export async function searchPosts(query: string): Promise<Post[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  const posts = await getAllPosts()
  
  const fuse = new Fuse(posts, fuseOptions)
  const results = fuse.search(query.trim())
  
  // 返回匹配的文章，按分数排序
  return results.map((result) => result.item)
}

// 获取搜索建议（前5个结果）
export async function getSearchSuggestions(query: string): Promise<Pick<Post, 'slug' | 'title' | 'excerpt'>[]> {
  const results = await searchPosts(query)
  return results.slice(0, 5).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt.slice(0, 100) + '...',
  }))
}
