-- Create tables for user settings
create table public.user_profiles (
  id uuid references auth.users primary key,
  full_name text,
  bio text,
  avatar_url text,
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint email_format check (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

create table public.user_settings (
  id uuid references auth.users primary key,
  theme text default 'system',
  language text default 'en',
  accessibility jsonb default '{"colorScheme": "default", "reduceMotion": false, "highContrast": false, "fontSize": "base"}'::jsonb,
  layout jsonb default '{"density": "comfortable", "sidebarPosition": "left"}'::jsonb,
  privacy jsonb default '{"isPublic": false, "dataCollection": false}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint theme_values check (theme in ('light', 'dark', 'system')),
  constraint language_values check (language ~* '^[a-z]{2}(-[A-Z]{2})?$')
);

create table public.user_notifications (
  id uuid references auth.users primary key,
  preferences jsonb default '{}'::jsonb,
  global_settings jsonb default '{"doNotDisturb": {"enabled": false}, "pauseAll": false}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_security (
  id uuid references auth.users primary key,
  two_factor_enabled boolean default false,
  recovery_email text,
  security_questions jsonb default '[]'::jsonb,
  session_management jsonb default '{"rememberMe": true, "sessionTimeout": 30}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint recovery_email_format check (recovery_email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- Create triggers to automatically update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.handle_updated_at();

create trigger handle_user_settings_updated_at
  before update on public.user_settings
  for each row
  execute function public.handle_updated_at();

create trigger handle_user_notifications_updated_at
  before update on public.user_notifications
  for each row
  execute function public.handle_updated_at();

create trigger handle_user_security_updated_at
  before update on public.user_security
  for each row
  execute function public.handle_updated_at();

-- Set up Row Level Security (RLS)
alter table public.user_profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_notifications enable row level security;
alter table public.user_security enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = id);

create policy "Users can view own notifications"
  on public.user_notifications for select
  using (auth.uid() = id);

create policy "Users can update own notifications"
  on public.user_notifications for update
  using (auth.uid() = id);

create policy "Users can view own security settings"
  on public.user_security for select
  using (auth.uid() = id);

create policy "Users can update own security settings"
  on public.user_security for update
  using (auth.uid() = id);

-- Insert policies for initial row creation
create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = id);

create policy "Users can insert own notifications"
  on public.user_notifications for insert
  with check (auth.uid() = id);

create policy "Users can insert own security settings"
  on public.user_security for insert
  with check (auth.uid() = id);

-- Create functions to ensure user settings are created on user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);

  insert into public.user_settings (id)
  values (new.id);

  insert into public.user_notifications (id)
  values (new.id);

  insert into public.user_security (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create user settings on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); 