# 修复博客文章URL无法访问问题

## 问题分析

你的博客部署到 Vercel 后文章无法查看，根本原因是：

1. **文件名包含中文和特殊字符**：如 `博客_Next.js 博客系统搭建_2026年02月14日20时51分55秒.md`
2. **缺少 slug 字段**：文章的 front-matter 中没有 `slug` 字段
3. **URL 生成问题**：系统使用文件名作为 slug，包含空格、冒号、中文等非法URL字符
4. **静态生成失败**：Next.js 静态导出时无法正确处理这些字符，导致页面404

## 当前文件结构

```
content/blog/
├── hello-world.mdx                    ← 正常的英文slug（可以工作）
├── markdown-guide.md                  ← 正常的英文slug（可以工作）
├── 博客_Next.js 博客系统搭建_2026年02月14日20时51分55秒.md  ← 中文slug，URL不兼容
├── 博客_Next.js博客UI设计与主题改造_2026年02月14日23时30分00秒.md  ← 中文slug
└── 博客_OpenCode配置文件修复指南_2026年02月14日21时22分00秒.md  ← 中文slug
```

## 修复方案

### 方案一：修改 posts.ts（推荐）

修改 `src/lib/posts.ts`，支持从 front-matter 读取 `slug` 字段：

```typescript
// 在 getAllPosts 函数中修改
const slug = data.slug || fileName.replace(/\.mdx?$/, '')
```

这样可以在 front-matter 中自定义 slug，而不依赖文件名。

### 方案二：为现有文章添加 slug 字段

为所有中文文件名的文章添加 front-matter `slug` 字段：

**博客_Next.js 博客系统搭建_2026年02月14日20时51分55秒.md:**
```yaml
---
title: "Next.js 博客系统搭建"
date: "2026-02-14"
slug: "nextjs-blog-setup"  # ← 添加此行
excerpt: "从零开始搭建一个功能完善的 Next.js 博客系统..."
tags: ["Next.js", "MDX", "Tailwind", "Fuse.js", "Giscus", "RSS", "Sitemap", "博客"]
author: "OpenCode 用户"
---
```

**博客_Next.js博客UI设计与主题改造_2026年02月14日23时30分00秒.md:**
```yaml
---
title: "Next.js博客UI设计与主题改造"
date: "2026-02-14"
slug: "nextjs-blog-ui-theme"  # ← 添加此行
excerpt: "..."
tags: [...]
author: "OpenCode 用户"
---
```

**博客_OpenCode配置文件修复指南_2026年02月14日21时22分00秒.md:**
```yaml
---
title: "OpenCode配置文件修复指南"
date: "2026-02-14"
slug: "opencode-config-fix-guide"  # ← 添加此行
excerpt: "..."
tags: [...]
author: "OpenCode 用户"
---
```

### 方案三：创建构建前脚本（可选，自动处理）

创建 `scripts/fix-slugs.js` 脚本，自动为所有文章生成 front-matter slug：

```javascript
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

const postsDir = path.join(process.cwd(), 'content/blog');
const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

for (const file of files) {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: body } = matter(content);
  
  if (!data.slug) {
    data.slug = generateSlug(data.title || file.replace(/\.mdx?$/, ''));
    const newContent = matter.stringify(body, data);
    fs.writeFileSync(filePath, newContent);
    console.log(`✓ Added slug "${data.slug}" to ${file}`);
  }
}
```

## 预期效果

修复后，文章的 URL 将是：
- `/blog/hello-world` ← 已有
- `/blog/markdown-guide` ← 已有
- `/blog/nextjs-blog-setup` ← 修复后
- `/blog/nextjs-blog-ui-theme` ← 修复后
- `/blog/opencode-config-fix-guide` ← 修复后

所有 URL 都是纯英文、无特殊字符的，完全兼容静态生成和部署。

## 验证步骤

1. 本地构建：`npm run build`
2. 检查输出：确认 `dist/blog/` 目录下有正确的英文文件夹
3. 本地预览：`npx serve dist` 访问 `/blog/nextjs-blog-setup/`
4. 部署到 Vercel：推送代码后自动重新部署

## 建议的最佳实践

1. **未来创建文章时**：
   - 文件名可以保留中文（便于本地管理）
   - 必须在 front-matter 中添加 `slug` 字段
   - slug 格式：`lowercase-words-separated-by-dashes`

2. **slug 命名规范**：
   - 使用小写字母
   - 单词用短横线 `-` 分隔
   - 避免特殊字符和空格
   - 简洁明了，与标题相关

3. **示例**：
   ```markdown
   ---
   title: "如何学习 TypeScript"
   slug: "how-to-learn-typescript"
   date: "2025-02-15"
   ---
   ```

## 执行命令

运行以下命令执行修复：

```bash
/start-work
```

这将执行完整的修复流程：
1. 修改 `src/lib/posts.ts` 支持 front-matter slug
2. 为所有中文文件名的文章添加 slug 字段
3. 本地构建测试
4. 验证生成的静态页面
5. 提供部署指导
