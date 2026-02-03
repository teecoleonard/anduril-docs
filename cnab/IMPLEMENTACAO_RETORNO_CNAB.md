# Implementação de Processamento de Retorno CNAB 240 - Sicoob ✅ COM CORREÇÕES

## 📋 Resumo

Implementação de processamento de arquivos de retorno CNAB 240 conforme o layout oficial do Sicoob. O sistema processa arquivos de retorno enviados pelo banco e atualiza automaticamente o status dos boletos. Recentemente foram implementadas 5 correções críticas que melhoraram significativamente a confiabilidade e precisão do processamento.

## ✅ Componentes Implementados

### 1. Modelos de Dados

#### Segmento T (Retorno de Títulos)
- **Arquivo**: `backend/src/cnab/models/segmento-t.ts`
- **Descrição**: Modelo completo do Segmento T conforme layout oficial do Sicoob
- **Campos principais**:
  - Informações do boleto (nosso número, número do documento, vencimento, valor)
  - Dados do pagador (nome, CPF/CNPJ)
  - Código de movimento retorno (02, 03, 06, 09, etc.)
  - Motivo da ocorrência
  - Valor de tarifa/custas

#### Segmento U (Retorno de Títulos - Valores)
- **Arquivo**: `backend/src/cnab/models/segmento-u.ts`
- **Descrição**: Modelo completo do Segmento U conforme layout oficial do Sicoob
- **Campos principais**:
  - Valores financeiros (juros, multa, desconto, abatimento, IOF)
  - Valor pago e valor líquido
  - Outras despesas e outros créditos
  - Datas de ocorrência e crédito
  - Informações do banco correspondente

### 2. Processador de Retorno

#### SicoobProcessadorRetorno
- **Arquivo**: `backend/src/cnab/retorno/processadores/sicoob-processador.ts`
- **Funcionalidades**:
  - ✅ Detecção automática de arquivos do Sicoob
  - ✅ Processamento do Header do Arquivo de Retorno
  - ✅ Processamento do Header de Lote de Retorno
  - ✅ Processamento do Segmento T (retorno de títulos)
  - ✅ Processamento do Segmento U (valores do retorno)
  - ✅ Combinação de informações dos segmentos T e U
  - ✅ Classificação automática de status (liquidado, rejeitado, baixado, confirmado, em_ser)
  - ✅ **Diferenciação**: Status "liquidado" é usado apenas para retorno CNAB; liquidação manual usa "baixado"
  - ✅ Conversão de valores monetários (centavos para reais)
  - ✅ Formatação de datas (DDMMAAAA para YYYY-MM-DD)

#### Códigos de Movimento Retorno Suportados

| Código | Descrição | Status no Banco |
|--------|-----------|----------------|
| 02 | Entrada Confirmada | `confirmado` (atualiza observações) |
| 03 | Entrada Rejeitada | `rejeitado` |
| 06 | Liquidação | `liquidado` (apenas retorno CNAB) |
| 09 | Baixa | `cancelado` (baixado pelo banco) |
| 11 | Títulos em Carteira (Em Ser) | `em_ser` (atualiza observações) |
| 17 | Liquidação Após Baixa | `liquidado` (apenas retorno CNAB) |
| 25 | Protestado e Baixado | `cancelado` (baixado pelo banco) |
| Outros | - | `rejeitado` |

**Nota importante sobre status**:
- **`liquidado`**: Usado **apenas** para liquidação via retorno CNAB (automático)
- **`baixado`**: Usado para **liquidação manual** via interface (PATCH /boletos/:id)
- Isso permite diferenciar entre liquidação automática (retorno) e manual (usuário)

### 3. Atualizador de Boletos

#### BoletoAtualizador
- **Arquivo**: `backend/src/cnab/retorno/atualizadores/boleto-atualizador.ts`
- **Funcionalidades**:
  - ✅ Atualização automática de boletos baseada no retorno
  - ✅ Atualização de status (liquidado, rejeitado, baixado, confirmado, em_ser)
  - ✅ Registro de data de pagamento
  - ✅ Registro de valor pago e valor líquido
  - ✅ Geração de observações detalhadas com informações financeiras:
    - Valor pago
    - Valor líquido
    - Juros/Multa
    - Desconto
    - Abatimento
    - Outras despesas
    - Outros créditos
  - ✅ Tratamento de erros e logs

### 4. Atualizações no Banco de Dados

#### Tabela `boletos`
- ✅ Adicionado campo `valor_pago` (REAL) para armazenar o valor pago do boleto
- ✅ Adicionado suporte ao status `rejeitado` no CHECK constraint
- ✅ Migração automática para adicionar o campo `valor_pago` em tabelas existentes

## 🔄 Fluxo de Processamento

```mermaid
flowchart TD
    A[Upload do Arquivo de Retorno<br/>CNAB 240] --> B[Detecção Automática do Banco<br/>Sicoob = 756]
    B --> C[Processamento do Header<br/>- Data de geração<br/>- Número sequencial]
    C --> D[Processamento do Header de Lote<br/>- Número remessa/retorno<br/>- Datas]
    D --> E[Processamento Segmentos T/U<br/>Para cada boleto no arquivo]
    E --> F[Segmento T<br/>Informações básicas do boleto]
    E --> G[Segmento U<br/>Valores financeiros e datas]
    F --> H[Classificação por Status<br/>Baseado em código de movimento]
    G --> H
    H --> I{Código de Movimento}
    I -->|06 ou 17| J[Status: Liquidado]
    I -->|09| K[Status: Baixado]
    I -->|Outros| L[Status: Rejeitado]
    J --> M[Atualização no Banco<br/>- Status = liquidado<br/>(apenas retorno CNAB)<br/>- Data de pagamento<br/>- Valor pago<br/>- Observações]
    K --> N[Atualização no Banco<br/>- Status = cancelado<br/>(baixado pelo banco)]
    L --> O[Atualização no Banco<br/>- Status = rejeitado<br/>- Observações com motivo]
    M --> P[Registro do Retorno<br/>Tabela retornos_cnab]
    N --> P
    O --> P
    P --> Q[Estatísticas Geradas<br/>- Quantidade de boletos<br/>- Liquidados<br/>- Rejeitados]
    
    style A fill:#4a90e2,color:#fff
    style B fill:#5ba0f2,color:#fff
    style C fill:#d1e5ff
    style D fill:#d1e5ff
    style E fill:#ffe1f5
    style F fill:#f5ffe1
    style G fill:#f5ffe1
    style H fill:#fff4e1
    style J fill:#50c878,color:#fff
    style K fill:#f5a623,color:#fff
    style L fill:#e74c3c,color:#fff
    style P fill:#9b59b6,color:#fff
    style Q fill:#7b68ee,color:#fff
```

### Passos Detalhados:

1. **Upload do Arquivo de Retorno**
   - O arquivo CNAB 240 é enviado ao sistema
   - O sistema detecta automaticamente o banco (Sicoob = 756)

2. **Processamento do Arquivo**
   - Header do Arquivo: Extrai data de geração e número sequencial
   - Header de Lote: Extrai número de remessa/retorno e datas
   - Segmentos T/U: Processa cada boleto no arquivo
     - Segmento T: Informações básicas do boleto
     - Segmento U: Valores financeiros e datas

3. **Classificação e Atualização**
   - Cada boleto é classificado por status baseado no código de movimento retorno
   - Boletos são atualizados no banco de dados:
     - Status atualizado
     - Data de pagamento registrada (se liquidado)
     - Valor pago registrado (se liquidado)
     - Observações atualizadas com informações detalhadas

4. **Registro do Retorno**
   - Informações do retorno são registradas na tabela `retornos_cnab`
   - Estatísticas são geradas (quantidade de boletos, liquidados, rejeitados)

## 📊 Estrutura de Dados

### DetalheProcessamento
```typescript
interface DetalheProcessamento {
  nossoNumero: string;
  numeroDocumento: string;
  dataPagamento?: string;
  valorPago?: number;
  valorLiquido?: number;
  valorJurosMulta?: number;
  valorDesconto?: number;
  valorAbatimento?: number;
  valorIOF?: number;
  outrasDespesas?: number;
  outrosCreditos?: number;
  status: 'liquidado' | 'rejeitado' | 'baixado' | 'confirmado' | 'em_ser';
  motivoRejeicao?: string;
  codigoOcorrencia?: string;
  dataVencimento?: string;
  valorTitulo?: number;
  nomePagador?: string;
  tipoInscricaoPagador?: string;
  numeroInscricaoPagador?: string;
  dataOcorrencia?: string;
}
```

## 🎯 Conformidade com Layout Sicoob

### Header do Arquivo (Tipo 0)
- ✅ Posições 1-3: Código do banco (756)
- ✅ Posições 144-151: Data de geração (DDMMAAAA)
- ✅ Posições 158-163: Número sequencial do arquivo
- ✅ Posição 143: Código remessa/retorno (2 = retorno)

### Header de Lote (Tipo 1)
- ✅ Posições 184-191: Número remessa/retorno
- ✅ Posições 192-199: Data de gravação (DDMMAAAA)
- ✅ Posições 200-207: Data do crédito (DDMMAAAA)

### Segmento T (Tipo 3, Segmento T)
- ✅ Todas as 29 posições conforme layout oficial
- ✅ Processamento correto de valores monetários (13 bytes com 2 decimais)
- ✅ Processamento correto de datas (DDMMAAAA)

### Segmento U (Tipo 3, Segmento U)
- ✅ Todas as 24 posições conforme layout oficial
- ✅ Processamento correto de valores monetários (13 bytes com 2 decimais)
- ✅ Processamento correto de datas (DDMMAAAA)

## 📝 Observações Importantes

1. **Valores Monetários**: Todos os valores são armazenados em centavos no arquivo CNAB e convertidos para reais no processamento (divisão por 100).

2. **Datas**: Todas as datas no arquivo CNAB estão no formato DDMMAAAA e são convertidas para YYYY-MM-DD no processamento.

3. **Status de Boletos**: O sistema suporta os seguintes status:
   - `aberto`: Boleto gerado, aguardando pagamento
   - `liquidado`: Boleto pago/liquidado
   - `cancelado`: Boleto cancelado
   - `vencido`: Boleto vencido (não pago)
   - `rejeitado`: Boleto rejeitado pelo banco (novo)

4. **Observações Detalhadas**: Quando um boleto é liquidado, as observações são preenchidas automaticamente com informações detalhadas do pagamento, incluindo valores de juros, multa, desconto, etc.

5. **Migração Automática**: O sistema detecta automaticamente se o campo `valor_pago` existe na tabela `boletos` e o adiciona se necessário.

## 🚀 Próximos Passos Recomendados

1. ✅ Testar processamento com arquivo de retorno real do Sicoob
2. ✅ Validar todos os códigos de movimento retorno
3. ✅ Implementar tratamento para outros códigos de ocorrência específicos
4. ✅ Adicionar logs mais detalhados para debugging
5. ✅ Criar relatórios de retorno processados

## 📚 Referências

- Layout do Arquivo de Retorno - CNAB240 (Sicoob)
- FEBRABAN Layout Padrão 240 posições V10.3
- Documentação do projeto: `ANALISE_FEBRABAN.md`

---

**Data de Implementação**: 2025
**Status**: ✅ Implementação Completa

