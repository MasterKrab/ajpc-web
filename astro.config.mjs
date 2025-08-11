// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import svelte from '@astrojs/svelte'

export default defineConfig({
  integrations: [icon(), svelte()],
})
