// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import svelte from '@astrojs/svelte'

import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://academiajuvenil.progcomp.cl',
  integrations: [icon(), svelte(), sitemap()],
})
