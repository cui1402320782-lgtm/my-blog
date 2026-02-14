import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { User, Code, Heart, Mail, Github, Twitter, MapPin, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于',
  description: '关于我的博客和作者信息',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面头部 */}
      <div className="bg-gradient-to-b from-[var(--card)] to-[var(--background)] pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary)]/10 mb-6">
            <User className="w-8 h-8 text-[var(--primary)]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            关于我
          </h1>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
            一个热爱技术的开发者，喜欢分享和学习
          </p>
        </div>
      </div>

      {/* 内容区域 */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 左侧：个人信息卡片 */}
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 头像区域 */}
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  博
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-1">博客作者</h2>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">全栈开发者</p>
                
                <div className="flex items-center justify-center gap-3">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="mailto:your@email.com"
                    className="flex items-center justify-center w-9 h-9 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider">
                  基本信息
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">中国</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Code className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">Web 开发</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">2024 年开始</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：详细介绍 */}
          <div className="md:col-span-2 space-y-6">
            {/* 关于博客 */}
            <section className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
                  <Code className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">关于博客</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-[var(--muted-foreground)]">
                <p>
                  欢迎来到我的博客！这是一个基于 Next.js + MDX 构建的现代化博客系统。
                  我在这里记录学习历程，分享技术心得，探索前端开发、后端架构以及编程思维的方方面面。
                </p>
                <p>
                  博客采用静态生成（SSG）技术，具有快速加载、SEO 友好等特点。
                  内容使用 Markdown/MDX 编写，支持代码高亮、数学公式等特性。
                </p>
              </div>
            </section>

            {/* 技术栈 */}
            <section className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
                  <Code className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">技术栈</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Next.js',
                  'React',
                  'TypeScript',
                  'Tailwind CSS',
                  'MDX',
                  'Node.js',
                ].map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-2 px-3 py-2 bg-[var(--muted)] rounded-lg text-sm text-[var(--foreground)]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    {tech}
                  </div>
                ))}
              </div>
            </section>

            {/* 兴趣爱好 */}
            <section className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
                  <Heart className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">兴趣爱好</h2>
              </div>
              <div className="prose dark:prose-invert max-w-none text-[var(--muted-foreground)]">
                <p>
                  除了编程，我还喜欢阅读技术书籍、参与开源项目、探索新技术。
                  我相信持续学习是技术人的必修课，而这个博客就是我学习过程的见证。
                </p>
                <p>
                  欢迎通过邮件或社交媒体与我交流，期待与志同道合的朋友一起进步！
                </p>
              </div>
            </section>

            {/* 联系方式 */}
            <section className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
                  <Mail className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">联系方式</h2>
              </div>
              <p className="text-[var(--muted-foreground)] mb-4">
                如果您有任何问题或建议，欢迎通过以下方式联系我：
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:your@email.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Mail className="w-4 h-4" />
                  发送邮件
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
