# 🏦 Módulo CNAB

## 📋 Visão Geral

O módulo **CNAB** gerencia a integração bancária completa com o padrão CNAB 240 (Sicoob). Permite gerar remessas (arquivos para enviar ao banco) e processar retornos (confirmações de pagamento).

---

## 🎯 Principais Características

✅ Geração de remessas CNAB 240  
✅ Envio de boletos ao banco  
✅ Importação de retornos bancários  
✅ Atualização automática de status  
✅ Validação de dados bancários  
✅ Rastreamento de operações  
✅ Diagnóstico de problemas  

---

## 📖 Guias Disponíveis

### 1. [Como Gerar uma Remessa CNAB](./como-gerar-remessa.md)
Passo-a-passo para criar e enviar remessa ao banco.

### 2. [Como Importar um Retorno CNAB](./como-importar-retorno.md)
Como processar retornos do banco para atualizar pagamentos.

### 3. [Status das Remessas](./status-remessas.md)
Entenda os diferentes status das remessas.

### 4. [Processamento Automático](./processamento-automatico.md)
Como o sistema processa automaticamente retornos.

### 5. [Diagnóstico de Problemas](./diagnostico-problemas.md)
Como diagnosticar e resolver problemas comuns.

---

## 🔗 Relação com Outros Módulos

- **Boletos**: Remessas contêm boletos para enviar ao banco
- **Clientes**: Dados do cliente incluídos na remessa
- **Empresa**: Dados da empresa (CNPJ, banco) usados na remessa
- **Contratos**: Boletos vêm de contratos

---

## ⚠️ Pontos Importantes

1. **Antes de gerar remessa:**
   - Verifique se dados da empresa estão corretos
   - Confirme que boletos estão com dados válidos
   - Teste com poucos boletos primeiro

2. **Após gerar remessa:**
   - Anote o número da remessa
   - Verifique confirmação do banco
   - Aguarde retorno para confirmar pagamentos

3. **Ao importar retorno:**
   - Status dos boletos são atualizados automaticamente
   - Verificar se todos os boletos foram processados
   - Resolver erros de vinculação se houver

---

## 📊 Fluxo Completo CNAB

```
Boletos Criados
    ↓
Gerar Remessa
    ↓
Enviar ao Banco
    ↓
Aguardar Processamento
    ↓
Retorno do Banco
    ↓
Importar Retorno
    ↓
Status Atualizado ✓
```

---

## 💡 Dicas Práticas

- Teste com poucos boletos antes de remessa grande
- Sempre verifique dados de empresa antes de remessa
- Guarde número de remessa para rastreamento
- Processe retornos regularmente

---

## 🚨 Alertas Comuns

| Alerta | O Que Fazer |
|--------|------------|
| "Dados de empresa incompletos" | Vá em Empresa e preencha todos os dados |
| "Boleto com dados inválidos" | Verifique boleto e corrija dados |
| "Retorno não importou" | Verifique formato do arquivo retornado |

---

**[Voltar ao Índice](../INDEX.md)**
