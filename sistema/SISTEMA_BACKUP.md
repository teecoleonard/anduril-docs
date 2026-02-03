# 💾 Sistema de Backup - Guia Completo

## 📋 Visão Geral

O sistema de backup do ERP Anduril é **automático, simples e seguro**. Funciona de forma transparente para o usuário, criando backups antes de operações críticas e permitindo restauração fácil quando necessário.

---

## ✨ Características

- ✅ **Backup Automático**: Antes de operações críticas (CNAB, retorno)
- ✅ **Backup Agendado**: Diário às 18:00 (UTC-3)
- ✅ **Backup Manual**: Via interface ou API
- ✅ **Async IO**: Operações não-bloqueantes (UI sempre responsiva)
- ✅ **Limpeza Automática**: Mantém apenas os 7 backups mais recentes
- ✅ **Sem Autenticação**: Aplicação local não requer senha

---

## 🚀 Como Usar

### Via Interface

#### Criar Backup Manual
```
Menu → 🔧 Admin → 💾 Fazer Backup Agora → ✅ Sucesso!
```

#### Listar Backups
```
Menu → 🔧 Admin → 📋 Histórico de Backups
```

#### Restaurar Backup
```
Menu → 🔧 Admin → 📋 Histórico
→ Selecionar backup
→ 🔄 Restaurar Backup Selecionado
→ Confirmar dialog
→ Aplicativo recarrega em 3 segundos
```

### Via API

#### Criar Backup Manual
```bash
curl -X POST http://localhost:3000/backup/manual
```

**Resposta:**
```json
{
  "success": true,
  "message": "Backup criado com sucesso",
  "data": {
    "nome": "database-backup-13-01-2026T18-00-45.sqlite",
    "tamanho": 188416
  }
}
```

#### Listar Backups
```bash
curl http://localhost:3000/backup/listar
```

**Resposta:**
```json
{
  "success": true,
  "backups": [
    {
      "nome": "database-backup-13-01-2026T18-00-45.sqlite",
      "dataCriacao": "2026-01-13T18:00:45.000Z",
      "dataFormatada": "13-01-2026T18:00:45",
      "tamanho": 188416
    }
  ]
}
```

#### Restaurar Backup
```bash
curl -X POST http://localhost:3000/backup/restaurar \
  -H "Content-Type: application/json" \
  -d '{"nome": "database-backup-13-01-2026T18-00-45.sqlite"}'
```

**Resposta:**
```json
{
  "success": true,
  "message": "Backup restaurado com sucesso",
  "data": {
    "backupRestaurado": "database-backup-13-01-2026T18-00-45.sqlite",
    "backupAtual": "database.sqlite.pre-restore-1768310322984.backup"
  }
}
```

---

## ⚙️ Funcionamento Automático

### Backup Antes de Operações Críticas

O sistema cria backup automaticamente antes de:
- ✅ Gerar remessa CNAB
- ✅ Processar retorno CNAB
- ✅ Qualquer operação que modifique dados críticos

**O usuário não precisa fazer nada** - tudo é automático e transparente.

### Backup Agendado

- **Horário**: 18:00 (6h da tarde) - UTC-3 (São Paulo)
- **Frequência**: Diário
- **Ação**: Cria backup e limpa backups antigos (mantém 7 dias)

---

## 📂 Localização dos Backups

### Desenvolvimento
```
backend/backups/
```

### Produção
```
~\AppData\Roaming\erp-anduril\backups\
```

---

## 🔄 Histórico de Mudanças (v2.0)

### O Que Mudou na v2.0

1. **Removida Autenticação por Senha**
   - Endpoints agora são públicos (sem senha)
   - Simplificação para aplicação local

2. **Rotas Simplificadas**
   - `/backup/manual` (criar backup)
   - `/backup/listar` (listar backups)
   - `/backup/restaurar` (restaurar backup)

3. **Horário do Backup Agendado**
   - Antes: 02:00 (madrugada)
   - Agora: 18:00 (fim de expediente)

4. **Async IO**
   - Todas as operações de arquivo são assíncronas
   - UI não trava durante backups grandes

---

## 🔧 Configuração

### Variáveis de Ambiente

Nenhuma configuração necessária! O sistema funciona automaticamente.

### Limpeza Automática

O sistema mantém automaticamente apenas os **7 backups mais recentes**. Backups mais antigos são removidos automaticamente.

---

## 📊 Estrutura Técnica

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/backup/manual` | Criar backup manual |
| GET | `/backup/listar` | Listar backups disponíveis |
| POST | `/backup/restaurar` | Restaurar um backup específico |

### Arquivos Principais

- `backend/src/backup/backup.service.ts` - Lógica de backup
- `backend/src/backup/backup.controller.ts` - Endpoints REST
- `backend/src/backup/backup.module.ts` - Módulo NestJS

---

## ⚠️ Importante

- **Aplicação Local**: Endpoints são públicos porque a aplicação é local (Electron desktop)
- **NUNCA** exponha esses endpoints em rede pública sem autenticação adequada
- Backups são criados automaticamente - não é necessário criar manualmente na maioria dos casos
- Restauração requer reinicialização do aplicativo

---

**Última atualização**: Janeiro 2025  
**Versão**: 2.0
