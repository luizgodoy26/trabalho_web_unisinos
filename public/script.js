const blogPosts = document.getElementById("blogPosts");

function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postTitle = urlParams.get('post');

    if (!postTitle) {
        return;
    }

    fetch(`/api/posts/${postTitle}`)
        .then(response => response.json())
        .then(post => {
            const blogPost = document.getElementById('blog-post');

            // Limpe o conteúdo existente no elemento
            blogPost.innerHTML = '';

            // Renderize o título e a imagem do post
            const postHeader = document.createElement('div');
            postHeader.innerHTML = `
                <h2>${post.title}</h2>
                <img src="${post.coverImage}" alt="${post.title}">
            `;
            blogPost.appendChild(postHeader);

            // Renderize o conteúdo do post
            post.content.forEach(item => {
                const element = createElementForItem(item);
                if (element) {
                    blogPost.appendChild(element);
                }
            });

            // Adicione um formulário para adicionar novos comentários
            const commentForm = createCommentForm(postTitle);
            blogPost.appendChild(commentForm);

            // Renderize os comentários
            const commentsSection = document.createElement('div');
            commentsSection.classList.add('comments-section');
            commentsSection.innerHTML = '<h3>Comentários</h3>';

            post.comments.forEach(comment => {
                const commentElement = createCommentElement(comment);
                commentsSection.appendChild(commentElement);
            });

            blogPost.appendChild(commentsSection);

            // Restante do código...
        });
}

// Função auxiliar para criar elementos com base no tipo do item
function createElementForItem(item) {
    if (item.type === 'paragraph') {
        const paragraph = document.createElement('p');
        paragraph.textContent = item.text;
        return paragraph;
    } else if (item.type === 'image') {
        const image = document.createElement('img');
        image.src = item.url;
        image.alt = item.caption;
        const caption = document.createElement('p');
        caption.textContent = item.caption;
        if (item.type === 'image') {
            caption.classList.add('caption');
        }
        const container = document.createElement('div');
        container.appendChild(image);
        container.appendChild(caption);
        return container;
    }

    return null;
}

// Função auxiliar para criar o formulário de comentários
function createCommentForm(postTitle) {
    const commentForm = document.createElement('form');
    commentForm.innerHTML = `
        <h4>Adicionar Comentário</h4>
        <label for="author">Autor:</label>
        <input type="text" id="author" name="author" required>
        <label for="text">Comentário:</label>
        <textarea id="text" name="text" required></textarea>
        <button type="submit">Enviar Comentário</button>
    `;

    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const author = document.getElementById('author').value;
        const text = document.getElementById('text').value;

        // Envie o novo comentário para o servidor
        fetch(`/api/posts/${postTitle}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ author, text }),
        })
        .then(response => response.json())
        .then(newComment => {
            // Adicione o novo comentário à seção de comentários
            const commentElement = createCommentElement(newComment);
            const commentsSection = document.querySelector('.comments-section');
            commentsSection.appendChild(commentElement);

            // Limpe o formulário
            commentForm.reset();
        });
    });

    return commentForm;
}

// Função auxiliar para criar elementos de comentários
function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
        <p><strong>${comment.author}:</strong> ${comment.text}</p>
    `;
    return commentElement;
}


const blogList = document.getElementById("blog-list");

function loadPosts() {
    fetch('/api/posts')
        .then(response => response.json())
        .then(data => {
            console.log('Posts carregados:', data); // Adicione esta linha para depurar

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
        })
        .catch(error => {
            console.error('Erro ao carregar posts:', error); // Adicione esta linha para depurar
        });
}


if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    loadPosts();
} else if (window.location.pathname === '/post.html') {
    loadPost();
}

