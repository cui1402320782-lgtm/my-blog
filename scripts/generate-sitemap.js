const fs = require('fs');
const path = require('path');
const { getAllPosts } = require('../blog/lib/posts');
const baseUrl = process.env.BASE_URL || 'https://example.com';
const posts = getAllPosts();
const urls = posts.map(p => `<url><loc>${baseUrl}/blog/${p.slug}</loc><lastmod>${p.date}</lastmod></url>`).join('');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemap);
