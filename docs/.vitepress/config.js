import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Anduril Docs',
  description: 'Documentação do Sistema ERP Anduril',
  lang: 'pt-BR',
  base: '/anduril-docs/',
  
  vite: {
    server: {
      port: 8080,
      host: true
    }
  },
  
  markdown: {
    image: {
      lazyLoading: true
    }
  },
  
  themeConfig: {
    logo: '📚',
    siteTitle: 'Anduril',
    
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Documentação',
        items: [
          { text: '👥 Clientes', link: '/clientes/' },
          { text: '📋 Contratos', link: '/contratos/' },
          { text: '🏠 Terrenos', link: '/terrenos/' },
          { text: '💳 Boletos', link: '/boletos/' },
          { text: '🏦 CNAB', link: '/cnab/' },
          { text: '🏢 Empresa', link: '/empresa/' },
          { text: '📊 Exportação', link: '/exportacao/' },
          { text: '⚙️ Sistema', link: '/sistema/' },
          { text: '🛠️ Desenvolvimento', link: '/desenvolvimento/' }
        ]
      }
    ],

    sidebar: {
      '/clientes/': [
        {
          text: 'Clientes',
          items: [
            { text: 'Visão Geral', link: '/clientes/' },
            { text: 'Como Registrar Cliente', link: '/clientes/como-registrar-cliente' },
            { text: 'Status de Clientes', link: '/clientes/status-clientes' }
          ]
        }
      ],
      '/contratos/': [
        {
          text: 'Contratos',
          items: [
            { text: 'Visão Geral', link: '/contratos/' },
            { text: 'Como Gerar Contrato', link: '/contratos/como-gerar-contrato' },
            { text: 'Status de Contratos', link: '/contratos/status-contratos' },
            { text: 'Análise de Datas de Vencimento', link: '/contratos/ANALISE_DATAS_VENCIMENTO_REAJUSTE' }
          ]
        }
      ],
      '/terrenos/': [
        {
          text: 'Terrenos',
          items: [
            { text: 'Visão Geral', link: '/terrenos/' },
            { text: 'Como Registrar Terreno', link: '/terrenos/como-registrar-terreno' },
            { text: 'Status de Terrenos', link: '/terrenos/status-terrenos' }
          ]
        }
      ],
      '/boletos/': [
        {
          text: 'Boletos',
          items: [
            { text: 'Visão Geral', link: '/boletos/' },
            { text: 'Como Gerar Boleto', link: '/boletos/como-gerar-boleto-contrato' },
            { text: 'Status de Boletos', link: '/boletos/status-boletos' }
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
            { text: 'Status de Remessas', link: '/cnab/status-remessas' }
          ]
        }
      ],
      '/empresa/': [
        {
          text: 'Empresa',
          items: [
            { text: 'Visão Geral', link: '/empresa/' }
          ]
        }
      ],
      '/exportacao/': [
        {
          text: 'Exportação',
          items: [
            { text: 'Visão Geral', link: '/exportacao/' }
          ]
        }
      ],
      '/sistema/': [
        {
          text: 'Sistema',
          items: [
            { text: 'Visão Geral', link: '/sistema/' }
          ]
        }
      ],
      '/desenvolvimento/': [
        {
          text: 'Desenvolvimento',
          items: [
            { text: 'Visão Geral', link: '/desenvolvimento/' },
            { text: 'Fases de Desenvolvimento', link: '/desenvolvimento/FASES-DESENVOLVIMENTO' },
            { text: 'Resumo de Correções', link: '/desenvolvimento/BUILD_FIX_SUMMARY' },
            { text: 'Diagnóstico Node Produção', link: '/desenvolvimento/DIAGNOSTICO_PROBLEMA_NODE_PRODUCAO' },
            { text: 'Refactoring Completo', link: '/desenvolvimento/FASE_3_REFACTORING_COMPLETO' }
          ]
        }
      ]
    },

    footer: {
      message: 'Documentação do Sistema ERP Anduril',
      copyright: 'Copyright © 2026'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/teecoleonard/anduril-docs' }
    ]
  }
}))
