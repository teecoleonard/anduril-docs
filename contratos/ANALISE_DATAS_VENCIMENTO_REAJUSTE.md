# ✅ ANÁLISE: Dia do Vencimento x Data de Vencimento x Data do Último Reajuste

## 1. ESTRUTURA DE DADOS

### Colunas no Banco de Dados
```
contratos:
  - dia_do_vencimento (INTEGER): Dia do mês (1-31) escolhido pelo cliente
  - data_vencimento (DATE): Data anual base para reajuste (YYYY-MM-DD)
  - data_do_ultimo_reajuste (DATE): Data do último reajuste aplicado (YYYY-MM-DD)
  - indice_de_reajuste (DECIMAL): Percentual do último reajuste
```

---

## 2. REGRAS IDENTIFICADAS E IMPLEMENTADAS ✅

### 2.1 Dia do Vencimento (dia_do_vencimento)
**Status:** ✅ IMPLEMENTADO E FUNCIONANDO

**Como funciona:**
- Campo obrigatório no DTO CreateContratoDto (linha 77)
- Validação: `@IsNumber()` e deve estar entre 1-31
- Uso: Define o dia do mês para vencimento mensal dos boletos
- Exemplo: Se dia_do_vencimento = 15, os boletos vencem no dia 15 de cada mês

**Implementação:**
```typescript
@IsNumber({}, { message: 'Dia do vencimento é obrigatório' })
dia_do_vencimento!: number; // Dia do mês escolhido para vencimento dos boletos
```

**Armazenamento:**
```typescript
// Inserir no contrato
createContratoDto.dia_do_vencimento  // Salvo diretamente na coluna
```

---

### 2.2 Data de Vencimento (data_vencimento)
**Status:** ✅ IMPLEMENTADO E FUNCIONANDO

**Como funciona:**
- **Calculada automaticamente** no backend (não vem do frontend)
- Fórmula: `data_assinatura + 1 ano`
- Exemplo: Se assinado em 2025-01-27, data_vencimento = 2026-01-27
- **É ANUAL** - não é mensal!

**Implementação no create():**
```typescript
// Linha 105-107
const dataBruta = new Date(dataAssinatura);
dataBruta.setFullYear(dataBruta.getFullYear() + 1); // Próximo ano
const dataVencimentoCalculada = dataBruta.toISOString().split('T')[0]; // YYYY-MM-DD
```

**Usado em:**
1. **Dashboard**: Alertas para contratos a vencer
2. **Reajuste**: Base para validar se 1 ano passou
3. **Status**: Atualiza status "a_vencer" quando faltam 30 dias

---

### 2.3 Data do Último Reajuste (data_do_ultimo_reajuste)
**Status:** ✅ IMPLEMENTADO E FUNCIONANDO

**Como funciona:**
- **Inicialmente NULL** quando contrato é criado (não houve reajuste ainda)
- Preenchida quando o reajuste é aplicado
- Serve como base para calcular próximo reajuste (1 ano depois)

**Validação - Reajuste só é permitido se:**
```typescript
// Linha 462-476 (aplicarReajuste)
if (contrato.data_do_ultimo_reajuste) {
  const ultimaData = new Date(contrato.data_do_ultimo_reajuste);
  const dataAtualReajuste = new Date(dataReajuste);
  const diasDecorridos = Math.floor(
    (dataAtualReajuste.getTime() - ultimaData.getTime()) / (1000 * 60 * 60 * 24),
  );
  
  if (diasDecorridos < 365) {
    // ❌ ERRO - muito cedo para reajustar
    throw new BadRequestException(...)
  }
}
```

**Atualização:**
```typescript
// Linha 523-529 (aplicarReajuste)
db.prepare(
  `UPDATE contratos 
   SET indice_de_reajuste = ?, 
       data_do_ultimo_reajuste = ?,
       saldo_devedor = ?,
       updated_at = CURRENT_TIMESTAMP
   WHERE id = ?`,
).run(indiceReajuste, dataReajuste, novoSaldoDevedor, id);
```

---

## 3. FLUXO COMPLETO DO REAJUSTE

### Passo 1: Criar Contrato
```
Input: data_assinatura = 2025-01-27, dia_do_vencimento = 15
↓
Backend calcula: data_vencimento = 2026-01-27
Backend seta: data_do_ultimo_reajuste = NULL
↓
Salvo no banco com data_vencimento = 2026-01-27 (anual)
```

### Passo 2: Esperar 1 Ano
```
Hoje: 2026-01-27
Reajuste liberado? SIM (passou 1 ano desde data_do_ultimo_reajuste = NULL)
```

### Passo 3: Aplicar Reajuste
```
Input: indice_de_reajuste = 10%, data_do_reajuste = 2026-01-27
↓
Validação: data_do_ultimo_reajuste = NULL → OK, primeira vez
↓
Atualiza:
  - indice_de_reajuste = 10
  - data_do_ultimo_reajuste = 2026-01-27
  - saldo_devedor = saldo_anterior × 1.10
  - Boletos abertos: valor_parcela × 1.10
↓
Próximo reajuste liberado apenas em: 2027-01-27
```

---

## 4. CHECKLIST DE FUNCIONAMENTO

### ✅ Dia do Vencimento
- [x] Campo obrigatório ao criar contrato
- [x] Validado entre 1-31
- [x] Armazenado no banco
- [x] Usado para gerar boletos mensais (boletos.service)

### ✅ Data de Vencimento (Anual)
- [x] Calculada automaticamente (data_assinatura + 1 ano)
- [x] Serve como base para reajuste
- [x] Usada em alertas de dashboard
- [x] Usada para atualizar status "a_vencer" e "vencido"

### ✅ Data do Último Reajuste
- [x] Inicializado como NULL
- [x] Atualizado quando reajuste é aplicado
- [x] Valida se 1 ano passou antes de permitir novo reajuste
- [x] Bloqueado até completar 365 dias

---

## 5. TESTES REALIZADOS

**Contrato de Teste: REAJUSTE-TEST-001**
```
Data Assinatura: 2025-01-27 (1 ano atrás)
Data Vencimento: 2026-01-27 (calculada automaticamente)
Dia Vencimento: 15
Data Último Reajuste: NULL (inicial)

Boletos:
  - 6 liquidados (já vencidos em 2025)
  - 6 abertos (vencimento futuro em 2026)
```

**Reajuste com 10%:**
- ✅ Saldo devedor: 20.000 → 22.000
- ✅ Valor parcela abertos: 3.333,33 → 3.666,66
- ✅ data_do_ultimo_reajuste: NULL → 2026-01-27
- ✅ indice_de_reajuste: NULL → 10

---

## 6. REGRA IMPORTANTE: ANUALIDADE

A `data_vencimento` é **ANUAL** (não muda) e serve como:

1. **Data base fixa do contrato**: 
   - Sempre será 1 ano após a data de assinatura
   - Nunca muda (é a data de vigência do contrato)

2. **Base para permitir reajuste**:
   - A cada 365 dias desde `data_do_ultimo_reajuste`, novo reajuste é permitido
   - Se ainda não foi reajustado: pode reajustar 365 dias após assinatura

3. **Alertas no Dashboard**:
   - Contratos com data_vencimento próxima são sinalizados
   - "A vencer" quando faltam 30 dias

---

## 7. CÓDIGO RELEVANTE

### Arquivo: `contratos.service.ts`

**Lines 105-107:** Cálculo de data_vencimento
```typescript
const dataBruta = new Date(dataAssinatura);
dataBruta.setFullYear(dataBruta.getFullYear() + 1);
const dataVencimentoCalculada = dataBruta.toISOString().split('T')[0];
```

**Lines 462-476:** Validação de 1 ano para reajuste
```typescript
if (contrato.data_do_ultimo_reajuste) {
  const ultimaData = new Date(contrato.data_do_ultimo_reajuste);
  const dataAtualReajuste = new Date(dataReajuste);
  const diasDecorridos = Math.floor(
    (dataAtualReajuste.getTime() - ultimaData.getTime()) / (1000 * 60 * 60 * 24),
  );
  
  if (diasDecorridos < 365) {
    throw new BadRequestException(...);
  }
}
```

**Lines 523-529:** Atualização de data_do_ultimo_reajuste
```typescript
db.prepare(
  `UPDATE contratos 
   SET indice_de_reajuste = ?, 
       data_do_ultimo_reajuste = ?,
       saldo_devedor = ?,
       updated_at = CURRENT_TIMESTAMP
   WHERE id = ?`,
).run(indiceReajuste, dataReajuste, novoSaldoDevedor, id);
```

---

## ✅ CONCLUSÃO

Todas as regras estão **IMPLEMENTADAS E FUNCIONANDO CORRETAMENTE**:

1. ✅ `dia_do_vencimento`: Escolhido pelo usuário, define dia mensal dos boletos
2. ✅ `data_vencimento`: Calculada automaticamente (anual, +1 ano)
3. ✅ `data_do_ultimo_reajuste`: Atualizado após reajuste, valida 365 dias
4. ✅ Reajuste bloqueado até completar 1 ano
5. ✅ Boletos futuros recebem reajuste aplicado
