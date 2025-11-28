// Blog configuration
const BLOG_CONFIG = {
    postsDirectory: 'posts/',
    postsPerPage: 10,
    dateFormat: 'en-US'
};

// List of all blog posts (add new posts here)
const blogPosts = [
    // 'docker-intro.json',
    // 'javascript-closures.json',
    // 'rest-api-best-practices.json'
];

/**
 * Load and display all blog posts
 */
async function loadBlogPosts() {
    const postsContainer = document.getElementById('blog-posts');
    
    try {
        // Load all posts
        const posts = await Promise.all(
            blogPosts.map(filename => loadPost(filename))
        );
        
        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display posts
        posts.forEach(post => {
            if (post) {
                postsContainer.appendChild(createPostElement(post));
            }
        });
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        postsContainer.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
    }
}

/**
 * Load a single post from JSON file
 */
async function loadPost(filename) {
    try {
        const response = await fetch(`${BLOG_CONFIG.postsDirectory}${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading post ${filename}:`, error);
        return null;
    }
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
