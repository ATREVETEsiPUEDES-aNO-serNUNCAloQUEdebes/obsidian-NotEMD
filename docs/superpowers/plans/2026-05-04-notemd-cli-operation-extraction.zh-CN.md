# Notemd CLI Operation Extraer el plan de implementacion.

> **Al agente albacea：** en limpio worktree Ejecutado en. Poner al funcionario. `obsidian` CLI Tratada como una base de activacion de comandos en lugar de un protocolo completo de automatizacion de complementos.。

**Metas：** poner Notemd Avance de "conjunto de comandos de complemento" a "puede ser oficialmente Obsidian CLI、Futuro `obsidian-cli` El contenedor y el mantenedor se llaman juntos automaticamente operation Sistema” sin copias repetidas orchestration Logica。

**Arquitectura：** Distincion forzada entre cuatro capas.：

1. trigger capa：`obsidian command id=...`、Panel de comando、sidebar、workflow DSL
2. host adapter capa：plugin UI / Oficial CLI / Guion de mantenimiento
3. operation Capas: entrada escrita, salida escrita, efectos secundarios explicitos
4. contract Capa: descubrimiento de capacidades, parametros. schema、Resultados schema、Semantica del progreso.

**Pila de tecnologia：** TypeScript、Obsidian Plugin API、Oficial Obsidian CLI、Jest、Markdown Documentacion, opcional JSON-schema Restricciones de tipo de estilo

---

## Actualizacion de alineacion de progreso（2026-05-08）

Este plan es ahora principalmente un relato historico de su implementacion. La ruta de extraccion descrita en el documento es `main` La mayoria de ellos han sido implementados.。

Hechos implementados：

- `src/operations/noteProcessingCommandHostAdapter.ts` Con `src/operations/utilityCommandHostAdapter.ts` Se ha hecho cargo de la linea anterior en `src/main.ts` en write-heavy Efectos secundarios del host de comandos。
- `src/operations/registry.ts`、`src/tests/operationsRegistry.test.ts`、`src/tests/cliCapabilityManifest.test.ts` Con `src/tests/cliContracts.test.ts` Cubierto note-processing + utility operation familia（`translate.*`、`concept.*`、`content.extract-original-text`、`workflow.extract-and-generate`、`duplicate.*`、`mermaid.batch-fix`、`formula.*`）。
- diagram/provider command-core layering Explicito en la profundidad actual：`diagram.generate` Declaracion escrita `followThrough` Detalles, al mismo tiempo command binding Mantenlo real `requires-active-file` / `interactive-ui` Semantica。

Brecha real restante：

1. Heavy-runtime packaging isolation Aun no realizado. El limite actual de entregables sigue siendo de entrada unica. `main.js` + En linea `srcdoc` host。
2. packaging/semantic-verification Es necesario mantener la convergencia continuamente helper Plantillas, documentos de mantenimiento y repo gate El valor de verdad de。
3. workflow/settings Con selection/export de contract La mejora debe estar en packaging Continuar avanzando despues de que se estabilice el trabajo fronterizo.。

---

## Definicion del problema

Oficial `obsidian` CLI Ahora es posible enumerar y ejecutar comandos de registro de complementos. Es valioso, pero no es suficiente.：

- Actual Notemd Los comandos todavia dependen en gran medida de `src/main.ts` orchestration
- Muchos procesos aun estan atados `App`、`Editor`、`MarkdownView`、Notice、modal、active file
- La capa de activacion de comandos no tiene superficies de parametros escritos, contratos de resultados estables ni metadatos de capacidad.

Si terminas quedandote en“CLI Puede activarse command ID”，Las capacidades de automatizacion seguiran siendo fragiles. El verdadero objetivo de la ingenieria no es seguir expandiendose. command IDs，En su lugar, construya un sistema estable bajo la capa de comando. operation surface。

## Seguimiento de la demanda

Documentos fuente：

- `docs/brainstorms/2026-05-04-obsidian-cli-extensibility-and-notemd-capability-extraction.zh-CN.md`
- `docs/brainstorms/2026-05-02-progress-audit-and-next-direction.zh-CN.md`
- `docs/architecture.zh-CN.md`
- `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md`
- `docs/maintainer/notemd-cli-capability-matrix.md`

Restricciones de herencia：

- No tomes la corriente command IDs Tratelo como un proyecto de estabilizacion. API
- Preservar el comportamiento del comando del complemento existente del lado del usuario durante la extraccion
- Primer lote CLI-grade contract No incluido UI-only Proceso
- Con CLI Avance direccional，`src/main.ts` Reducir en lugar de expandirse

## Estado actual de la linea principal（2026-05-08）

- `src/operations/types.ts` Se acepta compartir operation Primitivos de metadatos, ya no entierran estas definiciones en sidebar/workflow En el codigo。
- `src/operations/registry.ts` Ahora esta extraido. operation definition、command binding、mapping kind Con piezas input/result schema Fuente central de hecho。
- `src/operations/capabilityManifest.ts` Con `src/cliContracts.ts` Ahora todo empieza desde esto registry Derivado, que reduce una importante ruta de deriva de metadatos。
- `diagram.generate` Ya y ahora provider diagnostics Tambien tiene mecanografia. invocation contract。
- Primer lote MT2 Se ha implementado la division de la capa de ejecucion.：`src/operations/diagramGenerateOperation.ts` Ahora emprenda la reutilizacion. diagram Ruta de ejecucion，`src/operations/providerDiagnosticCommand.ts` Tomalo ahora `src/main.ts` Abajo provider diagnostic command orchestration。
- Segundo lote MT2 host-adapter slice Tambien ha aterrizado：`src/operations/diagramCommandHostAdapter.ts` Tomalo ahora Mermaid/artifact Ahorre para los toques finales、preview Cerradora y directa Vega-Lite Disposicion previa。
- Primer lote config/profile Tambien se ha conseguido el desapego：`src/operations/configProfileCommands.ts` Tomalo ahora provider profile Importar, exportar y CLI capability/contract Acuerdo de exportacion，`src/main.ts` Con `src/ui/NotemdSettingTab.ts` Se ha compartido la misma ruta de comando.。
- provider diagnostic report persistence Tambien retirado：`src/operations/providerDiagnosticReportPersistence.ts` Ahora adopte la logica de colocar archivos de informes de diagnostico para evitar conflictos.。
- provider diagnostic host adaptation Tambien retirado：`src/operations/providerDiagnosticCommandHostAdapter.ts` Ahora se aceptan comandos de diagnostico del desarrollador settings Carga, informe de cableado de colocacion y notice Dar forma a la logica。
- config/profile host adaptation Tambien retirado：`src/operations/configProfileCommandHostAdapter.ts` Tomalo ahora CLI Persistencia del estado de importacion y exportacion adyacente、notice Logica de configuracion y mapeo de errores。
- provider connection-test host adaptation Tambien retirado：`src/operations/providerConnectionTestCommandHostAdapter.ts` Ahora emprende el compartir provider Probado settings Carga y notice/report Organice la logica y haya sido reutilizada por la ruta de comando y la pagina de configuracion.。
- note-processing host adaptation Ahora continua expandiendose al segundo lote.：`src/operations/noteProcessingCommandHostAdapter.ts` Ahora ademas de emprender `process-current-add-links`、`process-folder-add-links`、`batch-generate-from-titles`、`generate-from-title` Con `research-and-summarize` Ademas, seguiremos emprendiendo `translate-current-file`、`batch-translate-folder`、`extract-concepts-current`、`extract-concepts-folder`、`extract-original-text` Con `extract-concepts-and-generate-titles` de busy-guard、reporter Ciclo de vida y notice/error-log Arreglo。
- `src/fileUtils.ts` Con `src/extractOriginalText.ts` Ahora tambien se aceptan los mas estrechos. runtime context，En lugar de depender directamente de datos especificos `NotemdPlugin` clase。
- Existente Obsidian El comando permanece registrado y continua admitiendo teclas de acceso directo y oficiales. CLI Desencadenante, mientras subyacente operation Las capas siguen evolucionando。

## Entrega a corto plazo（0-2 Semana）

### Metas

Cree el primer lote de productos sin cambiar el comportamiento del producto. CLI-grade seam。

### Elementos de trabajo

- Definicion operation taxonomy Con automation-level Glosario
- Extraccion provider diagnostics No tiene nada que ver con el anfitrion operation surface
- Congelar la corriente `notemd:*` comando capability matrix
- Definir los primeros contratos de resultado tipificados para capacidades no interactivas.

### Unidad de implementacion

**ST1. Operation contract Tipos basicos**
- crear `src/operations/types.ts`
- Definicion：
  - `OperationDefinition`
  - `OperationContext`
  - `OperationResult`
  - `ProgressSink`
  - `AutomationLevel`
- Mantenga estos tipos libres de dependencia Obsidian UI clase
- Estado de implementacion：
  - La primitiva de compartir ya esta en `src/operations/types.ts` Aterrizaje
  - workflow Los metadatos ahora importan estas primitivas en lugar de redefinirlas localmente.

**ST2. Provider diagnostic operation**
- Cambiar la corriente `src/providerDiagnostics.ts` Paquete a la estabilidad. operation Detras de la entrada
- Campos de entrada esperados：
  - provider name
  - model override
  - call mode
  - timeout
  - stability runs
  - optional output path
- Campos de resultados esperados：
  - success
  - report path/text
  - elapsed time
  - warnings
  - debug summary
- Progreso actual：
  - Compartir operation-input builder Ya implementado
  - Se ha implementado la capa de empaquetado de comandos de diagnostico del desarrollador.
  - Ahora se puede utilizar la misma ruta de diagnostico mediante el boton de la pagina de configuracion, el panel de comando, las teclas de acceso directo y las funciones oficiales. CLI Comando desencadenante de multiplexacion comun

**ST3. Capability matrix Como fuente de verdad**
- Clasifique los comandos de complementos existentes en：
  - `safe`
  - `requires-active-file`
  - `requires-selection`
  - `interactive-ui`
- Identificar que ordenes son apropiadas para el funcionario hoy. CLI Desencadenantes y que no hacer

### Verificacion

- `npm run build`
- full Jest
- provider diagnostics Las pruebas de contratos relevantes siguen siendo verdes
- La regresion de comandos del lado del usuario no aparece

### Mejores practicas

- Priorizar la exportacion de evidencia documentada en lugar de UI Notice
- Priorice los objetos de entrada explicitos en lugar de leer el estado global del complemento
- El primer lote sorteado operation Mantenlo pequeno y estable

### Escollos

- Se elimino el directorio pero aun se puso. `App` El paso a traves esta en todas partes
- operation Los resultados aun se filtran UI Redaccion publicitaria
- Pon “puede ser CLI La llamada "se juzga erroneamente como" ya lista para la automatizacion "”

## Entrega provisional（2-6 Semana）

### Metas

Construir capacidades verdaderamente reutilizables en torno a las capacidades de mayor valor. operation capa。

### Elementos de trabajo

- retirar diagram generation Tipificacion de operation contract
- Introduccion plugin UI / Oficial CLI de host adapters
- poner workflow metadata De sidebar-only Actualizacion de configuracion para reutilizar registry
- para CLI Reutilizar la creacion config/profile Limites semanticos

### Unidad de implementacion

**MT1. Diagram generation operation**
- Utilice la estabilidad operation Encapsulacion `src/diagram/diagramGenerationService.ts`
- Apoyo：
  - source markdown input
  - source file path input
  - requested intent
  - compatibility mode
  - output mode（`artifact` / `mermaid`）
  - save/dry-run behavior
- Regreso：
  - plan
  - spec
  - artifact metadata
  - saved path
  - render warnings
- Estado de implementacion：
  - Compartir `DiagramOperationInput` Se ha implementado la cirugia plastica.
  - `diagram.generate` Ahora entrado registry Mecanografia del conductor invocation contract
  - Las rutas de ejecucion reutilizables ahora caen en `src/operations/diagramGenerateOperation.ts`
  - save/preview La logica de adaptacion del anfitrion ahora cae dentro `src/operations/diagramCommandHostAdapter.ts`
  - provider profile Importar, exportar y CLI contract/capability La exportacion ahora cae bajo `src/operations/configProfileCommands.ts`
  - provider diagnostic report persistence Ahora cae `src/operations/providerDiagnosticReportPersistence.ts`
  - provider diagnostic host adaptation Ahora cae `src/operations/providerDiagnosticCommandHostAdapter.ts`
  - config/profile host adaptation Ahora cae `src/operations/configProfileCommandHostAdapter.ts`
  - provider connection-test host adaptation Ahora cae `src/operations/providerConnectionTestCommandHostAdapter.ts`
  - note-processing host adaptation El primer lote ya ha caido. `src/operations/noteProcessingCommandHostAdapter.ts`
  - Brecha residual: en espera operation/command Bajo la premisa de la realidad en capas, cambie el enfoque de la proxima ola a packaging/semantic-verification Convergencia y seguimiento workflow/settings contract Mejora

**MT2. Host adapter dividir**
- nuevo plugin adapter，Responsable del analisis active file、vault state、settings
- nuevo CLI adapter，Responsable del analisis file path、vault targeting、output path、stdout/stderr Comportamiento
- adapter Mantenlo delgado, la logica empresarial permanece operations

**MT3. Workflow/action registry Refuerzo**
- poner `src/workflowButtons.ts` Promocionar a metadata source，No solo configuracion de botones
- para cada action aumentar：
  - automation level
  - required context
  - side-effect class
  - parameter expectations
- Estado de implementacion：
  - sidebar action metadata Todavia command-surface Fuente de semantica
  - nuevo operation registry Ahora emprende la superficie transversal. command binding、mapping kind（`exact` / `future-target` / `legacy-alias`）y manifest/contract Exportar insumos
  - viejo command alias El registro se mantiene por compatibilidad con los procesos existentes, pero se ha excluido deliberadamente. capability-manifest Mas alla de la exportacion

**MT4. Config/profile Limites**
- voluntad plugin-owned state Con importacion y exportacion automation profile state Separacion
- Primera hornada de candidatos：
  - provider/model selection
  - `preferredDiagramIntent`
  - diagnostic mode/timeouts
  - workflow definitions
- En absoluto export/import Expresar reservas en el diseno. `localOnly` Semantica

### Verificacion

- full build + full Jest
- diagram generation output contract comprobar
- Existente command IDs En el oficial CLI Continue al lado del activador.

### Mejores practicas

- Definir primero output schema，Reexponer portales automatizados
- preview Enfoque y generation Separacion de preocupaciones
- Agregar mas llamadas operation Compensalo primero capability discovery

### Escollos

- poner preview/UI Los efectos secundarios aparecen generation operation
- en metadata Antes de estandarizar workflow DSL Expuesto al publico API
- Confusion command IDs Con operation IDs

## Entrega a largo plazo（6 Mas de 49 semanas）

### Metas

En el oficial command-trigger Por encima de la capa, exponga la superficie de integracion de automatizacion verdaderamente madura.。

### Elementos de trabajo

- Introduccion capability-discovery command o manifest surface
- Para seleccionados operations Agregar escritura invocation contract
- Apoyo machine-readable progress / result emission
- Evaluacion final transport Deberia quedarse en command-based、file-based，O evoluciono hacia local bridge

### Unidad de implementacion

**LT1. Capability discovery**
- Publicar metadatos de capacidad estable：
  - operation ID
  - version
  - required context
  - accepted input schema
  - result schema

**LT2. Typed invocation layer**
- en raw command IDs Construya estabilidad sobre “invoke operation” contract
- Apoyar la certeza exit codes Con machine-readable errors

**LT3. Opcional richer transport**
- Evaluacion command-trigger-only integration ¿Es suficiente?
- Solo si operation contracts Considerar solo despues de la estabilizacion local REST / IPC / file bridge

### Verificacion

- Automatizacion del mantenedor de un extremo a otro smoke tests
- Guardalo backward-compatible command trigger support
- No compatible interactive flows Documente claramente

### Mejores practicas

- operation contract Independiente de command label Hacer versiones
- transport Elige siempre al lado de contract Estabilidad
- Apunte a una automatizacion mantenible, no a un diseno sofisticado

### Escollos

- en contract Hazlo antes de estabilizarte. transport
- Quitar una determinada maquina de mantenimiento. wrapper Comportamiento codificado en la arquitectura del almacen
- Filtre directamente la forma del objeto interno del complemento a la automatizacion publica. API

## Secuencia de aterrizaje fija

1. provider diagnostic operation
2. capability matrix + automation levels
3. diagram generation operation
4. workflow/action registry hardening
5. config/profile extraction
6. typed invocation layer
7. optional richer transport

Descripcion del progreso：

- Capitulo 1-5 El articulo esta actualmente contract Ha aterrizado en profundidad, incluyendo note-processing + utility registry onboarding，y escrito `diagram.generate.followThrough` Metadatos finales de comando。
- El siguiente paso ya no es la traduccion./Extraccion wrapper Despegar. La verdadera brecha en el seguimiento es hacerlo primero. packaging/semantic-verification convergence Endurecer y luego base packaging Superacion de limites workflow/settings Con selection/export de contract Toma de decisiones。

## Criterios de salida

- Ten al menos uno no interactivo Notemd La habilidad no tiene nada que ver con el anfitrion. operation contract Invocable
- command IDs Compatibilidad continua, pero ya no es la unica historia de integracion
- Los mantenedores pueden senalar claramente que capacidades son adecuadas para uso oficial en la actualidad. CLI Desencadenantes y causas
- El almacen esta listo para seguir adelante. operation extraction Plan de implementacion estable, no es necesario volver a debatir la direccion arquitectonica
