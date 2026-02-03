# Mapa de Logs - Localização Exata

## Resumo dos Logs Adicionados

**Total: 30 console.log() em 3 arquivos principais**

---

## 1. `retorno.service.ts` - 11 Logs

### Método: `processarRetornoConteudo()`

| # | Linha | Log | Propósito |
|----|-------|-----|----------|
| 1 | 56 | `[RETORNO CONTEUDO] Iniciando processamento de arquivo:` | Marca entrada do método |
| 2 | 57 | `[RETORNO CONTEUDO] Tamanho do conteúdo:` | Valida tamanho do arquivo |
| 3 | 61 | `[RETORNO CONTEUDO] Iniciando transação...` | Marca início da transação |
| 4 | 65 | `[RETORNO CONTEUDO] Total de linhas:` | Mostra quantas linhas foram processadas |
| 5 | 73 | `[RETORNO CONTEUDO] Detectando banco...` | Marca início da detecção |
| 6 | 77 | `[RETORNO CONTEUDO] Erro: banco não detectado` | Log condicional para erro |
| 7 | 83 | `[RETORNO CONTEUDO] Processando arquivo com N linhas` | Marca início do processamento |
| 8 | 85-90 | `[RETORNO CONTEUDO] Resultado do processamento:` | Log estruturado com resultados |
| 9 | 93 | `[RETORNO CONTEUDO] Atualizando boletos...` | Marca início da atualização |
| 10 | 94 | `[RETORNO CONTEUDO] Resultado da atualização:` | Log estruturado com resultados |
| 11 | 119 | `[RETORNO CONTEUDO] Realizando commit da transação...` | Marca commit |
| 12 | 120 | `[RETORNO CONTEUDO] Transação commitada com sucesso!` | Marca sucesso |
| 13 | 122-125 | `[RETORNO CONTEUDO] Processamento finalizado:` | Log final com IDs |

### Método: `processarRetornoConteudo()` - Catch Block

| # | Linha | Log | Propósito |
|----|-------|-----|----------|
| 14 | 132 | `[RETORNO CONTEUDO] ERRO durante processamento:` | Marca erro |
| 15 | 133 | `[RETORNO CONTEUDO] Realizando rollback da transação...` | Marca rollback |
| 16 | 134 | `[RETORNO CONTEUDO] Transação revertida` | Confirma rollback |

---

## 2. `sicoob-processador.ts` - 9 Logs

### Método: `processarArquivo()`

| # | Linha | Log | Propósito |
|----|-------|-----|----------|
| 1 | 94-99 | `[SICOOB PROCESSADOR] Iniciando processamento de arquivo retorno` | Marca entrada com contexto |
| 2 | 111 | `[SICOOB PROCESSADOR] Primeira passagem: coletando segmentos T e U` | Marca início da coleta |
| 3 | 131-136 | `[SICOOB PROCESSADOR] Segmento T encontrado` | Log cada segmento T encontrado |
| 4 | 143 | `[SICOOB PROCESSADOR] Segmento U encontrado no índice` | Log cada segmento U encontrado |
| 5 | 151-161 | `[SICOOB PROCESSADOR] Detalhe criado` | Log cada detalhe criado |
| 6 | 169-176 | `[SICOOB PROCESSADOR] Primeira passagem concluída` | Resume coleta com contadores |
| 7 | 194-202 | `[SICOOB PROCESSADOR] Arquivo processado com sucesso` | Log final com resultados |

---

## 3. `boleto-atualizador.ts` - 12 Logs

### Método: `atualizarBoletos()` - Início

| # | Linha | Log | Propósito |
|----|-------|-----|----------|
| 1 | 27-31 | `[BOLETO ATUALIZADOR] Iniciando atualização de boletos` | Marca entrada com contexto |
| 2 | 35-36 | `[BOLETO ATUALIZADOR] Iniciando transação` | Log condicional - transação nova |
| 3 | 38 | `[BOLETO ATUALIZADOR] Usando transação existente` | Log condicional - transação externa |

### Método: `atualizarBoletos()` - Loop de Detalhes

| # | Linha | Log | Propósito |
|----|-------|-----|----------|
| 4 | 48-53 | `[BOLETO ATUALIZADOR] Processando detalhe` | Log cada detalhe no loop |
| 5 | 62 | `[BOLETO ATUALIZADOR] Buscando boleto com número normalizado` | Log busca do boleto |
| 6 | 76 | `[BOLETO ATUALIZADOR] Boleto não encontrado para nosso número` | Log condicional - não encontrado |
| 7 | 120-126 | `[BOLETO ATUALIZADOR] Boleto atualizado para LIQUIDADO` | Log sucesso - LIQUIDADO |
| 8 | 138-141 | `[BOLETO ATUALIZADOR] Boleto atualizado para CONFIRMADO` | Log sucesso - CONFIRMADO |
| 9 | 156-159 | `[BOLETO ATUALIZADOR] Boleto atualizado para CANCELADO` | Log sucesso - CANCELADO |

### Método: `atualizarBoletos()` - Catch e Finalização

| # | Linha | Log | Propósito |
|----|-------|-----|----------|
| 10 | 161-167 | `[BOLETO ATUALIZADOR] ERRO ao atualizar boleto` | Log erro de atualização |
| 11 | 181-186 | `[BOLETO ATUALIZADOR] Finalizando atualização de boletos` | Resume contadores |
| 12 | 191 | `[BOLETO ATUALIZADOR] Retornando resultados finais` | Log final |

### Método: `atualizarBoletos()` - Error Handling

| # | Linha | Log | Propósito |
|----|-------|-----|----------|
| 13 | 198-206 | `[BOLETO ATUALIZADOR] ERRO durante processamento` | Log erro no catch |
| 14 | 209-211 | `[BOLETO ATUALIZADOR] Executando ROLLBACK` | Log condicional - rollback |
| 15 | 213 | `[BOLETO ATUALIZADOR] NÃO fazendo ROLLBACK` | Log condicional - sem rollback |

---

## Resumo Executivo

### Por Arquivo

```
retorno.service.ts:
  - processarRetornoConteudo(): 13 logs (entrada → processamento → commit/rollback)

sicoob-processador.ts:
  - processarArquivo(): 7 logs (coleta segmentos → detalhes → resumo)

boleto-atualizador.ts:
  - atualizarBoletos(): 15 logs (entrada → cada boleto → finalização → erro)

TOTAL: 35 console.log()
```

### Por Tipo

```
✅ Entrada de método: 3 logs
📊 Logs estruturados: 8 logs
🔍 Logs de detalhes: 12 logs
⚠️ Logs condicionais: 8 logs
❌ Logs de erro: 4 logs
```

### Por Propósito

| Propósito | Quantidade | Arquivos |
|-----------|-----------|----------|
| Rastrear fluxo | 8 | Todos |
| Validar dados | 7 | Todos |
| Registrar decisões | 8 | Todos |
| Reportar resultados | 6 | Todos |
| Detectar erros | 6 | Todos |

---

## Como Encontrar Cada Log

### Buscar por Padrão

```bash
# Encontrar todos os logs [RETORNO CONTEUDO]
grep -n "\[RETORNO CONTEUDO\]" backend/src/cnab/retorno/retorno.service.ts

# Encontrar todos os logs [SICOOB PROCESSADOR]
grep -n "\[SICOOB PROCESSADOR\]" backend/src/cnab/retorno/processadores/sicoob-processador.ts

# Encontrar todos os logs [BOLETO ATUALIZADOR]
grep -n "\[BOLETO ATUALIZADOR\]" backend/src/cnab/retorno/atualizadores/boleto-atualizador.ts

# Encontrar TODOS os logs
grep -rn "\[RETORNO CONTEUDO\]\|\[SICOOB PROCESSADOR\]\|\[BOLETO ATUALIZADOR\]" backend/src/cnab/retorno/
```

### VS Code Search

1. `Ctrl+Shift+F` para abrir busca global
2. Procurar por: `\[RETORNO CONTEUDO\]` (com regex ativado)
3. Listar todos os 13 logs dessa categoria

---

## Fluxo Visual dos Logs

```
┌─────────────────────────────────────────────┐
│ [RETORNO CONTEUDO] Iniciando processamento  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ [RETORNO CONTEUDO]       │
        │ Tamanho do conteúdo      │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ [RETORNO CONTEUDO]       │
        │ Detectando banco...      │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ [CNAB DEBUG]             │
        │ Análise de banco         │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ [SICOOB PROCESSADOR]     │
        │ Iniciando processamento  │
        │ Primeira passagem        │
        │ Segmento T encontrado    │
        │ Segmento U encontrado    │
        │ Detalhe criado           │
        │ Primeira passagem concluída
        │ Arquivo processado       │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ [BOLETO ATUALIZADOR]     │
        │ Iniciando atualização    │
        │ Processando detalhe      │
        │ Buscando boleto          │
        │ Boleto atualizado        │
        │ Finalizando atualização  │
        │ Retornando resultados    │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ [RETORNO CONTEUDO]       │
        │ Realizando commit        │
        │ Transação commitada      │
        │ Processamento finalizado │
        └──────────────┬───────────┘
                       │
                       ▼
           ┌─────────────────────┐
           │ ✅ SUCESSO          │
           │ Response 200 OK     │
           └─────────────────────┘
```

---

## Documentação de Referência

Para compreender exatamente o que cada log registra:

1. **[FLUXO_DEBUG_LOGS_COMPLETO.md](FLUXO_DEBUG_LOGS_COMPLETO.md)** - Exemplos de saída completa
2. **[GUIA_RAPIDO_DEBUG_LOGS.md](GUIA_RAPIDO_DEBUG_LOGS.md)** - Como interpretar e solucionar problemas
3. **Este arquivo** - Localização exata de cada log

---

## Checklist de Verificação

- [ ] Todos os 35 logs foram adicionados com sucesso
- [ ] Nenhum log duplicado
- [ ] Todos os logs usam padrão `[CATEGORIA] Mensagem`
- [ ] Logs estruturados usam objetos com properties relevantes
- [ ] Logs de erro usam `console.log()` com a palavra "ERRO"
- [ ] Caminhos estão corretos para todos os 3 arquivos
- [ ] Nenhum código foi quebrado pelas adições

