# ⚡ Teste Específico - isDirty

## 🚀 Teste em 2 Minutos

### Passo 1: Abrir Console
- **F12** → Console
- Limpar logs anteriores

### Passo 2: Criar Novo Cliente
```
1. Clique em "Novo Cliente"
2. Observe os logs de abertura
```

Esperado:
```
[ClienteForm] Componente montado { modo: 'criação' }
[ClienteForm] Reset chamado com defaultValues { temDados: false, isDirty: false }
[Modal] Estado mudou { isOpen: 'ABERTO', hasChanges: 'SEM MUDANÇAS' }
```

### Passo 3: Digitar no Campo "Nome Completo"
```
Digite: "João da Silva"
```

Procure por estes logs **IN ORDER**:

```
[ClienteForm] Input clicado: nome_completo
[ClienteForm] Valor mudou: nome_completo "João"
[ClienteForm] Valor mudou: nome_completo "João "
[ClienteForm] Valor mudou: nome_completo "João d"
[ClienteForm] Valor mudou: nome_completo "João da"
[ClienteForm] Valor mudou: nome_completo "João da "
[ClienteForm] Valor mudou: nome_completo "João da Silva"
[ClienteForm] VALORES OBSERVADOS (watch) {
  nomeCompleto: "João da Silva",
  cpfCnpj: "",
  email: "",
  isDirty: ???  ← CRÍTICO: Verifique este valor!
}
```

### 🔴 Se isDirty Continuar false:

```
isDirty: false  ← PROBLEMA AQUI!
```

**Significa**: O react-hook-form não está detectando a mudança como "suja"

### ✅ Se isDirty Mudar para true:

```
isDirty: true  ← BOM!
[ClienteForm] Estado isDirty mudou { isDirty: true }
[ClienteForm] Notificando pai: isDirty=true
[Modal] Estado mudou { isOpen: 'ABERTO', hasChanges: 'COM MUDANÇAS' }
```

**Significa**: A detecção funciona, mas há outro problema (talvez no Modal ou na propagação)

---

### Passo 4: Clicar no X

Se `isDirty: true` apareceu:
```
[Modal] handleClose chamado { hasChanges: true, temOnRequestClose: true }
[Modal] Chamando onRequestClose fornecido pelo pai
(Dialog deve aparecer)
```

Se `isDirty: false` apareceu:
```
[Modal] handleClose chamado { hasChanges: false }
[Modal] Modal sem alterações (hasChanges=false), fechando normalmente
(Modal fecha SEM dialog) ❌
```

---

## 🎯 Possíveis Resultados

### Cenário A: FUNCIONANDO ✅
```
[ClienteForm] Valor mudou: nome_completo "João da Silva"
[ClienteForm] VALORES OBSERVADOS { isDirty: true }
[ClienteForm] Estado isDirty mudou { isDirty: true }
[Modal] Estado mudou { hasChanges: 'COM MUDANÇAS' }
[Modal] handleClose chamado { hasChanges: true }
(Dialog aparece) ✓
```

### Cenário B: isDirty NÃO MUDA ❌
```
[ClienteForm] Valor mudou: nome_completo "João da Silva"
[ClienteForm] VALORES OBSERVADOS { isDirty: false }  ← PROBLEMA!
(Nada mais aparece relacionado a isDirty)
[Modal] handleClose chamado { hasChanges: false }
(Modal fecha sem dialog) ✗
```

### Cenário C: isDirty MUDA mas Modal Não Vê ❌
```
[ClienteForm] Estado isDirty mudou { isDirty: true }
[ClienteForm] Notificando pai: isDirty=true
[Modal] Estado mudou { hasChanges: 'SEM MUDANÇAS' }  ← PROBLEMA!
(Modal ainda mostra SEM MUDANÇAS apesar de pai notificar)
```

---

## 📝 Log Crítico

**ESTE LOG É O MAIS IMPORTANTE**:

```
[ClienteForm] VALORES OBSERVADOS (watch) {
  nomeCompleto: "João da Silva",
  cpfCnpj: "",
  email: "",
  isDirty: ???
}
```

Se aparecer com `isDirty: false` mesmo depois de digitar = **AQUI ESTÁ O PROBLEMA**

---

## 🚀 O Que Fazer

1. Fazer este teste
2. Procurar pelo log: `[ClienteForm] VALORES OBSERVADOS`
3. **COPIAR** o log completo
4. **COMPARTILHAR** comigo

Com esse log, vou saber exatamente:
- Se isDirty está mudando
- Se está mudando no tempo certo
- Se o problema é no react-hook-form ou na propagação

---

## 💡 Dica

Se preferir, pode usar este filter no console para ver apenas os logs importantes:

```javascript
// No Console, digite:
filter = (msg) => msg.includes('VALORES OBSERVADOS') || msg.includes('isDirty');
```

Depois todos os logs serão filtrados para mostrar apenas esses dois.
