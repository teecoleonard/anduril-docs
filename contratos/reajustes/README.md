# 📈 Sistema de Reajustes de Contratos

Documentação completa sobre o sistema de reajustes de contratos, incluindo arquitetura, implementação e guias de uso.

## 📚 Documentos Disponíveis

### 1. [Solução de Sincronização](./solucao-sincronizacao.md)
Explicação detalhada da solução implementada para sincronizar o saldo devedor com a soma real dos boletos.

**Tópicos:**
- Problema identificado
- Conceitos-chave (valor_parcela vs saldo_devedor)
- Implementação da solução
- Exemplo prático
- Endpoints disponíveis

### 2. [Arquitetura do Sistema](./arquitetura.md)
Diagrama completo de fluxos e arquitetura da solução.

**Tópicos:**
- Fluxo 1: Aplicação de Reajuste
- Fluxo 2: Liquidação de Boleto via CNAB
- Fluxo 3: Sincronização Manual
- Diagrama de Banco de Dados
- Ciclo de vida do saldo devedor

### 3. [Guia de Testes](./guia-testes.md)
Checklist completo para testar toda a funcionalidade de reajustes.

**Tópicos:**
- Teste básico de reajuste
- Teste de geração de remessa CNAB
- Teste de geração de próximas parcelas
- Teste de sincronização manual
- Cenários avançados

### 4. [Reajustes a Longo Prazo](./longo-prazo.md)
Análise de reajustes em contratos de longa duração (30+ anos).

**Tópicos:**
- Exemplo prático de 30 anos
- Padrão observado
- Progressão cumulativa
- Fluxo de liquidação com reajustes

---

## 🎯 Começar Rápido

### Se você quer apenas usar o sistema:
👉 [Guia de Testes](./guia-testes.md) - Passos simples para testar

### Se você quer entender o problema e a solução:
👉 [Solução de Sincronização](./solucao-sincronizacao.md) - Explicação completa

### Se você quer ver a arquitetura técnica:
👉 [Arquitetura do Sistema](./arquitetura.md) - Diagramas de fluxo

---

## 🔑 Conceitos Essenciais

### `valor_parcela` (no Contrato)
- Valor base para criar novos boletos
- Muda quando aplicamos reajuste
- Afeta apenas próximos boletos

### Boletos (já criados)
- Imutáveis - nunca mudam após criação
- Congelam o valor_parcela da época
- Independentes um do outro

### `saldo_devedor` (no Contrato)
- Soma de todos os boletos com status 'aberto'
- Recalculado automaticamente
- Nunca deve ser alterado manualmente

---

## 📋 Fluxo Padrão

```
1. Criar contrato com X parcelas
2. Gerar boletos (1-12)
3. Aplicar reajuste anual (10%)
   └─ Boletos 1-12: continuam originais
   └─ Próximos boletos (13-24) usam novo valor
4. Processar liquidações via CNAB
   └─ saldo_devedor reduz automaticamente
5. Após 1 ano, novo reajuste
   └─ Próximos boletos multiplicam o valor reajustado
```

---

## 🚀 Endpoints API

```
POST   /api/contratos/{id}/reajustar
  └─ Aplicar reajuste anual
  └─ Body: { indice_de_reajuste: 10, data_do_reajuste?: "2026-02-05" }

POST   /api/contratos/{id}/sincronizar-saldo
  └─ Sincronizar saldo_devedor manualmente
  └─ Útil se detectar desincronização
```

---

## ✅ Checklist de Funcionalidades

- [x] Reajuste ajusta valor_parcela para próximos boletos
- [x] Boletos já criados nunca mudam
- [x] saldo_devedor sincronizado com soma de boletos
- [x] Liquidação via CNAB reduz saldo_devedor automaticamente
- [x] Endpoint de sincronização manual disponível
- [x] Histórico de reajustes registrado
- [x] Suporta múltiplos reajustes no mesmo contrato
- [x] Funciona com contratos de longa duração (30+ anos)

---

## 📞 Dúvidas Comuns

**P: Se eu aplicar reajuste, os boletos já emitidos mudam?**
R: Não! Boletos já criados são imutáveis. Apenas o valor_parcela do contrato muda (para próximos boletos).

**P: O saldo_devedor é calculado ou armazenado?**
R: Sempre recalculado como SUM(boletos abertos). Nunca alterado manualmente.

**P: Como sincronizar se detectar desincronização?**
R: **POST /api/contratos/{id}/sincronizar-saldo**

**P: Posso ter múltiplos reajustes em um contrato?**
R: Sim! Cada novo reajuste multiplica o valor_parcela anterior.

---

## 🔍 Verificação Rápida

Query SQL para validar se tudo está sincronizado:

```sql
SELECT 
  c.id,
  c.numero_contrato,
  c.saldo_devedor as contrato,
  SUM(b.valor_parcela) as boletos,
  ABS(c.saldo_devedor - SUM(b.valor_parcela)) as diferenca
FROM contratos c
LEFT JOIN boletos b ON c.id = b.contrato_id AND b.status = 'aberto'
GROUP BY c.id
HAVING diferenca > 0.01;
```

Se retornar vazio = tudo sincronizado! ✅
