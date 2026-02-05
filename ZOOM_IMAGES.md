# Como Adicionar Imagens com Zoom

O projeto agora suporta **zoom automático em imagens** usando a biblioteca `medium-zoom`. Quando o usuário clica em uma imagem, ela é ampliada em tela cheia (modal).

## Como Usar

### Inserir uma Imagem Comum
```markdown
![Descrição da imagem](./caminho/para/imagem.png)
```

**Automaticamente**, o zoom será ativado ao clicar na imagem.

### Exemplo
```markdown
![Tela de Login](./images/login.png)
```

Quando clicado, a imagem será:
- ✅ Ampliada em tela cheia
- ✅ Com fundo escuro semi-transparente
- ✅ Fechada ao clicar fora ou pressionar ESC

## Recursos

- **Zoom suave** com animação fluida
- **Fundo escuro** (rgba 0,0,0,0.8) para melhor contraste
- **Teclado** - Pressione ESC para fechar
- **Responsivo** - Funciona em desktop e mobile
- **Sem configuração** - Funciona automaticamente

## Arquitetura

O zoom é implementado através de:

1. **`docs/.vitepress/theme/index.js`** - Wrapper customizado do tema
2. **`docs/.vitepress/theme/style.css`** - Estilos adicionais
3. **`medium-zoom` (npm)** - Biblioteca de zoom

## Convenção de Pastas

Coloque as imagens em subpastas:
```
docs/
├── clientes/
│   ├── images/          ← Imagens aqui
│   │   ├── login.png
│   │   └── novo-cliente-btn.png
│   └── como-registrar-cliente.md
```

## Referência do Medium Zoom

Documentação: https://medium-zoom.js.org/

Opções personalizáveis (se precisar ajustar):
```javascript
mediumZoom('img', {
  background: 'rgba(0, 0, 0, 0.8)',  // Cor fundo
  margin: 20,                          // Espaçamento interno
  scrollOffset: 0                      // Scroll offset
})
```
