---
date: 2026-05-25
last_updated: 2026-06-06
topic: post-bounded-recovery-audit-and-next-level-direction
canonical: true
---

# Bounded Recovery Auditoria de linea principal posterior y Next-Level Direccion

## 1. ¿Por que se necesita este documento?

El almacen ya no se encuentra en ninguno de los dos puntos de interrupcion de interpretacion siguientes:：

1. 2026-05-13 de `1.8.9` Auditoria de limites de liberacion；
2. 2026-05-24 de force-rewrite Auditoria de referencia。

Despues de eso, actualmente `main` Una parte limitada pero sustancial de la backup-branch Ancho de capacidad y enviado a `1.9.2` Limites, sin dejar de poner local-KB / chapter-split de Stage C Cierra la boca y empuja hacia adelante. Por tanto, la verdadera pregunta que hay que responder ahora ha cambiado.：

- No mas“recovery ¿Sucedio?”；
- Ya no es solo“bounded product slice ¿Ha vuelto a la linea principal?”；
- Pero “¿Que canales arquitectonicos ahora han convergido sustancialmente, cuales todavia estan estructuralmente rezagados y cuales bounded recovery Entonces lo real next-level control-plane ¿Que es el trabajo?”。

Fuentes primarias de comparacion.：

1. `docs/brainstorms/2026-05-24-mainline-force-rewrite-audit-and-next-direction.zh-CN.md`
2. `docs/brainstorms/2026-05-20-unified-follow-through-matrix.zh-CN.md`
3. `docs/brainstorms/2026-05-13-mainline-progress-audit-1-8-9-and-next-direction.zh-CN.md`
4. `docs/superpowers/plans/2026-05-03-mainline-stabilization-next-batch.zh-CN.md`
5. `.trellis/tasks/05-19-local-kb-retrieval-chapter-split-stage-b2cd/prd.md`
6. `.trellis/tasks/05-27-provider-settings-model-discovery/prd.md`
7. `1.9.2` release Limites y seguimiento post-release contract/evidence follow-through despues live `main`

Instrucciones de lectura actuales：

1. Este articulo permanece post-bounded-recovery checkpoint；
2. Actualizado current-main La fuente de la verdad es `docs/brainstorms/2026-05-28-mainline-progress-audit-and-next-level-direction.zh-CN.md`；
3. La matriz de ejecucion unificada todavia esta `docs/brainstorms/2026-05-20-unified-follow-through-matrix.zh-CN.md`。

## 2. Recovery El valor de verdad del codigo actual despues

### 2.1 Packaging / runtime Valor de verdad

La verdad del envio actual es aun mas limitada de lo que el arbol de origen parece en la superficie.：

1. `esbuild.config.mjs` Todavia solo construyo uno `main.js` Salida。
2. `scripts/audit-render-host-bundle.js` Todavia aplicado `main.js` + inline `srcdoc` de host Contrato y rechazo a la independencia render-host Archivos de salida。
3. Aun retenido en el codigo fuente. runtime Documentos del candidato, p.：
   - `src/rendering/runtime/renderHostEntry.ts`
   - `src/rendering/preview/renderHostRuntimeClient.ts`
   - Un conjunto compartido de Mermaid / Vega-Lite preview runtime helper
4. Esto significa que estos archivos actualmente solo estan **Posibles canales de implementacion**，En lugar de limites de construccion enviados。
5. La actual cadena de ejecucion ha mantenido explicitamente este canal como dormant：
   - Predeterminado Mermaid / Vega-Lite preview loading Sigo caminando package runtime
   - `audit:render-host` Los elementos restantes en la linea principal actual seran rechazados. `render-host.mjs` Activos y referencias de productos de construccion
   - `resolveBundledRenderHostRuntimeModuleSpecifier()` A menos que se configure explicitamente runtime module specifier，De lo contrario continua fail-closed
   - `createRenderHostBundleBuildOptions()` Mantendra candidate-only，y quedate production `esbuild.config.mjs` Camino exterior a menos que build、release assets、audit con docs Avanzar en el mismo lote

Explicacion correcta：

- La arquitectura sigue avanzando a nivel de organizacion del codigo fuente.；
- Pero en release-asset En la frontera **Todavia no** Promocione el hecho de que ha sido enviado.。
- source/build split Ahora protegido por comprobaciones ejecutables, no solo por la copia del plan.。

### 2.2 CLI / automation Valor de verdad

actual CLI La narrativa se ha dividido claramente en dos niveles：

1. public-safe export slice Todavia deliberadamente estrecho；
2. repo-local maintainer helper Herramienta de mantenimiento de entradas explicita, mas amplia, pero aun limitada。

Valor de verdad del codigo actual：

1. `npm run cli:help` Ahora enumere claramente：
   - `content.batch-generate-from-titles`
   - `content.split-note-by-chapters`
   - `research.summarize-topic`
   - `diagram.generate`
   - `local-knowledge.inspect`
   - y export Operaciones relacionadas
2. `src/maintainerCliBridge.ts` Estos se han logrado path-based maintainer operations，Y requieren explicitos JSON / Documentacion payload。
3. maintainer-only de `local-knowledge.inspect` seam Ahora disponible para exposicion. effective path resolution、Derivado explicito o automatico query、candidate file paths、Formato sin formato context、Estructura `contextBlocks` Evidencia, estructuracion retrieval Resumen y provisional `knowledgePaths` override Matriz, utilizada para task-scoped local-KB Depurar sin escalar public-safe slice。
4. `content.split-note-by-chapters` Ahora tambien entro `src/operations/registry.ts` / `src/cliContracts.ts` columna vertebral escrita, pero todavia claramente no pertenece a la corriente public-safe slice。
5. `content.split-note-by-chapters` de maintainer Llamar ahora admite opcional `splitHeadingLevel` override，Ya no depender unicamente de la actualidad settings Instantanea。
6. `content.split-note-by-chapters` Los resultados escritos ahora tambien se exponen directamente managed artifact contract（`requestedSplitHeadingLevel`、`chapterNotePaths`、`managedArtifactPaths`、`removedStalePaths`），Ya no se obliga a la persona que llama a confiar en las reglas de nomenclatura para inferir。
7. `scripts/lib/maintainer-cli-operation-help.js` Se ha convertido en esta capa. helper surface El valor de verdad de la ayuda compartida de。
8. public-safe export slice Todavia comparando deliberadamente maintainer helper Mas estrecho。

Explicacion correcta：

- actual main Ya no se trata “solo de apoyar export-only de maintainer helper”；
- Pero todavia no tiene un diametro amplio public CLI API。

### 2.3 Valor nominal del producto

Las porciones de producto que antes se restauraban ahora estan current-main Hechos, no solo backup-branch evidence：

1. local knowledge retrieval conectado：
   - `Generar a partir del titulo`
   - `Generacion por lotes a partir de titulos.`
   - `Investigacion y resumen`
   - `Generar graficos`
2. local knowledge retrieval La configuracion ahora admite mezclas Vault Archivos relativos/Lista de rutas de carpetas y se puede anular individualmente para cada tarea; cuando la cobertura a nivel de tarea se deja en blanco, volvera a la lista de rutas predeterminada。
3. chapter split Ya implementado y equipado TOC/manifest Salida, determinista TOC front-matter metadata、Orientado a la repeticion nested heading Estabilidad block ref、manifest-backed de guarded rerun overwrite Semantica y limpieza de archivos obsoletos generados。
4. preview history con saved-artifact-aware reopening Ya disponible para su reutilizacion preview shell。
5. settings reset、concept-note prerequisite guidance、concept synonym suppression con folder file-selection profiles Todos han vuelto a la linea principal actual。
6. Orientado retrieval de note-processing Los resultados ahora tambien se exponen para la generacion de titulos y resumenes de investigacion. machine-readable de `localKnowledgeRetrieval` Resumen, incluido matched/returned counts、source paths、Solicitado `topK`、sliding-window size、current-file exclusion telemetry、index/query timing con context-char count。
7. Ahora tambien hay un offline dedicado retrieval-quality maintainer fixture：`npm run verify:local-kb-fixtures`。Responde directamente a la linea actual. MiniSearch retriever Ejecute un conjunto mas amplio mixed-note/query Corpus de regresion、task-scoped inspect case，y chapter-split showcase La realidad mas alla note/query Diversidad en lugar de reinventar una ruta de busqueda especifica de resenas。

La evidencia del codigo incluye：

1. `src/localKnowledgeBase.ts`
2. `src/chapterSplit.ts`
3. `src/ui/diagramPreviewHistory.ts`
4. `src/tests/localKnowledgeTaskIntegration.test.ts`
5. `src/tests/chapterSplit.test.ts`
6. `src/tests/diagramPreviewModal.test.ts`

### 2.4 Release / version / chronicle Valor de verdad

release-facing Los valores verdaderos se han realineado a la linea principal actual.：

1. `package.json`、`manifest.json`、`versions.json` Actualmente en `1.9.2`；
2. `src/ui/welcomeReleaseNotes.ts` Ahora oso `1.9.2` Resumen emergente de bienvenida；
3. root `README*.md` La familia ahora esta sincronizada. `1.9.2` version / badge / footer Estado；
4. `docs/releases/1.9.2.md` con `docs/releases/1.9.2.zh-CN.md` Ingreso el lado del valor real del envio actual；
5. `scripts/release/commit-chronicle-refresh.js` con `scripts/lib/repo-saga-contributor-normalization.js` Regresado a la linea principal actual.；
6. repo-saga La seguridad en serie todavia se aplica mediante bloqueos de ejecucion y documentacion.；
7. release workflow assets、tag trigger、workflow-source branch con chronicle-target branch El valor de verdad ahora esta determinado por `scripts/lib/packaging-contract.js` Participaciones compartidas, no solo YAML-local Suposiciones。

### 2.5 Provider settings / model-discovery Valor de verdad

Este canal ha sido planning/bootstrap Entra bounded breadth maintenance：

1. `src/llmProviders.ts` Ahora hosting compartido provider-field taxonomy metadata，Cobertura `core`、`contextual`、`advanced` con `developer` Campos。
2. `src/ui/NotemdSettingTab.ts` Ahora de estos metadata Representacion provider settings，En lugar de poner provider-name Trate las ramas como campos. taxonomy El principal owner。
3. El panel permanece plano. `LLMProviderConfig` Forma, conservando asi import/export Con existente `data.json` Compatibilidad y Let `model` Continuar como persistencia source-of-truth cuerda。
4. advanced disclosure Ahora por metadata Y perseverancia override Derivado comun, por lo que ambos explicitos advanced Los valores permaneceran visibles y no se simplificaran UI Ocultar。
5. La linea principal actual ya contiene limites settings Capacidades de descubrimiento en el modelo y uso de instantaneas. helper，En lugar de perseverancia remote model catalog。
6. discovery/runtime Ahora sera el actual verificado. provider family Compartir endpoint-family con header ownership seam。
7. discovered-model token metadata Puede arrancar provider-scoped output-token autofill，Pero arbitrary generic gateway owner inference Todavia mantengo deliberadamente out of bounds。
8. Derecha Cherry Studio El analisis ha dado una clara direccion de comparacion.：
   - strategy-registry con parser/fallback Vale la pena reutilizar las capas
   - Persistencia `provider.models[]` Ciclo de vida y mas pesado. provider-domain Estado, si Notemd Demasiado pesado para la arquitectura actual
9. El limite restante actual se ha convertido en un limite de producto en lugar de un limite de realizacion.：
   - Sin perseverancia `provider.models[]` catalog
   - No model CRUD Subsistema
   - No reclamar cobertura verified bounded family batch Aparte de broad all-provider discovery

Explicacion correcta：

- provider settings/model discovery Ya no esta inactivo UX architecture gap；
- Lo que realmente deberia hacerse en la siguiente etapa no es first delivery，En lugar bounded breadth maintenance con truth discipline；
- Esta linea ya no se trata solo de planificar o aislar temas de implementacion; esta limitado provider-settings control-plane convergence ha caido current main。

## 3. Comparacion en profundidad con los requisitos del programa anterior.

### 3.1 relativo `mainline-stabilization-next-batch`

El plan en ese momento requeria que：

1. Primero haga converger los limites, luego expanda el rango；
2. deja semantic verification De la “experiencia verbal” al sistema mantenible；
3. packaging El lenguaje debe obedecer estrictamente a los limites de la construccion real；
4. Drawnix Continuar como reference boundary，En lugar de scope creep。

El codigo actual esta probado.：

1. command/help/preview follow-through El grado de convergencia ha superado el objetivo minimo en aquel momento；
2. semantic helper / runbook El verdadero valor ha sido implementado y comprobado.；
3. Drawnix Aun no se ha escrito por error en el siguiente lote. active scope；
4. packaging Copiar ahora tiene ejecutable guardrails Apoyo, pero de verdad multi-entry runtime Envio aun sin resolver；
5. provider/runtime Ancho vs. provider-settings metadata Ahora se comparte un camino delimitado. control plane，Por lo tanto, el riesgo restante es la desviacion de los limites, no la realizacion en primera ronda.。

Puntos que quedan sin resolver：

1. El primer obstaculo en la siguiente etapa sigue siendo“latent runtime lane Si continuar dormant，O mejorarlo a la realidad packaged boundary”；
2. El segundo obstaculo es “dejar que provider discovery La expansion sigue siendo compartida family/shape seam，En lugar de evolucionar hacia la persistencia catalog o all-provider Reclamacion”。

### 3.2 relativo local-KB / chapter-split Stage-B2CD PRD

actual `main` en，PRD requirement El estado es el siguiente.：

| Requirement | Estado | Descripcion |
|---|---|---|
| R1 local KB retrieval for targeted tasks | Ya implementado | Pase `src/localKnowledgeBase.ts` Implementado con ruta de acceso a nivel de tarea, ahora cubierto `Generar a partir del titulo` |
| R2 local-only / no cloud / no daemon / no GPU | Ya implementado | La implementacion actual se basa en complementos. MiniSearch Indice |
| R3 retrieval disabled Nunca vuelvas a caer en viejos comportamientos | Ya implementado | Por configuraciones opcionales y integration tests Proteccion |
| R4 settings-driven / conservative defaults | Ya implementado | La ruta de configuracion actual es visible y conservadora de forma predeterminada y admite archivos predeterminados./Ruta de origen de la carpeta y cobertura a nivel de tarea |
| R5 Candidato OSS Estudio comparativo | Ya implementado | Los resultados del estudio han sido documentados en `.trellis/tasks/05-19-local-kb-retrieval-chapter-split-stage-b2cd/research/` |
| R6 nuevo `Division de capitulos` Accion | Ya implementado | command/sidebar wiring ya existe en current main |
| R7 Dividir por titulo y generar TOC Artefactos | Ya implementado | `src/chapterSplit.ts` Las pruebas correspondientes han demostrado |
| R8 Sin retorno packaging / semantic Valor de verdad | Ya implementado | build/audit Todavia solo prueba `main.js` Entrega de un solo activo |
| R9 tests/docs/progress artifacts Alinearse con soluciones anteriores | Ya implementado y reforzado | Este articulo, actualizacion de la matriz y `verify:local-kb-fixtures` Ahora se cubren tanto la alineacion del progreso de la capa narrativa como el limite sin conexion. retrieval-quality Comprobacion de regresion |
| R10 keep CI green and stability bar intact | Se ha completado el punto de control actual. | Ha sido sustituido por el actual. repo gates Revalidacion |

Explicacion correcta：

- Este Stage-B2CD PRD en current main Ha sido implementado funcionalmente.；
- El trabajo de seguimiento debe trasladarse a la calidad./Haga un seguimiento en profundidad en lugar de seguir demostrando “si estas capacidades existen””。

### 3.3 relativo provider-settings simplification / model-discovery PRD

actual requirement El estado es el siguiente.：

| Requirement | Estado | Descripcion |
|---|---|---|
| R1 provider settings Necesidad de distinguir required/core con advanced Campos | Ya implementado | actual main Compartido por core/contextual/advanced/developer Metadatos de agrupacion de campos para renderizado. provider settings |
| R2 Esta distincion debe surgir de compartir provider metadata | Ya implementado | `LLMProviderDefinition` Ahora alojado `settingFields` Metadatos y utilizados directamente por el panel de configuracion. |
| R3 mantener runtime Comportamiento y import/export Compatibilidad | Los modelos de datos actuales ya son naturalmente propicios para esto. | Piso provider config Reducir la presion de compatibilidad para futuras refactorizaciones. |
| R4 Apoyo Azure Exclusivo required Campos sin contaminar a otros provider | Ya implementado | `apiVersion` La visibilidad ahora pasa provider metadata Expresion sin cambiar la estructura de persistencia plana. |
| R5 Los procesos de configuracion comunes deben ser mas rapidos y centrados | Se ha implementado de forma acotada. | actual main Ahora se muestra de forma predeterminada core-first provider controls，E incluir elementos de ajuste secundarios en explicitos advanced disclosure |
| R6 Analisis en profundidad Cherry Studio Enlace de adquisicion del modelo | Se han implementado investigaciones. | `.trellis/tasks/05-27-provider-settings-model-discovery/research/cherry-studio-model-discovery.md` |
| R7 Cuando se detecta una falla, es necesario recurrir sin problemas a la operacion manual. model Entrada | Ya implementado | discovery si additive/transient de; manuales `model` La entrada sigue siendo un camino de verdad persistente, y en discovery Totalmente disponible incluso cuando no esta disponible o falla |
| R8 `model` debe mantenerse core/default-visible | Se satisface el comportamiento actual. | `model` Ahora es un campo visible de primera |
| R9 Si hay perseverancia advanced El valor se expande por defecto. advanced | Ya implementado | actual main Ahora a base de perseverancia provider override Derivado advanced Estado ampliado |
| R10 Cherry El plan es solo hacer selective reuse，No copiar todo | Se ha implementado de forma acotada. | actual main Usado transient discovery metadata/service，En lugar de perseverancia `provider.models[]` Subsistema |

Explicacion correcta：

1. Primera ronda provider-settings/model-discovery La aplicacion ha recaido en current main；
2. Esta propuesta deberia leerse ahora como control-plane contract con maintenance boundary；
3. El trabajo restante esta limitado. provider-family Extension、parser/header/token-guidance Disciplina y mantenimiento de la verdad documental.。

### 3.4 relativo 2026-05-20 Matriz unificada

En comparacion con esa matriz, actualmente hay tres cambios clave：

1. lane C Asegurate de traer `1.9.2` release-facing version truth，En lugar de quedarse en `1.8.9`、`1.9.0` o `1.9.1`；
2. Se requiere retencion explicita en la matriz. provider-settings / model-discovery Pista, porque esta pista que ha aterrizado esta acotada. surface Basta con afectar prioridades posteriores y no se puede "generalizar" settings Encubrimiento “narrativo”；
3. lane D Debe seguir manteniendo la “calidad/Profundidad next”Posicionamiento, en lugar de recurrir a la afirmacion de "demostrar que la funcion existe primero"。

## 4. Evaluacion del avance de la arquitectura.

### 4.1 Lo que realmente avanza

1. **Transport-driven provider runtime Mas maduro**
   provider Ancho、test mode、known-model token metadata con connection-test La semantica es mas avanzada que la de epocas anteriores. provider-expansion El plan es mas completo。
2. **Bounded product slice Sin expansion packaging claim Relanzado bajo la premisa de**
   local-KB、chapter split、preview history con saved-artifact reopening La devolucion del documento, sin obligarlo a pretender packaged runtime isolation Completado。
3. **Cherry Studio Los estudios controlados eliminan grandes puntos ciegos en la planificacion**
   El almacen ahora sabe exactamente que reutilizar, que no reutilizar y por que.。
4. **Provider-settings Orbital se ha convertido current-main Capacidades implementadas**
   La ambiguedad arquitectonica anterior se ha transformado en una implementacion limitada y enviada, en lugar de solo temas de planificacion o pruebas de ejecucion aisladas.。
5. **Release truth En este checkpoint Luego avanza de nuevo**
   `1.9.2` y seguimiento post-release contract follow-through Ya sidebar observability、inspect explainability con release workflow contract ownership convertirse current-main Valor de verdad。

### 4.2 La mayor tension estructural en la actualidad

1. **Source/build Los valores de verdad ya no son del todo consistentes**
   Ya en el codigo fuente render-host runtime candidates；Pero build y audit Todavia se demuestra que no existe un envio independiente. runtime asset。
2. **Provider discovery Ahora se requiere ancho maintenance discipline**
   control plane Se puede compartir a traves de metadata Ampliacion, pero solo si es nueva. provider Sigue caminando family/shape/header seam，En lugar de volver a lo temporal provider-name Sucursal。
3. **llano model-discovery La funcionalidad se extiende demasiado facilmente scope**
   Si se copia en su totalidad Cherry Studio，El segundo set se introducira por nada. provider-state subsystem。
4. **La estructura de configuracion plana es a la vez una ventaja y una limitacion.**
   Se salvo import/export con `data.json` Compatibilidad, pero no puede ampliarse a una persistencia oculta. remote catalog。
5. **Actual Siguiente blocker se ha convertido scope discipline，En lugar de implementar bootstrap**
   Primer lote helper se ha implementado, y el riesgo ha pasado de "¿puede converger esta linea" a "a medida que provider ¿Seguira ampliandose y manteniendose el ancho? discovery Mantenga los limites ligeros y honestos”。

### 4.3 Explicacion correcta

actual main El posicionamiento mas preciso debe ser：

1. Ya cruzado“bounded product slice Etapa "Restaurar a la Existencia"；
2. Pero aun no en la realidad Stage-C packaged runtime convergence；
3. Ya cruzado current main La primera etapa esta acotada provider-settings control-plane convergence hito, pero aun asi deliberadamente no entro en el pesado provider-model catalog Subsistema；
4. No hay gran apertura. public CLI promotion。

## 5. Sea especifico next-level Planificar

### Batch A：Packaging source/build Decision de convergencia

Prioridad：`P0`

Metas：

1. Deja clara tu decision runtime-candidate Si el codigo fuente permanece explicito non-shipped Estado, o
2. Mismo avance de lote que real packaged multi-entry boundary。

Fuertes limitaciones：

- No dejes que el "codigo fuente parezca tener `render-host.mjs`，Pero build/release El ambiguo estado intermedio de "los hechos aun lo niegan" existe desde hace mucho tiempo.。

Aceptacion：

1. `esbuild.config.mjs`、`audit:render-host`、release-asset Los documentos son consistentes con las conclusiones de las pruebas.；
2. README / maintainer docs No mas enviar senales contradictorias；
3. Despues de la verificacion local `git status` todavia clean。

Actualmente en `main` La decision adoptada sobre：

- Dejalo claro primero render-host lane para source-only，Utilice la logica de carga en tiempo de ejecucion y la cobertura de auditoria para bloquear el valor real en lugar de recuperar a medias un bucle no cerrado. shipped multi-entry Contrato。

### Batch B：Limitado public-CLI promotion Revision

Prioridad：`P1`

Metas：

1. Evaluar si existen path-based maintainer operation Este preparado para estar limitado public Mejora；
2. Para los que aun no estan preparados operation，Continue siendo intencional maintainer-only。

Reglas de evaluacion：

Solo se permite la promocion cuando se cumplen las siguientes condiciones：

1. Ingrese explicito；
2. Los efectos secundarios estan documentados.；
3. La produccion es suficiente para la automatizacion. machine-readable；
4. Fracaso / La semantica del progreso es determinista.。

### Batch C：local-KB / chapter-split Seguimiento de calidad

Prioridad：`P1`

Metas：

1. Sin cambiar local-only Mejora basada en la arquitectura explainability con operator control；
2. A menos que el futuro demuestre que hay algo mejor local-only Esquema; de lo contrario, mantengase actualizado. lightweight retriever Formulario。

Posibles puntos de entrada：

1. En la generacion de titulos, resumen de investigacion y artifact-mode Se ha implementado la generacion grafica. retrieval Resumen y resumen timing telemetry，y chapter split Se ha anadido la certeza TOC front-matter metadata con repeated-heading-safe TOC block ref Despues de eso, continua richer result/evidence framing Avanza al resto. chapter-split helper/example Camino；
2. shared maintainer helper Ahora una dependencia retrieval Complementa el camino de forma concisa payload Ejemplo, mientras que actualmente `main` Tambien se agregan los acotados. `local-knowledge.inspect` seam Para inspeccion effective path/query/context，Y apoyo temporal override-path Ajustar parametros; el siguiente paso es hacer estos maintainer Ejemplos y inspect La produccion continua result schema Evolucion；
3. Continuar mejorando sliding-window、snippet shaping con folder-scope Anticipacion y otros documentos de sintonizacion; si offline fixture entonces debe considerarse cubierto exact/prefix/current-file-exclusion Categorias y mixed file/folder task-scoped inspect case tiene una linea de base mas amplia, mientras que chapter-split La brecha restante deberia pasar a ser mas profunda corpus Ampliar en lugar de repetir la prueba de que “este accesorio es necesario””。

### Batch D：provider-settings simplification + lightweight model discovery

Prioridad：`P1`

Metas：

1. Continuar por defecto provider panel para core-first y metadata-driven；
2. mantener `model` en core/default-visible surface；
3. Continue colocando elementos de ajuste no basicos en forma explicita advanced disclosure Posteriormente, manteniendo la existente persisted override Visibilidad；
4. Continuar manteniendo los hallazgos del modelo. lightweight transient helper，En lugar de una segunda serie de perseverancia provider-state system；
5. Solo si endpoint semantics、header ownership、token-guidance behavior、tests con docs Continue ampliando la superficie de soporte solo cuando el mismo lote este alineado.。

Formulario de realizacion：

1. Sigue dejando `LLMProviderDefinition` convertirse shared field/discovery metadata owner；
2. Sigue asi `src/ui/NotemdSettingTab.ts` de metadata-driven provider-field rendering，No pongas taxonomy Regreso de decision provider-name Sucursal；
3. mantener `LLMProviderConfig.model` Como persistencia source-of-truth cuerda；
4. Sigue dejando discovery services con runtime/base-URL/header Mantenga la semantica coherente；
5. Futuro discovery Las extensiones deben seguir compartiendose a traves de family/shape support Mantente acotado, no reclames broad all-provider support；
6. **No lo hagas** Pon el control remoto model catalog Persistencia `data.json`；
7. Incluso si hay discovery，manuales model La entrada tambien debe estar disponible en todo momento.；
8. La cuarentena aun debe usarse para los lotes de expansion importantes. worktree/branch，Solo si docs/tests/verification Alinear y luego cerrar。

Aceptacion：

1. provider definition Expresion continua core/contextual/advanced/developer Agrupacion de campos；
2. Actualmente disponible advanced Los usuarios de valores persistentes no pierden visibilidad del comportamiento real.；
3. model-discovery La falla no bloqueara la configuracion manual；
4. Cobertura de prueba metadata-driven rendering、backward compatibility、discovery fallback、parser shapes、header ownership，Ademas de las materias objeto de este lote token-guidance behavior；
5. El documento establece claramente los limites de las capacidades. No sobreestimes. Cherry Studio parity。

## 6. Task Reglas para cerrar documentos.

El proximo lote de trabajo debe mantener los siguientes productos continuamente alineados：

1. task-local Trellis artifact（`.trellis/tasks/...`）
2. actual canonical progress matrix
3. Este documento de auditoria
4. Independiente provider-settings/model-discovery Documento del plan tematico
5. Si se trata de automation o packaging Si la redaccion cambia, se mantendra simultaneamente. maintainer control docs

## 7. Verificar el control de acceso

El lote del siguiente nivel aun deberia seguir requiriendo：

1. `npm run build`
2. `npm test -- --runInBand`
3. `npm run audit:i18n-ui`
4. `npm run audit:render-host`
5. `git diff --check`
6. Eventualmente clean de `git status --short --branch`

## 8. Bottom Line

Ya no falta la linea principal actual. bounded recovery slice。

La linea principal actual ahora transporta principalmente dos next-level Problemas de arquitectura：

1. es seguir dejando latent runtime lane Mantenlo claro dormant / non-shipped，O empujelo hacia build、audit、docs、release truth Toda verdad consistente packaged boundary；
2. Es dejar lo que ha aterrizado provider settings/model-discovery control plane Continue sosteniendo mientras ensancha shared-core、lightweight，Rindamos provider-specific exception con catalog-like state Infiltrarse nuevamente en el sistema.。

Estas dos cosas son reales ahora. next-level move。
