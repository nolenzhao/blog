# Nolen Zhao's Blog

A technical blog built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme.

## 🚀 Live Site

Visit the blog at: **https://nolenzhao.github.io/blog/**

## ✍️ Writing New Posts

### Quick Start

Create a new post with Hugo:

```bash
hugo new content/posts/my-new-post.md
```

This creates a new file with frontmatter already set up.

### Manual Creation

Create a file in `content/posts/` with this format:

```markdown
---
title: "My Awesome Post"
date: 2025-12-13
draft: false
tags: ["tech", "tutorial"]
author: "Nolen Zhao"
description: "A brief description of your post"
---

## Your Content Here

Write your post in Markdown!

### Code Examples

```python
def hello():
    print("Hello, World!")
```

```

### Frontmatter Fields

- **title**: Post title
- **date**: Publication date (YYYY-MM-DD)
- **draft**: Set to `false` to publish, `true` to keep as draft
- **tags**: Array of tags for categorization
- **author**: Your name
- **description**: Short summary for SEO and previews

## 🛠️ Local Development

### Prerequisites

- Hugo extended version (already installed via snap)

### Run Locally

```bash
hugo server -D
```

Visit http://localhost:1313/blog/

The `-D` flag shows draft posts. Remove it to see only published posts.

## 📦 Deployment

The site automatically deploys to GitHub Pages via GitHub Actions when you push to `main`.

### Manual Deployment

1. Write your post
2. Set `draft: false` in frontmatter
3. Commit and push:

```bash
git add .
git commit -m "Add new post"
git push
```

4. GitHub Actions builds and deploys automatically (~1-2 minutes)

## 🎨 Theme Customization

The theme is configured in `hugo.toml`. Key settings:

- **baseURL**: Your site URL
- **title**: Site title
- **params**: Theme-specific options
  - Code highlighting
  - Reading time
  - Table of contents
  - Social links

Edit `hugo.toml` to customize colors, features, and behavior.

## 📁 Project Structure

```
blog/
├── content/
│   └── posts/           # Your blog posts (Markdown)
├── themes/
│   └── PaperMod/        # Hugo theme
├── static/              # Static assets (images, etc.)
├── .github/
│   └── workflows/
│       └── hugo.yml     # GitHub Actions deployment
├── hugo.toml            # Hugo configuration
└── README.md
```

## 🔧 Advanced Usage

### Add Images

1. Place images in `static/images/`
2. Reference in posts:

```markdown
![Alt text](/blog/images/my-image.png)
```

### Custom CSS

Create `assets/css/extended/custom.css` to add custom styles.

### Analytics

Add analytics by editing the `hugo.toml` params section.

## 📝 Tips

- Posts are sorted by date (newest first)
- Use tags to organize content
- Code blocks support syntax highlighting for many languages
- Math equations supported via KaTeX (if needed)

## 🐛 Troubleshooting

**Posts not showing?**
- Check `draft: false` in frontmatter
- Ensure date is not in the future

**Theme not loading?**
- Verify `theme = 'PaperMod'` in `hugo.toml`
- Check theme is in `themes/PaperMod/`

**Build failing on GitHub?**
- Check GitHub Actions logs
- Verify `hugo.yml` workflow file exists

## 📄 License

Content is yours. Theme is MIT licensed.

---

Built with ❤️ using Hugo and PaperMod
