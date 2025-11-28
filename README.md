# Tech Blog

A simple, modular blog website for technical content. No build tools required - just edit JSON files to add new posts!

## 🚀 Getting Started

1. Open `index.html` in your browser, or serve it with any static server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (install http-server globally first)
   npx http-server
   ```

2. Visit `http://localhost:8000` in your browser

## ✍️ Adding New Blog Posts

Adding a new post is super easy:

1. **Create a new JSON file** in the `posts/` directory (e.g., `my-new-post.json`)

2. **Use this template:**
   ```json
   {
       "title": "Your Post Title",
       "date": "2025-11-28",
       "author": "Your Name",
       "tags": ["Tag1", "Tag2", "Tag3"],
       "content": "<h3>Section Title</h3><p>Your content here...</p>"
   }
   ```

3. **Add the filename to `blog.js`:**
   ```javascript
   const blogPosts = [
       'docker-intro.json',
       'javascript-closures.json',
       'rest-api-best-practices.json',
       'my-new-post.json'  // Add your new post here
   ];
   ```

4. **Refresh your browser** - that's it!

## 📝 Writing Content

The `content` field supports HTML. Here are some useful patterns:

### Headings
```html
<h3>Section Title</h3>
```

### Paragraphs
```html
<p>Your paragraph text here.</p>
```

### Code Blocks
```html
<pre><code>function hello() {
    console.log("Hello, world!");
}</code></pre>
```

### Inline Code
```html
<p>Use the <code>fetch()</code> function to make requests.</p>
```

### Lists
```html
<ul>
    <li>First item</li>
    <li>Second item</li>
</ul>
```

### Links
```html
<a href="https://example.com">Link text</a>
```

### Blockquotes
```html
<blockquote>This is a quote or important note.</blockquote>
```

## 🎨 Customizing the Look

All styling is controlled through CSS variables in `styles.css`. Change these to customize colors:

```css
:root {
    --primary-color: #2c3e50;      /* Header & titles */
    --secondary-color: #3498db;     /* Links & accents */
    --accent-color: #e74c3c;        /* Highlights */
    --text-color: #333;             /* Body text */
    --bg-color: #f4f4f4;            /* Page background */
    --card-bg: #ffffff;             /* Post card background */
}
```

### Changing the Blog Title

Edit `index.html`:
```html
<h1>Your Blog Name</h1>
<p class="tagline">Your custom tagline</p>
```

Also update the `<title>` tag in the `<head>` section.

## 📁 File Structure

```
blog/
├── index.html          # Main page
├── styles.css          # All styling (modular with CSS variables)
├── blog.js            # Loads and displays posts
├── posts/             # Your blog posts
│   ├── docker-intro.json
│   ├── javascript-closures.json
│   └── rest-api-best-practices.json
└── README.md          # This file
```

## 🔧 Advanced Customization

### Changing Posts Per Page
In `blog.js`, modify the `BLOG_CONFIG` object:
```javascript
const BLOG_CONFIG = {
    postsPerPage: 10,  // Change this number
    // ...
};
```

### Changing Date Format
```javascript
const BLOG_CONFIG = {
    dateFormat: 'en-US'  // Try 'en-GB', 'fr-FR', etc.
};
```

### Modifying Post Layout
Edit the `createPostElement()` function in `blog.js` to change how posts are displayed.

### Adding Custom Styling
Add your own CSS rules at the bottom of `styles.css` - they'll override the defaults.

## 💡 Tips

- **Keep it simple:** Focus on writing content, not wrestling with the code
- **Test locally:** Always preview changes with a local server before deploying
- **Backup posts:** Keep copies of your JSON files somewhere safe
- **Valid JSON:** Use a JSON validator if you get errors (jsonlint.com)
- **Escape HTML:** Special characters in JSON strings need to be escaped (`\"` for quotes)

## 🚢 Deployment

Deploy to any static hosting service:

- **GitHub Pages:** Push to a repo and enable Pages
- **Netlify:** Drag and drop your folder
- **Vercel:** Connect your git repository
- **Any web host:** Upload via FTP/SFTP

No build process needed!

## 📄 License

Free to use and modify as you wish. Happy blogging! 🎉
