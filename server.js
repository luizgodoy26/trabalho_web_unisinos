const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

function readPosts() {
    try {
        const data = fs.readFileSync('posts.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler o arquivo posts.json:', error);
        return [];
    }
}

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

app.get('/api/posts', (req, res) => {
    const posts = readPosts();
    res.json(posts);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
