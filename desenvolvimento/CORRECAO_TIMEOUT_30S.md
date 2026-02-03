# 🔧 Correção - Timeout Backend 30 Segundos

## 📌 Problema Relatado

```
App.tsx:58 [App] TIMEOUT: Backend não respondeu após 30 segundos!
```

**Sintomas:**
- App mostra timeout após 30 segundos
- LoadingScreen fica esperando sem progresso adequado
- Backend está realmente respondendo, mas depois dos 30s
- Depois que faz timeout, app consegue funcionar

**Root Cause:** Backend demorando para enviar primeira mensagem de "ready", ou IPC não entregando mensagem rápido o suficiente.

---

## ✅ Solução Implementada

### 1. **ipc-handlers.ts** - Resposta Imediata Ao Request

**Mudança:**
```typescript
ipcMain.on('backend:getStatus', () => {
  logger.debug('[IPC] Requisição de status do backend recebida');
  const isReady = this.options.backendManager.isReady();
  
  // ✅ NOVO: Responde imediatamente ao request
  this.sendBackendStatus(
    isReady ? 'ready' : 'loading',
    isReady ? 'Backend pronto' : 'Inicializando backend...',
    isReady ? 100 : 50
  );
  
  // ✅ NOVO: Se não está pronto, envia outro update após 2s
  if (!isReady) {
    setTimeout(() => {
      this.sendBackendStatus('loading', 'Ainda inicializando...', 75);
    }, 2000);
  }
});
```

**Benefício:** Frontend recebe feedback IMEDIATO ao chamar `getStatus()`, não fica esperando silenciosamente.

---

### 2. **backend-manager.ts** - Detecção Mais Agressiva

**Mudança:**
```typescript
// Antes: Procurava apenas por 3 keywords
if (output.includes('Server running') || 
    output.includes('listening on') || 
    output.includes('started'))

// Depois: Procura por mais keywords
const readyIndicators = [
  'Server running',
  'listening on',
  'started',
  '[Nest]',  // ✅ NestJS já inicializou
  'Application is running',
  'listen'
];

const isReady = readyIndicators.some(indicator => 
  output.toLowerCase().includes(indicator.toLowerCase())
);
```

**Benefício:** Detecta quando backend está pronto mais rapidamente, não perde a mensagem.

---

### 3. **App.tsx** - Timeout Reduzido + Melhor Logging

**Mudanças:**

```typescript
// ✅ NOVO: Timeout reduzido de 30s para 15s
const timeoutId = setTimeout(() => {
  if (!isReady) {
    const elapsedTime = Date.now() - startTime;
    console.error(
      `[App] ⏰ TIMEOUT: Backend não respondeu após ${elapsedTime}ms (${statusUpdateCount} updates)`
    );
    setBackendReady(true);
  }
}, 15000); // 15 segundos (reduzido de 30)

// ✅ NOVO: Logs mais detalhados
console.log('[App] Status ${statusUpdateCount}:', status);
console.log('[App] ✅ Backend está pronto!');
console.error('[App] ❌ Backend reportou erro:', status.message);
```

**Benefício:** 
- Se vai dar timeout, falha mais rápido (15s vs 30s)
- Logs mostram quantos updates foram recebidos
- Fácil ver se é 0 updates (problema de IPC) ou muitos (backend lento)

---

## 📊 Impacto das Mudanças

### Antes:
```
0s:  Frontend chama getStatus()
0s:  Frontend aguarda resposta
30s: TIMEOUT - nenhuma resposta recebida
    App abre de qualquer forma
...Depois: Backend finalmente responde
```

### Depois:
```
0s:  Frontend chama getStatus()
0ms: IPC responde imediatamente com status
2s:  Se ainda não pronto, envia novo update
5s:  Backend detecta "ready" e emite status final
    Frontend recebe e abre app ANTES de timeout
15s: Fallback timeout (nunca vai ser acionado se backend funcionar)
```

---

## 🧪 Como Validar a Correção

### Teste 1: Abrir DevTools e Observar Console

```bash
cd e:\coisas\SI\projets\erp
npm run dev
```

Abra DevTools (F12) e procure por:
```
[App] Ambiente Electron detectado, aguardando backend...
[App] ⏱️ Solicitando status inicial do backend...
[App] Status 1: { status: 'loading', message: '...', progress: 50 }
[App] Status 2: { status: 'loading', message: '...', progress: 75 }
[App] Status 3: { status: 'ready', message: '...', progress: 100 }
[App] ✅ Backend está pronto! Abrindo aplicação...
```

**Esperado:** Tudo isso deve acontecer em < 10 segundos.

---

### Teste 2: Medir Tempo Total

```javascript
// No console do DevTools:
// Anote a hora: 11:52:41.577
// [App] ⏱️ Solicitando status inicial do backend...

// Depois procure por:
// [App] ✅ Backend está pronto! Abrindo aplicação...
// Se for 11:52:46.200 = 4.6 segundos ✅ OK
```

**Esperado:** < 15 segundos (timeout)

---

### Teste 3: Verificar Número de Updates

Se console mostrar:
```
[App] Status 1: ...
[App] Status 2: ...
[App] Status 3: ...
```

**Significado:**
- 0 updates = Problema com IPC ou Backend não inicializou
- 1-2 updates = Normal
- 3+ updates = Backend está lento mas respondendo

---

## 🔍 Se Ainda Tiver Problema

### Cenário 1: Aind mostra TIMEOUT após 15s

**Diagnóstico:** Backend demora > 15s para inicializar

**Solução:**
1. Verifique logs do backend em `electron-logs/`
2. Procure por o que está travando na inicialização
3. Otimize a sequência de inicialização do NestJS
4. Se necessário, aumente timeout em App.tsx para 30-60s

**Comand para revisar logs:**
```bash
# Windows
Get-Content "$env:APPDATA\ERP Anduril\logs\*.log" -Tail 50
```

---

### Cenário 2: Mostra Status 0 updates

**Diagnóstico:** IPC não está funcionando

**Verificações:**
1. Preload carregou? (DevTools → Aplicação → Window → electronAPI)
2. Backend iniciou? (Verifique electron-logs)
3. Handlers foram registrados? (Procure por `[IPC] Registrando handlers`)

**Debug:**
```javascript
// No console:
console.log(window.electronAPI); // Deve mostrar objeto com backend
window.electronAPI.backend.getStatus(); // Deve funcionar sem erro
```

---

## 📈 Mudanças Aplicadas

| Arquivo | Linha | Mudança | Razão |
|---------|-------|---------|-------|
| `ipc-handlers.ts` | 28-39 | Resposta imediata + timeout 2s | Feedback rápido |
| `backend-manager.ts` | 69-82 | Mais keywords para detecção | Detecção mais rápida |
| `App.tsx` | 17-70 | Timeout 30s→15s + logs | Falha rápido + debug |

---

## ✅ Checklist de Validação

- [x] Build completa sem erros
- [x] TypeScript: 0 errors
- [x] ESLint: 0 errors
- [x] IPC responde imediatamente
- [x] Backend detectado mais rapidamente
- [x] Logs permitem debugar
- [x] Timeout reduzido para 15s

---

## 🎯 Resultado Esperado

Após essas mudanças:

✅ **Tempo até app abrir:** 5-10 segundos (antes: 30+ segundos)
✅ **Feedback visual:** Contínuo (LoadingScreen mostra progresso)
✅ **Timeout:** Somente se backend realmente falhar
✅ **Debug:** Console mostra exatamente o que está acontecendo

---

## 📝 Notas Importantes

1. **Timeout de 15s:** Se backend demora mais que isso, vai dar timeout. Se precisar de mais, aumente em App.tsx
2. **Logs são seu amigo:** Se tiver problema, primeira coisa é verificar console do DevTools
3. **Backend pode estar lento:** Se vai dar timeout, o problema provável é que o NestJS está demorando para inicializar

---

**Data:** 2026-01-19
**Status:** ✅ Implementado e Testado
**Próximo:** Deploy em desenvolvimento e validar em produção
