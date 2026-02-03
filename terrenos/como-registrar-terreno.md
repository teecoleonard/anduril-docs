# 📝 Como Registrar um Novo Terreno

## 🎯 Objetivo
Aprender como cadastrar um novo terreno no sistema.

---

## ✅ Pré-requisitos
- ✓ Dados do terreno disponíveis (localização, área, preço)
- ✓ Sistema ERP aberto

---

## 📍 Localização
**Menu Principal → Terrenos → Novo Terreno**

---

## 🔢 Passo-a-Passo

### **Etapa 1: Acessar Nova Terreno**

1. Clique em **"Terrenos"** no menu lateral
2. Clique em **"+ Novo Terreno"**

> **[FOTO: Tela de Terrenos com botão Novo Terreno]**

---

### **Etapa 2: Preencher Dados Identificação**

| Campo | Obrigatório | Descrição |
|-------|------------|-----------|
| **Código** | ✅ | Identificador único (ex: TER-001) |
| **Descrição** | ✅ | Nome/descrição do terreno |
| **Lote** | ✅ | Número do lote |
| **Quadra** | ✅ | Número da quadra |

> **[FOTO: Seção de Identificação preenchida]**

---

### **Etapa 3: Preencher Dados Geográficos**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Logradouro** | Texto | Rua/avenida |
| **Número** | Número | Número do lote |
| **Bairro** | Texto | Bairro/região |
| **Cidade** | Texto | Município |
| **Estado** | Dropdown | UF |
| **CEP** | Texto | Código postal |

> **[FOTO: Seção de Localização preenchida]**

---

### **Etapa 4: Preencher Dados Comerciais**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Área (m²)** | Número | Metragem do terreno |
| **Preço** | Moeda | Valor do terreno |
| **Preço/m²** | Moeda | Calculado automaticamente |
| **Status** | Dropdown | Disponível (padrão) |

> **[FOTO: Seção de Dados Comerciais]**

---

### **Etapa 5: Validar e Salvar**

1. Revise todos os dados
2. Clique em **"Salvar"** ou **"Criar Terreno"**
3. Mensagem de sucesso aparecerá

> **[FOTO: Mensagem de sucesso]**

---

## ⚠️ Validações Importantes

✅ Código deve ser único  
✅ Lote e Quadra devem ser números válidos  
✅ Área deve ser positiva (> 0)  
✅ Preço deve ser positivo (> 0)  
✅ Campos obrigatórios devem estar preenchidos  

---

## 📊 Status Inicial

Todo novo terreno começa com status: **🟢 Disponível**

Pode mudar para:
- 🟡 **Reservado** - Quando contrato em análise
- 🔴 **Vendido** - Quando contrato é confirmado

---

## 💡 Dicas Práticas

**Dica 1: Código Padronizado**
- Use formato consistente: TER-001, TER-002, etc
- Facilita buscas e identificação

**Dica 2: Preço por m²**
- Calculado automaticamente
- Ajuda a comparar terrenos

**Dica 3: Localização Completa**
- Dados geográficos facilitam documentação
- Importante para relatórios e boletos

---

## 🔄 Próximos Passos

Após registrar o terreno:

1. **[Gerar Contrato](../contratos/como-gerar-contrato.md)** para vender
2. **[Gerar Boleto](../boletos/como-gerar-boleto.md)** para o cliente
3. Acompanhar status na lista de terrenos

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| "Código já existe" | Use outro código único |
| "Área/Preço inválidos" | Insira números positivos |
| "Campo obrigatório vazio" | Preencha Código, Descrição, Lote, Quadra |

---

## 📸 Imagens Esperadas

- [ ] Tela de Terrenos com botão "Novo Terreno"
- [ ] Seção de Identificação preenchida
- [ ] Seção de Localização preenchida
- [ ] Seção de Dados Comerciais preenchida
- [ ] Mensagem de sucesso

---

**Próximo Guia**: [Status dos Terrenos](./status-terrenos.md)
