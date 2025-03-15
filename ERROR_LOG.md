[20:44:53.893] Cloning github.com/pchae/astro-saturdays (Branch: main, Commit: 5450235)
[20:44:54.757] Cloning completed: 864.000ms
[20:44:55.029] Restored build cache from previous deployment (CjvQfp1hwna7BwtS5WM11NKQHmL1)
[20:44:55.144] Running build in Washington, D.C., USA (East) – iad1
[20:44:55.542] Running "vercel build"
[20:44:55.922] Vercel CLI 41.3.2
[20:44:56.511] Running "install" command: `npm install`...
[20:44:58.575] 
[20:44:58.576] up to date, audited 430 packages in 2s
[20:44:58.576] 
[20:44:58.576] 164 packages are looking for funding
[20:44:58.577]   run `npm fund` for details
[20:44:58.587] 
[20:44:58.588] 3 high severity vulnerabilities
[20:44:58.588] 
[20:44:58.588] To address all issues (including breaking changes), run:
[20:44:58.588]   npm audit fix --force
[20:44:58.589] 
[20:44:58.589] Run `npm audit` for details.
[20:44:58.840] 
[20:44:58.840] > astro-saturdays@0.0.1 build
[20:44:58.840] > astro build
[20:44:58.840] 
[20:44:59.381] Error: Cannot find package '/vercel/path0/node_modules/zwitch/index.js' imported from /vercel/path0/node_modules/hast-util-raw/lib/index.js
[20:44:59.381]     at legacyMainResolve (node:internal/modules/esm/resolve:204:26)
[20:44:59.381]     at packageResolve (node:internal/modules/esm/resolve:778:12)
[20:44:59.381]     at moduleResolve (node:internal/modules/esm/resolve:854:18)
[20:44:59.381]     at defaultResolve (node:internal/modules/esm/resolve:984:11)
[20:44:59.381]     at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:685:12)
[20:44:59.381]     at #cachedDefaultResolve (node:internal/modules/esm/loader:634:25)
[20:44:59.381]     at ModuleLoader.resolve (node:internal/modules/esm/loader:617:38)
[20:44:59.381]     at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:273:38)
[20:44:59.381]     at ModuleJob._link (node:internal/modules/esm/module_job:135:49) {
[20:44:59.382]   code: 'ERR_MODULE_NOT_FOUND'
[20:44:59.382] }
[20:44:59.397] Error: Command "npm run build" exited with 1
[20:44:59.624] 