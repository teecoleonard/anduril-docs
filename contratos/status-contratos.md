# 📊 Status dos Contratos

## 📋 Visão Geral

Os contratos possuem diferentes status que refletem seu estágio no ciclo de vida: desde criação até encerramento ou cancelamento.

---

## 🎯 Status Possíveis

### 🟢 **Ativo**
**Significado:** Contrato vigente e com boletos sendo gerados  
**Quando fica assim:** Quando é criado ou confirmado  
**Ações possíveis:** Gerar boletos, modificar dados, cancelar  
**Observação:** Boletos são gerados conforme as datas  

---

### 🟡 **Suspenso**
**Significado:** Contrato temporariamente inativo  
**Quando fica assim:** Quando você marca como suspenso  
**Ações possíveis:** Reativar, cancelar ou esperar  
**Observação:** Boletos não são gerados automaticamente  

---

### 🟢 **Encerrado**
**Significado:** Todas as parcelas foram pagas  
**Quando fica assim:** Quando última parcela é quitada  
**Ações possíveis:** Visualizar histórico apenas  
**Observação:** Terreno fica disponível novamente  

---

### 🔴 **Cancelado**
**Significado:** Contrato foi desativado permanentemente  
**Quando fica assim:** Quando você cancela manualmente  
**Ações possíveis:** Nenhuma (histórico mantido)  
**Observação:** Terreno retorna ao status "Disponível"  

---

## 📊 Ciclo de Vida do Contrato

```
CRIADO (Ativo)
    ↓
[Gerar Boletos Regularmente]
    ↓
BOLETOS ABERTOS/ENVIADOS
    ↓
[Clientes Pagam]
    ↓
BOLETOS PAGOS
    ↓
[Última Parcela Paga?]
    ├─→ NÃO → Voltar para BOLETOS ABERTOS
    └─→ SIM → ENCERRADO ✓
    
OU

QUALQUER ESTADO → CANCELADO (manual)
```

---

## 💡 Entendendo Cada Status

### ✅ Quando Contrato está **ATIVO**

```
Cliente: João Silva
Terreno: TER-001
Valor: R$ 50.000,00
Parcelas: 12
Status Boletos: 
  - 3 Pagos
  - 2 Vencidos
  - 7 Abertos (próximos)
```

**O que fazer:**
- Acompanhar vencimentos
- Verificar pagamentos
- Gerar remessas CNAB
- Alertar cliente se vencer

---

### ⏸️ Quando Contrato está **SUSPENSO**

```
Motivo: Cliente em atraso
Ação Esperada: Resolver atraso
Sistema: Não gera boletos novos
```

**O que fazer:**
- Cobrar cliente
- Resolver pendência
- Reativar quando resolvido

---

### ✔️ Quando Contrato está **ENCERRADO**

```
Data de Encerramento: 15/02/2026
Total Recebido: R$ 50.000,00
Status: 100% Pago
Terreno: Agora vendido
```

**O que fazer:**
- Arquivo para histórico
- Não precisa mais de ações

---

### ❌ Quando Contrato está **CANCELADO**

```
Data de Cancelamento: 10/02/2026
Motivo: Cliente desistiu
Terreno: Retornou ao status Disponível
```

**O que fazer:**
- Manter histórico
- Pode vender terreno novamente

---

## 🔄 Transições Possíveis

```
ATIVO ↔️ SUSPENSO ← → CANCELADO
  ↓
ENCERRADO (fim)
```

**Regra:** Não é possível sair de ENCERRADO ou CANCELADO

---

## ⚠️ Alertas Importantes

| Situação | Alerta |
|----------|--------|
| Contrato com boleto vencido | ⚠️ Verificar pagamento |
| Contrato suspenso há > 30 dias | ⚠️ Resolver ou cancelar |
| Último boleto para vencer | ℹ️ Preparar encerramento |
| Terreno ainda reservado após contrato fechado | 🔴 Investigar |

---

## 🔍 Como Verificar Status de Contrato

1. Vá para **Contratos**
2. Localize o contrato na lista
3. Coluna de **Status** mostra situação atual
4. Clique para ver:
   - Dados do cliente
   - Dados do terreno
   - Lista de boletos
   - Histórico de pagamentos

---

## 📈 Relatório de Status

**Você pode filtrar contratos por:**
- Status atual (Ativo, Encerrado, etc)
- Data de criação
- Cliente
- Terreno
- Valor

---

## 💼 Caso de Uso Completo

```
1. João compra terreno TER-001 por R$ 60.000
   Status do Contrato: ATIVO
   
2. 12 boletos de R$ 5.000 são gerados
   Status dos Boletos: Aberto → Enviado → Pago
   
3. João paga 11 parcelas corretamente
   Status do Contrato: Ainda ATIVO
   
4. João paga a 12ª (última) parcela
   Status: ENCERRADO ✓
   
5. Terreno TER-001 agora: VENDIDO
```

---

## 📸 Campos de Referência

Cada contrato tem:
- 🆔 **ID único** - Gerado automaticamente
- 👤 **Cliente** - Nome do comprador
- 🏞️ **Terreno** - Código e descrição
- 💰 **Valor Total** - Valor do contrato
- 📅 **Data de Criação** - Quando foi criado
- 📊 **Parcelas** - Quantas e qual valor cada
- 📊 **Status** - Situação atual
- 🔗 **Boletos Vinculados** - Lista de boletos gerados

---

**[Voltar ao README de Contratos](./README.md)**
