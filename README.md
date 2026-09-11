# EAJ — Contas de Casa

App web (PWA) para lançar e acompanhar as contas da casa, com divisão automática por 3.

Stack: **Next.js** (App Router) + **Supabase** (banco de dados) + **Vercel** (deploy).

Sem login e sem identificação de quem lançou: qualquer pessoa com o link abre o
app e já lança a despesa. No fim, o total é sempre dividido por 3.

## Funcionalidades

- Lançar despesas: descrição, valor, categoria e data
- Total lançado e a cota de cada pessoa (total ÷ 3)
- Gasto do mês por categoria
- Sempre em modo claro, mesmo com o celular no modo escuro
- Instalável na tela inicial do celular (PWA)

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Isso cria a tabela `expenses` e as políticas de acesso (liberado para quem tiver a chave anônima do projeto).
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
4. Copie `.env.local.example` para `.env.local` e preencha:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` e comece a lançar as contas.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com/new).
3. Configure as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto da Vercel.
4. Deploy. No celular, abra o link e use "Adicionar à tela de início" para instalar como app.

## Estrutura

- `supabase/schema.sql` — schema do banco (tabela `expenses` e políticas de acesso)
- `src/app/(app)` — páginas do app (resumo, lançamentos, novo lançamento)
- `src/components/BottomNav.tsx` — navegação inferior com ícones

## Observação sobre segurança

Como não há login, qualquer pessoa com o link e a chave anônima consegue ler e
alterar os lançamentos. Está pensado para uso privado entre as pessoas de casa —
não compartilhe o link publicamente.
