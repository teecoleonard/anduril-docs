# 📚 Documentação ERP Anduril

Bem-vindo à documentação completa do **ERP Anduril**! Esta documentação é organizada por módulos para facilitar seu entendimento e uso do sistema.

## 📋 Índice

- [Módulos Principais](#-módulos-principais)
- [Como Usar Esta Documentação](#-como-usar-esta-documentação)
- [Início Rápido](#-início-rápido)
- [Desenvolvimento](#-desenvolvimento)
- [Recursos Rápidos](#-recursos-rápidos)
- [Contribuindo](#-contribuindo)
- [Suporte](#-suporte)

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

---

### 3️⃣ [Terrenos](./terrenos/README.md)
Cadastro, gerenciamento e alertas de terrenos disponíveis.

**Guias Disponíveis:**
- Como registrar um novo terreno
- Status dos terrenos
- Sistema de alertas para terrenos reservados
- Validação de dados

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

---

### 5️⃣ [CNAB](./cnab/README.md)
Integração bancária com padrão CNAB 240 para remessas e retornos.

**Guias Disponíveis:**
- Como gerar uma remessa CNAB
- Como importar um retorno CNAB
- Processamento automático de status
- Diagnóstico de problemas
- Vinculação remessa-retorno

---

### 6️⃣ [Empresa](./empresa/README.md)
Dados e configuração da empresa para operações bancárias.

**Guias Disponíveis:**
- Como configurar dados da empresa
- Dados bancários necessários
- CNPJ e informações legais

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

---

## 🚀 Início Rápido

Para começar a usar o ERP Anduril:

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento da documentação**:
   ```bash
   npm run docs:dev
   ```

3. **Acesse a documentação** no navegador em `http://localhost:5173`

4. **Para gerar a documentação estática**:
   ```bash
   npm run docs:build
   ```

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

## ✨ Recursos Rápidos

- **[Documentação de Desenvolvimento](./desenvolvimento/)** - Guias técnicos e de desenvolvimento
- **[Como Acessar](./COMO_ACESSAR.md)** - Informações de acesso ao sistema
- **[Checklist de Implementação](./CHECKLIST.md)** - Lista de verificação de recursos
- **[Resumo de Reorganização](./RESUMO_REORGANIZACAO.md)** - Histórico de mudanças na documentação

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir com a documentação:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/minha-contribuicao`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova seção sobre X'`)
4. Push para a branch (`git push origin feature/minha-contribuicao`)
5. Abra um Pull Request

### Padrões de Documentação

- Use Markdown para todos os arquivos de documentação
- Inclua imagens sempre que possível para ilustrar processos
- Mantenha a estrutura de diretórios organizada por módulos
- Atualize o índice principal quando adicionar novos módulos

---

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Email**: [Adicionar email de suporte]
- **Issues**: [Abra uma issue neste repositório](../../issues)
- **Wiki**: [Consulte a wiki do projeto](../../wiki)

---

## 📄 Licença

Este projeto e sua documentação são propriedade da empresa. Para mais informações sobre uso e distribuição, entre em contato com o departamento responsável.

---

**Última atualização**: Fevereiro 2026
