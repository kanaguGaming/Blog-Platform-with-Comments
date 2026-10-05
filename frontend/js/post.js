
// For creating, editing, and viewing a single post

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
    // Create Post
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        if(!getCurrentUser()) {
            window.location.href = 'login.html';
        }
        createPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const category = document.getElementById('category').value;
            const content = document.getElementById('content').value;

            try {
                const post = await apiRequest('/posts', {
                    method: 'POST',
                    body: { title, category, content }
                });
                showToast('Post published successfully!');
                setTimeout(() => window.location.href = `post.html?id=${post.id}`, 1000);
            } catch (error) {}
        });
    }

    // View Post
    const postContainer = document.getElementById('postContainer');
    if (postContainer && postId && !window.location.pathname.includes('edit-post.html')) {
        loadSinglePost();
    }

    // Edit Post form
    const editPostForm = document.getElementById('editPostForm');
    if (editPostForm && postId) {
        loadEditPostData();
        editPostForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('editTitle').value;
            const category = document.getElementById('editCategory').value;
            const content = document.getElementById('editContent').value;

            try {
                await apiRequest(`/posts/${postId}`, {
                    method: 'PUT',
                    body: { title, category, content }
                });
                showToast('Post updated successfully!');
                setTimeout(() => window.location.href = `post.html?id=${postId}`, 1000);
            } catch (error) {}
        });
    }
});

async function loadSinglePost() {
    try {
        const post = await apiRequest(`/posts/${postId}`);
        const user = getCurrentUser();
        const canEdit = user && (user.id === post.user_id || user.role === 'ADMIN');

        document.getElementById('postContainer').innerHTML = `
            <div class="post-content">
                <span class="badge" style="margin-bottom: 1rem; display: inline-block;">${post.category}</span>
                <h1 style="margin-bottom: 0.5rem;">${post.title}</h1>
                <div class="post-meta" style="margin-bottom: 2rem;">
                    By <strong>${post.author.name}</strong> on ${new Date(post.created_at).toLocaleDateString()}
                </div>
                <div style="white-space: pre-wrap; font-size: 1.1rem; margin-bottom: 2rem;">${post.content}</div>
                
                ${canEdit ? `
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 1rem;">
                        <a href="edit-post.html?id=${post.id}" class="btn">Edit</a>
                        <button onclick="deletePost(${post.id})" class="btn btn-danger">Delete</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Also setup comments area (which is handled by comments.js)
        if(typeof loadComments === 'function') {
            loadComments(postId);
            setupCommentForm(postId);
        }
    } catch (error) {
        document.getElementById('postContainer').innerHTML = '<p>Post not found.</p>';
    }
}

async function loadEditPostData() {
    try {
        const post = await apiRequest(`/posts/${postId}`);
        const user = getCurrentUser();
        if (!user || (user.id !== post.user_id && user.role !== 'ADMIN')) {
            showToast('Not authorized', 'error');
            window.location.href = 'index.html';
            return;
        }
        document.getElementById('editTitle').value = post.title;
        document.getElementById('editCategory').value = post.category;
        document.getElementById('editContent').value = post.content;
    } catch (error) {
        showToast('Error loading post', 'error');
    }
}

async function deletePost(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        await apiRequest(`/posts/${id}`, { method: 'DELETE' });
        showToast('Post deleted successfully');
        setTimeout(() => window.location.href = 'index.html', 1000);
    } catch (error) {}
}
