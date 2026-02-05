# Deploy Guide - VitePress com GitHub Pages

## Arquitetura

O projeto usa duas branches:

- **main**: Contém os arquivos `.md` (sources) e configuração do VitePress
- **gh-pages**: Contém apenas os arquivos HTML/CSS/JS gerados (build output)

GitHub Pages é configurado para servir da branch `gh-pages`.

## Workflow de Deploy

### Opção 1: Deploy Automático (Recomendado)

```bash
npm run deploy
```

Isso executa:
1. `npm run docs:build` - Gera HTML em dist/ e copia para docs/
2. Commita na branch gh-pages
3. Push para origin/gh-pages

### Opção 2: Deploy Manual

```bash
# 1. Build local
npm run docs:build

# 2. Navegar até o diretório de build
cd docs/.vitepress/dist

# 3. Copiar conteúdo para gh-pages (git faz isso automaticamente via copy-dist.js)

# 4. Commit e push
git add -A
git commit -m "Deploy: $(date)"
git push origin gh-pages
```

## Editando Conteúdo

1. **Editar arquivo markdown**:
   ```bash
   # Ex: Editar guia de clientes
   code docs/clientes/como-registrar-cliente.md
   ```

2. **Testar localmente**:
   ```bash
   npm run docs:dev
   # Acessa http://localhost:5173/anduril-docs/
   ```

3. **Build e deploy**:
   ```bash
   npm run deploy
   ```

## Estrutura de Arquivos

```
project/
├── docs/                      # Pasta de conteúdo e build
│   ├── .vitepress/
│   │   ├── config.js         # Configuração VitePress
│   │   └── dist/             # Saída do build (temporária)
│   ├── index.md              # Homepage
│   ├── clientes/             # Módulo clientes
│   │   ├── index.md
│   │   ├── como-registrar-cliente.md
│   │   └── status-clientes.md
│   └── [outros módulos]/
├── copy-dist.js              # Script que copia dist → docs
├── package.json
└── .gitignore
```

## Branches no Git

### Main (Source Code)
- Contém: `.md` files e `config.js`
- Não contém: `.html`, `.js`, `.css`, `assets/`
- Histórico: Completo do projeto

### gh-pages (Build Output)
- Contém: Tudo que está em `docs/.vitepress/dist/`
- Estrutura: HTML em raiz, assets/ em subpasta
- Histórico: Apenas dos últimos builds
- Atualizada por: `npm run deploy`

## Configuração GitHub Pages

No repositório GitHub:
1. Ir em Settings → Pages
2. Source: Deploy from a branch
3. Branch: **gh-pages**
4. Folder: **(root)**
5. Save

Site será publicado em: `https://teecoleonard.github.io/anduril-docs/`

## Troubleshooting

### Site mostra 404
- Verificar se branch `gh-pages` tem arquivos HTML
- Confirmar que GitHub Pages aponta para `gh-pages`
- Aguardar 30-60 segundos após deploy

### Mudanças não aparecem
- Limpar cache do navegador (Ctrl+Shift+Del)
- Verificar se `npm run deploy` foi executado com sucesso
- Checar branch `gh-pages` para confirmar novo commit

### Como reverter um deploy
```bash
git checkout gh-pages
git log --oneline
git revert <commit-hash>
git push origin gh-pages
```

## Notas Importantes

- ✅ Editar `.md` files em `docs/`
- ✅ Rodar `npm run deploy` após edições
- ✅ Nunca commitar `.html` na branch main
- ❌ Não editar `dist/` (é gerado automaticamente)
- ❌ Não commitar `node_modules/` (`.gitignore` cuida disso)
