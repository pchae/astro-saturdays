[22:42:22.002] Cloning github.com/pchae/astro-saturdays (Branch: main, Commit: b0cd801)
[22:42:22.106] VERCEL_FORCE_NO_BUILD_CACHE is set so skipping build cache step
[22:42:22.859] Cloning completed: 857.000ms
[22:42:22.915] Found .vercelignore
[22:42:22.922] Removed 25 ignored files defined in .vercelignore
[22:42:23.072] Running build in Washington, D.C., USA (East) – iad1
[22:42:23.238] Running "vercel build"
[22:42:23.662] Vercel CLI 41.4.1
[22:42:24.504] Installing dependencies...
[22:42:32.395] 
[22:42:32.396] added 477 packages in 8s
[22:42:32.396] 
[22:42:32.396] 168 packages are looking for funding
[22:42:32.396]   run `npm fund` for details
[22:42:32.586] 
[22:42:32.586] > astro-saturdays@0.0.1 build
[22:42:32.586] > astro build
[22:42:32.586] 
[22:42:34.305] 02:42:34 [content] Syncing content
[22:42:34.309] 02:42:34 [content] Synced content
[22:42:34.310] 02:42:34 [types] Generated 260ms
[22:42:34.311] 02:42:34 [build] output: "server"
[22:42:34.311] 02:42:34 [build] mode: "server"
[22:42:34.311] 02:42:34 [build] directory: /vercel/path0/dist/
[22:42:34.311] 02:42:34 [build] adapter: @astrojs/vercel
[22:42:34.311] 02:42:34 [build] Collecting build info...
[22:42:34.312] 02:42:34 [build] ✓ Completed in 284ms.
[22:42:34.313] 02:42:34 [build] Building server entrypoints...
[22:42:35.894] 02:42:35 [ERROR] [vite] [31m✗[39m Build failed in 1.54s
[22:42:36.007] [vite]: Rollup failed to resolve import "@/lib/schemas/settings/profile" from "/vercel/path0/src/components/settings/useSettingsForm.ts".
[22:42:36.009] This is most likely unintended because it can break your application at runtime.
[22:42:36.009] If you do want to externalize this module explicitly add it to
[22:42:36.009] `build.rollupOptions.external`
[22:42:36.010]   Stack trace:
[22:42:36.010]     at viteLog (file:///vercel/path0/node_modules/vite/dist/node/chunks/dep-DDxXL6bt.js:51612:15)
[22:42:36.010]     at onwarn (file:///vercel/path0/node_modules/@vitejs/plugin-react/dist/index.mjs:282:9)
[22:42:36.010]     at onRollupLog (file:///vercel/path0/node_modules/vite/dist/node/chunks/dep-DDxXL6bt.js:51660:5)
[22:42:36.011]     at file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:20630:32
[22:42:36.011]     at ModuleLoader.handleInvalidResolvedId (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21256:26)
[22:42:36.076] Error: Command "npm run build" exited with 1
[22:42:36.362] 