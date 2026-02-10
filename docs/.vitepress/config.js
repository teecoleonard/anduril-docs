import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Anduril Docs',
  description: 'Documentação do Sistema ERP Anduril',
  lang: 'pt-BR',
  base: '/anduril-docs/',
  ignoreDeadLinks: true,
  
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
          { text: '⚙️ Sistema', link: '/sistema/' }
        ]
      }
    ],

    sidebar: {
      '/clientes/': [
        {
          text: 'Clientes',
          items: [
            { text: 'Visão Geral', link: '/clientes/' },
            { text: 'Como Registrar Cliente', link: '/clientes/como-registrar-cliente' }
          ]
        }
      ],
      '/contratos/': [
        {
          text: 'Contratos',
          items: [
            { text: 'Visão Geral', link: '/contratos/' },
            { text: 'Como Gerar Contrato', link: '/contratos/como-gerar-contrato' },
            { text: 'Status de Contratos', link: '/contratos/status-contratos' }
          ]
        },
        {
          text: 'Reajustes',
          collapsed: false,
          items: [
            { text: 'Visão Geral', link: '/contratos/reajustes/' },
            { text: 'Arquitetura', link: '/contratos/reajustes/arquitetura' },
            { text: 'Planejamento Longo Prazo', link: '/contratos/reajustes/longo-prazo' }
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
            { text: 'Status de Remessas', link: '/cnab/status-remessas' },
            { text: 'Como Gerar Remessa', link: '/cnab/como-gerar-remessa' },
            { text: 'Como Importar Retorno', link: '/cnab/como-importar-retorno' }
          ]
        }
      ],
      '/empresa/': [
        {
          text: 'Empresa',
          items: [
            { text: 'Visão Geral', link: '/empresa/' },
            { text: 'Como Cadastrar Empresa', link: '/empresa/como-cadastrar-empresa' }
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
            { text: 'Visão Geral', link: '/sistema/' },
            { text: 'Sistema de Backup', link: '/sistema/SISTEMA_BACKUP' }
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
