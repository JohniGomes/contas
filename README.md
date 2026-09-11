# Contas de Casa

App web (PWA) para lançar e acompanhar as contas da casa, com divisão automática por 3.

Stack: **Next.js** (App Router) + **Supabase** (banco de dados) + **Vercel** (deploy).

Sem login: qualquer pessoa com o link abre o app, escolhe seu nome numa lista fixa
de moradores e já pode lançar e ver as contas.

## Funcionalidades

- Escolha simples de "quem é você" (sem senha), lembrada no aparelho
- Lançar despesas: descrição, valor, categoria, data e quem pagou
- Resumo com o saldo de cada pessoa (quem pagou mais/menos que a cota)
- Sugestão de quem deve pagar quem para acertar as contas
- Gasto do mês por categoria
- Instalável na tela inicial do celular (PWA)

## Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Isso cria as tabelas `profiles` e `expenses` e as políticas de acesso (liberado para quem tiver a chave anônima do projeto).
3. Ainda no SQL Editor, cadastre os moradores, por exemplo:

   ```sql
   insert into public.profiles (name) values ('Mãe'), ('Padrasto'), ('Você');
   ```

4. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
5. Copie `.env.local.example` para `.env.local` e preencha:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`, escolha seu nome e comece a lançar as contas.

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe o projeto na [Vercel](https://vercel.com/new).
3. Configure as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no projeto da Vercel.
4. Deploy. No celular, abra o link e use "Adicionar à tela de início" para instalar como app.

## Estrutura

- `supabase/schema.sql` — schema do banco (tabelas e políticas de acesso)
- `src/app/(app)` — páginas do app (resumo, lançamentos, novo lançamento)
- `src/components/AppShell.tsx` — tela de "quem é você" e o layout com navegação
- `src/lib/split.ts` — cálculo da divisão por 3 e sugestão de acerto de contas

## Observação sobre segurança

Como não há login, qualquer pessoa com o link e a chave anônima consegue ler e
alterar os lançamentos. Está pensado para uso privado entre as 3 pessoas de
casa — não compartilhe o link publicamente.
