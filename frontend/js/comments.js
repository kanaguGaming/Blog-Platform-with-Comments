
async function loadComments(postId) {
    const container = document.getElementById('commentsContainer');
    if(!container) return;

    try {
        const comments = await apiRequest(`/posts/${postId}/comments`);
        const user = getCurrentUser();

        if (comments.length === 0) {
            container.innerHTML = '<p>No comments yet. Start the conversation.</p>';
            return;
        }

        container.innerHTML = comments.map(comment => {
            const canEdit = user && (user.id === comment.user_id || user.role === 'ADMIN');
            return `
                <div class="comment">
                    <div class="post-meta" style="margin-bottom: 0.5rem; font-weight:bold;">
                        ${comment.author.name} | ${new Date(comment.created_at).toLocaleString()}
                    </div>
                    <p>${comment.content}</p>
                    ${canEdit ? `
                        <div style="margin-top: 0.5rem;">
                            <button onclick="deleteComment(${comment.id}, ${postId})" class="btn btn-danger" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Delete</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<p>Error loading comments.</p>';
    }
}

function setupCommentForm(postId) {
    const container = document.getElementById('commentFormContainer');
    if(!container) return;

    const user = getCurrentUser();
    if (user) {
        container.innerHTML = `
            <form id="addCommentForm">
                <textarea id="commentContent" class="form-control" rows="3" placeholder="Write a comment..." required></textarea>
                <button type="submit" class="btn" style="margin-top: 0.5rem;">Post Comment</button>
            </form>
        `;

        document.getElementById('addCommentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = document.getElementById('commentContent').value;
            try {
                await apiRequest(`/posts/${postId}/comments`, {
                    method: 'POST',
                    body: { content }
                });
                showToast('Comment added successfully!');
                document.getElementById('commentContent').value = '';
                loadComments(postId);
            } catch (error) {}
        });
    } else {
        container.innerHTML = '<p><a href="login.html">Login</a> to join the discussion.</p>';
    }
}

async function deleteComment(commentId, postId) {
    if (!confirm('Delete this comment?')) return;
    try {
        await apiRequest(`/comments/${commentId}`, { method: 'DELETE' });
        showToast('Comment deleted successfully');
        loadComments(postId);
    } catch (error) {}
}
