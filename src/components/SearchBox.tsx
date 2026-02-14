'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { Search, X } from 'lucide-react'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  date: string
}

export function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [posts, setPosts] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 加载搜索索引
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('加载搜索索引失败:', err))
  }, [])

  // 处理搜索
  useEffect(() => {
    if (!query || query.length < 2 || posts.length === 0) {
      setResults([])
      return
    }

    const fuse = new Fuse(posts, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'excerpt', weight: 0.1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    })

    const searchResults = fuse.search(query.trim())
    setResults(searchResults.map((result) => result.item))
  }, [query, posts])

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 键盘快捷键
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索文章... (Ctrl+K)"
          className="w-full pl-10 pr-10 py-2 border rounded-lg bg-white dark:bg-gray-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     text-sm"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 
                        border rounded-lg shadow-lg z-50 max-h-96 overflow-auto"
        >
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <Link
                  key={result.slug}
                  href={`/blog/${result.slug}`}
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 
                           transition-colors border-b last:border-0"
                  onClick={() => {
                    setIsOpen(false)
                    setQuery('')
                  }}
                >
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {result.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {result.excerpt}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(result.date).toLocaleDateString('zh-CN')}
                  </span>
                </Link>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              未找到相关文章
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
