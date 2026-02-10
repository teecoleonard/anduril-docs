# Contratos

Gestão completa de contratos e sua relação com clientes.

## Guias Disponíveis

- [Como Gerar Contrato](./como-gerar-contrato.md) - Passo a passo para criar novo contrato
- [Status dos Contratos](./status-contratos.md) - Estados e validações dos contratos
- [Datas de Vencimento e Reajuste](./ANALISE_DATAS_VENCIMENTO_REAJUSTE.md) - Análise de datas
- [Sistema de Reajustes](./reajustes/) - Sincronização e reajustes automáticos

## Principais Características

```mermaid
graph LR
    A["Gerar<br/>Contrato"] --> B["Editar<br/>Contrato"]
    B --> C["Gerar<br/>Boletos"]
    C --> D["Acompanhar<br/>Vencimentos"]
    D --> E["Aplicar<br/>Reajuste"]
    E --> F["Sincronizar<br/>Saldo"]
    
    style A fill:#e3f2fd
    style F fill:#e8f5e9
```

Funcionalidades principais:
- Gerar novos contratos
- Editar contratos existentes
- Acompanhar vencimentos
- Processar reajustes automáticos
- Sincronizar saldo devedor
- Vincular contratos a clientes

## Relacionamentos

```mermaid
graph TD
    A["Contrato"] --> C["Cliente"]
    A --> B["Boletos"]
    C --> D["CNAB"]
    B --> D["CNAB"]
    D --> E["Banco"]
    E --> F["Retorno"]
    F --> G["Atualização<br/>Automática"]
    
    style A fill:#fff9c4
    style G fill:#e8f5e9

```

## Principais Recursos

### Sistema de Reajustes (🆕)
- Aplicação automática de reajustes anuais
- Sincronização de saldo devedor
- Cálculos determinísticos e auditáveis
- **[Saiba mais sobre reajustes →](./reajustes/README.md)**

##  Explore

1. **Novo contrato?** → [Como Gerar Contrato](./como-gerar-contrato.md)
2. **Precisa reajustar?** → [Sistema de Reajustes](./reajustes/README.md)
3. **Dúvida sobre status?** → [Status dos Contratos](./status-contratos.md)
