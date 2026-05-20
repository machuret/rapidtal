-- Migration: 010_messages
-- Creates the messages table for client <-> VA communication.
-- One shared thread per client_id (all VAs and the client_admin see the same feed).

create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients(id) on delete cascade,
  sender_id   uuid not null references auth.users(id) on delete cascade,
  sender_name text not null default '',
  sender_role text not null check (sender_role in ('client_admin', 'va', 'super_admin')),
  body        text not null check (char_length(body) > 0 and char_length(body) <= 4000),
  read_by     uuid[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- Index for fetching all messages in a client thread, newest last
create index if not exists messages_client_id_created_at_idx
  on messages (client_id, created_at asc);

-- Index for unread count queries
create index if not exists messages_sender_id_idx
  on messages (sender_id);

-- RLS
alter table messages enable row level security;

-- VA or client_admin can read messages for their own client_id
create policy "messages_select"
  on messages for select
  using (
    client_id in (
      select client_id from users where id = auth.uid() and client_id is not null
    )
  );

-- Sending is handled via edge function using service role key.
-- No direct insert RLS needed — edge function bypasses RLS.
