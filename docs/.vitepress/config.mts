import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Anduril Docs',
  description: 'Documentação do Sistema ERP Anduril',
  base: '/anduril-docs/',
  head: [
    ['meta', { name: 'theme-color', content: '#3c3c3c' }]
  ],
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
        { text: 'Clientes', items: [
          { text: 'README', link: '/clientes/' }
        ]}
      ],
      '/contratos/': [
        { text: 'Contratos', items: [
          { text: 'README', link: '/contratos/' },
          { text: 'Reajustes', items: [
            { text: 'README', link: '/contratos/reajustes/' }
          ]}
        ]}
      ],
      '/terrenos/': [
        { text: 'Terrenos', items: [
          { text: 'README', link: '/terrenos/' }
        ]}
      ],
      '/boletos/': [
        { text: 'Boletos', items: [
          { text: 'README', link: '/boletos/' }
        ]}
      ],
      '/cnab/': [
        { text: 'CNAB', items: [
          { text: 'README', link: '/cnab/' }
        ]}
      ],
      '/empresa/': [
        { text: 'Empresa', items: [
          { text: 'README', link: '/empresa/' }
        ]}
      ],
      '/exportacao/': [
        { text: 'Exportação', items: [
          { text: 'README', link: '/exportacao/' }
        ]}
      ],
      '/sistema/': [
        { text: 'Sistema', items: [
          { text: 'README', link: '/sistema/' }
        ]}
      ],
      '/desenvolvimento/': [
        { text: 'Desenvolvimento', items: [
          { text: 'README', link: '/desenvolvimento/' }
        ]}
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/teecoleonard/anduril-docs' }
    ],
    footer: {
      message: 'Documentação do Sistema ERP Anduril',
      copyright: 'Copyright © 2026'
    },
    markdown: {
      lineNumbers: false
    },
    cleanUrls: true
  }
})
