# ✅ SOLUÇÃO: Reajuste de Índice - Sincronização Correta

## 🔍 PROBLEMA IDENTIFICADO

Ao aplicar um reajuste no contrato, o `saldo_devedor` não era alterado, fazendo com que o boleto gerasse com o mesmo valor.

### Causa Raiz

O sistema tinha uma **desincronização entre o `saldo_devedor` do contrato e a soma dos boletos abertos**:

1. ❌ **ERRO INICIAL**: Tentava-se alterar o `valor_parcela` de boletos já criados (MUITO ERRADO!)
2. ✅ **CORREÇÃO**: Boletos já criados NUNCA mudam de valor - são uma obrigação contraída
3. ✅ **CORRETO**: O reajuste afeta apenas o `valor_parcela` BASE para NOVOS boletos

## 🎯 Conceitos-Chave

### `valor_parcela` vs `saldo_devedor`

```
valor_parcela: R$ 3.333,33
  ├─ Valor de CADA parcela individual
  ├─ NUNCA muda após criar boleto
  ├─ É atualizado apenas para novos boletos
  └─ Armazenado no CONTRATO (não no boleto individual)

saldo_devedor: R$ 19.999,98
  ├─ SOMA de todos os boletos com status 'aberto'
  ├─ Muda automaticamente quando:
  │  ├─ Boleto é liquidado (diminui)
  │  ├─ Boleto é cancelado (recalcula)
  │  └─ Novos boletos são criados (aumenta)
  └─ Fórmula: SUM(boleto.valor_parcela WHERE status='aberto')
```

### Boletos Já Criados

```
Uma vez criado, um boleto é IMUTÁVEL:
  - Emissão: 01/01/2026 → R$ 3.333,33
  - Reajuste 10%: 02/02/2026 → Boleto CONTINUA R$ 3.333,33 ✅
  - Pagamento: 15/02/2026 → Boleto CONTINUA R$ 3.333,33 ✅

Reajuste NÃO afeta boletos já emitidos!
```

---

## ✅ SOLUÇÃO IMPLEMENTADA

Foram feitas as seguintes mudanças:

### 1. **Reajuste Afeta Apenas `valor_parcela` BASE** (contratos.service.ts)

```typescript
// Calcular novo valor_parcela para boletos que ainda faltam gerar
const novoValorParcela = Math.round(
  contrato.valor_parcela * (1 + indiceReajuste / 100) * 100
) / 100;

// Armazenar no contrato para próximos boletos
db.prepare(
  `UPDATE contratos 
   SET valor_parcela = ?,
       indice_de_reajuste = ?,
       data_do_ultimo_reajuste = ?
   WHERE id = ?`,
).run(novoValorParcela, indiceReajuste, dataReajuste, id);
```

**Importante**: ⚠️ **NÃO altera boletos já criados!**

### 2. **`saldo_devedor` = SUM dos Boletos Abertos**

```typescript
// Recalcular saldo_devedor como simples soma
const novoSaldoDevedor = this.recalcularSaldoDevedor(id);

// Fórmula interna:
// SELECT SUM(valor_parcela) FROM boletos 
// WHERE contrato_id=? AND status='aberto'
```

### 3. **Sincronização Automática na Liquidação**

```typescript
// Quando boleto é liquidado via CNAB:
if (detalhe.status === 'liquidado') {
  // Atualizar boleto para liquidado
  db.prepare(`UPDATE boletos SET status='liquidado' WHERE id=?`).run(...);
  
  // Recalcular saldo_devedor automaticamente
  this.sincronizarSaldoDevedor(contratoId);
  // saldo_devedor = SUM(boletos abertos restantes) ✅
}
```

---

## 📊 Exemplo Prático

### Cenário: Contrato com 6 boletos + Reajuste 10%

**Situação Inicial:**
```
Contrato:
  - valor_parcela: R$ 3.333,33 (base para criar boletos)
  - saldo_devedor: R$ 19.999,98 (SUM de 6 boletos)
  - indice_de_reajuste: NULL

Boletos (já criados):
  1. R$ 3.333,33, status: aberto
  2. R$ 3.333,33, status: aberto
  3. R$ 3.333,33, status: aberto
  4. R$ 3.333,33, status: aberto
  5. R$ 3.333,33, status: aberto
  6. R$ 3.333,33, status: aberto
```

**Após Reajuste de 10%:**
```
Contrato:
  - valor_parcela: R$ 3.666,66 ✅ NOVO (para próximos boletos)
  - saldo_devedor: R$ 19.999,98 ✅ INALTERADO (boletos já criados)
  - indice_de_reajuste: 10%

Boletos (NUNCA MUDAM):
  1. R$ 3.333,33, status: aberto ✅
  2. R$ 3.333,33, status: aberto ✅
  3. R$ 3.333,33, status: aberto ✅
  4. R$ 3.333,33, status: aberto ✅
  5. R$ 3.333,33, status: aberto ✅
  6. R$ 3.333,33, status: aberto ✅
```

**Quando Gerar Próximas Parcelas (7-12):**
```
Contrato:
  - valor_parcela: R$ 3.666,66 (base atual)
  - saldo_devedor: R$ 39.999,94 (agora soma 12 boletos)

Boletos Novos:
  7. R$ 3.666,66, status: aberto ✅ REAJUSTADO
  8. R$ 3.666,66, status: aberto ✅ REAJUSTADO
  ...
  12. R$ 3.666,66, status: aberto ✅ REAJUSTADO
```

---

## 🔄 Sincronização do Saldo Devedor

O `saldo_devedor` é **derivado**, nunca é alterado manualmente:

```
saldo_devedor = SUM(boleto.valor_parcela WHERE status='aberto')

Exemplos:
- Reajuste aplicado: saldo_devedor = SUM (mantém valor atual)
- Boleto liquidado: saldo_devedor = SUM (diminui automaticamente)
- Novo boleto criado: saldo_devedor = SUM (aumenta automaticamente)
- Boleto cancelado: saldo_devedor = SUM (recalcula)
```

**Endpoint para Sincronização Manual:**
```bash
POST /api/contratos/{id}/sincronizar-saldo
```

---

## ✨ Fluxo Completo

```
1. Frontend: Clica "Reajustar"
   ↓
2. Backend: aplicarReajuste()
   ├─ Valida 1 ano desde último reajuste
   ├─ Calcula novo valor_parcela = 3.333,33 × 1.10 = 3.666,66
   ├─ Atualiza CONTRATO:
   │  ├─ valor_parcela = 3.666,66 ✅
   │  ├─ indice_de_reajuste = 10%
   │  └─ data_do_ultimo_reajuste = hoje
   ├─ Boletos EXISTENTES: NÃO MUDAM ✅
   └─ Recalcula saldo_devedor = SUM (mantém soma dos atuais)
   ↓
3. Frontend: Recebe contrato
   - saldo_devedor: inalterado (boletos já emitidos)
   - valor_parcela: reajustado (para próximos boletos)
   ↓
4. Gerar Remessa CNAB:
   - Usa boletos já existentes com valores originais ✅
   ↓
5. Gerar Próximas Parcelas:
   - Usa valor_parcela reajustado (3.666,66)
   - Novos boletos com valor reajustado ✅
```

---

## 🎯 Regras Importantes

1. ✅ **Boleto é imutável** - Uma vez criado, seu valor NÃO muda
2. ✅ **valor_parcela é mutável** - Afeta apenas próximos boletos  
3. ✅ **saldo_devedor é derivado** - Sempre recalculado como SUM
4. ✅ **Reajuste é histórico** - Registra índice aplicado
5. ✅ **Liquidação é automática** - saldo_devedor recalcula automaticamente

---

## 🔍 Verificação

Query para validar:
```sql
SELECT 
  c.id,
  c.numero_contrato,
  c.valor_parcela,
  c.indice_de_reajuste,
  SUM(b.valor_parcela) as soma_boletos_abertos,
  c.saldo_devedor,
  (SUM(b.valor_parcela) - c.saldo_devedor) as diferenca
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status='aberto'
GROUP BY c.id;
```

Resultado esperado: `diferenca = 0` (saldo_devedor sempre é a soma)



## ✅ SOLUÇÃO IMPLEMENTADA

Foram feitas as seguintes mudanças:

### 1. **Nova Função: `recalcularSaldoDevedor`** (contratos.service.ts)

Função pública que calcula o saldo_devedor baseado na **soma real dos boletos abertos**:

```typescript
recalcularSaldoDevedor(contratoId: number): number {
  const db = this.databaseService.getDb();
  
  // Somar todos os boletos com status 'aberto' (não liquidados, não cancelados)
  const resultado = db
    .prepare(
      `SELECT COALESCE(SUM(valor_parcela), 0) as soma 
       FROM boletos 
       WHERE contrato_id = ? AND status = 'aberto'`,
    )
    .get(contratoId) as { soma: number } | undefined;

  const somaBoletosAbertos = resultado?.soma ?? 0;
  return Math.round(somaBoletosAbertos * 100) / 100;
}
```

### 2. **Novo Endpoint: `POST /contratos/{id}/sincronizar-saldo`** (contratos.controller.ts)

Permite sincronização manual do saldo_devedor:

```typescript
@Post(':id/sincronizar-saldo')
@HttpCode(HttpStatus.OK)
sincronizarSaldo(@Param('id', ParseIntPipe) id: number) {
  return this.contratosService.sincronizarSaldoDevedor(id);
}
```

### 3. **Modificação: `aplicarReajuste`** (contratos.service.ts)

Agora usa `recalcularSaldoDevedor` ao invés de apenas multiplicar:

```typescript
// Antes (ERRADO):
const novoSaldoDevedor = Math.round(contrato.saldo_devedor * (1 + indiceReajuste / 100) * 100) / 100;

// Depois (CORRETO):
// 1. Atualizar valor_parcela dos boletos abertos
db.prepare(
  `UPDATE boletos 
   SET valor_parcela = ROUND(valor_parcela * (1 + ? / 100), 2),
       updated_at = CURRENT_TIMESTAMP
   WHERE contrato_id = ? 
     AND data_vencimento > ?
     AND status = ?`,
).run(indiceReajuste, id, dataReajuste, 'aberto');

// 2. Recalcular saldo_devedor baseado na NOVA soma dos boletos
const novoSaldoDevedor = this.recalcularSaldoDevedor(id);
```

### 4. **Sincronização Automática no CNAB** (boleto-atualizador.ts)

Quando um boleto é liquidado via retorno CNAB, o `saldo_devedor` é automaticamente sincronizado:

```typescript
if (detalhe.status === 'liquidado') {
  // ... atualizar boleto ...
  
  // ✅ NOVO: Sincronizar saldo_devedor do contrato após liquidar boleto
  this.sincronizarSaldoDevedor(boletoCompleto.contrato_id);
}
```

## 🔧 COMO USAR

### Opção 1: Sincronizar Manualmente (via API)

```bash
POST /api/contratos/{contratoId}/sincronizar-saldo
```

### Opção 2: Sincronização Automática no Frontend

Após gerar boletos ou processar retorno CNAB, chamar:

```typescript
// Após gerar boletos
await contratosService.sincronizarSaldoDevedor(contratoId);

// Ou após importar retorno CNAB
// (Já é feito automaticamente pelo backend)
```

## 📊 VERIFICAÇÃO

Para verificar se o saldo devedor está correto:

```sql
-- Verificar saldo_devedor vs soma de boletos abertos
SELECT 
  c.id,
  c.numero_contrato,
  c.saldo_devedor as saldo_devedor_contrato,
  SUM(b.valor_parcela) as soma_boletos_abertos,
  ABS(c.saldo_devedor - SUM(b.valor_parcela)) as diferenca
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status = 'aberto'
GROUP BY c.id
HAVING diferenca > 0.01  -- Mostrar apenas desincronizações maiores que 1 centavo
ORDER BY diferenca DESC;
```

## 🎯 RESULTADO

Agora o sistema funciona corretamente:

```
Contrato após reajuste de 10%:
  - saldo_devedor: R$ 21.999,96 ✅
  - soma dos boletos abertos: R$ 21.999,96 ✅
  - SINCRONIZADO!

Boleto na remessa CNAB: R$ 3.666,66 ✅
Valor total da remessa: R$ 21.999,96 ✅
```

## 🔄 FLUXO COMPLETO

```
1. Frontend: Clica em "Reajustar"
   ↓
2. Backend: aplicarReajuste()
   - Valida data (1 ano desde último)
   - Atualiza valor_parcela dos boletos abertos
   - Recalcula saldo_devedor com recalcularSaldoDevedor()
   - Atualiza indice_de_reajuste e data_do_ultimo_reajuste
   ↓
3. Frontend: Recebe contrato atualizado
   - saldo_devedor sincronizado ✅
   - Mostra novo valor nos boletos
   ↓
4. Gerar Remessa CNAB:
   - Usa valor_parcela dos boletos (reajustado)
   - Remessa gerada com valores corretos ✅
   ↓
5. Processar Retorno CNAB:
   - Boletos liquidados atualizam status
   - saldo_devedor sincronizado automaticamente
   - saldo_devedor reduzido conforme pagamentos ✅
```

## ✨ BENEFÍCIOS

1. ✅ **Sincronização Automática**: Saldo devedor sempre reflete a realidade
2. ✅ **Sem Mais Desincronizações**: Recalcula baseado em dados reais
3. ✅ **CNAB Correto**: Valores na remessa sempre batem com contrato
4. ✅ **Tratamento de Arredondamentos**: Lida com centavos e arredondamentos
5. ✅ **Endpoint Manual**: Pode sincronizar manualmente se necessário
6. ✅ **Logs Detalhados**: Debug logs para rastrear mudanças

## 📝 NOTAS IMPORTANTES

- O `saldo_devedor` agora é considerado um campo **derivado** (calculado)
- Deve sempre refletir a soma dos boletos com status 'aberto'
- Ao liquidar boletos, o `saldo_devedor` **diminui automaticamente**
- Ao cancelar boletos, o `saldo_devedor` **se recalcula automaticamente**
- A função `recalcularSaldoDevedor` é **determinística** (mesmo resultado toda vez)

