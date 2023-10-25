import * as esbuild from 'esbuild'

const env = process.env.NODE_ENV || "development"
const minify = env === "production"

await esbuild.build({
  format: 'iife',
  globalName: 'game',
  keepNames: true,
  outdir: 'build/game',
  entryPoints: ['src/game/game-interface.ts'],
  bundle: true,
  minify,
})
