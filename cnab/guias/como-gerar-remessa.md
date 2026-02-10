# 📝 Como Gerar uma Remessa CNAB

## 🎯 Objetivo
Aprender como gerar uma remessa CNAB 240 para enviar boletos ao banco.

---

## ✅ Pré-requisitos

- ✓ Dados da empresa completos (CNPJ, banco, agência, conta)
- ✓ Boletos criados e com status "Aberto"
- ✓ Cliente com dados válidos
- ✓ Conta bancária ativa

---

## 📍 Localização
**Menu Principal → CNAB → Gerar Remessa**

---

## 🔢 Passo-a-Passo

### **Etapa 1: Acessar Gerar Remessa**

1. Clique em **"CNAB"** no menu lateral
2. Clique em **"Gerar Remessa"** ou **"+ Nova Remessa"**

> **[FOTO: Tela de CNAB com opção Gerar Remessa]**

---

### **Etapa 2: Verificar Dados da Empresa**

O sistema exibe os dados que serão usados:

| Campo | Descrição |
|-------|-----------|
| **CNPJ Empresa** | CNPJ que será incluído na remessa |
| **Banco** | Código do banco (ex: 756 = Sicoob) |
| **Agência** | Número da agência bancária |
| **Conta** | Número da conta corrente |

⚠️ **Se algum dado estiver faltando:**
- Clique em **"Configurar Dados da Empresa"**
- Volte a [Empresa → Dados Bancários](../empresa/README.md)
- Preencha e volte

> **[FOTO: Dados da Empresa exibidos para verificação]**

---

### **Etapa 3: Selecionar Boletos**

1. Sistema mostra lista de boletos com status **"Aberto"**
2. Selecione os boletos que deseja incluir na remessa

**Coluna de Informações:**
- Nome do cliente
- Valor do boleto
- Data de vencimento
- Status

> **[FOTO: Lista de boletos para seleção]**

---

### **Etapa 4: Revisar Resumo**

Antes de gerar, verifique:

```
Resumo da Remessa
├─ Total de Boletos: X
├─ Valor Total: R$ XXX.XXX,XX
├─ Data de Geração: dd/mm/aaaa
└─ Data Base: dd/mm/aaaa
```

> **[FOTO: Tela de Resumo antes de gerar]**

---

### **Etapa 5: Gerar Remessa**

1. Clique em **"Gerar Remessa CNAB"**
2. Sistema processará os dados
3. Arquivo será gerado e baixado automaticamente

> **[FOTO: Mensagem de sucesso - Remessa gerada!]**

---

### **Etapa 6: Salvar o Arquivo**

O arquivo gerado será: **remessa_YYYYMMDD_HHMMSS.txt**

✅ Salve em local seguro  
✅ Anote o nome do arquivo  
✅ Guarde para consultas futuras  

> **[FOTO: Dialog de download do arquivo]**

---

## 📊 O Que Acontece Após Gerar?

1. **Arquivo CNAB criado** - Pronto para enviar ao banco
2. **Boletos mudam para "Enviado"** - Quando confirmado no banco
3. **Remessa é registrada** - Rastreável no sistema
4. **Aguarda retorno** - Banco processará e retornará confirmação

---

## ⚠️ Validações Importantes

✅ Todos os dados da empresa devem estar preenchidos  
✅ Boletos selecionados devem ter status "Aberto"  
✅ Dados de cliente devem estar completos  
✅ Arquivo será gerado em formato CNAB 240  

---

## 💡 Dicas Práticas

**Dica 1: Verificar Dados Primeiro**
- Antes de gerar remessa grande, teste com 1-2 boletos
- Confirme se arquivo é válido no banco

**Dica 2: Guardar Número de Remessa**
- Anote o número da remessa gerada
- Use para rastreamento futuro

**Dica 3: Horário de Envio**
- Bancos têm horários de corte para processamento
- Envie com antecedência

---

## 🔄 Próximos Passos

Após gerar a remessa:

1. **Enviar ao banco** via internet banking ou pendrive
2. **Aguardar processamento** (geralmente 1 dia útil)
3. **[Importar Retorno CNAB](./como-importar-retorno.md)** para confirmar

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| "Dados de empresa incompletos" | Configure Empresa → Dados Bancários |
| "Nenhum boleto selecionado" | Selecione pelo menos um boleto |
| "Boleto com dados inválidos" | Corrija dados do boleto/cliente |
| "Não consegui gerar arquivo" | Verifique espaço em disco e tente novamente |

---

## 📋 Checklist Pré-Remessa

- [ ] CNPJ da empresa preenchido
- [ ] Código do banco correto (756 = Sicoob)
- [ ] Número da agência correto
- [ ] Número da conta correto
- [ ] Boletos criados com dados válidos
- [ ] Clientes têm CPF/CNPJ válido
- [ ] Datas de vencimento futuras

---

## 📸 Imagens Esperadas

- [ ] Tela de CNAB com opção Gerar Remessa
- [ ] Verificação de Dados da Empresa
- [ ] Lista de boletos para seleção
- [ ] Tela de Resumo antes de gerar
- [ ] Mensagem de sucesso - Remessa gerada
- [ ] Dialog de download do arquivo

---

**Próximo Guia**: [Como Importar um Retorno CNAB](./como-importar-retorno.md)
