# 📈 Reajustes a Longo Prazo - Cenário de 2+ Anos

## Exemplo Prático: Contrato de 30 Anos com Reajustes Anuais

### 📅 Ano 1 (Janeiro/2026) - Criação

**Contrato criado:**
```
valor_parcela: R$ 3.333,33
quantidade_parcelas: 360 (30 anos × 12)
saldo_devedor: R$ 0 (vazio)
```

**Gerar parcelas 1-12:**
```
FOR parcela = 1 TO 12:
  INSERT boleto(valor_parcela = 3.333,33, status='aberto')

saldo_devedor = 12 × 3.333,33 = R$ 39.999,96
indice_de_reajuste = NULL
```

**Estado:**
```
┌─ Contrato ────────────────────┐
│ valor_parcela: 3.333,33       │
│ saldo_devedor: 39.999,96      │ ← 12 boletos
│ indice: NULL                  │
└───────────────────────────────┘
```

---

### 📅 Ano 1 (Fevereiro/2026) - 1º Reajuste (10%)

**Aplicar reajuste:**
```
novo_valor_parcela = 3.333,33 × 1.10 = R$ 3.666,66

UPDATE contratos SET
  valor_parcela = 3.666,66,        ← BASE NOVA
  indice_de_reajuste = 10,
  data_do_ultimo_reajuste = 2026-02-05,
  saldo_devedor = SUM(boletos) = 39.999,96
```

**Gerar parcelas 13-24:**
```
FOR parcela = 13 TO 24:
  INSERT boleto(valor_parcela = 3.666,66, status='aberto')

saldo_devedor = (12 × 3.333,33) + (12 × 3.666,66)
              = 39.999,96 + 43.999,92
              = 83.999,88
```

**Estado:**
```
┌─ Contrato ────────────────────┐
│ valor_parcela: 3.666,66       │
│ saldo_devedor: 83.999,88      │ ← 24 boletos
│ indice: 10%                   │
│ última_reajuste: 2026-02-05   │
└───────────────────────────────┘

Boletos por taxa:
  1-12:  3.333,33 (original)
  13-24: 3.666,66 (reajuste 10%)
```

---

### 📅 Ano 2 (Fevereiro/2027) - 2º Reajuste (5%)

**Aplicar reajuste (5% sobre 3.666,66):**
```
novo_valor_parcela = 3.666,66 × 1.05 = R$ 3.849,99

UPDATE contratos SET
  valor_parcela = 3.849,99,        ← BASE NOVA
  indice_de_reajuste = 5,
  data_do_ultimo_reajuste = 2027-02-05,
  saldo_devedor = SUM(boletos)
```

**Gerar parcelas 25-36:**
```
FOR parcela = 25 TO 36:
  INSERT boleto(valor_parcela = 3.849,99, status='aberto')

saldo_devedor = (12 × 3.333,33) + (12 × 3.666,66) + (12 × 3.849,99)
              = 39.999,96 + 43.999,92 + 46.199,88
              = 130.199,76
```

**Estado:**
```
┌─ Contrato ────────────────────┐
│ valor_parcela: 3.849,99       │
│ saldo_devedor: 130.199,76     │ ← 36 boletos
│ indice: 5%                    │
│ última_reajuste: 2027-02-05   │
└───────────────────────────────┘

Boletos por taxa:
  1-12:  3.333,33 (original)
  13-24: 3.666,66 (reajuste 10%)
  25-36: 3.849,99 (reajuste 5%)
```

---

### 📅 Ano 3 (Fevereiro/2028) - 3º Reajuste (8%)

**Aplicar reajuste (8% sobre 3.849,99):**
```
novo_valor_parcela = 3.849,99 × 1.08 = R$ 4.153,99

UPDATE contratos SET
  valor_parcela = 4.153,99,        ← BASE NOVA
  indice_de_reajuste = 8,
  data_do_ultimo_reajuste = 2028-02-05,
  saldo_devedor = SUM(boletos)
```

**Gerar parcelas 37-48:**
```
FOR parcela = 37 TO 48:
  INSERT boleto(valor_parcela = 4.153,99, status='aberto')

saldo_devedor = 39.999,96 + 43.999,92 + 46.199,88 + 49.847,88
              = 180.047,64
```

**Estado:**
```
┌─ Contrato ────────────────────┐
│ valor_parcela: 4.153,99       │
│ saldo_devedor: 180.047,64     │ ← 48 boletos
│ indice: 8%                    │
│ última_reajuste: 2028-02-05   │
└───────────────────────────────┘

Boletos por taxa:
  1-12:  3.333,33 (original)
  13-24: 3.666,66 (reajuste 1: +10%)
  25-36: 3.849,99 (reajuste 2: +5%)
  37-48: 4.153,99 (reajuste 3: +8%)
```

---

## 🎯 Padrão Observado

### Cada Reajuste Multiplica o `valor_parcela` Anterior

```
valor_parcela_n = valor_parcela_(n-1) × (1 + indice/100)

Exemplo:
  Year 1: 3.333,33 × 1.10 = 3.666,66
  Year 2: 3.666,66 × 1.05 = 3.849,99
  Year 3: 3.849,99 × 1.08 = 4.153,99
  Year 4: 4.153,99 × 1.06 = 4.403,23
```

### Progressão Cumulativa (Não Linear)

```
Comparação: Valores Acumulados vs Crescimento % ao Ano

Ano    Índice  valor_parcela  Crescimento desde Ano 1
────   ──────  ─────────────  ───────────────────────
1      0%      3.333,33       0%
2      10%     3.666,66       10,0%
3      5%      3.849,99       15,5%
4      8%      4.153,99       24,6%
5      6%      4.403,23       32,1%
6      3%      4.535,33       36,1%
7      12%     5.079,57       52,4%
...
30     ...     ??             (pode dobrar ou triplicar)
```

---

## 📊 Visualização: Saldo Devedor ao Longo de 30 Anos

```
Cenário: Reajuste anual de 8% médio

Saldo Devedor (R$)
│
│ 1.000.000 ┐
│           │                                      ╱─╱─╱─╱─
│  800.000  │                            ╱─╱─╱─╱─╱
│  600.000  │                ╱─╱─╱─╱─╱─╱
│  400.000  │    ╱─╱─╱─╱─╱─╱
│  200.000  │╱─╱─
│       0   └────────────────────────────────────────
│          1   5   10   15   20   25   30
│          Meses                    Anos

Explicação:
- Eixo Y: Saldo devedor = SUM de todos os boletos abertos
- Eixo X: Tempo (começando em 30 anos de duração)
- Curva cresce porque:
  1. Adicionamos 12 novos boletos/ano
  2. Cada boleto de novo ano é maior (reajustado)
  3. Boletos antigos ainda estão abertos
- Curva desaceleraria se houvesse liquidações
```

---

## 🔄 Fluxo de Liquidação com Reajustes

### Exemplo: 2 Liquidações em 3 Anos

**Fevereiro/2026:** Boleto 1 liquidado (R$ 3.333,33)
```
saldo_devedor = 83.999,88 - 3.333,33 = 80.666,55
```

**Agosto/2027:** Boleto 13 liquidado (R$ 3.666,66)
```
saldo_devedor = 130.199,76 - 3.666,66 = 126.533,10
```

**Fevereiro/2028:** 3º Reajuste (8%)
```
valor_parcela = 3.849,99 × 1.08 = 4.153,99

// Boletos agora:
//   2-12 abertos: 11 × 3.333,33 = 36.666,63
//   14-24 abertos: 11 × 3.666,66 = 40.333,26
//   25-36 abertos: 12 × 3.849,99 = 46.199,88
//   37-48 gerados: 12 × 4.153,99 = 49.847,88

saldo_devedor = 36.666,63 + 40.333,26 + 46.199,88 + 49.847,88
              = 173.047,65
```

---

## 🛡️ Pontos-Chave a Longo Prazo

### 1️⃣ Histórico de Reajustes

```sql
SELECT 
  c.id,
  c.numero_contrato,
  c.indice_de_reajuste,           -- Reajuste ATUAL
  c.data_do_ultimo_reajuste,      -- Quando foi aplicado
  c.valor_parcela,                -- Base para próximos boletos
  COUNT(b.id) as qtd_boletos
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status='aberto'
GROUP BY c.id;

-- Para ver histórico COMPLETO, precisaria de:
--   - Tabela: reajuste_historico
--   - Campos: contrato_id, indice, data, valor_parcela_novo
```

**Problema:** Você só vê o reajuste ATUAL, não o histórico!

**Solução recomendada:**
```sql
CREATE TABLE reajuste_historico (
  id INTEGER PRIMARY KEY,
  contrato_id INTEGER NOT NULL,
  indice_de_reajuste REAL NOT NULL,
  valor_parcela_anterior REAL NOT NULL,
  valor_parcela_novo REAL NOT NULL,
  data_reajuste DATE NOT NULL,
  FOREIGN KEY(contrato_id) REFERENCES contratos(id)
);
```

### 2️⃣ Cada Boleto é um "Snapshot"

```
Um boleto nunca muda = seu valor é fixo para sempre

Boleto ID 15:
  ├─ Criado em: 2026-07-15
  ├─ Valor: R$ 3.666,66 ← CONGELADO
  ├─ Status: aberto → liquidado
  └─ Nunca muda para R$ 4.000, R$ 5.000, etc.
```

### 3️⃣ Saldo Devedor é Sempre Recalculado

```
Nunca armazenar saldo_devedor sem recalcular:

ERRADO: UPDATE contratos SET saldo_devedor = saldo_devedor + novo_boleto
CERTO:  UPDATE contratos SET saldo_devedor = (SELECT SUM(...))
```

### 4️⃣ Simulação de Próximos Reajustes

```typescript
// Quando usuário quer simular próximos 10 anos:
const contratoAtual = getContrato(id);
const valor = contratoAtual.valor_parcela;

const projecao = [];
for (let ano = 1; ano <= 10; ano++) {
  const indiceAleatorio = 5 + Math.random() * 5; // 5-10%
  const novoValor = valor * (1 + indiceAleatorio / 100);
  projecao.push({
    ano: contratoAtual.data_do_ultimo_reajuste.year + ano,
    indice: indiceAleatorio.toFixed(2) + '%',
    valor_parcela: novoValor.toFixed(2),
  });
  valor = novoValor;
}

// Resultado:
// Ano 2029: 5,47% → R$ 4.378,19
// Ano 2030: 7,23% → R$ 4.695,15
// Ano 2031: 6,81% → R$ 5.015,33
```

---

## 💡 Resposta Direta

**P: E se eu aplicar novo reajuste após 2 anos?**

**R:** Funciona perfeitamente! 

```
Reajuste 1 (2026): 3.333,33 × 1.10 = 3.666,66
Reajuste 2 (2027): 3.666,66 × 1.05 = 3.849,99  ← Base é o RESULTADO anterior
Reajuste 3 (2028): 3.849,99 × 1.08 = 4.153,99  ← Base é o RESULTADO anterior
```

- ✅ Cada reajuste multiplica o `valor_parcela` atual
- ✅ Boletos antigos nunca mudam (congelados)
- ✅ Próximos boletos usam nova base
- ✅ Saldo devedor = SUM sempre válido
- ⚠️ Se quiser histórico de reajustes, precisa criar tabela separada

