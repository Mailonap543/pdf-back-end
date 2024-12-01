# Projeto de Upload de pdfs e Gerenciamento de Arquivos

Este é um projeto simples de um servidor web utilizando Node.js e Express, que permite o upload, download e exclusão de arquivos, além de funcionalidades básicas de cadastro de usuários.

## Funcionalidades

- Página de login
- Página de cadastro
- Upload de arquivos
- Download de arquivos
- Exclusão de arquivos
- Armazenamento de dados de usuários (simulado)

## Tecnologias Utilizadas

- Node.js
- Express
- Multer (para upload de arquivos)
- fs (sistema de arquivos)
- path (manipulação de caminhos de arquivos)

## Estrutura de Diretórios
/projeto │ ├── /public │ ├── login.html │ └── cadastro.html │ ├── /uploads │ └── (arquivos enviados) │ ├── server.js └── package.json


Verify

Open In Editor
Edit
Copy code

## Pré-requisitos

- Node.js (versão 12 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://seu-repositorio.git
   cd projeto
Instale as dependências:
npm install
Execução
Para iniciar o servidor, execute o seguinte comando:
node server.js
O servidor estará rodando na porta 3000 (ou na porta especificada na variável de ambiente PORT).

Rotas Disponíveis
1. Página de Login
GET /login
Retorna a página de login.
2. Página de Cadastro
GET /cadastro
Retorna a página de cadastro.
3. Cadastro de Usuário
POST /cadastro
Recebe os dados do usuário e simula o armazenamento (atualmente apenas loga os dados no console).
4. Upload de Arquivos
POST /upload
Envia um arquivo para o servidor.
O arquivo deve ser enviado com o campo file.
5. Download de Arquivos
GET /download/:filename
Faz o download do arquivo especificado.
6. Exclusão de Arquivos
DELETE /delete/:filename
Exclui o arquivo especificado do servidor.
Observações
Os arquivos enviados são armazenados no diretório uploads.
O tamanho máximo para uploads é de 5MB.
Apenas arquivos com as extensões jpeg, jpg, png, gif e pdf são aceitos.
Contribuição
Sinta-se à vontade para contribuir com melhorias ou correções. Faça um fork do repositório e envie suas pull requests.


### Instruções para Uso

1. **Clone o Repositório**:(https://github.com/Mailonap543/pdf-back-end)


