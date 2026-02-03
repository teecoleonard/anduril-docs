# 📊 Status dos Terrenos

## 📋 Visão Geral

Os terrenos possuem três status principais que refletem sua disponibilidade no estoque: Disponível, Reservado ou Vendido.

---

## 🎯 Status Possíveis

### 🟢 **Disponível**
**Significado:** Terreno pronto para venda  
**Quando fica assim:** Quando é criado ou contrato é cancelado  
**Ações possíveis:** Criar contrato, modificar dados, vendê-lo  
**Observação:** Pode ser reservado ou vendido a qualquer momento  

---

### 🟡 **Reservado**
**Significado:** Terreno está em análise, aguardando confirmação  
**Quando fica assim:** Quando um contrato é criado (condição)  
**Ações possíveis:** Confirmar venda (→ Vendido) ou liberar (→ Disponível)  
**Observação:** Sistema alerta após 7 dias reservado sem ação  

---

### 🔴 **Vendido**
**Significado:** Terreno já tem proprietário confirmado  
**Quando fica assim:** Quando contrato é confirmado/encerrado  
**Ações possíveis:** Apenas visualizar (não pode reverter)  
**Observação:** Não aparece em lista de disponíveis  

---

## 📊 Ciclo de Vida do Terreno

```
CRIADO
    ↓
DISPONÍVEL ← [Pronto para venda]
    ↓
[Cliente interessa-se]
    ↓
RESERVADO ← [Contrato criado]
    ├─→ [7 dias sem ação?] ⚠️ ALERTA
    │   └─→ Liberar → DISPONÍVEL
    │
    └─→ [Confirmado]
        ↓
        VENDIDO ✓

OU

RESERVADO → Cancelar Contrato → DISPONÍVEL
```

---

## 💡 Entendendo Cada Status

### ✅ **DISPONÍVEL** - Pronto para Venda

```
Código: TER-001
Status: 🟢 DISPONÍVEL
Localização: Rua Das Flores, Lote 5, Quadra A
Área: 500 m²
Preço: R$ 50.000,00
Preço/m²: R$ 100,00
```

**O que fazer:**
- Pode vender para cliente
- Pode criar contrato
- Dados podem ser modificados

**Próximo passo típico:**
- Criar contrato com cliente
- Terreno muda para RESERVADO

---

### 🟡 **RESERVADO** - Em Análise

```
Código: TER-001
Status: 🟡 RESERVADO
Contrato: 001 (Cliente: João Silva)
Data da Reserva: 01/02/2026
Dias Reservado: 2 dias
Situação: Aguardando confirmação
```

**O que fazer:**
- Acompanhar contrato
- Verificar se está avançando
- **Se > 7 dias:** Entrar em contato com cliente

**Próximos passos:**
- ✅ Confirmar compra → VENDIDO
- ❌ Cliente desistir → DISPONÍVEL (liberar)

---

### 🔴 **VENDIDO** - Transação Finalizada

```
Código: TER-001
Status: 🔴 VENDIDO
Cliente: João Silva
Contrato: 001 (Encerrado)
Data de Venda: 10/02/2026
Preço Final: R$ 50.000,00
```

**O que fazer:**
- Manter histórico
- Não pode ser reutilizado
- Arquivo para referência

**Status final:** Não reverte

---

## ⚠️ Sistema de Alertas

### Alerta de Terreno Reservado > 7 Dias

**O que é:**
Sistema notifica quando terreno fica reservado por mais de 7 dias sem confirmação.

**Por que alerta:**
- Liberar para outro cliente
- Contato com cliente sobre reserva
- Evitar terreno "preso" indefinidamente

**Como funciona:**
1. Contrato criado → Terreno vai para RESERVADO
2. 7 dias passam → ⚠️ ALERTA
3. Você recebe notificação no dashboard
4. Ação esperada: Liberar ou confirmar

**Dados do alerta:**
```
⚠️ 3 terreno(s) reservado(s) há mais de 7 dias
- TER-001: 15 dias (Cliente: João Silva)
- TER-005: 8 dias (Cliente: Maria Santos)
- TER-012: 12 dias (Cliente: Pedro Costa)

Recomendação: Verifique contratos e libere ou confirme
```

---

## 🔄 Transições de Status

```
┌──────────────┐
│ DISPONÍVEL   │ ← Criado ou Liberado
└──────┬───────┘
       │ Criar Contrato
       ↓
┌──────────────┐
│ RESERVADO    │ ← 7 dias aqui?
├──────┬───────┤    ⚠️ ALERTA!
│ 1    │ 2     │
├──────┴───────┤
│ Cancelar     │ Confirmar
│ Contrato     │ Venda
└──────┬───────┘
       │ Liberar
       ↓
┌──────────────┐
│ DISPONÍVEL   │
└──────────────┘

       OU

┌──────────────┐
│ RESERVADO    │
├──────────────┤
│ Confirmar    │
│ Venda        │
└──────┬───────┘
       ↓
┌──────────────┐
│ VENDIDO ✓    │ (final)
└──────────────┘
```

---

## 📈 Estatísticas de Terrenos

Sistema fornece dashboard com:

```
Total de Terrenos: 50
├─ 🟢 Disponíveis: 30
├─ 🟡 Reservados: 15
│   ├─ < 7 dias: 10
│   └─ > 7 dias: 5 ⚠️
└─ 🔴 Vendidos: 5

Valor Total em Estoque: R$ 1.500.000,00
Valor em Terrenos Disponíveis: R$ 900.000,00
```

---

## 🔍 Como Verificar Status de Terreno

1. Vá para **Terrenos**
2. Lista mostra status com cores:
   - 🟢 Verde = Disponível
   - 🟡 Amarelo = Reservado
   - 🔴 Vermelho = Vendido
3. Clique para ver detalhes:
   - Dados do terreno
   - Contrato vinculado
   - Histórico

---

## 💼 Casos de Uso

### Caso 1: Venda Normal
```
1. TER-001 criado → DISPONÍVEL
2. Cliente interessa-se
3. Contrato criado → RESERVADO
4. Cliente confirma → VENDIDO ✓
```

### Caso 2: Cliente Desiste
```
1. TER-005 → RESERVADO (contrato criado)
2. 3 dias depois, cliente desiste
3. Contrato cancelado → DISPONÍVEL
4. Outro cliente pode comprar
```

### Caso 3: Terreno Esquecido
```
1. TER-010 → RESERVADO
2. 8 dias passam (sem ação)
3. ⚠️ ALERTA gerado
4. Você libera manualmente → DISPONÍVEL
5. Ou confirma venda → VENDIDO
```

---

## 📊 Relatório de Status

**Você pode:**
- Filtrar por status
- Ver terrenos por região
- Analisar valor em estoque
- Rastrear reservas antigas
- Exportar para Excel

---

## 📸 Campos de Referência

Cada terreno tem:
- 🆔 **ID único** - Gerado automaticamente
- 🏷️ **Código** - Identificador (ex: TER-001)
- 📝 **Descrição** - Nome/detalhes
- 📍 **Localização** - Logradouro, lote, quadra
- 📐 **Área** - Metragem em m²
- 💰 **Preço** - Valor de venda
- 📊 **Status** - Disponível/Reservado/Vendido
- 📅 **Data de Status** - Quando mudou
- 🔗 **Contrato Vinculado** - Se houver

---

**[Voltar ao README de Terrenos](./README.md)**
