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

### ✔️ **Contrato(s) Encerrado(s)**
**Significado:** Todos os contratos foram finalizados  
**Quando fica assim:** Quando todas as parcelas foram pagas  
**O que fazer:** Manter histórico para referência  

---

## 🔄 Diagrama de Transição

```
    CRIADO (Ativo)
        ↓
    [Usar em Contratos]
        ↓
    COM CONTRATOS ATIVOS
        ↓
    [Contratos são pagos]
        ↓
    CONTRATOS ENCERRADOS
        ↓
    [Opcionalmente marcar Inativo]
        ↓
    INATIVO
```

---

## 💡 Dicas Práticas

1. **Sempre crie cliente antes do contrato**
   - Sistema exige cliente para contrato
   
2. **Dados completos facilitam operações**
   - CPF/CNPJ completo
   - Telefone e email se possível
   
3. **Não deleta cliente, apenas inativa**
   - Histórico é mantido
   - Pode ser reativado

4. **Use busca para encontrar cliente**
   - Busca por nome ou CPF/CNPJ
   - Evita duplicação

---

## 📸 Campos de Referência

Cada cliente tem:
- 🆔 **ID único** - Gerado automaticamente
- 👤 **Nome/Razão Social** - Obrigatório
- 📝 **CPF/CNPJ** - Obrigatório e único
- ☎️ **Telefone** - Opcional mas recomendado
- 📧 **Email** - Opcional
- 📍 **Endereço** - Opcional
- 📅 **Data de Criação** - Automática
- 📊 **Contatos Ativos** - Quantos contratos tem

---

## 🔍 Como Verificar Status de Cliente

1. Vá para **Clientes**
2. Procure o cliente na lista
3. Coluna de Status mostra situação
4. Clique para ver detalhes completos
5. Veja lista de contratos associados

---

**[Voltar ao README de Clientes](./README.md)**
