# Notemd El proximo lote de planes de ejecucion para la estabilizacion de la linea principal.

> **Al agente albacea：** Debe usar `superpowers:subagent-driven-development`（Recomendado) o `superpowers:executing-plans`，Implementar este plan paso a paso segun las tareas. Pasos para seguir usando casillas de verificacion `- [ ]` Seguimiento gramatical。

**Metas：** Transforme la actual "auditoria de verdad del almacen" en un lote de trabajo de estabilizacion ejecutable: cierre la superficie de comando del grafico y establezca una verificacion semantica local sostenible del mantenedor runbook，Y aclarar los verdaderos limites del empaquetado del tiempo de ejecucion de renderizado pesado sin respaldo legacy Mermaid Disponibilidad。

**Arquitectura：** Este lote de trabajo es para refuerzo de fronteras, no renderer Ampliacion. mantener `src/main.ts` Organice de manera compatible los comandos de envio existentes, haga converger gradualmente la superficie de comando a una ruta de grafico estandarizada y coloque claramente la verificacion semantica en CI Documentar externamente y continuar tratando el estado de aislamiento del tiempo de ejecucion de vista previa pesada como un elemento explicito sin terminar hasta que el sistema de compilacion se implemente realmente.。

**Pila de tecnologia：** TypeScript、Obsidian Plugin API、Jest、npm scripts、GitHub Actions release workflow、Markdown Documentacion

---

## Definicion del problema

La base del codigo ahora tiene una plataforma de graficos real, pero el riesgo restante es mayormente riesgo limite.：

- La superficie de mando aun esta expuesta. 3 entradas de graficos parcialmente superpuestas
- Se espera que la verificacion del mantenedor siga haciendo que las puertas duras del repositorio y el historial sean desechables. live proof Mezclalo
- El empaquetado de tiempo de ejecucion pesado aun permanece mas en la “declaracion de intenciones” que en los limites de los activos enviados.
- Drawnix Aunque se ha estudiado claramente, no se ha consolidado realmente como un no objetivo claro a nivel de implementacion.

Por lo tanto, este lote deberia priorizar la estabilizacion de las capacidades existentes en lugar de continuar expandiendo nuevos motores o nuevas integraciones de host.。

## con Roadmap Corroboracion cruzada

combinar `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.en.md` Si analizamos los objetivos a medio y largo plazo, este plan ha reducido aun mas el alcance del proximo lote real.：

- Lo que hay que seguir “construyendo” ya no es la plataforma en si
- Las verdaderas brechas actualmente son los tres tipos de madurez de limites: comando, verificacion y empaquetamiento.
- Todo trabajo de extension futuro debe ubicarse explicitamente despues de la finalizacion de estos limites.

Por lo tanto, este plan no es una desviacion de roadmap，En lugar de eso roadmap Formulario de implementacion especifico en la etapa actual。

## Seguimiento de la demanda

Documentos fuente：

- `docs/brainstorms/2026-05-03-mainline-stabilization-and-ci-hardening-requirements.zh-CN.md`
- `docs/brainstorms/2026-05-03-drawnix-feasibility-and-integration-direction.zh-CN.md`
- `docs/brainstorms/2026-05-02-progress-audit-and-next-direction.zh-CN.md`
- `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md`

Restricciones de herencia：

- Debe conservarse al cerrar la superficie de mando. legacy Mermaid Disponibilidad
- El aislamiento intensivo del tiempo de ejecucion no debe describirse como completo hasta que se implementen los limites del empaquetado.
- Drawnix Continuar como limite de referencia en lugar de enviar dependencias o incorporar hosts
- `ref/` Otros productos analiticos locales quedan fuera del alcance de entrega.

## Unidad de implementacion

### Tareas 1：Plano de cierre de superficie de mando

**Documentacion：**
- Modificacion：`src/main.ts`
- Modificacion：`src/ui/NotemdSidebarView.ts`
- Modificacion：`src/workflowButtons.ts`
- Modificacion：`src/ui/NotemdSettingTab.ts`
- Pruebas：`src/tests/sidebarDomButtonClicks.test.ts`
- Pruebas：`src/tests/sidebarButtonTriggerChains.test.ts`
- Pruebas：`src/tests/workflowButtons.test.ts`

- [x] **Pasos 1：Primero escriba pruebas de falla y defina un modelo de comando estable**
Cobertura de finalizacion canonical command mapping、alias Conducta, y sidebar/workflow ID Con complementos command ID La relacion esperada entre。

- [x] **Pasos 2：Confirmar que el enfoque fallo**
Ejecucion：
```bash
npm test -- --runInBand src/tests/sidebarDomButtonClicks.test.ts src/tests/sidebarButtonTriggerChains.test.ts src/tests/workflowButtons.test.ts
```
Anticipacion: Anticipacion de nuevos cierres de mandos FAIL。

- [x] **Pasos 3：Implementar ajustes minimos de orquestacion.**
Conserva los viejos si es necesario ID Actuar como alias compatibles, pero unificar gradualmente las etiquetas visibles para el usuario y la ejecucion interna en una superficie de comando grafica clara.。

- [x] **Pasos 4：Vuelva a ejecutar la prueba de enfoque**
Ejecute el mismo comando nuevamente y confirme que parece que se paso el nuevo comando.。

- [x] **Pasos 5：Revisar la deriva del documento de comando**
La actualizacion aun esta 3 Los comandos se expresan como copia del usuario o instrucciones del mantenedor para entradas independientes a largo plazo.。

### Tareas 2：Verificacion semantica local del mantenedor Runbook

**Documentacion：**
- Crear：`docs/maintainer/diagram-semantic-verification.md`
- Crear：`docs/maintainer/diagram-semantic-verification.zh-CN.md`
- Modificacion：`docs/maintainer/release-workflow.md`
- Modificacion：`docs/maintainer/release-workflow.zh-CN.md`
- Pruebas/Validar: reevaluar solo si es necesario alinear la redaccion `README.md`、`README_zh.md`

- [x] **Pasos 1：Definir el alcance de la verificacion semantica que se mantendra.**
Deje en claro cuando los cambios impliquen `src/diagram/`、`src/mermaidProcessor.ts` o renderer Al hacerlo, se debe realizar un muestreo local para verificar Mermaid、JSON Canvas con Vega-Lite。

- [x] **Pasos 2：mantener runbook Sin dependencias secretas**
Los documentos no deben depender de claves rastreadas, enviadas vault Ruta o envio incorrecto live test Documentacion. Debe describir el entorno autosostenible del mantenedor y los metodos de recopilacion de evidencia, en lugar de metodos locales automatizados e inseguros. secrets。

- [x] **Pasos 3：Definir estandares de evidencia.**
Aclare que es evidencia suficiente: inspeccion del archivo de salida, capturas de pantalla, productos guardados y como se debe registrar esta evidencia. release handoff o PR En contexto。

- [x] **Pasos 4：Cruzamiento con procesos de liberacion**
deja release workflow El documento distingue claramente entre "puerta dura en el almacen" y "verificacion semantica local del mantenedor"”。

- [x] **Pasos 5：Registrese para su reutilizacion helper**
Agregue un nuevo Ninguno secrets de `npm run verify:diagram-semantics` helper，Se utiliza para generar Markdown Verificar plantillas y puertas duras de almacen.、vault Percibido CLI Verifique el comando y Mermaid / JSON Canvas / Vega-Lite Bloque de pruebas; no arranca Obsidian，No confies en el seguimiento en el almacen vault Camino。

### Tareas 3：Auditoria de limites de empaquetado en tiempo de ejecucion

**Documentacion：**
- Modificacion：`esbuild.config.mjs`
- Modificacion：`scripts/audit-render-host-bundle.js`
- Pruebas：`src/tests/renderHostBundleAuditScript.test.ts`
- Prueba: ya cubierto render host Pruebas de paquetes en los limites de entrega
- Documentacion：`docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md`

- [x] **Pasos 1：Primero escriba la cobertura de la auditoria de fallas y defina la siguiente capa de datos del empaque.**
Escriba en las pruebas los datos del paquete que realmente desea que se cumplan a continuacion, como una propiedad mas clara de los activos de tiempo de ejecucion pesados o una propiedad unica mas estricta. bundle Contrato。

- [x] **Pasos 2：La confirmacion fallo**
Antes de modificar la logica de compilacion, ejecute la prueba de auditoria de empaquetado enfocada y confirme la falla.。

- [x] **Pasos 3：Implementar pasos minimos de clarificacion o aislamiento del empaque.**
O fortalecer aun mas el orden actual bundle Contrato, o el primer limite real de multiples entradas. No permita que la documentacion reclame mas aislamiento del que puede crear para demostrarlo.。

- [x] **Pasos 4：Vuelva a ejecutar la auditoria y la verificacion de compilacion.**
Al menos actuar：
```bash
npm run build
npm test -- --runInBand src/tests/renderHostBundleAuditScript.test.ts
npm run audit:render-host
```

- [x] **Pasos 5：Actualizar sincronicamente la descripcion de la hoja de ruta.**
El embalaje actual sigue siendo de una sola entrada. Esto ya ha quedado claramente establecido en la hoja de ruta y en los documentos de respaldo: el limite que actualmente se implementa y se restringe por la fuerza esta determinado por `main.js` Autonomo y portatil `srcdoc` host，En lugar de la publicacion independiente render-host Paquete de activos。

### Tareas 4：poner Drawnix Los limites se solidifican en no objetivos estables

**Documentacion：**
- Modificacion：`docs/brainstorms/2026-05-03-drawnix-feasibility-and-integration-direction.md`
- Modificacion：`docs/brainstorms/2026-05-03-drawnix-feasibility-and-integration-direction.zh-CN.md`
- Modificacion：`docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.en.md`
- Modificacion：`docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md`

- [x] **Pasos 1：Mantenga las conclusiones respaldadas por codigo**
Conservar pruebas verificadas：Drawnix Modelo de exportacion, limite del sistema de archivos del navegador, persistencia del navegador、app shell UI Complejidad y modulos de conversion con carga diferida。

- [x] **Pasos 2：Convertir las conclusiones de la investigacion en control de alcance.**
Aclarar las conclusiones a nivel de documento：Drawnix En lugar del siguiente lote de trabajo, la unica direccion razonable en el futuro cercano es ordenar/Una vez estabilizado el tiempo de ejecucion, haga adapter / data-boundary Experimento de nivel。

- [x] **Pasos 3：Evite el desplazamiento del alcance a nivel de host**
Eliminar o reescribir cualquier declaracion que implique que "la proxima version puede estar completamente integrada en el host".。

## Orden de ejecucion fija

A menos que la realidad del codigo posterior anule directamente esta secuencia, este plan debe ejecutarse en el siguiente orden：

1. Tareas 1：Ordena a la superficie que se cierre
2. Tareas 2：Verificacion semantica local del mantenedor runbook
3. Tareas 3：Auditoria de limites de empaquetado en tiempo de ejecucion
4. Realizar tareas 1-3 Solo despues legacy prompt o MermaidProcessor Trabajos de contraccion
5. Luego vuelve a abrirlo board-style export O exploracion avanzada del motor.

## Estrategia de prueba

Puertas duras en este lote de almacenes.：

- `npm run build`
- `npm test -- --runInBand`
- `npm run audit:i18n-ui`
- `npm run audit:render-host`
- `git diff --check`

Centrarse en las superficies de retorno：

- `src/tests/sidebarDomButtonClicks.test.ts`
- `src/tests/sidebarButtonTriggerChains.test.ts`
- `src/tests/workflowButtons.test.ts`
- `src/tests/renderHostBundleAuditScript.test.ts`

La verificacion semantica local del mantenedor sigue siendo una capa de registro separada y no sera reemplazada. CI。

## Riesgos y controles

- **Riesgos：** Ordenar cerrar la boca dana accidentalmente la memoria muscular del usuario o workflow button Encuadernacion。
  **Controlar：** Reserva cuando sea necesario alias Comportamiento y pruebas explicitas sidebar/workflow Enrutamiento。

- **Riesgos：** La documentacion vuelve a preceder a la implementacion.。
  **Controlar：** Los cambios de codigo o auditoria deben ser consistentes con el plan.、brainstorm、Los documentos del mantenedor se actualizan en el mismo lote.。

- **Riesgos：** Los limites de empaquetado pesados en tiempo de ejecucion se escribieron de manera demasiado optimista.。
  **Controlar：** Solo documente los limites que sus artefactos de compilacion y scripts de auditoria realmente puedan probar。

- **Riesgos：** Drawnix El desplazamiento del alcance distrae la atencion de la estabilizacion。
  **Controlar：** En la tarea 1-3 Hasta que termines, sigue trabajando Drawnix Considerado unicamente como limite de referencia.。

## Criterios de salida

- La direccion de la superficie de comando se ha escrito para probar y se refleja en el comando real. wiring Medio
- Verificacion semantica local del mantenedor runbook Disponible en ingles y chino simplificado.
- Las representaciones de empaquetado en tiempo de ejecucion estan alineadas con los limites verdaderos de construccion.
- Drawnix Documentado como un futuro limitado adapter/export Referencias, no objetivos de integracion de host a corto plazo
- La sucursal final pasa la puerta de verificacion completa del almacen.

## Actualizaciones anticipadas del progreso

Este plan de ejecucion es ahora mas que una lista de verificacion prospectiva. Este lote de trabajo planificado se ha completado sustancialmente de acuerdo con el alcance actual. `main`：

- Tareas 1 Se ha implementado el objetivo de “mantener la compatibilidad y cerrar fronteras”：canonical `generate-diagram` / `preview-diagram` workflow/sidebar ID ha entrado en vigor, los usuarios pueden ver que la copia se ha cerrado y la antigua `*-experimental-diagram` token Reservado solo como alias compatible。
- Tareas 2 Ya no te quedas en lo puro prose：Almacen ya disponible `npm run verify:diagram-semantics`，mantenedor runbook con release workflow El documento tambien se ha alineado con el mismo secrets Ruta de verificacion。
- Tareas 3 Se ha implementado en forma de "corte de ajuste de la verdad" en lugar de un verdadero aislamiento de entradas multiples.：helper Las plantillas y los documentos de mantenimiento ahora estan claramente documentados.，`audit:render-host` Lo que si esta demostrado es la actual entrada unica `main.js` + En linea `srcdoc` Contrato, no finalizacion real heavy-runtime isolation。
- Tareas 4 Implementado con control de alcance: la hoja de ruta y los documentos de progreso ahora incluyen Drawnix Fijado como un futuro limitado adapter/export Referencia en lugar de objetivo activo de integracion de alojamiento general。
- Apoya este lote release Lado CI hardening Ya no es solo un plan：`repo-saga` La actualizacion de Chronicle ahora se ha registrado package-manager runtime helper Con las pruebas de regresion, por lo tanto, en GitHub Actions Aunque estes aqui `pnpm` Solo puedo pasar `corepack` Categoria 1 fallback Acceder y continuar reconstruyendo el upstream workspace。
- Tambien se ha implementado un endurecimiento antideriva posterior.：semantic helper de packaging La lista comenzara desde `esbuild.config.mjs` Extraccion automatica de entradas./Muestra el hecho de que la prueba correspondiente ha bloqueado la relacion de alineacion; al mismo tiempo package-manager fallback Ahora volvera a intentarlo uno por uno segun el error de ejecucion.（`pnpm`、`corepack pnpm`、`bun x pnpm`），Para mantener CI El enlace de actualizacion de Chronicle es estable.。
- Semantica helper Tambien se han implementado mejoras adicionales: el estado objetivo de salida empaquetado se ha modelado explicitamente（`outfile` / `outdir` / `unknown` / `ambiguous`），La cobertura de analisis ha admitido literales de comillas invertidas y se ha priorizado el rango de analisis para converger a `esbuild.context({...})` Bloque de opciones para evitar archivos con el mismo nombre decoy Los campos provocan errores de juicio silenciosos。
- Stage B El avance de la definicion del contrato tambien se ha vuelto ejecutable：semantic helper Nueva plantilla agregada `Packaging Contract` Bloquear, desde `scripts/release/publish-github-release.js` Sincronizacion release Activos requeridos y preservar explicitamente el bilinguismo en la verificacion del mantenedor. release notes Documentar el contrato y registrar los numeros. tag con create/upload Valor de verdad y verificacion del contrato de patron. `.github/workflows/release.yml` de tag-only Restricciones del gatillo。
- Stage B Los limites ampliados del contrato tambien tienen una forma ejecutable：helper Nueva plantilla agregada `Contract Promotion Boundary` Bloquear, desde `src/operations/registry.ts` Extraccion workflow/settings/export Valores de verdad restringidos de las operaciones de proximidad.。

Por lo tanto, el verdadero trabajo que queda despues de este plan ya no es "complementar la primera version". runbook”O “complementar la primera edicion” packaging Aclaracion". Estos fragmentos basicos ya se han registrado. El trabajo restante es evitar que este conjunto de valores de verdad registrados se desvie y determinar aun mas donde se debe priorizar el siguiente lote de implementaciones reales. heavy-runtime packaging isolation，¿Sera mas estrecho en el futuro? contract-promotion rebanada。
