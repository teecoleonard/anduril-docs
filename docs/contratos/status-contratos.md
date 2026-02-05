# Status dos Contratos

## Visão Geral

Os contratos possuem diferentes status ao longo do seu ciclo de vida.

## Estados Possíveis

| **Chave** | **Valor** | **Descrição** |
|-------------|----------------|------------------------|
| **ATIVO**       | ativo          | Contrato ativo         |
| **INATIVO**     | inativo        | Contrato inativo       |
| **CANCELADO**   | cancelado      | Contrato cancelado     |
| **FINALIZADO**  | finalizado     | Contrato finalizado    |
| **INADIMPLENTE**| inadimplente   | Contrato inadimplente  |
| **A_VENCER**    | a_vencer       | Contrato a vencer      |
| **VENCIDO**     | vencido        | Contrato vencido       |

## Diagrama de Contratos

### Modelo de Dados — ER Diagram

```mermaid
erDiagram
    CADASTRO_CONTRATUAL {
        int id PK
        string nome_completo
        string cpf_cnpj
        date data_cadastro
    }

    CONTRATO {
        int id PK
        string numero_contrato
        int cliente_id FK
        int terreno_id FK

        float valor_total
        float valor_entrada
        float saldo_financiado
        float valor_parcela
        float primeira_parcela

        int quantidade_parcelas
        int prazo
        int prazo_nominal
        date data_assinatura
        date data_vencimento
        int dia_do_vencimento

        float taxa
        float indice_de_reajuste
        date data_do_ultimo_reajuste

        float saldo_devedor

        string corretor
        boolean contrato_especial
        string status

        datetime created_at
        datetime updated_at
    }

    BOLETO {
        int id PK
        int contrato_id FK
        string numero_boleto
        float valor_parcela
        date data_vencimento
        string status
    }

    TERRENO {
        int id PK
        string status
        string endereco
        float area
        float preco
    }

    CADASTRO_CONTRATUAL ||--o{ CONTRATO : possui
    CONTRATO ||--o{ BOLETO : gera
    TERRENO ||--o{ CONTRATO : vinculado

```
---

### Fluxo de Estados — State Diagram

```mermaid
stateDiagram-v2
    [*] --> ATIVO : criação

    ATIVO --> INATIVO : pausar
    INATIVO --> ATIVO : reativar

    ATIVO --> A_VENCER : ≤ 30 dias
    A_VENCER --> VENCIDO : passou vencimento
    VENCIDO --> INADIMPLENTE : boletos > 7 dias

    ATIVO --> FINALIZADO : finalizado
    ATIVO --> CANCELADO : cancelamento/manual
    INADIMPLENTE --> CANCELADO : cancelamento/manual

    FINALIZADO --> [*]
    CANCELADO --> [*]

    %% DEFINIÇÃO DE CORES
    classDef ativo fill:#2ecc71,color:#ffffff,stroke:#1e8449
    classDef inativo fill:#f1c40f,color:#000000,stroke:#b7950b
    classDef aVencer fill:#3498db,color:#ffffff,stroke:#21618c
    classDef vencido fill:#e74c3c,color:#ffffff,stroke:#922b21
    classDef inadimplente fill:#9b59b6,color:#ffffff,stroke:#6c3483
    classDef encerrado fill:#2c3e50,color:#ffffff,stroke:#17202a

    %% APLICAÇÃO DAS CLASSES
    class ATIVO ativo
    class INATIVO inativo
    class A_VENCER aVencer
    class VENCIDO vencido
    class INADIMPLENTE inadimplente
    class FINALIZADO encerrado
    class CANCELADO encerrado

```
---

### Ciclo de Vida do Contrato — Flowchart

```mermaid
flowchart TD
    A[POST /contratos<br/>Criação] --> B{Validações}
    B -->|OK| C[Calcular valores e datas]
    C -->D[Atualiza terreno <br/>DISPONÍVEL → VENDIDO]
    D -->E[Contrato criado<br/>Status = ATIVO]

    E --> F[PATCH /contratos<br/>Gerenciamento]
    F -->|Status = CANCELADO| G[Libera terreno<br/>VENDIDO → DISPONÍVEL]

    E --> H[Consulta contrato]
    H --> I{Datas e boletos}
    I -->|Vencido| J[VENCIDO]
    I -->|30 dias| K[A_VENCER]
    I -->|Boletos > 7d| L[INADIMPLENTE]

    E --> M[POST /reajustar]
    M --> N[Atualiza parcelas futuras]

    E --> O[POST /sincronizar-saldo]
    O --> P[Recalcula saldo_devedor]

    E --> Q[DELETE /contratos]
    Q --> R{Tem boletos pagos?}
    R -->|Não| S[Excluir contrato<br/>Libera terreno]
```

**Guia anterior**: [Contratos](./index.md)
