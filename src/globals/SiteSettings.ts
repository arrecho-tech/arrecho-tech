import type { GlobalConfig } from 'payload'

export const siteSettingsSlugs = ['siteSettings', 'site-settings'] as const
export const primarySiteSettingsSlug = siteSettingsSlugs[0]

export const SiteSettings: GlobalConfig = {
  slug: primarySiteSettingsSlug,
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site',
    description: 'Site-wide background and motion settings for the frontend shell.',
  },
  fields: [
    {
      name: 'backgroundImages',
      label: 'Background Images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      filterOptions: {
        mimeType: {
          contains: 'image/',
        },
      },
      admin: {
        description:
          'Used by the frontend shell. One image is chosen randomly per browser session.',
      },
    },
    {
      type: 'collapsible',
      label: 'Form Webhooks',
      fields: [
        {
          name: 'defaultFormWebhookCategory',
          label: 'Default Category',
          type: 'text',
          admin: {
            description: 'If a form does not specify a webhook category, this one will be used.',
          },
        },
        {
          name: 'formWebhooks',
          label: 'Endpoints',
          type: 'array',
          labels: {
            singular: 'Endpoint',
            plural: 'Endpoints',
          },
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Enabled',
            },
            {
              name: 'category',
              type: 'text',
              required: true,
              label: 'Category',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
            {
              name: 'secret',
              type: 'text',
              label: 'Secret (optional)',
              admin: {
                description: 'Sent as the x-webhook-secret header.',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Appearance',
      fields: [
        {
          name: 'overlayEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable dark overlay',
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 1,
          defaultValue: 0.45,
          admin: {
            step: 0.05,
            condition: (_, siblingData) => Boolean(siblingData?.overlayEnabled),
            description: '0 = transparent, 1 = fully black overlay.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Motion',
      fields: [
        {
          name: 'parallaxEnabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable parallax motion',
        },
        {
          name: 'parallaxIntensity',
          type: 'number',
          min: 0,
          max: 40,
          defaultValue: 16,
          admin: {
            step: 1,
            condition: (_, siblingData) => Boolean(siblingData?.parallaxEnabled),
            description: 'Higher values move the centered icon more in response to mouse movement.',
          },
        },
      ],
    },
  ],
}
