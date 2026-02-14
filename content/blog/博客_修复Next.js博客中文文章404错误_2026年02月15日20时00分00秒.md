---
title: "修复 Next.js 博客中文文章 404 错误：从文件名到 Slug 的最佳实践"
date: "2026-02-15"
excerpt: "详细记录修复 Next.js 博客部署到 Vercel 后中文文章无法访问的问题，包括问题分析、解决方案和最佳实践"
tags: ["Next.js", "Vercel", "博客", "Slug", "部署", "中文URL", "静态生成"]
author: "cjf"
---

# 修复 Next.js 博客中文文章 404 错误：从文件名到 Slug 的最佳实践

本文记录在将博客部署到 Vercel 后，中文文章链接返回 404 的排查与修复过程，以及从文件名到 slug 的最佳实践。

---
## 1. 问题背景
- 博客部署到 Vercel 后，文章页面无法查看，点击文章链接返回 404。
- 症状直观：某篇中文文章的 URL 在浏览器中直接打开会显示 404。
- 根本原因初步判断为：文件名包含中文和特殊字符，导致生成的 slug 与实际路由不一致。

---
## 2. 问题分析
- Next.js 使用文件名作为 slug 生成静态页面，中文文件名在 URL 中往往不兼容。
- 静态生成阶段缺少 front-matter 中的 slug 字段，导致系统无法明确对应的 slug，从而生成错误的路由。
- 未使用 slug 时，默认会把文件名直接映射到 URL，遇到中文或空格等字符就容易产生 404。

---
## 3. 解决方案
- 方案要点：通过在 front-matter 增加 slug 字段，并在系统内部统一通过 slug 来检索文章。
- 修改 src/lib/posts.ts，使其优先读取 front-matter 中的 slug；若没有，则回退到将文件名转换为 slug。
- 修改 scripts/generate-search-index.js，使搜索索引也包含 slug，确保前端搜索与路由对接正确。
- 为现有文章逐条添加 slug 字段，确保静态生成时能够正确生成页面。
- 修改 getPostBySlug，使其能够通过 slug 查找中文文件对应的文章。

---
## 4. 代码示例

- posts.ts 的修改（TypeScript）
- 文章 front-matter 示例
- generate-search-index.js 的修改

```ts
// 文件：src/lib/posts.ts
// 目的：支持 front-matter 中 slug 的使用，以及中文 slug 的兼容
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface PostMeta {
  slug?: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
}

export interface Post {
  slug: string
  meta: PostMeta
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

// 将文件名转换为 slug（去掉扩展名，替换空格为 -，保留中文以便后续通过 slug 前缀兼容）
export function fileNameToSlug(fileName: string): string {
  const name = fileName.replace(/\\.mdx?$/, '')
  return name.trim().replace(/\\s+/g, '-').replace(/_/g, '-')
}

// 获取所有文章
export async function getAllPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts: Post[] = fileNames
    .filter(name => name.endsWith('.md') || name.endsWith('.mdx'))
    .map(fileName => {
      const fullPath = path.join(postsDirectory, fileName)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(raw)
      const slug = (data.slug ?? fileNameToSlug(fileName)) as string
      const meta: PostMeta = { ...data, slug }
      return { slug, meta, content }
    })
  return posts
}

// 通过 slug 获取文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  const found = posts.find(p => p.slug === slug || p.meta.slug === slug)
  return found ?? null
}
```

- generate-search-index.js 的修改（JavaScript）
```js
// 文件：scripts/generate-search-index.js
const fs = require('fs')
const path = require('path')
const { getAllPosts } = require('../src/lib/posts')

async function generate() {
  const posts = await getAllPosts()
  const index = posts.map(p => ({
    slug: p.slug,
    title: p.meta.title,
    date: p.meta.date,
    excerpt: p.meta.excerpt,
    tags: p.meta.tags,
    content: p.content
  }))
  const outPath = path.join(__dirname, '../public/search-index.json')
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), 'utf8')
  console.log('Search index generated:', outPath)
}
generate().catch(err => {
  console.error(err)
  process.exit(1)
})
```

- 现有文章 front-matter 示例
```md
---
title: "如何在 Next.js 部署中处理中文文章的 slug"
date: "2026-02-15"
slug: "如何在-nextjs-部署中处理中文文章的-slug"
excerpt: "示例文章，用于演示 slug 的使用"
tags: ["Next.js", "Slug", "中文URL"]
author: "cjf"
---
```

---
## 5. 验证步骤
- 本地构建测试
- 检查生成的静态页面
- 部署到 Vercel 并测试访问

### 本地构建与验证命令
```bash
npm install
npm run build
npm run generate-index
ls -la dist || ls -la out || ls -la dist  # 根据项目输出目录检查构建结果
```

### 访问前端页面的预期
- 已经通过 slug 读取 front-matter 的文章能正确生成路由，中文 slug 也能映射到正确页面
- 静态页面 200，中文路径不再返回 404

---
## 6. 最佳实践
- 新增文章时务必添加 slug 字段，并统一使用 slug 作为路由标识
- slug 命名规范：只使用小写字母、数字、和 -，尽量避免中文字符直接出现在 URL；若需要支持中文路由，务必通过服务器端映射或自定义路由策略实现
- 文件名可保留中文以便管理，但前端路由应统一通过 slug 映射
- 为现有文章更新 front-matter，逐篇添加 slug 字段并重新生成索引
- 修改 getPostBySlug 的实现，优先匹配 front-matter.slug，再回退到文件名转换得到的 slug

---
## 7. 总结
- 问题根因：中文文件名直接参与 slug 的生成，导致 Vercel 部署后路由不一致，页面 404。
- 修复要点：引入 front-matter slug、更新索引生成逻辑、并确保现有文章映射正确。
- 未来建议：建立统一的 slug 规范、在 CI 流程中自动校验 slug 的唯一性和兼容性、以及为多语言博客添加路由层映射。

---
## 附录：参考链接
- Next.js 文档：Slug generation 与 dynamic routing
- MDX/Markdown 内容处理相关示例
- Vercel 部署最佳实践
