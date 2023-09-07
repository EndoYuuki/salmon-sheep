import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
const rehypeKatexOptions = {};


// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: ['remark-math'],
    rehypePlugins: [['rehype-katex', rehypeKatexOptions]]
  },
  site: "https://salmon-sheep.sakura.ne.jp",
  integrations: [preact(), tailwind({
    applyBaseStyles: false
  }), sitemap()]
});