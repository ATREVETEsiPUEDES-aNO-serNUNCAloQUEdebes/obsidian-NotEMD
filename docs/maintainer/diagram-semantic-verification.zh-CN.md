# Notemd Verificacion semantica del diagrama (mantenedor）

Idioma: [English](./diagram-semantic-verification.md) | **Chino simplificado**

Este documento define la capa de verificacion semantica local del mantenedor para cambios relacionados con los graficos. Complementa las puertas duras del almacen, no las reemplaza。

Comandos auxiliares de plantilla：

```bash
npm run verify:diagram-semantics -- --vault "<vault-name>" --commit "<sha>" --version "<plugin-version>" --output ~/tmp/notemd-diagram-check.md
```

Este helper No depende de secrets。Solo genera Markdown Plantilla de verificacion、vault Percibido CLI Lista de comandos, explicita packaging-boundary、render-host audit、render-host runtime-consumption、implementation-readiness、packaging-contract、contract-promotion-boundary con Stage-C gate Bloques y bloques de evidencia para cada superficie semantica; no sera activado Obsidian、No leera las credenciales locales y no dependera de aquellas rastreadas en el almacen. vault Camino。
Entre ellos packaging-boundary La primera fila ahora tendra prioridad desde `esbuild.config.mjs` Analizar la linea principal actual. build Valor verdadero; si la configuracion de nivel superior solo pone la entrada/Delegar la produccion a acciones bundle-config helper，volvera automaticamente a `scripts/lib/esbuild-bundle-config.js`；Si ambos no se pueden analizar，helper Se generaran mensajes de marcador de posicion explicitos para evitar una deriva silenciosa de los valores de verdad de los limites.。
Si ha sido analizado `entryPoints`，Pero no estoy seguro `outfile` con `outdir`，La lista de verificacion generara un mensaje adicional de que "el objetivo de salida debe confirmarse manualmente" antes de poder sacar conclusiones.。
Si el objetivo de salida se identifica con exito, el manifiesto marcara claramente la base actual desde `outfile` todavia `outdir`，Evite sacar conclusiones vagas sobre los limites del embalaje.。
Si ambos `outfile` y `outdir`，El manifiesto lo tratara como un estado ambiguo y requerira la confirmacion manual del objetivo de salida valido antes de dar una conclusion de empaquetado.。
Entre ellos packaging-boundary Los bloques tambien `createRenderHostBundleBuildOptions()` Tratar como actual `main` en candidate-only Entrada: A menos que standalone render-host release assets、audit logic con docs Avanzar juntos en el mismo lote, de lo contrario no se puede production `esbuild.config.mjs` Consumo de camino。
Entre ellos packaging-boundary Los bloques ahora tambien estan marcados. `src/rendering/preview/renderHostRuntimeClient.ts`，Cambiar la linea principal actual fail-closed El valor de verdad tambien es explicito: en la actual linea principal de entrada unica，`resolveBundledRenderHostRuntimeModuleSpecifier()` Solo se pueden exponer los configurados explicitamente. module specifier，En caso contrario deberas regresar `null`，No se puede sintetizar de forma predeterminada. `render-host.mjs` Camino。
Entre ellos render-host audit El bloque comenzara desde `scripts/audit-render-host-bundle.js` Leer actual bundle markers、standalone-reference pattern Reglas prohibidas y standalone-output Reglas de prohibicion, cambiando el limite de divulgacion de "descripcion verbal" a verdad ejecutable. Estos marker / output / reference Unificacion de reglas `scripts/lib/packaging-contract.js` Todo, en lugar de estar disperso en copias temporales regulares dentro del guion.。
Entre ellos runtime-consumption El bloque pasara `src/main.ts`、`src/ui/DiagramPreviewModal.ts`、`src/rendering/webview/page.ts` con `src/rendering/webview/renderFrame.ts` mantener command entry → preview modal → iframe `srcdoc` → webview bridge Expliquese el valor de verdad actual del enlace.。
Entre ellos implementation-readiness El bloque hara real la linea principal actual. shipped packaging lane con release Los limites de la evidencia se fijan para evitar confundir la topologia no implementada con las capacidades actuales en el futuro.。
Entre ellos packaging-contract El bloque comenzara desde `scripts/release/publish-github-release.js` Sincronizacion release Activos、release tag NORMAS, MODELOS DE LIBERACION Y release notes El verdadero valor del contrato, y de `.github/workflows/release.yml` Sincronizacion release gatillo、tag Proteccion、workflow-source Ramificacion y chronicle-target Valor de verdad del contrato de sucursal, garantizado Stage B La definicion del contrato es consistente con las restricciones de liberacion.。release workflow de tag-trigger glob Con prohibido `v` Prefijo glob Ahora respectivamente por `scripts/lib/packaging-contract.js` en `RELEASE_WORKFLOW_TAG_TRIGGER_GLOB` con `RELEASE_WORKFLOW_DISALLOWED_TAG_TRIGGER_GLOBS` Propiedad unificada；YAML permanecer bootstrap Literal, porque GitHub Actions Estara alli checkout Almacen JavaScript Analisis previo tag trigger，La prueba en el almacen es responsable de bloquear este literal para shared contract。
Entre ellos contract-promotion-boundary El bloque comenzara desde `src/operations/registry.ts` Leer workflow/settings/export Los metadatos actuales de las operaciones adyacentes garantizan que la conclusion de la mejora de la capacidad siga estando ligada a la realidad. `automationLevel` / `requiredContext` / `sideEffectClass`。
Entre ellos Stage-C gate Los bloques se utilizan para bloquear explicitamente la expansion topologica posterior a menos que packaging boundary、render-host audit、runtime-consumption、release contract con contract-promotion boundary Los cinco niveles de la verdad avanzan juntos。

## 1. ¿Cuando debe esto? Runbook

Esta verificacion debe realizarse cuando los cambios toquen cualquiera de los siguientes rangos：

- `src/diagram/**`
- `src/mermaidProcessor.ts`
- `src/rendering/**`
- Comandos que cambian el comportamiento de generacion, vista previa, guardado o exportacion de graficos. wiring

Si los cambios se limitan a documentos, copia estatica o no estan relacionados con diagramas provider Logico, no hay necesidad de ejecutar esto. runbook。

## 2. Dentro del almacen CI Lo que ha sido probado

Las puertas duras a nivel de almacen solo pueden demostrar integridad de construccion y automatizacion parcial.：

```bash
npm run build
npm test -- --runInBand
npm run audit:i18n-ui
npm run audit:render-host
git diff --check
```

Estos controles**No puedo**Prueba Mermaid El producto es real. Obsidian Sigue siendo visualmente correcto en la conversacion y no se puede demostrar. JSON Canvas / Vega-Lite No hay degradacion en el comportamiento de un extremo a otro en el hosting de escritorio。

Ellos tambien**No es igual a**Los tiempos de ejecucion pesados se han aislado verdaderamente como activos empaquetados de forma independiente.。`npm run audit:render-host` Actualmente solo se puede probar un hecho de divulgacion obligatoria: en linea `srcdoc` host Todavia autonomo `main.js` Liberen juntos y la linea principal actual se compartira a traves de packaging contract Rechazar residuos `render-host.mjs` Activos o Referencias。helper de packaging-boundary El bloque anadira otra capa de claridad sobre esta base. anti-drift Verificar: Linea principal de entrada unica actual latent runtime helper Los valores predeterminados no pueden reintroducirse silenciosamente standalone runtime-module Camino。
Todavia funciona para source/build split Agrega una segunda capa anti-drift Inspeccion：render-host bundle build helper Puede continuar en el codigo fuente como codigo candidato futuro, pero actualmente production build con release contract debe continuar tratando su produccion como non-shipped。

## 3. Regulaciones ambientales

- Utilice local mantenido por el mantenedor vault，No depende del seguimiento en el almacen. vault Camino。
- En tiempo real LLM Generar y mantener por mantenedores guardados fuera del almacen. API Credenciales。
- No te presentes secrets、vault Configuracion exclusiva, capturas de pantalla que contienen notas privadas o temporales live test Documentacion。
- Las inspecciones ambientales dan prioridad al uso de entradas de envases estables `obsidian-cli`，Pero cuando necesite verificar la superficie de comando real del escritorio, debe usar el nativo `obsidian` CLI。

Comprobaciones ambientales disponibles.：

```bash
obsidian help
obsidian-cli help
obsidian vaults verbose
obsidian plugin id=notemd vault=<vault-name>
obsidian commands vault=<vault-name> filter=notemd
```

## Public CLI Surface Contract

Actual public-safe CLI slice Todavia permanecen deliberadamente restringidos. orden exacto ID Solo：

- `notemd:export-provider-profiles-redacted`
- `notemd:export-cli-capability-manifest`
- `notemd:export-cli-invocation-contract`
- `notemd:export-cli-public-surface`

Reglas de exclusion：

- `notemd:export-provider-profiles` Aun no puedo entrar public-safe slice，Porque viene con `outputHandlingTags=contains-provider-credentials`
- Actual public-safe slice La descripcion de `docs/maintainer/notemd-cli-capability-matrix.zh-CN.md` prevalecera y con el mismo conjunto registry-backed capability / contract Los metadatos se mantienen sincronizados

## 4. Debe probar la superficie semantica.

Las modificaciones calificadas deben cubrir los siguientes tres tipos de superficies afectadas:：

### Mermaid

Verifique que al menos uno producira Mermaid notas。

Revisar articulos：

- El proceso de generacion se puede completar sin sorpresas. fallback Fracaso
- El producto en conserva se puede almacenar en Obsidian Abrir en
- Los graficos renderizados son visualmente completos y utilizables.
- Si se espera que desencadene Mermaid auto-fix，El archivo guardado debe reflejar los resultados de la reparacion.

Evidencia sugerida：

- Ruta del archivo de salida despues de guardar
- Mermaid Vista previa de captura de pantalla o registro de confirmacion visual equivalente

### JSON Canvas

Verifique que al menos uno producira `.canvas` notas。

Revisar articulos：

- El archivo de salida se crea correctamente con la extension esperada.
- Canvas Disponible en Obsidian Abrir y sin error de carga
- Nodo/Existen bordes en lugar de graficos vacios o corruptos.

Evidencia sugerida：

- Despues de guardar `.canvas` Ruta del archivo
- abierto canvas Captura de pantalla

### Vega-Lite

Verifique que al menos uno producira `vega-lite` notas。

Revisar articulos：

- El producto conservado contiene lo esperado. fenced `vega-lite` block
- La vista previa se puede abrir normalmente a traves de la ruta de vista previa del complemento.
- El grafico en realidad se muestra en lugar de en blanco o broken host Salida

Evidencia sugerida：

- Guardar ruta del archivo
- Vista previa del cuadro modal o captura de pantalla de representacion del grafico

## 5. Proceso de verificacion minimo

A menos que el alcance del cambio sea mas limitado, proceda en el siguiente orden：

1. Ve primero a la puerta dura del almacen.。
   O generar una plantilla de inspeccion que se pueda completar directamente：
   ```bash
   npm run verify:diagram-semantics -- --vault "<vault-name>" --commit "<sha>" --version "<plugin-version>" --output ~/tmp/notemd-diagram-check.md
   ```
2. Pruebe localmente vault Medio reload Complementos。
3. Pase CLI Confirmar la disponibilidad del complemento y el estado de exposicion del comando。
4. En realidad Obsidian En realidad, tome la ruta del grafico afectado en。
5. Preservar evidencia de cada superficie afectada。
6. Registre los resultados en PR Descripcion、release handoff O en el registro del mantenedor。

helper Ahora generado adicionalmente packaging-boundary、render-host audit、render-host runtime-consumption、implementation-readiness、packaging-contract、contract-promotion-boundary con Stage-C gate Siete cuadras. Mientras los cambios toquen render-host、preview、workflow/settings o comportamiento de tiempo de ejecucion mas pesado, estos parrafos no deben omitirse: le recordaran claramente el modelo de empaquetado actual, el enlace de entrada de comando y release / Las restricciones del contrato operativo deben sincronizarse entre si.。

## 6. Formato de la evidencia

Registre al menos lo siguiente：

- usado vault Nombre
- Version complementaria / Sucursal / commit
- Superficie afectada：Mermaid、JSON Canvas、Vega-Lite
- Comandos utilizados
- Ruta del archivo del producto
- Resultados：pass/fail
- Ruta de captura de pantalla, o indicar que se ha realizado una inspeccion visual en tiempo real

Ejemplo：

```text
Vault: test
Commit: <sha>
Surface: Vega-Lite
Command: notemd-preview-diagram
Artifact: Notes/Topic.md
Result: PASS
Evidence: screenshot saved locally at ~/tmp/notemd-vega-preview.png
```

## 7. Relacion con la documentacion del proceso de liberacion

Ben runbook Necesidad y `docs/maintainer/release-workflow.md` Uselo junto con。

- `release-workflow.md` Responsable de definir las puertas duras y CI Comportamiento。
- Ben runbook Responsable de la definicion. renderer Se requiere una capa de verificacion semantica local para cambios relacionados。

Si un cambio afecta la semantica del diagrama pero no tiene ninguna evidencia de verificacion semantica, incluso si la verificacion automatizada esta completamente en verde, debe considerarse como una preparacion incompleta para su publicacion.。
