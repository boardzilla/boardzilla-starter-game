import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

const env = process.env.NODE_ENV || "development"
const minify = env === "production"

await esbuild.build({
  format: 'iife',
  globalName: 'game',
  loader: {
    '.jpg': 'file',
    '.png': 'file',
    '.svg': 'file',
    '.webp': 'file',
    '.scss': 'css',
    '.ogg': 'dataurl',
  },
  keepNames: true,
  sourcemap: 'inline',
  outdir: 'build/game',
  entryPoints: ['src/game/game-interface.ts'],
  bundle: true,
  minify,
  plugins: [sassPlugin()]
})
