# 🏢 Módulo de Empresa

## 📋 Visão Geral

O módulo de **Empresa** centraliza todas as informações da empresa necessárias para operações bancárias e emissão de documentos. Estes dados são usados em todas as remessas CNAB, boletos e relatórios.

---

## 🎯 Principais Características

✅ Cadastro de dados da empresa (CNPJ, nome)  
✅ Configuração de dados bancários  
✅ Validação de informações  
✅ Sincronização com operações CNAB  
✅ Uso automático em boletos e remessas  

---

## 📖 Guias Disponíveis

### 1. [Como Configurar Dados da Empresa](./como-configurar-empresa.md)
Preencher informações básicas da empresa.

### 2. [Como Configurar Dados Bancários](./como-configurar-banco.md)
Adicionar informações de banco, agência e conta.

### 3. [Dados Obrigatórios](./dados-obrigatorios.md)
Quais dados são necessários para cada operação.

---

## 🔗 Relação com Outros Módulos

- **CNAB**: Dados da empresa usados em remessas
- **Boletos**: Empresa aparece em boletos como cedente
- **Relatórios**: Dados da empresa nos cabeçalhos

---

## ⚠️ Dados Essenciais

Para CNAB funcionr, você DEVE ter:
- ✅ CNPJ válido
- ✅ Nome da empresa
- ✅ Código do banco (756 = Sicoob)
- ✅ Número da agência
- ✅ Número da conta corrente

---

## 💡 Dicas Rápidas

- Preencha dados uma única vez, sistema usa em todas as operações
- Dados do banco devem ser exatamente como está na instituição
- Qualquer alteração afeta remessas futuras

---

**[Voltar ao Índice](../INDEX.md)**
