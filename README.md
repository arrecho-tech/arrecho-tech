<p align="center">
  <img src="public/brand/logo-circle.svg" alt="Arrecho Tech" width="128" height="128" />
</p>

# Arrecho Tech

This repository contains the **Arrecho Tech** website + CMS.

- Frontend: Next.js App Router
- CMS/Admin: Payload
- Database: Postgres
- Media storage (prod): Vercel Blob

## Quick start (local)

### 1) Clone

```bash
git clone https://github.com/arrecho-tech/arrecho-tech.git
cd arrecho-tech
```

### 2) Env

```bash
cp .env.example .env
```

### 3) Install + dev

```bash
pnpm install
pnpm dev
```

### 4) Open

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

On first run, create your first admin user via the on-screen prompt.

## Docker (optional)

This repo includes a `docker-compose.yml` for local Postgres (and can also run the app in Docker).

### Postgres only (recommended)

```bash
docker-compose up -d postgres
```

Default local DB credentials:

- user: `postgres`
- password: `postgres`
- database: `arrecho-tech`

### App + Postgres (all-in-Docker)

```bash
docker-compose up -d
```

## Notes

- The app reads `DATABASE_URL` from `.env`.
- In production on Vercel, the `media` collection is configured to use **Vercel Blob**. Ensure `BLOB_READ_WRITE_TOKEN` is set in the Vercel project environment.
