# Fluxo Completo de Debug Logs - CNAB Retorno

## Visão Geral
Adicionamos logs estratégicos em **5 componentes principais** do pipeline de processamento de CNAB retorno. Cada log marca um estágio crítico da operação.

---

## 1. Frontend - CNAB.tsx
**Quando**: Ao clicar no botão "Processar Retorno"

```
Browser Console:
[CNAB] File selected: retorno_sicoob_27.txt (425 bytes)
[CNAB] Sending to backend: POST /cnab/importar-retorno
[CNAB] Response received: { retornoId: 1, numeroRetorno: "RET001", ... }
```

---

## 2. Backend - RetornoService.processarRetornoConteudo()
**Quando**: Backend recebe o arquivo e inicia processamento

```javascript
[RETORNO CONTEUDO] Iniciando processamento de arquivo: retorno_sicoob_27.txt
[RETORNO CONTEUDO] Tamanho do conteúdo: 425 caracteres
[RETORNO CONTEUDO] Iniciando transação...
[RETORNO CONTEUDO] Total de linhas: 5
[RETORNO CONTEUDO] Detectando banco...
```

---

## 3. Backend - SicoobProcessadorRetorno.detectarBanco()
**Quando**: Validando se é arquivo do Sicoob

```javascript
[CNAB DEBUG] Primeira linha recebida: 75600000263593822000143001202...
[CNAB DEBUG] Tamanho da linha: 240
[CNAB DEBUG] Análise: {
  codigoBanco: '756',
  tipoRegistro: '0',
  codigoRemessaRetorno: '2',
  verificacao: { 
    isBanco756: true,
    isTipo0: true, 
    isRemessa: true  // "isRemessa" significa "é um tipo de remessa/retorno"
  }
}
```

---

## 4. Backend - SicoobProcessadorRetorno.processarArquivo()
**Quando**: Processando estrutura do arquivo

```javascript
[SICOOB PROCESSADOR] Iniciando processamento de arquivo retorno
  totalLinhas: 5
  linhaHeader: 75600000263593822000143001202...

[SICOOB PROCESSADOR] Primeira passagem: coletando segmentos T e U

[SICOOB PROCESSADOR] Segmento T encontrado
  indice: 2
  nossoNumero: '12345678'

[SICOOB PROCESSADOR] Segmento U encontrado no índice 3

[SICOOB PROCESSADOR] Detalhe criado
  nossoNumero: '12345678'
  status: 'liquidado'
  liquidado: true

[SICOOB PROCESSADOR] Primeira passagem concluída
  totalSegmentosT: 1
  totalSegmentosU: 1
  totalDetalhes: 1

[SICOOB PROCESSADOR] Arquivo processado com sucesso
  numeroRetorno: 'RET001'
  quantidadeBoletos: 1
  boletosLiquidados: 1
  boletosRejeitados: 0
```

---

## 5. Backend - RetornoService (continuação após processamento)
**Quando**: Após processar arquivo, atualizando boletos

```javascript
[RETORNO CONTEUDO] Resultado do processamento: {
  numeroRetorno: 'RET001',
  boletosLiquidados: 1,
  boletosRejeitados: 0,
  totalDetalhes: 1
}

[RETORNO CONTEUDO] Atualizando boletos...
```

---

## 6. Backend - BoletoAtualizador.atualizarBoletos()
**Quando**: Atualizando cada boleto no banco de dados

```javascript
[BOLETO ATUALIZADOR] Iniciando atualização de boletos
  totalDetalhes: 1
  gerenciarTransacao: false

[BOLETO ATUALIZADOR] Usando transação existente (gerenciarTransacao=false)

[BOLETO ATUALIZADOR] Processando detalhe
  nossoNumero: '12345678'
  status: 'liquidado'
  liquidado: true

[BOLETO ATUALIZADOR] Buscando boleto com número normalizado: 12345678

[BOLETO ATUALIZADOR] Boleto atualizado para LIQUIDADO
  boletoId: 1
  nossoNumero: '12345678'
  dataPagamento: '2024-01-15'
  valorPago: 1500.00

[BOLETO ATUALIZADOR] Finalizando atualização de boletos
  atualizados: 1
  naoEncontrados: 0
  erros: 0
  gerenciarTransacao: false

[BOLETO ATUALIZADOR] Retornando resultados finais
  atualizados: 1
  naoEncontrados: 0
  erros: 0
```

---

## 7. Backend - RetornoService (finalização)
**Quando**: Completando o processamento e registrando no banco

```javascript
[RETORNO CONTEUDO] Resultado da atualização: {
  atualizados: 1,
  naoEncontrados: 0,
  erros: 0
}

[RETORNO CONTEUDO] Realizando commit da transação...
[RETORNO CONTEUDO] Transação commitada com sucesso!

[RETORNO CONTEUDO] Processamento finalizado: {
  retornoId: 1,
  numeroRetorno: 'RET001'
}
```

---

## 8. Frontend - Resposta Final
**Quando**: Frontend recebe resposta de sucesso

```javascript
[CNAB] Retorno processado com sucesso!
  Retorno ID: 1
  Número: RET001
  Boletos atualizados: 1
  Boletos liquidados: 1
  Boletos rejeitados: 0
```

---

## Cenários de Erro

### Erro 1: Arquivo Vazio
```javascript
[RETORNO CONTEUDO] Total de linhas: 0
[RETORNO CONTEUDO] Erro: arquivo vazio
[RETORNO CONTEUDO] ERRO durante processamento: BadRequestException: Arquivo de retorno vazio
[RETORNO CONTEUDO] Realizando rollback da transação...
[RETORNO CONTEUDO] Transação revertida
```

### Erro 2: Banco Não Detectado
```javascript
[RETORNO CONTEUDO] Detectando banco...
[CNAB DEBUG] Primeira linha recebida: 99900000... (Banco diferente)
[CNAB DEBUG] Análise: { 
  codigoBanco: '999',
  isBanco756: false,  // ← Erro aqui
  ...
}
[RETORNO CONTEUDO] Erro: banco não detectado
[RETORNO CONTEUDO] ERRO durante processamento: BadRequestException: Não foi possível detectar o banco...
```

### Erro 3: Boleto Não Encontrado
```javascript
[BOLETO ATUALIZADOR] Processando detalhe
  nossoNumero: '99999999'

[BOLETO ATUALIZADOR] Buscando boleto com número normalizado: 99999999
[BOLETO ATUALIZADOR] Boleto não encontrado para nosso número: 99999999

[BOLETO ATUALIZADOR] Finalizando atualização de boletos
  atualizados: 0
  naoEncontrados: 1  // ← Boleto não encontrado!
  erros: 0
```

### Erro 4: Erro na Transação
```javascript
[RETORNO CONTEUDO] ERRO durante processamento: Error: Cannot update boleto: database locked
[RETORNO CONTEUDO] Realizando rollback da transação...
[RETORNO CONTEUDO] Transação revertida
```

---

## Como Interpretar os Logs

### Transação com Sucesso
```
✅ Toda a sequência acima
✅ "Transação commitada com sucesso!"
✅ Resposta final com números válidos
```

### Falha Detectada
```
❌ Logs param no erro
❌ "ERRO durante processamento"
❌ "Transação revertida"
❌ Boleto NÃO foi atualizado no banco
```

### Problema de Correspondência
```
⚠️ "Boleto não encontrado"
⚠️ "naoEncontrados: 1"
⚠️ Boleto não atualizado mesmo com sucesso na transação
```

---

## Monitoramento em Tempo Real

### Verificar Logs no Servidor
```bash
# Terminal do backend (NestJS)
npm run start:dev

# Saída esperada:
[Nest] 12345 - 01/15/2024, 10:30:45 AM [NestFactory] Nest application successfully started
...
[RETORNO CONTEUDO] Iniciando processamento de arquivo: retorno_sicoob_27.txt
[RETORNO CONTEUDO] Tamanho do conteúdo: 425 caracteres
...
```

### Verificar Resposta da API
```bash
# Verificar em http://localhost:3001/cnab/retornos
[
  {
    "id": 1,
    "numeroRetorno": "RET001",
    "dataProcessamento": "2024-01-15",
    "quantidadeRegistros": 5,
    "boletosLiquidados": 1,
    "boletosRejeitados": 0,
    "createdAt": "2024-01-15T10:30:45.000Z"
  }
]
```

---

## Próximos Passos

### 1. Teste com Arquivo Real
Usar um arquivo RETORNO (código 2) válido do Sicoob para testar o fluxo completo

### 2. Validar Números
Garantir que os "nossoNumero" no arquivo correspondem aos boletos no banco

### 3. Monitorar Banco de Dados
```sql
-- Ver boletos atualizados
SELECT id, nosso_numero, status, data_pagamento 
FROM boletos 
WHERE status = 'liquidado' 
ORDER BY updated_at DESC 
LIMIT 1;

-- Ver retornos processados
SELECT id, numero_retorno, boletos_liquidados, boletos_rejeitados 
FROM retornos 
ORDER BY created_at DESC 
LIMIT 1;
```

### 4. Remover Logs Após Teste
Converter logs para um logger configurável ou remover completamente após validação

---

## Resumo dos Logs Adicionados

| Arquivo | Método | Logs Adicionados | Propósito |
|---------|--------|-----------------|----------|
| **retorno.service.ts** | `processarRetornoConteudo()` | 11 | Rastrear entrada, transação, detecção, processamento |
| **sicoob-processador.ts** | `processarArquivo()` | 7 | Rastrear coleta de segmentos e criação de detalhes |
| **boleto-atualizador.ts** | `atualizarBoletos()` | 12 | Rastrear atualização de cada boleto e transação |
| **TOTAL** | - | **30 logs** | Cobertura completa do pipeline |

