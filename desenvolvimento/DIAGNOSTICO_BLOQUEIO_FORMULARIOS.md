# 🐛 Diagnóstico - Bloqueio Permanente de Inputs nos Formulários

## 📋 Problema Descrito

Ao executar uma "ação" (tentar fechar o modal com formulário com dados não salvos), o modal bloqueia permanentemente a edição dos inputs, impedindo qualquer entrada de dados.

## 🔍 Investigação Realizada

### Arquivos Analisados:
- `frontend/src/components/Modal/Modal.tsx`
- `frontend/src/pages/Contratos/Contratos.tsx`
- `frontend/src/pages/Terrenos/Terrenos.tsx`
- `frontend/src/pages/Clientes/Clientes.tsx`
- `frontend/src/components/ContratoForm/ContratoForm.tsx`
- `frontend/src/components/TerrenoForm/TerrenoForm.tsx`
- `frontend/src/components/ClienteForm/ClienteForm.tsx`

## 🎯 Root Cause Identificada

### O Problema Está em `Modal.tsx`:

O Modal usa **`document.body.style.overflow = 'hidden'`** quando abre e **`'unset'`** quando fecha. Porém, há um problema no fluxo de focus management:

```typescript
// ❌ PROBLEMA: Após confirmação do window.confirm(), o focus é restaurado 
// com um timeout de 100ms, mas isso pode acontecer enquanto o Modal 
// ainda está renderizando ou antes que o input esteja realmente acessível
setTimeout(() => {
  const firstInput = modalContentRef.current?.querySelector('input, textarea, select') as HTMLElement;
  if (firstInput) {
    firstInput.focus();
  }
}, 100);  // ← 100ms pode não ser suficiente em alguns casos
```

### Fluxo do Erro:

1. Usuário abre modal e faz alterações (hasChanges = true)
2. Usuário clica no botão X ou fora do modal para fechar
3. Modal chama `handleClose()` que verifica `if (hasChanges)`
4. Chama `onRequestClose()` que executa `window.confirm()`
5. Se confirmado, chama `handleCloseCreateModal()` ou `handleCloseEditModal()`
6. **MAS** o Modal ainda está no DOM, `overflow: hidden` ainda está ativo
7. O focus é restaurado com setTimeout, mas pode não encontrar um elemento válido
8. Resultado: inputs permanecem inacessíveis/bloqueados

## 🔧 Causa Raiz Adicional

O Modal não está fazendo **cleanup adequado** do `overflow: hidden` do body antes de restaurar o foco. O fluxo deveria ser:

1. Confirmação recebida
2. `overflow: hidden` removido do body PRIMEIRO
3. DEPOIS restaurar foco

Mas atualmente há uma race condition entre:
- `onClose()` sendo chamado (que remove `overflow: hidden` via useEffect cleanup)
- `handleClose()` tentando restaurar focus com setTimeout

## 🔴 Estados Envolvidos

### ContratoForm/TerrenoForm/ClienteForm:
```typescript
const onHasChangesChange?: (hasChanges: boolean) => void;
```

### Contratos.tsx (e similares):
```typescript
const [hasChangesCreate, setHasChangesCreate] = useState(false);
const [hasChangesEdit, setHasChangesEdit] = useState(false);

const handleCloseCreateModal = () => {
  setIsCreateModalOpen(false);
  setHasChangesCreate(false);
};
```

### Modal.tsx:
```typescript
hasChanges?: boolean;
onRequestClose?: () => void;

useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
}, [isOpen]);
```

## 🛠️ Solução Proposta

### Opção 1: Remover a Restauração Agressiva de Focus (Recomendada)

O Modal está tentando forçar o focus em um input logo após a confirmação. Isso é desnecessário e está causando o problema.

**Arquivo**: `frontend/src/components/Modal/Modal.tsx`

**Mudança**:
```typescript
// REMOVER este trecho problemático:
setTimeout(() => {
  const firstInput = modalContentRef.current?.querySelector('input, textarea, select') as HTMLElement;
  if (firstInput) {
    firstInput.focus();
  }
}, 100);
```

Isto deve ser removido de DOIS lugares:
1. Após `onRequestClose()` retornar com confirmação negativa (cancelar)
2. Após abrir o modal

### Opção 2: Melhorar Sequência de Limpeza (Complementar)

Garantir que `document.body.style.overflow` seja restaurado ANTES de tentar qualquer coisa com focus:

```typescript
const handleClose = () => {
  if (hasChanges) {
    if (onRequestClose) {
      onRequestClose();
      // NÃO tentar restaurar focus aqui
      return;
    }
    
    const confirmarFechar = window.confirm(
      'Você tem alterações não salvas. Deseja realmente fechar? O conteúdo será perdido.'
    );
    if (!confirmarFechar) {
      // Usuário cancelou - NÃO tentar restaurar focus
      return;
    }
  }
  
  // Fechar normal
  onClose();
};
```

## 📊 Impacto

- **Afetados**: Todos os formulários (ContratoForm, TerrenoForm, ClienteForm)
- **Severidade**: ALTA - Bloqueia edição permanentemente
- **Frequência**: Reproduzível ao confirmar o dialogo "descartar alterações"

## ✅ Verificações Após Correção

1. Abrir modal de criação e digitar dados
2. Tentar fechar com dados não salvos
3. Clicar CANCELAR na confirmação → inputs devem continuar editáveis ✓
4. Tentar fechar novamente e confirmar → modal fecha ✓
5. Reabrir modal → inputs devem ser editáveis ✓

---

**Status**: 🔍 Investigação Concluída
**Próximo Passo**: Implementar Solução (Opção 1 Recomendada)
