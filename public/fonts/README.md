Coloque aqui os arquivos da família Gordita para o projeto.

Arquivos esperados (coloque em public/fonts):

- Gordita-Regular.woff2
- Gordita-Regular.woff
- Gordita-Bold.woff2
- Gordita-Bold.woff

Exemplo PowerShell para copiar arquivos para a pasta public/fonts (execute no diretório onde os arquivos estão localmente):

mkdir -Force public\fonts; Copy-Item -Path .\Gordita-_.woff_ -Destination public\fonts

Se preferir usar o Next.js `next/font/local`, coloque os arquivos em public/fonts e importe usando `local()` no código conforme a documentação do Next.
