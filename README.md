LuaPaste — Pastebin-style server for Lua scripts
===============================================

Conteúdo do pacote:
- server.js         -> Node/Express server que recebe POST /paste e salva arquivos em /pastes
- package.json      -> Dependências e script de start
- web/index.html    -> Frontend simples para colar o código e gerar o link
- README.md         -> Este arquivo

Como usar (local):
1. Extraia os arquivos.
2. Instale dependências: `npm install`
3. Rode o servidor: `npm start`
4. Abra no navegador: `http://localhost:3000/` e cole seu script.
5. O servidor retornará um link do tipo: `http://localhost:3000/pastes/169...-a1b2c3d4e5f6.lua`

Segurança e notas:
- Este é um exemplo mínimo. Para uso real em produção, adicione:
  - Rate limiting (limitar quantidade de pastes por IP)
  - Proteção contra uploads abusivos (tamanho máximo, escanear conteúdo)
  - Autenticação, tokens ou CAPTCHAs, se necessário
  - Rotina de limpeza de arquivos antigos
- A pasta `pastes/` contém os arquivos .lua gerados.
- Não use para distribuir conteúdo ilegal ou violar termos de serviço.

Criado por ChatGPT — se quiser, posso também:
- Incluir um script para deletar pastes mais antigos automaticamente.
- Gerar um Dockerfile simples para rodar facilmente.