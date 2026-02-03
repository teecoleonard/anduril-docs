# 🔄 Remapeamento: Estrutura de Terrenos

## 📋 Análise do Problema

### ❌ Campos Incorretos no Terreno

Atualmente, a tabela `terrenos` contém campos que **pertencem ao contrato**, não ao terreno:

- `valor_bruto` - Valor negociado no contrato
- `valor_nominal` - Valor negociado no contrato  
- `valor_entrada` - Valor negociado no contrato
- `quantidade_parcelas` - Condições do contrato
- `correcao` - Taxa/correção do contrato

### ✅ Estrutura Correta do Terreno

O terreno deve conter apenas:
- **id** - Identificador único
- **codigo** - Código identificador (ex: "LOTE-001")
- **quadra** - Número da quadra
- **area** - Área em m²
- **lote** - Número do lote
- **logradouro** - Endereço/logradouro (NOVO - não existe ainda)
- **preco** - Preço base/sugerido do terreno (único campo de valor)
- **descricao** - Descrição do terreno
- **condicoes_pagamento** - Condições gerais de pagamento (texto livre)
- **status** - disponivel, reservado, vendido
- **created_at** - Data de criação
- **updated_at** - Data de atualização

### ✅ Estrutura Correta do Contrato

O contrato já possui os campos corretos:
- `valor_total` - Valor total negociado
- `valor_entrada` - Entrada negociada
- `quantidade_parcelas` - Parcelas negociadas
- `taxa` - Taxa/juros/correção (substitui `correcao`)

---

## 🎯 Plano de Remapeamento

### Fase 1: Análise e Preparação ✅

- [x] Identificar campos incorretos
- [x] Verificar uso dos campos no código
- [x] Criar plano de migração

### Fase 2: Alterações no Banco de Dados

1. **Adicionar novos campos**:
   - `logradouro TEXT` - Endereço/logradouro do terreno
   - `preco REAL NOT NULL` - Preço base do terreno

2. **Migrar dados existentes**:
   - `preco = valor_nominal` (ou `valor_bruto` se `valor_nominal` for NULL)
   - `logradouro = NULL` (será preenchido manualmente se necessário)

3. **Remover campos de contrato**:
   - `valor_bruto` → **REMOVIDO**
   - `valor_nominal` → **REMOVIDO** (substituído por `preco`)
   - `valor_entrada` → **REMOVIDO**
   - `quantidade_parcelas` → **REMOVIDO**
   - `correcao` → **REMOVIDO**

### Fase 3: Atualização do Código

1. **DTOs**:
   - Remover campos de contrato de `CreateTerrenoDto`
   - Remover campos de contrato de `UpdateTerrenoDto`
   - Adicionar `logradouro` e `preco`

2. **Service**:
   - Remover validações de `valor_entrada` vs `valor_nominal`
   - Remover método `calcularValorParcela` (não faz sentido no terreno)
   - Atualizar queries SQL

3. **Interface Terreno**:
   - Atualizar interface TypeScript

4. **Exportação**:
   - Atualizar exportação de terrenos

### Fase 4: Documentação

1. Atualizar `DOCUMENTACAO_BANCO_DADOS.md`
2. Atualizar diagramas ER
3. Documentar migration

---

## 📊 Comparação: Antes vs Depois

### Antes (INCORRETO)

```sql
CREATE TABLE terrenos (
  id INTEGER PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,
  lote TEXT,
  quadra TEXT,
  area REAL,
  valor_bruto REAL NOT NULL,        -- ❌ Pertence ao contrato
  valor_nominal REAL NOT NULL,      -- ❌ Pertence ao contrato
  valor_entrada REAL,               -- ❌ Pertence ao contrato
  quantidade_parcelas INTEGER,      -- ❌ Pertence ao contrato
  correcao REAL DEFAULT 0,          -- ❌ Pertence ao contrato
  condicoes_pagamento TEXT,
  status TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Depois (CORRETO)

```sql
CREATE TABLE terrenos (
  id INTEGER PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,
  lote TEXT,
  quadra TEXT,
  area REAL,
  logradouro TEXT,                  -- ✅ NOVO
  preco REAL NOT NULL,              -- ✅ Preço base único
  condicoes_pagamento TEXT,
  status TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

---

## 🔧 Migration SQL

```sql
-- 1. Adicionar novos campos
ALTER TABLE terrenos ADD COLUMN logradouro TEXT;
ALTER TABLE terrenos ADD COLUMN preco REAL;

-- 2. Migrar dados: preco = valor_nominal (ou valor_bruto como fallback)
UPDATE terrenos 
SET preco = COALESCE(valor_nominal, valor_bruto, 0)
WHERE preco IS NULL;

-- 3. Tornar preco NOT NULL (após migração)
-- SQLite não suporta ALTER COLUMN, então precisamos recriar a tabela
-- OU usar uma abordagem diferente

-- 4. Remover colunas antigas (SQLite não suporta DROP COLUMN diretamente)
-- Será necessário recriar a tabela ou usar uma abordagem de migração
```

**Nota**: SQLite não suporta `DROP COLUMN` diretamente. A migração será feita via recriação da tabela ou mantendo as colunas como obsoletas (não usadas).

---

## ⚠️ Impactos e Considerações

### Impactos no Código

1. **TerrenosService**:
   - Remover validações de `valor_entrada >= valor_nominal`
   - Remover método `calcularValorParcela`
   - Simplificar lógica de criação/atualização

2. **ContratosService**:
   - ✅ **SEM IMPACTO** - Já usa `valor_total` do DTO, não do terreno

3. **ExportacaoService**:
   - Atualizar campos exportados de terrenos

4. **Frontend**:
   - Atualizar formulários de terreno
   - Remover campos de valores do formulário de terreno

### Dados Existentes

- **Migração segura**: Valores serão migrados para `preco`
- **Sem perda de dados**: Campos antigos podem ser mantidos temporariamente
- **Backward compatibility**: Pode manter campos antigos como obsoletos

---

## 📝 Checklist de Implementação

- [ ] Criar migration SQL
- [ ] Atualizar `database.service.ts` (estrutura da tabela)
- [ ] Atualizar `CreateTerrenoDto`
- [ ] Atualizar `UpdateTerrenoDto`
- [ ] Atualizar interface `Terreno`
- [ ] Atualizar `TerrenosService` (remover validações e métodos)
- [ ] Atualizar `ExportacaoService`
- [ ] Atualizar documentação do banco
- [ ] Testar criação de terreno
- [ ] Testar atualização de terreno
- [ ] Testar criação de contrato (deve continuar funcionando)
- [ ] Verificar exportação de terrenos

---

**Status**: 🔄 **Em Planejamento**
