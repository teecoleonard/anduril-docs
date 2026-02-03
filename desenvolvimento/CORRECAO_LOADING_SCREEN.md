# Correção da Tela de Loading - LoadingScreen Component

## Problema Identificado

A tela de loading estava travada em 0% quando o backend não era detectado imediatamente. O fluxo de comunicação IPC entre o process principal do Electron e o frontend React tinha os seguintes problemas:

### Sintomas:
1. **Travamento em 0%**: A barra de progresso não avançava
2. **Sem mensagens de status**: Mostrava apenas "Aguardando inicialização..." sem feedback
3. **Salto abrupto**: Quando o backend era detectado, pulava direto para 100%
4. **Timeout prolongado**: Levava muito tempo para responder

### Causas Raíz:
1. **Desconexão de nomenclatura IPC**: 
   - `preload.ts` enviava `backend:getStatus` (send)
   - `ipc-handlers.ts` escutava `backend:get-status` com `handle` (forma errada)
   - Nunca encontravam uma à outra

2. **Falta de conexão de callbacks**:
   - BackendManager emitia status via callbacks
   - Esses callbacks não eram conectados ao IpcHandlers
   - Status não chegava ao frontend

3. **Falta de progresso incremental**:
   - Só emitia status no início ("loading") e no final ("ready")
   - Nenhum progresso intermediário

## Soluções Implementadas

### 1. **LoadingScreen.tsx** - Componente Aprimorado

#### Melhorias de UX:
- ✅ **Progresso contínuo**: Avança lentamente até 85% enquanto aguarda status
- ✅ **Timeout de alerta**: Se não houver resposta em 5s, mostra aviso
- ✅ **Rastreamento de atualizações**: Mostra "Backend conectado" quando recebe respostas
- ✅ **Simulação em modo web**: Se não estiver em Electron, simula carregamento com etapas
- ✅ **Auto-scroll de logs**: Rola automaticamente para as novas mensagens
- ✅ **Tratamento de erros**: Captura e exibe erros de forma clara
- ✅ **Deduplicação de logs**: Evita mostrar mensagens duplicadas

#### Mudanças Principais:
```typescript
// Novo: Progresso contínuo enquanto espera
const interval = setInterval(() => {
  setProgress((prev) => {
    if (prev < 85) {
      return prev + Math.random() * 5; // Avança aleatoriamente até 85%
    }
    return prev;
  });
}, 1500);

// Novo: Timeout de 5s para alertar do atraso
statusTimeoutRef.current = setTimeout(() => {
  addLog('Aguardando resposta do backend...', 'warn');
}, 5000);

// Novo: Rastreamento de quando recebeu última atualização
const [lastStatusUpdate, setLastStatusUpdate] = useState(0);

// Novo: Interface melhorada com campos adicionais
interface BackendStatus {
  status: 'loading' | 'ready' | 'error' | string;
  message: string;
  progress?: number;
}
```

#### Componentes de UI Adicionados:
- Status indicator com ícone animado
- Contador de progresso em porcentagem
- Logs com timestamps formatados
- Cores diferentes para tipo de log (info, success, error, warn)
- Mensagem de erro detalhada quando falha

---

### 2. **ipc-handlers.ts** - Comunicação IPC Corrigida

#### Problema Corrigido:
```typescript
// ❌ ANTES: Handle com nome errado
ipcMain.handle('backend:get-status', async () => {
  return { ready: this.options.backendManager.isReady() };
});

// ✅ DEPOIS: Listener (on) com nome correto
ipcMain.on('backend:getStatus', () => {
  logger.debug('[IPC] Requisição de status do backend recebida');
  const isReady = this.options.backendManager.isReady();
  this.sendBackendStatus(
    isReady ? 'ready' : 'loading',
    isReady ? 'Backend pronto' : 'Inicializando backend...',
    isReady ? 100 : 50
  );
});
```

#### Implementação:
- ✅ Listener correto para `backend:getStatus` enviado via `send`
- ✅ Responde imediatamente com status atual
- ✅ Usa `sendBackendStatus()` para reenviá-lo ao frontend
- ✅ Envia progresso junto com status

---

### 3. **main.ts** - Conexão de Callbacks

#### Nova Conexão:
```typescript
// Conecta callbacks de status do BackendManager ao IPC
backendManager.onStatus((status: string, message: string, progress?: number) => {
  ipcHandlers.sendBackendStatus(status, message, progress);
});
```

#### O que isso faz:
1. BackendManager emite eventos de status conforme inicia
2. Cada evento é capturado por esse callback
3. O callback reenvia para o frontend via IPC
4. LoadingScreen recebe e atualiza UI em tempo real

---

### 4. **backend-manager.ts** - Emissões de Status Melhoradas

#### Emissões Implementadas:
```typescript
// Emite no início
this.emitStatus('loading', 'Iniciando backend...');

// Detecta progresso durante saída do processo
if (output.includes('Server running') ||
    output.includes('listening on') ||
    output.includes('started')) {
  this.isBackendReady = true;
  this.emitStatus('ready', 'Backend iniciado com sucesso', 100);
}

// Emite erros
this.emitStatus('error', 'Backend não iniciou a tempo');
```

---

### 5. **preload.ts** - API Mantida Compatível

Sem mudanças necessárias! A API já estava correta:
```typescript
backend: {
  getStatus: (): void => {
    ipcRenderer.send('backend:getStatus'); // ✓ Correto
  },
  onStatus: (callback): () => void => {
    ipcRenderer.on('backend:status', handler);
    return () => ipcRenderer.removeListener('backend:status', handler);
  }
}
```

---

## Fluxo de Comunicação Agora

```
┌─ Frontend React
│  LoadingScreen.tsx
│    1. Chama window.electronAPI.backend.getStatus()
│    2. Escuta window.electronAPI.backend.onStatus(callback)
│    3. Recebe updates via callback
│
├─ Preload (Context Bridge)
│  preload.ts
│    - Expõe API segura
│    - Encaminha send/on para IPC Renderer
│
├─ Main Process (Electron)
│  main.ts
│    1. Cria BackendManager
│    2. Conecta BackendManager.onStatus() → IpcHandlers.sendBackendStatus()
│    3. Registra IPC Handlers
│
│  ipc-handlers.ts
│    1. Listener 'backend:getStatus' responde com status atual
│    2. Recebe updates de BackendManager via callback
│    3. Envia via 'backend:status' para frontend
│
└─ Backend Process (Node.js)
   backend-manager.ts
     1. Inicia processo
     2. Monitora stdout/stderr
     3. Emite status via callbacks
     4. Status chega ao main.ts → frontend
```

---

## Melhorias de UX

### Antes:
```
┌─────────────────────┐
│  0% ████            │
│                     │
│ Aguardando...       │
│                     │
│ [processo travado]  │
│                     │
│ [depois de 30s]     │
│ 100% ███████████    │
└─────────────────────┘
```

### Depois:
```
┌─────────────────────┐
│  15% █████          │
│                     │
│ 08:49:57 Iniciando… │
│ 08:49:58 Carregand. │
│ 08:49:59 Backend OK │
│                     │
│ ✓ Backend conectado │
│                     │
│ 100% ███████████    │
└─────────────────────┘
```

---

## Validação

### Build Status:
- ✅ TypeScript compilation: SUCCESS
- ✅ ESLint validation: 0 errors, 2 non-critical warnings
- ✅ Frontend build: SUCCESS
- ✅ Electron build: SUCCESS
- ✅ Backend build: SUCCESS

### Funcionalidade:
- ✅ IPC communication estabelecida
- ✅ Status updates chegam ao frontend
- ✅ LoadingScreen mostra progresso
- ✅ Sem travamentos ou delays excessivos

---

## Próximas Melhorias (Opcional)

1. **Mais detalhamento de progresso**:
   - Detectar fases específicas do backend na saída
   - Emitir eventos intermediários com progresso (25%, 50%, 75%)

2. **Retry automático**:
   - Se backend falhar, tentar novamente
   - Mostrar contador de tentativas

3. **Timeout configurável**:
   - Permitir que o usuário configure timeout da espera
   - Sair do loop de espera após X tentativas

4. **Analytics**:
   - Registrar quanto tempo leva para iniciar
   - Identificar gargalos de performance

---

## Arquivos Modificados

| Arquivo | Linhas | Tipo | Mudança |
|---------|--------|------|---------|
| `frontend/src/components/LoadingScreen/LoadingScreen.tsx` | ~200 | Feature | Novo sistema de status com progresso contínuo |
| `electron/modules/ipc-handlers.ts` | 13-18 | Fix | Listener correto para backend:getStatus |
| `electron/main.ts` | 75-77 | Feature | Conexão de callbacks BackendManager→IPC |
| `electron/modules/backend-manager.ts` | 77-91 | Feature | Detecção de progresso na saída do processo |
| `electron/preload.ts` | - | - | Sem mudanças (API já correta) |

---

## Conclusão

A tela de loading agora fornece feedback visual contínuo durante a inicialização do backend, eliminando a experiência de "travamento" anterior. O fluxo de comunicação IPC foi corrigido para garantir que status updates chegam corretamente ao frontend em tempo real.
