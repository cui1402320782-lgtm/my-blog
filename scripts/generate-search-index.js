const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const postsDirectory = path.join(process.cwd(), 'content/blog')

function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '无标题',
        excerpt: data.excerpt || content.slice(0, 150) + '...',
        content: content.slice(0, 500), // 只取前500字符用于搜索
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
      }
    })
}

function generateSearchIndex() {
  const posts = getAllPosts()
  const searchIndexPath = path.join(process.cwd(), 'public/search-index.json')
  
  fs.writeFileSync(searchIndexPath, JSON.stringify(posts, null, 2))
  console.log(`✓ 生成搜索索引: ${posts.length} 篇文章`)
}

generateSearchIndex()
