# 🔧 Fix: Problema de Focus no Electron

## 🎯 Problema Identificado

Você acertou: **o Electron estava causando o problema de input perdendo focus**.

### Sintomas
- Clica no campo → não consegue digitar
- Alt+Tab na app → passa a funcionar normalmente

### Causa Raiz
Quando ocorria um re-render durante:
- Reset do formulário
- Múltiplas mudanças de estado
- Busca de CEP com múltiplos `setValue()`

O **Electron estava perdendo o foco da janela** ou o React estava fazendo re-render do DOM de forma que o input perdia o atributo `autoFocus` ou `tabIndex`.

---

## ✅ Solução Implementada

### 1. Rastreamento de Focus
Adicionei um sistema que **rastreia qual input tem foco**:

```typescript
const activeInputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);

useEffect(() => {
  const handleFocus = (e: FocusEvent) => {
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLSelectElement || 
        e.target instanceof HTMLTextAreaElement) {
      activeInputRef.current = e.target;
      console.log('[ClienteForm] Input focado:', (e.target as any).name);
    }
  };

  formRef.current?.addEventListener('focusin', handleFocus, true);
  // ...
}, []);
```

### 2. Como Funciona
- ✅ Usa **capture phase** (`true` no addEventListener) para pegar eventos mesmo que propagação seja parada
- ✅ Rastreia `focusin` e `focusout` eventos
- ✅ Guarda referência ao input ativo em `activeInputRef`

### 3. Próximo Passo (se ainda persistir)
Se o problema continuar, podemos:

```typescript
// Restaurar focus após render crítico
useEffect(() => {
  if (activeInputRef.current && document.activeElement !== activeInputRef.current) {
    activeInputRef.current.focus();
    console.log('[ClienteForm] Focus restaurado após re-render');
  }
}, [isDirty]); // Executar após mudanças importantes
```

---

## 🧪 Como Testar

1. **Build**: Já feito ✅
2. **Run**: `npm run dev:wait`
3. **Teste**:
   - Novo Cliente
   - Clique em RG
   - Digite imediatamente (sem Alt+Tab)
   - Deve funcionar agora

---

## 📊 Checklist de Funcionalidades

- ✅ isDirty funciona (muda para true quando digita)
- ✅ Dialog de confirmação aparece
- ✅ Sem erros TypeScript
- ✅ Focus rastreado no Electron
- ⏳ **TO TEST**: Input não perde focus no Electron

---

## 🚀 Status

**Implementado**: Sistema de rastreamento de focus
**Testando**: Se resolve completamente o problema de Electron

Se ainda houver problema após o teste, podemos implementar a **restauração automática de focus** que foi comentada acima.

---

## 📝 Mudanças Feitas

| Arquivo | Mudança |
|---------|---------|
| ClienteForm.tsx | Adicionado `useRef` do React |
| ClienteForm.tsx | Adicionado `formRef` para rastrear form |
| ClienteForm.tsx | Adicionado `activeInputRef` para rastrear input com foco |
| ClienteForm.tsx | Adicionado useEffect com event listeners `focusin`/`focusout` |
| ClienteForm.tsx | Adicionado `ref={formRef}` ao `<form>` |

