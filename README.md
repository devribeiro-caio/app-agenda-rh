# Agenda RH

Sistema desktop em JavaScript, Node.js, MongoDB e Electron para organizar demandas de processos seletivos.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Copie `.env.example` para `.env` e ajuste a conexao do MongoDB se necessario.

3. Inicie o MongoDB local ou use uma URI do MongoDB Atlas.

4. Rode em modo desenvolvimento:

```bash
npm run dev
```

## Scripts

- `npm run dev`: inicia API e Electron.
- `npm run start`: inicia apenas a API.
- `npm run electron`: abre apenas o Electron.
- `npm run dist`: gera instalador usando Electron Builder.
