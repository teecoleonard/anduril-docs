# 🔍 Análise: Por que `remessa_id` fica NULL no Retorno CNAB

**Data**: 02/02/2026  
**Status**: ✅ **PROBLEMA IDENTIFICADO E CORRIGIDO**

---

## Resumo Executivo

Quando você processa um retorno CNAB, o campo `remessa_id` na tabela `retornos_cnab` pode ficar **NULL** (sem vinculação à remessa original).

Isso pode ser causado por:
1. ✅ **Bug do sistema** (CORRIGIDO) - Data errada na busca
2. ❌ **Problema do usuário** - Retorno de remessa em dia diferente
3. ❌ **Problema do banco** - Banco mudou o número da remessa

---

## O Sistema de Vinculação Remessa-Retorno

O código implementa **3 estratégias em cascata** para vincular retorno à remessa:

### Estratégia 1: Busca Exata pelo Número
```typescript
SELECT id FROM remessas_cnab WHERE numero_remessa_original = ?
```

**Como funciona:**
- Procura remessa com `numero_remessa_original` = número que vem no retorno
- UUID armazenado em `numero_remessa_original` (ex: `REM-550e8400-e29b-41d4-a716...`)

**Quando funciona:**
- ✅ Banco mantém o mesmo número da remessa no retorno

**Quando falha:**
- ❌ Banco gera novo número para o retorno (muda `REM-550e8400` para `REM202602123456`)

---

### Estratégia 2: Busca por Dados da Empresa + Data
```typescript
SELECT id FROM remessas_cnab
WHERE codigo_empresa = ? AND DATE(data_remessa) = DATE(?)
ORDER BY created_at DESC LIMIT 1
```

**Como funciona:**
- Procura remessa com `codigo_empresa` (CNPJ) + `data_remessa` iguais
- Retorna a remessa MAIS RECENTE daquele dia

**Quando funciona:**
- ✅ Header do retorno contém CNPJ da empresa
- ✅ Remessa foi gerada no mesmo dia do retorno

**Quando falha:**
- ❌ Múltiplas remessas no mesmo dia (pega apenas a mais recente)
- ❌ Retorno é processado em dia DIFERENTE da geração (ex: remessa gerada dia 01, retorno processado dia 02)

---

### Estratégia 3: Retorna NULL (Seguro)
Se nenhuma estratégia funcionar, deixa `remessa_id = NULL`

**Por que NULL ao invés de força r vinculação errada:**
- Vincular à remessa ERRADA é pior do que não vincular
- Com `remessa_id = NULL`, boletos são atualizados mas remessa não fica marcada como "processada"
- Usuário consegue ver que houve desvinculação e corrigir manualmente

---

## 🐛 BUG IDENTIFICADO E CORRIGIDO

### O Problema

Na **Estratégia 2**, o código usava:

```typescript
// ❌ ERRADO - Usa data de HOJE
const dataRetorno = new Date().toISOString().split('T')[0];
```

Isso significa:
- Se remessa gerada **ontem** (01/02) e retorno processado **hoje** (02/02)
- Sistema procura por remessa de **HOJE** (02/02)
- Não encontra! Remessa foi de ontem.

### A Solução

Agora usa a **data que vem no header do retorno** (conforme CNAB 240):

```typescript
// ✅ CORRETO - Usa data do header do retorno
const dataRetorno = this.formatarDataDDMMAAAAParaYYYYMMDD(headerRetorno.dataGeracao);
```

**Benefícios:**
- ✅ Funciona mesmo se retorno processado dias depois
- ✅ Usa informação REAL do banco, não data do sistema
- ✅ Compatível com arquivos retorno antigos

---

## 📊 Casos de Uso e Soluções

### Caso 1: Retorno processado dias depois (COMUM)

| Evento | Data | Sistema |
|--------|------|---------|
| Remessa gerada | 01/02 | Armazena `data_remessa = 2026-02-01` |
| Retorno recebido | 03/02 | Header: `dataGeracao = 01022026` (DDMMAAAA) |
| Processamento | 03/02 | **[ANTES]** Procurava por 03/02 → não encontra ❌<br/>**[DEPOIS]** Procura por 01/02 → encontra ✅ |

**Status após correção:** ✅ `remessa_id` preenchido corretamente

---

### Caso 2: Múltiplas remessas no mesmo dia (RARO)

```
Remessa A: 02/02 às 10:00 → numero_remessa = REM-uuid-a
Remessa B: 02/02 às 14:00 → numero_remessa = REM-uuid-b
Retorno:   03/02 → dataGeracao = 02022026
```

**Resultado:**
- Sistema encontra **ambas as remessas** para 02/02
- Escolhe a **mais recente** (Remessa B)
- **Pode estar errada se Retorno é para Remessa A!**

**Solução:**
- Processar retornos em ordem cronológica
- Se necessário, editar manualmente `numero_remessa_original` com número do retorno
- Usar coluna `numero_remessa_original` (Estratégia 1) para identificação precisa

---

### Caso 3: Banco mudou o número da remessa (POSSÍVEL)

```
Enviado:  REM-550e8400-e29b-41d4-a716-446655440000
Retorno:  REM202602123456 (banco gerou novo número)
```

**Resultado:**
- Estratégia 1 falha (números diferentes)
- Estratégia 2 encontra por CNPJ + data ✅

**Solução se falhar:**
- Editar manualmente `numero_remessa_original = REM202602123456` na tabela `remessas_cnab`
- Próximo processamento de retorno encontrará via Estratégia 1

---

## ✅ Arquivos Modificados

1. **`retorno.service.ts`** (linhas 247-300)
   - Função `vincularRemessa()`: Usa data do header ao invés de data de hoje
   - Nova função `formatarDataDDMMAAAAParaYYYYMMDD()`: Converte DDMMAAAA para YYYY-MM-DD

2. **`DOCUMENTACAO_BANCO_DADOS.md`**
   - Seção "Tabela remessas_cnab" atualizada com novas colunas
   - Nova seção "Vinculação Remessa-Retorno" explicando as 3 estratégias
   - Seção "Possíveis Razões para remessa_id = NULL" com soluções

---

## 🧪 Como Testar

### Teste Manual: Retorno Processado Dias Depois

1. Gerar remessa em **01/02**
   ```
   POST /remessas/gerar
   Response: numero_remessa = "REM-550e8400-..."
   Database: remessa.data_remessa = 2026-02-01
   ```

2. Processar retorno em **03/02**
   ```
   POST /retornos/processar
   File header: dataGeracao = "01022026" (DDMMAAAA)
   ```

3. Verificar resultado
   ```sql
   SELECT remessa_id FROM retornos_cnab WHERE numero_retorno = '...';
   -- Esperado: remessa_id = 1 (preenchido) ✅
   -- Antes da correção: remessa_id = NULL ❌
   ```

### Teste de Compilação

```bash
cd backend
npm run build
# Esperado: Sem erros ✅
```

---

## 📋 Resumo das Correções

| Problema | Antes | Depois | Status |
|----------|-------|--------|--------|
| Data errada na busca | Usava `new Date()` | Usa `headerRetorno.dataGeracao` | ✅ CORRIGIDO |
| Documentação desatualizada | Sem menção às novas colunas | Detalhado com 3 estratégias | ✅ ATUALIZADO |
| Sem função de conversão de data | Não existia | `formatarDataDDMMAAAAParaYYYYMMDD()` | ✅ ADICIONADO |
| Sem explicação do problema | Sem contexto | Análise completa com soluções | ✅ DOCUMENTADO |

---

## 🎯 Próximos Passos

1. **Teste em Staging**
   - Processar retornos com diferentes atrasos
   - Verificar vinculação automática

2. **Migração de Dados** (opcional)
   - Se há retornos com `remessa_id = NULL` históricos
   - Pode tentar re-vincular automaticamente

3. **Monitoramento**
   - Acompanhar logs de desvinculações
   - Alertar se muitos `remessa_id = NULL`

---

## 📞 Contato e Questões

Se `remessa_id` continuar NULL após essa correção:

1. ✅ Verificar se compilou corretamente (`npm run build`)
2. ✅ Verificar `data_remessa` na tabela `remessas_cnab`
3. ✅ Verificar `codigo_empresa` está preenchido
4. ✅ Verificar `headerRetorno.dataGeracao` no arquivo
5. ❓ Se ainda NULL, editar manualmente `numero_remessa_original` com número do retorno
