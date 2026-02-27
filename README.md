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

To run the app locally:

1. Clone the repo

   ```bash
   git clone https://github.com/arrecho-tech/arrecho-tech.git
   cd arrecho-tech
   ```

2. Copy env

   ```bash
   cp .env.example .env
   ```

3. Install + start dev server

   ```bash
   pnpm install
   pnpm dev
   ```

4. Open

   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

On first run, create your first admin user via the on-screen prompt.

## Docker (optional)

This repo includes a `docker-compose.yml` for local Postgres (and can also run the app in Docker).

- Run Postgres only (recommended):

  ```bash
  docker-compose up -d postgres
  ```

- Or run app + Postgres in Docker:

  ```bash
  docker-compose up -d
  ```

Default local DB credentials:

- user: `postgres`
- password: `postgres`
- database: `arrecho-tech`

## Notes

- The app reads `DATABASE_URL` from `.env`.
- In production on Vercel, the `media` collection is configured to use **Vercel Blob**. Ensure `BLOB_READ_WRITE_TOKEN` is set in the Vercel project environment.
