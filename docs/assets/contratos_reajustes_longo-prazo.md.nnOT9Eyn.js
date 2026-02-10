import{_ as s,o as n,c as e,a1 as p}from"./chunks/framework.Dl-aaRiw.js";const u=JSON.parse('{"title":"Reajustes a Longo Prazo - Cenário de 2+ Anos","description":"","frontmatter":{},"headers":[],"relativePath":"contratos/reajustes/longo-prazo.md","filePath":"contratos/reajustes/longo-prazo.md"}'),l={name:"contratos/reajustes/longo-prazo.md"};function o(i,a,t,r,c,d){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="reajustes-a-longo-prazo-cenario-de-2-anos" tabindex="-1">Reajustes a Longo Prazo - Cenário de 2+ Anos <a class="header-anchor" href="#reajustes-a-longo-prazo-cenario-de-2-anos" aria-label="Permalink to &quot;Reajustes a Longo Prazo - Cenário de 2+ Anos&quot;">​</a></h1><h2 id="exemplo-pratico" tabindex="-1">Exemplo Prático <a class="header-anchor" href="#exemplo-pratico" aria-label="Permalink to &quot;Exemplo Prático&quot;">​</a></h2><h3 id="contrato-de-30-anos-com-reajustes-anuais" tabindex="-1">Contrato de 30 Anos com Reajustes Anuais <a class="header-anchor" href="#contrato-de-30-anos-com-reajustes-anuais" aria-label="Permalink to &quot;Contrato de 30 Anos com Reajustes Anuais&quot;">​</a></h3><hr><h4 id="ano-1-janeiro-2026-criacao" tabindex="-1">Ano 1 (Janeiro/2026) - Criação <a class="header-anchor" href="#ano-1-janeiro-2026-criacao" aria-label="Permalink to &quot;Ano 1 (Janeiro/2026) - Criação&quot;">​</a></h4><p><strong>Contrato criado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>valor_parcela: R$ 3.333,33</span></span>
<span class="line"><span>quantidade_parcelas: 360 (30 anos × 12)</span></span>
<span class="line"><span>saldo_devedor: R$ 0 (vazio)</span></span></code></pre></div><p><strong>Gerar parcelas 1-12:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FOR parcela = 1 TO 12:</span></span>
<span class="line"><span>  INSERT boleto(valor_parcela = 3.333,33, status=&#39;aberto&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>saldo_devedor = 12 × 3.333,33 = R$ 39.999,96</span></span>
<span class="line"><span>indice_de_reajuste = NULL</span></span></code></pre></div><p><strong>Estado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─ Contrato ────────────────────┐</span></span>
<span class="line"><span>│ valor_parcela: 3.333,33       │</span></span>
<span class="line"><span>│ saldo_devedor: 39.999,96      │ ← 12 boletos</span></span>
<span class="line"><span>│ indice: NULL                  │</span></span>
<span class="line"><span>└───────────────────────────────┘</span></span></code></pre></div><hr><h4 id="ano-1-fevereiro-2026-1o-reajuste-10" tabindex="-1">Ano 1 (Fevereiro/2026) - 1º Reajuste (10%) <a class="header-anchor" href="#ano-1-fevereiro-2026-1o-reajuste-10" aria-label="Permalink to &quot;Ano 1 (Fevereiro/2026) - 1º Reajuste (10%)&quot;">​</a></h4><p><strong>Aplicar reajuste:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>novo_valor_parcela = 3.333,33 × 1.10 = R$ 3.666,66</span></span>
<span class="line"><span></span></span>
<span class="line"><span>UPDATE contratos SET</span></span>
<span class="line"><span>  valor_parcela = 3.666,66,        ← BASE NOVA</span></span>
<span class="line"><span>  indice_de_reajuste = 10,</span></span>
<span class="line"><span>  data_do_ultimo_reajuste = 2026-02-05,</span></span>
<span class="line"><span>  saldo_devedor = SUM(boletos) = 39.999,96</span></span></code></pre></div><p><strong>Gerar parcelas 13-24:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FOR parcela = 13 TO 24:</span></span>
<span class="line"><span>  INSERT boleto(valor_parcela = 3.666,66, status=&#39;aberto&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>saldo_devedor = (12 × 3.333,33) + (12 × 3.666,66)</span></span>
<span class="line"><span>              = 39.999,96 + 43.999,92</span></span>
<span class="line"><span>              = 83.999,88</span></span></code></pre></div><p><strong>Estado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─ Contrato ────────────────────┐</span></span>
<span class="line"><span>│ valor_parcela: 3.666,66       │</span></span>
<span class="line"><span>│ saldo_devedor: 83.999,88      │ ← 24 boletos</span></span>
<span class="line"><span>│ indice: 10%                   │</span></span>
<span class="line"><span>│ última_reajuste: 2026-02-05   │</span></span>
<span class="line"><span>└───────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Boletos por taxa:</span></span>
<span class="line"><span>  1-12:  3.333,33 (original)</span></span>
<span class="line"><span>  13-24: 3.666,66 (reajuste 10%)</span></span></code></pre></div><hr><h4 id="ano-2-fevereiro-2027-2o-reajuste-5" tabindex="-1">Ano 2 (Fevereiro/2027) - 2º Reajuste (5%) <a class="header-anchor" href="#ano-2-fevereiro-2027-2o-reajuste-5" aria-label="Permalink to &quot;Ano 2 (Fevereiro/2027) - 2º Reajuste (5%)&quot;">​</a></h4><p><strong>Aplicar reajuste (5% sobre 3.666,66):</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>novo_valor_parcela = 3.666,66 × 1.05 = R$ 3.849,99</span></span>
<span class="line"><span></span></span>
<span class="line"><span>UPDATE contratos SET</span></span>
<span class="line"><span>  valor_parcela = 3.849,99,        ← BASE NOVA</span></span>
<span class="line"><span>  indice_de_reajuste = 5,</span></span>
<span class="line"><span>  data_do_ultimo_reajuste = 2027-02-05,</span></span>
<span class="line"><span>  saldo_devedor = SUM(boletos)</span></span></code></pre></div><p><strong>Gerar parcelas 25-36:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FOR parcela = 25 TO 36:</span></span>
<span class="line"><span>  INSERT boleto(valor_parcela = 3.849,99, status=&#39;aberto&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>saldo_devedor = (12 × 3.333,33) + (12 × 3.666,66) + (12 × 3.849,99)</span></span>
<span class="line"><span>              = 39.999,96 + 43.999,92 + 46.199,88</span></span>
<span class="line"><span>              = 130.199,76</span></span></code></pre></div><p><strong>Estado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─ Contrato ────────────────────┐</span></span>
<span class="line"><span>│ valor_parcela: 3.849,99       │</span></span>
<span class="line"><span>│ saldo_devedor: 130.199,76     │ ← 36 boletos</span></span>
<span class="line"><span>│ indice: 5%                    │</span></span>
<span class="line"><span>│ última_reajuste: 2027-02-05   │</span></span>
<span class="line"><span>└───────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Boletos por taxa:</span></span>
<span class="line"><span>  1-12:  3.333,33 (original)</span></span>
<span class="line"><span>  13-24: 3.666,66 (reajuste 10%)</span></span>
<span class="line"><span>  25-36: 3.849,99 (reajuste 5%)</span></span></code></pre></div><hr><h4 id="ano-3-fevereiro-2028-3o-reajuste-8" tabindex="-1">Ano 3 (Fevereiro/2028) - 3º Reajuste (8%) <a class="header-anchor" href="#ano-3-fevereiro-2028-3o-reajuste-8" aria-label="Permalink to &quot;Ano 3 (Fevereiro/2028) - 3º Reajuste (8%)&quot;">​</a></h4><p><strong>Aplicar reajuste (8% sobre 3.849,99):</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>novo_valor_parcela = 3.849,99 × 1.08 = R$ 4.153,99</span></span>
<span class="line"><span></span></span>
<span class="line"><span>UPDATE contratos SET</span></span>
<span class="line"><span>  valor_parcela = 4.153,99,        ← BASE NOVA</span></span>
<span class="line"><span>  indice_de_reajuste = 8,</span></span>
<span class="line"><span>  data_do_ultimo_reajuste = 2028-02-05,</span></span>
<span class="line"><span>  saldo_devedor = SUM(boletos)</span></span></code></pre></div><p><strong>Gerar parcelas 37-48:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>FOR parcela = 37 TO 48:</span></span>
<span class="line"><span>  INSERT boleto(valor_parcela = 4.153,99, status=&#39;aberto&#39;)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>saldo_devedor = 39.999,96 + 43.999,92 + 46.199,88 + 49.847,88</span></span>
<span class="line"><span>              = 180.047,64</span></span></code></pre></div><p><strong>Estado:</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─ Contrato ────────────────────┐</span></span>
<span class="line"><span>│ valor_parcela: 4.153,99       │</span></span>
<span class="line"><span>│ saldo_devedor: 180.047,64     │ ← 48 boletos</span></span>
<span class="line"><span>│ indice: 8%                    │</span></span>
<span class="line"><span>│ última_reajuste: 2028-02-05   │</span></span>
<span class="line"><span>└───────────────────────────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Boletos por taxa:</span></span>
<span class="line"><span>  1-12:  3.333,33 (original)</span></span>
<span class="line"><span>  13-24: 3.666,66 (reajuste 1: +10%)</span></span>
<span class="line"><span>  25-36: 3.849,99 (reajuste 2: +5%)</span></span>
<span class="line"><span>  37-48: 4.153,99 (reajuste 3: +8%)</span></span></code></pre></div><h2 id="padrao-observado" tabindex="-1">Padrão Observado <a class="header-anchor" href="#padrao-observado" aria-label="Permalink to &quot;Padrão Observado&quot;">​</a></h2><h3 id="cada-reajuste-multiplica-o-valor-parcela-anterior" tabindex="-1">Cada Reajuste Multiplica o <code>valor_parcela</code> Anterior <a class="header-anchor" href="#cada-reajuste-multiplica-o-valor-parcela-anterior" aria-label="Permalink to &quot;Cada Reajuste Multiplica o \`valor_parcela\` Anterior&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>valor_parcela_n = valor_parcela_(n-1) × (1 + indice/100)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Exemplo:</span></span>
<span class="line"><span>  Year 1: 3.333,33 × 1.10 = 3.666,66</span></span>
<span class="line"><span>  Year 2: 3.666,66 × 1.05 = 3.849,99</span></span>
<span class="line"><span>  Year 3: 3.849,99 × 1.08 = 4.153,99</span></span>
<span class="line"><span>  Year 4: 4.153,99 × 1.06 = 4.403,23</span></span></code></pre></div><h3 id="progressao-cumulativa-nao-linear" tabindex="-1">Progressão Cumulativa (Não Linear) <a class="header-anchor" href="#progressao-cumulativa-nao-linear" aria-label="Permalink to &quot;Progressão Cumulativa (Não Linear)&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Comparação: Valores Acumulados vs Crescimento % ao Ano</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Ano    Índice  valor_parcela  Crescimento desde Ano 1</span></span>
<span class="line"><span>────   ──────  ─────────────  ───────────────────────</span></span>
<span class="line"><span>1      0%      3.333,33       0%</span></span>
<span class="line"><span>2      10%     3.666,66       10,0%</span></span>
<span class="line"><span>3      5%      3.849,99       15,5%</span></span>
<span class="line"><span>4      8%      4.153,99       24,6%</span></span>
<span class="line"><span>5      6%      4.403,23       32,1%</span></span>
<span class="line"><span>6      3%      4.535,33       36,1%</span></span>
<span class="line"><span>7      12%     5.079,57       52,4%</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>30     ...     ??             (pode dobrar ou triplicar)</span></span></code></pre></div><h2 id="visualizacao-saldo-devedor-ao-longo-de-30-anos" tabindex="-1">Visualização: Saldo Devedor ao Longo de 30 Anos <a class="header-anchor" href="#visualizacao-saldo-devedor-ao-longo-de-30-anos" aria-label="Permalink to &quot;Visualização: Saldo Devedor ao Longo de 30 Anos&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Cenário: Reajuste anual de 8% médio</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Saldo Devedor (R$)</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>│ 1.000.000 ┐</span></span>
<span class="line"><span>│           │                                      ╱─╱─╱─╱─</span></span>
<span class="line"><span>│  800.000  │                            ╱─╱─╱─╱─╱</span></span>
<span class="line"><span>│  600.000  │                ╱─╱─╱─╱─╱─╱</span></span>
<span class="line"><span>│  400.000  │    ╱─╱─╱─╱─╱─╱</span></span>
<span class="line"><span>│  200.000  │╱─╱─</span></span>
<span class="line"><span>│       0   └────────────────────────────────────────</span></span>
<span class="line"><span>             0    10   20   30   (anos)</span></span></code></pre></div><h2 id="observacoes-importantes" tabindex="-1">Observações Importantes <a class="header-anchor" href="#observacoes-importantes" aria-label="Permalink to &quot;Observações Importantes&quot;">​</a></h2><h3 id="_1-boletos-antigos-nunca-mudam" tabindex="-1">1. Boletos Antigos Nunca Mudam <a class="header-anchor" href="#_1-boletos-antigos-nunca-mudam" aria-label="Permalink to &quot;1. Boletos Antigos Nunca Mudam&quot;">​</a></h3><p>Quando você reajusta um contrato:</p><ul><li>❌ Boletos <strong>já gerados</strong> NUNCA são modificados</li><li>✅ Boletos <strong>futuros</strong> usarão o novo valor_parcela</li></ul><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 6 boletos de 3.333,33 existem</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- Reajuste: +10%</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- Resultado:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Boletos </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">333</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">33</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (inalterado)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Boletos </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">12</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">666</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">66</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (novo valor)</span></span></code></pre></div><h3 id="_2-saldo-devedor-vs-valor-parcela" tabindex="-1">2. Saldo Devedor vs Valor Parcela <a class="header-anchor" href="#_2-saldo-devedor-vs-valor-parcela" aria-label="Permalink to &quot;2. Saldo Devedor vs Valor Parcela&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Campo</th><th>Muda com reajuste?</th><th>Por quê?</th></tr></thead><tbody><tr><td><code>valor_parcela</code></td><td>✅ SIM</td><td>Próximos boletos usarão novo valor</td></tr><tr><td><code>saldo_devedor</code></td><td>Recalculado</td><td>É SUM de boletos abertos (não vai mudar em valor total)</td></tr></tbody></table><h3 id="_3-exemplo-contrato-com-360-parcelas" tabindex="-1">3. Exemplo: Contrato com 360 Parcelas <a class="header-anchor" href="#_3-exemplo-contrato-com-360-parcelas" aria-label="Permalink to &quot;3. Exemplo: Contrato com 360 Parcelas&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Ano 1:  parcelas 1-12    @ 3.333,33</span></span>
<span class="line"><span>Ano 2:  parcelas 13-24   @ 3.666,66 (reajuste +10%)</span></span>
<span class="line"><span>Ano 3:  parcelas 25-36   @ 3.849,99 (reajuste +5%)</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>Ano 30: parcelas 349-360 @ ??? (vários reajustes acumulados)</span></span></code></pre></div><p>A parcela 360 pode custar 2-3× mais que a parcela 1 após 30 anos de reajustes!</p><h2 id="conclusao" tabindex="-1">Conclusão <a class="header-anchor" href="#conclusao" aria-label="Permalink to &quot;Conclusão&quot;">​</a></h2><p>O sistema de reajustes foi projetado para lidar com cenários de <strong>longo prazo</strong> onde contratos precisam de múltiplos reajustes. Através de uma arquitetura simples (atualizar <code>valor_parcela</code>, manter boletos imutáveis), conseguimos:</p><p>✅ Flexibilidade para reajustes frequentes<br> ✅ Consistência de dados (saldo sincronizado)<br> ✅ Auditoria completa (histórico de reajustes)<br> ✅ Performance adequada mesmo a longo prazo</p><p>Cada reajuste é um multiplicador do valor anterior, permitindo crescimento realista baseado em índices econômicos (IPCA, IGP-M, etc.).</p>`,56)])])}const g=s(l,[["render",o]]);export{u as __pageData,g as default};
