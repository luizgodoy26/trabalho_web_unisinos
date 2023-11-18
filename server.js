const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;


// Busca arquivos estáticos na pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));


// Lê os posts a partir do arquivo 'posts.json'
function readPosts() {
    try {
        const data = fs.readFileSync('posts.json', 'utf-8');
        const parsedData = JSON.parse(data);

        if (parsedData && Array.isArray(parsedData.posts)) {
            return parsedData.posts;
        } else {
            console.error('O conteúdo de posts.json não é um objeto válido ou não possui a propriedade "posts".');
            return [];
        }
    } catch (error) {
        console.error('Erro ao ler o arquivo posts.json:', error);
        return [];
    }
}


// Endpoint para obter um post específico com base no título
app.get('/api/posts/:title', (req, res) => {
    const title = req.params.title;
    const posts = readPosts();
    const post = posts.find(post => post.title === title);

    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post não encontrado' });
    }
});


// Endpoint para obter todos os posts
app.get('/api/posts', (req, res) => {
    const posts = readPosts();
    res.json({ posts });
});


// Endpoint para adicionar comentários a um post específico
app.post('/api/posts/:title/comments', express.json(), (req, res) => {
    const title = req.params.title;
    const { author, text } = req.body;

    if (!author || !text) {
        return res.status(400).json({ error: 'Author and text are required fields.' });
    }

    const posts = readPosts();
    const postIndex = posts.findIndex(post => post.title === title);

    if (postIndex !== -1) {
        const newComment = { author, text };
        posts[postIndex].comments.push(newComment);

        // Atualiza o arquivo posts.json com o comentá´[rio
        fs.writeFileSync('posts.json', JSON.stringify({ posts }));

        res.json(newComment);
    } else {
        res.status(404).json({ error: 'Post não encontrado' });
    }
});


// Inicia o server
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
