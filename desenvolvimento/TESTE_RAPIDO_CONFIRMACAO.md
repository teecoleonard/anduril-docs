# ⚡ Teste Rápido - Confirmação de Fechamento

## 🚀 Em 1 Minuto

### Passo 1: Abrir Console
- Pressione **F12** no navegador
- Vá para aba **Console**

### Passo 2: Teste de Criação
```
1. Clique em "Novo Contrato"
2. Digite um número no campo (ex: "CT-001")
3. Veja no console:
   → [ClienteForm] Valor mudou: numero_contrato "CT-001"
   → [Modal] Estado mudou { isOpen: "ABERTO", hasChanges: "COM MUDANÇAS" }
```

### Passo 3: Tente Fechar COM MUDANÇAS
```
1. Clique no X do modal
2. Procure por:
   → [Modal] handleClose chamado { hasChanges: true, temOnRequestClose: true }
   → [Modal] Modal tem alterações não salvas
   → Aparece DIALOG: "Você tem alterações não salvas..."
```

### Resultado Esperado:
- Dialog deve APARECER ✅
- Clicar CANCELAR = modal continua aberto ✅
- Clicar CONFIRMAR = modal fecha ✅

---

## 🔴 Se Não Funcionar

### Cenário 1: Dialog NÃO Aparece
**Log que vê**:
```
[Modal] handleClose chamado { hasChanges: false }
```
**Causa**: `isDirty` não está true
**Verificação**: Procure por `[ClienteForm] Valor mudou` quando digita

---

### Cenário 2: Dialog Aparece MAS Não Funciona
**Log que vê**:
```
[Contratos] Usuário cancelou fechamento no CREATE
[Modal] Chamando onClose para fechar o modal  ← ERRADO! Deveria retornar
```
**Causa**: Bug na lógica do Modal
**Solução**: Corrigir handleClose()

---

## ✅ Teste Completo (2 minutos)

```javascript
// Copie e cole no Console para ver logs em tempo real:
console.log('%c=== TESTE DE CONFIRMAÇÃO INICIADO ===', 'background: #222; color: #fff; padding: 10px;');

// Filtrar apenas logs do Modal e páginas
const originalLog = console.log;
console.log = function(...args) {
  const str = String(args[0]);
  if (str.includes('[Modal]') || str.includes('[Contratos]') || str.includes('[ClienteForm]')) {
    originalLog.apply(console, args);
  }
};
```

Depois:
1. Crie novo contrato
2. Digite algo
3. Clique em X
4. Observe os logs filtrados

---

## 📊 Logs a Procurar

| Ação | Log Esperado | Status |
|------|--------------|--------|
| Abrir modal | `[Modal] Estado mudou { isOpen: "ABERTO" }` | ✓ |
| Digitar no formulário | `[ClienteForm] Valor mudou` | ✓ |
| Modal sabe de mudanças | `[Modal] hasChanges: "COM MUDANÇAS"` | ✓ |
| Clicar X | `[Modal] handleClose chamado` | ✓ |
| Dialog aparece | `[Contratos] onRequestClose chamado` | ✓ |
| Clicar CANCELAR | Modal permanece aberto | ✓ |
| Clicar CONFIRMAR | Modal fecha | ✓ |

---

## 🎯 Conclusão

Se conseguir marcar **todos os ✓** acima = **Sistema está OK**
Se faltar algum = **Problema identificado naquele ponto**
