
async function loadPosts(search = '', category = '') {
    const container = document.getElementById('postsContainer');
    if(!container) return;
    
    container.innerHTML = '<p>Loading posts...</p>';
    try {
        let url = '/posts?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (category) url += `category=${encodeURIComponent(category)}`;
        
        const posts = await apiRequest(url);
        
        if (posts.length === 0) {
            container.innerHTML = '<p>No posts found. Be the first person to share something!</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-content">
                    <h3 style="margin-bottom: 0.5rem;">${post.title}</h3>
                    <div class="post-meta">
                        By ${post.author.name} | ${new Date(post.created_at).toLocaleDateString()}
                        <span class="badge" style="float: right;">${post.category}</span>
                    </div>
                    <p style="margin-bottom: 1rem; color: #4b5563;">
                        ${post.content.substring(0, 100)}...
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.875rem; color: #6b7280;">💬 ${post.comments ? post.comments.length : 0} Comments</span>
                        <a href="post.html?id=${post.id}" class="btn" style="padding: 0.5rem 1rem;">Read More</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p>Error loading posts.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('postsContainer')) {
        loadPosts();

        const searchBtn = document.getElementById('searchBtn');
        if(searchBtn) {
            searchBtn.addEventListener('click', () => {
                const search = document.getElementById('searchInput').value;
                const category = document.getElementById('categoryFilter').value;
                loadPosts(search, category);
            });
        }
        
        const categoryFilter = document.getElementById('categoryFilter');
        if(categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                const search = document.getElementById('searchInput').value;
                const category = document.getElementById('categoryFilter').value;
                loadPosts(search, category);
            });
        }
    }
});
