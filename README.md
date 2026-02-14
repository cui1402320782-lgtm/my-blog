# 我的博客

一个基于 Next.js + MDX 构建的现代化博客系统。

## 功能特性

- ✅ **Markdown/MDX 支持** - 使用 Markdown 编写文章，支持 React 组件
- ✅ **评论系统** - 集成 Giscus（基于 GitHub Discussions）
- ✅ **SEO 优化** - 自动生成 Sitemap、RSS Feed、Meta 标签
- ✅ **静态生成** - 纯静态 HTML，快速加载
- ✅ **搜索功能** - Fuse.js 模糊搜索，支持中文
- ✅ **暗色模式** - 自动适配系统主题
- ✅ **响应式设计** - 完美适配各种设备

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容**: MDX (Markdown + React)
- **搜索**: Fuse.js
- **评论**: Giscus
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local` 并修改为你的配置：

```env
NEXT_PUBLIC_SITE_URL=https://yourblog.com

# Giscus 配置（可选，用于评论功能）
NEXT_PUBLIC_GISCUS_REPO=你的用户名/博客仓库
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=Blog Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxx
```

获取 Giscus 配置：https://giscus.app

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 编写文章

在 `content/blog/` 目录下创建 `.mdx` 文件：

```markdown
---
title: "文章标题"
date: "2025-02-14"
excerpt: "文章摘要"
tags: ["标签1", "标签2"]
author: "作者名"
---

# 文章标题

文章内容支持 **Markdown** 语法。

## 代码示例

```typescript
console.log('Hello World')
```
```

### 5. 构建部署

```bash
npm run build
```

静态文件将生成在 `dist/` 目录，可部署到任何静态托管服务。

## 项目结构

```
my-blog/
├── content/blog/          # 博客文章
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── blog/[slug]/  # 文章详情页
│   │   ├── feed.xml/     # RSS Feed
│   │   ├── sitemap.ts    # Sitemap
│   │   ├── page.tsx      # 首页
│   │   └── layout.tsx    # 根布局
│   ├── components/       # React 组件
│   │   ├── SearchBox.tsx # 搜索组件
│   │   └── GiscusComments.tsx # 评论组件
│   └── lib/
│       ├── posts.ts      # 文章处理
│       └── search.ts     # 搜索逻辑
├── public/               # 静态资源
├── scripts/              # 构建脚本
└── next.config.ts        # Next.js 配置
```

## 自定义配置

### 修改站点信息

编辑 `src/app/layout.tsx`：

```typescript
export const metadata: Metadata = {
  title: {
    default: '你的博客名称',
    template: '%s | 你的博客名称',
  },
  description: '你的博客描述',
  // ...
}
```

### 添加新页面

在 `src/app/` 目录下创建新的文件夹和 `page.tsx` 文件。

### 自定义样式

修改 `src/app/globals.css` 或直接在组件中使用 Tailwind CSS。

## 部署

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 自动部署

### 其他平台

构建后的 `dist/` 目录可部署到：
- Netlify
- Cloudflare Pages
- GitHub Pages
- 任何静态托管服务

## 许可证

MIT
