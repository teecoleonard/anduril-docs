# Guia Rápido de Debug - Onde Verificar os Logs

## Visão Geral Rápida

| Quando | Onde Verificar | O Que Procurar |
|--------|----------------|-----------------|
| **Seleção de arquivo** | Browser → Dev Tools → Console | `[CNAB] File selected:` |
| **Envio para backend** | Terminal do servidor NestJS | `[RETORNO CONTEUDO] Iniciando processamento` |
| **Detecção de banco** | Terminal do servidor NestJS | `[CNAB DEBUG] Primeira linha recebida:` |
| **Processamento do arquivo** | Terminal do servidor NestJS | `[SICOOB PROCESSADOR] Segmento T encontrado:` |
| **Atualização de boletos** | Terminal do servidor NestJS | `[BOLETO ATUALIZADOR] Boleto atualizado para LIQUIDADO:` |
| **Erro na transação** | Terminal do servidor NestJS | `[RETORNO CONTEUDO] ERRO durante processamento:` |

---

## Checklist de Sucesso

Quando tudo dá certo, você vê esta sequência:

```
✅ [RETORNO CONTEUDO] Iniciando processamento de arquivo: retorno_sicoob_27.txt
✅ [RETORNO CONTEUDO] Detectando banco...
✅ [CNAB DEBUG] Análise: { codigoBanco: '756', ... }
✅ [SICOOB PROCESSADOR] Primeiro passagem: coletando segmentos T e U
✅ [SICOOB PROCESSADOR] Detalhe criado { nossoNumero: '12345678', status: 'liquidado' }
✅ [BOLETO ATUALIZADOR] Iniciando atualização de boletos { totalDetalhes: 1 }
✅ [BOLETO ATUALIZADOR] Boleto atualizado para LIQUIDADO { boletoId: 1 }
✅ [RETORNO CONTEUDO] Transação commitada com sucesso!
✅ Resposta com status 200 e retornoId
```

---

## Problemas Comuns e Como Identificar

### Problema 1: "Arquivo vazio"
```javascript
❌ [RETORNO CONTEUDO] Total de linhas: 0
❌ [RETORNO CONTEUDO] Erro: arquivo vazio
❌ HTTP 400: BadRequest

👉 Ação: Verificar se o arquivo tem conteúdo válido
```

### Problema 2: "Banco não detectado"
```javascript
❌ [CNAB DEBUG] codigoBanco: '999'  (não é 756)
❌ [CNAB DEBUG] isBanco756: false
❌ HTTP 400: Não foi possível detectar o banco

👉 Ação: Usar um arquivo RETORNO real do Sicoob (código 756)
```

### Problema 3: "Tipo de arquivo errado"
```javascript
❌ [CNAB DEBUG] codigoRemessaRetorno: '3'  (é REMESSA, não RETORNO)
❌ [CNAB DEBUG] Erro: arquivo é REMESSA, esperado RETORNO

👉 Ação: Usar arquivo RETORNO (código 2), não REMESSA (código 3)
```

### Problema 4: "Boleto não encontrado"
```javascript
❌ [BOLETO ATUALIZADOR] Boleto não encontrado para nosso número: 99999999
❌ [BOLETO ATUALIZADOR] naoEncontrados: 1

👉 Ação: Verificar se o boleto com esse número existe no banco
        SELECT * FROM boletos WHERE nosso_numero LIKE '%99999999%'
```

### Problema 5: "Erro na atualização de boleto"
```javascript
❌ [BOLETO ATUALIZADOR] ERRO ao atualizar boleto { nossoNumero: '12345678' }
❌ [BOLETO ATUALIZADOR] erro: 'database locked'

👉 Ação: Aguardar outras operações terminarem ou reiniciar servidor
```

### Problema 6: "Transação revertida"
```javascript
❌ [RETORNO CONTEUDO] ERRO durante processamento: Error: ...
❌ [RETORNO CONTEUDO] Realizando rollback da transação...
❌ [RETORNO CONTEUDO] Transação revertida

👉 Ação: Nenhum boleto foi alterado no banco
         Procurar erro acima da mensagem de ROLLBACK
```

---

## Fluxo Passo a Passo

### 1️⃣ Frontend: Selecionar Arquivo
```javascript
// Browser Console (F12 → Console)
[CNAB] File selected: retorno_sicoob_27.txt (425 bytes)
```

### 2️⃣ Frontend: Enviar para Backend
```javascript
// Browser Console (F12 → Console)
[CNAB] Sending to backend: POST /cnab/importar-retorno
```

### 3️⃣ Backend: Receber e Iniciar
```bash
# Terminal do servidor NestJS
[RETORNO CONTEUDO] Iniciando processamento de arquivo: retorno_sicoob_27.txt
[RETORNO CONTEUDO] Tamanho do conteúdo: 425 caracteres
[RETORNO CONTEUDO] Iniciando transação...
[RETORNO CONTEUDO] Total de linhas: 5
```

### 4️⃣ Backend: Detectar Banco
```bash
# Terminal do servidor NestJS
[RETORNO CONTEUDO] Detectando banco...
[CNAB DEBUG] Primeira linha recebida: 75600000263593822000143...
[CNAB DEBUG] Tamanho da linha: 240
[CNAB DEBUG] Análise: {
  codigoBanco: '756',
  tipoRegistro: '0',
  codigoRemessaRetorno: '2',  // ✅ Correto! É RETORNO
  verificacao: { isBanco756: true, isTipo0: true, isRemessa: true }
}
```

### 5️⃣ Backend: Processar Estrutura
```bash
# Terminal do servidor NestJS
[SICOOB PROCESSADOR] Iniciando processamento de arquivo retorno
  totalLinhas: 5

[SICOOB PROCESSADOR] Primeira passagem: coletando segmentos T e U

[SICOOB PROCESSADOR] Segmento T encontrado
  indice: 2
  nossoNumero: '12345678'

[SICOOB PROCESSADOR] Detalhe criado
  nossoNumero: '12345678'
  status: 'liquidado'
  liquidado: true

[SICOOB PROCESSADOR] Arquivo processado com sucesso
  numeroRetorno: 'RET001'
  quantidadeBoletos: 1
  boletosLiquidados: 1
```

### 6️⃣ Backend: Atualizar Boletos
```bash
# Terminal do servidor NestJS
[BOLETO ATUALIZADOR] Iniciando atualização de boletos
  totalDetalhes: 1
  gerenciarTransacao: false

[BOLETO ATUALIZADOR] Processando detalhe
  nossoNumero: '12345678'
  status: 'liquidado'

[BOLETO ATUALIZADOR] Buscando boleto com número normalizado: 12345678

[BOLETO ATUALIZADOR] Boleto atualizado para LIQUIDADO
  boletoId: 1
  dataPagamento: '2024-01-15'
  valorPago: 1500.00

[BOLETO ATUALIZADOR] Finalizando atualização de boletos
  atualizados: 1
  naoEncontrados: 0
  erros: 0
```

### 7️⃣ Backend: Finalizar Transação
```bash
# Terminal do servidor NestJS
[RETORNO CONTEUDO] Realizando commit da transação...
[RETORNO CONTEUDO] Transação commitada com sucesso!

[RETORNO CONTEUDO] Processamento finalizado: {
  retornoId: 1,
  numeroRetorno: 'RET001'
}
```

### 8️⃣ Frontend: Mostrar Sucesso
```javascript
// Browser Console (F12 → Console)
[CNAB] Retorno processado com sucesso!
  Retorno ID: 1
  Número: RET001
  Boletos atualizados: 1
  Boletos liquidados: 1
```

---

## Monitoramento em Tempo Real

### Ver logs do servidor enquanto testa
```bash
# Terminal 1: Iniciar servidor
cd backend
npm run start:dev

# Aguardar e ver logs aparecendo em tempo real
# Quando enviar arquivo, os logs aparecem aqui imediatamente
```

### Verificar banco de dados após sucesso
```bash
# Terminal 2: Abrir SQLite
sqlite3 erp.db

# Verificar boleto atualizado
SELECT id, nosso_numero, status, data_pagamento, valor_pago 
FROM boletos 
WHERE status = 'liquidado' 
ORDER BY updated_at DESC;

# Verificar retorno registrado
SELECT id, numero_retorno, boletos_liquidados, boletos_rejeitados, created_at 
FROM retornos 
ORDER BY created_at DESC;
```

---

## Variáveis Importantes para Monitorar

| Variável | Deve Ser |Errado |
|----------|----------|--------|
| `codigoBanco` | `'756'` | `'999'` ou outro |
| `codigoRemessaRetorno` | `'2'` | `'3'` (remessa) |
| `totalDetalhes` | `> 0` | `0` ou `undefined` |
| `atualizados` | `> 0` (em sucesso) | `0` (não encontrou boletos) |
| `naoEncontrados` | `0` (ideal) | `> 0` (boleto não existe) |
| `erros` | `0` (ideal) | `> 0` (erro na atualização) |

---

## Comparação: Antes vs Depois

### Antes (sem logs)
```javascript
// Frontend envia arquivo
// ... aguarda resposta ...
❌ HTTP 400: "Arquivo de retorno não encontrado"
❌ Sem saber o que deu errado
```

### Depois (com logs)
```javascript
// Frontend envia arquivo
// Terminal mostra:
✅ [RETORNO CONTEUDO] Iniciando processamento de arquivo: ...
✅ [SICOOB PROCESSADOR] Segmento T encontrado: ...
✅ [BOLETO ATUALIZADOR] Boleto atualizado para LIQUIDADO: ...
✅ [RETORNO CONTEUDO] Transação commitada com sucesso!
✅ Sabe exatamente o que aconteceu em cada etapa
```

---

## Dicas de Debug

### 1. Parar no primeiro erro
```bash
# Se vir algum ❌ log, leia a mensagem acima dele
# O erro está sempre acompanhado de detalhes
```

### 2. Verificar timestamps
```bash
# Os logs NÃO têm timestamp, então veja horário do seu relogio
# ou adicione Date.now() aos logs se precisar
```

### 3. Comparar com documentação CNAB
```bash
# Se codigoBanco não for 756, arquivo não é Sicoob
# Se codigoRemessaRetorno for 3, é REMESSA não RETORNO
# Verificar especificação CNAB 240
```

### 4. Validar dados do boleto
```bash
# Verificar se nossoNumero no arquivo existe no banco
SELECT * FROM boletos WHERE nosso_numero LIKE '%12345678%';

# Se não retornar, é por isso que não encontrou
```

---

## Próximos Passos

1. **Fazer teste completo com arquivo real**
   - Use um arquivo RETORNO (código 2) do Sicoob
   - Observe todos os 30 logs sendo exibidos
   - Confirme transação foi commitada

2. **Validar dados no banco**
   ```sql
   SELECT * FROM boletos WHERE status = 'liquidado' ORDER BY updated_at DESC LIMIT 1;
   ```

3. **Se houver erro, encontrar exatamente onde**
   - Procurar por `ERRO` nos logs
   - Ler a mensagem de erro completa
   - Verificar variáveis relevantes

4. **Depois de validado, remover logs (opcional)**
   - Converter para Logger service do NestJS
   - Ou deixar como está para monitoramento futuro

