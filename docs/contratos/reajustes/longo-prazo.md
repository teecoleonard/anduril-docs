# Reajustes a Longo Prazo - Cenário de 2+ Anos

## Exemplo Prático 

### Contrato de 30 Anos com Reajustes Anuais

---

#### Ano 1 (Janeiro/2026) - Criação

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

#### Ano 1 (Fevereiro/2026) - 1º Reajuste (10%)

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

#### Ano 2 (Fevereiro/2027) - 2º Reajuste (5%)

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

#### Ano 3 (Fevereiro/2028) - 3º Reajuste (8%)

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

## Padrão Observado

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

## Visualização: Saldo Devedor ao Longo de 30 Anos

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
             0    10   20   30   (anos)
```

## Observações Importantes

### 1. Boletos Antigos Nunca Mudam

Quando você reajusta um contrato:
- ❌ Boletos **já gerados** NUNCA são modificados
- ✅ Boletos **futuros** usarão o novo valor_parcela

```sql
-- 6 boletos de 3.333,33 existem
-- Reajuste: +10%
-- Resultado:

Boletos 1-6: 3.333,33 (inalterado)
Boletos 7-12: 3.666,66 (novo valor)
```

### 2. Saldo Devedor vs Valor Parcela

| Campo | Muda com reajuste? | Por quê? |
|-------|-------------------|----------|
| `valor_parcela` | ✅ SIM | Próximos boletos usarão novo valor |
| `saldo_devedor` | Recalculado | É SUM de boletos abertos (não vai mudar em valor total) |

### 3. Exemplo: Contrato com 360 Parcelas

```
Ano 1:  parcelas 1-12    @ 3.333,33
Ano 2:  parcelas 13-24   @ 3.666,66 (reajuste +10%)
Ano 3:  parcelas 25-36   @ 3.849,99 (reajuste +5%)
...
Ano 30: parcelas 349-360 @ ??? (vários reajustes acumulados)
```

A parcela 360 pode custar 2-3× mais que a parcela 1 após 30 anos de reajustes!

## Conclusão

O sistema de reajustes foi projetado para lidar com cenários de **longo prazo** onde contratos precisam de múltiplos reajustes. Através de uma arquitetura simples (atualizar `valor_parcela`, manter boletos imutáveis), conseguimos:

✅ Flexibilidade para reajustes frequentes  
✅ Consistência de dados (saldo sincronizado)  
✅ Auditoria completa (histórico de reajustes)  
✅ Performance adequada mesmo a longo prazo  

Cada reajuste é um multiplicador do valor anterior, permitindo crescimento realista baseado em índices econômicos (IPCA, IGP-M, etc.).
