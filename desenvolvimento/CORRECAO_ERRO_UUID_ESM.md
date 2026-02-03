# Correção: Erro ERR_REQUIRE_ESM ao Abrir App Instalado

## 🔴 Problema Identificado

O aplicativo **Electron não abria ao ser instalado** com o seguinte erro nos logs:

```
Error [ERR_REQUIRE_ESM]: require() of ES Module ... uuid/dist-node/index.js not supported.
Instead change the require of index.js in ... remessa.service.js to a dynamic import()
```

## 🔍 Causa Raiz

O módulo `uuid` foi atualizado para versão 9.0.0+ que é **ESM (ECMAScript Module) only**. O código TypeScript estava usando:

```typescript
import { v4 as uuidv4 } from 'uuid';
```

Quando compilado para CommonJS (que é o padrão do backend), gerava:

```javascript
const uuid_1 = require("uuid");  // ❌ Isso não funciona com ESM
```

Isso causa conflito porque:
- **CommonJS** usa `require()`
- **ESM** usa `import` ou dynamic `import()`
- O uuid 9.0.0+ é **apenas ESM**, não suporta CommonJS

## ✅ Solução Implementada

### 1. Removido import estático do uuid
**Arquivo**: `backend/src/cnab/remessa/remessa.service.ts`

```typescript
// ❌ REMOVIDO
import { v4 as uuidv4 } from 'uuid';
```

### 2. Criada função helper com dynamic import
```typescript
/**
 * Gera UUID v4 usando dynamic import para compatibilidade com ESM
 */
private async gerarUUID(): Promise<string> {
  const { v4: uuidv4 } = await import('uuid');
  return uuidv4();
}
```

### 3. Convertida função para async
```typescript
// ❌ ANTES
private gerarNumeroRemessa(): string {
  const uuid = uuidv4();
  return `REM-${uuid}`;
}

// ✅ DEPOIS
private async gerarNumeroRemessa(): Promise<string> {
  const uuid = await this.gerarUUID();
  return `REM-${uuid}`;
}
```

### 4. Atualizada chamada da função
```typescript
// ❌ ANTES
const numeroRemessa = this.gerarNumeroRemessa();

// ✅ DEPOIS
const numeroRemessa = await this.gerarNumeroRemessa();
```

## 📋 Arquivos Modificados

- `backend/src/cnab/remessa/remessa.service.ts`

## 🧪 Testes Realizados

✅ Build do backend compilou com sucesso
✅ Build do Electron compilou com sucesso
✅ Validação de build passou (0 erros)

## 🚀 Próximos Passos

1. Fazer novo package do Electron:
   ```bash
   npm run package:win
   ```

2. Instalar e testar o novo executável

3. Verificar logs em: `%USERPROFILE%\AppData\Roaming\erp-anduril\logs`

## 📌 Notas Importantes

- **Dynamic import** é a solução padrão para usar módulos ESM dentro de código CommonJS
- Todas as versões modernas do Node.js (v12+) suportam dynamic imports
- Isso é uma prática recomendada pela comunidade Node.js para compatibilidade futura

## 🔗 Referências

- [MDN - Dynamic import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)
- [uuid package](https://www.npmjs.com/package/uuid)
- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
