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

### pnpm on host + Postgres via Docker

1. Clone the repo

   ```bash
   git clone https://github.com/arrecho-tech/arrecho-tech.git
   cd arrecho-tech
   ```

2. Copy env

   ```bash
   cp .env.example .env
   ```

3. Start Postgres

   ```bash
   docker-compose up -d postgres
   ```

4. Install + start dev server

   ```bash
   pnpm install
   pnpm dev
   ```

5. Open

   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

### App + Postgres (all-in-Docker)

```bash
git clone https://github.com/arrecho-tech/arrecho-tech.git
cd arrecho-tech
cp .env.example .env
docker-compose up -d
```

Open:

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

Default local DB credentials:

- user: `postgres`
- password: `postgres`
- database: `arrecho-tech`

## Notes

- The app reads `DATABASE_URL` from `.env`.
- In production on Vercel, the `media` collection is configured to use **Vercel Blob**. Ensure `BLOB_READ_WRITE_TOKEN` is set in the Vercel project environment.
