# 📝 Como Gerar um Novo Contrato

## 🎯 Objetivo
Aprender como criar um novo contrato vinculando um cliente a um terreno.

---

## ✅ Pré-requisitos
- ✓ Cliente já cadastrado no sistema
- ✓ Terreno disponível para venda
- ✓ Dados da condição de pagamento

---

## 📍 Localização
**Menu Principal → Contratos → Novo Contrato**

---

## 🔢 Passo-a-Passo

### **Etapa 1: Acessar Nova Contrato**

1. Na janela principal, clique em **"Contratos"** no menu lateral
2. Clique no botão **"+ Novo Contrato"**

> **[FOTO: Tela de Contratos com botão Novo Contrato]**

---

### **Etapa 2: Selecionar Cliente**

1. No campo **"Cliente"**, clique para abrir a lista
2. Busque pelo nome ou CPF do cliente
3. Selecione o cliente desejado

> **[FOTO: Dropdown de seleção de cliente]**

---

### **Etapa 3: Selecionar Terreno**

1. No campo **"Terreno"**, clique para abrir a lista
2. O sistema mostrará apenas terrenos com status **"Disponível"**
3. Selecione o terreno

**Campos que aparecem automaticamente:**
- Código do Terreno
- Lote e Quadra
- Área (m²)
- Valor (preço do terreno)

> **[FOTO: Seleção de terreno com campos preenchidos]**

---

### **Etapa 4: Preencher Dados de Pagamento**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Forma de Pagamento** | Dropdown | À Vista, Parcelado, etc |
| **Valor do Contrato** | Moeda | Preço total (auto-preenchido) |
| **Parcelas** | Número | Quantas parcelas (se parcelado) |
| **Vencimento da 1ª Parcela** | Data | Data do 1º boleto |

> **[FOTO: Seção de pagamento preenchida]**

---

### **Etapa 5: Salvar Contrato**

1. Revise todos os dados
2. Clique em **"Salvar"** ou **"Criar Contrato"**
3. Mensagem de sucesso aparecerá

> **[FOTO: Mensagem de sucesso]**

---

## 📊 Status dos Contratos

Após criação, o contrato pode ter estes status:

| Status | Significado | Ação |
|--------|------------|------|
| **Ativo** | Contrato vigente, boletos sendo gerados | Normal |
| **Encerrado** | Todas as parcelas pagas | Contrato finalizado |
| **Cancelado** | Contrato desativado | Terreno fica disponível novamente |

---

## ⚠️ Validações Importantes

✅ Cliente deve existir no sistema  
✅ Terreno deve estar com status "Disponível"  
✅ Forma de pagamento deve ser válida  
✅ Data de vencimento não pode ser no passado  

---

## 💡 Dicas Práticas

**Dica 1: Verificar Terreno Disponível**
- Antes de gerar contrato, confirme que o terreno está "Disponível"
- Se estiver "Reservado" ou "Vendido", não poderá usar

**Dica 2: Datas de Pagamento**
- A primeira data de vencimento será usada para o primeiro boleto
- Parcelas posteriores serão calculadas automaticamente

**Dica 3: Valor do Contrato**
- É preenchido automaticamente com o valor do terreno
- Poderá ser alterado se houver negociação

---

## 🔄 Próximos Passos

Após criar o contrato, você pode:

1. **[Gerar Boletos](../boletos/como-gerar-boleto.md)** para cobrar o cliente
2. **[Gerar Remessa CNAB](../cnab/como-gerar-remessa.md)** para banco
3. Acompanhar pagamentos na lista de contratos

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| "Cliente não encontrado" | Crie o cliente primeiro em Clientes → Novo Cliente |
| "Nenhum terreno disponível" | Verifique se há terrenos com status "Disponível" |
| "Data inválida" | Use data futura ou de hoje |

---

## 📸 Imagens Esperadas

- [ ] Tela de Contratos com botão "Novo Contrato"
- [ ] Seleção de cliente
- [ ] Seleção de terreno com dados preenchidos
- [ ] Seção de pagamento completa
- [ ] Mensagem de sucesso

---

**Próximo Guia**: [Status dos Contratos](./status-contratos.md)
