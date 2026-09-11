-- Contas de Casa — schema do banco (rode isso no SQL Editor do Supabase)
-- Sem login: qualquer pessoa com o link do app pode ler e lançar despesas.

-- Se você já tinha rodado uma versão anterior (com login), limpe antes:
drop table if exists public.expenses cascade;
drop table if exists public.profiles cascade;
drop type if exists public.expense_category cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Qualquer um pode ver os perfis"
  on public.profiles for select
  using (true);

-- Categorias fixas de despesa
create type public.expense_category as enum (
  'agua', 'luz', 'internet', 'mercado', 'gas', 'aluguel', 'outros'
);

-- Lançamentos de despesas da casa
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount numeric(10, 2) not null check (amount > 0),
  category public.expense_category not null default 'outros',
  expense_date date not null default current_date,
  paid_by uuid not null references public.profiles (id),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Qualquer um pode ver os lançamentos"
  on public.expenses for select
  using (true);

create policy "Qualquer um pode lançar despesas"
  on public.expenses for insert
  with check (true);

create policy "Qualquer um pode editar lançamentos"
  on public.expenses for update
  using (true);

create policy "Qualquer um pode excluir lançamentos"
  on public.expenses for delete
  using (true);

create index if not exists expenses_expense_date_idx on public.expenses (expense_date desc);

-- Cadastre aqui os 3 moradores (troque os nomes e rode uma vez):
-- insert into public.profiles (name) values ('Mãe'), ('Padrasto'), ('Você');
