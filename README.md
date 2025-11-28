# Tech Blog

A simple, modular blog website for technical content. No build tools required - just edit JSON files to add new posts!

## 🚀 Getting Started

Your blog is hosted on GitHub Pages! 

**Live URL:** `https://<your-github-username>.github.io/blog/`

### Testing Locally (Optional)

To preview changes before pushing:
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server
```

Then visit `http://localhost:8000` in your browser

## ✍️ Adding New Blog Posts

Adding a new post is super easy - just write in **Markdown**!

### Quick Start

1. **Create a new `.md` file** in the `posts/` directory (e.g., `my-new-post.md`)

2. **Use this template:**
   ```markdown
   ---
   title: Your Post Title
   date: 2025-11-28
   author: Your Name
   tags: [Tag1, Tag2, Tag3]
   ---

   ### Your First Section

   Write your content here using regular Markdown!

   **Bold text**, *italic text*, and `code` all work perfectly.

   ```python
   # Code blocks too!
   def example():
       return "Easy!"
   ```
   ```

3. **Add the filename to `blog.js`:**
   ```javascript
   const blogPosts = [
       'my-new-post.md',  // Add your new post here
       'example-post.md'
   ];
   ```

4. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Add new blog post"
   git push
   ```

5. **Wait ~1 minute** for GitHub Pages to rebuild - your post is live!

### JSON Format (Still Supported)

You can also use JSON if you prefer:
```json
{
    "title": "Your Post Title",
    "date": "2025-11-28",
    "author": "Your Name",
    "tags": ["Tag1", "Tag2"],
    "content": "<h3>Section</h3><p>HTML content here...</p>"
}
```

## 📝 Writing Content

### Markdown Format (Recommended!)

Markdown is clean and simple. Here's what you can use:

#### Headings
```markdown
### Section Title
#### Subsection
```

#### Text Formatting
```markdown
**bold text**
*italic text*
`inline code`
```

#### Code Blocks
````markdown
```python
def hello():
    print("Hello, world!")
```
````

#### Lists
```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item
```

#### Links & Images
```markdown
[Link text](https://example.com)
![Alt text](image-url.jpg)
```

#### Blockquotes
```markdown
> This is a quote or important note
```

### JSON Format (Legacy)

The `content` field supports HTML. Here are some useful patterns:

#### Headings
```html
<h3>Section Title</h3>
```

#### Paragraphs
```html
<p>Your paragraph text here.</p>
```

#### Code Blocks
```html
<pre><code>function hello() {
    console.log("Hello, world!");
}</code></pre>
```

#### Inline Code
```html
<p>Use the <code>fetch()</code> function to make requests.</p>
```

#### Lists
```html
<ul>
    <li>First item</li>
    <li>Second item</li>
</ul>
```

#### Links
```html
<a href="https://example.com">Link text</a>
```

#### Blockquotes
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

Your blog is already deployed on **GitHub Pages**! Every time you push changes, your site updates automatically.

### Initial Setup (Already Done!)

The repository is set up. Now you just need to:

1. **Create the GitHub repository:**
   - Go to [github.com/new](https://github.com/new)
   - Name it `blog`
   - Make it public
   - Don't initialize with README (we already have files)

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/<your-username>/blog.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**

4. **Access your blog:**
   - Wait 1-2 minutes for deployment
   - Visit `https://<your-username>.github.io/blog/`

### Publishing New Posts

1. Create your post JSON file in `posts/`
2. Update the `blogPosts` array in `blog.js`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Add new post"
   git push
   ```
4. Your changes go live automatically!

### Custom Domain (Optional)

Want a custom domain like `blog.yourdomain.com`?
1. Add a `CNAME` file with your domain
2. Configure DNS settings with your domain provider
3. See [GitHub Pages custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 📄 License

Free to use and modify as you wish. Happy blogging! 🎉
