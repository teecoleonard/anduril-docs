# 🎫 Módulo de Boletos

## 📋 Visão Geral

O módulo de **Boletos** gerencia a criação e liquidação de boletos bancários para cobrança dos clientes. Os boletos são gerados a partir de contratos e podem ser criados de várias formas.

---

## 🎯 Principais Características

✅ Geração de boleto por contrato específico  
✅ Geração de múltiplos boletos em lote  
✅ Geração por período (mês/ano)  
✅ Geração por intervalo de datas  
✅ Acompanhamento de status  
✅ Liquidação manual de boletos  
✅ Integração automática com CNAB  

---

## 📖 Guias Disponíveis

### 1. [Como Gerar Boleto por Contrato](./como-gerar-boleto-contrato.md)
Criar boleto individual para um contrato específico.

### 2. [Como Gerar Múltiplos Boletos](./como-gerar-multiplos-boletos.md)
Gerar vários boletos em lote.

### 3. [Como Gerar Boleto por Período](./como-gerar-boleto-periodo.md)
Gerar boletos de um período específico (mês/ano).

### 4. [Como Gerar Boleto por Intervalo](./como-gerar-boleto-intervalo.md)
Gerar boletos entre duas datas.

### 5. [Status dos Boletos](./status-boletos.md)
Entenda os diferentes status que um boleto pode ter.

### 6. [Como Liquidar Boleto Manualmente](./como-liquidar-boleto.md)
Marcar um boleto como pago manualmente.

---

## 🔗 Relação com Outros Módulos

- **Contratos**: Boletos são gerados a partir de contratos
- **Clientes**: Dados do cliente aparecem no boleto
- **CNAB**: Boletos podem ser incluídos em remessas CNAB

---

## 📊 Status dos Boletos

| Status | Significado | Ação |
|--------|------------|------|
| **Aberto** | Aguardando pagamento | Enviar para cliente |
| **Enviado** | Enviado ao banco (CNAB) | Aguardar confirmação |
| **Pago** | Recebimento confirmado | Nenhuma |
| **Cancelado** | Boleto desativado | Gerar novo se necessário |

---

## 💡 Dicas Rápidas

- Verifique dados antes de gerar remessa CNAB
- Boletos gerados automaticamente refletem as condições do contrato
- Pode liquidar manualmente antes de enviar CNAB

---

**[Voltar ao Índice](../INDEX.md)**
