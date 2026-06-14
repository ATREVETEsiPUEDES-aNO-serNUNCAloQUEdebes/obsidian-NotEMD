---
date: 2026-05-13
last_updated: 2026-05-25
topic: mainline-progress-audit-1-8-9-and-next-direction
---

# 1.8.9 Auditoria posterior del progreso de la linea principal: comparacion en profundidad, estado actual y direccion de seguimiento

> Descripcion de los limites historicos: este articulo registra `1.8.9` Publicar los resultados de la auditoria desde la perspectiva del punto de corte, antes de 2026-05-24 de force-rewrite recovery Y posteriormente en la linea principal actual. bounded recovery。Para ver recovery El estado actual despues de eso es el mismo que next-level Planifica, leelo de nuevo. `docs/brainstorms/2026-05-25-post-bounded-recovery-audit-and-next-level-direction.zh-CN.md`。

## 1. Alcance y linea de base

Este documento es para colocacion. `1.8.9` Audite el estado de la linea principal despues del limite de lanzamiento y alinee el valor de verdad del codigo actual con el plan de la linea principal anterior uno por uno.。

Principales fuentes de comparacion：

1. `.trellis/tasks/05-07-sync-main-progress-audit/prd.md`
2. `docs/superpowers/plans/2026-05-03-mainline-stabilization-next-batch.zh-CN.md`
3. `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md`
4. `docs/brainstorms/2026-05-08-packaging-semantic-convergence-progress-and-next-steps.zh-CN.md`
5. `docs/brainstorms/2026-05-12-release-chronicle-ci-hardening-progress-and-architecture-alignment.zh-CN.md`
6. `docs/brainstorms/2026-05-12-sidebar-api-observability-progress-and-architecture-alignment.zh-CN.md`
7. enviado release Valor de verdad：`docs/releases/1.8.9.zh-CN.md`、`change.md`、`README_zh.md`、`src/ui/welcomeReleaseNotes.ts`

Objetivos de esta auditoria：

1. Distinguir cuales son hechos de convergencia que se han implementado y cuales aun son obras arquitectonicas que aun no se han iniciado.；
2. Evitar que se sobreestimen los documentos de progreso packaging/runtime Grado de avance；
3. Basado en la actualidad `main` Base del codigo, escriba una direccion de seguimiento especifica。

## 2. Instantanea del valor de verdad del codigo actual

### 2.1 Borde de vista previa del grafico

El comportamiento de vista previa actual es significativamente mas solido que la linea base anterior de "Vista previa del producto guardado".：

1. `src/operations/diagramCommandHostAdapter.ts` Deja ahora `Preview diagram` ir canonical Obtenga una vista previa de la ruta directamente y ya no recurra a la regeneracion de forma predeterminada.。
2. `src/ui/DiagramPreviewModal.ts` Ahora es un shell de vista previa reutilizable, no solo una ventana unica que "aparece una vez despues de generarse".：
   - Verticales action rail
   - Panel de historia
   - frame-safe Diseno para evitar desplazamientos horizontales innecesarios.
3. `src/ui/diagramPreviewHistory.ts` Ahora proporciona un limite superior del historial de vista previa de la memoria.（`MAX_DIAGRAM_PREVIEW_HISTORY = 12`），Y haga clic en "Valor verdadero de fuente guardada" en lugar de simplemente crear la secuencia de ventanas emergentes. key。
4. `src/tests/diagramPreviewModal.test.ts`、`src/tests/diagramCommandHostAdapter.test.ts`、`src/tests/diagramCommandExecution.test.ts` Vista previa directa bloqueada y comportamiento de reapertura。

No conclusiones que deben quedar claras：

- Esta es la convergencia de la superficie de vista previa, no nueva renderer/runtime Topologia。
- El codigo actual aun no tiene pruebas. heavy-runtime packaging isolation，Tampoco hay pruebas de que se haya completado la division de activos preliminar independiente.。

### 2.2 Release chronicle / repo-saga Reforzar los limites

Despues de la publicacion follow-up El endurecimiento es mas que una simple logica de reintento unico：

1. `scripts/release/commit-chronicle-refresh.js` Ya responsable tracked/untracked chronicle Cierre y delimitacion de piezas push Recuperacion。
2. `scripts/lib/repo-saga-execution-lock.js` Ahora para repo-saga chronicle Se agrego un bloqueo serial ejecutable a la operacion.。
3. `scripts/repo-saga/update-quarterly-saga.mjs` Ahora operando compartiendo repo-saga cache Este bloqueo se realizara antes de ingresar al directorio raiz.。
4. `src/tests/repoSagaExecutionLock.test.ts` Bloqueado：
   - Primera vez acquire Exito
   - Bloqueo activo denegado
   - stale lock Limpiar y refrescar acquire
5. `docs/maintainer/release-workflow*.md` con `AGENTS.md` Ahora pon `chronicle:sync-repo-saga` y `chronicle:update` Tratada explicitamente como una serie gate，Ya no solo experiencia operativa。

No conclusiones que deben quedar claras：

- Esto no significa repo-saga se ha convertido parallel-safe。
- Lo que hace es convertir las reglas que deben serializarse en "ejecutables en tiempo de ejecucion". + Restricciones estrictas "requeridas explicitamente por el documento"。

### 2.3 Release Limite de sincronizacion de la verdad

`1.8.9` Los limites de las versiones ahora son coherentes internamente：

1. `docs/releases/1.8.9.md`
2. `docs/releases/1.8.9.zh-CN.md`
3. `change.md`
4. `README.md`
5. `README_zh.md`
6. `src/ui/welcomeReleaseNotes.ts`

Este conjunto de alineamientos ahora cubre ambos tipos de valores de verdad.：

1. Guardado Mermaid Cuando abras la vista previa nuevamente, ya no se desplazara con el contenido de la primera vista previa.；
2. El "Resumen de los dos ultimos lanzamientos" en la ventana emergente de bienvenida se ha avanzado a `1.8.9` / `1.8.8`。

## 3. Comparacion en profundidad con orbitas del esquema anterior.

### 3.1 Correcto `mainline-stabilization-next-batch` Comparacion de

Requisitos del programa：

1. Priorizar el refuerzo de los limites en lugar del desplazamiento del alcance；
2. El codigo, las pruebas y los documentos deben implementarse en el mismo lote.；
3. Estabilizacion implementada y futuro. packaging El trabajo debe dividirse con honestidad。

Actual `main` Probado：

1. Se ha implementado la convergencia del valor real de vista previa en lugar de permanecer en el nivel de planificacion.；
2. release follow-up Recuperacion y recuperacion repo-saga La seguridad serial desaparecio repo-owned Y quedar atrapado en las pruebas de regresion；
3. release Valor de verdad de la version、preview UX Verdad vs. welcome modal Los valores de la verdad estan todos ahi. `1.8.9` Sincronizacion de limites。

Puntos aun abiertos：

1. Stage-B2 -> Stage-C packaging Aun se esta trabajando en el siguiente camino critico de facto；
2. Actual preview Los avances ya no deben malinterpretarse como “pueden seguir retrasandose” packaging/semantic convergence”。

Conclusion：

- `1.8.9` Es una convergencia de limites. release。
- No fue ni una sola vez renderer Expansion release。

### 3.2 Correcto `diagram-rendering-platform-roadmap` Comparacion de

Requisitos de la hoja de ruta：

1. canonical preview Entrada；
2. Reutilizable preview/render host Superficie；
3. apoyado preview/export Expresion veraz del objetivo.；
4. runtime-boundary isolation Tienes que esperar contract/pipeline Avance tras la convergencia。

El codigo actual esta probado.：

1. canonical preview La entrada se ha reutilizado en la ruta de vista previa del producto guardado.；
2. `DiagramPreviewModal` Ha avanzado desde un “esqueleto de plataforma minimo” hasta estar listo para el producto. host shell；
3. Cambio de historial y frame-safe controls incorporado preview Limites en lugar de depender de desvios externos；
4. En la hoja de ruta“support is explicit, not universal”Las limitaciones de todavia se mantienen。

Puntos aun abiertos：

1. Todavia no dedicated render-host asset bundle；
2. Todavia no multi-entry packaging topology；
3. Cualquier documentacion nueva no debe implicar universal renderer parity o detached heavy-runtime delivery Completado。

Conclusion：

- Task 4 / Task 5 elegante preview La convergencia ha avanzado sustancialmente。
- Stage-C runtime-boundary El trabajo aun no comienza con el codigo verdadero。

### 3.3 Correcto `packaging-semantic-convergence` Comparacion de

Los requisitos de la pista.：

1. Mantengase actualizado `main.js + inline srcdoc` Valor de verdad explicito；
2. en helper/docs/tests No reiniciar durante la fase de refuerzo. operation Limites；
3. runtime packaging Tienes que esperar contract-definition gates Escribe claramente y bloquea antes de presionar。

Actual `main` Probado：

1. `1.8.9` de preview/release El trabajo no es relevante para la situacion actual. packaging Conflicto de valores de verdad；
2. El almacen todavia esta single-entry bundling；
3. release con preview El corte convergente no se exagera accidentalmente runtime isolation。

Puntos aun abiertos：

1. Stage-B2 de packaging-contract promotion Todavia es necesario transformar aun mas la intencion documentada actual en una politica mas estricta. implementation-readiness Artefactos；
2. Stage-C runtime El trabajo todavia esta bloqueado por estas condiciones previas del contrato tal como estan disenadas.。

Conclusion：

- packaging El camino todavia esta bien para la siguiente fase。
- Salvo una regresion, preview con release El refuerzo no deberia seguir ocupando este camino critico ahora.。

### 3.4 Correcto release-chronicle / CI hardening Comparacion de

Una ronda antes chronicle Refuerzo resuelto：

1. remoto `500` Limitacion ante el fracaso push retry con rebase Recuperacion；
2. uso repo-owned helper Alternativa a en linea shell commit/push Logica。

El codigo actual se agrega en base a esto.：

1. repo-saga chronicle Los comandos ahora tienen bloqueos de serie ejecutables en lugar de solo prose Advertencia；
2. maintainer workflow Directrices y AGENTS nivel guardrail Se aclaran los requisitos de serie codificados；
3. El refuerzo actual tambien cubre：
   - release follow-up push recovery
   - shared-cache mutation safety

Conclusion：

- release-chronicle La pista se ha movido de transport recovery Avanzando hacia concurrency-risk containment。

## 4. Evaluacion de la promocion de la arquitectura.

### 4.1 Lo que realmente avanza

1. **Los valores de verdad de la vista previa se pasan del estado de memoria efimera a los valores de verdad de la fuente guardados.**
   manuales `Preview diagram` Los archivos guardados ahora se volveran a abrir. Mermaid Rutas de origen en lugar de depender del estado de memoria obsoleto artifact Suposiciones。
2. **Vista previa UI Se ha convertido en una superficie operativa reutilizable.**
   el modal Ahora admite comprobaciones y cambios repetidos, en lugar de "mirar solo una vez despues de generar"”。
3. **Release chronicle La seguridad se actualiza desde habitos operativos hasta restricciones de ejecucion.**
   repo-saga La ejecucion en serie ahora tiene proteccion de codigo y maintainer workflow Reglas。

### 4.2 No se adelanta nada y debe seguir escribiendose con claridad.

1. heavy-runtime packaging isolation Aun no implementado；
2. multi-entry output topology Aun no implementado；
3. preview history Aun solo estado de memoria session Directorio de persistencia de estado, no entre sesiones；
4. repo-saga concurrency Todavia “prohibido” en lugar de “por cuarentena” cache o parallel-safe El diseno esta resuelto”。

## 5. Riesgos y controles

1. **Riesgos：** Documentacion de seguimiento preview Convergencia esta incorrectamente escrita como runtime-boundary La hoja de ruta esta basicamente completa.。
   **controlar：** En absoluto packaging-facing Continue escribiendo claramente en el documento. `main.js + inline srcdoc` Valor de verdad。
2. **Riesgos：** Los mantenedores estaran aqui en el futuro porque “las cerraduras normalmente aguantan” CI Paralelismo medio repo-saga Pasos。
   **controlar：** Mantenga las reglas en serie al mismo tiempo. `AGENTS.md`、release-workflow Bloqueos de documentos y tiempo de ejecucion helper En el medio; No se puede cambiar solo uno de los tres.。
3. **Riesgos：** preview-history UX Evolucionar hacia un estado persistente sin un contrato claro。
   **controlar：** En presencia de claro PRD Antes, continua manteniendo el historial en estado de memoria.。
4. **Riesgos：** generales Mermaid fixer Para ser recogido nuevamente preview reopening，Conducir a la no- flowchart Corrupcion repetida del grafico。
   **controlar：** Mantengase actualizado type-aware preview Camino, no lo tomes en sentido amplio fixer Cosas guardadas en vistas previas reopening，A menos que corresponda subtype Tener las pruebas de regresion bloqueadas。

## 6. Instrucciones de seguimiento especificas

### Prioridad 1：Volver a packaging / semantic Camino critico

1. Basado en lo que ya se ha implementado semantic helper Valor verdadero, sigue adelante Stage-B2 implementation-readiness contracts；
2. No vuelva a abrir a menos que haya nuevas regresiones visibles para el usuario. preview UI Trabajo；
3. Todo en el futuro packaging claim Continuar estando sujeto a `esbuild.config.mjs`、Los limites de lo que realmente pueden demostrar los guiones y pruebas de auditoria。

### Prioridad 2：poner preview Tratelo como una superficie de mantenimiento de convergencia en lugar de una superficie de expansion ilimitada.

1. Considere la persistencia solo si es necesaria para flujos de trabajo reales entre sesiones preview history；
2. mantener command/sidebar/workflow Tres superficies preview La entrada dura canonical；
3. A menos que ocurra una regresion especifica, no presione artifact subtype Bifurcacion De Nuevo preview Camino principal。

### Prioridad 3：Continue siendo conservador repo-saga Refuerzo

1. Para compartir cache de chronicle Los comandos continuan ejecutandose en serie.；
2. Si realmente se necesita el paralelismo en el futuro, desmantelarlo primero cache roots，Analicemos nuevamente la relajacion de la granularidad del bloqueo；
3. Para cualquier cosa que se devuelva al almacen. release follow-up step，Sigue adelante helper-first + regression-locked。

## 7. Explicacion del estado actual de la linea principal.

Esta auditoria debe entenderse como：

1. `1.8.9` en `main` Cierra lo real preview-truth / preview-UX / release-truth rebanada；
2. repo-saga Las reglas de prevencion de errores en serie ahora tienen restricciones de documentos y restricciones de ejecucion.；
3. Almacen en la frontera del producto y release-ops Grado de convergencia en el limite, en comparacion con `1.8.8` Se ha mejorado aun mas.；
4. El siguiente paso hacia un avance arquitectonico verdaderamente significativo aun esta por llegar. packaging-boundary convergence，En lugar de seguir haciendo mas extensas UI Columpio。

## 8. 2026-05-19 Correccion y progreso adicional.

esto 2026-05-13 Hay dos lugares en el documento de auditoria que deben corregirse explicitamente, de lo contrario seguira induciendo a juicios posteriores a error.：

1. En el texto `Todavia no dedicated render-host asset bundle` con `El almacen todavia esta single-entry bundling` Ya no establecido；
2. El valor de verdad del codigo actual ya ha entrado en el control `main.js` + `render-host.mjs` Stage-C runtime lane，Este punto ha sido：
   - `npm run audit:render-host`
   - render-host bundle Pruebas de auditoria
   - release/manual-install Requisitos de activos
   - semantic helper / maintainer docs
   Co-bloqueo。

Sobre esta base, se ha agregado una nueva porcion de convergencia de productos a la linea principal：

1. Busqueda en la base de conocimientos local
   - Aplicabilidad：`Generacion por lotes a partir de titulos.`、`Investigar y resumir`、`Generar graficos`
   - Formulario de implementacion：plugin-native MiniSearch + heading-aware section chunking
   - Restricciones：prompt augmentation only，No introducido daemon / cloud / vector DB / GPU
2. Division del capitulo
   - Aplicabilidad：active-file command / sidebar / workflow surface
   - Generar valor verdadero：`<basename>_chapters`、`<basename>_TOC.md`、`.notemd-chapter-split.json`
   - Objetivo: completar en una ruta adyacente al archivo original heading-based split + TOC extraction，Y limpiar viejas creaciones.

La explicacion correcta de la linea principal actual debe actualizarse para：

1. Stage-C runtime lane Ya existen, pero aun estan controlados. dedicated render-host lane，En lugar de generalizar topology completo；
2. La busqueda en la base de conocimiento local y la division de capitulos recientemente agregadas pertenecen a la convergencia de capacidades del producto y no constituyen novedades. runtime-boundary claim；
3. El proximo camino critico aun esta packaging / semantic-verification convergence，En lugar de actualizar los errores de recuperacion local livianos a la nueva direccion de arquitectura de tiempo de ejecucion。

## 9. 2026-05-19 Documentos reales vs. CLI Verificacion de ubicacion

Ademas de la correccion anterior, este lote de Stage-B2/C/D La verificacion de archivos reales de funciones relacionadas se coloca explicitamente; de lo contrario, "ya es compatible" CLI / "El cierre se ha completado" seguira estando en el nivel verbal.。

### real vault Alcance de la validacion

Actividades vault：`/home/jacob/obsidian-NotEMD/docs`

Raiz de prueba real：`docs/__e2e_manual_cli_1779194979/`

Entrada de llamada：

- `node scripts/invoke-maintainer-cli-operation.js`
- La capa inferior todavia esta `obsidian-cli native ... eval`
- Actualmente solo cuatro acotados operation：
  1. `content.batch-generate-from-titles`
  2. `content.split-note-by-chapters`
  3. `research.summarize-topic`
  4. `diagram.generate`

### Resultados reales

1. `content.batch-generate-from-titles`
   - uso `regex + basename + includeSubfolders=exclude`
   - Golpe verdadero 1 archivos
   - Se ha inyectado la confirmacion del registro. local-KB context
   - real DeepSeek Viaje de ida y vuelta exitoso
   - Valor de verdad del codigo actual: si complete Si el directorio ya tiene un destino con el mismo nombre, se omitira de forma conservadora. move，Sin cobertura
2. `content.split-note-by-chapters`
   - de `roadmap.md` Generado con exito 2 Archivos de capitulos
   - Salida `roadmap_TOC.md` con `.notemd-chapter-split.json`
   - El contrato de devolucion es consistente con el producto del disco.
3. `research.summarize-topic`
   - Tavily API key Cuando esta vacio，web research Fallo del camino sin romper toda la cadena.
   - local-KB Puedes continuar completando el resumen solo
   - `sourceLabel=Local KB`、`researchContextUsed=false`、`localKnowledgeContextUsed=true`、`appended=true`
4. `diagram.generate`
   - Explicito override `requestedIntent=flowchart`、`compatibilityMode=best-fit`、`targetLanguage=zh-CN` Entro `operationInput`
   - Confirmacion de registro diagram artifact Camino inyectado local-KB context
   - real Mermaid artifact El pedido ha sido realizado. `diagram-input_summ.md`

### Explicar los limites

1. Esto demuestra que "se admiten nuevas funciones CLI”La declaracion correcta en la linea principal actual debe ser：**Ya existe repo-local、maintainer-grade、bounded de CLI Puente de llamadas**；
2. eso**No es igual a**publico CLI Se ha ampliado la superficie, lo que no significa que podamos hacer promesas externas para estabilizar la orientacion del usuario. typed CLI API；
3. Si quieres seguir avanzando en el siguiente paso CLI，Solo debe mantenerse public-safe slice Bajo la premisa de seguir reduciendo la declaracion, se ampliara el incremento. maintainer bridge O sigue haciendolo contract-hardening，En lugar de exagerar el grado de finalizacion。

## 10. 2026-05-20 RAG Correccion del valor real y siguiente paso

Tambien es necesario seguir fijando los limites de la capacidad de la "recuperacion de la base de conocimientos local", de lo contrario sera facil malinterpretarlo mas adelante como un proposito general completado. RAG Plataforma：

1. El valor de verdad del codigo actual sigue siendo：
   - plugin-native MiniSearch
   - heading-aware section chunking
   - lexical retrieval
   - prompt augmentation only
   - Ninguno embedding / reranker / vector DB / daemon / GPU
2. La nueva configuracion de ventana deslizante en este lote solo resuelve un problema muy especifico.：
   - El usuario puede configurar cuantos vecinos adicionales hay antes y despues de cada fragmento de impacto. section
   - Esto facilita section Problema con el contexto cortado despues del golpe
   - eso**No**Actualizacion de recuperacion semantica, tambien**No**Complementar el sistema de evaluacion
3. Si tomas `ragas` / `RAGPerf` Medida con este sistema de referencia, la brecha actual sigue siendo clara：
   - Ninguno faithfulness / correctness Evaluacion de clase fuera de linea
   - Ninguno hit-rate / precision@k / miss diagnostics
   - Sin enlace de busqueda latency Descomposicion
   - Ninguno freshness / update workload Punto de referencia
4. Esto no significa que el plan sea incorrecto, pero muestra que las opciones actuales en materia de proyectos son limitadas.：
   - Por el momento Obsidian En terminos de limites de complementos, esto MiniSearch + section-window El camino es el optimo local correcto.
   - La proxima prioridad deberia ser complementar maintainer-grade evaluation / telemetry，En lugar de apresurarse a introducir mas runtime

Por lo tanto, se debe actualizar una explicacion mas precisa del progreso actual para：

1. La recuperacion de la base de conocimientos local ha pasado de ser “puras visitas” a section Empuje "Costura" a "Ventana adyacente ajustable" bounded local retrieval；
2. Esto mejora el rendimiento, pero sigue siendo ligero local-KB augmentation，No se debe exagerar la madurez RAG Plataforma；
3. Las prioridades posteriores deberian pasar a：
   - retrieval telemetry
   - pequeno golden-set Evaluacion
   - Division del capitulo / TOC anchor Refuerzo semantico
   En lugar de introducir primero una nueva ronda de pila de busqueda pesada。

## 11. 2026-05-20 Division del capitulo next-level Refuerzo

Es necesario indicar claramente otro hecho que se oculta facilmente con "la funcion se ha implementado": aunque la division de capitulos ya esta disponible, todavia estaba sesgada. heuristic v1，Mas que lo suficientemente estable managed-artifact surface。

Esta ronda de valor de verdad del codigo es un paso adelante en comparacion con los requisitos del plan anterior.：

1. Comparado con "Siempre que se pueda desmontar y generar segun el titulo TOC Requisito inicial de "eso es todo". La implementacion actual claramente ha agregado dos puntos de estado estable de alto valor.：
   - Agregado en elementos de configuracion. `Division del capitulo -> Dividir la jerarquia de titulos`，Apoyo `Auto` / `H1`-`H6`
   - El nombre del archivo de salida ya no contiene una gran cantidad de CJK El titulo degenera en `chapter-01` Clase I fallback slug，Y tratara de retener Unicode-safe Semantica del titulo
2. Estos dos puntos abordan lagunas reales del producto en el codigo anterior, no errores abstractos.：
   - mixed heading notes Desaparecido operator control，El usuario no puede especificar de forma estable el boton. H2 Todavia H3 desmantelar
   - chino/Unicode La semantica del titulo se pierde en el nombre del archivo del capitulo, lo que dificulta la legibilidad y el mantenimiento del producto.
3. Los limites conductuales actuales tambien son mas claros：
   - Si el nivel de division especificado explicitamente no existe en la nota, la implementacion actual fallara directamente en lugar de volver silenciosamente a otros niveles.
   - Esta es una eleccion deliberada deterministic Comportamiento, el proposito es evitar que los usuarios piensen que presionaron H3 Lo quitaron pero en realidad lo presionaron en secreto. H1/H2 Generar

Pero esto todavia no significa que la division de capitulos este completamente madura.：

1. Aun no hecho repeated-heading anchor collision Refuerzo semantico；
2. Aun no completado "El usuario modifico manualmente el archivo del capitulo para generarlo nuevamente. rerun”de overwrite-policy De cerca；
3. Aun no ampliado a setext heading / richer metadata / batch split。

Por lo tanto, se debe actualizar una explicacion mas precisa de la progresion de la division de capitulos para：

1. Ha avanzado de "desmontable" a "titulos controlables y mas amigables con los chinos". bounded v2；
2. Todavia es heading-based materialization workflow，En lugar de un entendidor de capitulos semanticos.；
3. Si la siguiente etapa continua avanzando, se debe dar prioridad a complementar：
   - anchor collision tests + semantics
   - managed-artifact overwrite policy
   - TOC/front-matter metadata
   En lugar de apresurarse a expandirse folder-batch split O introduzca una pila de analisis mas pesada。

## 12. 2026-05-20 Nombrar file-selection profile Correccion de cierre

Tambien es necesario corregir el progreso actual de la linea de filtrado de carpetas; de lo contrario, sera facil interpretar erroneamente la "ruta guardada" como la "ruta de ejecucion vinculada" mas adelante.”：

1. El valor de verdad del codigo actual se ha avanzado de "Solo filtrado predeterminado global" a "Filtrado predeterminado global". + Archivos con nombre reutilizables”：
   - Configuracion de persistencia：`folderTaskFileSelectionProfiles`
   - Cada archivo contiene filter mode/pattern/target、Caso, coincidencia inversa, rango de subcarpetas y opcional `folderPathHint`
2. Pero la restriccion mas critica aqui no es "el camino se puede salvar", sino "el camino solo se puede salvar". hint，No hacer nada binding”：
   - `folderPathHint` Solo para interactive picker Prepoblacion
   - Tiempo de ejecucion real folder Seguir permitiendo a los usuarios cambiar las selecciones manualmente
   - Este es un diseno de estabilidad deliberado para evitar rutas de archivos obsoletas. silently hijack Operaciones posteriores
3. El modelo de prioridades actual tambien es claro y esta asegurado：
   - `Ejecucion unica explicita override > Archivo guardado > Impagos globales`
4. Este modelo ahora funciona a traves de：
   - selector helper
   - interactive host adapter
   - maintainer CLI bridge en `fileSelectionProfileId` / `fileSelectionProfileName`

Por lo tanto, se debe actualizar una representacion mas precisa del estado actual del avance arquitectonico para：

1. Este es un selector-layer consistency hardening，en lugar de nuevo runtime/product topology Expansion；
2. Mejora la reutilizacion de las tareas de carpetas, pero no cambia la semantica de ejecucion a "vinculacion de ruta implicita basada en archivos".”；
3. Si continuas avanzando en el siguiente paso, deberas priorizar profile-surface contract hardening，En lugar de construir primero uno mas grande CLI/public-surface promotion。
