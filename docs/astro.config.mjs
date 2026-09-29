import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

const basePath = process.env.NODE_ENV === "production" ? "/havarotjs" : "";

// https://astro.build/config
export default defineConfig({
  srcDir: "./docs/src",
  site: "https://charlesLoder.github.io",
  outDir: "docs-dist",
  build: {
    assets: "assets"
  },
  base: basePath,
  integrations: [
    starlight({
      title: `havarotjs v${process.env.npm_package_version || ""}`,
      plugins: [
        starlightTypeDoc({
          entryPoints: ["./src/index.ts"],
          tsconfig: ".config/tsconfig.json",
          typeDoc: {
            expandObjects: true,
            parametersFormat: "table"
          }
        })
      ],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/charlesLoder/havarotjs" }],
      sidebar: [
        {
          label: "Getting started",
          link: `/`
        },
        {
          label: "Changelog",
          link: `/changelog`
        },
        // Add the generated sidebar group to the sidebar.
        typeDocSidebarGroup,
        {
          label: "Guides",
          items: [{ autogenerate: { directory: "guides" } }]
        }
      ]
    })
  ]
});
