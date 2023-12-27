import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

const env = process.env.NODE_ENV || "development"
const minify = env === "production"
const sourcemap = env === "production" ? false : "inline"

await esbuild.build({
  format: 'iife',
  assetNames: 'assets/[name]-[hash]',
  loader: {
    '.jpg': 'file',
    '.png': 'file',
    '.svg': 'file',
    '.webp': 'file',
    '.scss': 'css',
    '.ogg': 'dataurl',
  },
  sourcemap,
  keepNames: true,
  outdir: 'build/ui',
  entryPoints: ['src/ui/index.tsx'],
  bundle: true,
  minify,
  plugins: [sassPlugin()]
})
