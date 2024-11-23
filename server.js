const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const basicAuth = require('basic-auth');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();

 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/pdfs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Banco de dados conectado'))
.catch(err => console.log('Erro ao conectar no banco de dados', err));


const authenticate = async (req, res, next) => {
  const user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return res.status(401).send('Acesso não autorizado');
  }

  const foundUser  = await User.findOne({ username: user.name });
  if (!foundUser  || !(await bcrypt.compare(user.pass, foundUser .password))) {
    return res.status(401).send('Credenciais inválidas');
  }
  next();
};


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); 
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf') {
    return cb(new Error('Apenas arquivos PDF são permitidos'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Nome de usuário e senha são obrigatórios');
  }

  const existingUser  = await User.findOne({ username });
  if (existingUser ) {
    return res.status(400).send('Usuário já existe');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send('Usuário criado com sucesso');
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Credenciais inválidas');
  }

  res.status(200).send('Login bem-sucedido');
});

app.post('/upload', authenticate, upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  res.send(`Arquivo ${req.file.originalname} foi enviado com sucesso!`);
});

app.get('/download/:filename', authenticate, (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath, req.params.filename, (err) => {
      if (err) {
        res.status(500).send('Erro ao tentar fazer o download do arquivo.');
      }
    });
  } else {
    res.status(404).send('Arquivo não encontrado.');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.delete('/delete/:filename', authenticate, (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);  
    res.status(200).send(`Arquivo ${req.params.filename} excluído com sucesso.`);
  } else {
    res.status(404).send('Arquivo não encontrado.');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});