const withMDX = require('@next/mdx')({
  extension: /\\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

module.exports = withMDX({
  pageExtensions: ['js','jsx','ts','tsx','md','mdx'],
  reactStrictMode: true,
  experimental: { appDir: true },
});
