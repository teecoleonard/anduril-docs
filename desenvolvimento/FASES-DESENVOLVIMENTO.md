# 📚 Fases de Desenvolvimento

> **✅ VALIDADO**: Este documento foi validado contra o código atual em Janeiro 2025. Consulte [VALIDACAO_FASES.md](VALIDACAO_FASES.md) para detalhes da validação.

> **Nota**: Para detalhes técnicos completos sobre a implementação do Sicoob, consulte:
> - `backend/ESPECIFICACOES_SICOOB_IMPLEMENTADAS.md` - Especificações técnicas detalhadas
> - `backend/FASE_7_SUMARIO.md` - Resumo da implementação do módulo CNAB

## Fase 1: Setup Inicial do Projeto

### 1.1 Base do Projeto
*Estrutura inicial, não representa o produto final*

Estrutura do monorepo:
- **Raiz**: package.json, tsconfig.json, .gitignore, README.md
- **electron/**: Código do Electron (main.ts, preload.ts, tsconfig.json)
- **backend/**: Projeto NestJS (package.json, nest-cli.json, src/ com main.ts e app.module.ts, database.sqlite gerado automaticamente)
- **frontend/**: Projeto React + Vite (package.json, vite.config.ts, index.html, src/ com main.tsx e App.tsx)

### 1.2 Configuração do Workspace (Monorepo)

**Passo 1**: Criar estrutura de pastas básica para electron, backend e frontend

**Passo 2**: Inicializar package.json raiz com configuração de workspaces, incluindo scripts para desenvolvimento e build de cada módulo

**Passo 3**: Instalar dependências base do projeto

---

## Fase 2: Configuração do Backend (NestJS)

### 2.1 Setup do NestJS

**Passo 1**: Criar projeto NestJS usando o CLI oficial

**Passo 2**: Instalar dependências principais do NestJS e TypeScript

**Passo 3**: Configurar SQLite instalando a biblioteca better-sqlite3 e seus tipos

**Passo 4**: Criar módulo de database
- Criar DatabaseModule como módulo global
- Criar DatabaseService que inicializa a conexão SQLite
- Configurar localização do banco (AppData em produção, pasta do projeto em desenvolvimento)
- Implementar método initTables() que cria todas as tabelas necessárias:
  - Tabela de clientes (id, nome, cpf, email, telefone, endereço, etc.)
  - Tabela de terrenos (id, codigo, descricao, area, valor_total, status, etc.)
  - Tabela de contratos (id, cliente_id, terreno_id, numero_contrato, valores, parcelas, etc.)
  - Tabela de boletos (id, contrato_id, numero_boleto, nosso_numero, valores, datas, status, etc.)
  - Tabela de remessas CNAB (id, numero_remessa, data, banco, arquivo_path, etc.)
  - Tabela de retornos CNAB (id, remessa_id, numero_retorno, data, banco, etc.)
  - Criar índices para otimização de consultas

### 2.2 Configuração de Módulos

**Passo 1**: Criar estrutura de módulos usando o NestJS CLI para gerar os módulos de clientes, contratos, terrenos, boletos, cnab e exportação

**Passo 2**: Configurar App Module importando todos os módulos criados e o DatabaseModule

### 2.3 Configuração do Servidor

**Passo 1**: Configurar main.ts para inicializar o servidor NestJS
- Habilitar CORS para comunicação com o frontend (localhost:5173)
- Configurar ValidationPipe global para validação automática de DTOs
- Definir porta padrão (3000) ou usar variável de ambiente
- Inicializar aplicação e logar URL do servidor

---

## Fase 3: Implementação do Módulo de Cadastro Contratual

### 3.1 Criar Entidade e DTOs

**Passo 1**: Criar DTOs
- CreateCadastroContratualDto: Validar nome completo (obrigatório), CPF/CNPJ com validação de dígitos verificadores (@IsCPFouCNPJ), email, telefone, endereço completo, dados do cônjuge, etc.
- UpdateCadastroContratualDto: Estender PartialType para permitir atualização parcial

**Passo 2**: Criar Service
- Implementar método create: Validar CPF/CNPJ duplicado usando validador integrado, inserir no banco, retornar cadastro criado
- Implementar método findAll: Buscar todos os cadastros ordenados
- Implementar método findOne: Buscar cadastro por ID, lançar exceção se não encontrado
- Implementar método update: Validar existência, atualizar campos fornecidos, atualizar timestamp
- Implementar método remove: Validar se não tem contratos vinculados, excluir do banco

**Passo 3**: Criar Controller
- Endpoint POST /cadastro-contratual: Criar novo cadastro
- Endpoint GET /cadastro-contratual: Listar todos os cadastros
- Endpoint GET /cadastro-contratual/:id: Buscar cadastro por ID
- Endpoint PATCH /cadastro-contratual/:id: Atualizar cadastro
- Endpoint DELETE /cadastro-contratual/:id: Excluir cadastro

**Passo 4**: Configurar Module
- Registrar CadastroContratualController e CadastroContratualService
- Exportar CadastroContratualService para uso em outros módulos

**Nota**: O módulo também inclui `CadastroSimplificadoService` para dados simplificados usados em boletos.

---

## Fase 4: Implementação do Módulo de Terrenos

### 4.1 Estrutura Similar ao Módulo de Clientes

Seguir o mesmo padrão:
- DTOs (CreateTerrenoDto, UpdateTerrenoDto)
- Service com validações
- Controller com endpoints REST
- Module configurado

**Funcionalidades específicas**:
- Status: disponivel, reservado, vendido
- Cálculo automático de parcelas baseado em valor_total, valor_entrada e numero_parcelas
- Validação de código único

---

## Fase 5: Implementação do Módulo de Contratos

### 5.1 Relacionamentos

**Passo 1**: Criar DTOs com validações de relacionamento
- CreateContratoDto: Validar cliente_id (inteiro, obrigatório), terreno_id (inteiro, obrigatório), valor_total (número, obrigatório), valor_entrada (número, opcional), numero_parcelas (inteiro, obrigatório), data_contrato (data válida, obrigatório)

**Passo 2**: Service com validações de integridade
- Validar se cliente existe no banco
- Validar se terreno existe e está disponível
- Gerar número de contrato único (sequencial ou baseado em timestamp)
- Atualizar status do terreno para 'vendido'
- **IMPORTANTE**: Boletos NÃO são gerados automaticamente. Devem ser gerados manualmente através da interface de boletos

**Passo 3**: Geração manual de boletos (via interface)
- Os boletos são gerados manualmente através do endpoint `POST /boletos/gerar-manualmente`
- Pode ser gerado por contrato específico, múltiplos contratos, mês/ano ou intervalo de datas
- Criar registros na tabela `boletos` baseado em `numero_parcelas` do contrato
- Calcular valor de cada parcela: usar `primeira_parcela` para a primeira parcela, depois `valor_parcela`
- Definir datas de vencimento (mensal a partir da `data_minuta` do contrato)

**Passo 4**: Liquidação manual de boletos (via interface)
- Interface para liquidar boletos manualmente através do endpoint `PATCH /boletos/:id`
- Permite atualizar status para `baixado` (liquidação manual) com data de pagamento e observações
- **Diferenciação**: Status `baixado` = liquidação manual; Status `liquidado` = apenas retorno CNAB automático
- Validações: apenas boletos com status `aberto` ou `vencido` podem ser baixados manualmente
- Boletos com status `cancelado` não podem ser baixados
- Se `data_pagamento` não for fornecida, usa a data atual automaticamente
- Atualiza `updated_at` automaticamente

---

## Fase 6: Implementação do Módulo de Boletos

### 6.1 Funcionalidades

**Endpoints principais**:
- `GET /boletos` - Listar todos (com filtros: status, vencimento, datas)
- `GET /boletos/:id` - Detalhes de um boleto
- `GET /boletos/contrato/:contrato_id` - Boletos de um contrato
- `PATCH /boletos/:id` - Atualizar boleto (status, data_pagamento, observações)
- `POST /boletos/gerar-manualmente` - Gerar boletos manualmente (por contrato, múltiplos contratos, mês/ano ou intervalo)
- `POST /boletos/:id/gerar-codigo-barras` - Gerar código de barras e linha digitável

**Lógica de negócio**:
- Geração de `nosso_numero` único
- Cálculo de `codigo_barras` e `linha_digitavel` (padrão bancário)
- Atualização de status: aberto → liquidado → cancelado

### 6.2 Estrutura de Provedores Bancários

**Decisão de Design**: Por enquanto, o projeto trabalhará apenas com o banco **Sicoob**, porém a arquitetura foi projetada para ser extensível e permitir a adição de outros bancos no futuro sem grandes refatorações.

**Estrutura implementada**:
- **`providers/banco-provider.interface.ts`**: Interface base que todos os provedores bancários devem implementar
  - Define métodos: `gerarNossoNumero()`, `calcularCodigoBarras()`, `calcularLinhaDigitavel()`, `validarNossoNumero()`
  - Propriedades: `codigoBanco`, `nomeBanco`

- **`providers/sicoob.provider.ts`**: Implementação específica do Sicoob conforme especificações oficiais
  - **Cálculo do Nosso Número**: 
    - Formato: Cooperativa(4) + Cliente(10) + Nosso Número(7) + DV(1) = 8 dígitos finais
    - DV calculado com constante **3197** e módulo 11
    - Se resto = 0 ou 1, DV = 0; caso contrário, DV = 11 - resto
  - **Fator de Vencimento**:
    - Data base antiga: 03/07/2000
    - Nova data base (a partir de 22/02/2025): 22/02/2025
    - Fórmula: `(data vencimento - data base) + 1000`
    - Implementação automática da mudança de data base
  - **Código de Barras (44 dígitos)**:
    - Estrutura padrão: Banco(3) + Moeda(1) + DV(1) + Fator(4) + Valor(10) + Campo Livre(25)
    - Campo Livre Sicoob: Carteira(1) + Cooperativa(4) + Modalidade(2) + Cliente(7) + Nosso Número(8) + Parcela(3)
    - DV do código de barras: módulo 11 com pesos 2-9 (se resultado 0, 1 ou > 9, usar 1)
  - **Linha Digitável**:
    - Formato: `AAABC.DDDDE FFGGG.GGGGHI HHHHH.HHJJJK L MMMMNNNNNNNNNNNN`
    - Campo 1: Banco + Moeda + Carteira + Cooperativa + DV (módulo 10)
    - Campo 2: Modalidade + Cliente + Início Nosso Número + DV (módulo 10)
    - Campo 3: Resto Nosso Número + Parcela + DV (módulo 10)
    - Campo 4: DV do código de barras
    - Campo 5: Fator de vencimento + Valor
    - DV da linha digitável: módulo 10 com multiplicadores alternando 1 e 2 (da direita para esquerda)
  - Configurável via variáveis de ambiente (ver seção abaixo)

- **`providers/banco-provider.factory.ts`**: Factory para gerenciar provedores bancários
  - Enum `BancoCodigo` com códigos dos bancos (atualmente apenas `SICOOB = '756'`)
  - Método `getProvider()` que retorna o provedor configurado via `BANCO_CODIGO` no `.env`
  - Método `listarBancosDisponiveis()` para listar bancos suportados
  - **Comentários adicionados** indicando onde adicionar novos bancos no futuro

**Configuração via variáveis de ambiente**:
```env
# Código do banco padrão (756 = Sicoob)
BANCO_CODIGO=756

# Configurações específicas do Sicoob (obrigatórias)
SICOOB_CARTEIRA=1                    # 1 dígito (1 ou 3)
SICOOB_COOPERATIVA=0001              # 4 dígitos
SICOOB_CODIGO_CLIENTE=0000000001     # 10 dígitos (para nosso número)
SICOOB_MODALIDADE=01                 # 2 dígitos

# Configurações específicas do Sicoob (opcionais)
SICOOB_CONTA_CORRENTE=000000000      # 9 dígitos (usado em alguns cálculos)
SICOOB_AGENCIA=00000                 # 5 dígitos
SICOOB_DIGITO_AGENCIA=               # 1 dígito
SICOOB_DIGITO_CONTA=                 # 1 dígito
```

**Notas para futuras expansões**:
- A estrutura está preparada para adicionar novos bancos criando novas classes que implementam `BancoProvider`
- No `BancoProviderFactory`, há comentários indicando onde registrar novos provedores
- Cada banco pode ter suas próprias variáveis de ambiente específicas
- A mesma estrutura de provedores será reutilizada na Fase 7 (CNAB) para geração de remessas
- **Documentação completa**: Ver `backend/ESPECIFICACOES_SICOOB_IMPLEMENTADAS.md` para detalhes técnicos completos

---

## Fase 7: Implementação do Módulo CNAB

### 7.1 Estrutura do Módulo CNAB

**Nota importante**: Por enquanto, apenas o **Sicoob** será implementado, mas a estrutura deve seguir o mesmo padrão de provedores da Fase 6, permitindo fácil extensão para outros bancos no futuro.

Estrutura do módulo CNAB:
- **Raiz**: cnab.module.ts, cnab.controller.ts, cnab.service.ts
- **remessa/**: 
  - remessa.service.ts
  - geradores/ (base-gerador.ts, sicoob-gerador.ts)
    - **Nota**: Outros geradores (banco-do-brasil.ts, bradesco.ts, etc.) podem ser adicionados no futuro seguindo o mesmo padrão
  - validators/ (remessa.validator.ts)
- **retorno/**: 
  - retorno.service.ts
  - processadores/ (base-processador.ts, sicoob-processador.ts, retorno-240.ts)
    - **Nota**: Outros processadores podem ser adicionados no futuro
  - atualizadores/ (boleto-atualizador.ts)
- **models/**: header-arquivo.ts, header-lote.ts, segmento-p.ts, trailer.ts

### 7.2 Geração de Remessa

**Passo 1**: Criar modelo de dados CNAB 240
- Definir interfaces para HeaderArquivo, HeaderLote, SegmentoP, SegmentoQ, TrailerLote, TrailerArquivo
- Seguir especificação oficial do padrão CNAB 240

**Passo 2**: Implementar gerador de remessa
- Utilizar a estrutura de provedores bancários da Fase 6
- Criar interface base `BaseGeradorRemessa` que define métodos comuns
- Implementar `SicoobGeradorRemessa` seguindo padrão CNAB 240 do Sicoob
- **Validações implementadas**:
  - Validar existência dos boletos
  - Validar status (deve estar 'aberto')
  - Validar que todos os boletos têm `nosso_numero`, `codigo_barras` e `linha_digitavel` gerados
  - Validar que todos os boletos pertencem ao mesmo banco
  - Validar CPF/CNPJ da empresa (conforme `EMPRESA_TIPO_INSCRICAO`)
- **Geração do arquivo CNAB 240**:
  - Gerar header do arquivo com informações do banco (Sicoob) e empresa
  - Gerar header do lote
  - Gerar segmentos P (dados do boleto) para cada boleto
  - Gerar segmentos Q (dados do sacado/cliente) para cada boleto
  - Gerar trailer do lote
  - Gerar trailer do arquivo
- Salvar arquivo .txt no sistema de arquivos (diretório temporário do sistema)
- Registrar remessa no banco de dados (`remessas_cnab` e `remessa_boletos`)
- Retornar caminho do arquivo gerado e informações da remessa
- **Comentários adicionados** no código indicando onde adicionar geradores de outros bancos

**Passo 4**: Criar endpoint POST /cnab/remessa/gerar que recebe lista de IDs de boletos
- **Rota**: `POST /cnab/remessa/gerar`
- **Body**: Aceita `boletoIds` ou `boleto_ids` (array de números), `banco_codigo` (opcional), `data_inicial`, `data_final`, `serie_titulos`, `nome_arquivo`, `extensao_arquivo`
- **Validação**: Usa `CreateRemessaSchema` (Zod) para validar payload
- Por padrão, usar o banco configurado em `BANCO_CODIGO` (Sicoob)
- Validar que todos os boletos pertencem ao mesmo banco
- Retornar erro se algum boleto não tiver `nosso_numero`, `codigo_barras` ou `linha_digitavel` gerados
- Retornar informações da remessa criada (ID, número, data, arquivo_path, quantidade de boletos) e conteúdo do arquivo

### 7.3 Processamento de Retorno

**Passo 1**: Implementar parser de arquivo de retorno
- Utilizar a estrutura de provedores bancários da Fase 6
- Criar interface base `BaseProcessadorRetorno` que define métodos comuns
- Implementar `SicoobProcessadorRetorno` seguindo padrão CNAB 240 do Sicoob
- **Processamento do arquivo**:
  - Ler arquivo linha por linha
  - Identificar banco pelo header do arquivo (código 756 = Sicoob)
  - Identificar tipo de registro (header, lote, segmento, trailer)
  - Processar segmentos T (confirmação/rejeição de pagamento)
  - Extrair informações de ocorrência (liquidado, rejeitado, baixado, etc.)
- **Atualização de boletos** (`BoletoAtualizador`):
  - Atualizar status dos boletos no banco (liquidado, rejeitado, cancelado, etc.)
  - Registrar data de pagamento quando confirmado
  - Atualizar `data_pagamento` e `observacoes` quando aplicável
- Salvar arquivo de retorno no banco de dados (`retornos_cnab`)
- Salvar log detalhado do processamento
- Retornar resumo com quantidade de boletos processados, atualizados e status
- **Comentários adicionados** no código indicando onde adicionar processadores de outros bancos

**Passo 2**: Criar endpoint POST /cnab/retorno/importar que recebe arquivo via caminho
- **Rota**: `POST /cnab/retorno/importar`
- **DTO**: `ImportarRetornoDto` com `arquivo_path` (caminho do arquivo no sistema)
- **Nota**: Por enquanto, aceita apenas caminho do arquivo. Upload direto via multipart/form-data pode ser implementado futuramente se necessário
- Detectar automaticamente o banco pelo header do arquivo (código 756 = Sicoob)
- Usar o processador apropriado baseado no banco detectado
- Retornar erro se o banco não for suportado (por enquanto, apenas Sicoob)
- Retornar informações do retorno processado (ID, número, data, quantidade de boletos processados, liquidados, rejeitados)

---

## Fase 8: Implementação do Módulo de Exportação Excel

### 8.1 Estrutura Inicial

Implementar ExportacaoService com os seguintes métodos:
- exportarClientes(): Buscar dados do SQLite, criar workbook Excel, adicionar worksheet, formatar células, retornar buffer
- exportarTerrenos(): Exportar dados de terrenos
- exportarContratos(): Exportar dados de contratos
- exportarBoletos(filtros): Aplicando filtros de status, data de vencimento, etc.
- exportarRelatorioCompleto(): Criar workbook com múltiplas abas (Clientes, Contratos, Terrenos, Boletos)

**Endpoints implementados**:
- `GET /exportacao/clientes` - Download Excel de clientes
- `GET /exportacao/terrenos` - Download Excel de terrenos
- `GET /exportacao/contratos` - Download Excel de contratos
- `GET /exportacao/boletos` - Download Excel de boletos (com filtros opcionais)
- `GET /exportacao/relatorio-completo` - Download Excel com todas as abas

**Instalação**: Biblioteca xlsx e seus tipos TypeScript já instalados

### 8.2 Exportação Automática (Atualização - Janeiro 2025)

**Nova funcionalidade**: Exportação automática de arquivos Excel

**Implementação**:
- **ConfigService** (`backend/src/config/config.service.ts`): Gerencia configuração da pasta de exportação
  - Armazena configuração em `config.json` (AppData/Roaming/erp-anduril/config.json em produção)
  - Validação de pasta existente e diretório válido
  
- **ExportacaoService** (atualizado): Adiciona métodos de exportação automática
  - `exportarTodosAutomaticamente()`: Exporta todos os arquivos automaticamente
  - `exportarClientesAutomatico()`, `exportarTerrenosAutomatico()`, etc.: Métodos específicos por tipo
  - `salvarArquivoExcel()`: Salva arquivo na pasta configurada
  - `precisaAtualizar()`: Verifica se arquivo precisa ser atualizado
  - `forcarAtualizacao()`: Força atualização imediata de todos os arquivos
  - Inicialização automática no `onModuleInit()` se pasta estiver configurada

- **ExportacaoInterceptor** (`backend/src/exportacao/exportacao.interceptor.ts`): Interceptor global
  - Monitora mudanças no banco (POST, PUT, PATCH, DELETE)
  - Atualiza arquivos Excel automaticamente após mudanças
  - Limita atualizações a 1 por segundo para evitar sobrecarga
  - Ignora rotas que não modificam dados relevantes

- **ConfigController** (`backend/src/config/config.controller.ts`): Endpoints de configuração
  - `GET /config/exportacao-pasta`: Obtém pasta configurada
  - `POST /config/exportacao-pasta`: Configura pasta de exportação

- **Novo endpoint**:
  - `POST /exportacao/forcar-atualizacao`: Força atualização imediata de todos os arquivos

**Frontend**:
- **Dashboard** (`frontend/src/pages/Dashboard/Dashboard.tsx`): Interface de configuração
  - Seleção de pasta via dialog do Electron
  - Exibição da pasta atual configurada
  - Lista de arquivos que serão salvos automaticamente
  - Força atualização imediata ao configurar pasta

- **Remoção de botões**: Botões "Exportar Excel" removidos de:
  - Boletos
  - Terrenos
  - Clientes
  - Contratos
  - Dashboard (relatório completo)

**Arquivos gerados automaticamente**:
- `clientes_YYYY-MM-DD.xlsx`
- `terrenos_YYYY-MM-DD.xlsx`
- `contratos_YYYY-MM-DD.xlsx`
- `boletos_YYYY-MM-DD.xlsx`
- `relatorio_completo_YYYY-MM-DD.xlsx`

**Comportamento**:
1. Usuário configura pasta no Dashboard
2. Arquivos são salvos automaticamente na pasta escolhida
3. Arquivos são atualizados automaticamente quando há mudanças no banco
4. Arquivos são atualizados na inicialização do backend se pasta estiver configurada
5. Atualização inteligente: apenas atualiza se arquivo não existe ou foi modificado externamente

---

## Fase 9: Configuração do Frontend (React)

### 9.1 Setup do React com Vite

**Passo 1**: Criar projeto Vite(analise) com template React + TypeScript

**Passo 2**: Instalar dependências principais
- React Query para gerenciamento de estado do servidor
- Axios para requisições HTTP
- React Hook Form para formulários
- Zod para validação de schemas
- React Router DOM para navegação
- date-fns para manipulação de datas

**Passo 3**: Configurar estrutura de pastas
- pages/: Páginas principais (Clientes, Terrenos, Contratos, Boletos, CNAB)
- components/: Componentes reutilizáveis (Layout, Forms, Tables)
- services/: Serviços de API (api.ts, clientes.service.ts, etc.)
- hooks/: Custom hooks (useClientes.ts, etc.)
- utils/: Funções utilitárias (validators.ts, formatters.ts)
- types/: Definições TypeScript

### 9.2 Configuração da API

**Passo 1**: Criar cliente HTTP usando Axios configurado para localhost:3000 com headers JSON

**Passo 2**: Configurar React Query no main.tsx envolvendo a aplicação com QueryClientProvider

### 9.3 Implementação de Páginas

**Exemplo: Página de Clientes**
- Usar useQuery para buscar lista de clientes
- Usar useMutation para operações de criação, atualização e exclusão
- Invalidar queries após mutações para atualizar cache
- Renderizar tabela com dados e ações (editar, excluir)

---

## Fase 10: Configuração do Electron

### 10.1 Setup do Electron

**Passo 1**: Instalar dependências do Electron, electron-builder e ferramentas de desenvolvimento (concurrently, wait-on, cross-env)

**Passo 2**: Criar main.ts
- Configurar BrowserWindow com dimensões padrão (1200x800)
- Configurar webPreferences com contextIsolation e sem nodeIntegration
- Em desenvolvimento: carregar do Vite (localhost:5173) e abrir DevTools
- Em produção: carregar arquivo estático do build do frontend
- Implementar função startBackend() para iniciar processo Node.js do backend
- Configurar single instance lock para evitar múltiplas instâncias
- Gerenciar ciclo de vida da aplicação (quando fechar janelas, encerrar backend)

**Passo 3**: Criar preload.ts para expor APIs seguras via contextBridge se necessário

**Passo 4**: Configurar package.json do Electron com scripts de desenvolvimento e build

---

## Fase 11: Sistema de Logging

### 11.1 Configuração do Winston

**Passo 1**: Instalar biblioteca Winston para logging estruturado

**Passo 2**: Criar Logger Service
- Implementar interface NestLoggerService
- Configurar diretório de logs (criar se não existir)
- Configurar logger com formato JSON, timestamp e stack traces
- Configurar transports: arquivo de erros (error.log) e arquivo combinado (combined.log)
- Em desenvolvimento, adicionar transporte para console
- Implementar métodos: log, error, warn, debug, verbose

---

## Fase 12: Validações e Tratamento de Erros

### 12.1 Validações no Backend

**Passo 1**: ✅ Criar validadores customizados (IMPLEMENTADO E INTEGRADO)
- **Validador de CPF/CNPJ** (`common/validators/cpf-cnpj.validator.ts`):
  - ✅ Funções: `validarCPF()`, `validarCNPJ()`, `validarCPFouCNPJ()`
  - ✅ Remover caracteres não numéricos
  - ✅ Verificar se tem 11 dígitos (CPF) ou 14 dígitos (CNPJ)
  - ✅ Verificar se não é sequência repetida
  - ✅ Validar dígitos verificadores usando algoritmo oficial
  - ✅ Funções de formatação: `formatarCPF()`, `formatarCNPJ()`
- **Decorators para class-validator** (`common/validators/cpf-cnpj.validator.decorator.ts`):
  - ✅ `@IsCPF()`: Validador customizado para CPF
  - ✅ `@IsCNPJ()`: Validador customizado para CNPJ
  - ✅ `@IsCPFouCNPJ()`: Validador que aceita CPF ou CNPJ
  - ✅ **INTEGRADO** no `CreateCadastroContratualDto` e `CreateCadastroSimplificadoDto`
  - ✅ Validado também no Service (`cadastro-contratual.service.ts` e `cadastro-simplificado.service.ts`)
  - ✅ Validação adicional no módulo CNAB para dados da empresa

### 12.2 Exception Filters

Criar AllExceptionsFilter para tratamento global de exceções:
- Capturar todas as exceções não tratadas
- Identificar se é HttpException ou erro genérico
- Retornar resposta JSON padronizada com statusCode, timestamp, path e message
- Registrar erros no sistema de logging

---

## Fase 13: Testes

### 13.1 Configuração de Testes

**Passo 1**: ✅ Instalar dependências de teste (@nestjs/testing, jest, ts-jest, tipos)

**Passo 2**: ✅ Configurar Jest no package.json
- Preset ts-jest
- Ambiente Node.js
- Raiz: pasta src
- Padrão de arquivos de teste: **/*.spec.ts
- Configurar cobertura de código (excluir specs e main.ts)

**Passo 3**: ⚠️ Testes unitários (PARCIALMENTE IMPLEMENTADO)
- ✅ Exemplo implementado: `cadastro-contratual.service.spec.ts` - testa criação, busca, atualização e exclusão
- ✅ Usa Test.createTestingModule para mockar dependências
- ⚠️ Outros módulos ainda não possuem testes unitários
- 📝 Próximos passos: Adicionar testes para outros serviços (boletos, contratos, cnab, etc.)

---

## Fase 14: Build e Distribuição

### 14.1 Configuração do Electron Builder

**Passo 1**: Configurar electron-builder no package.json do Electron
- Definir appId e productName
- Configurar diretório de saída
- Incluir arquivos do build (backend, frontend, electron)
- Configurar target Windows (NSIS installer)
- Configurar opções de instalação (permitir escolher diretório, não one-click)

**Passo 2**: Criar scripts de build no package.json raiz
- Script build que executa build de backend, frontend e electron sequencialmente
- Scripts individuais para cada módulo

---

## Fase 15: Backup Automático

### 15.1 Implementação de Backup

✅ **IMPLEMENTADO** - BackupService com as seguintes funcionalidades:

- ✅ Método `backupDiario()`: Executar via cron job diariamente às **18:00 (UTC-3)** / 21:00 (UTC)
  - Obter caminho do banco de dados
  - Criar diretório de backups se não existir (async)
  - Gerar nome de arquivo com timestamp formatado
  - Copiar arquivo do banco para diretório de backups (async, não bloqueante)
  - Limpar backups antigos (manter apenas os 7 mais recentes)

- ✅ Método `backupAntesOperacaoCritica()`: Executar backup manual antes de operações críticas como geração de CNAB
  - Chamado automaticamente pelo `CnabService` antes de gerar remessa ou processar retorno
  - Logging e auditoria incluídos

- ✅ Método `realizarBackupManual()`: Backup manual via endpoint `/backup/manual`
  - Endpoint público (sem autenticação) para aplicação local

- ✅ Método `limparBackupsAntigos()`: 
  - Listar arquivos de backup no diretório (async, paralelo)
  - Ordenar por data de modificação (mais recentes primeiro)
  - Manter apenas a quantidade especificada (padrão: 7)
  - Excluir backups antigos (async, paralelo)

- ✅ Método `listarBackups()`: Listar backups disponíveis (async, paralelo)

- ✅ Método `restaurarBackup()`: Restaurar um backup específico (async, não bloqueante)

**Endpoints implementados**:
- `POST /backup/manual` - Criar backup manual
- `GET /backup/listar` - Listar backups disponíveis
- `POST /backup/restaurar` - Restaurar um backup específico

**Características**:
- ✅ **Async IO**: Todas as operações são assíncronas (fs/promises)
- ✅ **Não bloqueante**: UI sempre responsiva durante backups
- ✅ **Paralelismo**: Operações de listagem e limpeza em paralelo
- ✅ **Backup automático**: Antes de operações críticas (CNAB, retorno)

---

