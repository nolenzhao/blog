// Blog configuration
const BLOG_CONFIG = {
    postsDirectory: 'posts/',
    postsPerPage: 10,
    dateFormat: 'en-US'
};

// List of all blog posts (add new posts here)
// Supports both .json and .md files
const blogPosts = [
    'react-hooks-guide.md',
    'example-post.md',
    'type_states.json'
];

/**
 * Load and display all blog posts
 */
async function loadBlogPosts() {
    const postsContainer = document.getElementById('blog-posts');
    
    try {
        console.log('Loading posts:', blogPosts);
        
        // Load all posts
        const posts = await Promise.all(
            blogPosts.map(filename => loadPost(filename))
        );
        
        console.log('Loaded posts:', posts);
        
        // Filter out null posts
        const validPosts = posts.filter(post => post !== null);
        
        if (validPosts.length === 0) {
            postsContainer.innerHTML = '<p>No blog posts available yet.</p>';
            return;
        }
        
        // Sort by date (newest first)
        validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display posts
        validPosts.forEach(post => {
            postsContainer.appendChild(createPostElement(post));
        });
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        postsContainer.innerHTML = '<p>Error loading blog posts: ' + error.message + '</p>';
    }
}

/**
 * Load a single post from JSON or Markdown file
 */
async function loadPost(filename) {
    try {
        const response = await fetch(`${BLOG_CONFIG.postsDirectory}${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }
        
        // Check if it's a markdown file
        if (filename.endsWith('.md')) {
            const text = await response.text();
            return parseMarkdownPost(text);
        } else {
            return await response.json();
        }
    } catch (error) {
        console.error(`Error loading post ${filename}:`, error);
        return null;
    }
}

/**
 * Parse a markdown file with frontmatter
 */
function parseMarkdownPost(text) {
    // Extract frontmatter (YAML between --- markers)
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontmatterRegex);
    
    if (!match) {
        console.error('Invalid markdown format: missing frontmatter');
        return null;
    }
    
    const frontmatter = match[1];
    const markdown = match[2];
    
    // Parse frontmatter (simple key: value parser)
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Parse arrays (tags)
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
            }
            
            metadata[key] = value;
        }
    });
    
    // Convert markdown to HTML using marked.js
    const content = typeof marked !== 'undefined' && marked.parse 
        ? marked.parse(markdown) 
        : markdown; // Fallback if marked not loaded
    
    return {
        title: metadata.title || 'Untitled',
        date: metadata.date || new Date().toISOString().split('T')[0],
        author: metadata.author || 'Anonymous',
        tags: metadata.tags || [],
        content: content
    };
}

/**
 * Create HTML element for a blog post
 */
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post';
    
    // Format date
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString(BLOG_CONFIG.dateFormat, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Build HTML
    article.innerHTML = `
        <h2>${escapeHtml(post.title)}</h2>
        <div class="meta">
            <span>📅 ${formattedDate}</span>
            <span>✍️ ${escapeHtml(post.author)}</span>
        </div>
        <div class="content">
            ${post.content}
        </div>
        ${createTagsHTML(post.tags)}
    `;
    
    return article;
}

/**
 * Create HTML for tags
 */
function createTagsHTML(tags) {
    if (!tags || tags.length === 0) return '';
    
    const tagElements = tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}</span>`
    ).join('');
    
    return `<div class="tags">${tagElements}</div>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);
