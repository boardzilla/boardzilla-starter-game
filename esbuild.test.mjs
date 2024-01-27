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
    '.ttf': 'file',
    '.scss': 'css',
    '.ogg': 'dataurl',
  },
  sourcemap,
  sourceRoot: "src",
  keepNames: true,
  outfile: 'build/test.js',
  entryPoints: ['./src/test.ts'],
  bundle: true,
  minify,
  plugins: [sassPlugin()]
})
