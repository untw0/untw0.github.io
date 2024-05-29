document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.querySelectorAll('.blog-post');

    blogPosts.forEach(post => {
        post.addEventListener('mouseover', () => {
            post.classList.add('hovered');
        });

        post.addEventListener('mouseout', () => {
            post.classList.remove('hovered');
        });
    });
});
