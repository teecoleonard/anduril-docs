# 📊 Status dos Clientes

## 📋 Visão Geral

Os clientes no sistema não possuem "status" como outros componentes, mas existem diferentes estados que refletem sua situação no sistema.

---

## 🎯 Estados Possíveis

### ✅ **Ativo**
**Significado:** Cliente pode ser usado em contratos e operações  
**Quando fica assim:** Quando é criado  
**O que fazer:** Usar normalmente para criar contratos  

---

### 🔒 **Inativo**
**Significado:** Cliente não pode ser usado em novas operações  
**Quando fica assim:** Você marca manualmente como inativo  
**O que fazer:** Reativar se precisar usar novamente  

---

### 📋 **Com Contratos Ativos**
**Significado:** Cliente tem contratos em andamento  
**Quando fica assim:** Quando tem contratos com status ativo  
**O que fazer:** Acompanhar vencimentos e pagamentos  

---

## 🔄 Diagrama de Transição

```
    CRIADO (Ativo)
        ↓
    [Usar em Contratos]
        ↓
    COM CONTRATOS ATIVOS
```

---

## 💡 Dicas Práticas

1. **Sempre crie cliente antes do contrato** - Sistema exige cliente para contrato
2. **Dados completos facilitam operações** - CPF/CNPJ completo, telefone e email
3. **Não deleta cliente, apenas inativa** - Histórico é mantido
4. **Use busca para encontrar cliente** - Busca por nome ou CPF/CNPJ

---

**Guia anterior**: [Clientes](./index.md)
