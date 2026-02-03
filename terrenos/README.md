# 🏞️ Módulo de Terrenos

## 📋 Visão Geral

O módulo de **Terrenos** gerencia todo o estoque de terrenos disponíveis para venda. Cada terreno pode estar em diferentes status: Disponível, Reservado ou Vendido.

---

## 🎯 Principais Características

✅ Cadastro de terreno com localização e preço  
✅ Controle de disponibilidade em tempo real  
✅ Alertas automáticos para terrenos reservados  
✅ Validação de dados geográficos  
✅ Busca e filtros avançados  
✅ Vinculação com contratos  

---

## 📖 Guias Disponíveis

### 1. [Como Registrar um Novo Terreno](./como-registrar-terreno.md)
Passo-a-passo para adicionar um novo terreno ao estoque.

### 2. [Status dos Terrenos](./status-terrenos.md)
Entenda os diferentes status: Disponível, Reservado, Vendido.

### 3. [Sistema de Alertas](./sistema-alertas.md)
Como funciona o alerta para terrenos reservados há mais de 7 dias.

### 4. [Validações de Terrenos](./validacoes-terrenos.md)
Regras e validações que o sistema aplica.

---

## 🔗 Relação com Outros Módulos

- **Contratos**: Terreno é vinculado a contrato
- **Clientes**: Cliente compra terreno via contrato
- **Boletos**: Boletos são gerados para pagamento do terreno

---

## ⚠️ Status Importantes

| Status | Significado | Ação Possível |
|--------|------------|---------------|
| 🟢 **Disponível** | Pode ser vendido | Criar Contrato |
| 🟡 **Reservado** | Aguardando confirmação | Aguardar ou Liberar |
| 🔴 **Vendido** | Já tem proprietário | Nenhuma |

---

## 💡 Dicas Rápidas

- Revise regularmente terrenos "Reservados" há mais de 7 dias
- Complete sempre todos os dados do terreno
- Use códigos padronizados para fácil identificação

---

**[Voltar ao Índice](../INDEX.md)**
