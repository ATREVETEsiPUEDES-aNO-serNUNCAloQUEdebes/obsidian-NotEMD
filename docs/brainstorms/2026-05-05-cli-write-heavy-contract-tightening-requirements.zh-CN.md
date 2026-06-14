---
date: 2026-05-05
topic: cli-write-heavy-contract-tightening
---

# CLI Requisitos de cierre de contratos por escrito

> Actualizacion（2026-05-05，Mas tarde ese mismo dia): primer lote direct-surface wrapper Ya aterrizo。`testLlmConnectionCommand`、`generateDiagramCommand` Con `previewExperimentalDiagramCommand` Todo paso ahora host adapter Proxy y devolucion de resultados estructurados. El problema abierto actual se ha movido a diagram/provider command-core Convergencia。
>
> Actualizacion（2026-05-05，Mas tarde ese dia）：registry/capability/contract La ruta ahora tambien se exporta. `provider.connection.test` Con `diagram.preview` de typed operation surface。Las preguntas restantes ya no son estas seam Existir o no, pero diagram wrapper Abajo save/artifact ¿Vale la pena seguir promocionando la rama como extra? typed boundary。
>
> Actualizacion（2026-05-05，Mas tarde）：`src/operations/diagramCommandExecution.ts` Ahora aceptado `src/main.ts` Abajo Mermaid-save Con artifact-save Proceso de ejecucion，`diagram.generate` de typed result schema Tambien agregado `outputPath` Con `previewOpened`。Las preguntas restantes se reducen aun mas a: estas cuestiones internas save/artifact ¿Vale la pena seguir dividiendo la rama en adicionales? typed boundary。

## Encuadre del problema

Las rondas de requisitos anteriores resolvieron el problema de la "extraccion a gran escala" y el ultimo codigo tambien completo el lote minimo de prueba.：

- `content.extract-original-text` El resultado estructurado se ha devuelto correctamente. notice Se mudo a `src/operations/noteProcessingCommandHostAdapter.ts`
- `translate.file` Con `translate.folder-batch` Ahora se devolveran los resultados de la traduccion estructurada y la traduccion se realizo correctamente. notice Tambien se mudo a note-processing host adapter
- `formula.fix-file` Con `formula.batch-fix` Ahora todas las devoluciones estructuradas. file/folder Como resultado, la formula se reparo con exito. notice Tambien se mudo a utility host adapter
- `src/operations/registry.ts` Estos ahora tambien se exportan write-heavy familia richer result schema，No mas aplanarlos a una semantica de solo ruta o de solo conteo
- Primer lote `src/fileUtils.ts` de process/generate La subporcion tambien ha aterrizado.：
  - `processFile()` Regreso `ProcessFileResult`
  - `generateContentForTitle()` Regreso `GenerateContentForTitleResult`
  - `batchGenerateContentForTitles()` Regreso `BatchGenerateContentForTitlesResult`
  - `runProcessFolderWithNotemdCommandWithHost()` Ahora regresa al cinturon. `savedCount`、`errors` Con `cancelled` de `BatchProcessFolderResult`
  - No se generan archivos en lotes notice Ahora cambia a host adapter Emprender, no quedarse utility core
- `src/fileUtils.ts` La cola restante tambien ha aterrizado.：
  - `batchFixMermaidSyntaxInFolder()` Regreso `BatchMermaidFixResult`
  - `checkAndRemoveDuplicateConceptNotes()` Regreso `ConceptDedupeResult`
  - Mermaid Sin procesamiento de archivos vs. duplicate deletion confirmation Ya estan todos ingresados. utility host adapter，En lugar de quedarse utility core
  - `src/operations/registry.ts` Ahora tambien exportado `mermaid.batch-fix` Con `concept.dedupe` de richer result schema

Esto significa，write-heavy El lote ya no es obra inacabada. Los unicos puntos de presion reales en la actualidad son：

- `src/main.ts`，Aqui mantenemos principalmente a los delgados. diagram/provider delegator，Y el problema mas profundo se ha trasladado a operation layer en diagram save/generation follow-through Con Vega-Lite preview
- selection/export Con workflow/settings Superficies, sus contract La profundidad aun esta por detras write-heavy proof set
- Y un malentendido tipico: introducir prematuramente resultados unificados globales antes de que la familia mas grande basada en escritura sea estable. envelope

Por lo tanto, el siguiente paso mas seguro deberia ser mantener write-heavy Cerrar el circulo familiar y recurrir al superavit direct command surfaces，En lugar de volver atras y reabrir las porciones que se han implementado, ni forzar la abstraccion global ahora。

## Comparacion con requisitos anteriores

| Documentos anteriores | Sentencia en su momento | El codigo actual ha sido verificado. |
|---|---|---|
| `docs/brainstorms/2026-05-04-obsidian-cli-extensibility-and-notemd-capability-extraction.md` | public CLI La exposicion debe ocurrir mas tarde de host-neutral operation | La conclusion esta establecida.；operation La amplitud de la cobertura esta basicamente establecida y el punto de bloqueo actual se convierte en contract Profundidad |
| `docs/brainstorms/2026-05-05-cli-mainline-progress-sync-and-next-phase-requirements.md` | El lote minimo de prueba restante debe realizarse primero `translate.*` Con `formula.*`，Luego ingresa el mas grande. write-heavy Trabajo | Conclusion establecida y ahora entregada |
| `docs/superpowers/plans/2026-05-05-notemd-note-processing-registry-hardening.en.md` | registry onboarding Deberia completarse antes de declaraciones de automatizacion mas solidas. | La conclusion esta establecida.；registry La amplitud de la cobertura ya no es el tema de mayor influencia en la actualidad. |

## Comparacion de opciones

### Opcion 1: continuar reabriendo write-heavy familia

Continue retrocediendo y afinando Mermaid repair / duplicate cleanup Vocabulario de resultados, luego toca el resto. direct command surfaces。

- Ventajas: mayor coherencia local
- Desventaja: Los lotes ya entregados se reabriran
- Riesgo: Fabricacion churn，Pero no avanza el actual cuello de botella principal.
- Aplicable: Solo cuando la corriente write-heavy Esto era cierto cuando el lote no estaba cerrado, pero ya no lo es ahora.

### Opcion 2: borrar el resto primero `src/main.ts` Conexion directa

Priorizar el procesamiento `testLlmConnectionCommand`、diagram save/generate、preview Fluir porque write-heavy La familia ya no es el principal bloqueador。

- Ventajas: atacar directamente los cuellos de botella restantes actuales
- Desventajas: necesidad de estar en diagram surfaces Con provider connection-test Elige el primero con cuidado seam
- Riesgos：diagram / preview Este conjunto de superficies contiene mas save/open Bifurcacion, facil de abstraer demasiado
- Aplicable: Si el objetivo principal actual es entrypoint Limpiar en lugar de operation Semantica

### Opcion 3: Unificar los resultados globales ahora envelope

Primero defina un conjunto de generales. operation result shape，otra vez `src/fileUtils.ts`、translation、formula、process、generate Ponlo junto。

- Ventajas: si tiene exito, obtenga la narrativa mas solida y consistente de inmediato.
- Desventajas: abstraer la familia mas grande antes de que haya sido modelada tiene el mayor riesgo
- Riesgo: curado prematuro envelope，Por el contrario, retrasa la entrega.
- Aplicable: solo es adecuado cuando varias familias mas grandes son semanticamente estables, lo que no es el caso actualmente

## Direccion recomendada

Opcion 2。

`content.extract-original-text`、`translate.*`、`formula.*` con completo write-heavy `src/fileUtils.ts` La familia ha aportado claridad proof slice。La evidencia que mas falta ahora ya no es write-heavy family Si se puede establecer, pero el resto direct command surfaces ¿Se puede ascender al mismo nivel? operation/result Limites。

## Demanda

**Sincronizacion de hechos actuales**
- R1. El documento de progreso actual y el documento de arquitectura deben estar completos. write-heavy Familia descrita como entregada proof，En lugar de trabajos por hacer。
- R2. El documento actual debe nombrar con precision las capas mas profundas restantes. seam：Ahora ubicado en `src/operations/diagramCommandExecution.ts` Interior de save/artifact follow-through，Y ya implementado `provider.connection.test` / `diagram.preview` typed wrapper Con mas rico `diagram.generate` result shape。

**Cierre a corto plazo**
- R3. Siguiente lote P0 Se debe priorizar la implementacion `src/operations/diagramCommandExecution.ts` Los restantes mas profundos diagram/provider command core，El punto clave es que se ha implementado wrapper Aun existente bajo save/artifact follow-through。
- R4. Estos son mas profundos seam O devolver algo comparable a write-heavy proof set Resultados estructurados con limites explicitos de efectos secundarios o marcados explicitamente como existentes typed operation Abajo internal command-core branch。
- R5. El exito de estos procesos notice、preview-only Redaccion y save/open Las bifurcaciones deben continuar hacia host adapter o operation-layer boundary Cierra la boca en lugar de regresar a ella. `src/main.ts` Medio。
- R6. `src/operations/registry.ts`、`src/operations/capabilityManifest.ts` Con `src/cliContracts.ts` Solo a un nivel mas profundo save/artifact seam suficiente deterministic Solo entonces deberiamos seguir ampliando；`diagram.preview` Aun debe mantenerse `interactive-ui`，`provider.connection.test` Aun debe mantenerse `safe`，`diagram.generate` entonces habra sido pasado `outputPath` / `previewOpened` Describe a los salvos. follow-through。

**Convergencia a medio plazo**
- R7. Mas profundo diagram/provider command-core Despues de un lote, la implementacion del siguiente lote debe pasar a packaging isolation Con maintainer-local semantic verification Endurecimiento posterior de。
- R8. diagram save/generate/preview Con provider connection-test Ya sea en existente wrapper Continue profundizando a continuacion. operation/result discoverability，Indiquelo explicitamente en la documentacion como automation-grade CLI contract Aparte de internal command-core branch。
- R9. En al menos uno `src/fileUtils.ts` Familia e Ichijo direct-surface Hasta que la familia este estable, el proyecto debe seguir siendo una prioridad family-local result object，En lugar de apresurarse a fusionarse en una sociedad global envelope。

**Convergencia de la superficie de mando a largo plazo**
- R10. Solo en mas grande write-heavy Solo despues de que la semantica sea estable, el proyecto debe reabrirse para lograr resultados unificados globales. envelope o mas fuerte public CLI Declaracion。
- R11. packaging isolation、maintainer-local semantic verification Con live runbook hardening Sigue siendo un trabajo de seguimiento valido, pero no puede eliminar el trabajo actual. operation-contract Prioridad。
- R12. public CLI La exposicion aun debe realizarse por etapas: primero internal operation contract，Otra vez maintainer-grade invocation，Lo ultimo son los usuarios estables. CLI API。

**Documentacion e Higiene**
- R13. `docs/brainstorms/2026-05-05-cli-mainline-progress-sync-and-next-phase-requirements.*`、`docs/brainstorms/2026-05-02-progress-audit-and-next-direction.*`、`docs/architecture*` Con `docs/maintainer/notemd-cli-capability-matrix*` Debe actualizarse y alinearse seccion por seccion“proof slice Entregado + Nuevas direcciones a corto, medio y largo plazo”。
- R14. La entrega debe finalizar a mas tardar. `origin/main`，Adjunto fresh build/test/audit Pruebas y clean worktree。

## Criterios de exito

- Los mantenedores ya no necesitan hacer arqueologia del codigo, pueden explicar directamente el orden de avance de las proximas tres oleadas de arquitectura: permanecer primero direct surfaces，Otra vez packaging / semantic verification Endurecimiento posterior, finalmente broader CLI/public-surface Toma de decisiones。
- El documento actual ya no es translation o formula contract tightening Escribe una lista de tareas pendientes。
- Proxima ronda planning Se puede obtener directamente del resto. direct-surface batch Emprender sin reinventarse why、ordering o scope boundary。

## Limites del alcance

- Esta ronda requirements No hay nuevas incorporaciones `obsidian-cli` Subcomandos。
- Esta ronda requirements Nada forzado operation family Establecer un resultado global unificado ademas de envelope。
- Esta ronda requirements No intentes reescribir todos los elementos restantes del mismo lote. direct command surfaces。
- Esta ronda requirements No limpiar ni reutilizar dirty root worktree。

## Decisiones clave

- Toma lo que te han entregado write-heavy Cortar como prueba, no como proximo objetivo。
- Continuar priorizando family-specific result object；Espera a que lleguen los mas grandes `src/fileUtils.ts` Familia y al menos una mas profunda. diagram/provider seam Despues de que todo el modelado sea exitoso, decida si vale la pena adoptar una vision general. envelope。
- Quedate con el resto `src/main.ts` diagram/provider command-core branch Tratar como `src/fileUtils.ts` El proximo problema de convergencia despues, no antes。

## Dependencia / Suposiciones

- Hechos actuales pasados. `src/main.ts`、`src/translate.ts`、`src/formulaFixer.ts`、`src/fileUtils.ts`、`src/operations/registry.ts` Con 2026-05 de brainstorm Verificacion de documentos。
- `content.extract-original-text`、`translate.*`、`formula.*`、`mermaid.batch-fix`、`concept.dedupe` Con process/generate Subslice ya proporciona el modo objetivo：utility core Salida richer result，Exito/no-file/confirmation Entregar la semantica host adapter。
- Actual registry Cubierto para el proximo lote operation IDs，Tambien incluido `provider.connection.test`、`diagram.preview` Con mas rico `diagram.generate` Campos de resultados; el trabajo restante son principalmente estos typed seam Mas profundo debajo contract Profundidad vs. host-side effect Levanta。

## Cuestiones abiertas

### Aplazar la etapa de planificacion
- [Impacto R4][Technical] `src/operations/diagramCommandExecution.ts` ¿Cual de los 18? diagram save/artifact La ramificacion es suficiente deterministic，Vale la pena continuar actualizando como beneficio adicional typed operation boundary？
- [Impacto R5][Technical] El primero mas profundo seam Debe hacerse primero save-Mermaid follow-through、artifact-save follow-through，Creemos un limite comun mas pequeno compartido por los dos primeros.？
- [Impacto R8][Technical] direct-surface Despues del lote，workflow/settings packaging Con maintainer semantic verification ¿Quien tiene mayor apalancamiento?？

## Siguiente paso

-> `/ce:plan` for Resto direct-surface batch
