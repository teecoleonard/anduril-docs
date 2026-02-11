# Exportação

Geração de relatórios e exportação de dados em Excel.

## Guias Disponíveis
 
- [Como Gerar Exportação](./como-gerar-exportacao.md) - Como gerar relatório para exportação no Excel

## Principal caractéristicas

```mermaid
graph LR
    A["Selecionar<br/>Dados"] --> B["Configurar<br/>Relatório"]
    B --> C["Gerar<br/>Arquivo"]
    C --> D["Excel<br/>Criado"]
    D --> E["Salvar<br/>Arquivo"]
    E --> F["Compartilhar<br/>Dados"]
    
    style A fill:#e3f2fd
    style F fill:#e8f5e9
```

Funcionalidades principais:
- Gerar relatórios em Excel
- Exportar dados de contratos
- Exportar dados de clientes
- Exportar dados de boletos
- Exportar dados de terrenos
- Configurar pasta de destino
- Agendamento de exportações

## Tipos de Relatórios

### Por Módulo

```mermaid
graph TD
    A["Exportação"] --> B["Clientes"]
    A --> C["Contratos"]
    A --> D["Boletos"]
    A --> E["Terrenos"]
    A --> F["CNAB"]
    
    B --> B1["Lista Completa<br/>Contatos<br/>Por Status"]
    C --> C1["Contratos Ativos<br/>Com Reajustes"]
    D --> D1["Boletos Abertos<br/>Vencidos<br/>Pagos"]
    E --> E1["Terrenos<br/>Disponíveis<br/>Reservados"]
    F --> F1["Remessas<br/>Retornos<br/>Histórico"]
    
    style A fill:#fff9c4
```

## Privacidade de Dados

- Apenas dados autorizados são exportados
- Masks para CPF/CNPJ (opcional)
- Sem senhas ou dados confidenciais
- Logs de exportação registrados
- Conformidade com LGPD