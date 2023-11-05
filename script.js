const blogPosts = document.getElementById("blogPosts");

function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postTitle = urlParams.get('post');

    if (!postTitle) {
        return;
    }

    fetch('posts.json')
        .then(response => response.json())
        .then(data => {
            const blogPost = document.getElementById('blog-post');
            const post = data.posts.find(p => p.title === postTitle);

            if (!post) {
                return;
            }

            blogPost.innerHTML = `
                <h2>${post.title}</h2>
                <img src="${post.coverImage}" alt="${post.title}">
            `;

            post.content.forEach(item => {
                if (item.type === 'paragraph') {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = item.text;
                    blogPost.appendChild(paragraph);
                } else if (item.type === 'image') {
                    const image = document.createElement('img');
                    image.src = item.url;
                    image.alt = item.caption;
                    const caption = document.createElement('p');
                    caption.textContent = item.caption;
                    if (item.type === 'image') {
                        caption.classList.add('caption');
                    }
                    blogPost.appendChild(image);
                    blogPost.appendChild(caption);
                }
            });
        });
}

function loadPosts() {
    fetch('posts.json')
        .then(response => response.json())
        .then(data => {
            const blogList = document.getElementById('blog-list');
            data.posts.forEach(post => {
                const postCard = document.createElement('div');
                postCard.classList.add('post-card');
                postCard.innerHTML = `
                    <img src="${post.coverImage}" alt="${post.title}">
                    <h2>${post.title}</h2>
                `;

                postCard.addEventListener('click', () => {
                    window.location.href = `post.html?post=${encodeURIComponent(post.title)}`;
                });

                blogList.appendChild(postCard);
            });
        });
}

if (window.location.pathname === '/post.html') {
    loadPost();
} else {
    loadPosts();
}
