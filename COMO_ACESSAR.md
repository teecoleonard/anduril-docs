# 🚀 COMO ACESSAR A NOVA DOCUMENTAÇÃO

## 📚 Localização da Documentação

Toda a documentação está organizada em:

```
📦 seu-projeto/
├── README.md                    ← Visão geral do ERP (ainda aqui)
└── 📁 docs/
    ├── INDEX.md                 ← 👈 COMECE AQUI!
    ├── RESUMO_REORGANIZACAO.md  ← Status da reorganização
    │
    └── 📁 [8 módulos + desenvolvimento]
        ├── README.md            ← Visão geral do módulo
        ├── como-fazer-X.md      ← Guias passo-a-passo
        ├── status-X.md          ← Status e ciclos
        └── [arquivos técnicos]
```

---

## 🎯 Entrada Rápida

### Para Usuários (Como usar o sistema)

**Abra este arquivo primeiro:**
👉 **[docs/INDEX.md](./docs/INDEX.md)**

Ele contém:
- Visão geral de todos os módulos
- Links para cada guia
- Referências rápidas
- Próximos passos

### Para Desenvolvedores

**Acesse a pasta de desenvolvimento:**
👉 **[docs/desenvolvimento/](./docs/desenvolvimento/)**

Lá você encontra:
- Análise técnica de soluções
- Processo de build
- Correções implementadas
- Logs e debug

---

## 📱 Navegação

### Opção 1: Começar pelo INDEX (Recomendado)

```
1. Abra: docs/INDEX.md
2. Escolha seu módulo:
   - Clientes
   - Contratos
   - Terrenos
   - Boletos
   - CNAB
   - Empresa
   - Exportação
   - Sistema
3. Clique no README do módulo
4. Siga os guias passo-a-passo
```

### Opção 2: Ir Direto ao Módulo

Se você sabe exatamente o que procura:

- **Cliente?** → `docs/clientes/`
- **Contrato?** → `docs/contratos/`
- **Terreno?** → `docs/terrenos/`
- **Boleto?** → `docs/boletos/`
- **CNAB/Remessa?** → `docs/cnab/`
- **Configuração Empresa?** → `docs/empresa/`
- **Exportar Relatório?** → `docs/exportacao/`
- **Backup/Sistema?** → `docs/sistema/`

### Opção 3: Procurar por Status

Entender como as coisas funcionam:

```
docs/
├── clientes/status-clientes.md
├── contratos/status-contratos.md
├── terrenos/status-terrenos.md
├── boletos/status-boletos.md
└── cnab/status-remessas.md
```

---

## 🗺️ Mapa de Documentos

```
docs/INDEX.md
├─ Clientes
│  ├─ como-registrar-cliente.md 📸
│  ├─ status-clientes.md
│  └─ [documentos técnicos]
│
├─ Contratos
│  ├─ como-gerar-contrato.md 📸
│  ├─ status-contratos.md
│  └─ [documentos técnicos]
│
├─ Terrenos
│  ├─ como-registrar-terreno.md 📸
│  ├─ status-terrenos.md
│  └─ [documentos técnicos]
│
├─ Boletos
│  ├─ como-gerar-boleto-contrato.md 📸
│  ├─ status-boletos.md
│  └─ [documentos técnicos]
│
├─ CNAB
│  ├─ como-gerar-remessa.md 📸
│  ├─ como-importar-retorno.md 📸
│  ├─ status-remessas.md
│  └─ [documentos técnicos]
│
├─ Empresa
│  ├─ como-configurar-empresa.md
│  └─ como-configurar-banco.md
│
├─ Exportação
│  ├─ como-gerar-relatorio.md
│  └─ como-configurar-pasta.md
│
├─ Sistema
│  └─ sistema-backup.md
│
└─ Desenvolvimento
   └─ [72 arquivos técnicos]
```

---

## 🎓 Exemplos de Uso

### Cenário 1: "Quero registrar um novo cliente"

1. Abra: `docs/INDEX.md`
2. Vá para: **Clientes**
3. Abra: `como-registrar-cliente.md`
4. Siga passo-a-passo
5. Consulte `status-clientes.md` se tiver dúvidas

**Tempo estimado:** 10-15 minutos

### Cenário 2: "Preciso gerar remessa CNAB"

1. Abra: `docs/INDEX.md`
2. Vá para: **CNAB**
3. Abra: `como-gerar-remessa.md`
4. Siga passo-a-passo
5. Consulte `status-remessas.md` para entender status

**Tempo estimado:** 20-25 minutos

### Cenário 3: "Entender ciclo de vida do terreno"

1. Abra: `docs/terrenos/status-terrenos.md`
2. Leia diagrama de transição
3. Consulte alertas para "Reservado > 7 dias"
4. Se precise gerar: `como-registrar-terreno.md`

**Tempo estimado:** 10 minutos

---

## 📸 Marcadores de Fotos

Você notará **[FOTO AQUI]** em vários locais nos guias.

**O que fazer:**
1. Tire screenshot do sistema
2. Salve em pasta (ex: `docs/img/`)
3. Referencie no markdown:
   ```markdown
   > ![Tela de Clientes](./img/tela-clientes.png)
   ```

**Locais onde adicionar fotos:**
- [ ] 6 fotos em Clientes
- [ ] 4 fotos em Contratos
- [ ] 5 fotos em Terrenos
- [ ] 4 fotos em Boletos
- [ ] 12 fotos em CNAB

**Total: ~30 fotos** (isso pode ser feito gradualmente)

---

## 🔍 Buscando Informações

### Por Tópico

**"Quero saber sobre..."**
- **Status** → Procure `status-X.md`
- **Como fazer** → Procure `como-Y.md`
- **Geral** → Procure `README.md`

### Por Módulo

Use a estrutura de pastas:
```
docs/
├── clientes/        ← Tudo sobre clientes
├── contratos/       ← Tudo sobre contratos
├── terrenos/        ← Tudo sobre terrenos
├── boletos/         ← Tudo sobre boletos
├── cnab/            ← Tudo sobre bancário
└── ...
```

### Busca Global

Se usar VS Code ou GitHub:
- `Ctrl+Shift+F` (VS Code) para buscar em pasta
- Procure por palavras-chave (ex: "status", "alerta", "rejeição")

---

## 💡 Dicas de Navegação

### ✅ Use Índices
- `docs/INDEX.md` para visão geral
- `docs/RESUMO_REORGANIZACAO.md` para estatísticas

### ✅ Siga Links
- Clique em links entre documentos
- Cada guia aponta para próximos passos

### ✅ Leia Status Primeiro
- Antes de usar, entenda status
- Evita confusões depois

### ✅ Consulte Exemplos
- Cada status tem "casos de uso"
- Leia para seu cenário

### ✅ Mantenha Aberto
- Guarde `docs/INDEX.md` como favorito
- Referência rápida quando precisar

---

## 🚀 Próximos Passos

### Hoje
- [ ] Abra `docs/INDEX.md`
- [ ] Explore a estrutura
- [ ] Clique em alguns links

### Esta Semana
- [ ] Revise guias principais
- [ ] Valide com seu time
- [ ] Sugira ajustes

### Próximas Semanas
- [ ] Adicione fotos/screenshots
- [ ] Teste todos os links
- [ ] Publique versão final

---

## 📞 Feedback

Se encontrar:
- ❌ Conteúdo incorreto
- ❌ Links quebrados
- ❌ Informações faltando
- ❌ Dúvidas não respondidas

**Anote e comunique para ajustar.**

---

## 📊 Resumo da Estrutura

| Elemento | Local | Conteúdo |
|----------|-------|----------|
| **Visão Geral do Projeto** | `/README.md` | O que é ERP Anduril |
| **Índice Principal** | `/docs/INDEX.md` | Navegação de tudo |
| **Módulos (8 pastas)** | `/docs/[modulo]/` | README, guias, status |
| **Desenvolvimento** | `/docs/desenvolvimento/` | Contexto técnico |
| **Resumo** | `/docs/RESUMO_REORGANIZACAO.md` | Estatísticas |
| **Este Arquivo** | `/docs/COMO_ACESSAR.md` | Como navegar |

---

## 🎯 Guia Rápido

```
Não sabe por onde começar?
    ↓
Abra: docs/INDEX.md
    ↓
Escolha seu módulo
    ↓
Leia o README do módulo
    ↓
Siga o guia passo-a-passo
    ↓
Consulte Status se tiver dúvidas
    ↓
Pronto! ✅
```

---

**Boa leitura! 📚**

*Última atualização: Fevereiro 2026*
