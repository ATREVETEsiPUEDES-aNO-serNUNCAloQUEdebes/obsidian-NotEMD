# Notemd Note-Processing Registry Hardening Plan de implementacion

> **Al agente albacea：** Debe usar `superpowers:subagent-driven-development`（Recomendado) o `superpowers:executing-plans` Ejecute este plan tarea por tarea. Pasos para seguir usando casillas de verificacion `- [ ]` Seguimiento gramatical。

**Metas：** Pon lo que ha aterrizado note-processing host adapter Avance a registry/capability/contract Capa y continua apretando. translation/extraction utility Limites de los efectos secundarios del huesped。

**Arquitectura：** Manten las cuatro capas separadas.：trigger、host adapter、operation、contract。Este plan no se volvera a repetir `src/main.ts` Para embalaje y transporte, primero saque el note-processing Inclusion de procesos operation registry，Continuar `ProgressModal`、`Notice`、vault Escritura y otros efectos secundarios del huesped utility core Hazlo explicito。

**Pila de tecnologia：** TypeScript、Obsidian Plugin API、Jest、Markdown Documentos oficiales `obsidian` CLI、capability manifest / invocation contract

---

## Actualizacion de alineacion de progreso（2026-05-08）

Este plan es ahora principalmente un record historico. nucleo hardening La rebanada ya esta adentro `main` Arriba y abajo。

Instantanea de estado：

- Tareas 1（note-processing registry onboarding）：Ha aterrizado. Relacionado operation ID Con binding Entro `src/operations/registry.ts`，Y por `src/tests/operationsRegistry.test.ts`、`src/tests/cliCapabilityManifest.test.ts`、`src/tests/cliContracts.test.ts` Bloqueo。
- Tareas 3（`src/main.ts` Restante host-adapter Orden de extraccion): Las familias designadas en el plan original basicamente se han implementado。duplicate cleanup、Mermaid batch fix Con formula-fix El proceso ahora pasa. `src/operations/utilityCommandHostAdapter.ts` Enrutamiento。
- Tareas 2（utility side-effect tightening）：Supero parcialmente el rango original y aterrizo.。family-local result object Con host-owned notice La cobertura ya es mas amplia que la base de referencia planificada originalmente。

Brecha real restante：

1. Ya no deberia wrapper Se reabrira el tema del Destacamento y se dara prioridad a mantenerlo implementado. host-adapter Estabilidad fronteriza。
2. Sigue asi packaging/semantic-verification Convergencia y entrada unica actual packaging Valor de verdad consistente。
3. workflow/settings Con selection/export de contract La promocion debe estar en packaging Avance bajo limitaciones de estabilidad fronteriza。

---

## Linea de base actual

- `src/operations/noteProcessingCommandHostAdapter.ts` Aceptado process / generate / research / translate / extract Serie wrapper。
- `src/main.ts` Traduccion y extraccion de chino. wrapper Ha adelgazado hasta delegator。
- `src/fileUtils.ts` Con `src/extractOriginalText.ts` Aceptado estrecho runtime context，En lugar de ser especifico `NotemdPlugin` clase。
- Descripcion de las lagunas en la preparacion del borrador: las cuestiones restantes se han eliminado del wrapper Direccion extraible registry onboarding Con utility side-effect Cierra la boca. La brecha ya esta practicamente cerrada; ver arriba 2026-05-08 Actualizaciones de alineacion。

### Tareas 1：Note-Processing Operation Registry Onboarding

**Documentacion：**
- Modificacion：`src/operations/registry.ts`
- Modificacion：`src/operations/capabilityManifest.ts`
- Modificacion：`src/cliContracts.ts`
- Modificacion：`src/workflowButtons.ts`
- Pruebas：`src/tests/operationsRegistry.test.ts`
- Prueba: reponer segun sea necesario CLI contract / capability-manifest Pruebas relacionadas

- [ ] **Pasos 1：Escriba primero la prueba fallida y definala. note-processing operation Metadatos**
Sea claro `translate-current-file`、`batch-translate-folder`、`extract-concepts-current`、`extract-concepts-folder`、`extract-original-text`、`extract-concepts-and-generate-titles` de `automationLevel`、`requiredContext`、`sideEffectClass` Con command binding。

- [ ] **Pasos 2：Ejecute la prueba de enfoque para confirmar. registry Existe una brecha**
Ejecucion：`npx jest --runInBand --config /tmp/notemd-worktree-jest.cjs src/tests/operationsRegistry.test.ts`
Expectativa: por falta de note-processing operation definitions y FAIL。

- [ ] **Pasos 3：Con minimo schema Aterrizaje registry**
Cree primero la entrada minima/Resultados schema。Derecha active-file Marcado de prioridad del comando de dependencia `requires-active-file`，No te anuncie con antelacion `safe`。

- [ ] **Pasos 4：Actualizacion capability manifest / invocation contract Exportar**
Nuevas incorporaciones garantizadas operation Exponer solo lo que es verdadero y explicable bindings；legacy alias Sigue siendo compatible, pero no entres por defecto capability manifest。

- [ ] **Pasos 5：Vuelva a ejecutar la prueba de enfoque**
Ejecucion：`npx jest --runInBand --config /tmp/notemd-worktree-jest.cjs src/tests/operationsRegistry.test.ts`
Expectativas：PASS。

### Tareas 2：Translation And Extraction Utility Side-Effect Tightening

**Documentacion：**
- Modificacion：`src/translate.ts`
- Modificacion：`src/fileUtils.ts`
- Modificacion：`src/extractOriginalText.ts`
- Modificacion：`src/operations/noteProcessingCommandHostAdapter.ts`
- Pruebas：`src/tests/noteProcessingCommandHostAdapter.test.ts`
- Prueba: Si la firma cambia, inventa `src/translate.ts` / `src/extractOriginalText.ts` Pruebas enfocadas

- [ ] **Pasos 1：Escriba primero la prueba fallida, sin bloqueo UI Camino**
para batch translation de reporter Inyectar、notice shaping O realice pruebas suplementarias de limites en el objeto resultante para evitar continuar `ProgressModal` Como unico albacea。

- [ ] **Pasos 2：Ejecute la prueba de enfoque para confirmar la corriente. utility Acoplamiento**
Ejecucion：`npx jest --runInBand --config /tmp/notemd-worktree-jest.cjs src/tests/noteProcessingCommandHostAdapter.test.ts`
Expectativa: Debido a la nueva host-effect Afirmaciones de limites FAIL。

- [ ] **Pasos 3：Lograr el minimo utility De cerca**
poner reporter/notice/file-write Divida el impacto en mas explicitos. host choice O el objeto resultado; no lo pongas todo de una vez utility Reescribe todo como service capas。

- [ ] **Pasos 4：Regresion de ruta de combinacion de relleno**
Asegurate `extract-concepts-and-generate-titles` Continuar reutilizando lo mismo busy-state Semantica y batch generation Fuerce la toma del directorio de conceptos en la configuracion.。

- [ ] **Pasos 5：Vuelva a ejecutar la prueba de enfoque**
Ejecucion：`npx jest --runInBand --config /tmp/notemd-worktree-jest.cjs src/tests/noteProcessingCommandHostAdapter.test.ts src/tests/noteProcessingCommands.test.ts`
Expectativas：PASS。

### Tareas 3：Remaining `src/main.ts` Host-Adapter Extraction

**Documentacion：**
- Modificacion：`src/main.ts`
- Modificacion：`src/operations/`（Cree o amplie segun sea necesario host-adapter Modulos）
- Pruebas: suplementarias command-surface delegation Pruebas enfocadas

- [ ] **Pasos 1：Seleccione su proximo lote de comandos de alto valor**
El orden de prioridad se fija como duplicate cleanup -> batch Mermaid fix -> formula fix。No realices multiples cambios entre archivos al mismo tiempo。

- [ ] **Pasos 2：Escribe primero delegator Pruebas**
Agregue "solo llamada" para el comando seleccionado host adapter，No ejecutado directamente utility”de command-surface Pruebas。

- [ ] **Pasos 3：Extrae el minimo host adapter**
Usar existente pattern：busy guard、reporter lifecycle、notice/error-log Queda la coreografia host adapter；utility core Mantengalo reutilizable。

- [ ] **Pasos 4：Regresar uno por uno**
Despues de extraer cada tipo de comando, vuelva a ejecutar la prueba de enfoque correspondiente. No espere a que se extraigan todos los comandos y recuperelos todos a la vez.。

### Tareas 4：Mainline Sync And Doc Alignment

**Documentacion：**
- Modificacion：`docs/architecture.md`
- Modificacion：`docs/architecture.zh-CN.md`
- Modificacion：`docs/brainstorms/2026-05-02-progress-audit-and-next-direction.md`
- Modificacion：`docs/brainstorms/2026-05-02-progress-audit-and-next-direction.zh-CN.md`
- Modificacion：`docs/brainstorms/2026-05-05-cli-mainline-progress-sync-and-next-phase-requirements.md`
- Modificacion：`docs/brainstorms/2026-05-05-cli-mainline-progress-sync-and-next-phase-requirements.zh-CN.md`

- [ ] **Pasos 1：Alinear documentos parrafo por parrafo**
Deje en claro que promesas se han cumplido mediante el codigo, que lagunas se han solucionado y que afirmaciones antiguas deben eliminarse.。

- [ ] **Pasos 2：Escriba la direccion de seguimiento.**
Direccion del Draft Historico: Corto Plazo registry onboarding；A medio plazo utility side-effect Cierre y resto host-adapter Alejate; hablar de nuevo a largo plazo richer CLI transport。

- [ ] **Pasos 3：Mantengase bilingue sincronizado**
Cada modificacion EN/ZH Se completa la sincronizacion para evitar actualizar solo la version monolingue.。

## Secuencia de avance a corto, mediano y largo plazo

**Corto plazo (implementado inmediatamente despues de este lote)）**
- Mantener la implementacion note-processing + utility registry Estabilidad semantica
- Mantenerse en refactorizacion continua result-shape Con host-effect Los limites no retroceden
- Sigue asi clean-worktree mainline Disciplina sincronica

**A medio plazo（2-6 Semana）**
- packaging / semantic-verification convergence Endurecimiento
- Basado en packaging Superacion de limites workflow/settings contract Convergencia
- mantenedor helper、Documentacion y release Mejorar la coherencia del calibre de inspeccion.

**Largo plazo（6 Mas de 16 semanas）**
- richer CLI transport Evaluacion（file bridge / local IPC / REST）
- Mas granular operation versioning
- write-heavy automation policy Con rollback semantics

## Verificacion

- [ ] `npm run build`
- [ ] `npx jest --runInBand --config /tmp/notemd-worktree-jest.cjs`
- [ ] `npm run audit:i18n-ui`
- [ ] `npm run audit:render-host`
- [ ] `git diff --check`
- [ ] `git status --short` returns clean before final push

## Riesgos y controles

- **Riesgos：** poner active-file Errores de dependencia marcados como `safe`。
  **controlar：** Marque la verdad primero `requiredContext`，Habla de nuevo CLI expuesto。

- **Riesgos：** utility side-effect Destruir la situacion existente al cerrar Notice / modal Experiencia。
  **controlar：** host adapter Continue sosteniendo UI Responsabilidades de la cirugia plastica，utility Solo converja limites, no elimine comportamientos directamente。

- **Riesgos：** Hazlo de nuevo wrapper Transporte，registry Aun vacante。
  **controlar：** Este plan registry onboarding Priorizar tareas。
