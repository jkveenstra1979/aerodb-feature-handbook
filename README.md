# AeroDB Feature Handbook

Next.js (App Router) prototype met Supabase als data store voor de AeroDB feature catalogus.

## Snel starten

1. Kopieer `.env.example` naar `.env.local` en vul `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_ANON_KEY` in.
2. Installeer dependencies: `npm install`.
3. Start lokaal: `npm run dev` (http://localhost:3000).

Zonder geldige Supabase-keys valt de app automatisch terug op de ingebakken mockdata in `data/features.json`.

## Supabase tabel

Maak een tabel `features` met minimaal deze kolommen (Postgres + jsonb):

```sql
create table public.features (
  id text primary key,
  code text,
  iconClass text,
  name text,
  description text,
  badges text[],
  "aixmMapped" boolean,
  "group" text,
  attrs jsonb,
  relations jsonb,
  mapping jsonb,
  ownership jsonb,
  adis jsonb
);
```

Seed met de inhoud van `data/features.json` (kopieer elke feature als één rij).

## Deploy op Vercel

- Framework preset: Next.js
- Build command: `npm run build`
- Output: `.next`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Projectstructuur

- `app/` – Next.js pagina's (App Router)
- `components/FeatureExplorer.tsx` – UI/zoek/filter/tab logica
- `lib/supabaseClient.ts` – Supabase client (frontend safe; server gebruikt fallback)
- `data/features.json` – mockdata + fallback
- `data/schema.json` – JSON Schema voor dataset
- `app/globals.css` – styling

## TODO/ideeën

- Export naar PDF/CSV via server action
- Feature detail als aparte route (`/feature/[id]`)
- Validatie pipeline: JSON import -> schema check -> Supabase upsert
