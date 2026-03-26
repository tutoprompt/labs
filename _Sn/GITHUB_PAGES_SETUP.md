# Portfolio → GitHub Pages: Setup Guide

Este guia assume que você já tem os arquivos do portfolio prontos.

---

## Estrutura esperada

```
portfolio/
├── index.html
├── styles.css
├── script.js
└── Projects/
    ├── index.json
    ├── project-1.html
    ├── project-2.html
    └── project-3.html
```

---

## Passo 1 — Criar o repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Dê um nome ao repo (ex: `portfolio`)
3. Deixe **Public** (GitHub Pages gratuito só funciona em repos públicos no plano free)
4. **Não** marque "Add a README" — você vai enviar os arquivos manualmente
5. Clique em **Create repository**

---

## Passo 2 — Enviar os arquivos

### Opção A — Via terminal (recomendado)

```bash
cd portfolio

git init
git add .
git commit -m "first commit"

git branch -M main
git remote add origin https://github.com/SEU_USUARIO/portfolio.git
git push -u origin main
```

### Opção B — Via interface do GitHub

1. Na página do repo recém-criado, clique em **uploading an existing file**
2. Arraste todos os arquivos e a pasta `Projects/` para a área de upload
3. Clique em **Commit changes**

> ⚠️ Pelo upload manual, o GitHub não preserva subpastas automaticamente.
> Prefira o terminal ou o GitHub Desktop para garantir que `Projects/` suba corretamente.

---

## Passo 3 — Ativar o GitHub Pages

1. No repositório, vá em **Settings** → **Pages** (menu lateral esquerdo)
2. Em **Source**, selecione:
   - Branch: `main`
   - Folder: `/ (root)`
3. Clique em **Save**
4. Aguarde ~1 minuto. A URL do seu portfolio aparecerá no topo da seção Pages:

```
https://SEU_USUARIO.github.io/portfolio/
```

---

## Passo 4 — Adicionar novos projetos no futuro

1. Coloque o novo arquivo `.html` dentro de `Projects/`
2. Edite `Projects/index.json` adicionando o nome do arquivo:

```json
[
  "project-1.html",
  "project-2.html",
  "project-3.html",
  "meu-novo-projeto.html"
]
```

3. Faça o commit e push:

```bash
git add .
git commit -m "add meu-novo-projeto"
git push
```

O GitHub Pages atualiza automaticamente em ~1 minuto após cada push.

---

## Observações importantes

| Item | Detalhe |
|------|---------|
| **iframes no Pages** | Projetos dentro de `Projects/` carregam normalmente — estão no mesmo domínio |
| **HTTPS** | GitHub Pages força HTTPS, o que é compatível com o `fetch()` do `script.js` |
| **Domínio customizado** | Pode ser configurado em Settings → Pages → Custom domain |
| **Repo privado** | Requer plano pago para ter Pages ativo |

---

## Dica: GitHub Desktop (alternativa visual ao terminal)

Se preferir não usar o terminal:
1. Baixe [desktop.github.com](https://desktop.github.com)
2. Clone ou crie o repo pelo app
3. Copie os arquivos para a pasta local do repo
4. O app detecta as mudanças — basta escrever uma mensagem de commit e clicar **Push origin**
