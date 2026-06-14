# Notemd CLI Matriz de capacidades

> Actualizacion：2026-05-28

## Descripcion del estado actual（2026-05-25）

Breve conclusion: actual `main` en CLI La situacion actual es un modelo de dos niveles deliberadamente estratificado en lugar de una unica entrada general ampliada.。

Ya en current `main` Contenido implementado：

- registry-backed operation Metadatos
- escribiendo capability / invocation Exportar
- Despues de la convergencia public-safe export rebanada
- Cubrir lo mismo export Cortar con soporte explicito adicional JSON / Documentacion payload de path-based maintainer helper

Actualmente no hay reclamaciones.：

- Gran calibre orientado al usuario CLI API
- Cambiar la corriente path-based maintainer operations Promovido directamente a public-safe slice
- Amplio calibre para procesos de procesamiento de notas variables public CLI API

Este es un documento controlado por el mantenedor que se utiliza para distinguir：

- Hoy puede ser oficialmente `obsidian` CLI Comando activado
- Que comandos son adecuados para la automatizacion y cuales solo para activacion manual
- ¿Cuales son los niveles inferiores? Notemd La habilidad debe extraerse primero. first-class operations，Habla mas ampliamente CLI Exposicion

## Automation Levels

| Level | significado |
|---|---|
| `safe` | No interactivo, lo suficientemente determinista y puede activarse mediante secuencias de comandos. |
| `requires-active-file` | Se requieren notas de actividad/El contexto del archivo, actualmente no debe considerarse un punto final de automatizacion generico. |
| `requires-selection` | Confie en la seleccion del editor o el estado del editor interactivo |
| `interactive-ui` | Dependencia modal、picker、preview、split-pane U otros artificiales UI Proceso |

## Oficial CLI Superficie del gatillo

Datos actuales sobre el anfitrion：

- `obsidian commands filter=notemd` Puede enumerar los comandos de complementos actuales
- Oficial CLI Puede pasar `obsidian command id=<command-id>` Activa estos comandos
- Pero esto sigue siendo solo una superficie desencadenante, no una capa de integracion escrita madura.
- Ahora registry exportado capability manifest El panel de comando, teclas de acceso directo, oficial. CLI Las tres superficies del gatillo se cuelgan en el mismo conjunto. command binding Metadatos

## Rebanada de seguridad publica despues de la convergencia actual

Actual public-safe slice Limitado deliberadamente a incluir solo comandos que cumplan con las siguientes condiciones：

- `safe`
- `requiredContext=none`
- `mappingKind=exact`
- Expuesto al funcionario CLI trigger surface Sube
- input schema Objeto vacio

Esta corriente slice Comandos en ID Esta claro que solo：

- `notemd:export-provider-profiles-redacted`
- `notemd:export-cli-capability-manifest`
- `notemd:export-cli-invocation-contract`
- `notemd:export-cli-public-surface`

Reglas de restriccion：

- Originales provider export Porque tiene `outputHandlingTags=contains-provider-credentials` Exclusion
- redacted provider export Se negara activamente a importar para evitar que los archivos insensibilizados se confundan con la reintroduccion. live settings Instantanea
- redacted export La informacion privada aun puede estar expuesta/custom `baseUrl` Informacion de infraestructura, por lo que es mejor que raw export Ser mas seguro no significa que se pueda compartir publicamente sin censura.

## Repo-Local Maintainer Helper

El almacen ahora tambien cuenta con una pequena maintainer helper，La capa inferior todavia esta `obsidian-cli native eval`：

- help：`npm run cli:help`
- invoke：`npm run cli:invoke -- --vault <vault> --operation <operation-id> [--input-file <path> | --input-json '<json>'] [--pretty]`
- Actualmente solo se admite operation id：
  - `content.batch-generate-from-titles`
  - `content.split-note-by-chapters`
  - `research.summarize-topic`
  - `diagram.generate`
  - `local-knowledge.inspect`
  - `provider.profile.export-redacted`
  - `cli.capability-manifest.export`
  - `cli.invocation-contract.export`
  - `cli.public-surface.export`

Limites：

- Esto es maintainer-grade repo Herramientas, no public CLI API
- El directorio de operaciones converge uniformemente en `scripts/lib/maintainer-cli-operation-help.js`，Como metadatos de ayuda compartidos y para path-based operations Proporcionar sencillez example payload
- export operations Todavia solo acepta nulos payload；Las operaciones de contenido controlado deben proporcionarse explicitamente JSON Entrada
- Minimo inspect Ejemplo：`npm run cli:invoke -- --vault docs --operation local-knowledge.inspect --input-json '{"taskScope":"diagramGeneration","sourcePath":"index.zh-CN.md","knowledgePaths":["maintainer","superpowers"]}' --pretty`
- Correcto `--vault docs` Hablemos，`sourcePath` con `knowledgePaths` Todo debe escribirse como vault-relative camino; debe ser usado `index.zh-CN.md`、`maintainer`，en lugar de `docs/index.zh-CN.md`、`docs/maintainer`
- `local-knowledge.inspect` Se mantiene deliberadamente maintainer-only de explainability surface：Quedara expuesto task scope、Resultados reales y efectivos del analisis de la ruta de la base de conocimientos, explicitos o derivados automaticamente. query、query diagnostics、current-file exclusion Entrada、retrieval options、Ruta del archivo candidato, formato original context、Estructura `contextBlocks` Evidencia y estructuracion retrieval Resumen, pero no ampliado por ello. public CLI Contrato
- `local-knowledge.inspect` Actualmente habra tres query Rutas derivadas explicitamente expuestas y bloqueadas por pruebas.：`explicit`（Consultas de investigacion directa）、`basename`（Titulo/Alcance de la tarea del titulo del lote) y `diagram-source`（Archivos fuente de tareas generadas a partir de graficos. basename + stripped note content Derivacion comun）。inspect El resultado ahora se complementara con limites query diagnostics，Por ejemplo `index.*` Este tipo de nombre de archivo de navegacion de senal baja se proporciona generic navigation-basename caution
- `local-knowledge.inspect` Ahora tambien admite temporales. `knowledgePaths` override Matriz, el mantenedor puede guardarla sin cambiarla. settings Bajo la premisa de instantaneas, utilice archivos temporales./Verificacion de la lista de rutas de carpetas task-scoped retrieval Comportamiento
- `local-knowledge.inspect` Ahora el estado de fracaso sigue siendo explainability Retenga explicitamente, en lugar de aplastar, todos los errores en el mismo resultado vacio.：`retrieverBuildStatus` Puede distinguir `no-paths`、`no-candidate-files`、`no-retrievable-sections` con `ready`，Sin dejar de conservar `candidateFilePaths` Con estructuracion retrieval Resumen para que los mantenedores localicen problemas.
- Ahora se ha anadido para acercarlo mas a la realidad. task-scoped retrieval vinculado inspect Ejemplos, no solo diagram lane：
  - `npm run cli:invoke -- --vault docs --operation local-knowledge.inspect --input-json '{"taskScope":"batchGenerateFromTitles","sourcePath":"index.zh-CN.md"}' --pretty`
  - `npm run cli:invoke -- --vault docs --operation local-knowledge.inspect --input-json '{"taskScope":"researchSummarize","query":"task-scoped retrieval behavior","knowledgePaths":["maintainer"]}' --pretty`
  - `npm run cli:invoke -- --vault docs --operation local-knowledge.inspect --input-json '{"taskScope":"researchSummarize","query":"chapter split TOC managed artifacts guarded reruns","knowledgePaths":["chapter-split-toc.md","chapter-split-toc.zh-CN.md"]}' --pretty`
  - `npm run cli:invoke -- --vault docs --operation local-knowledge.inspect --input-json '{"taskScope":"researchSummarize","query":"real-note query diversity beyond chapter split showcase","knowledgePaths":["brainstorms","maintainer"],"topK":2,"slidingWindowSize":1}' --pretty`
  - `npm run cli:invoke -- --vault docs --operation local-knowledge.inspect --input-json '{"taskScope":"batchGenerateFromTitles","sourcePath":"brainstorms/2026-05-28-mainline-progress-audit-and-next-level-direction.md","knowledgePaths":["brainstorms","maintainer"],"topK":2,"slidingWindowSize":1}' --pretty`
  - `npm run cli:invoke -- --vault docs --operation local-knowledge.inspect --input-json '{"taskScope":"diagramGeneration","sourcePath":"index.zh-CN.md","knowledgePaths":["brainstorms","maintainer"],"topK":2,"slidingWindowSize":1}' --pretty`
- `content.split-note-by-chapters` Ahora tambien admite opciones opcionales. `splitHeadingLevel`（`auto`、`h1`-`h6`），Los scripts pueden evitar seguir dependiendo implicitamente de la situacion actual. settings Instantanea
- `content.split-note-by-chapters` Los resultados de ahora tambien se exponen explicitamente `requestedSplitHeadingLevel`、`chapterNotePaths`、`managedArtifactPaths`、`removedStalePaths`、determinista `tocMetadata` y estable `nestedHeadings[].blockId`，Las personas que llaman desde la automatizacion ya no tienen que depender de reglas de nombres de archivos o ambiguedades de titulos duplicados para inferir managed artifact Coleccion、TOC front-matter metadata con TOC Metas；rerun Shiruo manifest Los archivos generados administrados se han modificado manualmente y la implementacion actual tambien se negara a sobrescribirlos o eliminarlos silenciosamente.
- Estos path-based Las operaciones de mantenimiento aun deben mantener los efectos secundarios, los contratos de salida y la semantica de fallas hasta que esten unidos como contratos publicos. maintainer-only

## Matriz de mando actual

| Command ID | Uso actual | Automation Level | Por que aun no es un proyecto estable API | Registry operation Mapeo |
|---|---|---|---|---|
| `notemd:test-llm-connection` | Verificar la corriente provider Conectividad | `safe` | La escritura ahora esta disponible input/result schema，Pero interactivo busy/reporter Camino y notice La copia todavia pertenece al anfitrion. UI Semantica | `provider.connection.test`（`exact`） |
| `notemd:run-developer-provider-diagnostic` | Ejecutar solicitudes largas provider Diagnostico | `safe` | La escritura ahora esta disponible input/result schema，Sin embargo, el comportamiento de la red de solicitudes largas y la ubicacion del informe de diagnostico estan aun mas cerca maintainer-grade surface，En lugar de estabilidad public API | `provider.diagnostic.run`（`exact`） |
| `notemd:run-developer-provider-stability-diagnostic` | Ejecutar varias veces provider Diagnostico de estabilidad | `safe` | La escritura ahora esta disponible input/result schema，Pero repite la verdad provider Llamar esta aun mas cerca maintainer-grade diagnostic surface，En lugar de estabilidad public API | `provider.diagnostic.stability-run`（`exact`） |
| `notemd:export-provider-profiles` | Exportar original provider profile Instantanea | `safe` | Certeza y machine-readable，Pero el archivo de exportacion en si contiene provider Credenciales, asi que todavia maintainer-sensitive surface，No pertenece public-safe slice | `provider.profile.export` |
| `notemd:export-provider-profiles-redacted` | Exportar los insensibilizados provider profile Instantanea | `safe` | Pertenece a la convergencia actual public-safe slice。Certeza、machine-readable、Quitara API Key，Y se le negara activamente la importacion, pero aun podra exponer datos privados./custom endpoint Metadatos | `provider.profile.export-redacted` |
| `notemd:import-provider-profiles` | Importar provider profile Instantanea | `safe` | machine-readable，Pero cambiara active provider Estado y configuracion del complemento | `provider.profile.import` |
| `notemd:export-cli-capability-manifest` | Comando de exportacion capability manifest | `safe` | Pertenece a la convergencia actual public-safe slice。Exporta bien, pero el complemento aun esta vinculado config-path Escribir semantica | `cli.capability-manifest.export` |
| `notemd:export-cli-invocation-contract` | Exportar mecanografia invocation contract | `safe` | Pertenece a la convergencia actual public-safe slice。Exporta bien, pero el complemento aun esta vinculado config-path Escribir semantica | `cli.invocation-contract.export` |
| `notemd:export-cli-public-surface` | Exportar el publico convergente actual CLI Superficie | `safe` | Pertenece a la convergencia actual public-safe slice。La exportacion autodescribira el funcionario actualmente admitido. CLI Subconjunto seguro | `cli.public-surface.export` |
| `notemd:notemd-generate-diagram` | Generar a partir del archivo de actividad spec-first artifact | `requires-active-file` | Los resultados escritos ahora estan completamente expuestos. wrapper envelope，y ademas incluir explicitamente follow-through Detalles（`kind`、`executionMode`、`sourcePath`、`actionLabel`、`operationInput`、`generation`、`followThrough`、`outputPath`、`previewOpened`）；Para artifact-generation modes，Tambien se sacara a relucir explicitamente machine-readable Resumen de busqueda de la base de conocimientos local（`localKnowledgeContextUsed`、`localKnowledgeRetrieval`），Pero active-file Dependencias, estado del complemento y guardado/Activar los efectos secundarios aun impide que se declare directamente estable. public API | `diagram.generate`（`exact`，`defaultInput.outputMode=artifact`） |
| `notemd:notemd-summarize-as-mermaid` | Guardar para archivos activos Mermaid Salida | `requires-active-file` | Los resultados escritos ahora estan completamente expuestos. wrapper envelope，y ademas incluir explicitamente follow-through Detalles（`kind`、`executionMode`、`sourcePath`、`actionLabel`、`operationInput`、`generation`、`followThrough`、`outputPath`、`previewOpened`），Pero active-file La semantica de preservacion de la dependencia y la gestion de complementos aun impiden que se declare directamente estable. public API | `diagram.generate`（`exact`，`defaultInput.outputMode=mermaid`） |
| `notemd:notemd-preview-diagram` | Vista previa guardada/Grafico generado | `interactive-ui` | La escritura ahora esta disponible input/result schema describir preview artifact Limite, pero abierto preview modal todavia pertenece a UI-only El proceso no tiene estabilidad de automatizacion. | `diagram.preview`（`exact`） |
| `notemd:process-with-notemd` | Procese el archivo actual y agregue enlaces. | `requires-active-file` | El resultado del archivo estructurado ya existe, pero active-file Dependencias, creacion de notas conceptuales, estrategia de ruta de resultados y vault Los efectos secundarios de la sobrescritura aun obstaculizan la automatizacion estable | `file.process-add-links` |
| `notemd:process-folder-with-notemd` | Carpetas de proceso por lotes | `interactive-ui` | El resultado del lote estructurado ya existe y contiene `savedCount` / `errors` / `cancelled`，Pero seleccion de carpetas, ejecucion de reescritura por lotes y posprocesamiento Mermaid auto-fix Todavia impulsado por el anfitrion. | `file.process-folder-add-links` |
| `notemd:generate-content-from-title` | Generar contenido a partir de titulos. | `requires-active-file` | Los resultados estructurados ahora tambien se muestran explicitamente `localKnowledgeContextUsed` con machine-readable de `localKnowledgeRetrieval` Resumen（`matchedSectionCount`、`returnedHitCount`、`sourcePaths`、sliding-window / current-file-exclusion telemetry、index/query timing、context-char count），Pero active-file Dependencias, semantica de reescritura de contenido y opcionalidad. research Los efectos secundarios todavia estan vinculados al host del complemento. | `content.generate-from-title` |
| `notemd:batch-generate-content-from-titles` | Generacion de titulos por lotes | `interactive-ui` | Los resultados por lotes estructurados ahora tambien muestran lo mismo para cada archivo local-KB retrieval Resumen y timing/size telemetry，y seguir reteniendo complete-folder move Errores de semantica y agregacion, pero seleccion de carpetas, progreso. UI con vault Reescribir aun requiere la coordinacion del anfitrion | `content.batch-generate-from-titles` |
| `notemd:split-note-by-chapters` | Divida las notas activas actuales en archivos de capitulos y genere TOC/manifest | `requires-active-file` | Ya tengo registry/contract Cobertura，maintainer helper Tambien puedes usar explicito `sourcePath` Agregar opcional `splitHeadingLevel` Armonia operation；Los resultados escritos tambien se describiran directamente. managed artifact Coleccion, por TOC Exponer la certeza front-matter metadata，Y para titulos duplicados TOC La exposicion del objetivo es estable. nested block ref，Al mismo tiempo rerun Evite la sobrescritura silenciosa de archivos generados modificados manualmente por los usuarios, pero la activacion de comandos orientada al usuario aun depende de active file，Y la esencia sigue siendo write-heavy Reescribe el proceso | `content.split-note-by-chapters` |
| `notemd:research-and-summarize-topic` | Seleccionar texto / Utilice el titulo de la nota de actividad para resumir la investigacion. | `requires-selection` | path-based Los resultados ahora se muestran explicitamente. `outputPath`、`sourceLabel`、`researchContextUsed`、`localKnowledgeContextUsed` Con cinturon timing/size telemetry de machine-readable `localKnowledgeRetrieval` Resumen, pero la activacion de comandos de cara al usuario aun depende del editor activo o del estado de la nota activa | `research.summarize-topic` |
| `notemd:translate-file` | Traducir notas de actividad actual. | `requires-active-file` | Resultados estructurados y exito en la adquisicion del anfitrion notice Ya existe, pero active-file Dependencia, establecimiento de la estrategia de ruta de salida del controlador y vault Los efectos secundarios de la escritura aun obstaculizan la automatizacion estable | `translate.file` |
| `notemd:batch-translate-folder` | Carpetas de traduccion por lotes | `interactive-ui` | La seleccion de carpetas sigue siendo un proceso interactivo; resultados por lotes estructurados y exito en la adquisicion del host notice Ya existe, pero folder picker Las dependencias y la ejecucion de escritura por lotes aun no son adecuadas para una automatizacion estable | `translate.folder-batch` |
| `notemd:extract-concepts-from-current-file` | Extraer conceptos de documentos activos | `requires-active-file` | Dependencia de archivos activos y note-creation Efectos secundarios | `concept.extract-file` |
| `notemd:batch-extract-concepts-from-folder` | Extraccion por lotes de conceptos de carpetas. | `interactive-ui` | Seleccion de carpeta y progreso. UI Todavia vinculado al anfitrion | `concept.extract-folder` |
| `notemd:extract-original-text` | Extraiga el fragmento de texto original configurado del archivo activo. | `requires-active-file` | Ahora tenemos resultados estructurados, pero active-file Las dependencias y la persistencia de la ruta de salida todavia estan vinculadas al host/Configuracion | `content.extract-original-text` |
| `notemd:extract-concepts-and-generate-titles` | Proceso compuesto de extraccion de conceptos y generacion de titulos. | `requires-active-file` | compuesto workflow Aun no explicito typed contract | `workflow.extract-and-generate` |
| `notemd:create-wiki-link-and-generate-from-selection` | Cree notas conceptuales y genere contenido basado en selecciones. | `requires-selection` | La seleccion del editor depende endogenamente | `editor.create-link-and-generate` |
| `notemd:batch-mermaid-fix` | lote Mermaid Reparacion | `interactive-ui` | Ahora existen resultados por lotes estructurados, pero la seleccion de carpetas, los procesos de reparacion de variables, la generacion de informes y el movimiento opcional de archivos de errores aun requieren una semantica de alojamiento interactiva. | `mermaid.batch-fix` |
| `notemd:fix-formula-formats` | Reparar el formato de formula del archivo actual. | `requires-active-file` | El resultado del archivo estructurado ya existe, pero active-file Dependencia y franqueza vault Los efectos secundarios de la sobrescritura aun obstaculizan la automatizacion estable | `formula.fix-file` |
| `notemd:batch-fix-formula-formats` | Reparacion de formula por lotes | `interactive-ui` | Ya existen resultados por lotes estructurados, pero la seleccion de carpetas y la ejecucion de sobrescritura por lotes aun requieren una semantica de alojamiento interactiva | `formula.batch-fix` |
| `notemd:check-for-duplicates` | Busque duplicados de la nota actual. | `requires-active-file` | Los resultados actualmente estan sesgados. console/notice Salida | `duplicate.check-file` |
| `notemd:check-and-remove-duplicate-concept-notes` | Eliminar notas conceptuales duplicadas | `interactive-ui` | Escaneo estructurado/El resultado de la eliminacion ya existe y el proceso de confirmacion se menciono anteriormente. host，Pero la validacion destructiva y la sobrescritura del rango de carpetas aun no son adecuadas para una automatizacion estable | `concept.dedupe` |

## Registry Estado actual

- `src/operations/registry.ts` Se ha extraido operation、command binding、mapping kind Con partes input/result schema Fuente central de metadatos。
- `src/operations/capabilityManifest.ts` Ahora del mismo registry Aplanar capability manifest。
- capability/public-surface Ahora tambien se transportan metadatos. handling tags，Permita que las personas que llaman se diferencien sin reglas codificadas adicionales secret-bearing export con redacted/public-safe export。
- `src/cliContracts.ts` Ahora tambien del mismo registry Generar invocation contract，Reducir la ruta de deriva entre documentos, descubrimiento de comandos y exportacion de contratos.。
- registry Ahora tambien incluido en el principal. note-processing、utility、selection con export operations：`editor.create-link-and-generate`、`file.process-add-links`、`file.process-folder-add-links`、`content.generate-from-title`、`content.batch-generate-from-titles`、`content.split-note-by-chapters`、`research.summarize-topic`、`translate.file`、`translate.folder-batch`、`concept.extract-file`、`concept.extract-folder`、`content.extract-original-text`、`workflow.extract-and-generate`、`duplicate.check-file`、`concept.dedupe`、`mermaid.batch-fix`、`formula.fix-file`、`formula.batch-fix`、`provider.profile.export`、`provider.profile.export-redacted`、`provider.profile.import`、`cli.capability-manifest.export`、`cli.invocation-contract.export` con `cli.public-surface.export`。
- `src/operations/publicCliSurface.ts` Ahora del mismo set registry/capability/contract Derivacion directa de combinaciones. bounded public-safe slice，En lugar de mantener otro paralelo allowlist。
- `file.process-add-links`、`file.process-folder-add-links`、`content.generate-from-title`、`content.batch-generate-from-titles`、`mermaid.batch-fix`、`concept.dedupe`、`translate.*`、`formula.*` con `content.extract-original-text` Los actualmente verificados write-heavy contract-enrichment proof set：utility core Devolver resultados estructurados，host adapter Asumir la localizacion con exito/no-file/confirmation Semantica，registry Exportacion directa richer schema。
- `content.generate-from-title`、`content.batch-generate-from-titles`、`research.summarize-topic` y artifact-mode de `diagram.generate` Ahora tambien expuesto directamente machine-readable de local-KB retrieval Resumen en lugar de uno solo boolean Nota al margen. Aparecera el resumen actual. indexed counts、matched/returned section counts、expanded section counts、source paths、Solicitado `topK`、sliding-window size、current-file exclusion telemetry、index-build ms、query ms Y finalmente context-char count。
- Ahora tambien hay un offline dedicado retrieval-quality fixture：`npm run verify:local-kb-fixtures`。Se reutiliza directamente en la linea MiniSearch runtime path Ejecute un pequeno conjunto de accesorios de mantenimiento en lugar de crear una bifurcacion solo para evaluacion. retriever；Actual Stage-C Reprimirse y devolver task-scoped de batch-title / research inspect case、exact-file-vs-folder retrieval Limites, incluidas las repeticiones./En blanco override path、No Markdown Archivos que interfieren, carpetas irrelevantes y archivos vacios searchable section Candidato noisy mixed-corpus scope、real-note-style de chapter-split showcase retrieval，y chapter-split showcase La realidad mas alla note/query Se incluye la diversidad en lugar de limitarse a cubrir una unica diagram Ejemplo。
- `content.split-note-by-chapters` Ahora tambien sigue la misma direccion de manera mas explicita: la estructura de resultados nombra la solicitud directamente heading level、Ruta del archivo del capitulo, completa managed artifact Conjunto, determinista TOC front-matter metadata、stale removal Detallado y estable nested-heading block-ref id，En lugar de seguir obligando a la persona que llama a confiar unicamente en count、Inferencia indirecta del nombre del archivo o texto del titulo repetido; si el archivo generado existente ha sido modificado manualmente，rerun todavia fail fast。
- `diagram.generate` Ahora no tiene nada que ver con el anfitrion generation core Llevar explicito typed follow-through：`followThrough.kind` usado para distinguir Mermaid Guardar、artifact Ahorro y preview Hecho manteniendo la capa superior compatible con versiones anteriores `outputPath` / `previewOpened`；artifact-generation modes Tambien expuesto a lo largo de los mismos resultados estructurados. local-KB retrieval telemetry。
- El primero en registrarse semantic-verification helper Tambien existe ahora.：`npm run verify:diagram-semantics` ¿Los mantenedores? runbook Completado y reutilizable, no secrets Verifique las plantillas en lugar de quedarse en el nivel de pautas de texto puro。
- Proxima etapa contract deepening El orden es ahora mas preciso: primero `diagram.generate` Sea independiente del host generation core，Y ponlo debajo typed follow-through Considerelo resuelto y proceda. packaging / semantic verification posterior convergencia, y finalmente reabierto con mas fuerza CLI/public surface Declaracion。
- Los alias de comandos antiguos se seguiran registrando para garantizar la compatibilidad, pero se excluiran deliberadamente. capability manifest Mas alla de la exportacion。

## Proximo lote de objetivos de extraccion.

Estas son las prioridades que mas merecen ser incluidas en la siguiente fase. registry-backed O la capacidad de continuar con el desacoplamiento del host.。

| Prioridad | Competencias del candidato | ¿Por que hacerlo primero? | Fundacion existente |
|---|---|---|---|
| P0 | Rodeate de potencial render-host runtime lane de source/build Convergencia | El codigo fuente actual sigue siendo reutilizable. runtime helper（`src/rendering/runtime/renderHostEntry.ts`、`src/rendering/preview/renderHostRuntimeClient.ts`），Pero build/audit El valor de verdad todavia solo prueba `main.js` Entrega de un solo activo. La linea principal actual ha permitido esto latent lane a fail-closed Manera de mantener source-only：A menos que se configure explicitamente, ya no volvera al valor predeterminado standalone runtime-module specifier；production build El camino tambien cambiara `createRenderHostBundleBuildOptions()` permanecer en `esbuild.config.mjs` Aparte de candidate-only Estado. El siguiente paso en el trabajo de mayor apalancamiento ya no consiste simplemente en “poner source-only "Escribe claramente", pero continua con este ejecutable. guard，Mantenga la seleccion hasta un lote determinado en el futuro. source-only，O compensar en el mismo lote build、release assets、audit con docs Publicar frontera de entrada multiple de envio real | `esbuild.config.mjs`、`scripts/audit-render-host-bundle.js`、`scripts/lib/esbuild-bundle-config.js`、`src/rendering/runtime/renderHostEntry.ts`、`src/rendering/preview/renderHostRuntimeClient.ts` |
| P1 | Explicito path-based operations delimitado public-CLI Promocion | maintainer helper probado path-based operations Existe una necesidad real, pero solo debe ingresarse cuando los efectos secundarios de escritura y los contratos de salida sean lo suficientemente estables, documentables y bloqueables regresivos. public-safe slice | `src/maintainerCliBridge.ts`、`scripts/lib/maintainer-cli-operation-help.js`、`src/operations/registry.ts`、`src/tests/maintainerCliBridge.test.ts` |
| P1 | retrieval / chapter-split Contrato y refuerzo de resultados de rutas de escritura. | Orientado retrieval de note-processing Los resultados ahora se generan para titulos, resumenes de investigacion y artifact-mode de `diagram.generate` Tiras expuestas explicitamente timing/size telemetry de machine-readable `localKnowledgeRetrieval` Resumen，shared maintainer helper Tambien se ha anadido concision. payload Ejemplos y anadir especializados. `local-knowledge.inspect` explainability seam Para inspeccion effective path/query/context、Tres tipos query Caminos derivados（`explicit`、`basename`、`diagram-source`）、y por `retrieverBuildStatus` Distinguir `no-paths` / `no-candidate-files` / `no-retrievable-sections` El estado de fracaso de explainability；Tambien apoya temporalmente `knowledgePaths` override Matriz de hacer task-scoped retrieval Verificacion del ajuste de parametros。`npm run verify:local-kb-fixtures` Tambien bloqueo un conjunto de superposiciones. exact/prefix/current-file-exclusion Categoria、task-scoped batch-title / research inspect case、Contener duplicacion/En blanco override path、No Markdown Archivos que interfieren, carpetas irrelevantes y archivos vacios searchable section Candidato noisy mixed-corpus scope、real-note-style chapter-split showcase retrieval、Recuperacion de contratos de tareas entre carpetas y fuentes de navegacion con baja senal diagnostics Mas fuera de linea retrieval-quality fixture。chapter split Tambien anadido repeated-heading-safe de nested block ref、determinista TOC front-matter metadata con guarded rerun overwrite Semantica; el siguiente paso en la mejora de la madurez debe continuar hacia una mayor realidad note/query Diversidad y calidad chapter-split showcase Alinear en lugar de seguir ampliando el numero de operaciones | `src/chapterSplit.ts`、`src/localKnowledgeBase.ts`、`src/fileUtils.ts`、`src/searchUtils.ts`、`src/main.ts`、`src/tests/localKnowledgeEvaluationFixture.test.ts`、`scripts/lib/maintainer-cli-operation-help.js`、`src/tests/chapterSplit.test.ts`、`src/tests/localKnowledgeTaskIntegration.test.ts`、`src/tests/diagramCommandArchitecture.test.ts`、`src/tests/localKnowledgeBase.test.ts`、`src/tests/maintainerCliBridge.test.ts` |
| P2 | workflow/settings Embalaje | Workflow DSL con output-path toggles Sigue siendo valioso metadata，Pero aun no es una interfaz publica estable. | `src/workflowButtons.ts`, Establecer el control de salida del controlador. |

## Establecer preparacion

| Configuracion / Area | CLI Disponibilidad para la reutilizacion | Descripcion |
|---|---|---|
| Provider name / model | High | Explicito y existente task scope |
| `preferredDiagramIntent` | High | Naturalmente adecuado como operation input |
| Developer diagnostic mode / timeout / runs | High | El grado de estructura ya es alto |
| `localOnly` Semantica | Medium-high | export/import/profile contract Debe ser retenido |
| Workflow DSL | Medium | Apto para hacer metadata source，Pero aun no es un publico estable API |
| Output path toggles | Medium | Valioso, pero actualmente todavia combinado con un comportamiento de reescritura del complemento |
| UI locale / notices / modal text | Low | puro UI Enfoque |

## Reglas de ingenieria recomendadas

No lo hagas porque `obsidian command id=<id>` Si puede funcionar, simplemente ponle un cierto Notemd El mando es ascendido a“CLI supported”。

No lo considere un contrato estable solo porque admite combinaciones de teclas de acceso directo. Panel de comando, teclas de acceso directo, oficial CLI Es solo una superficie desencadenante, no la interfaz de ingenieria.。

La promocion solo debe ocurrir cuando se cumplen todas las condiciones siguientes：

1. Ingrese explicito
2. Salida machine-readable
3. Los efectos secundarios estan documentados.
4. La semantica del progreso y el fracaso es determinista.
5. No mas dependencia implicita del editor activo. / UI Estado
