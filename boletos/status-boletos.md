# 📊 Status dos Boletos

## 📋 Visão Geral

Os boletos possuem diferentes status que refletem seu estágio no processo de cobrança: desde abertura até liquidação ou cancelamento.

---

## 🎯 Status Possíveis

### 🟢 **Aberto**
**Significado:** Boleto criado e aguardando pagamento  
**Quando fica assim:** Quando é criado  
**Ações possíveis:** Enviar para cliente, enviar CNAB, liquidar manualmente, cancelar  
**Observação:** Cliente pode pagar a qualquer momento  

---

### 🔵 **Enviado**
**Significado:** Boleto foi incluído em remessa CNAB e enviado ao banco  
**Quando fica assim:** Quando remessa é gerada com este boleto  
**Ações possíveis:** Aguardar pagamento ou retorno, cancelar  
**Observação:** Não pode mais ser editado (enviado ao banco)  

---

### ✅ **Pago**
**Significado:** Banco confirmou recebimento do pagamento  
**Quando fica assim:** Quando retorno CNAB confirma o pagamento  
**Ações possíveis:** Apenas visualizar  
**Observação:** Pode ser liquidado manualmente antes de CNAB  

---

### ❌ **Cancelado**
**Significado:** Boleto foi cancelado e não será cobrado  
**Quando fica assim:** Quando você cancela manualmente  
**Ações possíveis:** Nenhuma (histórico mantido)  
**Observação:** Se necessário, gere novo boleto  

---

### ⚠️ **Vencido**
**Significado:** Data de vencimento passou sem pagamento  
**Quando fica assim:** Automaticamente quando data vencer  
**Ações possíveis:** Criar novo boleto ou entrar em contato com cliente  
**Observação:** Banco pode ainda aceitar, mas com multa  

---

## 📊 Ciclo de Vida do Boleto

```
CRIADO (Aberto)
    ↓
[Opções Disponíveis]
├─→ Enviar para Cliente
├─→ Incluir em Remessa CNAB → ENVIADO
├─→ Liquidar Manualmente → PAGO ✓
└─→ Cancelar → CANCELADO ❌

OU

ENVIADO [Aguardando Banco]
    ├─→ [Vence sem pagar?] → VENCIDO ⚠️
    │   └─→ Criar novo boleto
    │
    └─→ [Cliente Paga] → PAGO ✓
        (via retorno CNAB)
```

---

## 💡 Entendendo Cada Status

### ✅ **ABERTO** - Recém Criado

```
Boleto: 0001
Cliente: João Silva
Valor: R$ 5.000,00
Vencimento: 28/02/2026
Status: 🟢 ABERTO
Data de Criação: 01/02/2026
Contrato: 001
```

**O que fazer:**
- Pode ser modificado ainda
- Pode ser cancelado
- Pode ser incluído em remessa CNAB
- Pode ser enviado ao cliente

**Próximos passos típicos:**
1. Incluir em remessa CNAB
2. Enviar remessa ao banco
3. Aguardar pagamento

---

### 🔵 **ENVIADO** - Na Remessa CNAB

```
Boleto: 0001
Cliente: João Silva
Valor: R$ 5.000,00
Vencimento: 28/02/2026
Status: 🔵 ENVIADO
Data de Envio: 05/02/2026
Remessa: REM-20260205-001
Banco: Sicoob (756)
```

**O que fazer:**
- Não pode mais ser editado
- Aguardar pagamento ou retorno
- Acompanhar no banco

**Próximo passo:**
- Banco retorna confirmação
- Status muda para PAGO ou VENCIDO

---

### ✔️ **PAGO** - Recebimento Confirmado

```
Boleto: 0001
Cliente: João Silva
Valor: R$ 5.000,00
Data de Vencimento: 28/02/2026
Data de Pagamento: 25/02/2026
Status: ✅ PAGO
Método: CNAB Retorno
Confirmado em: 26/02/2026
```

**O que fazer:**
- Nada (cobrança encerrada)
- Manter histórico

**Observação:**
- Pode ser pago antes do vencimento (sem multa)
- Pode ser pago no vencimento (normal)
- Pode ser pago com atraso (com multa)

---

### ⚠️ **VENCIDO** - Passou Data

```
Boleto: 0001
Cliente: João Silva
Valor: R$ 5.000,00
Data de Vencimento: 28/02/2026
Status: ⚠️ VENCIDO
Dias Vencido: 8 dias
```

**O que fazer:**
- Entrar em contato com cliente
- Exigir pagamento com multa/juros
- Criar novo boleto se necessário
- Pode colocar na justiça

**Observação:**
- Banco pode aceitar pagamento
- Mas cliente paga multa + juros
- Importante não deixar sem ação

---

### ❌ **CANCELADO** - Não Será Cobrado

```
Boleto: 0001
Cliente: João Silva
Valor: R$ 5.000,00
Status: ❌ CANCELADO
Data de Cancelamento: 15/02/2026
Motivo: Cliente desistiu
```

**O que fazer:**
- Se necessário, criar novo boleto
- Manter histórico para referência

---

## 📈 Estatísticas de Boletos

Sistema mostra no dashboard:

```
Total de Boletos: 100
├─ 🟢 Abertos: 20
├─ 🔵 Enviados: 45
├─ ✅ Pagos: 30
├─ ⚠️ Vencidos: 4
└─ ❌ Cancelados: 1

Valor Total: R$ 500.000,00
├─ A Receber: R$ 325.000,00
├─ Pago: R$ 150.000,00
└─ Cancelado: R$ 25.000,00
```

---

## 🔍 Como Verificar Status de Boleto

1. Vá para **Boletos**
2. Lista mostra todos os boletos
3. Coluna de **Status** com cores:
   - 🟢 Verde = Aberto
   - 🔵 Azul = Enviado
   - ✅ Verde escuro = Pago
   - ⚠️ Amarelo = Vencido
   - ❌ Vermelho = Cancelado
4. Clique para ver detalhes completos

---

## ⚠️ Alertas Importantes

| Situação | Alerta | Ação |
|----------|--------|------|
| Boleto vencido há 3+ dias | 🔴 Crítico | Cobrar cliente |
| Boleto vence amanhã | 🟡 Atenção | Confirmar recebimento |
| Boleto enviado há 15+ dias | ℹ️ Info | Verificar no banco |
| Muitos boletos vencidos | 🔴 Crítico | Revisar processos |

---

## 💼 Casos de Uso

### Caso 1: Cobrança Normal
```
1. Boleto criado → ABERTO
2. Incluído em remessa → ENVIADO
3. Banco processa (1-2 dias)
4. Cliente paga → PAGO ✓
```

### Caso 2: Pagamento Antecipado
```
1. Boleto criado (vence em 28 dias) → ABERTO
2. Cliente paga em 15 dias → PAGO ✓
3. Sem multa (pagamento antecipado)
```

### Caso 3: Cliente Inadimplente
```
1. Boleto criado → ABERTO
2. Enviado → ENVIADO
3. Vence sem pagar → VENCIDO ⚠️
4. Ação esperada: Cobrar com multa/juros
```

### Caso 4: Boleto Cancelado
```
1. Boleto criado → ABERTO
2. Cliente desiste
3. Você cancela → CANCELADO ❌
4. Gera novo boleto se necessário
```

---

## 🔄 Transições Possíveis

```
            ABERTO
            ├─ ❌ CANCELADO (sem ação)
            ├─ ✅ PAGO (liquidar manualmente)
            └─ 🔵 ENVIADO (remessa CNAB)
                  ├─ ✅ PAGO (cliente paga)
                  └─ ⚠️ VENCIDO (data passou)
                      └─ ✅ PAGO (com multa)
```

**Regra:** Não é possível sair de PAGO ou CANCELADO

---

## 📊 Relatório de Boletos

**Você pode:**
- Filtrar por status
- Ver por cliente
- Ver por contrato
- Análise de inadimplência
- Exportar para Excel
- Gerar remessas a partir de boletos

---

## 📸 Campos de Referência

Cada boleto tem:
- 🆔 **ID único** - Número do boleto
- 👤 **Cliente** - Nome de quem vai pagar
- 🏞️ **Terreno** - Se vinculado a contrato
- 💰 **Valor** - Quanto deve pagar
- 📅 **Vencimento** - Data limite
- 📊 **Status** - Situação atual
- 🔗 **Contrato** - Qual contrato originou
- 🏦 **Remessa** - Se foi enviada ao banco
- 📝 **Observações** - Notas importantes

---

**[Voltar ao README de Boletos](./README.md)**
