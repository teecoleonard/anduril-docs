# Diagnóstico - Timeout Backend 30 segundos

## 🔍 Problema Reportado
- App mostra timeout após 30 segundos
- Backend está respondendo (depois dos 30s)
- Depois app consegue funcionar normalmente

## 🔎 Análise da Causa

### Fluxo de Comunicação:
```
App.tsx
├─ useEffect [] chama getStatus()
├─ Aguarda onStatus() callback
└─ Se não receber em 30s → TIMEOUT

┌─ Problema pode estar aqui:
│  Backend demora > 30s para dar primeira resposta
│  ou
│  IPC não está entregando a mensagem rápido o suficiente
```

### Pontos de Falha Potenciais:

1. **BackendManager.start()** 
   - Emite 'loading' inicialmente ✓
   - Aguarda detecção de "Server running" / "listening" keywords
   - Leva muito tempo para primeira detecção?

2. **IPC Handler**
   - `backend:getStatus` listener registrado ✓
   - Responde com `sendBackendStatus()` ✓
   - Atraso na envio de resposta?

3. **App.tsx Listener**
   - `onStatus()` callback funcionando ✓
   - Mas nunca recebe primeira mensagem dentro de 30s
   - Por quê?

## ✅ Correções Implementadas

### 1. **ipc-handlers.ts** - Resposta Imediata Melhorada
Agora responde IMEDIATAMENTE ao `getStatus()` e depois enviar progresso:
```typescript
ipcMain.on('backend:getStatus', () => {
  const isReady = this.options.backendManager.isReady();
  
  // Responde imediatamente
  this.sendBackendStatus(
    isReady ? 'ready' : 'loading',
    isReady ? 'Backend pronto' : 'Inicializando backend...',
    isReady ? 100 : 50
  );
  
  // E depois envia outro update após 2s
  if (!isReady) {
    setTimeout(() => {
      this.sendBackendStatus('loading', 'Ainda inicializando...', 75);
    }, 2000);
  }
});
```

### 2. **backend-manager.ts** - Detecção Mais Agressiva
Adicionados mais keywords para detectar quando backend está pronto:
```typescript
const readyIndicators = [
  'Server running',
  'listening on',
  'started',
  '[Nest]',  // NestJS já inicializou
  'Application is running',
  'listen'
];
```

### 3. **App.tsx** - Melhor Logging e Timeout Reduzido
- Timeout reduzido de 30s → 15s
- Logs mais detalhados mostrando quantos updates foram recebidos
- Melhor rastreamento de tempo decorrido

## 🧪 Como Testar

### Teste 1: Debug Logs
```bash
# No terminal Electron
npm run dev

# Abra DevTools (F12)
# Console deve mostrar:
[App] Ambiente Electron detectado, aguardando backend...
[App] ⏱️ Solicitando status inicial do backend...
[App] Status 1: { status: 'loading', message: '...', progress: 50 }
[App] Status 2: { status: 'loading', message: '...', progress: 75 }
[App] Status 3: { status: 'ready', message: '...', progress: 100 }
[App] ✅ Backend está pronto! Abrindo aplicação...
```

### Teste 2: Medir Tempo
```javascript
// No console:
// Veja quanto tempo demora do "Solicitando status" até "Backend está pronto"
// Esperado: < 5 segundos
// Se > 15 segundos: vai dar timeout
```

### Teste 3: Backend Lento
Se o backend está realmente demorando:
1. Verifique logs do backend em `electron/dist/logs/`
2. Procure por o que está demorando
3. Otimize a inicialização

## 📊 Possíveis Causas de Atraso

### 1. Backend Demora para Inicializar
- Compilação TypeScript lenta
- Módulos pesados carregando
- Database initialization lenta

**Solução:** Verifique logs do backend, otimize inicialização

### 2. Detecção de Ready Falha
- Keyword "Server running" não está sendo logada
- Backend usa output diferente

**Solução:** Adicione mais keywords (já feito), verifique logs

### 3. IPC Atraso
- Comunicação entre main e renderer é assíncrona
- Pode haver fila de eventos

**Solução:** Adicionado resposta imediata no handler

## 🔧 Próximos Passos se Problema Persistir

1. **Ativar DEBUG logging:**
   ```bash
   # Em electron/modules/logger.ts
   # Reduzir filter level para DEBUG
   ```

2. **Adicionar timestamps precisos:**
   ```javascript
   console.time('backend-ready');
   // ... depois:
   console.timeEnd('backend-ready');
   ```

3. **Monitorar process do backend:**
   ```bash
   # Verificar se processo está rodando
   tasklist | grep node
   ```

4. **Testar comunicação IPC diretamente:**
   ```javascript
   // No console:
   window.electronAPI.backend.getStatus();
   // Verifica se vira alguma coisa
   ```

## ✅ Mudanças Aplicadas

| Arquivo | Mudança | Impacto |
|---------|---------|---------|
| `ipc-handlers.ts` | Resposta imediata + timeout 2s | Reduce initial delay |
| `backend-manager.ts` | Mais keywords para detecção | Faster detection |
| `App.tsx` | Timeout 30s → 15s, melhor logs | Better debugging |

## 🎯 Resultado Esperado

- ✅ App.tsx recebe status dentro de 5-10 segundos
- ✅ LoadingScreen mostra progresso contínuo
- ✅ Sem timeout desnecessário
- ✅ Se backend demora > 15s, timeout com mensagem clara

---

**Próximo passo:** Fazer build e testar em desenvolvimento
