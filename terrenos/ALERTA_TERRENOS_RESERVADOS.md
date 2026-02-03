# 🚨 Alerta de Terrenos Reservados

## 📋 Visão Geral

Sistema de alerta que identifica terrenos com status "reservado" há mais de 7 dias, baseado na data de atualização (`updated_at`) do status.

## 🎯 Objetivo

Notificar quando um terreno permanece reservado por mais de 7 dias, permitindo que o usuário tome ações como:
- Verificar se a reserva ainda é válida
- Liberar o terreno para disponível
- Contatar o cliente sobre a reserva

## ✅ Implementação

### Backend

#### Endpoint

```
GET /terrenos/alertas/reservados
```

#### Resposta

```json
[
  {
    "id": 1,
    "codigo": "TER-001",
    "descricao": "Terreno Centro",
    "lote": "L-10",
    "quadra": "Q-05",
    "area": 300,
    "logradouro": "Rua das Flores, 123",
    "preco": 55000,
    "status": "reservado",
    "created_at": "2025-01-01T10:00:00",
    "updated_at": "2025-01-05T14:30:00",
    "diasReservado": 8
  },
  {
    "id": 2,
    "codigo": "TER-002",
    "descricao": "Terreno Jardim",
    "status": "reservado",
    "updated_at": "2025-01-03T09:00:00",
    "diasReservado": 10
  }
]
```

#### Campos Retornados

- **Todos os campos do terreno** (id, codigo, descricao, lote, quadra, area, logradouro, preco, etc.)
- **`diasReservado`**: Número de dias desde que o terreno foi marcado como reservado (baseado em `updated_at`)

### Lógica de Cálculo

O sistema calcula os dias usando a função SQLite `julianday()`:

```sql
CAST(julianday('now') - julianday(updated_at) AS INTEGER) as diasReservado
```

**Critério de seleção**:
- Status = `'reservado'`
- `updated_at <= datetime('now', '-7 days')` (atualizado há 7 ou mais dias)

**Ordenação**: Por `updated_at` ASC (mais antigos primeiro)

## 📝 Como Funciona

1. **Quando o status é atualizado para "reservado"**:
   - O campo `updated_at` é atualizado automaticamente para a data/hora atual
   - Isso marca o início do período de reserva

2. **Após 7 dias**:
   - O terreno aparece no endpoint de alertas
   - O campo `diasReservado` mostra quantos dias se passaram

3. **Exemplo**:
   - Terreno reservado em: `2025-01-05 14:30:00`
   - Data atual: `2025-01-13 10:00:00`
   - Dias reservado: **8 dias**
   - Aparece no alerta: ✅ Sim (8 > 7)

## 🔧 Uso no Frontend

### Exemplo de Integração

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// Hook para buscar alertas
const useTerrenosReservadosAlerta = () => {
  return useQuery({
    queryKey: ['terrenos', 'alertas', 'reservados'],
    queryFn: async () => {
      const response = await api.get('/terrenos/alertas/reservados');
      return response.data;
    },
    refetchInterval: 60000, // Atualizar a cada 1 minuto
  });
};

// Componente de alerta
const AlertaTerrenosReservados = () => {
  const { data: terrenos, isLoading } = useTerrenosReservadosAlerta();
  const { warning } = useNotification();

  useEffect(() => {
    if (terrenos && terrenos.length > 0) {
      warning(
        `⚠️ ${terrenos.length} terreno(s) reservado(s) há mais de 7 dias`,
        `Verifique os terrenos: ${terrenos.map(t => t.codigo).join(', ')}`
      );
    }
  }, [terrenos, warning]);

  if (isLoading) return <div>Carregando alertas...</div>;
  if (!terrenos || terrenos.length === 0) return null;

  return (
    <div className="alertas-terrenos">
      <h3>⚠️ Terrenos Reservados há mais de 7 dias</h3>
      <ul>
        {terrenos.map(terreno => (
          <li key={terreno.id}>
            {terreno.codigo} - {terreno.diasReservado} dias reservado
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## 📊 Casos de Uso

### 1. Dashboard
- Exibir card com quantidade de terrenos reservados há mais de 7 dias
- Link para página de terrenos com filtro aplicado

### 2. Página de Terrenos
- Badge/indicador visual nos terrenos que estão no alerta
- Filtro para mostrar apenas terrenos em alerta

### 3. Notificação Automática
- Verificar periodicamente (ex: a cada 1 minuto)
- Exibir notificação toast quando houver novos alertas

## ⚙️ Configuração Futura (Opcional)

Para tornar o período configurável, pode-se adicionar:

```typescript
// Variável de ambiente
ALERTA_TERRENO_RESERVADO_DIAS=7

// No service
const diasAlerta = parseInt(process.env.ALERTA_TERRENO_RESERVADO_DIAS || '7', 10);
```

## ✅ Status da Implementação

- ✅ Endpoint criado: `GET /terrenos/alertas/reservados`
- ✅ Método no service: `buscarTerrenosReservadosAlerta()`
- ✅ Cálculo de dias baseado em `updated_at`
- ✅ Filtro para terrenos reservados há mais de 7 dias
- ✅ Ordenação por data (mais antigos primeiro)
- ✅ Campo `diasReservado` incluído na resposta

## 📝 Notas Importantes

1. **Baseado em `updated_at`**: O cálculo usa a data de atualização do registro, que é atualizada quando o status muda para "reservado"

2. **Precisão**: O cálculo usa `julianday()` do SQLite, que é preciso para diferenças de dias

3. **Performance**: A query é otimizada com índice no campo `status` (se existir)

4. **Futuras melhorias**:
   - Adicionar campo específico `data_reserva` para maior precisão
   - Criar cron job para notificações automáticas
   - Adicionar configuração de período de alerta

---

**Última atualização**: Janeiro 2025
