import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "ERP Anduril",
  description: "Documentação Completa do Sistema ERP Anduril",
  lang: 'pt-BR',
  base: '/anduril-docs/', // Ajuste se repo tem nome diferente
  
  themeConfig: {
    logo: '📦',
    
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Módulos', items: [
        { text: 'Clientes', link: '/clientes/' },
        { text: 'Contratos', link: '/contratos/' },
        { text: 'Terrenos', link: '/terrenos/' },
        { text: 'Boletos', link: '/boletos/' },
        { text: 'CNAB', link: '/cnab/' },
        { text: 'Empresa', link: '/empresa/' },
        { text: 'Exportação', link: '/exportacao/' },
        { text: 'Sistema', link: '/sistema/' },
      ]},
      { text: 'Desenvolvimento', link: '/desenvolvimento/' },
    ],

    sidebar: {
      '/clientes/': [
        {
          text: 'Clientes',
          items: [
            { text: 'Visão Geral', link: '/clientes/' },
            { text: 'Como Registrar Cliente', link: '/clientes/como-registrar-cliente' },
            { text: 'Status dos Clientes', link: '/clientes/status-clientes' },
          ]
        }
      ],
      '/contratos/': [
        {
          text: 'Contratos',
          items: [
            { text: 'Visão Geral', link: '/contratos/' },
            { text: 'Como Gerar Contrato', link: '/contratos/como-gerar-contrato' },
            { text: 'Status dos Contratos', link: '/contratos/status-contratos' },
            { text: 'Datas de Vencimento', link: '/contratos/ANALISE_DATAS_VENCIMENTO_REAJUSTE' },
          ]
        }
      ],
      '/terrenos/': [
        {
          text: 'Terrenos',
          items: [
            { text: 'Visão Geral', link: '/terrenos/' },
            { text: 'Como Registrar Terreno', link: '/terrenos/como-registrar-terreno' },
            { text: 'Status dos Terrenos', link: '/terrenos/status-terrenos' },
          ]
        }
      ],
      '/boletos/': [
        {
          text: 'Boletos',
          items: [
            { text: 'Visão Geral', link: '/boletos/' },
            { text: 'Como Gerar Boleto', link: '/boletos/como-gerar-boleto-contrato' },
            { text: 'Status dos Boletos', link: '/boletos/status-boletos' },
          ]
        }
      ],
      '/cnab/': [
        {
          text: 'CNAB',
          items: [
            { text: 'Visão Geral', link: '/cnab/' },
            { text: 'Como Gerar Remessa', link: '/cnab/como-gerar-remessa' },
            { text: 'Como Importar Retorno', link: '/cnab/como-importar-retorno' },
            { text: 'Status das Remessas', link: '/cnab/status-remessas' },
          ]
        }
      ],
      '/empresa/': [
        {
          text: 'Empresa',
          items: [
            { text: 'Visão Geral', link: '/empresa/' },
          ]
        }
      ],
      '/exportacao/': [
        {
          text: 'Exportação',
          items: [
            { text: 'Visão Geral', link: '/exportacao/' },
          ]
        }
      ],
      '/sistema/': [
        {
          text: 'Sistema',
          items: [
            { text: 'Visão Geral', link: '/sistema/' },
          ]
        }
      ],
      '/desenvolvimento/': [
        {
          text: 'Desenvolvimento',
          items: [
            { text: 'Índice Completo', link: '/desenvolvimento/' },
            { text: 'Fases de Desenvolvimento', link: '/desenvolvimento/FASES-DESENVOLVIMENTO' },
            { text: 'Build & Deploy', link: '/desenvolvimento/BUILD_FIX_SUMMARY' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: 'ERP Anduril © 2026',
      copyright: 'Documentação completa e atualizada'
    }
  }
})
