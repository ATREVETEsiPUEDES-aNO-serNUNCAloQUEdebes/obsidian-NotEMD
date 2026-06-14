---
date: 2026-05-05
topic: cli-mainline-progress-sync-and-next-phase-requirements
---

# CLI Sincronizacion del progreso de la linea principal y los requisitos de la siguiente etapa.

> Actualizacion（2026-05-07，mas tarde): este paso follow-through La decision ya esta tomada。`diagram.generate` Continue siendo independiente del host generation core，Y Mermaid/artifact Preservacion y preview Completar ahora mediante escritura explicita `followThrough` La estructura resultante queda expuesta conservando la capa superior compatible con versiones anteriores. `outputPath` / `previewOpened`。La proxima ronda de implementacion deberia pasar a packaging / semantic-verification Convergencia, a menos que haya nuevas fronteras de exportacion que sean suficientemente independientes del pais anfitrion.。

## Encuadre del problema

A partir de 2026-05-05，Notemd de CLI Las lineas principales pertinentes ya no estan estancadas en la "gran escala" operation Etapa de “extraccion”：

- Ultimo control remoto `main` Incluido operation registry、capability/contract Exportacion y el primer lote. diagram / provider / config-profile host-adapter Desapego
- clean worktree Esta ronda ha combinado traduccion, extraccion de conceptos, extraccion de texto original y `extract-concepts-and-generate-titles` Los comandos combinados se reducen a `src/operations/noteProcessingCommandHostAdapter.ts`
- Tambien ha aterrizado la misma ronda. note-processing registry onboarding、Primer lote utility-command registry、process / generate / research cola larga registry batch，y selection/export registry batch
- `src/fileUtils.ts` con `src/extractOriginalText.ts` No mas acoplamiento fuerte y concrecion `NotemdPlugin` clase, en lugar de aceptar una mas estrecha runtime context
- Tambien se han solucionado dos errores reales con el comando combinar: capa exterior `isBusy` El proceso de extraccion interno ya no sufre cortocircuitos y la generacion de lotes tambien se ha alineado con el directorio de conceptos en la configuracion.
- El ultimo segmento de seguimiento ya ha completado el lote minimo de prueba de escritura.：
  - `translateFile()` Regreso `TranslateFileResult`
  - `batchTranslateFolder()` Regreso `BatchTranslateFolderResult`，Contiene errores de agregacion y salida archivo por archivo
  - `fixFormulaFormatsInFile()` Regreso `FormulaFixFileResult`
  - `batchFixFormulaFormatsInFolder()` Regreso `BatchFormulaFixResult`，Contiene resultados archivo por archivo, errores de agregacion y `replacementCount`
  - Exito de la traduccion y reparacion de formulas. notice Ahora respectivamente por `src/operations/noteProcessingCommandHostAdapter.ts` con `src/operations/utilityCommandHostAdapter.ts` Toma el control, ya no te quedes utility core
  - `src/operations/registry.ts` Ahora tambien exportado `translate.*` con `formula.*` de richer result schema
- Los sectores de seguimiento actuales tambien recibieron el primer lote. `src/fileUtils.ts` contract-tightening pass：
  - `processFile()` Regreso `ProcessFileResult`
  - `runProcessWithNotemdCommandWithHost()` Los resultados del archivo estructurado ahora se devolveran directamente
  - `runProcessFolderWithNotemdCommandWithHost()` Ahora regresa al cinturon. `savedCount`、`fileResults`、`errors` con `cancelled` de `BatchProcessFolderResult`
  - `generateContentForTitle()` Regreso `GenerateContentForTitleResult`
  - `batchGenerateContentForTitles()` Cinturon de retorno complete-folder move Semantica y agregacion incorrectas `BatchGenerateContentForTitlesResult`
  - No se generan archivos en lotes notice Ahora cambia a `src/operations/noteProcessingCommandHostAdapter.ts` Toma el control, ya no te quedes `src/fileUtils.ts`
- Tambien se ha eliminado el segmento de seguimiento actual. `src/fileUtils.ts` La cola restante de：
  - `batchFixMermaidSyntaxInFolder()` Regreso `BatchMermaidFixResult`
  - `checkAndRemoveDuplicateConceptNotes()` Regreso `ConceptDedupeResult`
  - duplicate deletion confirmation Ahora por `src/operations/utilityCommandHostAdapter.ts` Inyeccion
  - batch Mermaid Sin archivos notice Ahora tambien por `src/operations/utilityCommandHostAdapter.ts` Emprender
  - `src/operations/registry.ts` Ahora tambien exportado `mermaid.batch-fix` con `concept.dedupe` de richer result schema

Los problemas restantes son ahora mas limitados y dificiles.：

1. Publico anterior de mayor valor direct command surface Ya no esta en linea。`testLlmConnectionCommand`、`generateDiagramCommand` con `previewExperimentalDiagramCommand` Todo paso ahora host adapter Proxy y devolucion de resultados estructurados。
2. Mas profundo diagram command-core Rebanar ahora va un paso mas alla: sustancial save/artifact execution Entro `src/operations/diagramCommandExecution.ts`，Y `diagram.generate` Ahora tambien devuelve explicito `followThrough` Detalles（`kind`、`outputPath`、`previewOpened`、`autoFixAttempted`、`artifactTarget`），Y conserva lo que tienes wrapper-result Campos。
3. selection/export con workflow/settings surfaces Todavia hay que ir mas alla command-trigger parity mas profundo contract depth。
4. packaging isolation con maintainer-local semantic verification Ahora se han convertido en el siguiente lote de trabajos de mayor apalancamiento porque "poner `diagram.generate` abajo follow-through La tipificacion ya no es solo un plan。

Por lo tanto, el foco de la proxima fase ya no deberia ser “seguir aumentando CLI Orden”, ni tampoco write-heavy `src/fileUtils.ts` El lote se trata como una gama sin terminar. El verdadero siguiente paso deberia ser diagram/provider command-core Se considera que la estratificacion ha alcanzado el nivel actual contract Profundidad, luego cerrar packaging / semantic-verification Trabajo de seguimiento。

## Requisitos

**Sincronizacion de hechos**
- R1. `docs/brainstorms/2026-05-02-progress-audit-and-next-direction.*`、`docs/architecture*` con `docs/maintainer/notemd-cli-capability-matrix*` Debe estar alineado con 2026-05-05 Date cuenta del codigo y escribelo claramente.：process/generate/translate/formula/mermaid/dedupe Los procesos ahora tienen resultados estructurados y exito asociado./no-file/confirmation La semantica tambien ha entrado host adapter。
- R2. Ningun documento seguira conteniendo ninguna write-heavy `src/fileUtils.ts` contract pass Escrito solo como planeado o en progreso。

**Prioridades de la proxima etapa**
- R3. La secuencia fija de la siguiente etapa ahora se cambia a `Mas profundo diagram/provider command-core Capas -> packaging / semantic-verification Convergencia -> mas amplio CLI/public surface refinement`。
- R4. Actualmente implementado registry-backed operation El primer lote incluye：
  - `editor.create-link-and-generate`
  - `translate.file`
  - `translate.folder-batch`
  - `concept.extract-file`
  - `concept.extract-folder`
  - `content.extract-original-text`
  - `workflow.extract-and-generate`
  - `file.process-add-links`
  - `file.process-folder-add-links`
  - `content.generate-from-title`
  - `content.batch-generate-from-titles`
  - `research.summarize-topic`
  - `duplicate.check-file`
  - `concept.dedupe`
  - `mermaid.batch-fix`
  - `formula.fix-file`
  - `formula.batch-fix`
  - `provider.profile.export`
  - `provider.profile.import`
  - `cli.capability-manifest.export`
  - `cli.invocation-contract.export`
- R5. Siguiente lote contract-tightening Ahora primero debemos mantener las capas mas profundas de este nuevo lote de desembarcos. diagram/provider command core Estable：`src/operations/diagramCommandExecution.ts` Ya en `diagram.generate` Volver explicito typed follow-through。El trabajo de seguimiento solo necesita determinar si esta estructura implementada es suficiente o si realmente hay una rama en el futuro que valga la pena promover como una nueva exportacion. operation boundary。

**Efectos secundarios del huesped cerrados**
- R6. `file.process-add-links`、`file.process-folder-add-links`、`content.generate-from-title`、`content.batch-generate-from-titles`、`mermaid.batch-fix`、`concept.dedupe`、`translate.*`、`formula.*` con `content.extract-original-text` ahora se considerara entregado proof slice。Estos deberian conservarse por ahora. family-local result object con host-owned success/no-file/confirmation Semantica, espera el resto. direct surfaces Completo。
- R7. `src/fileUtils.ts` Debemos continuar `Notice`、vault Ubicacion del disco, creacion de directorios, manejo de conflictos de salida y semantica de confirmacion destructiva, para explicitar host effect O cerrar el objeto de resultado estructurado para evitar operation core Fuga UI Redaccion publicitaria。
- R8. Aun dependiente active file、folder picker、Confirmacion destructiva o preview UI El proceso de , no sera mal etiquetado como `safe`；en contract Antes de llenarlo, solo se puede mantener como `requires-active-file`、`interactive-ui` u otros niveles restringidos。
- R8.1. Cuando `safe` / `read-only` Describe la reutilizacion independiente del host. core horas，operation-level Puede que aun sea correcto seguir utilizando estos metadatos; aun asi, mapear el pasado shipped command Aun debe conservarse `requires-active-file` / `write-file` Espere la semantica real del producto.。`diagram.generate` Este es el caso de referencia actual. El documento debe explicar claramente esta division.。

**Resto `src/main.ts` Bajar de peso**
- R9. note-processing con utility host-adapter La retirada ya esta suficientemente completa. Regresar y reabrir estas familias solo creara churn。Siguiente lote `src/main.ts` La perdida de peso solo debe centrarse en el resto mas profundo. diagram/provider helper。
- R10. diagram save/generate/preview con provider connection-test O consigues el mismo nivel que la familia dibujada. discoverable operation/result Limites, ya sea establecidos explicitamente en el documento como command-only surface。publico wrapper、typed `diagram.preview` / `provider.connection.test` contract，Y con explicito `followThrough` Cuanto mas rico `diagram.generate` result shape Ahora implementado; La unica pregunta abierta que queda es si en el futuro habra sucursales que valga la pena seguir actualizando con sucursales adicionales. exported boundary。

**Higiene de la linea principal y del area de trabajo.**
- R11. `main` La integracion debe continuar limpiamente. worktree O completado en una rama limpia y no se puede limpiar ni reutilizar. dirty root worktree。
- R12. Cuando se completa la entrega, la ejecucion actual. worktree Debe regresar a clean Estado, adjunto fresh build/test/audit Evidencia。

## Criterios de exito

- Los mantenedores solo miran lo ultimo requirements / progress / architecture Los documentos pueden distinguir claramente lo que se ha entregado write-heavy proof set、Ya implementado direct-surface wrapper Lote y las capas mas profundas que quedan sin terminar diagram/provider contract trabajo。
- El documento ya no informa errores en el orden anterior; Ahora esta claro que la proxima ola de avance sera mas profunda. diagram/provider contract Prioridad、packaging/semantic-verification Segundo。
- Todo el trabajo de codigo y sincronizacion de la linea principal se completa en el arbol de trabajo limpio y pasa por la puerta de verificacion completa del almacen.。

## Limites del alcance

- Esta vez requirements No agregues nuevos directamente `obsidian-cli` Subcomandos。
- Esta vez requirements No puedo poner write-heavy note-processing El proceso se declara estable y publico con antelacion CLI API。
- Esta vez requirements Nada forzado operation family Establecer un resultado global unificado ademas de envelope。
- Esta vez requirements No puedo limpiar dirty root `main` worktree。

## Decisiones clave

- el conjunto write-heavy contract-tightening El lote ha sido entregado, el primer lote direct-surface wrapper Tambien entregado; a un nivel mas profundo diagram/provider contract Reabrirlos antes del trabajo solo hara que churn，En lugar de empujar。
- Actualmente todavia dando prioridad a la aceptacion. family-local result object；Comparte el panorama general envelope Aun es demasiado pronto。
- direct-surface slimming Sigue siendo importante, pero ahora se ha puesto un enfoque mas preciso：`diagram.generate` core abajo follow-through Ahora esta escrito explicitamente, por lo que el siguiente lote de trabajo de mayor apalancamiento deberia pasar a packaging/semantic-verification，En lugar de perseguir el crecimiento del volumen de comandos o introducir nuevos prematuramente operation ID。

## Dependencias y supuestos

- Actual clean worktree Basado en el ultimo control remoto `main`，e incluido registry、capability-contract Con el primer lote provider/diagram/config-profile Separar resultados。
- `src/operations/noteProcessingCommandHostAdapter.ts` Ahora aceptado process / generate / research / translate / extract Este lote note-processing command wrapper。
- `src/operations/utilityCommandHostAdapter.ts` Ahora aceptado duplicate cleanup、Mermaid batch fix con formula-fix command wrapper。
- capability registry Cubierto note-processing、process/generate/research、utility、selection con export operation batches；Las principales brechas estructurales se han vuelto mas profundas. diagram/provider contract Toma de decisiones, y packaging/semantic-verification Trabajo de seguimiento。

## Cuestiones abiertas

### Aplazar la etapa de planificacion
- [Impacto R5][Technical] Recien lanzado `diagram.generate.followThrough` ¿Es el formulario suficiente para satisfacer las necesidades actuales? contract Profundidad, ¿o realmente habra una rama en el futuro que sea lo suficientemente madura como para que valga la pena actualizarla para exportar mas? operation boundary？
- [Impacto R7][Technical] cual direct surfaces Vale la pena actualizar registry-backed operations，¿Que deberia quedar? command-only Semantica？
- [Impacto R10][Technical] direct-surface Despues del lote，selection/export contract Mejora y mejora maintainer semantic verification ¿Quien tiene mayor apalancamiento?？

## Siguiente paso

-> Entra `/ce:plan`，Planifique mas profundamente diagram/provider contract lote。
