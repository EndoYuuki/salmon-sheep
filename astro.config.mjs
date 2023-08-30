import { defineConfig } from 'astro/config';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: ['remark-math'],
    rehypePlugins: [['rehype-katex', {
      // Katex plugin options
    }]]
  },
  integrations: [preact()]
});