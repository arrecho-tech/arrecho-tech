<p align="center">
  <img src="public/brand/logo-circle.svg" alt="Arrecho Tech" width="128" height="128" />
</p>

# Arrecho Tech

This repository contains the **Arrecho Tech** website + CMS.

- Frontend: Next.js App Router
- CMS/Admin: Payload
- Database: Postgres
- Media storage (prod): Vercel Blob

## Local development

### Prerequisites

- Node.js + pnpm
- Docker (for local Postgres)

### 1) Clone + env

```bash
git clone https://github.com/arrecho-tech/arrecho-tech.git
cd arrecho-tech
cp .env.example .env
```

### 2) Start Postgres

```bash
docker-compose up -d
```

Default local DB credentials:

- user: `postgres`
- password: `postgres`
- database: `arrecho-tech`

### 3) Install deps + run

```bash
pnpm install
pnpm dev
```

Then open:

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

On first run, create your first admin user via the on-screen prompt.

## Notes

- The app reads `DATABASE_URL` from `.env`.
- In production on Vercel, the `media` collection is configured to use **Vercel Blob**. Ensure `BLOB_READ_WRITE_TOKEN` is set in the Vercel project environment.
