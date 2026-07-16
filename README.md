# Presença

Plataforma SaaS de **atendente virtual para lojas físicas**.

O cliente escaneia um QR Code, abre a página no celular (sem app), libera câmera e microfone e conversa por voz com um avatar que apresenta produtos, tira dúvidas e conduz a venda até orçamento ou pagamento.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Web Speech API (reconhecimento e síntese de voz no navegador)
- Motor conversacional em português (demo local + opcional OpenAI)
- Geração de QR Code por setor da loja
- Catálogo, orçamento e link de pagamento (demo)

## Começar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Rotas principais

| Rota | Função |
| --- | --- |
| `/` | Landing da plataforma Presença |
| `/a/casa-viva/sofas` | Atendimento do cliente (demo Casa Viva · setor sofás) |
| `/dashboard` | Painel do lojista (avatar, QR, catálogo) |
| `/pagamento/[id]` | Checkout / link de pagamento (demo) |

### Demo de conversa

1. Abra `/a/casa-viva/sofas`
2. Ative câmera e microfone
3. Diga ou use os atalhos:
   - “Estou procurando um sofá para apartamento pequeno.”
   - “Cerca de 3 por 4 metros.”
   - “Quero ver fotos e medidas.”
   - “Pode gerar o orçamento agora.”

## OpenAI (opcional)

Sem chave, o motor de demo responde em português com o fluxo de móveis.

Com chave:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

## Arquitetura

```
Cliente → QR Code → Página Web → Avatar (voz/vídeo)
                         ↓
                 IA Conversacional
            ├── Catálogo / estoque
            ├── Orçamento
            ├── Pagamentos
            └── Handoff humano
```

## Próximos passos de produto

- Persistência multi-tenant (DB)
- Avatar 3D / lip-sync profissional
- Integração real com ERP, CRM e gateway de pagamento
- Auth do painel do lojista
- Streaming de voz de baixa latência
