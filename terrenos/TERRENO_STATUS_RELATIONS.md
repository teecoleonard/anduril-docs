# 📊 Relações Completas de Status de Terrenos

## ✅ Todos os 3 Status com Funções

| # | Status | Valor BD | Cor | Função | Automático | 
|---|--------|----------|-----|--------|-----------|
| 1 | DISPONIVEL | `disponivel` | 🟢 Verde | Terreno pronto para venda | ❌ Não |
| 2 | RESERVADO | `reservado` | 🟡 Amarelo | Terreno com interesse/pré-reserva | ❌ Manual |
| 3 | VENDIDO | `vendido` | 🔴 Vermelho | Terreno com contrato criado | ✅ Automático |

---

## 🔄 Fluxo de Status dos Terrenos

### Estados Iniciais
```
Novo Terreno → Status: DISPONIVEL (verde)
```

### Transições Possíveis

#### ✅ De DISPONIVEL:
- `DISPONIVEL → RESERVADO` (usuário marca como pré-reservado)
- `DISPONIVEL → VENDIDO` (contrato criado automaticamente)

#### ✅ De RESERVADO:
- `RESERVADO → DISPONIVEL` (cancela reserva)
- `RESERVADO → VENDIDO` (contrato criado automaticamente)

#### ✅ De VENDIDO:
- `VENDIDO → DISPONIVEL` (APENAS se contrato for CANCELADO)
- Permanece `VENDIDO` em todas outras situações

---

## 📋 Matriz de Transições de Status

### ✅ Transições Permitidas

```
DISPONIVEL ↔ RESERVADO   (usuário pode reservar/cancelar reserva)
DISPONIVEL → VENDIDO     (ao criar contrato)
RESERVADO → DISPONIVEL   (ao cancelar reserva)
RESERVADO → VENDIDO      (ao criar contrato)
VENDIDO → DISPONIVEL     (APENAS ao cancelar contrato vinculado)
```

### ❌ Transições BLOQUEADAS

```
VENDIDO → X              (bloqueado se houver contratos ativos)
RESERVADO → VENDIDO      (se já existe contrato)
```

---

## 🔗 Relações com Contratos

### Criação de Contrato
**Quando:** Um novo contrato é criado
**Ação Automática:**
```
Terreno status muda para: VENDIDO (vermelho)
```

**Fluxo:**
```
Terreno = DISPONIVEL ou RESERVADO
    ↓
Usuário cria contrato
    ↓
Terreno = VENDIDO (automático)
Contrato = ATIVO
```

### Cancelamento de Contrato
**Quando:** Contrato é mudado para status CANCELADO
**Ação Automática:**
```
Terreno vinculado volta para: DISPONIVEL (verde)
```

**Fluxo:**
```
Terreno = VENDIDO (contrato ativo)
    ↓
Usuário cancela contrato
    ↓
Contrato = CANCELADO
Terreno = DISPONIVEL (liberado)
```

### Finalização de Contrato
**Quando:** Contrato é mudado para status FINALIZADO
**Ação:** Terreno MANTÉM status VENDIDO

```
Terreno = VENDIDO (contrato finalizado)
Status não muda - terreno permanece vendido
```

### Contrato Vencido/Inadimplente
**Quando:** Contrato está em VENCIDO ou INADIMPLENTE
**Ação:** Terreno MANTÉM status VENDIDO

```
Terreno = VENDIDO (contrato vencido/inadimplente)
Status não muda - terreno permanece vendido
```

---

## 💾 Dados Necessários para Cada Status

| Status | Dados Necessários | Contexto |
|--------|------------------|---------|
| DISPONIVEL | Código, área, preço | Terreno pronto no estoque |
| RESERVADO | Código, área, preço + observação | Tem interesse de cliente |
| VENDIDO | Código + contrato_id vinculado | Tem contrato ativo |

---

## 📱 Tabela de Cores e Significado

| Status | Cor | Hex | Significado | Ação Recomendada |
|--------|-----|-----|------------|-----------------|
| DISPONIVEL | 🟢 Verde | #28a745 | Pronto para vender | Incluir em promoções |
| RESERVADO | 🟡 Amarelo | #ffc107 | Interesse de cliente | Negociar e converter |
| VENDIDO | 🔴 Vermelho | #dc3545 | Contrato ativo | Gerenciar contrato |

---

## 🎯 Regras de Negócio

### Regra 1: VENDIDO é Terminal (com exceção)
```
Uma vez VENDIDO, o terreno não pode voltar a DISPONIVEL 
EXCETO quando o contrato vinculado é CANCELADO.
```

### Regra 2: Verificação de Contratos Ativos
```
Para mudar de VENDIDO para outro status:
- Sistema verifica se há contratos com status='ativo'
- Se SIM → Bloqueia transição
- Se NÃO → Permite mudança
```

### Regra 3: Criação de Contrato
```
Quando contrato é criado:
1. Verifica se terreno está DISPONIVEL (ou RESERVADO)
2. Tenta mudar terreno para VENDIDO
3. Se sucesso → contrato é criado
4. Se falha → contrato não é criado
```

### Regra 4: Cancelamento de Contrato
```
Quando contrato é cancelado:
1. Terreno vinculado volta a DISPONIVEL automaticamente
2. Terreno fica pronto para novo contrato
```

---

## 🧪 Exemplo de Ciclo Completo

### Cenário 1: Venda Completa
```
19/01 → Terreno criado → Status: DISPONIVEL (verde) - Em estoque
        ↓
        Usuário marca como: RESERVADO (amarelo) - Há interesse
        ↓
        Cliente fecha contrato → Status: VENDIDO (vermelho) - Vendido
        ↓
        Contrato finalizado após pagamento completo
        ↓
        Terreno permanece: VENDIDO (fechado)
```

### Cenário 2: Cancelamento de Contrato
```
19/01 → Terreno: DISPONIVEL → Contrato criado → VENDIDO
        ↓
        Contrato de 60 parcelas ativas
        ↓
        Cliente solicita cancelamento
        ↓
        Usuário muda status contrato para: CANCELADO
        ↓
        Terreno volta automaticamente para: DISPONIVEL (verde)
        ↓
        Terreno fica pronto para novo contrato
```

### Cenário 3: Reserva Cancelada
```
19/01 → Terreno: DISPONIVEL
        ↓
        Usuário marca: RESERVADO (interesse de cliente)
        ↓
        Cliente desiste da compra
        ↓
        Usuário volta para: DISPONIVEL
        ↓
        Terreno volta ao estoque
```

---

## 🔐 Proteções do Sistema

### Proteção 1: Integridade de Dados
```
Não permite mudar terreno para VENDIDO 
se o terreno já tem contrato ativo
```

### Proteção 2: Bloqueio de Reversão
```
Não permite mudar de VENDIDO para outro status
se há contratos com status='ativo' vinculados
```

### Proteção 3: Validação Automática
```
Quando contrato é criado:
- Sistema verifica status do terreno
- Se não for DISPONIVEL/RESERVADO → Erro
- Se SIM → Muda para VENDIDO
```

---

## 📊 Comparação: Terreno vs Contrato

| Aspecto | Terreno | Contrato |
|--------|---------|----------|
| # Status | 3 | 7 |
| Status Finais | VENDIDO | FINALIZADO, CANCELADO |
| Reversão Possível | SIM (VENDIDO→DISPONIVEL se cancelado) | SIM (manual apenas) |
| Auto-atualização | Sim (via contrato) | Sim (via datas) |
| Cores | Verde/Amarelo/Vermelho | 7 cores diferentes |
| Independência | Depende de Contrato | Independente |

---

## 🔀 Fluxo Integrado Terreno + Contrato

```
TERRENO ESTOQUE          CONTRATO
═══════════════════════════════════════════════════

DISPONIVEL ──┐
             │ usuário cria contrato
             ↓
            VENDIDO ←──────────────── ATIVO (verde)
                               ↓
                        A_VENCER (amarelo)
                               ↓
                         INADIMPLENTE (laranja)
                               ↓
                           VENCIDO (vermelho)
                               ↓
                         FINALIZADO (azul)


             CANCELADO contrato
               ↑
DISPONIVEL ←──┘
(liberado)
```

---

## 📌 Resumo

✅ **3 status totais de terreno**
- `DISPONIVEL` - Pronto para venda
- `RESERVADO` - Pré-venda/interesse
- `VENDIDO` - Contrato ativo

✅ **Transições Permitidas:**
- DISPONIVEL ↔ RESERVADO (manual)
- Qualquer um → VENDIDO (ao criar contrato)
- VENDIDO → DISPONIVEL (ao cancelar contrato)

✅ **Proteções:**
- VENDIDO é bloqueado se houver contratos ativos
- Contratos ativos impedem reversão
- Cancelamento de contrato libera terreno automaticamente

✅ **Integração com Contratos:**
- Terreno vai para VENDIDO quando contrato é criado
- Terreno volta para DISPONIVEL quando contrato é cancelado
- Outros status de contrato NÃO afetam terreno

✅ **UI/Cores:**
- Verde: DISPONIVEL - Ação: Vender
- Amarelo: RESERVADO - Ação: Converter/Cancelar
- Vermelho: VENDIDO - Ação: Gerenciar contrato

---
