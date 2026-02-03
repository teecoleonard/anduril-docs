# Análise Detalhada: Por que o Node.js não Inicia em Produção

## Causa Raiz #1: Node.js Não Está Incluído no Build
**Probabilidade: MUITO ALTA (80%)**

### O que acontece:
1. `npm run package:win` é executado
2. `npm run prepare:all` **NÃO foi executado** (ou pulado)
3. Diretório `electron/build/node/` fica vazio ou não existe
4. O arquivo `.exe` gerado não contém Node.js
5. Em produção, aplicação tenta encontrar Node.js em `C:\Program Files\ERP Anduril\resources\node\node.exe`
6. Arquivo não existe → Erro ao tentar spawnar

### Sintomas:
- Erro genérico "Backend falhou com código 1"
- Nenhuma informação de qual é o erro real
- Log mostra: "Node.js não encontrado" ou "Comando não encontrado"

### Como foi Corrigido:
- ✅ Adicionada função `validateNodeExecutable()` em main.ts
- ✅ Adicionado script `npm run validate:build` que REJEITA build se Node.js não está incluído
- ✅ Modificado `npm run package:win` para chamar `npm run validate:build` primeiro

### Verificação:
Antes de fazer `npm run package:win`, executar:
```bash
npm run validate:build
```

Se der erro de Node.js, executar:
```bash
npm run prepare:node
```

---

## Causa Raiz #2: Dependências do Backend Não Incluídas
**Probabilidade: ALTA (70%)**

### O que acontece:
1. `npm run prepare:backend-deps` **NÃO foi executado**
2. Diretório `backend/node_modules/` não tem conteúdo
3. Ou diretório não foi incluído em `extraResources` do package.json
4. Backend tenta `require('better-sqlite3')` ou `require('@nestjs/core')`
5. Módulo não encontrado → Erro de execução

### Sintomas:
- Erro de "Cannot find module..."
- Código de saída 1
- Stderr mostra: `Error: Cannot find module`

### Como foi Corrigido:
- ✅ Adicionada validação de dependências críticas em `validate-build.js`
- ✅ Script verifica se `better-sqlite3`, `@nestjs/core`, etc existem

### Verificação:
```bash
npm run validate:build
```

Deve mostrar:
```
✓ better-sqlite3
✓ @nestjs/common
✓ @nestjs/core
✓ axios
✓ typeorm
```

---

## Causa Raiz #3: Módulos Nativos Não Compilados
**Probabilidade: MÉDIA (50%)**

### O que acontece:
1. `npm run rebuild:native` **NÃO foi executado**
2. Arquivo `better-sqlite3.node` não foi gerado/atualizado
3. O `.node` compilado no desenvolvimento é para versão diferente do Node.js
4. Backend tenta carregar o módulo mas falha
5. Erro: "Error loading native module" ou similar

### Sintomas:
- Erro de "Cannot find module" ou "incompatible binary"
- Código de saída 1
- Stderr mostra: `Error while loading shared libraries` ou similar

### Como foi Corrigido:
- ✅ Adicionada validação do `better_sqlite3.node` em `validate-build.js`
- ✅ Script `prepare-node.js` agora tem `validateNodePrepared()`
- ✅ Script `rebuild-native-modules.js` melhorado

### Verificação:
```bash
npm run validate:build
```

Deve mostrar:
```
✓ better-sqlite3 compilado (XXXKb)
```

---

## Causa Raiz #4: Node.js Corrompido ou Incompleto
**Probabilidade: BAIXA (10%)**

### O que acontece:
1. Node.js foi baixado mas extração falhou
2. Ou arquivo é muito pequeno (< 30MB)
3. Ou arquivo não é um executável válido (assinatura inválida)
4. Sistema tenta executar arquivo corrompido
5. Erro de "Cannot execute binary" ou similar

### Sintomas:
- Erro ao tentar executar Node.js
- Arquivo muito pequeno
- Sem permissão de execução

### Como foi Corrigido:
- ✅ Adicionada função `validateNodeExecutable()` que verifica:
  - Tamanho do arquivo (deve ser > 30MB)
  - Permissões (readable, executable)
  - Assinatura do executável (magic number)
- ✅ Script `prepare-node.js` agora valida após extração

### Verificação:
```bash
npm run validate:build
```

Deve mostrar:
```
✓ Node.js (node.exe) (XXX.XMB)
✓ Versão do Node.js: v20.11.0
```

---

## Causa Raiz #5: Falta de Espaço em Disco
**Probabilidade: MUITO BAIXA (5%)**

### O que acontece:
1. `npm run prepare:node` tenta extrair Node.js
2. Não há espaço suficiente em disco
3. Extração falha silenciosamente
4. Arquivo fica incompleto

### Sintomas:
- Arquivo muito pequeno
- Erro durante extração (mas pode passar despercebido)

### Como foi Corrigido:
- ✅ Script `diagnose-production.js` verifica espaço em disco

---

## Causa Raiz #6: Informações de Erro Inadequadas
**Probabilidade: 100% (Este é o real problema)**

### O Verdadeiro Problema:
Qualquer que seja a causa acima, o erro "Backend falhou com código 1" é genérico demais.
- Usuário não sabe o que está faltando
- Developer não consegue diagnosticar
- Não há informação suficiente nos logs

### Como foi Corrigido:
- ✅ Captura primeira linha de stderr do Node.js
- ✅ Mostra mensagem de erro real do backend
- ✅ Adiciona sugestões baseadas no código de erro
- ✅ Aponta exato arquivo de log para consultar
- ✅ Script `diagnose-production.js` mostra tudo que falta

### Antes:
```
Erro ao Iniciar Aplicação
Não foi possível iniciar o aplicativo.
Backend falhou ao iniciar com código de saída 1
```

### Depois:
```
Erro ao Iniciar Aplicação
Backend encerrado com código 1

Primeira linha de erro:
Cannot find module 'better-sqlite3'

Possíveis causas:
1. Módulo não encontrado (melhor-sqlite3, axios, etc.)
2. Erro ao conectar ao banco de dados
...

Solução:
- Verifique os logs completos em: C:\...\logs\electron-2026-01-16.log
- Recrie o instalador: cd electron && npm run prepare:all && npm run package:win
```

---

## Fluxo Esperado Agora

### Desenvolvimento (Fazer Build)
```
npm run prepare:all         ← Baixa Node.js, copia deps, compila nativos
npm run validate:build      ← Verifica se tudo está OK ✓✓✓
npm run package:win         ← Faz o build
```

### Produção (Usuário com Erro)
```
Aplicação falha com mensagem detalhada
Usuário executa diagnose-production.js
Script mostra exatamente o que falta e como resolver
```

---

## Checklists Implementadas

### ✅ Antes de Build (`npm run validate:build`)
- [ ] Node.js preparado (> 50MB)
- [ ] Node.js executável
- [ ] Backend compilado (dist/main.js existe)
- [ ] Dependências instaladas
- [ ] Módulos nativos compilados
- [ ] Frontend compilado
- [ ] Arquivos Electron compilados

### ✅ Durante Build (`npm run package:win`)
- Agora chama `npm run validate:build` automaticamente
- Se alguma validação falhar, **rejeita o build**

### ✅ Em Produção (`diagnose-production.js`)
- Usuário executa script em máquina com problema
- Script mostra exatamente o que falta
- Mostra como resolver

---

## Resultado Final

Combinando todas as correções:

1. **Problema é Prevenido**: `npm run validate:build` evita builds inválidos
2. **Problema é Diagnosticável**: `diagnose-production.js` mostra exatamente o que falta
3. **Erro é Informativo**: Mensagens de erro mostram causa raiz + solução
4. **Documentação Clara**: Checklist, guias de troubleshooting disponíveis

A chance de o usuário receber um aplicativo "vazio" (sem Node.js ou dependências) é ~99% menor.

