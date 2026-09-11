-- Contas de Casa — schema do banco (rode isso no SQL Editor do Supabase)

-- Perfis dos moradores (1 linha por pessoa, ligada a um usuário do Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Qualquer morador logado pode ver os perfis"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Cada um edita seu próprio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Cria o perfil automaticamente quando um usuário se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
  created_by uuid not null references public.profiles (id) default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Qualquer morador logado pode ver os lançamentos"
  on public.expenses for select
  to authenticated
  using (true);

create policy "Qualquer morador logado pode lançar despesas"
  on public.expenses for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "Quem lançou pode editar"
  on public.expenses for update
  to authenticated
  using (auth.uid() = created_by);

create policy "Quem lançou pode excluir"
  on public.expenses for delete
  to authenticated
  using (auth.uid() = created_by);

create index if not exists expenses_expense_date_idx on public.expenses (expense_date desc);
