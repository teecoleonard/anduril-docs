# 🧪 GUIA DE TESTES - Sistema de Reajuste Corrigido

## ✅ Checklist de Validação

### 1. Teste Básico de Reajuste

**Objetivo:** Verificar se o reajuste atualiza corretamente o valor_parcela para PRÓXIMOS boletos

**Passos:**
1. Abra a aba "Contratos"
2. Crie um novo contrato:
   - Quantidade de parcelas: 6
   - Valor total: R$ 20.000
   - Valor entrada: R$ 0
   - Dia vencimento: 15
   
3. Gere boletos:
   - Ir para "Gerar Boletos"
   - Selecionar o contrato
   - Gerar todas as parcelas
   
4. Verifique valores iniciais:
   - **Esperado:** 6 boletos de R$ 3.333,33
   - **Saldo devedor:** R$ 19.999,98 (soma dos boletos)
   - **valor_parcela (contrato):** R$ 3.333,33

5. Aplicar reajuste de 10%:
   - Selecione o contrato
   - Clique "Reajustar"
   - Digite 10 como índice
   - Clique "Aplicar"

6. Verifique após reajuste:
   ```
   Contrato:
   - valor_parcela: R$ 3.333,33 → R$ 3.666,66 ✅ (NOVO)
   - indice_de_reajuste: 10% ✅
   - saldo_devedor: R$ 19.999,98 ✅ (INALTERADO - boletos não mudam)
   
   Boletos Existentes (NUNCA MUDAM):
   - Boleto 1-6: CONTINUAM R$ 3.333,33 cada ✅
   ```

**Validação:**
- [ ] valor_parcela do contrato atualizado para R$ 3.666,66
- [ ] Boletos já criados CONTINUAM com R$ 3.333,33
- [ ] saldo_devedor INALTERADO em R$ 19.999,98
- [ ] indice_de_reajuste = 10%

---

### 2. Teste de Geração de Remessa CNAB

**Objetivo:** Verificar se a remessa CNAB tem os valores ORIGINAIS (não reajustados)

**Passos:**
1. Após reajuste (ver teste 1)
2. Ir para "CNAB"
3. Clique "Gerar Remessa"
4. Selecione os 6 boletos
5. Clique "Gerar"

**Validação no arquivo gerado:**
```
Esperado (valores ORIGINAIS):
- Segmento P para cada boleto:
  - Valor: 3.333,33 ✅ (NÃO foi para 3.666,66!)
- Trailer do lote:
  - Soma total: 19.999,98 ✅ (SUM dos boletos originais)
```

**Importante:** A remessa tem os valores ORIGINAIS porque os boletos NÃO foram alterados!

- [ ] Cada boleto na remessa tem R$ 3.333,33
- [ ] Soma total = R$ 19.999,98
- [ ] Boletos não foram modificados pelo reajuste

---

### 3. Teste de Geração de Próximas Parcelas Após Reajuste

**Objetivo:** Verificar se novos boletos usam o valor_parcela reajustado

**Passos:**
1. Após reajuste (ver teste 1)
   - valor_parcela no contrato: R$ 3.666,66
   - 6 boletos já criados: R$ 3.333,33 cada
   
2. Gerar próximas parcelas (7-12):
   - Ir para "Gerar Boletos"
   - Selecionar o contrato
   - Parcelas: 7-12
   - Gerar

**Esperado:**
```
Novos boletos (7-12):
  7. R$ 3.666,66 ✅ REAJUSTADO
  8. R$ 3.666,66 ✅ REAJUSTADO
  ...
  12. R$ 3.666,66 ✅ REAJUSTADO

saldo_devedor agora:
  - Antigos: 6 × 3.333,33 = 19.999,98
  - Novos: 6 × 3.666,66 = 21.999,96
  - Total: 39.999,94 ✅
```

**Validação:**
- [ ] Boletos 7-12 têm R$ 3.666,66 (valor reajustado)
- [ ] Boletos 1-6 continuam R$ 3.333,33 (valor original)
- [ ] saldo_devedor = 39.999,94 (soma de todos)
- [ ] Dois valores diferentes coexistem corretamente

---

### 4. Teste de Sincronização Manual

**Objetivo:** Testar endpoint de sincronização

**Método 1: Via API Direct**
```bash
curl -X POST http://localhost:3333/api/contratos/{contratoId}/sincronizar-saldo \
  -H "Content-Type: application/json"
```

**Esperado:**
```json
{
  "id": 1,
  "saldo_devedor": 14.666.64,
  "numero_contrato": "...",
  ...
}
```

**Validação:**
- [ ] saldo_devedor recalculado corretamente
- [ ] Resposta HTTP 200 OK
- [ ] Contrato retornado com saldo atualizado

---

### 5. Teste de Desincronização Detectada

**Objetivo:** Verificar detecção de desincronização

**SQL para simular:**
```sql
-- Simular desincronização (para teste apenas!)
UPDATE contratos 
SET saldo_devedor = 99999.99 
WHERE id = 1;
```

**Verificar antes:**
```sql
SELECT 
  c.saldo_devedor as contrato,
  SUM(b.valor_parcela) as boletos
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status = 'aberto'
WHERE c.id = 1
GROUP BY c.id;
-- Resultado: 99999.99 vs 14.666.64 ❌ DESINCRONIZADO
```

**Corrigir:**
```bash
POST /api/contratos/1/sincronizar-saldo
```

**Verificar depois:**
```sql
-- Resultado: 14.666.64 vs 14.666.64 ✅ SINCRONIZADO
```

---

## 🔍 Verificações Adicionais

### Verificar Logs

```bash
# Terminal do backend deve mostrar:

# Ao aplicar reajuste:
[DEBUG REAJUSTE] Iniciando aplicação de reajuste para contrato ID: 1
[DEBUG REAJUSTE] ✅ 6 boletos atualizados com sucesso
[SALDO DEVEDOR] Recalculando para contrato 1
[SALDO DEVEDOR] Soma de boletos abertos: R$ 21.999,96
[DEBUG REAJUSTE] Novo saldo: R$ 21.999,96
[DEBUG REAJUSTE] ✅ Contrato atualizado com sucesso!

# Ao liquidar boleto:
[BOLETO ATUALIZADOR] Atualizando boleto para LIQUIDADO
[BOLETO ATUALIZADOR] ✅ Saldo devedor sincronizado para contrato 1: R$ 14.666,64
```

### Verificar Banco de Dados

```sql
-- Query para validação completa
SELECT 
  c.id,
  c.numero_contrato,
  c.saldo_devedor as contrato_saldo,
  COUNT(CASE WHEN b.status = 'aberto' THEN 1 END) as boletos_abertos,
  SUM(CASE WHEN b.status = 'aberto' THEN b.valor_parcela ELSE 0 END) as soma_abertos,
  SUM(CASE WHEN b.status = 'liquidado' THEN b.valor_parcela ELSE 0 END) as soma_liquidados,
  c.indice_de_reajuste,
  DATE(c.data_do_ultimo_reajuste) as ultimo_reajuste
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id
WHERE c.id = 1
GROUP BY c.id;
```

---

## 📊 Cenários Avançados

### Cenário 1: Múltiplos Reajustes

```
Mês 1 (2025-01-15):
- Contrato criado: R$ 20.000 em 6 parcelas
- saldo_devedor: R$ 19.999,98
- Reajuste 10% aplicado
- saldo_devedor → R$ 21.999,96

Mês 4 (2025-04-15):
- 2 boletos liquidados
- saldo_devedor → R$ 14.666,64

Mês 13 (2026-01-15): [1 ano após primeiro reajuste]
- Reajuste 5% aplicado
- saldo_devedor: R$ 14.666,64 × 1.05 = R$ 15.400,0
- saldo_devedor → R$ 15.399,97 (4 boletos × 3.849,99)

✅ Cada reajuste recalcula base na SOMA REAL dos boletos
```

### Cenário 2: Cancelamento de Boleto

```
Depois de reajuste 10%:
- 6 boletos de R$ 3.666,66
- saldo_devedor: R$ 21.999,96

Cancelar 1 boleto:
- 5 boletos abertos + 1 cancelado
- saldo_devedor: SUM(5 × 3.666,66) = R$ 18.333,30 ✅

Observação: Sistema recalcula automaticamente
```

### Cenário 3: Contrato com Primeira Parcela Diferente

```
Contrato:
- Primeira parcela: R$ 5.000
- Demais parcelas: R$ 3.000
- Total 6 parcelas = R$ 23.000

Reajuste 10%:
- Primeira: R$ 5.000 × 1.10 = R$ 5.500
- Demais: R$ 3.000 × 1.10 = R$ 3.300
- saldo_devedor: (1 × 5.500) + (5 × 3.300) = R$ 21.000 ✅
```

---

## 🐛 Se Algo Não Funcionar

### Problema: Saldo devedor ainda desincronizado

**Solução:**
1. Chamar endpoint de sincronização:
   ```bash
   POST /api/contratos/{id}/sincronizar-saldo
   ```

2. Se ainda não funcionar, verifique:
   ```sql
   -- Verificar se há boletos com status inválido
   SELECT id, status, valor_parcela 
   FROM boletos 
   WHERE contrato_id = ? 
   AND status NOT IN ('aberto', 'liquidado', 'cancelado', 'vencido', 'rejeitado', 'baixado');
   ```

### Problema: Reajuste não atualiza valor_parcela

**Solução:**
1. Verificar se reajuste foi aplicado:
   ```sql
   SELECT indice_de_reajuste, data_do_ultimo_reajuste 
   FROM contratos 
   WHERE id = ?;
   ```

2. Verificar boletos:
   ```sql
   SELECT parcela, valor_parcela, data_vencimento, status 
   FROM boletos 
   WHERE contrato_id = ? 
   ORDER BY parcela;
   ```

3. Se valor_parcela não mudou:
   - Verificar se boletos têm `status = 'aberto'`
   - Verificar se `data_vencimento > data_do_reajuste`

---

## ✨ Resultado Esperado

Após todas as correções:

```
✅ Reajuste atualiza valor_parcela dos boletos
✅ Reajuste sincroniza saldo_devedor com soma de boletos
✅ Liquidação de boleto reduz saldo_devedor automaticamente
✅ Cancelamento de boleto recalcula saldo_devedor
✅ CNAB gerado com valores corretos
✅ Sincronização manual sempre funciona
✅ Sistema é determinístico (mesmos dados = mesmos resultados)
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend (console com `[DEBUG REAJUSTE]`)
2. Execute as queries SQL de validação
3. Teste o endpoint de sincronização
4. Consulte este documento para cenários similares

