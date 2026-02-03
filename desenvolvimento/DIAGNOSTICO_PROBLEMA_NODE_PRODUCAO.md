# Diagnóstico: Problema de Execução do Node.js em Produção

## Resumo do Problema
O aplicativo Electron em produção:
1. ✓ Cria a pasta de instalação
2. ✓ Transfere os arquivos do Node.js
3. ✗ **NÃO consegue executar o Node.js**
4. Erro: "Backend falhou ao iniciar com código de saída 1"

---

## Possíveis Causas Identificadas

### 1. **Falta de Permissões de Execução (Windows)**
**Severidade: ALTA**

O `node.exe` pode estar com permissões inadequadas ou estar sendo bloqueado pelo Windows:
- O arquivo pode estar marcado como "Downloaded from the Internet" (SmartScreen)
- Pode ter sido extraído incorretamente, perdendo permissões executáveis
- Windows Defender pode estar bloqueando a execução

**Verificação no código:**
- O `prepare-node.js` extrai o ZIP usando PowerShell, mas não valida permissões
- Não há tratamento para executáveis bloqueados pelo Windows

---

### 2. **Node.js Não Estar Incluído no Build**
**Severidade: ALTA**

O script `prepare:node` pode não ter sido executado durante o build:
- O diretório `build/node` pode estar vazio ou não existir
- `npm run package` depende de `npm run prepare:all` ser executado
- Se o Node.js não foi preparado, o executável não estará no `build/node/`

**Verificação no código:**
```typescript
// main.ts linha ~560: Procura Node em resourcesPath/node/
possibleNodePaths = [
  path.join(process.resourcesPath, 'node', 'node.exe'),
  path.join(process.resourcesPath, 'node', 'bin', 'node.exe'),
  // ...
];
```

**Problema:** Se `build/node` está vazio quando o build foi feito, o executável nunca será encontrado.

---

### 3. **Erro ao Extrair o Node.js no Computador do Usuário**
**Severidade: MÉDIA**

O extracting do Node.js pode estar falhando silenciosamente:
- Espaço em disco insuficiente
- Caracteres especiais no caminho (`C:\Users\paulo\...` pode ter problemas)
- Pasta de instalação protegida ou em processo de antivírus
- Permissões insuficientes em `Program Files`

---

### 4. **Node.js Standalone Pode Não Ter npm/npx**
**Severidade: MÉDIA**

O `prepare-node.js` baixa o Node.js standalone que:
- **Pode não incluir npm** (apenas o binário `node`)
- O backend precisa de `npm` para funcionar corretamente
- O `rebuild-native-modules.js` espera que `npm` exista

---

### 5. **Dependências do Backend Não Incluídas ou Não Encontradas**
**Severidade: ALTA**

No arquivo de config do Electron:
```json
"extraResources": [
  {
    "from": "../backend/dist",
    "to": "backend/dist"
  },
  {
    "from": "../backend/node_modules",
    "to": "backend/node_modules"  // ⚠️ Pode estar VAZIO
  },
  {
    "from": "build/node",  // ⚠️ AQUI Pode estar VAZIO
    "to": "node"
  }
]
```

Se `npm run prepare:backend-deps` não foi executado, `backend/node_modules` está vazio.

---

### 6. **Falta de Melhor Logging de Erros**
**Severidade: ALTA**

O erro "Backend falhou ao iniciar com código de saída 1" é muito genérico:
- Não informa qual é o erro real do Node.js
- O `stdio: 'pipe'` foi configurado, mas pode haver problemas na captura
- Os logs do Electron podem não estar sendo salvos corretamente

```typescript
// main.ts linha ~630
backendProcess.stderr?.on('data', (data) => {
  // Precisa de melhor tratamento
});
```

---

## Solução Recomendada (Passo a Passo)

### Fase 1: Validação de Build
- [x] Verificar se `npm run prepare:all` foi executado ANTES de fazer o build
- [x] Confirmar que `build/node/` contém o executável `node.exe`
- [x] Confirmar que `backend/node_modules/` contém as dependências

### Fase 2: Melhorias no Code

#### 2.1 Aprimorar o `main.ts`
- Adicionar verificações mais robustas antes de spawn
- Melhorar captura e logging de stderr/stdout
- Adicionar timeout maior para produção
- Validar integridade do executável

#### 2.2 Melhorar `prepare-node.js`
- Validar permissões após extração
- Verificar se npm está incluído
- Fazer backup do Node.js preparado

#### 2.3 Criar Script de Diagnóstico
- Criar verificador que roda em produção
- Validar arquivo size e checksum
- Verificar permissões de execução
- Validar estrutura de diretórios

### Fase 3: Build Validation
- Criar checklist para verificar antes de fazer package
- Adicionar validações ao build script

---

## Próximos Passos

1. **Verificar o último build feito:**
   - Abrir o `.exe` com 7-Zip e inspecionar:
     - `resources/node/node.exe` existe? (Tamanho > 50MB?)
     - `resources/backend/node_modules/` tem conteúdo?
     - `resources/backend/dist/main.js` existe?

2. **Executar o build novamente com checklist:**
   ```bash
   cd electron
   npm run prepare:all  # FUNDAMENTAL - preparar node e deps
   npm run package:win   # depois fazer build
   ```

3. **Implementar melhorias de diagnóstico no código** (veja seção abaixo)

---

## Implementação das Melhorias

As melhorias implementadas incluem:

### 1. Aprimoramentos no `main.ts`
✓ Adicionada função `validateNodeExecutable()` que:
  - Verifica se o executável existe
  - Valida tamanho mínimo (> 30MB)
  - Valida permissões de leitura/execução
  - Verifica assinatura do executável (magic number)
  - Captura e retorna erro detalhado

✓ Melhorado tratamento de erro de spawn:
  - Captura primeira linha de stderr para diagnóstico
  - Adiciona sugestões baseadas em código de erro
  - Mostra arquivo de log exato
  - Instrui usuário sobre como resolver

✓ Melhor logging de stdout/stderr
  - Agora captura saída detalhada do backend
  - Primeiro erro é preservado para diagnóstico
  - Logging melhorado com detalhes

### 2. Aprimoramentos no `prepare-node.js`
✓ Adicionada função `validateNodePrepared()` que:
  - Verifica se executável existe após extração
  - Testa execução do Node.js
  - Verifica se npm está disponível
  - Fornece avisos detalhados se npm não existir

### 3. Scripts Criados

#### `diagnose-production.js`
Deve ser executado em máquinas com problema:
```bash
node diagnose-production.js
```

Verifica:
- Estrutura de diretórios
- Integridade do Node.js (tamanho, assinatura, permissões)
- Arquivos do backend
- Dependências críticas
- Espaço em disco
- Recomendações de resolução

#### `validate-build.js`
Deve ser executado ANTES de fazer o build:
```bash
npm run validate:build
```

Verifica:
- Node.js preparado
- Backend compilado
- Dependências instaladas
- Módulos nativos compilados
- Frontend compilado
- Configuração do Electron
- Arquivos compilados

Se houver erro, instrui exatamente o que fazer.

#### `BUILD_CHECKLIST.md`
Checklist completo de pré-build, build e pós-build

### 4. Novos npm scripts
Adicionados ao `electron/package.json`:
```json
"validate:build": "node validate-build.js",
"diagnose": "node diagnose-production.js",
"package": "npm run validate:build && npm run prepare:all && ...",
"package:win": "npm run validate:build && npm run prepare:all && ...",
```

Agora `npm run package:win` VALIDA antes de fazer o build!

---

## Como Usar as Melhorias

### Para Desenvolvedores (Antes de Fazer Build)

```bash
cd electron

# 1. Validar tudo antes de fazer build
npm run validate:build

# 2. Se tudo OK, fazer o build (agora já valida automaticamente)
npm run package:win

# 3. Se der erro, recompilar tudo do zero
npm run clean:cache
npm run prepare:all
npm run package:win
```

### Para Usuários (Se Aplicativo Falhar)

1. Copiar o arquivo `diagnose-production.js` para pasta do aplicativo:
   ```
   C:\Program Files\ERP Anduril\
   ```

2. Abrir terminal e executar:
   ```bash
   cd "C:\Program Files\ERP Anduril"
   node diagnose-production.js
   ```

3. Seguir as recomendações mostradas

### Para Suporte Técnico

Se usuário reportar erro, pedir para executar:
```bash
node diagnose-production.js > diagnostico.txt
```

Analisar o arquivo `diagnostico.txt` para ver exatamente o que falta.

---

## Resumo de Problemas Resolvidos

| Problema | Antes | Depois |
|----------|-------|--------|
| Erro genérico "Backend falhou" | Nenhuma dica de diagnóstico | Mostra primeira linha do erro + sugestões |
| Não sabia se Node.js foi incluído no build | Manual verificar arquivo .exe | Validação automática antes de build |
| Não sabia o que estava faltando em produção | Sem ferramentas | Script `diagnose-production.js` mostra tudo |
| Erro ao executar Node.js | Sem validação prévia | Verifica antes de tentar spawnar |
| Build incompleto passa despercebido | Nenhuma validação | Script valida antes e rejeita build inválido |

---

## Próximas Etapas Recomendadas

1. **Testar novo build em máquina limpa** antes de distribuir
2. **Distribuir junto com os scripts** de diagnóstico
3. **Atualizar documentação de suporte** com instruções de diagnóstico
4. **Monitorar logs** das primeiras instalações em produção
