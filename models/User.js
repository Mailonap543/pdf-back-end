const express = require('express');
const path = require('path');
const multer = require('multer'); 
const fs = require('fs'); 

const app = express();

// Verifica se o diretório 'uploads' existe, se não, cria
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const upload = multer({ 
    dest: uploadsDir,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para uploads
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|pdf/; // Tipos de arquivos permitidos
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Erro: Tipo de arquivo não suportado!');
    }
});

// Middleware para processar dados de formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define o diretório público para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'), (err) => {
        if (err) {
            console.error(err);
            res.status(err.status).end();
        }
    });
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'), (err) => {
        if (err) {
            console.error(err);
            res.status(err.status).end();
        }
    });
});

// Rota para cadastrar um novo usuário (POST)
app.post('/cadastro', (req, res) => {
    // Aqui você deve adicionar a lógica para armazenar o novo usuário no banco de dados
    console.log('Usuário cadastrado:', req.body);
    res.status(201).send('Usuário cadastrado com sucesso!');
});

// Rota para deletar um arquivo
app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao deletar o arquivo.');
        }
        res.send('Arquivo deletado com sucesso!');
    });
});

// Rota para download de um arquivo
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Arquivo não encontrado.');
        }
    });
});

// Rota para upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo foi enviado.');
    }
    res.send('Arquivo enviado com sucesso: ' + req.file.filename);
});

// Inicie o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});