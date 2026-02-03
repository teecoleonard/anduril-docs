# 📊 Relações Completas de Status de Contratos

## ✅ Todos os 7 Status com Funções

| # | Status | Valor BD | Cor | Função | Automático | 
|---|--------|----------|-----|--------|-----------|
| 1 | ATIVO | `ativo` | 🟢 Verde | `atualizarStatusPorDataVencimento()` | ✅ Sim |
| 2 | INATIVO | `inativo` | ⚫ Cinza | Manual (usuário) | ❌ Não |
| 3 | CANCELADO | `cancelado` | ⚫ Cinza | Manual (usuário) | ❌ Não |
| 4 | FINALIZADO | `finalizado` | 🔵 Azul | Manual (usuário) | ❌ Não |
| 5 | INADIMPLENTE | `inadimplente` | 🟠 Laranja | `atualizarStatusInadimplente()` | ✅ Sim |
| 6 | A_VENCER | `a_vencer` | 🟡 Amarelo | `atualizarStatusPorDataVencimento()` | ✅ Sim |
| 7 | VENCIDO | `vencido` | 🔴 Vermelho | `atualizarStatusPorDataVencimento()` | ✅ Sim |

---

## 🔄 Fluxo Automático de Status

### 1️⃣ Função: `atualizarStatusPorDataVencimento()`
**Executada em:** `findAll()` e `findOne()` do backend

**Lógica:**
```
if (data_vencimento < hoje)
  → status = VENCIDO (vermelho)
  
else if (data_vencimento >= hoje AND data_vencimento <= hoje+30 dias)
  → status = A_VENCER (amarelo)
  
else
  → status permanece ATIVO (verde)
```

**Proteções:**
- NÃO atualiza contratos com status: `FINALIZADO`, `CANCELADO`, `INADIMPLENTE`
- Verificação executada TODA VEZ que dados são consultados

---

### 2️⃣ Função: `atualizarStatusInadimplente()`
**Executada em:** Necessário chamar manualmente ou em scheduler

**Lógica:**
```
1. PRIMEIRO: Atualizar boletos vencidos
   UPDATE boletos SET status = 'vencido' 
   WHERE status = 'aberto' AND data_vencimento < hoje

2. DEPOIS: Verificar contratos com boletos vencidos há 7+ dias
   if (contrato tem boleto com data_vencimento < hoje-7 dias)
     → status = INADIMPLENTE (laranja)
```

**Proteções:**
- NÃO atualiza contratos já em: `INADIMPLENTE`, `CANCELADO`, `FINALIZADO`
- Verifica apenas boletos com `data_vencimento < hoje-7 dias`

---

## 📋 Matriz de Transições de Status

### ✅ Transições Possíveis (Automáticas)

```
ATIVO → A_VENCER     (quando faltam ≤30 dias para vencer)
ATIVO → VENCIDO      (quando data de vencimento passou)
ATIVO → INADIMPLENTE (quando há boleto vencido >7 dias)

A_VENCER → VENCIDO   (quando data de vencimento passa)
A_VENCER → INADIMPLENTE (se houver boleto vencido >7 dias)

INADIMPLENTE → VENCIDO (quando data de vencimento passa)
```

### ❌ Transições BLOQUEADAS (Protegidas)

```
FINALIZADO → X       (nunca muda, contrato finalizado)
CANCELADO → X        (nunca muda, contrato cancelado)
VENCIDO → X          (nunca muda automaticamente após vencer)
INADIMPLENTE → X     (não volta para VENCIDO ou status anteriores)
```

### 🔧 Transições Manuais (Usuário)

```
ATIVO ↔ INATIVO      (pode desativar/reativar)
ATIVO → CANCELADO    (pode cancelar - libera terreno)
ATIVO → FINALIZADO   (pode finalizar)
A_VENCER → CANCELADO (pode cancelar - libera terreno)
VENCIDO → FINALIZADO (pode finalizar após resolver)
```

---

## 🎯 Regras de Prioridade

**Sequência Progressiva de Status:**
```
ATIVO
  ↓
A_VENCER (quando faltam ≤30 dias)
  ↓
INADIMPLENTE (quando boleto >7 dias vencido)
  ↓
VENCIDO (quando data de vencimento passa) - FINAL
```

**Regra:** Uma vez que o contrato atinge `VENCIDO`, ele não pode retroceder para `INADIMPLENTE` ou `A_VENCER`. Segue sempre a progressão linear.

**Quando Status é Recalculado:**
1. Primeiro verifica se é `FINALIZADO`, `CANCELADO`, ou `VENCIDO` → Não muda
2. Depois verifica status de boletos:
   - Se tem boleto vencido >7 dias → `INADIMPLENTE`
3. Depois verifica data de vencimento:
   - Se passou → `VENCIDO`
   - Se falta ≤30 dias → `A_VENCER`
   - Se falta >30 dias → `ATIVO`

---

## 💾 Dados Necessários para Cada Status

| Status | Dados Necessários | Gatilho |
|--------|------------------|---------|
| ATIVO | `data_vencimento` | Criação + cálculo automático |
| INATIVO | Nenhum extra | Manual do usuário |
| CANCELADO | Motivo (opcional) | Manual do usuário |
| FINALIZADO | Nenhum extra | Manual do usuário |
| INADIMPLENTE | Boletos vencidos >7 dias | Automático (boletos) |
| A_VENCER | `data_vencimento` | Automático (30 dias) |
| VENCIDO | `data_vencimento` | Automático (passou data) |

---

## 📱 Tabela de Cores e Significado

| Status | Cor | Hex | Significado |
|--------|-----|-----|------------|
| ATIVO | 🟢 Verde | #d4edda | Contrato em dia |
| INATIVO | ⚫ Cinza | #e9ecef | Contrato desativado |
| CANCELADO | ⚫ Cinza | #e9ecef | Contrato cancelado |
| FINALIZADO | 🔵 Azul | #cfe2ff | Contrato encerrado |
| INADIMPLENTE | 🟠 Laranja | #FFD699 | Contrato com atraso >7 dias |
| A_VENCER | 🟡 Amarelo | #fff3cd | ⚠️ Vence em até 30 dias |
| VENCIDO | 🔴 Vermelho | #F8D7DA | ❌ Data de vencimento passou |

---

## 🔗 Relações com Outras Entidades

### Terreno
- Quando contrato é criado → Terreno status muda de `disponivel` → `vendido`
- **Quando contrato é CANCELADO → Terreno volta a `disponivel` (liberado para venda)**
- Status do contrato NÃO afeta status do terreno em outras situações (finalizado, vencido, etc)

### Boletos
- Status `INADIMPLENTE` é gatilhado por boletos com `vencimento < hoje-7 dias`
- Boletos vencidos são atualizados automaticamente para `status='vencido'`
- Cada boleto tem seu próprio ciclo de status independente

### Reajustes (Boletos)
- Campo `indice_de_reajuste` e `data_do_ultimo_reajuste` existem
- Aplicados via endpoint `POST /contratos/:id/reajustar`
- NÃO alteram o status do contrato

---

## 🧪 Exemplo de Ciclo Completo

**Contrato criado em 19/01/2026:**
```
19/01 → Criado com data_vencimento = 08/02/2026 → Status: ATIVO
        (faltam 20 dias = dentro dos 30 dias)
        ↓
        API busca dados → atualizarStatusPorDataVencimento()
        ↓
        20 dias < 30 dias? SIM
        → Status muda para: A_VENCER (amarelo)

        
09/02 (próximo dia após vencimento):
        ↓
        API busca dados → atualizarStatusPorDataVencimento()
        ↓
        data_vencimento passou? SIM
        → Status muda para: VENCIDO (vermelho)


16/02 (7 dias depois do vencimento, boleto não pago):
        ↓
        Boleto vencido >7 dias detectado
        ↓
        atualizarStatusInadimplente() chamado
        ↓
        → Status muda para: INADIMPLENTE (laranja)
        → PERMANECE INADIMPLENTE até resolver manualmente
```

---

## 📌 Resumo

✅ **7 status totais**
- 3 automáticos baseados em datas (`ATIVO`, `A_VENCER`, `VENCIDO`)
- 1 automático baseado em boletos (`INADIMPLENTE`)
- 3 manuais/finais (`INATIVO`, `CANCELADO`, `FINALIZADO`)

✅ **2 funções principais**
- `atualizarStatusPorDataVencimento()` - Executada em cada GET
- `atualizarStatusInadimplente()` - Executada manualmente/scheduler

✅ **Proteções contra mudanças não desejadas**
- Status `FINALIZADO`, `CANCELADO`, `INADIMPLENTE` são imutáveis automaticamente
- Exigem ação manual do usuário para mudar

✅ **Integração com UI**
- Cores visuais claras para cada status
- Badges exibidas na tabela de contratos
- Atualização em tempo real ao buscar dados

---

