---
date: 2026-05-04
topic: progress-audit-next-direction
---

# Auditoria de progreso y direccion de seguimiento (v1.8.3+)

## Estado actual: codigo vs Requisitos del programa

Documentacion de referencia：
- `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md`
- `docs/brainstorms/2026-04-14-diagram-platform-phase-2-requirements.zh-CN.md`
- `docs/brainstorms/2026-05-01-llm-backward-compat-and-progress-audit.zh-CN.md`
- `docs/brainstorms/2026-05-03-mainline-stabilization-and-ci-hardening-requirements.zh-CN.md`
- `docs/brainstorms/2026-05-03-drawnix-feasibility-and-integration-direction.zh-CN.md`
- `docs/brainstorms/2026-05-07-cli-next-phase-planning.zh-CN.md`

## Correccion de hechos de almacen.（2026-05-05）

El objetivo de esta auditoria no es el rediseno diagram platform，En cambio, “el estatus real del codigo, el control remoto workflow、Realineacion del documento de progreso, conclusion del proyecto de referencia externa ". Los siguientes elementos deben escribirse claramente：

1. **remoto `main` No hay rutina por el momento push/PR CI。**
   `.github/workflows/release.yml` Solo en numeros `x.x.x` tag push o `workflow_dispatch` Al correr. A partir de `2026-05-04`，`main` Senalando `dd77126`（`fix(diagram): land command surface and verification runbook`），La sucursal en si aun no tiene comun push/PR workflow。La luz roja mas cercana viene de `1.8.3` Publicar una transmision que posteriormente haya sido `2026-05-03` de `1.8.4` Exito release run（`25274341984`）Cobertura。

2. **`main` en commit-status `pending` No es una verdadera verificacion de fallas。**
   A partir de `2026-05-04`，`commits/main/status` Todavia regresa `state: pending` y `statuses: []`，al mismo tiempo `main` No branch protection，Tampoco existe un nivel de sucursal ordinario required checks。Este modelo es `main@dd77126` Lo anterior tambien se mantiene: cero status、cero check suite Esto no significa que "la rama principal tenga una verdadera linea de fallas". Para este almacen, cuando release-driven checks Cuando este presente，GitHub Actions runs Es el extremo remoto CI Fuente de la verdad, tomada sola commit-status API Juzgara mal。

3. **release workflow En el ultimo exito run Todavia conlleva el riesgo de un fracaso futuro.。**
   El que tuvo exito antes `1.8.3` Reparacion run（`25215799596`）Todavia llevando GitHub Oficial Node 20 JavaScript-action Advertencia de obsolescencia, que apunta a `actions/checkout@v4` con `actions/setup-node@v4`。Actual `.github/workflows/release.yml` Fijado como `actions/checkout@v6` con `actions/setup-node@v6`，Y lo nuevo `1.8.4` release run（`25274341984`）Completado con exito en este camino reforzado.。

4. **“8 La "verificacion en tiempo real de la intencion del grafico" no es actualmente un umbral controlado en el almacen.。**
   Relevante live test Documentos (p. ej. `src/tests/liveAllDiagramIntents.test.ts`）Ya aqui `92d3ad3` a“accidentally committed live test files”Movimiento nominal fuera de la linea principal。2026-05-02 de DeepSeek La verificacion en tiempo real debe considerarse como una evidencia historica local, en lugar de la ejecucion continua del almacen actual.、CI Umbral de cobertura obligatoria。

5. **Soporte de tiempo de ejecucion 8 Una intencion no es igual a UI Todas las preferencias quedan expuestas。**
   `SUPPORTED_DIAGRAM_INTENTS` Todavia Cubierto `mindmap / flowchart / sequence / classDiagram / erDiagram / stateDiagram / canvasMap / dataChart`，Pero la pagina de configuracion y la barra lateral actualmente solo estan expuestas `auto + flowchart + sequence + classDiagram + erDiagram + stateDiagram + dataChart`。`mindmap` con `canvasMap` Sigue siendo una capacidad de tiempo de ejecucion, no la actual UI Parte del selector de graficos preferido.。

6. **La disposicion del mando esta "parcialmente unificada", no "completamente unificada"”。**
   `generateExperimentalDiagramCommand` con legacy Mermaid El comando de guardar todavia se comparte. `generateDiagramCommand` Arreglo, pero `previewExperimentalDiagramCommand` Ahora lee directamente la corriente. Markdown en `vega-lite` Adjunte y obtenga una vista previa local, ya no comparta LLM Generar camino. Esto es para que coincida con la actual. `dataChart` El producto es Markdown fenced block Preservacion de la realidad y no forma definitiva de cierre de la orden。

7. **`diagram.generate` marcado como `safe`，No es igual al envio actual diagram El comando es `safe`。**
   A partir de 2026-05-07，`src/operations/registry.ts` Es deliberadamente `diagram.generate` No relevante como anfitrion generation core（`sourceMarkdown -> DiagramGenerationResult`）Exportar y asignar `safe` / `read-only` Semantica; pero mapeando el pasado command binding Aun asi continuar llevando informacion veraz de `src/workflowButtons.ts` de `requires-active-file` / `write-file` Metadatos. Entonces, lo que realmente necesitamos compensar en la siguiente etapa es core Abajo typed follow-through，En lugar de cambiar el nombre de la superficie de comando de envio actual。

## Estado de la tarea de la hoja de ruta

| Tareas | Objetivos del programa | Actual Real | Brecha |
|---|---|---|---|
| Tareas 0 | Construyendo y empaquetando la base. | Entregado (con restricciones）。`srcdoc` El anfitrion esta presente. `main.js` medio，`audit:render-host` Las puertas antihumo ya existen。 | Verdaderas entradas multiples / El aislamiento intensivo del tiempo de ejecucion aun no ha comenzado。 |
| Tareas 1 | Modelo de dominio de diagrama | Entregado。`DiagramIntent`、`DiagramSpec`、El validador y el planificador han ingresado a la linea principal.。 | Ninguno。 |
| Tareas 2 | Las especificaciones priorizan la canalizacion | Parcialmente completado. El ejecutor compartido existe, pero la superficie de comando publica permanece 3  ID，preview El camino tambien ha sido apuntado `vega-lite` fenced artifact Haz una bifurcacion parcial。`promptUtils.ts` Version antigua Mermaid El mensaje sigue ahi。 | Orden de callarse + Se eliminaron las indicaciones antiguas; y se deben conservar las indicaciones originales. Mermaid Disponibilidad de escenarios。 |
| Tareas 3 | Mermaid Adaptador V2 | Parcialmente completado。6  Mermaid Subtipos adapter Ya aterrice，`legacyFixerUtils.ts` Le ha quitado algunas responsabilidades。 | `mermaidProcessor.ts` Todavia demasiado pesado; cada subtarea dividida debe ser verdadera Obsidian Verificacion de imagen。 |
| Tareas 4 | Plataforma de renderizado | Entregado。registry / service / cache / preview modal / inline + iframe host Ya aterrice。 | Ninguno。 |
| Tareas 5 | JSON Canvas | Entregado。`.canvas` Producto, base. layout、Hay enlaces para guardar y obtener una vista previa disponibles.。 | Ninguno。 |
| Tareas 6 | Vega-Lite | Entregado (con restricciones）。`dataChart` uso iframe-host Obtenga una vista previa y guarde el producto como Markdown fenced `vega-lite`。 | Todavia confiando en el maestro de entrada unica bundle bridge；El tiempo de ejecucion pesado no se empaqueta de forma independiente。 |
| Tareas 7 | Tema / Exportar / release | Se entrega con el refuerzo actual anadido. Tema、SVG/PNG/source Exportar、release Restricciones de activos y workflow action pin Ya existe。 | No hay lagunas importantes en el producto, pero si en la media `main` CI Todavia desaparecido deliberadamente。 |
| Tareas 8 | motor avanzado | Pospuesto por diseno（R10）。 | La puerta de evaluacion no esta satisfecha.。 |

## Roadmap Corroboracion cruzada a largo plazo

Si `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.en.md` Considerado como una hoja de ruta a mediano y largo plazo, el trabajo pendiente actual se ha dividido claramente en tres niveles.：

1. **Se ha entregado la base de la plataforma.**
   `DiagramSpec`、renderer registry/service、Mermaid Subtipos adapters、JSON Canvas、Vega-Lite Vista previa、theme/export Alineacion y release El refuerzo ya no es un "objetivo futuro", sino una realidad fundamental. Deben verse como bases terminadas y no como capacidades por construir.。

2. **Aun no se ha completado el refuerzo de los limites**
   La deuda tecnica que realmente esta viva en la hoja de ruta se concentra ahora en la superficie de mando. canonical , verificacion semantica local del mantenedor y verdadero aislamiento de empaquetado para tiempos de ejecucion de servicio pesado. Estos tres tipos de problemas todavia obstaculizan la "madurez de la plataforma", pero ya no obstaculizan "si la plataforma existe".”。

3. **Prorrogas opcionales a mas largo plazo**
   Divida la capa de servicio y hagala mas completa. board-style export、Ademas de la exploracion avanzada de motores, siguen siendo direcciones validas, pero han quedado relegadas a los trabajos de estabilizacion antes mencionados y ya no deberian competir con el lote actual por prioridad.。

Esto significa que esta hoja de ruta ya no debe interpretarse como "continuar construyendo la plataforma", sino como "fortalecer la plataforma primero y luego decidir si expandirse hacia afuera".”。

## notebook-navigator Estado de finalizacion de la referencia cruzada

| # | Patron | Estado | Descripcion |
|---|---|---|---|
| 1 | Capa de servicio + DI | Aplazamiento | Es una reconstruccion arquitectonica y no bloquea la entrega actual. |
| 2 | LLM Almacenamiento en cache de respuestas | ✓ | Ha aterrizado en `src/llmUtils.ts` |
| 3 | Configure el interruptor de sincronizacion elemento por elemento | ✓ | Ya tengo `localOnly` Aislamiento |
| 4 | Canalizacion por lotes con recuperacion de interrupciones | ✓ | `src/batchProgressStore.ts` Ya aterrice |
| 5 | Documento de descripcion general de la arquitectura | ✓ | `docs/architecture.md` con `docs/architecture.zh-CN.md` |

## v1.8.3+ Principales capacidades implementadas.

| Funcion | Estado | Observaciones |
|---|---|---|
| Ventana emergente de bienvenida (instalacion por primera vez).） | ✓ | 22 idiomas |
| Ventana emergente de bienvenida con resumen de actualizaciones recientes | ✓ | Muestra el resumen de las dos versiones mas recientes cuando se abre por primera vez y admite la visualizacion con desplazamiento. |
| Apoyo del patrocinador（GitHub Star + ko-fi） | ✓ | Pagina de configuracion + Ventana emergente de bienvenida + README |
| Cline Analisis del token de alineacion | ✓ | Modelo predeterminado desconocido 8192 Cambiar a provider Toma de decisiones |
| Normalizacion del campo del borde del grafico | ✓ | `source/target/sourceId/targetId/start/end -> from/to` |
| Xiaomi MiMo Provider Predeterminado | ✓ | Continuar reutilizando acciones. OpenAI-compatible Al ejecutar, complete la conexion directa. chat Deteccion |
| Extraiga contenido original especifico en lotes | ✓ | Barra lateral / Las acciones del flujo de trabajo ahora admiten el nivel de carpeta `.md` / `.txt` Extraccion |
| Ventana emergente de guia de ruta de nota conceptual | ✓ | Agregar enlaces / El proceso de extraccion de conceptos puede saltarse o ignorarse esta vez o de forma permanente. |
| Establecer la estabilidad del enfoque del cuadro de entrada | ✓ | Los campos que se vuelven a dibujar durante el proceso de entrada restante ahora se cambian a blur / Enter Enviar |
| Un concepto mas seguro / Mermaid Valor predeterminado | ✓ | Ruta de la nota conceptual y Mermaid La deteccion de errores ahora esta habilitada de forma predeterminada |
| Selector de tipo de grafico preferido | Parcialmente completado | Actual UI Exponer subconjuntos, no iguales a todas las intenciones de tiempo de ejecucion |
| README i18n Prueba del contrato de alineacion | ✓ | Umbral de estabilidad en almacen |
| 8 Intencion en tiempo real API Verificacion | Solo evidencia historica local | Actualmente no se encuentra dentro del umbral de ejecucion sostenible dentro del almacen. |

## Estado actual del avance de la arquitectura.

**LLM Capas：**
- Se ha implementado el almacenamiento en cache de respuestas para reducir la duplicacion. API Costo。
- Salida del modelo desconocido token Se han tomado decisiones con Cline Alineacion。
- La configuracion del proveedor admite el aislamiento local y no obliga a todas las configuraciones confidenciales a participar en la sincronizacion.。
- OpenAI-compatible endpoint Ahora se incluye el soporte a la normalizacion. `/chat/completions` con `/models` Direccion del documento para reducir la personalizacion. Provider Error de empalme de ruta cuando。
- Distrito Chino OpenAI-compatible La superficie predeterminada tambien se ha ampliado a `Xiaomi MiMo`，Sin introducir adicionales transport Sucursal。

**Plataforma de graficos：**
- El tiempo de ejecucion aun es compatible 8 Intencion del grafico。
- `DiagramSpec -> adapter -> renderer` Se ha establecido la cadena principal y los puntos de extension centrales ya no estan vinculados a Mermaid Texto。
- `dataChart` Ya no se trata solo de “ahorrar JSON”，En su lugar, guardelo como Markdown fenced `vega-lite` Y admite vista previa local。
- `canvasMap` Si, es compatible, pero actualmente no UI Los objetivos expuestos preferidos en , que indican que las "capacidades de tiempo de ejecucion" y las "superficies predeterminadas del producto" han comenzado a superponerse。

**Infraestructura：**
- Persistencia del estado del progreso y documentacion de la arquitectura.、release workflow、README Las pruebas de alineacion estan todas en la linea principal.。
- release El camino ahora tiene un requisito de mantenimiento adicional.：GitHub Oficial workflow actions de major La version debe mantenerse al dia con la ventana de soporte y no puede esperar a que las advertencias de obsolescencia se conviertan en fallas reales.。
- Lo que realmente falta ahora es“secret-free / machine-free”de live verification harness，En lugar de mas marcos de pruebas unitarias。
- Tambien se ha aclarado la higiene del estado del flujo de trabajo local.：`.trellis/` Ahora se considera un estado local que debe conservarse y esta protegido contra una eliminacion accidental durante la sincronizacion o la preparacion de la version al ignorar la politica.。

**CLI Escalabilidad：**
- Envoltorio estable en maquina nativa `obsidian-cli` Todavia principalmente depurando/Entrada al escritorio, pero la capa inferior es oficial. `obsidian` CLI Ahora compatible `commands` con `command id=<command-id>`，Puede enumerar y activar comandos de registro de complementos.。
- Notemd Realmente hay algo en ello. CLI Potencial seam En niveles inferiores：`src/providerDiagnostics.ts`、`src/diagram/diagramGenerationService.ts`、`src/workflowButtons.ts`、`src/batchProgressStore.ts`，y `localOnly` Tales configuraciones/Semantica de serializacion。
- Por lo tanto, el proyecto todavia no puede agregar complementos. command IDs o sidebar actions Tratelo directamente como un proyecto de estabilizacion. CLI Superficie. La hostia hay que fumarla primero y no tiene nada que ver. operation，Otra vez command-trigger Definicion de escritura sobre la capa CLI Contrato de llamada。
- El primer lote de entregas especificas se ha realizado en provider diagnostics：Ahora compartido operation-input builder，Se ha agregado un nuevo comando de diagnostico del desarrollador, por lo que el panel de comandos, las combinaciones de teclas de acceso directo, los botones de la pagina de configuracion y las funciones oficiales pueden usar la misma ruta de implementacion. CLI Comando disparador de multiplexacion comun。
- La extraccion de enlaces ahora es mas especifica.：`src/operations/types.ts`、`src/operations/registry.ts`、`src/operations/capabilityManifest.ts` con `src/cliContracts.ts` Ya centralizado para emprender operation Metadatos、command-binding mapping kind、capability discovery Exportar con contratos tipificados。
- `diagram.generate` Ya no es solo un plan future item；Ha entrado tipo invocation contract，Mismo conjunto registry/contract Los caminos ahora tambien se exportan `diagram.preview` con `provider.connection.test` de typed operation surface，Manteniendo sus limitaciones originales automation level。
- Primer lote MT2 host-adapter Tambien se ha logrado el desapego：`src/operations/diagramGenerateOperation.ts` Responsable de la reutilizacion diagram Ruta de ejecucion，`src/operations/providerDiagnosticCommand.ts` Responsable `src/main.ts` Abajo provider diagnostic command orchestration。
- Segundo lote MT2 host-adapter slice Tambien ha aterrizado：`src/operations/diagramCommandHostAdapter.ts` Hazte cargo ahora Mermaid/artifact Ahorre acabado y franqueza. Vega-Lite Disposicion previa。
- Primer lote config/profile slice Tambien ha aterrizado：`src/operations/configProfileCommands.ts` Tomalo ahora provider profile Importar, exportar y CLI capability/contract Acuerdo de exportacion, la pagina de configuracion ya no conserva un conjunto de implementaciones paralelas。
- provider diagnostic report persistence Tambien ha aterrizado：`src/operations/providerDiagnosticReportPersistence.ts` Ahora emprenda la logica de creacion del archivo del informe de diagnostico evitando conflictos.，`src/main.ts` Ya no mantener este conjunto de estrategias de ruta en linea。
- provider diagnostic host adapter Tambien ha aterrizado：`src/operations/providerDiagnosticCommandHostAdapter.ts` Ahora acepta comandos de diagnostico del desarrollador. settings Carga, cableado de ubicacion de informes y orientado al usuario. notice Cirugia Plastica，`src/main.ts` Ya no mantenga este acuerdo en linea。
- config/profile host adapter Tambien ha aterrizado：`src/operations/configProfileCommandHostAdapter.ts` Ahora emprenda la persistencia del estado de importacion y exportacion.、CLI Exportar notice Dar forma y mapear errores de importacion y exportacion，`src/main.ts` Este grupo ya no se mantiene en linea. CLI Orquestacion de adyacencia。
- provider connection-test host adapter Tambien ha aterrizado：`src/operations/providerConnectionTestCommandHostAdapter.ts` Ahora aceptado al mismo tiempo. `test-llm-connection` Con pagina de configuracion provider Flujo de prueba, ambas superficies ya no permanecen paralelas `testAPI` Arreglo。
- note-processing host adapter El primer lote tambien ha llegado.：`src/operations/noteProcessingCommandHostAdapter.ts` Ahora aceptado `process-current-add-links`、`process-folder-add-links`、`batch-generate-from-titles`、`generate-from-title` con `research-and-summarize` de busy-guard、reporter Ciclo de vida、notice/error-log Arreglo，`src/main.ts` Ya no mantenga este lote de paquetes de comandos en linea。
- note-processing host adapter Tambien se ha ejecutado el segundo lote: ahora se sigue llevando a cabo el mismo expediente `translate-current-file`、`batch-translate-folder`、`extract-concepts-current`、`extract-concepts-folder`、`extract-original-text` con `extract-concepts-and-generate-titles` de command-host Arreglo，`src/main.ts` Traduccion en/Extraccion wrapper ahora se ha reducido a delegator。
- Tambien se ha alineado el verdadero comportamiento de los comandos combinados.：`extract-concepts-and-generate-titles` No mas capas exteriores `isBusy` Detengalo usted mismo y ya no ignore el directorio de conceptos en la configuracion.。
- note-processing registry onboarding Tambien ha aterrizado：`src/operations/registry.ts`、`src/operations/capabilityManifest.ts` con `src/cliContracts.ts` Ahora el `translate.file`、`translate.folder-batch`、`concept.extract-file`、`concept.extract-folder`、`content.extract-original-text` con `workflow.extract-and-generate` Inclusion en primera clase operation Metadatos en lugar de permanecer en descripciones de comandos fragmentadas。
- note-processing cola larga registry batch Tambien implementado: el mismo conjunto. registry/manifest/contract El camino ahora tambien queda expuesto `file.process-add-links`、`file.process-folder-add-links`、`content.generate-from-title`、`content.batch-generate-from-titles` con `research.summarize-topic`，CLI capability matrix El anterior process / generate / research placeholder mapping Convertido a la realidad registry-backed operation。
- selection/export registry batch Tambien implementado: el mismo conjunto. operation surface Ahora tambien cubierto `editor.create-link-and-generate`、`provider.profile.export`、`provider.profile.import`、`cli.capability-manifest.export` con `cli.invocation-contract.export`，viejo“selection/export surfaces La sentencia “aun faltante” ya no es un hecho actual.。
- translation/extraction utility La frontera tambien se ha cerrado aun mas.：`batchTranslateFolder()` Ahora admite la inyeccion externa. reporter，No mas `ProgressModal` Como unico transportista；`extractOriginalText()` Ahora se devolvera el objeto de resultado estructurado, exito notice Tambien por host adapter Adquisicion explicita。
- Siguiente lote utility host adapter Tambien ha aterrizado：`src/operations/utilityCommandHostAdapter.ts` Tomalo ahora duplicate cleanup、batch Mermaid fix con single/batch formula fix de command orchestration，Estos `src/main.ts` wrapper tambien ha sido contratado para delegator。
- Resto minimo write-heavy contract El lote tambien ha sido liberado.：`src/translate.ts` Ahora regresara `TranslateFileResult` / `BatchTranslateFolderResult`，`src/formulaFixer.ts` Ahora regresara `FormulaFixFileResult` / `BatchFormulaFixResult`，host adapter Asumir su exito ahora notice，`src/operations/registry.ts` Tambien exportado directamente richer de `translate.*` / `formula.*` result schema。
- Primer lote `src/fileUtils.ts` contract La subporcion tambien aterrizo.：`processFile()` Regresa Ahora `ProcessFileResult`，`generateContentForTitle()` Regreso `GenerateContentForTitleResult`，`batchGenerateContentForTitles()` Regreso `BatchGenerateContentForTitlesResult`，`runProcessFolderWithNotemdCommandWithHost()` Informare ahora `savedCount` / `errors` / `cancelled`，Las ramas sin archivos generadas por lotes tambien se han eliminado de utility-owned La ruta del pseudo-exito se cambia a host-owned notice。
- `src/fileUtils.ts` La cola restante del：`batchFixMermaidSyntaxInFolder()` Regreso `BatchMermaidFixResult`，`checkAndRemoveDuplicateConceptNotes()` Regreso `ConceptDedupeResult`，duplicate deletion confirmation Cambiado a host Inyeccion，`mermaid.batch-fix` / `concept.dedupe` de richer schema Tambien entro registry。
- Mas profundo diagram command-core La rebanada ahora tambien esta en el suelo.：`src/operations/diagramCommandExecution.ts` Tomalo ahora `src/main.ts` Abajo Mermaid-save con artifact-save Ejecutar el proceso mientras `diagram.generate` Ahora tambien devuelve explicito `followThrough` Estructura（`kind`、`outputPath`、`previewOpened`、`autoFixAttempted`、`artifactTarget`），Sin dejar de conservar la capa superior compatible con versiones anteriores `outputPath` / `previewOpened` Campos。
- `src/fileUtils.ts` con `src/extractOriginalText.ts` Ahora se aceptan los mas estrechos. runtime context，En lugar de depender directamente de datos especificos `NotemdPlugin` Clase. Esto muestra que la frontera ha comenzado a desplazarse de "dibujarse" wrapper”Avanza hasta “Debilitar utility Acoplamiento de tipos de clases de host”。
- La brecha arquitectonica restante vuelve a cambiar: sustancial diagram execution Ya no queda en linea `src/main.ts`，y `diagram.generate` El primer piso de abajo. typed follow-through Tambien ha aterrizado. El proximo lote debe juzgar si esta estructura implementada es suficiente antes de ingresar. packaging / semantic verification El posterior endurecimiento de la write-heavy families。
- La ultima capa de ajuste es: esto sigue siendo un "problema de capas", no un "problema de cantidad de comando". deberia ser `diagram.generate` Sea independiente del host core，Hazlo explicito `followThrough` Estructura tratada como actual command-completion contract，Solo cuando una rama posterior realmente demuestre que es independiente del host, se considerara que continua actualizandose a una nueva. top-level operation ID。

## Puerta de verificacion actual

### Puertas de ejecucion sostenible en almacenes.

Los siguientes umbrales se pueden reproducir de manera estable en el almacen actual y deben considerarse como los umbrales reales de la linea principal.：

- `npm run build`
- `npm test -- --runInBand`
- `npm run audit:i18n-ui`
- `npm run audit:render-host`
- `git diff --check`

Correspondiente al valor verdadero remoto：

- Ordinario `main` push Actualmente no existe ningun sistema automatico. GitHub Actions workflow
- release-tag El valor de verdad proviene de `.github/workflows/release.yml`
- Cuando `commits/<sha>/status` Solo devolucion `pending` Con barras cero status Cuando no sea la autoridad para este repositorio CI Senal

### La evidencia historica local no es igual a la actual. CI Puerta

Las siguientes conclusiones se pueden utilizar como referencia para el juicio de direccion, pero ya no se pueden describir en el documento como "el umbral automatico estricto actual del almacen".”：

- 2026-05-02 Tseng para todos 8 Intencion del grafico realizada una vez en tiempo real DeepSeek API Verificacion
- Relevante harness Eliminado de la linea principal debido a la dependencia del local. vault Rutas, claves reales y llamadas de red no deterministas.

## Drawnix Conclusion de referencia externa.

Ver detalles：`docs/brainstorms/2026-05-03-drawnix-feasibility-and-integration-direction.zh-CN.md`

Breve conclusion：

1. **No deberia Drawnix Incrustacion de todo el host Notemd。**
   es Nx monorepo + React 19 + Plait/Slate + browser-fs-access + browser storage Una pila completa de aplicaciones de pizarra que supera significativamente la actual Obsidian Limites de los complementos。

2. **Lo que realmente vale la pena aprender es el limite de los datos y el limite de la transformacion.。**
   Drawnix en `ref/drawnix/packages/drawnix/src/data/types.ts` Como se define en `.drawnix` Modelo de exportacion、`ref/drawnix/packages/drawnix/src/data/json.ts` Importacion de archivos del navegador en/Limites de exportacion、`markdown-to-drawnix` / `mermaid-to-drawnix` Metodo de carga diferida, y app shell / board / text renderer El pensamiento estratificado tiene valor de referencia。

3. **Si quieres apoyarlo en el futuro board-style La exportacion debe realizarse directamente. `DiagramSpec -> PlaitElement[]` Adaptador en lugar de `DiagramSpec -> Mermaid -> mermaid-to-drawnix` Plan de desvio。**
   De lo contrario, los existentes spec-first La capa semantica se degrada nuevamente al estado intermedio de cadena.。

## Restricciones estrictas (aun vigentes)）

1. **MermaidProcessor Descomposicion**：Cada subtarea debe ser real Obsidian Verifique y guarde de forma independiente la verificacion de imagenes. Las pruebas unitarias por si solas no son suficientes para avanzar。
2. **La version anterior solicita el retiro**：`promptUtils.ts` Originales Mermaid Las palabras clave estan especialmente adaptadas a los escenarios antiguos; cualquier desmantelamiento o fusion debe conservar la disponibilidad de los escenarios antiguos.。
3. **Compatibilidad con versiones anteriores**：Existente provider Configuracion、transport Los protocolos y configuraciones no se pueden destruir.。

## Direccion de seguimiento

### Disponible inmediatamente

1. **Packaging / semantic-verification Convergencia**
   Mantenlo actualizado command ID Mantente estable y continua `diagram.generate` Tratelo como a un anfitrion y no tenga nada que ver con ello. generation contract，Al mismo tiempo, ponga las nuevas implementadas `followThrough` Las estructuras se consideran subyacentes. command-completion Capas. primer lote convergence slice Registrado ahora：`npm run verify:diagram-semantics` Generara una banda packaging-boundary Mantenedor del recordatorio para verificar la plantilla, mantenedor runbook Se ha alineado con el y la prueba correspondiente tambien ha bloqueado el verdadero valor de este conjunto de redaccion. El siguiente paso ya no es "como escribir esta capa", ni tampoco "si rellenar la primera capa". runbook”，Pero juzga que este conjunto ha sido implementado. helper/runbook Si el valor real es suficiente, entonces proceda. packaging isolation，Y si es necesario seguir mejorando aun mas en el futuro contract boundary。

2. **Poner el facturado live verification runbook / helper Usalo**
   El almacen ahora no depende de la codificacion fisica. vault Camino o seguido secrets Proceso de mantenedor repetible. El proximo trabajo de mayor apalancamiento es poner esto helper convertirse renderer Publicar la ruta estandar de evidencia para los cambios relevantes y luego determinar si realmente se necesitan cambios mas solidos. machine-free harness。

3. **Empaquetado en tiempo de ejecucion (tarea 0 Resto）**
   para Vega-Lite Cree una verdadera estrategia de activos independientes o de multiples entradas mientras espera grandes corridas.。

4. **release workflow Mantenimiento**
   voluntad GitHub workflow action major Se consideran actualizaciones de version. release Parte de la propiedad de la ruta, no espere a que las advertencias de desuso se conviertan en fallas reales job。

5. **Mantener la higiene en el area de trabajo.**
   `ref/` con `coverage/` El analisis debe considerarse local. / Construya artefactos, no entregables. La linea principal necesita mantener continuamente un arbol de trabajo limpio.。

6. **Aterrizar primero direct-surface wrapper Lote, hablemos de otras cosas**
   Este lote ya ha llegado：`testLlmConnectionCommand` Delegado a `runInteractiveProviderConnectionTestCommandWithHost`，`generateDiagramCommand` con `previewExperimentalDiagramCommand` Delegado a `runGenerateDiagramCommandWithHost` con `runPreviewExperimentalDiagramCommandWithHost`。provider/diagram Las entradas publicas ahora estan estructuradas. result，Y por host adapter Llevar a cabo la orquestacion del ciclo de vida y dejar de tratar los problemas temporales. busy/reporter Logica esparcida por todas partes `src/main.ts` Li。

7. **La siguiente etapa es cruzar el ya desembarcado. follow-through Las capas continuan convergiendo**
   Las brechas de alto valor restantes ya no se encuentran en estos sectores publicos. direct command method En si mismo, ya no lo es `diagram.generate` El primer piso de abajo. follow-through Mecanografia de。`diagram.preview` con `provider.connection.test` de typed contract Ya aterrizo，`diagram.generate` Ahora tambien lleva explicita `followThrough`。Lo que realmente queda es el progreso packaging/semantic-verification Al mismo tiempo, juzgue si esta estructura implementada es suficiente y luego decida si hay sucursales en el futuro que valga la pena continuar actualizando con otras adicionales. typed boundary。Esta prioridad es superior a la reapertura de los paises retirados. utility family。

### Secuencia de aterrizaje recomendada

combinar roadmap Segun la intencion original a largo plazo y la realidad actual del codigo, la secuencia de implementacion futura mas confiable deberia ser：

1. Primero conserve las capas mas profundas de este nuevo lote de aterrizajes. diagram/provider command-core La estratificacion es estable y determinada. `src/operations/diagramCommandExecution.ts` Dentro de save/artifact La sucursal continua como la actual. `diagram.generate.followThrough` contract，¿Deberia actualizarse a extra en el futuro? typed operation boundary
2. Luego continue con la verificacion semantica local del mantenedor y el posterior endurecimiento de los limites del empaquetado en tiempo de ejecucion de servicio pesado.
3. Una vez que estos terminos limite sean estables, proceda selection/export contract Mejora y workflow/settings packaging Limpiar
4. Complete estos trabajos de limites antes de reabrir legacy prompt Jubilacion、MermaidProcessor sunset，o mas first-class CLI command Exposicion
5. Reevaluar al final board-style export Explora con motores avanzados

Esta orden preserva roadmap El objetivo a largo plazo tambien respeta el hecho de que la linea principal actual ha sido entregada。

### Bloqueado por duras limitaciones

6. **La version anterior solicita el retiro**
   Primero debes usar la realidad Obsidian Volver al original Mermaid Escena。

7. **MermaidProcessor sunset**
   Debe dividirse bloque por bloque y tomarse capturas de pantalla bloque por bloque para su aceptacion. No puedes confiar unicamente en Jest。

8. **Drawnix Integracion**
   Actualmente solo es adecuado como referencia externa y candidato a futuro objetivo de exportacion, y no deberia prevalecer sobre la prioridad principal.。

## Criterios de aceptacion: Plataforma de graficos

Se deben cumplir al menos dos niveles de aceptacion antes de la liberacion.：

### Capas 1：Puertas duras en el almacen.

- `npm run build`
- `npm test -- --runInBand`
- `npm run audit:i18n-ui`
- `npm run audit:render-host`
- `git diff --check`

### Capas 2：Verificacion semantica local del mantenedor (cuando los cambios implican `src/diagram/`、`src/mermaidProcessor.ts` O cuando realmente se representa el comportamiento）

- verdadero Obsidian Verificacion de muestreo medio Mermaid / JSON Canvas / Vega-Lite
- Guarde e inspeccione la imagen de salida o el archivo del producto.
- Documente claramente que se trata de una "verificacion semantica local" y no de la verificacion automatizada actual del almacen. CI

Lo que mas hay que hacer ahora no es “escribir otro lote de live test "Documentar" ya no es "actualizar esta capa de verificacion al primer proceso de mantenimiento repetible". Este paso ahora existe. Lo que realmente hay que hacer es continuar registrando helper/runbook Con la verdad packaging Mantenga los limites alineados y luego juzgue si vale la pena seguir construyendo mas fuerte machine-free harness。
