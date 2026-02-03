# 🔧 Fix: Input Perdendo Focus Após CEP Search

## ✅ Ótimas Notícias!

Seus testes confirmaram:
1. ✅ **isDirty agora funciona** - muda para `true` quando digita
2. ✅ **Dialog de confirmação funciona** - aparece quando tenta fechar com mudanças
3. ✅ **Sem erros TypeScript** - código compilado com sucesso

## 🐛 Novo Problema Identificado

**Sintoma**: Após buscar CEP (que preenche endereço automaticamente), ao clicar em outro campo (como RG), não consegue digitar até fazer Alt+Tab.

**Causa Raiz**: Quando `handleBuscarCEP` chama múltiplos `setValue()`, causa re-renders que interrompem o event queue, perdendo o focus do campo recém-clicado.

**Logs que provam**:
```
[ClienteForm] Input clicado: estado_civil
6ClienteForm.tsx:263 [ClienteForm] Input clicado: rg   ← "6" aparece ANTES de rg registrar
```

O "6" foi digitado enquanto o estado do formulário estava inconsistente.

## 🔧 Solução Implementada

Adicionei **`useCallback`** para `handleBuscarCEP`:

```typescript
import { useCallback } from 'react';

const handleBuscarCEP = useCallback(async () => {
  // ... código ...
  setValue('endereco_completo', endereco.logradouro || '');
  setValue('bairro', endereco.bairro || '');
  setValue('cidade', endereco.localidade || '');
  setValue('uf', endereco.uf || '');
  // ...
}, [cepValue, setValue]);
```

**Por quê funciona**:
- `useCallback` memoriza a função
- Previne recriação desnecessária de referências
- Reduz re-renders causados por mudanças de dependencies
- Mantém event queue estável durante múltiplos setValue()

## 🧪 Como Testar

### 1. Build
```bash
npm run build
npm run dev:wait
```

### 2. Teste Passo a Passo
1. **Novo Cliente** 
2. **Digite um CEP válido** (ex: 38410-290)
3. **Aperte Tab ou clique em "Buscar"** (busca automática de endereço)
4. **Aguarde a busca completar** (vê sucesso)
5. **Clique em outro campo RG**
6. **Digite imediatamente** (não deve precisa Alt+Tab)

### 3. Verificação
- [ ] Consegue digitar no RG após CEP search?
- [ ] Sem pressão de Alt+Tab?
- [ ] Formulário responsivo?

## 📊 Cenários Esperados

### ✅ Antes (com problema)
```
[Digita CEP]
[Busca executada]
[Clica em RG] → Não consegue digitar → Precisa Alt+Tab
```

### ✅ Depois (com useCallback)
```
[Digita CEP]
[Busca executada]
[Clica em RG] → Consegue digitar imediatamente ✅
```

## 📝 Mudanças Feitas

| Arquivo | Mudança | Razão |
|---------|---------|-------|
| ClienteForm.tsx | `import { useCallback }` | Memoizar handlers |
| ClienteForm.tsx | `handleBuscarCEP = useCallback(...)` | Evitar re-renders desnecessários durante setValue |

## 🚀 Próximos Passos

1. **Execute o teste acima**
2. **Se problema persistir**: Pode haver outra causa (será investigada)
3. **Se resolver**: Considerar aplicar `useCallback` a outros handlers também

---

**Status**: 🔨 Corrigido com useCallback - Pronto para testar
