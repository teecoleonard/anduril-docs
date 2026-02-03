# 📝 Como Gerar um Boleto por Contrato

## 🎯 Objetivo
Aprender como criar um boleto para um contrato específico.

---

## ✅ Pré-requisitos
- ✓ Contrato já criado no sistema
- ✓ Contrato com cliente e terreno vinculados
- ✓ Data de vencimento definida

---

## 📍 Localização
**Menu Principal → Boletos → Novo Boleto**

---

## 🔢 Passo-a-Passo

### **Etapa 1: Acessar Novo Boleto**

1. Clique em **"Boletos"** no menu lateral
2. Clique em **"+ Novo Boleto"**

> **[FOTO: Tela de Boletos com botão Novo Boleto]**

---

### **Etapa 2: Selecionar Contrato**

1. No campo **"Contrato"**, clique para abrir a lista
2. Busque pelo contrato desejado (mostra cliente + contrato)
3. Selecione o contrato

**Dados que aparecem automaticamente:**
- Cliente (nome)
- Terreno (código)
- Valor do boleto (conforme contrato)

> **[FOTO: Seleção de contrato com dados preenchidos]**

---

### **Etapa 3: Definir Data de Vencimento**

1. No campo **"Vencimento"**, escolha a data
2. A data deve ser futura ou de hoje

> **[FOTO: Campo de data de vencimento]**

---

### **Etapa 4: Definir Valor (Opcional)**

- O sistema preenche automaticamente com o valor do contrato
- Se necessário ajustar, edite o valor

> **[FOTO: Campo de valor preenchido]**

---

### **Etapa 5: Salvar Boleto**

1. Revise todos os dados
2. Clique em **"Salvar"** ou **"Criar Boleto"**
3. Mensagem de sucesso aparecerá

> **[FOTO: Mensagem de sucesso - Boleto criado!]**

---

## 📊 Status do Boleto

Após criação, o boleto terá status: **Aberto**

Pode mudar para:
- **Enviado** - Quando incluído em remessa CNAB
- **Pago** - Quando retorno CNAB confirma pagamento
- **Cancelado** - Se você cancelar manualmente

---

## ⚠️ Validações Importantes

✅ Contrato deve existir  
✅ Data de vencimento não pode ser no passado  
✅ Valor deve ser positivo  

---

## 💡 Dicas Práticas

**Dica 1: Gerar Conforme Contrato**
- Respeite as datas do contrato
- Para parcelas, gere boletos mensais

**Dica 2: Valor do Boleto**
- Pode ser diferente do valor total do contrato
- Útil para parcelas ou ajustes

**Dica 3: Antes de Remessa**
- Gere todos os boletos necessários
- Depois envie para o banco via CNAB

---

## 🔄 Próximos Passos

Após gerar o boleto:

1. **Gerar mais boletos** se contrato tiver múltiplas parcelas
2. **[Gerar Remessa CNAB](../cnab/como-gerar-remessa.md)** para enviar ao banco
3. Acompanhar status na lista de boletos

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| "Contrato não encontrado" | Crie o contrato primeiro |
| "Data inválida" | Use data futura ou de hoje |
| "Valor inválido" | Insira número positivo |

---

## 📸 Imagens Esperadas

- [ ] Tela de Boletos com botão "Novo Boleto"
- [ ] Seleção de contrato
- [ ] Campos de Data e Valor preenchidos
- [ ] Mensagem de sucesso

---

**Próximo Guia**: [Como Gerar Múltiplos Boletos](./como-gerar-multiplos-boletos.md)
