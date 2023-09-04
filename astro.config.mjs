import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

const rehypeKatexOptions = {};

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: ['remark-math'],
    rehypePlugins: [['rehype-katex', rehypeKatexOptions]]
  },
  integrations: [preact(), tailwind({
    applyBaseStyles: false,
  })]
});