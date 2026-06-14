# Notemd Proceso de liberacion (mantenedor）

Idioma: [English](./release-workflow.md) | **Chino simplificado**

Este documento es para mantenedores y contribuyentes, no para usuarios finales comunes.。

## 1. Regreso a la linea de base

Recopile primero la linea de base antes del cambio.：

```bash
npm run regression:language-baseline
```

Despues de completar los cambios, comparelo con la ultima linea de base.：

```bash
npm run regression:language-compare
```

## 2. Verificar el acceso antes de publicar

Ejecucion：

```bash
npm run chronicle:sync-repo-saga
npm run chronicle:update
npm run build
npm test -- --runInBand
npm run audit:i18n-ui
npm run audit:render-host
obsidian help
obsidian-cli help
git diff --check
```

`npm run chronicle:sync-repo-saga` Con `npm run chronicle:update` Debe ejecutarse en serie. ellos comparten `.cache/repo-saga-*` estado, y ahora se aplicara `.cache/.repo-saga-execution.lock`；Si quedan archivos de bloqueo restantes, primero confirme que no hay repo-saga sync/update Si el proceso aun se esta ejecutando, eliminelo manualmente.。

Si falta el entorno local `obsidian-cli`，Documente esto claramente en las notas de la version o en la evidencia de entrega.。
Si el cambio toca la semantica del diagrama, tambien se debe ejecutar. `docs/maintainer/diagram-semantic-verification.zh-CN.md` Capa de verificacion semantica local del mantenedor definida en。
Comandos auxiliares recomendados：
```bash
npm run verify:diagram-semantics -- --vault "<vault-name>" --commit "<sha>" --version "<plugin-version>" --output ~/tmp/notemd-diagram-check.md
```
El helper Seguira `esbuild.config.mjs` Extraiga la entrada del paquete actual./Salida del hecho; si la configuracion de nivel superior solo pone la entrada de compilacion/Delegar la produccion a acciones helper，volvera a caer a `scripts/lib/esbuild-bundle-config.js` Continue analizando; tambien comenzara desde `src/rendering/preview/renderHostRuntimeClient.ts` Extraccion latent runtime-module specifier Valor de verdad, de `scripts/audit-render-host-bundle.js` Extraccion render-host audit valor de verdad, mientras audit de marker / output / reference Las reglas se rigen por `scripts/lib/packaging-contract.js` Proporcionado uniformemente; tambien sera proporcionado desde `src/main.ts`、`src/ui/DiagramPreviewModal.ts`、`src/rendering/webview/page.ts` Con `src/rendering/webview/renderFrame.ts` Extraccion runtime-consumption Valor de verdad, de `scripts/release/publish-github-release.js` Extraccion release Hechos del contrato de paquete, de `.github/workflows/release.yml` Extraccion release Gatillo、tag Proteccion、workflow-source Sucursal con chronicle-target Hechos del contrato de sucursal y de `src/operations/registry.ts` Extraer los hechos de los limites de promocion del contrato de operacion; evaluacion renderer Al declarar limites, estos archivos deben usarse como paquetes./Fuente de la verdad del contrato。
Para renderer Tambien deberian realizarse cambios pertinentes helper Generado packaging-boundary、render-host audit、render-host runtime-consumption、implementation-readiness、packaging-contract、contract-promotion-boundary Con Stage-C gate Todos los bloques se consideran elementos de mantenimiento del valor de verdad requeridos.：`npm run audit:render-host` Esto no significa que se haya completado el verdadero aislamiento del tiempo de ejecucion de servicio pesado; actualmente solo se demuestra en linea. `srcdoc` host Sigue siendo autonomo segun el contrato existente. `main.js`，Y sera compartido por packaging contract Rechace el contenido restante en la linea principal actual. `render-host.mjs` Bienes o Referencias。
En la linea principal actual de entrada unica, esto packaging-boundary La verdad tambien requiere latent runtime helper mantener fail-closed：A menos que dedicated runtime asset Estar configurado y enviado explicitamente en el mismo lote; de ​​lo contrario, no se sintetizara de forma predeterminada. standalone `render-host.mjs` module specifier。
Tambien exige que la actual `main` en `createRenderHostBundleBuildOptions()` mantener candidate-only：A menos que standalone render-host release assets、audit logic、maintainer/release docs Avanza con el mismo lote, de lo contrario production `esbuild.config.mjs` El camino no debe consumirlo。
packaging-contract Los bloques ahora tambien registran cifras tag Reglas、workflow tag-trigger glob Reglas、create/upload Comportamiento del modo de liberacion、tag-only Proteccion del gatillo、workflow-source Sucursal con chronicle-target Sucursales; Estos tambien deben considerarse el mismo conjunto. release Parte del contrato de valor de verdad, en lugar de depender unicamente de la memoria del proceso verbal.。

## 3. Sincronizacion de versiones

Asegurese de que las versiones de los siguientes archivos sean consistentes antes de publicarlos.：

- `package.json`
- `manifest.json`
- `versions.json`
- `README.md`
- `README_zh.md`
- `change.md`

Release tag Se deben utilizar numeros puros `x.x.x` Formato, no se puede agregar. `v` Prefijo；Obsidian Los lanzamientos de complementos comunitarios solo aceptan versiones digitales. tag。

## 4. Release Notes Contrato

Las notas de la version ahora estan divididas en dos archivos completos.：

- ingles：`docs/releases/<tag>.md`
- Chino simplificado：`docs/releases/<tag>.zh-CN.md`

Ambos archivos deben poder leerse de forma independiente. publicar GitHub Release Cuando, los guiones auxiliares en el almacen se combinan en un bilingue release body。

## 5. GitHub Release Requisitos de activos

Release Activos necesarios：

- `main.js`
- `manifest.json`
- `styles.css`
- `README.md`

## 6. Emitir ordenes

```bash
npm run release:github -- <tag>
```

Este comando auxiliar se llamara despues de llamar GitHub Activos que deben empaquetarse antes de la verificacion obligatoria, asi como dos presentados release notes：

- Si release Si aun no existe, se combinara primero. `docs/releases/<tag>.md` Con `docs/releases/<tag>.zh-CN.md`，Ejecutar de nuevo `gh release create ... --verify-tag`。
- Si release ya existe, estos dos documentos bilingues se utilizaran primero. notes Escribe de nuevo lo existente release de body/title，Luego ejecuta `gh release upload ... --clobber`。
- Si tag No es un numero puro `x.x.x`，fallara inmediatamente.。

El segundo camino es el camino de reparacion para este tipo de problema: cuando release Redaccion publicitaria y almacen. notes Deriva, o release Cuando se haya publicado la copia pero no se hayan cargado los recursos de instalacion del complemento, podra corregirla y cargarla directamente.。

## 7. CI Automatizacion

El almacen ya esta construido. `.github/workflows/release.yml`：

- Empujar git tag Publicar automaticamente cuando release。
- Pase `workflow_dispatch` Y pasar numeros puros `x.x.x` de `tag` Parametros, disponibles en CI Fijo en el medio release。
- El mismo flujo de trabajo ahora regenera cronicas de desarrollo trimestrales despues del lanzamiento, actualizando todas las raices. `README*.md` Bloquea la cronica en , reescribe la correspondiente. `docs/repo-saga/notemd-development-history.<locale>.svg`，Actualizar sincronicamente los alias en ingles `docs/repo-saga/notemd-development-history.svg`，Y retrasar esta actualizacion de solo documentacion `main`。
- `npm run chronicle:sync-repo-saga` Las dos aguas arriba que actualmente dependen seran `repo-saga` Montaje de sucursales en `.cache/repo-saga-upstream`：`feat/timeline-granularity` Proporcionar capacidades de corte trimestrales，`feat-locale-i18n` Proporcionar capacidades de expansion del idioma.。
- El flujo de trabajo**No**en `main` ordinario push o PR Ejecutar automaticamente; La verificacion previa a la fusion aun debe realizarse localmente.。
- `main` Ninguno por el momento branch protection，No existe lo ordinario push/PR workflow。Si commit-status API en `main` Mostrar en `pending` y `statuses=[]`，deberia GitHub Actions runs Con `check-suites` / `check-runs` Los resultados como fuente del estado verdadero；release tag Las ejecuciones activadas aun pueden tener exito checks Cuelgue lo mismo commit en。
- El flujo de trabajo ahora esta arreglado `actions/checkout@v6` Con `actions/setup-node@v6`，Evite conservar versiones antiguas Node 20 JavaScript-action Advertencia de obsolescencia del tiempo de ejecucion。
- Liberacion job Ejecutara `npm ci`、`npm run build`、`npm test -- --runInBand`、`npm run audit:i18n-ui`、`npm run audit:render-host`、`git diff --check`，Ejecucion final `npm run release:github -- "$TAG_NAME"`。
- Cronicas posteriores job Estara alli `main` Ejecutar en `node scripts/repo-saga/update-quarterly-saga.mjs --tag "$TAG_NAME"`，Si `README*.md` Bloque de cronica o trimestre multilingue SVG Si hay cambios, se enviaran y enviaran automaticamente.。
- workflow-source checkout Sucursal con chronicle push El objetivo ahora estara en workflow se nombran explicitamente como `NOTEMD_RELEASE_WORKFLOW_SOURCE_BRANCH` Con `NOTEMD_RELEASE_CHRONICLE_TARGET_BRANCH`，El contrato predeterminado en el lado del almacen es `scripts/lib/packaging-contract.js` tubo。GitHub Actions Por primera vez checkout Todavia es necesario antes bootstrap env Valor, pero guion、helper Los resultados y las pruebas ahora usan estos nombres de rama como release-contract Procesar el valor de verdad en lugar de mantener cada uno release Valores predeterminados del script。
- release workflow de tag trigger Seguira conservando GitHub Actions bootstrap Literales `*.*.*`，Pero el dueno de este literal es ahora `scripts/lib/packaging-contract.js` en `RELEASE_WORKFLOW_TAG_TRIGGER_GLOB`；`RELEASE_WORKFLOW_DISALLOWED_TAG_TRIGGER_GLOBS` voluntad `v*.*.*` / `V*.*.*` Exclusion de la lista de activacion. esto wildcard Solo decide workflow Ya sea para empezar o no, realmente digital puro `x.x.x` La admision sigue siendo determinada por la persona que se ha registrado. tag validator Ejecucion。
- El script de actualizacion de la cronica ahora tambien reconstruira el local primero. `repo-saga` Cache integrado: basado en ramas de granularidad de tiempo y luego superpuestas locale/i18n Bifurca el archivo correspondiente y luego llamalo. `repo-saga` CLI。
- El script de actualizacion de Chronicle ahora tambien es obligatorio `.cache/.repo-saga-execution.lock` Bloqueo de ejecucion de instancia unica para evitar local o CI La actualizacion simultanea destruye el estado de la cache compartida。
- Este conjunto de scripts ahora tambien agrega un administrador de paquetes. fallback Robustez: Si solo existen `corepack` o `bun x pnpm`，El script creara un archivo local adicional que el proceso secundario puede heredar. `pnpm` shim，Asegurar aguas arriba `repo-saga` workspace build Llamadas anidadas en `pnpm` Guion en CI Todavia se puede ejecutar。
- El flujo de trabajo ahora estara en checkout release ref Previamente registrado `scripts/release/validate-release-tag.js` helper hacer tag Verificacion, por tanto CI Con el almacen release helper Reutiliza el mismo conjunto de numeros puros. tag Pacto y seguir negandose. `v1.8.2` Este tipo tag。

El flujo de trabajo reutiliza deliberadamente la informacion del almacen. release Scripts de ayuda en lugar de en YAML-local Mantenimiento de inventario de activos duplicados en fragmentos de guion、release notes Logica、tag Cheque o chronicle Valor predeterminado de la rama de destino para evitar la deriva de multiples conjuntos de reglas。

## 8. Capa semantica del grafico

Cualquier cosa que afecte renderer Los cambios de comportamiento requieren un almacen CI Una capa adicional de verificacion：

- uso `docs/maintainer/diagram-semantic-verification.zh-CN.md`
- Si necesita una plantilla de entrega reutilizable, primero puede ejecutar `npm run verify:diagram-semantics -- --vault "<vault-name>" --commit "<sha>" --version "<plugin-version>" --output ~/tmp/notemd-diagram-check.md`
- En local real vault Afectados por la verificacion Mermaid / JSON Canvas / Vega-Lite Camino
- en release handoff o PR Registre la evidencia en la descripcion.

Cuando los cambios implican la generacion de graficos o el comportamiento de vista previa, las comprobaciones automaticas por si solas no son suficientes.。
