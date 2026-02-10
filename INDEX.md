# 📚 Documentação ERP Anduril - Índice Completo

> **👉 [Em primeiro lugar, leia ESTE arquivo](./LEIA-ME-PRIMEIRO.md)** - Guia rápido de navegação da documentação reorganizada

Bem-vindo à documentação completa do **ERP Anduril**! Esta documentação é organizada por módulos para facilitar seu entendimento e uso do sistema.

---

## 🎯 Módulos Principais

### 1️⃣ [Clientes](./clientes/README.md)
Cadastro e gerenciamento de clientes do sistema.

**Guias Disponíveis:**
- Como registrar um novo cliente
- Como editar dados de cliente
- Validações e regras

---

### 2️⃣ [Contratos](./contratos/README.md)
Gestão completa de contratos e sua relação com clientes.

**Guias Disponíveis:**
- Como gerar um novo contrato
- Status dos contratos
- Datas de vencimento e reajustes
- Relação contrato-cliente

**🔸 [Sub-módulo: Reajustes](./contratos/reajustes/)**
- Solução de sincronização de saldo devedor
- Arquitetura do sistema de reajustes
- Guia de testes completo
- Análise de reajustes a longo prazo (30+ anos)

---

### 3️⃣ [Terrenos](./terrenos/README.md)
Cadastro, gerenciamento e alertas de terrenos disponíveis.

**Guias Disponíveis:**
- Como registrar um novo terreno
- Status dos terrenos
- Sistema de alertas para terrenos reservados
- Validação de dados

**📁 [Guias Práticos](./terrenos/guias/)** - Passo-a-passo de operações comuns

---

### 4️⃣ [Boletos](./boletos/README.md)
Criação, gestão e liquidação de boletos bancários.

**Guias Disponíveis:**
- Como gerar boleto por contrato
- Como gerar múltiplos boletos
- Como gerar boleto por mês/ano
- Como gerar boleto por intervalo de datas
- Status dos boletos
- Liquidação manual

**📁 [Guias Práticos](./boletos/guias/)** - Instruções passo-a-passo

---

### 5️⃣ [CNAB](./cnab/README.md)
Integração bancária com padrão CNAB 240 para remessas e retornos.

**Guias Disponíveis:**
- Como gerar uma remessa CNAB
- Como importar um retorno CNAB
- Processamento automático de status
- Diagnóstico de problemas
- Vinculação remessa-retorno

**📁 Organização por Tipo:**
- **[Guias Práticos](./cnab/guias/)** - Como fazer (geração, importação)
- **[Análises Técnicas](./cnab/analises/)** - Documentação de implementação e diagnóstico

---

### 6️⃣ [Empresa](./empresa/README.md)
Dados e configuração da empresa para operações bancárias.

**Guias Disponíveis:**
- Como configurar dados da empresa
- Dados bancários necessários
- CNPJ e informações legais

**📁 [Configuração](./empresa/configuracao/)** - Guias de setup

---

### 7️⃣ [Exportação](./exportacao/README.md)
Geração de relatórios e exportação de dados em Excel.

**Guias Disponíveis:**
- Como gerar relatórios
- Configuração de pasta de exportação
- Arquivos gerados automaticamente

---

### 8️⃣ [Sistema](./sistema/README.md)
Funcionalidades gerais de sistema, backup e gerenciamento de banco de dados.

**Guias Disponíveis:**
- Sistema de backup automático
- Gerenciamento de banco de dados
- Restauração de backups
- Visualização de informações

**📁 [Backup e Restauração](./sistema/backup/)** - Guias de operação

---

## 📖 Como Usar Esta Documentação

1. **Navegue pelo módulo** que deseja aprender
2. **Leia o README** de cada módulo para visão geral
3. **Siga os guias passo-a-passo** com imagens
4. **Consulte a seção de status** para entender estados dos componentes
5. **Se tiver dúvidas**, cada guia tem espaços indicados para fotos/exemplos

---

## 🔧 Desenvolvimento

Se você é desenvolvedor e quer entender como o sistema foi construído ou corrigir bugs:

👉 **[Acesse a documentação de desenvolvimento](./desenvolvimento/)**

Lá você encontrará:
- Análise de soluções implementadas
- Processo de build e produção
- Correções técnicas e refactoring
- Guias de debug e logs

---

## 🚀 Mudanças Recentes

📌 **[Mudanças Recentes - Fevereiro 2026](./MUDANCAS_RECENTES.md)**

Confira as últimas implementações:
- Campo "Custo" em Terrenos e Contratos
- Ajuste manual de data de vencimento
- Otimizações de IPC para links externos
- Correções de tipos booleanos em Cliente
- Melhorias de interface e estilo

---

## 📊 Documentação Técnica (Referência)

### 📋 Análises de Implementação
**[Análises Implementação](./analises-implementacao/)**
- Documentação histórica de features
- Arquitetura de features específicas
- Guias de teste e validação

### 🏗️ Análises de Backend
**[Backend Análise](./backend-analise/)**
- Especificações CNAB técnicas
- Análises de banco de dados
- Documentação de schemas

### 📚 Histórico
**[Histórico de Desenvolvimento](./historico/)**
- Fases concluídas
- Decisões arquiteturais
- Logs de desenvolvimento

---

## ✨ Recursos Rápidos

- **[README Principal](../README.md)** - Visão geral do projeto
- **[README Backend](../backend/README_ANALISE_RETORNO_CNAB.md)** - Análise técnica CNAB
- **Contato/Suporte** - (Adicionar conforme necessário)

---

**Última atualização**: Fevereiro 7, 2026
