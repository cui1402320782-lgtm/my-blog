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
      const slug = file.replace(/\\.mdx?$/, '');
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
