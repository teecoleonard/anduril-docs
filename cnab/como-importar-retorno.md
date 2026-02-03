# 📝 Como Importar um Retorno CNAB

## 🎯 Objetivo
Aprender como processar um retorno CNAB do banco para atualizar status de pagamentos.

---

## ✅ Pré-requisitos

- ✓ Remessa CNAB já foi enviada ao banco
- ✓ Banco processou e retornou arquivo
- ✓ Arquivo de retorno disponível (extensão .ret ou .txt)

---

## 📍 Localização
**Menu Principal → CNAB → Importar Retorno**

---

## 🔢 Passo-a-Passo

### **Etapa 1: Acessar Importar Retorno**

1. Clique em **"CNAB"** no menu lateral
2. Clique em **"Importar Retorno"** ou **"+ Novo Retorno"**

> **[FOTO: Tela de CNAB com opção Importar Retorno]**

---

### **Etapa 2: Selecionar Arquivo de Retorno**

1. Clique em **"Escolher Arquivo"** ou **"Procurar"**
2. Localize o arquivo de retorno do banco
3. Selecione o arquivo (extensão .ret ou .txt)

**Formato esperado:**
- Arquivo CNAB 240 retorno do Sicoob
- Contém informações de processamento dos boletos

> **[FOTO: Dialog de seleção de arquivo de retorno]**

---

### **Etapa 3: Verificar Dados do Retorno**

Sistema exibe informações sobre o arquivo:

| Informação | Descrição |
|------------|-----------|
| **Data do Retorno** | Quando banco gerou o arquivo |
| **Boletos no Retorno** | Quantos boletos estão no arquivo |
| **Erros Detectados** | Se houver problemas |

> **[FOTO: Informações sobre o arquivo de retorno]**

---

### **Etapa 4: Processar Retorno**

1. Clique em **"Processar Retorno"** ou **"Importar"**
2. Sistema analisará cada boleto do retorno
3. Atualizará status conforme processamento

**O que o sistema faz:**
- ✅ Vincula retorno com remessa original
- ✅ Atualiza status de cada boleto
- ✅ Registra data de pagamento
- ✅ Gera log de processamento

> **[FOTO: Processamento em andamento - barra de progresso]**

---

### **Etapa 5: Revisar Resultado**

Após processar, sistema mostra:

```
Resultado da Importação
├─ Total Processado: X boletos
├─ Pagos: X (✅ Status "Pago")
├─ Rejeitados: X (❌ Verificar motivo)
└─ Erros: X (⚠️ Corrigir e reprocessar)
```

> **[FOTO: Resumo do resultado de importação]**

---

### **Etapa 6: Validar e Salvar**

1. Revise os resultados
2. Clique em **"Confirmar"** para finalizar
3. Mensagem de sucesso aparecerá

> **[FOTO: Mensagem de sucesso - Retorno importado!]**

---

## 📊 O Que Acontece Após Importar?

1. **Boletos atualizados** - Status muda conforme retorno
2. **Datas de pagamento registradas** - Quando banco processou
3. **Movimentação registrada** - Para rastreamento
4. **Relatórios atualizados** - Refletem novos status

---

## 📋 Status Que Podem Resultar

| Status | Significado | Ação |
|--------|------------|------|
| **Pago** | Boleto foi processado com sucesso | Nenhuma |
| **Rejeitado** | Banco recusou boleto | Verificar motivo e refazer |
| **Processando** | Ainda sendo processado | Aguardar próximo retorno |
| **Erro** | Problema na vinculação | Corrigir e reenviar |

---

## ⚠️ Possíveis Motivos de Rejeição

| Código | Motivo | Solução |
|--------|--------|---------|
| **01** | CPF inválido | Verifique CPF do cliente |
| **02** | Boleto duplicado | Não envie mesmo boleto 2x |
| **03** | Dados inconsistentes | Atualize dados do cliente |
| **08** | Código de rejeição do banco | Contate seu banco |

---

## 💡 Dicas Práticas

**Dica 1: Frequência de Retornos**
- Bancos geram retorno diário
- Importe retornos regularmente
- Facilita rastreamento de pagamentos

**Dica 2: Manter Arquivos**
- Guarde todos os arquivos de retorno
- Importante para auditoria

**Dica 3: Resolver Rejeições Rapidamente**
- Revise boletos rejeitados imediatamente
- Reenvie após correção

---

## 🔄 Próximos Passos

Após importar retorno:

1. **Verificar boletos rejeitados** - Se houver
2. **Corrigir dados** - Se necessário
3. **Gerar nova remessa** - Caso haja rejeições
4. **Gerar relatório** - Para análise

---

## ❌ Erros Comuns

| Erro | Solução |
|------|---------|
| "Arquivo não é válido" | Verifique se é arquivo de retorno correto |
| "Nenhum boleto correspondente" | Remessa não foi enviada antes |
| "Erro ao processar linha X" | Contate suporte, pode haver bug no arquivo |
| "Não consegui importar" | Tente novamente ou contact suporte |

---

## 📊 Fluxo Completo de Retorno

```
Arquivo de Retorno Recebido
            ↓
    Selecionado no Sistema
            ↓
    Validação de Formato
            ↓
    Processamento de Boletos
            ↓
    Atualização de Status
            ↓
    Geração de Log
            ↓
    Confirmação de Sucesso ✓
```

---

## 🔍 Como Verificar Resultado

Após importar, você pode:

1. **Ir para Boletos** - Verificar status de cada um
2. **Gerar Relatório** - Ver todos os pagamentos
3. **Consultar Log** - Ver detalhes do processamento

---

## 📸 Imagens Esperadas

- [ ] Tela de CNAB com opção Importar Retorno
- [ ] Dialog de seleção de arquivo
- [ ] Informações sobre o arquivo selecionado
- [ ] Barra de progresso do processamento
- [ ] Resumo do resultado de importação
- [ ] Mensagem de sucesso final

---

## 🚨 Importante

**Se houver erros na importação:**
1. Anote os códigos de erro
2. Revise dados dos boletos rejeitados
3. Contate seu banco para clarificar
4. Reenvie com dados corrigidos

---

**Próximo Guia**: [Diagnostico de Problemas CNAB](./diagnostico-problemas.md)
