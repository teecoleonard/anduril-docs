# Arquitetura - Sistema de Reajustes

## Visão Geral

O sistema de reajustes permite que contratos atualizem o valor de parcelas futuras enquanto preserva boletos já gerados. A arquitetura garante consistência entre múltiplas visões dos dados: contrato, boletos e remessas CNAB.

### Diagrama de Fluxo Principal

```mermaid
flowchart TD
    A["Usuário Solicita Reajuste"] -->|Define: Índice %| B["⚙️ API: POST /reajustes"]
    B --> C{"Validações"}
    C -->|ID inválido| D["❌ Erro 404"]
    C -->|Índice inválido| E["❌ Erro 400"]
    C -->|OK| F["Atualizar valor_parcela"]
    
    F --> G["valor_parcela = novo_valor"]
    G --> H["Registrar indice_de_reajuste"]
    H --> I["data_do_ultimo_reajuste = Data atual"]
    I --> J["Recalcular saldo_devedor"]
    J --> K["Retornar contrato atualizado"]
    
    style A fill:#e1f5ff
    style F fill:#fff3e0
    style G fill:#f3e5f5
    style K fill:#e8f5e9
```

## Diagrama de Entidades

```mermaid
erDiagram
    CONTRATO ||--o{ BOLETO : gera
    CONTRATO ||--o{ REAJUSTE : sofre
    BOLETO ||--o{ REMESSA_CNAB : vincula
    
    CONTRATO {
        int id PK
        string numero_contrato UK
        decimal valor_parcela "Valor de próxima parcela"
        decimal saldo_devedor "SUM(boletos abertos)"
        int quantidade_parcelas
        int numero_parcela_atual
        int indice_de_reajuste "% do último reajuste"
        date data_do_ultimo_reajuste
        string status "ativo|cancelado|finalizado"
    }
    
    BOLETO {
        int id PK
        int contrato_id FK
        int numero_parcela
        decimal valor_parcela "Fixo quando criado"
        string status "aberto|liquidado|cancelado"
        date data_vencimento
        date data_criacao
    }
    
    REAJUSTE {
        int id PK
        int contrato_id FK
        int indice_percentual
        decimal valor_anterior
        decimal valor_novo
        date data_aplicacao
    }
    
    REMESSA_CNAB {
        int id PK
        int boleto_id FK
        string codigo_retorno
        date data_processamento
    }
```

## Fluxo: Geração de Próximas Parcelas Após Reajuste

```mermaid
sequenceDiagram
    participant User
    participant API
    participant DB as Database
    
    User->>API: POST /gerar-boletos/{contratoId}
    API->>DB: SELECT contrato WHERE id = ?
    DB-->>API: valor_parcela=3666.66
    
    loop Para cada parcela a gerar
        API->>API: Calcular datas de vencimento
        API->>DB: INSERT boleto (valor_parcela=3666.66)
        DB-->>API: ✓ Boleto criado
    end
    
    API->>DB: SELECT SUM(valor_parcela) FROM boletos WHERE status='aberto'
    DB-->>API: 39999.92
    API->>DB: UPDATE contrato SET saldo_devedor=39999.92
    DB-->>API: ✓ Saldo atualizado
    
    API-->>User: { boletos: [...], saldo_devedor: 39999.92 }
```

## Integração com Outras Features

### A. Geração de Boletos

```
Contrato
├─ valor_parcela: 3.333,33 (Ano 1)
├─ Boletos 1-6: cada um recebe 3.333,33
├───↓ REAJUSTE +10%
├─ valor_parcela: 3.666,66 (Ano 2)
└─ Boletos 7-12: cada um recebe 3.666,66
```

### B. CNAB (Geração de Remessas)

A remessa CNAB usa os valores que estão nos boletos (não são reajustados retroativamente):

```
Remessa incluindo Boletos 1-6:
  Segmento P (boleto 1): 3.333,33
  Segmento P (boleto 2): 3.333,33
  Segmento P (boleto 3): 3.333,33
  Segmento P (boleto 4): 3.333,33
  Segmento P (boleto 5): 3.333,33
  Segmento P (boleto 6): 3.333,33
  ─────────────────────
  Soma: 19.999,98
```

### C. Liquidação de Boletos

```
Boleto liquidado → saldo_devedor é recalculado automaticamente
  Antes: saldo_devedor = 19.999,98 (6 × 3.333,33)
  Liquidar boleto 1
  Depois: saldo_devedor = 16.666,65 (5 × 3.333,33) ✅
```

## Casos de Erro Tratados

| Caso | Validação | Resposta |
|------|-----------|----------|
| Contrato não existe | `contratoId não encontrado` | 404 Not Found |
| Contrato cancelado | `status != 'ativo'` | 403 Forbidden |
| Índice não é número | `isNaN(indice)` | 400 Bad Request |
| Índice < 0 ou > 100 | `indice < 0 OR indice > 100` | 400 Bad Request |
| Novo valor = 0 | `calculado <= 0` | 403 Forbidden |
| Erro no banco | Transaction falha | 500 Internal Server Error |
