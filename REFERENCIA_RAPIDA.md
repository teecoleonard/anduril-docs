# ⚡ Referência Rápida - ERP Anduril

**Uma página com tudo o que você precisa saber imediatamente**

---

## 🚀 Endpoints Principais

### Contratos
```
POST   /api/contratos                          Criar novo contrato
GET    /api/contratos                          Listar todos
GET    /api/contratos/{id}                     Obter detalhes
PATCH  /api/contratos/{id}                     Editar contrato
DELETE /api/contratos/{id}                     Deletar contrato

POST   /api/contratos/{id}/reajustar          Aplicar reajuste anual
POST   /api/contratos/{id}/sincronizar-saldo  Sincronizar saldo_devedor
```

### Boletos
```
POST   /api/boletos                            Criar boleto individual
POST   /api/boletos/gerar-por-contrato        Gerar boletos em lote
GET    /api/boletos/{id}                       Obter detalhes
PATCH  /api/boletos/{id}                       Editar boleto
```

### CNAB
```
POST   /api/cnab/remessa/gerar                Gerar remessa CNAB
POST   /api/cnab/remessa/download/{id}        Baixar remessa gerada
POST   /api/cnab/retorno/importar             Importar retorno do banco
GET    /api/cnab/remessas                      Listar remessas
GET    /api/cnab/retornos                      Listar retornos
```

### Outros
```
GET    /api/clientes/{id}                      Obter dados de cliente
GET    /api/empresa                            Obter dados da empresa
POST   /api/empresa                            Configurar dados da empresa
```

---

## 📋 Modelos Principais

### Contrato
```json
{
  "id": 1,
  "numero_contrato": "CONT-001",
  "valor_parcela": 3333.33,
  "saldo_devedor": 19999.98,
  "quantidade_parcelas": 6,
  "indice_de_reajuste": null,
  "data_do_ultimo_reajuste": null,
  "cliente_id": 1,
  "created_at": "2026-01-01"
}
```

### Boleto
```json
{
  "id": 1,
  "contrato_id": 1,
  "valor_parcela": 3333.33,
  "status": "aberto",
  "data_vencimento": "2026-02-15",
  "data_pagamento": null,
  "valor_pago": null
}
```

---

## 🔑 Conceitos-Chave em 60 Segundos

### `valor_parcela` (no Contrato)
- Valor base para **próximos boletos**
- Muda quando reajuste é aplicado
- Cada boleto congelso seu valor

### `saldo_devedor`
- **SUM** de todos boletos com status `'aberto'`
- Sincronizado automaticamente
- Nunca alterar manualmente

### Boletos
- 🔒 **Imutáveis** após criação
- Uma vez R$ 3.333,33, sempre R$ 3.333,33
- Reajuste não afeta boletos já emitidos

---

## 🔄 Fluxo Padrão: Contrato Completo

```
1. CRIAR CONTRATO
   └─ valor_parcela: R$ 3.333,33

2. GERAR BOLETOS (1-6)
   └─ 6 boletos × R$ 3.333,33 cada
   └─ saldo_devedor: R$ 19.999,98

3. 1 ANO DEPOIS: REAJUSTE 10%
   ├─ valor_parcela: R$ 3.666,66 novo
   ├─ Boletos 1-6: continuam R$ 3.333,33
   └─ saldo_devedor: continua R$ 19.999,98

4. GERAR PRÓXIMOS BOLETOS (7-12)
   └─ 6 boletos × R$ 3.666,66 nova taxa
   └─ saldo_devedor: R$ 39.999,94

5. PROCESSAR RETORNO CNAB
   ├─ Boleto 1 liquidado
   ├─ saldo_devedor reduz: R$ 36.666,61
   └─ Repete até todos pagarem
```

---

## 🧪 Queries Úteis

### Ver contrato + saldo sincronizado?
```sql
SELECT 
  c.numero_contrato,
  c.saldo_devedor,
  SUM(b.valor_parcela) as boletos_abertos,
  (c.saldo_devedor - SUM(b.valor_parcela)) as diferenca
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status='aberto'
WHERE c.id = ?
GROUP BY c.id;
```

### Listar contratos com desincronização
```sql
SELECT 
  c.numero_contrato,
  c.saldo_devedor,
  SUM(b.valor_parcela) as real
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status='aberto'
GROUP BY c.id
HAVING ABS(c.saldo_devedor - SUM(b.valor_parcela)) > 0.01;
```

### Ver histórico de reajustes
```sql
SELECT 
  numero_contrato,
  indice_de_reajuste,
  data_do_ultimo_reajuste
FROM contratos
WHERE indice_de_reajuste IS NOT NULL;
```

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| saldo_devedor errado | `POST /contratos/{id}/sincronizar-saldo` |
| Boleto com valor errado | Verificar `status='aberto'` e `contrato_id` |
| Reajuste não funcionando | Validar 1 ano desde último reajuste |
| CNAB não importa | Verificar formato do arquivo |

---

## 🎯 Checklist: Gerar Remessa Correta

- [ ] Contrato existe e está ativo
- [ ] `saldo_devedor` está sincronizado (cheque com query)
- [ ] Boletos têm status `'aberto'`
- [ ] Datas de vencimento são futuras
- [ ] Dados da empresa estão preenchidos
- [ ] Banco SICOOB configurado
- [ ] Gerar remessa
- [ ] Verificar valores no arquivo gerado

---

## 💰 Cálculos Rápidos

### Saldo Devedor
```
saldo_devedor = COUNT(boletos abertos) × valor_parcela
              = 6 × 3.333,33
              = 19.999,98
```

### Após Reajuste
```
novo_valor_parcela = valor_parcela × (1 + indice/100)
                   = 3.333,33 × 1.10
                   = 3.666,66
```

### Após Liquidação
```
novo_saldo = SUM(boletos não-pagos)
           = (6-1) × 3.333,33  ou  5 × 3.333,33
           = 16.666,65
```

---

## 📚 Documentação Completa

Para aprender mais, consulte:

- 📖 [INDEX.md](INDEX.md) - Índice completo
- 🏗️ [PRINCIPIOS_ARQUITETURA.md](PRINCIPIOS_ARQUITETURA.md) - Conceitos
- 📈 [docs/contratos/reajustes/](docs/contratos/reajustes/) - Reajustes
- 🔗 [docs/cnab/](docs/cnab/) - CNAB completo
- 🚀 [MUDANCAS_RECENTES.md](MUDANCAS_RECENTES.md) - O que é novo

---

## ⏱️ Tempos Típicos

| Operação | Tempo |
|----------|-------|
| Criar contrato | <100ms |
| Gerar 12 boletos | 200-500ms |
| Reajuste | 100-300ms |
| Sincronizar saldo | 50-100ms |
| Gerar remessa CNAB | 1-3s |
| Importar retorno CNAB | 2-5s |

---

## 🔐 Autorização Típica

```
POST /api/contratos/{id}/reajustar
  ├─ Usuário autenticado ✓
  ├─ Permissão: EDIT_CONTRATO ✓
  └─ Há 1 ano desde último reajuste ✓
```

---

**Salve esta página! Bookmark:** Ctrl+D ou Cmd+D 📌

---

*Última atualização: 8 de Fevereiro de 2026*
