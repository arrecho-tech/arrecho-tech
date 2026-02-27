import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const emailFromAddress = process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Arrecho Tech',
      icons: {
        icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      },
      openGraph: {
        images: ['/brand/logo-square.svg'],
      },
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  email:
    process.env.SMTP_PASS && emailFromAddress
      ? nodemailerAdapter({
          defaultFromAddress: emailFromAddress,
          defaultFromName: process.env.SMTP_FROM_NAME || 'Arrecho Tech',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
            requireTLS: true,
          },
        })
      : undefined,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Specify which collections should use Vercel Blob
      collections: {
        media: true,
      },
      // Vercel serverless uploads are limited; client uploads bypass that
      clientUploads: true,
      // Set by Vercel when Blob is enabled for the project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
