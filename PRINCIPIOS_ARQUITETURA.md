# 🏗️ Princípios de Arquitetura - ERP Anduril

**Status:** Documentação de Arquitetura  
**Última atualização:** 8 de Fevereiro de 2026

---

## 🎯 Princípios Fundamentais

### 1. **Sincronização Automática**

O sistema sempre mantém dados sincronizados automaticamente:

```
Quando um boleto muda de status
    ↓
saldo_devedor é RECALCULADO automaticamente
    ↓
Contrato sempre reflete a realidade
```

**Implementação:**
- Eventos no banco de dados atualizam derivados
- Transações atômicas garantem consistência
- Validações em tempo real

---

### 2. **Imutabilidade de Transações**

Uma vez que uma transação é registrada (como um boleto**, ela NUNCA muda:

```
Boleto criado em 01/01/2026 por R$ 3.333,33
    ↓
Mesmo que reajuste em 02/02/2026
    ↓
Boleto CONTINUA R$ 3.333,33
```

**Benefícios:**
- Auditoria clara
- Histórico confiável
- Cálculos determinísticos

---

### 3. **Dados Derivados vs Armazenados**

Distingue entre dados que são **calculados** vs dados que são **armazenados**:

#### Armazenados (Mutáveis)
- `valor_parcela` no contrato (base para novos boletos)
- `indice_de_reajuste` (histórico)
- `data_do_ultimo_reajuste` (histórico)

#### Derivados (Imutáveis na Leitura)
- `saldo_devedor` = SUM(boletos abertos)
- Status agregados (qtd totalizada)
- Totalizações

**Regra:** Nunca altere derivados manualmente!

---

### 4. **Atomicidade em Operações Críticas**

Todas as operações que envolvem múltiplas tabelas são ATÔMICAS:

```
Transação: Liquidar boleto
    ├─ Atualizar boleto (status = 'liquidado')
    ├─ Recalcular saldo_devedor do contrato
    └─ Registrar no log de auditoria
    
⚪ TUDO SUCEDE ou TUDO FALHA (sem meio termo)
```

---

### 5. **Validação em Múltiplas Camadas**

Validação acontece em várias camadas:

```
Frontend (Tipo I)
    ↓
API Gateway (Tipo II)
    ↓
Serviço de Negócio (Tipo III - Lógica)
    ↓
Banco de Dados (Constraints)
```

**Exemplo - Reajuste:**
1. Frontend: Valida 1 ano desde último reajuste
2. API: Valida entrada numérica
3. Serviço: Lógica de negócio (cálculos)
4. BD: Constraints (integridade)

---

## 📊 Padrões de Dados

### Modelo: Contrato + Boletos

```
┌─────────────────────┐
│    CONTRATO         │
├─────────────────────┤
│ id                  │
│ numero_contrato     │
│ valor_parcela    ⚖️ BASE PARA NOVOS
│ saldo_devedor    🔄 DERIVADO
│ indice_reajuste  📝 HISTÓRICO
│ data_reajuste    📝 HISTÓRICO
└─────────────────────┘
         1
         │
         │ 1:N
         │
         ▼
┌─────────────────────┐
│     BOLETOS         │
├─────────────────────┤
│ id                  │
│ contrato_id (FK)    │
│ valor_parcela    🔒 IMUTÁVEL
│ status              │
│ data_vencimento     │
└─────────────────────┘

🔄 = Sempre recalculado como SUM(boletos WHERE status='aberto')
⚖️ = Afeta apenas próximos boletos
🔒 = Nunca muda após criação
📝 = Histórico para referência
```

---

## 🔄 Fluxos Padrão

### Fluxo 1: Criar Contrato

```
1. User cria contrato
   ├─ valor_parcela = base (ex: R$ 3.333,33)
   ├─ saldo_devedor = 0 (ainda sem boletos)
   └─ indice_reajuste = NULL

2. Boletos são gerados
   ├─ Cada boleto cria com valor_parcela do contrato
   └─ saldo_devedor = SUM(boletos novos)

3. Resultado
   ├─ Contrato: 6 boletos prontos
   ├─ saldo_devedor: R$ 19.999,98
   └─ Status: ATIVO
```

### Fluxo 2: Aplicar Reajuste (1 ano depois)

```
1. Reajuste de 10% solicitado
   ├─ Valida 1 ano desde último reajuste
   └─ Multiplica valor_parcela: 3.333,33 × 1.10 = 3.666,66

2. Atualizar contrato
   ├─ valor_parcela = 3.666,66 (novo)
   ├─ indice_reajuste = 10% (histórico)
   ├─ data_ultimo_reajuste = hoje
   ├─ Boletos EXISTENTES: NÃO MUDAM
   └─ saldo_devedor = SUM(boletos ainda abertos) = INALTERADO

3. Próximos boletos usam novo valor
   ├─ Boletos 7-12 criados com R$ 3.666,66
   └─ saldo_devedor: (+) próximas parcelas somadas
```

### Fluxo 3: Processar Retorno CNAB

```
1. Retorno recebido do banco
   ├─ Identifica boletos liquidados
   └─ Busca referência no BD

2. Para cada boleto liquidado:
   ├─ Atualiza status = 'liquidado'
   ├─ Registra data_pagamento
   ├─ Recalcula saldo_devedor
   └─ Registra no log de auditoria

3. Contrato é atualizado
   └─ saldo_devedor = SUM(boletos ainda abertos)

4. Resultado
   ├─ Contrato sincronizado
   ├─ saldo_devedor reduzido automaticamente
   └─ Histórico registrado
```

---

## 🎯 Decisões Arquiteturais Chave

### Decision 1: Por que `saldo_devedor` é derivado?

**Problema:** Se armazenavamos `saldo_devedor` manualmente, era fácil desincronizar.

**Solução:** Sempre calcular como SUM(boletos abertos)

**Benefício:**
- ✅ Sempre correto (automaticamente)
- ✅ Fácil debugar (query simples)
- ✅ Não precisa de sincronização manual
- ❌ Custo: Query leve ao buscar contrato

**Trade-off:** Vale a pena pelos benefícios de consistência

---

### Decision 2: Por que boletos são imutáveis?

**Problema:** Se boletos pudessem mudar, seria impossível auditar histórico.

**Solução:** Boletos são **insert-only**, nunca deletam ou alteram valor

**Benefício:**
- ✅ Histórico confiável
- ✅ Auditoria clara
- ✅ Determinístico (sempre mesmo resultado)
- ❌ Custo: Se precisa corrigir, precisa cancelar + recriar

**Trade-off:** Vale para compliance e auditoria

---

### Decision 3: Por que reajuste afeta apenas próximas parcelas?

**Problema:** Se reajuste alterasse os boletos já emitidos, violaria imutabilidade.

**Solução:** Reajuste atualiza `valor_parcela` do contrato (base para novos boletos)

**Benefício:**
- ✅ Respeita imutabilidade de boletos
- ✅ Histórico claro
- ✅ Cálculos precisos
- ❌ Custo: Boletos passados e futuros têm valores diferentes

**Trade-off:** Correto do ponto de vista legal e contábil

---

## 🔒 Segurança e Validação

### Validações de Reajuste

```
Input: indice_de_reajuste = 10, data_reajuste = "2026-02-05"

Camada 1 (Frontend):
  ✓ É número? ✓ Entre 0-100%?

Camada 2 (API):
  ✓ Contrato existe? ✓ Usuário autorizado?

Camada 3 (Serviço):
  ✓ 1 ano desde último reajuste?
  ✓ Há boletos para reajustar?
  ✓ Data é futura?

Camada 4 (BD):
  ✓ Constraints de integridade
  ✓ Transação atômica

Result: ✅ Reajuste seguro e validado
```

---

## 📈 Escalabilidade

### Como o sistema escala

```
Pequeno (1000 contratos):
  - 1 servidor application
  - 1 banco de dados SQLite
  - Sync simples

Médio (10000 contratos):
  - 2-3 servidores application
  - 1 banco de dados centralizado
  - Cache para saldos agregados

Grande (100000+ contratos):
  - Load balancer
  - Múltiplos bancos (replicação)
  - Cache distribuído (Redis)
  - Fila de processamento para CNAB
```

**Princípio:** Adicione cache sem quebrar consistência (sempre re-validate)

---

## 🔍 Debugging

### Query de Diagnóstico: Desincronização

```sql
-- Encontra contratos desincronizados
SELECT 
  c.id,
  c.numero_contrato,
  c.saldo_devedor as armazenado,
  SUM(b.valor_parcela) as real,
  ABS(c.saldo_devedor - SUM(b.valor_parcela)) as diferenca
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status='aberto'
GROUP BY c.id
HAVING diferenca > 0.01
ORDER BY diferenca DESC;

-- Se vazio = tudo sincronizado ✅
-- Se algo retorna = chamar sincronização manual
```

### Query de Diagnóstico: Histórico de Reajustes

```sql
-- Ver reajustes aplicados
SELECT 
  id,
  numero_contrato,
  indice_de_reajuste,
  data_do_ultimo_reajuste
FROM contratos
WHERE indice_de_reajuste IS NOT NULL
ORDER BY data_do_ultimo_reajuste DESC;
```

---

## 📚 Referências

### Dentro da Documentação

- [Sistema de Reajustes](docs/contratos/reajustes/) - Implementação prática
- [Arquitetura de Reajustes](docs/contratos/reajustes/arquitetura.md) - Diagramas técnicos
- [MUDANCAS_RECENTES](docs/MUDANCAS_RECENTES.md) - Implementação específica
- [CONSOLIDACAO_MUDANCAS](docs/CONSOLIDACAO_MUDANCAS.md) - Resumo de mudanças

### Conceitos Relacionados

- **ACID Compliance** - Atomicity, Consistency, Isolation, Durability
- **Event Sourcing** - Registrar eventos em vez de estado
- **CQRS** - Command Query Responsibility Segregation
- **Eventual Consistency** - Sistema converge para consistência

---

## ✅ Checklist de Projeto

Ao trabalhar no ERP Anduril:

- [ ] Entendo os 5 princípios fundamentais
- [ ] Conheço a diferença entre dados armazenados vs derivados
- [ ] Sei que boletos são imutáveis
- [ ] Conheço os 3 fluxos padrão
- [ ] Li a seção de decisões arquiteturais
- [ ] Entendo as 4 camadas de validação
- [ ] Posso rodar a query de diagnóstico

---

**Mantido por:** Equipe de Desenvolvimento ERP Anduril  
**Versão:** 2.1.0  
**Data:** 8 de Fevereiro de 2026
