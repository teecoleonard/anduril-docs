# 🚀 Mudanças Recentes - ERP Anduril

**Data Última Atualização:** Fevereiro 7, 2026

---

## 📌 Commit Mais Recente

### `feat: implementar campo de custo, ajuste de datas e melhorias na interface`

Implementação de funcionalidades importantes para gestão de custos, contratos especiais e melhorias na experiência do usuário.

---

## ✨ Funcionalidades Implementadas

### 1. 💰 Campo "Custo" em Terrenos e Contratos

**O que mudou:**
- Novo campo `custo` adicionado aos modelos de Terreno e Contrato
- Validação de formato monetário implementada
- Formulários atualizados para aceitar entrada do custo
- Serviço de exportação agora inclui custo nos relatórios Excel

**Por quê:**
- Rastreamento mais preciso de custos gerenciais
- Melhor visibilidade financeira dos projetos
- Relatórios mais completos

**Arquivos Modificados:**
- `backend/src/terrenos/terrenos.service.ts`
- `backend/src/contratos/contratos.service.ts`
- `backend/src/exportacao/exportacao.service.ts`
- `frontend/src/components/TerrenoForm/TerrenoForm.tsx`
- `frontend/src/components/ContratoForm/ContratoForm.tsx`

---

### 2. 📅 Ajuste Manual de Data de Vencimento para Contratos Especiais

**O que mudou:**
- Nova funcionalidade para aplicar ajustes manuais na data de vencimento
- Modal `AjusteDataVencimentoModal` criado com validação em tempo real
- Opções de ajuste aparecem apenas em contratos especiais
- Tratamento robusto de erros e feedback ao usuário

**Por quê:**
- Oferece flexibilidade para contratos especiais
- Permite correções quando necessário sem regenerar todas as parcelas
- Rastreamento de alterações realizadas

**Como Usar:**
1. Na página de Contratos, abra um contrato especial
2. Procure pela opção "Ajustar Data de Vencimento"
3. Selecione a nova data no modal
4. O sistema atualiza automaticamente

**Arquivos Modificados:**
- `frontend/src/components/AjusteDataVencimentoModal/AjusteDataVencimentoModal.tsx` (novo)
- `frontend/src/pages/Contratos/Contratos.tsx`
- `backend/src/contratos/contratos.controller.ts`

---

### 3. 🔗 Otimização de Links Externos (IPC - Electron)

**O que mudou:**
- Handler IPC implementado no main process para abrir URLs externas
- Método `openExternal` exposto na API Electron preload
- Links abrem no navegador padrão do sistema
- Implementadas verificações de segurança

**Por quê:**
- Melhor integração Electron-Sistema Operacional
- Links abertos de forma segura
- Conformidade com práticas recomendadas de segurança

**Uso Técnico:**
```typescript
// No renderer process
window.electronAPI.openExternal('https://example.com');
```

**Arquivos Modificados:**
- `electron/main.ts`
- `electron/preload.ts`
- `frontend/src/types/electron.d.ts`

---

### 4. ✅ Correção de Tipos Booleanos em Cliente

**O que mudou:**
- Campo `regime_diferente_de_comunhao_parcial`: `string` → `boolean`
- Campo `uniao_estavel`: `string` → `boolean`
- Formulários agora usam checkboxes ao invés de dropdowns
- Schema de validação atualizado para booleanos
- Migração de dados garante compatibilidade

**Por quê:**
- Interface mais intuitiva e semanticamente correta
- Dados representam melhor a realidade (ligado/desligado)
- Validação mais robusta

**Arquivos Modificados:**
- `frontend/src/components/ClienteForm/ClienteForm.tsx`
- `frontend/src/schemas/cadastro-contratual.schema.ts`
- Migrations de banco de dados

---

### 5. 🎨 Melhorias de Estilos e Interface

**O que mudou:**
- Limpeza de estilos CSS não utilizados
- Melhora na aparência de checkboxes
- Melhorado contraste para acessibilidade
- Layout grid da ContratoForm reorganizado

**Por quê:**
- Melhor manutenibilidade do código
- Interface mais consistente
- Melhor acessibilidade

**Arquivos Modificados:**
- `frontend/src/styles/global.css`
- `frontend/src/components/ContratoForm/ContratoForm.css`

---

## 🔄 Sincronização de Dados - Boletos e Contratos

### Mudanças Importantes Implementadas:

#### Nova Lógica de Liquidação Manual
```typescript
// Quando valor_pago é atualizado, o sistema detecta automaticamente:
- Pagamento TOTAL → Status: BAIXADO
- Pagamento PARCIAL → Status: ABERTO_PARCIALMENTE
```

#### Sincronização de saldo_devedor
- Sincroniza automaticamente quando boleto é liquidado (CNAB)
- Sincroniza quando há baixa manual (BAIXADO)
- Sincroniza em pagamentos parciais (ABERTO_PARCIALMENTE)

#### Novo Campo: parcelas_liquidadas
- Rastreia número de parcelas liquidadas por contrato
- Utilizado no cálculo de saldo devedor

#### Contratos Pago à Vista
```typescript
// Novo flag pago_a_vista:
- Não gera parcelas ou boletos
- Status nasce como FINALIZADO
- Saldo devedor = 0
- Valor entrada = null
```

#### Flag é_contrato_antigo
- Identificação de contratos importados de sistemas antigos
- Facilita tratamento especial se necessário

---

## 📊 Transições de Status de Boleto

**Estado Final da Máquina de Estados:**

| Status Atual | Transições Permitidas |
|---|---|
| ABERTO | BAIXADO, ABERTO_PARCIALMENTE, CANCELADO, VENCIDO |
| ABERTO_PARCIALMENTE | BAIXADO, ABERTO_PARCIALMENTE, CANCELADO |
| LIQUIDADO | (nenhuma - imutável via CNAB) |
| BAIXADO | CANCELADO |
| CANCELADO | (nenhuma - terminal) |
| VENCIDO | BAIXADO, ABERTO_PARCIALMENTE, CANCELADO |

---

## ✅ Testes Realizados

- ✅ Validação de campos monetários
- ✅ Exportação com novo campo custo
- ✅ UI do modal de ajuste de datas
- ✅ Segurança de abertura de links IPC
- ✅ Compatibilidade com dados legados
- ✅ Responsividade de checkboxes

---

## 🔗 Documentação Relacionada

Para detalhes específicos de cada módulo, consulte:

- [Boletos](./boletos/README.md) - Geração, liquidação e status
- [Contratos](./contratos/README.md) - Gestão de contratos
- [Terrenos](./terrenos/README.md) - Cadastro de terrenos
- [Desenvolvimento](./desenvolvimento/) - Veja a fase mais recente

---

## 📝 Notas para o Próximo Commit

- Documentação completa foi revisada
- Sem breaking changes nesta versão
- Todas as mudanças são retrocompatíveis
- Commit pode ser separado em múltiplos se necessário

---

**Próximos Passos Recomendados:**
1. Code review da implementação
2. Testes em ambiente de produção
3. Documentação de usuário final (se necessário)
4. Preparar release notes
