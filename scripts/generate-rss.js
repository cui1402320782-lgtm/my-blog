const fs = require('fs');
const path = require('path');
const { getAllPosts } = require('../blog/lib/posts');
const baseUrl = process.env.BASE_URL || 'https://example.com';
const posts = getAllPosts();
const rssItems = posts.map(p => `<item><title><![CDATA[${p.title}]]></title><link>${baseUrl}/blog/${p.slug}</link><pubDate>${new Date(p.date).toUTCString()}</pubDate><description><![CDATA[${p.excerpt ?? ''}]]></description></item>`).join('');
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog RSS</title>
    <link>${baseUrl}</link>
    <description>My Next.js Blog RSS</description>
    ${rssItems}
  </channel>
</rss>`;
fs.writeFileSync(path.join(__dirname, '../public/rss.xml'), rss);
