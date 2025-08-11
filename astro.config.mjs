// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import svelte from '@astrojs/svelte'
import vercel from '@astrojs/vercel'

export default defineConfig({
  integrations: [icon(), svelte()],
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})
