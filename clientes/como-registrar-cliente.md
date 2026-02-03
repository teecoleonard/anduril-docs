# 📝 Como Registrar um Novo Cliente

## 🎯 Objetivo
Aprender passo-a-passo como cadastrar um novo cliente no ERP Anduril.

---

## ✅ Pré-requisitos
- ✓ Sistema ERP Anduril instalado e aberto
- ✓ Ter dados do cliente disponíveis (nome, CPF/CNPJ, telefone, endereço)

---

## 📍 Localização
**Menu Principal → Clientes → Novo Cliente**

---

## 🔢 Passo-a-Passo

### **Etapa 1: Acessar a Tela de Novo Cliente**

1. Na janela principal do ERP, clique em **"Clientes"** na barra de menu lateral
2. Clique no botão **"+ Novo Cliente"** (geralmente no topo direito)

> **[FOTO: Tela de Clientes com botão Novo Cliente]**

---

### **Etapa 2: Preencher Dados Básicos**

Na tela de cadastro, você verá os seguintes campos:

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|------------|-----------|
| **Nome/Razão Social** | Texto | ✅ | Nome do cliente ou empresa |
| **CPF/CNPJ** | Texto | ✅ | Documento de identificação |
| **Telefone** | Texto | ❌ | Contato do cliente |
| **Email** | Texto | ❌ | E-mail para contato |

**Exemplo de preenchimento:**
```
Nome: João da Silva
CPF: 123.456.789-00
Telefone: (85) 98765-4321
Email: joao@email.com
```

> **[FOTO: Formulário preenchido com dados do cliente]**

---

### **Etapa 3: Preencher Endereço (Opcional)**

Se necessário, preencha os dados de endereço:

| Campo | Descrição |
|-------|-----------|
| **Rua/Logradouro** | Nome da via |
| **Número** | Número do imóvel |
| **Complemento** | Apto, sala, etc (opcional) |
| **Bairro** | Bairro |
| **Cidade** | Município |
| **Estado** | UF (sigla) |
| **CEP** | Código postal |

> **[FOTO: Seção de Endereço preenchida]**

---

### **Etapa 4: Validar Dados**

Antes de salvar, o sistema faz validações automáticas:

✅ **CPF/CNPJ válido** (verificação de dígito verificador)  
✅ **Dados obrigatórios preenchidos**  
✅ **Sem duplicação de CPF/CNPJ**  

Se houver erro, uma mensagem indicará o que corrigir.

> **[FOTO: Mensagem de validação - exemplo de erro]**

---

### **Etapa 5: Salvar Cliente**

1. Clique no botão **"Salvar"** (ou **"Criar Cliente"**)
2. O sistema salvará e você será redirecionado para a ficha do cliente
3. Uma mensagem de confirmação aparecerá no topo: **"Cliente criado com sucesso!"**

> **[FOTO: Mensagem de sucesso]**

---

## 📊 O Que Acontece Após Salvar?

✅ Cliente aparecerá na lista de clientes  
✅ Poderá ser vinculado a contratos  
✅ Seus dados aparecerão automaticamente em boletos e remessas  
✅ Sistema criará um ID único para referência  

---

## ⚠️ Validações Importantes

### CPF/CNPJ Válidos

O sistema valida automaticamente:
- **CPF**: 11 dígitos, validação de dígito verificador
- **CNPJ**: 14 dígitos, validação de dígito verificador

❌ **Errados:**
- CPF: 000.000.000-00 (inválido)
- CNPJ: 00.000.000/0000-00 (inválido)

✅ **Corretos:**
- CPF: 123.456.789-00 (exemplo)
- CNPJ: 12.345.678/0001-99 (exemplo)

### Campos Obrigatórios

Deve preencher obrigatoriamente:
- ✅ Nome/Razão Social
- ✅ CPF/CNPJ

Opcionais (recomenda-se preencher):
- ❌ Telefone
- ❌ Email
- ❌ Endereço

---

## 💡 Dicas Práticas

**Dica 1: Verificar Duplicação**
- Antes de criar, use a busca para verificar se o cliente já existe
- Evita clientes duplicados na base

**Dica 2: Dados Consistentes**
- Use sempre o mesmo formato para telefone (com ou sem hífen)
- Padronize nomes (evite "João" e "JOÃO" para a mesma pessoa)

**Dica 3: Email Correto**
- O email será usado para notificações do sistema
- Verifique antes de salvar

---

## 🔄 Próximos Passos

Após registrar o cliente, você pode:

1. **[Criar um Contrato](../contratos/como-gerar-contrato.md)** para este cliente
2. **[Gerar Boletos](../boletos/como-gerar-boleto.md)** vinculados ao seu contrato
3. **[Exportar Relatório](../exportacao/README.md)** com os clientes cadastrados

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| "CPF/CNPJ inválido" | Verifique o documento (dígitos verificadores) |
| "Este CPF/CNPJ já existe" | O cliente já foi cadastrado; edite-o ou busque |
| "Campo obrigatório em branco" | Preencha Nome e CPF/CNPJ |
| "Não consegui salvar" | Verifique conexão e tente novamente |

---

## 📸 Imagens Esperadas (Locais para Adicionar Fotos)

- [ ] Tela inicial de Clientes com botão "Novo Cliente"
- [ ] Formulário vazio pronto para preenchimento
- [ ] Formulário preenchido com dados de exemplo
- [ ] Seção de Endereço completa
- [ ] Mensagem de validação/erro
- [ ] Mensagem de sucesso ao salvar

---

**Próximo Guia**: [Como Editar Dados do Cliente](./como-editar-cliente.md)
