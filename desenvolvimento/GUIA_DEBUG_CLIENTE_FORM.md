# 📋 Guia de Debug - ClienteForm com Logs Detalhados

## 🎯 O Que Foi Adicionado

Foram adicionados logs estratégicos e um painel de debug visual no formulário de cliente para ajudar a diagnosticar problemas.

## 📊 Painel de Debug Visual

Na parte inferior do formulário de cliente, há um painel colapsável `🐛 Debug - Estado do Formulário` que mostra:

```
MODO: CRIAÇÃO ou EDIÇÃO
ID: (ID do cliente se em edição)
isDirty: ✓ COM MUDANÇAS ou ✗ SEM MUDANÇAS
isLoading: ⏳ SALVANDO ou ✓ PRONTO
temErros: ⚠️ X erro(s) ou ✓ SEM ERROS
errosListados: Lista dos primeiros 5 erros
nomeCompletoAtual: Valor do campo
cpfCnpjAtual: Valor do campo
emailAtual: Valor do campo
```

## 🔍 Console Logs Adicionados

### **NOVO** - Logs de Clique e Mudança em Inputs

Quando o usuário interage com os inputs principais, são registrados logs:

**Ao Clicar em um Input**:
```
[ClienteForm] Input clicado: nome_completo
[ClienteForm] Input clicado: cpf_cnpj
[ClienteForm] Input clicado: email
(etc.)
```

**Ao Digitar/Mudar Valor**:
```
[ClienteForm] Valor mudou: nome_completo "João da Silva"
[ClienteForm] Valor mudou: cpf_cnpj "123.456.789-00"
[ClienteForm] Valor mudou: email "joao@example.com"
```

**Ao Focar no Input** (clicar):
```
[ClienteForm] Input focado: nome_completo
```

**Ao Sair do Input** (blur):
```
[ClienteForm] Input saiu do foco: nome_completo
```

**Inputs com Logs**:
- ✓ Nome Completo
- ✓ CPF/CNPJ
- ✓ RG
- ✓ Data de Nascimento
- ✓ Estado Civil
- ✓ Nacionalidade
- ✓ Naturalidade
- ✓ Profissão
- ✓ Endereço Completo
- ✓ Bairro
- ✓ Cidade
- ✓ UF
- ✓ CEP (com log especial ao sair do foco: "buscando endereço...")
- ✓ Email
- ✓ Telefone

**Uso**: Rastrear exatamente quando o usuário interage com os campos e em que ordem

---

### 1. Quando o Componente Monta
```
[ClienteForm] Componente montado {
  clienteId: (número ou undefined),
  clienteNome: (nome ou undefined),
  modo: "criação" ou "edição"
}
```

**Quando Aparece**: Logo ao abrir o formulário
**Uso**: Verificar se o formulário está em modo correto

---

### 2. Quando o Componente Desmonta
```
[ClienteForm] Componente desmontado
```

**Quando Aparece**: Ao fechar o modal ou sair do formulário
**Uso**: Verificar cleanup adequado

---

### 3. Ao Preparar Valores Padrão
```
[ClienteForm] Preparando defaultValues para edição {
  clienteId: 123,
  nomeCompleto: "João da Silva"
}
```

**Quando Aparece**: Quando carregando dados do cliente (edição)
**Uso**: Confirmar que dados do cliente foram carregados corretamente

---

### 4. Ao Fazer Reset do Formulário
```
[ClienteForm] Reset chamado com defaultValues {
  temDados: true ou false,
  isDirty: true ou false,
  campos: 65 (número de campos)
}
```

**Quando Aparece**: Após receber novos dados
**Uso**: Verificar se o reset está limpando as mudanças

---

### 5. Mudança no Estado isDirty
```
[ClienteForm] Estado isDirty mudou {
  isDirty: true ou false,
  clienteId: 123
}
```

**Quando Aparece**: Toda vez que usuário faz/desfaz mudança
**Uso**: Rastrear quando o modal deve mostrar aviso de dados não salvos

---

### 6. Busca de CEP
```
[ClienteForm] Buscando CEP { cepValue: "01310100" }
```

Após sucesso:
```
[ClienteForm] CEP encontrado, preenchendo endereço {
  logradouro: "Avenida Paulista",
  cidade: "São Paulo"
}
```

Se falhar:
```
[ClienteForm] CEP não encontrado na API { cepValue: "00000000" }
```

**Uso**: Debugar problemas com busca de CEP

---

### 7. Antes de Submeter (MAIS IMPORTANTE!)
```
[ClienteForm] Formulário submetido {
  clienteId: 123,
  modo: "edição",
  isDirty: true,
  temErros: false,
  errosDetalhados: {},
  dataLength: 65
}
```

**Quando Aparece**: Ao clicar em "Salvar" ou "Atualizar"
**Uso**: ✅ **VERIFIQUE ISTO PRIMEIRO** - Mostra se há erros de validação

---

### 8. Chamando onSubmit com Dados
```
[ClienteForm] Chamando onSubmit com dados: {
  nomeCompleto: "João da Silva",
  cpfCnpj: "123.456.789-00",
  email: "joao@example.com"
}
```

**Quando Aparece**: Logo antes de enviar os dados ao backend
**Uso**: Verificar quais dados estão sendo enviados

---

### 9. Após Sucesso
```
[ClienteForm] onSubmit concluído com sucesso {
  clienteId: 123,
  resultado: (resposta do backend)
}
```

**Quando Aparece**: Após backend responder com sucesso
**Uso**: Confirmar que salvamento foi bem-sucedido

---

### 10. Se Houver Erro
```
[ClienteForm] Erro ao submeter formulário: {
  erro: Error(...),
  mensagem: "Erro ao criar cliente",
  stack: (rastreamento de pilha)
}
```

**Quando Aparece**: Se houver erro durante salvamento
**Uso**: **CRÍTICO** - Mostra exatamente qual foi o erro

---

## 🚀 Como Usar Para Debugar

### Rastrear Interações do Usuário

Se o problema é que o usuário não consegue digitar ou não consegue mudar valores:

1. Abra Developer Tools (F12)
2. Vá para Console
3. Tente clicar em um input
4. Procure por `[ClienteForm] Input clicado: nome_completo`
5. Tente digitar algo
6. Procure por `[ClienteForm] Valor mudou: nome_completo`
7. Se NÃO aparecer o log de "Valor mudou", significa que o onChange não foi disparado
8. Isso indicaria um problema com o formulário estar congelado

**Exemplo de Logs Normais ao Digitar Nome**:
```
[ClienteForm] Input clicado: nome_completo
[ClienteForm] Input focado: nome_completo
[ClienteForm] Valor mudou: nome_completo "J"
[ClienteForm] Valor mudou: nome_completo "Jo"
[ClienteForm] Valor mudou: nome_completo "Joa"
[ClienteForm] Valor mudou: nome_completo "João"
```

**Se Parecer Assim** (faltam "Valor mudou"):
```
[ClienteForm] Input clicado: nome_completo
[ClienteForm] Input focado: nome_completo
(não aparece "Valor mudou")
```
Isso significa que o formulário está **bloqueado** e precisa ser investigado.

---

### Rastrear Busca de CEP

Se o CEP não busca o endereço:

1. Digite um CEP válido (ex: 01310-100)
2. Clique fora do input (blur)
3. Procure por estes logs em ordem:
   ```
   [ClienteForm] Input saiu do foco: cep, buscando endereço...
   [ClienteForm] Buscando CEP { cepValue: "01310-100" }
   [ClienteForm] CEP encontrado, preenchendo endereço {
     logradouro: "Avenida Paulista",
     cidade: "São Paulo"
   }
   ```
4. Se não aparecer "CEP encontrado":
   ```
   [ClienteForm] CEP não encontrado na API { cepValue: "12345-678" }
   ```
5. Se não aparecer nenhum dos dois, há um problema na requisição à API

---

### Passo 1: Abrir Developer Tools
Pressione **F12** no navegador e vá para a aba **Console**

### Passo 2: Reproduzir o Problema
1. Abra "Novo Cliente"
2. Preencha alguns campos
3. Tente salvar
4. Observe os logs no console

### Passo 3: Procurar Problemas

| Problema | O Que Procurar |
|----------|--------|
| Cliente não carrega em edição | Procure por `[ClienteForm] Preparando defaultValues` |
| Não consigo salvar | Procure por `[ClienteForm] Formulário submetido` e cheque `temErros` |
| Dados não aparecem | Procure por `[ClienteForm] Reset chamado` |
| CEP não busca | Procure por `[ClienteForm] Buscando CEP` e depois `CEP não encontrado` |
| Erro "conteúdo será perdido" | Procure por `[ClienteForm] Estado isDirty mudou` |

### Passo 4: Copiar os Logs
Clique direito no console → **Copy entire output** → Cole em um documento

## 📝 Exemplo de Logs Para Erro Better-SQLite3

Se o erro for no backend (como o NODE_MODULE_VERSION), você verá:

```
[ClienteForm] Chamando onSubmit com dados: {
  nomeCompleto: "João da Silva",
  cpfCnpj: "123.456.789-00",
  email: "joao@example.com"
}

[ClienteForm] Erro ao submeter formulário: {
  erro: Error(...),
  mensagem: "Error 500 - Internal Server Error" ou similar,
  stack: (...)
}
```

Neste caso, **o problema está no backend**, não no frontend.

## 🎯 Debug Panel (Painel Visual)

Clique em `🐛 Debug - Estado do Formulário` para ver:

```
MODO: CRIAÇÃO
isDirty: ✗ SEM MUDANÇAS
isLoading: ✓ PRONTO
temErros: ✓ SEM ERROS
nomeCompletoAtual: (vazio)
cpfCnpjAtual: (vazio)
emailAtual: (vazio)
```

Este painel **atualiza em tempo real** enquanto você digita!

## ⚠️ Nota Importante

Estes logs são **apenas para desenvolvimento**. Em produção, você pode:
1. Remover o painel de debug visual (div com `🐛 Debug`)
2. Manter os console.logs ou remover também

Para agora, deixar habilitado para ajudar a diagnosticar o problema com better-sqlite3.

---

## 📊 Checklist de Teste

Ao testar, use este checklist:

- [ ] Abri formulário de criar cliente
- [ ] Verifiquei que logs mostram `modo: "criação"`
- [ ] Preenchi nome, CPF e email
- [ ] Verifiquei que `isDirty: true` no painel
- [ ] Cliquei em "Criar"
- [ ] Procurei por `[ClienteForm] Formulário submetido` no console
- [ ] Se erro: procurei por `[ClienteForm] Erro ao submeter formulário`
- [ ] Copiei os logs para análise

---

## 🔧 Se Precisar de Mais Debug

Você pode adicionar `console.log` antes de chamar API usando:

```typescript
console.log('[ClienteForm] Dados enviados:', JSON.stringify(data, null, 2));
```

Ou adicionar interceptor no serviço de API para logar requisições/respostas.
