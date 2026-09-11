# Contas de Casa

App web (PWA) para lançar e acompanhar as contas da casa, com divisão automática por 3.

Stack: **Next.js** (App Router) + **Supabase** (auth + banco) + **Vercel** (deploy).

## Funcionalidades

- Login/cadastro por e-mail e senha (cada morador tem sua conta)
- Lançar despesas: descrição, valor, categoria, data e quem pagou
- Resumo com o saldo de cada pessoa (quem pagou mais/menos que a cota)
- Sugestão de quem deve pagar quem para acertar as contas
- Gasto do mês por categoria
- Instalável na tela inicial do celular (PWA)

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Isso cria as tabelas `profiles` e `expenses`, as políticas de RLS e o gatilho que cria o perfil automaticamente ao cadastrar.
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
4. Copie `.env.local.example` para `.env.local` e preencha:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

5. (Opcional) Em **Authentication → Providers → Email**, desative "Confirm email" para facilitar o cadastro das 3 pessoas de casa sem precisar confirmar e-mail.

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`, cadastre as 3 pessoas (nome + e-mail + senha) e comece a lançar as contas.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com/new).
3. Configure as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto da Vercel.
4. Deploy. No celular, abra o link e use "Adicionar à tela de início" para instalar como app.

## Estrutura

- `supabase/schema.sql` — schema do banco (tabelas, RLS, trigger de perfil)
- `src/app/(app)` — páginas autenticadas (resumo, lançamentos, novo lançamento)
- `src/app/login` — login/cadastro
- `src/lib/split.ts` — cálculo da divisão por 3 e sugestão de acerto de contas
