---
title: "Next.js 博客系统搭建"
date: "2026-02-14"
excerpt: "从零开始搭建一个功能完善的 Next.js 博客系统，支持 Markdown/MDX、搜索、评论、RSS 和 SEO"
tags: ["Next.js", "MDX", "Tailwind", "Fuse.js", "Giscus", "RSS", "Sitemap", "博客"]
author: "OpenCode 用户"
---

# Next.js 博客系统搭建

**发布时间**：2026年02月14日20时51分55秒  
**作者**：OpenCode 用户  
**标签**：Next.js, MDX, Tailwind, Fuse.js, Giscus, RSS, Sitemap, MD/MDX, TS

---

## 引言
随着个人技术博客成为展示能力的重要手段，如何在一个现代前端框架内实现一个功能完备的博客系统，既要支持 Markdown/MDX 内容、评论、SEO、静态生成，又要具备搜索和 RSS 等能力，是一个值得系统化实现的练习。本次设计以 Next.js 15 + TypeScript 为核心，结合 Tailwind CSS、MDX/Markdown、Fuse.js 搜索、Giscus 评论等，目标是一个纯静态生成且 SEO 友好的博客系统，支持 md 和 mdx 两种格式。

## 项目背景与需求
- Markdown/MDX 内容渲染: 支持 .md 与 .mdx 两种文章格式
- 博客文章管理: 文章目录、元数据、时间线
- SEO: 自动生成 sitemap.xml 与 RSS 2.0
- 静态生成: 全站静态化，首屏性能高
- 搜索: 含中文的模糊搜索能力
- 评论: 集成外部评论系统（Giscus、Utterances、Disqus、Twikoo、Waline 的对比）
- 响应式设计、暗色模式
- 技术栈: Next.js 15 + TS, Tailwind CSS, MDX/Markdown、Fuse.js、Giscus、gray-matter

## 技术选型思路与对比
- Next.js 15 + TypeScript
  - 优势：App Router、SSG/SSR、强生态、MDX 集成、内置 SEO 能力、良好静态部署体验
  - 适用场景：以静态生成为主、需要丰富生态和最小化配置
- Astro
  - 优势：极强 Markdown/MDX 内容渲染、极小客户端负载
  - 局限：对于复杂交互、第三方服务整合略显生硬
- 评论系统对比
  - Giscus：GitHub Issue 评论，技术博客首选之一，易自托管
  - Utterances、Disqus、Waline、Twikoo：各有侧重点
- 搜索对比
  - Fuse.js：浏览端搜索，轻量、中文支持需在索引阶段优化
  - Pagefind/Algolia：更强大但引入额外成本
- 结论：以 Next.js 15 + TS 为核心框架，结合 MDX/Markdown、Fuse.js 实现本地搜索、Giscus 评论、RSS 与 sitemap 构建策略，达到"静态生成+ SEO 友好+ 搜索可用"的目标。

## 详细实现步骤

1) 项目初始化
- 创建 Next.js 15 + TypeScript 项目
- 安装 Tailwind CSS、MDX、gray-matter、Fuse.js、Giscus
- 配置 MDX/Markdown 支持（.md、.mdx）
- 启用 App Router、Tailwind、Dark Mode

2) 内容结构设计
- content/posts/ 下放置 .md/.mdx 文章，含 front matter（title/date/slug/excerpt/tags）

3) MDX/Markdown 渲染
- 使用 next-mdx 或 MDX-Remote 方案，将 MDX 内容转换为可渲染的 React 组件

4) 静态博客路由
- 使用 App Router 的动态路由 /blog/[slug]/page.tsx，结合 getAllPosts 获取全量文章、getPostBySlug 读取文章
- 生成静态参数，确保构建期静态渲染

5) SEO 与 RSS / Sitemap
- 自动生成 sitemap.xml 与 rss.xml，在构建阶段写入 public/
- 使用头部元信息，Open Graph、Twitter Card

6) 搜索实现
- 构建本地索引（build-time）或在浏览器中进行搜索
- 以 Fuse.js 为核心，支持中文模糊搜索

7) 评论集成
- 集成 Giscus（GitHub 讨论区）实现评论功能

8) 部署
- Vercel、Netlify 或静态托管，部署前执行 npm run build

## 核心代码展示

1) 文章读取与 front matter 解析 (lib/posts.ts)
```ts
// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  cover?: string;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

// 获取所有文章元信息
export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(POSTS_DIR);
  const posts: PostMeta[] = [];
  for (const file of files) {
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      const fullPath = path.join(POSTS_DIR, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(raw);
      const slug = file.replace(/\.mdx?$/, '');
      posts.push({
        title: data.title ?? slug,
        date: data.date ?? '',
        slug,
        excerpt: data.excerpt ?? '',
        tags: (data.tags ?? []) as string[],
      });
    }
  }
  // 按日期倒序
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 根据 slug 获取文章详情
export async function getPostBySlug(slug: string): Promise<{ meta: PostMeta; content: string }> {
  const fullPathMd = path.join(POSTS_DIR, `${slug}.md`);
  const fullPathMdX = path.join(POSTS_DIR, `${slug}.mdx`);
  let fullPath: string | null = null;
  if (fs.existsSync(fullPathMd)) fullPath = fullPathMd;
  else if (fs.existsSync(fullPathMdX)) fullPath = fullPathMdX;
  if (!fullPath) throw new Error('Post not found');
  const file = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(file);
  return { meta: data as PostMeta, content };
}
```

2) MDX/Markdown 渲染 (lib/mdx.ts)
```ts
// lib/mdx.ts
import { serialize } from 'next-mdx-remote/serialize';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';

export async function renderMDX(source: string) {
  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
    },
  });
  return mdxSource;
}
```

3) 博客文章路由页面 (app/blog/[slug]/page.tsx)
```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();
  return (
    <article>
      <h1>{post.meta.title}</h1>
      <MDXRemote source={post.content} />
    </article>
  );
}
```

4) 搜索组件实现 (components/Search.tsx)
```tsx
'use client';
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export function Search({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('');
  const fuse = useMemo(() => new Fuse(posts, { keys: ['title', 'excerpt'], threshold: 0.4 }), [posts]);
  const results = query ? fuse.search(query).map(r => r.item) : posts;
  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索文章..." />
      <ul>{results.map(post => <li key={post.slug}>{post.title}</li>)}</ul>
    </div>
  );
}
```

5) Giscus 评论组件 (components/Comments.tsx)
```tsx
'use client';
import { useEffect, useRef } from 'react';

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'yourname/blog-repo');
    script.setAttribute('data-repo-id', 'R_xxx');
    script.setAttribute('data-category', 'Blog Comments');
    script.setAttribute('data-category-id', 'DIC_xxx');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.async = true;
    ref.current?.appendChild(script);
  }, []);
  return <div ref={ref} />;
}
```

6) RSS 生成脚本 (scripts/generate-rss.js)
```js
const fs = require('fs');
const path = require('path');
const { getAllPosts } = require('./lib/posts');

const baseUrl = process.env.BASE_URL || 'https://example.com';
const posts = getAllPosts();
const rssItems = posts.map(p => `
  <item>
    <title>${p.title}</title>
    <link>${baseUrl}/blog/${p.slug}</link>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description>${p.excerpt}</description>
  </item>
`).join('');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <link>${baseUrl}</link>
    ${rssItems}
  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, '../public/rss.xml'), rss);
```

## 部署与验证

- 构建：npm run build
- 部署：Vercel/Netlify/静态托管
- 验证：
  - 首页文章列表
  - 文章详情页渲染
  - 搜索功能
  - RSS / Sitemap 可访问
  - 评论组件加载
  - 响应式与暗色模式

## 总结

本博客系统以 Next.js 15 + TypeScript 为核心，实现了 Markdown/MDX 双格式支持、Fuse.js 本地搜索、Giscus 评论、自动生成 RSS 与 Sitemap、响应式暗色模式等完整功能，适合作为个人技术博客的基础架构。
