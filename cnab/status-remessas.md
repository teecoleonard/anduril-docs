# 📊 Status das Remessas CNAB

## 📋 Visão Geral

As remessas CNAB possuem diferentes status que refletem seu estágio no processamento bancário: desde criação até confirmação e retorno.

---

## 🎯 Status Possíveis

### 🟢 **Gerada**
**Significado:** Remessa foi criada no sistema  
**Quando fica assim:** Quando você gera a remessa  
**Ações possíveis:** Enviar ao banco, cancelar, incluir mais boletos  
**Observação:** Arquivo salvo e pronto para envio  

---

### 🔵 **Enviada**
**Significado:** Remessa foi enviada ao banco  
**Quando fica assim:** Quando você confirma envio ao banco  
**Ações possíveis:** Aguardar retorno, verificar status  
**Observação:** Banco processa (geralmente 1 dia útil)  

---

### ⏳ **Processando**
**Significado:** Banco está processando a remessa  
**Quando fica assim:** Após envio, durante processamento  
**Ações possíveis:** Aguardar retorno  
**Observação:** Duração típica: algumas horas a 1 dia  

---

### ✅ **Processada**
**Significado:** Banco finalizou processamento  
**Quando fica assim:** Após retorno ser importado  
**Ações possíveis:** Analisar resultado, gerar nova se necessário  
**Observação:** Boletos foram aceitos ou rejeitados  

---

### ❌ **Cancelada**
**Significado:** Remessa foi cancelada manualmente  
**Quando fica assim:** Quando você cancela antes do envio  
**Ações possíveis:** Nenhuma (histórico mantido)  
**Observação:** Boletos voltam ao status anterior  

---

## 📊 Ciclo de Vida da Remessa

```
GERADA (Criada)
    ↓
[Revisar dados dos boletos]
    ├─→ Cancelar? → CANCELADA ❌
    └─→ Enviar ao Banco → ENVIADA
        ↓
        PROCESSANDO [1-24 horas]
        ↓
        [Retorno Recebido]
        ↓
        Importar Retorno
        ↓
        PROCESSADA ✓
        ├─ Alguns Boletos: PAGOS ✓
        ├─ Alguns: VENCIDOS ⚠️
        └─ Alguns: REJEITADOS ❌
```

---

## 💡 Entendendo Cada Status

### ✅ **GERADA** - Pronta para Envio

```
Remessa: REM-20260205-001
Data de Geração: 05/02/2026
Total de Boletos: 10
Valor Total: R$ 50.000,00
Status: 🟢 GERADA
Arquivo: remessa_20260205_143022.txt
```

**O que fazer:**
- Revisar dados (client, valores, datas)
- Testar com poucos boletos se primeira vez
- Confirmar envio ao banco

**Próximo passo:**
- Enviar arquivo ao banco via internet banking
- Marcar como ENVIADA

---

### 🔵 **ENVIADA** - Submetida ao Banco

```
Remessa: REM-20260205-001
Data de Envio: 05/02/2026 às 15:30
Status: 🔵 ENVIADA
Banco: Sicoob (756)
Total de Boletos: 10
Valor Total: R$ 50.000,00
Data Esperada Retorno: 06/02/2026
```

**O que fazer:**
- Aguardar processamento
- Não há ação imediata
- Verificar email/portal de retorno

**Observação:**
- Bancos processam durante horário comercial
- Retorno geralmente no dia seguinte
- Pode levar até 2 dias em alguns casos

---

### ⏳ **PROCESSANDO** - Banco Processando

```
Remessa: REM-20260205-001
Status: ⏳ PROCESSANDO
Tempo Decorrido: 4 horas
Tempo Estimado Restante: 16-20 horas
Última Atualização: 05/02/2026 19:00
```

**O que fazer:**
- Nada (processo automático do banco)
- Aguardar retorno
- Não cancelar (risco de duplicação)

**Quando terminará:**
- Próximo dia útil, durante o expediente

---

### ✅ **PROCESSADA** - Resultado Disponível

```
Remessa: REM-20260205-001
Status: ✅ PROCESSADA
Data Processamento: 06/02/2026
Data Retorno Importado: 06/02/2026
Resultado:
├─ Total de Boletos: 10
├─ ✅ Aceitos: 9
├─ ❌ Rejeitados: 1
└─ Valor Total Aceito: R$ 45.000,00
```

**O que fazer:**
- Analisar boletos rejeitados (se houver)
- Verificar motivo de rejeição
- Corrigir e reenviar se necessário
- Acompanhar pagamentos

**Próximos passos:**
1. Revisar boletos rejeitados
2. Corrigir dados
3. Gerar nova remessa se necessário
4. Importar novos retornos regularmente

---

### ❌ **CANCELADA** - Não Enviada

```
Remessa: REM-20260205-001
Status: ❌ CANCELADA
Data Cancelamento: 05/02/2026
Motivo: Dados errados, gerar nova
```

**O que fazer:**
- Gerar nova remessa com dados corretos
- Boletos voltam ao status anterior

**Observação:**
- Só possível cancelar antes de enviar
- Após envio, deve usar retorno

---

## ⚠️ Codes de Erro (Rejeição)

| Código | Significado | Solução |
|--------|------------|---------|
| **01** | CPF/CNPJ inválido | Verifique documento do cliente |
| **02** | Boleto duplicado | Não envie 2x o mesmo boleto |
| **03** | Dados inconsistentes | Atualize dados de cliente |
| **04** | Agência/Conta inválida | Verifique dados da empresa |
| **05** | Boleto vencido | Gere novo com vencimento futuro |
| **08** | Rejeição do banco | Contate seu banco |

---

## 📈 Estatísticas de Remessas

Sistema fornece:

```
Total de Remessas: 15
├─ 🟢 Geradas: 1
├─ 🔵 Enviadas: 2
├─ ⏳ Processando: 0
├─ ✅ Processadas: 12
└─ ❌ Canceladas: 0

Boletos Processados: 150
├─ ✅ Aceitos: 145
└─ ❌ Rejeitados: 5

Valor Total: R$ 750.000,00
├─ Aceito: R$ 725.000,00
└─ Rejeitado: R$ 25.000,00
```

---

## 🔍 Como Verificar Status de Remessa

1. Vá para **CNAB → Remessas**
2. Lista mostra todas as remessas
3. Coluna de **Status** com cores:
   - 🟢 Verde = Gerada
   - 🔵 Azul = Enviada
   - ⏳ Amarelo = Processando
   - ✅ Verde escuro = Processada
   - ❌ Vermelho = Cancelada
4. Clique para detalhes:
   - Boletos incluídos
   - Resultado de cada um
   - Log de processamento

---

## 🔄 Fluxo Completo

```
PASSO 1: Criar Boletos
   ↓
PASSO 2: Gerar Remessa
   Remessa Status: GERADA 🟢
   ↓
PASSO 3: Revisar Dados
   [Tudo OK?] Sim ↓
             Não → Cancelar e refazer
   ↓
PASSO 4: Enviar ao Banco
   Remessa Status: ENVIADA 🔵
   ↓
PASSO 5: Aguardar (1-24 horas)
   Remessa Status: PROCESSANDO ⏳
   ↓
PASSO 6: Banco Retorna
   ↓
PASSO 7: Importar Retorno
   Remessa Status: PROCESSADA ✅
   ↓
PASSO 8: Analisar Resultado
   [Rejeições?] Sim → Corrigir e voltar ao PASSO 2
              Não → Acompanhar pagamentos
```

---

## 💼 Casos de Uso

### Caso 1: Remessa Normal (Sem Erros)
```
1. Gerar 10 boletos → GERADA
2. Enviar ao banco → ENVIADA
3. Banco processa (1 dia) → PROCESSANDO
4. Banco retorna confirmação → PROCESSADA ✅
5. Resultado: 10/10 aceitos
6. Acompanhar pagamentos
```

### Caso 2: Rejeição e Refazimento
```
1. Gerar 5 boletos → GERADA
2. Enviar → ENVIADA
3. Banco retorna → PROCESSADA
4. Resultado: 4 aceitos, 1 rejeitado ❌
5. CPF do cliente errado
6. Corrigir CPF
7. Gerar nova remessa com boleto corrigido
8. Enviar → ENVIADA
9. Resultado: 1 aceito ✅
```

### Caso 3: Cancelamento Antecipado
```
1. Gerar remessa → GERADA
2. Descobrir erro nos dados
3. Cancelar → CANCELADA ❌
4. Gerar nova remessa corrigida
5. Enviar normalmente
```

---

## ℹ️ Boas Práticas

1. **Sempre revisar antes de enviar**
   - Dados de cliente
   - Valores dos boletos
   - Datas de vencimento

2. **Testar com poucos boletos**
   - Primeira remessa: 1-2 boletos
   - Validar resultado
   - Depois fazer remessas maiores

3. **Guardar números de remessas**
   - Para rastreamento
   - Para auditor ia/suporte

4. **Processar retornos regularmente**
   - Diariamente ou a cada 2 dias
   - Manter status atualizado
   - Resolver rejeições rapidamente

5. **Manter histórico**
   - Guardar arquivos
   - Arquivar remessas antigas
   - Para referência futura

---

## 📸 Campos de Referência

Cada remessa tem:
- 🆔 **ID/Número** - REM-YYYYMMDD-NNN
- 📅 **Data Geração** - Quando foi criada
- 📅 **Data Envio** - Quando foi enviada
- 📊 **Total Boletos** - Quantos boletos
- 💰 **Valor Total** - Soma dos valores
- 🏦 **Banco** - Código (756 = Sicoob)
- 📊 **Status** - Situação atual
- 📝 **Resultado** - Aceitos/Rejeitados
- 📄 **Arquivo** - Nome do arquivo

---

**[Voltar ao README de CNAB](./README.md)**
