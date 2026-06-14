---
date: 2026-05-28
last_updated: 2026-06-06
topic: mainline-progress-audit-and-next-level-direction
canonical: true
---

# Auditoria actual del progreso de la linea principal y Next-Level Direccion

## 1. ¿Por que se necesita este documento?

El almacen esta en 2026-05-28 de provider-settings/model-discovery Despues de la auditoria de cierre, se produjo otro cambio en el valor real que requirio realizar un nuevo pedido.。

La linea principal actual ya no deberia describirse como：

1. Aun demostrando bounded recovery ¿Esta realmente implementado?；
2. provider-settings/model-discovery Todavia estancado en el hito de la primera etapa.；
3. Actual control-plane No hay ninguna declaracion sobre la estabilidad de la frontera.。

Lo que realmente se necesita ahora es un cierre mas estrecho y operativo：

1. Utilice lo ultimo `1.9.2` Limite de envio, sincronizacion remota y seguimiento post-release contract/evidence follow-through commits Reexpresado como base current main；
2. Compare el lenguaje del plan anterior e indique que declaraciones estan rezagadas.；
3. Aclarar la direccion acotada de avance en la siguiente etapa sin reabrir problemas existentes que han sido cerrados.。

Fuentes primarias de comparacion.：

1. `docs/brainstorms/2026-05-20-unified-follow-through-matrix.zh-CN.md`
2. `docs/brainstorms/2026-05-25-post-bounded-recovery-audit-and-next-level-direction.zh-CN.md`
3. `docs/brainstorms/2026-05-27-provider-settings-simplification-and-model-discovery-plan.zh-CN.md`
4. `.trellis/spec/claude-dev/frontend/provider-settings-model-discovery.md`
5. En el codigo principal actual：
   - `src/llmProviders.ts`
   - `src/providerModelDiscovery.ts`
   - `src/openaiCompatibleEndpointFamily.ts`
   - `src/providerRequestHeaders.ts`
   - `src/ui/NotemdSettingTab.ts`
   - `src/main.ts`
   - `src/llmUtils.ts`
   - `src/localKnowledgeBase.ts`
   - `src/ui/NotemdSidebarView.ts`
   - `styles.css`
6. Actualmente enviado release/docs Valor de verdad：
   - `docs/releases/1.9.2.md`
   - `docs/releases/1.9.2.zh-CN.md`
   - `change.md`
   - `src/ui/welcomeReleaseNotes.ts`

## 2. Valor de verdad de la linea principal actual

### 2.0 Actual live Ramificacion y release Se han redefinido los limites

La linea de base de auditoria actual ya no es "el arbol de trabajo local despues de un plan determinado"”。

Ahora esta claro：

1. `origin/main` cruzado `1.9.2` release cut，E incluye el seguimiento post-release contract/evidence follow-through commits；
2. locales `main` Resincronizado con el encabezado remoto antes del inicio de este lote；
3. Antes de que se actualizara este articulo, el almacen estaba en clean de `main...origin/main` Estado。

Explicacion correcta：

1. Esta auditoria se basa en el limite de la linea principal real que se envio y resincronizo, no en el de la deduccion local. WIP；
2. Cualquier resto remote sync o clean-state La antigua redaccion de los asuntos pendientes esta obsoleta.。

### 2.1 Packaging / runtime El valor real sigue siendo deliberadamente limitado.

Los limites de envio no cambian en esta ronda.：

1. La verdad de la construccion actual sigue siendo de entrada unica. `main.js`；
2. `audit:render-host` Todavia solo admitir inline/runtime-host Valor verdadero, no reconozca que ha sido enviado detached render-host asset；
3. Guardalo en el codigo fuente. latent render-host/runtime candidates，Pero siguen siendo valores de verdad de la capa de organizacion del codigo fuente, no release Valor de verdad；
4. production build La ruta ahora se ha poblado explicitamente alrededor de esta capa. guard：A menos que release assets、audit rules con docs Avanzar con la misma tanda, en caso contrario `createRenderHostBundleBuildOptions()` Sigue asi candidate-only，no puede ser `esbuild.config.mjs` Consumo。

Explicacion correcta：

1. packaging Sigue siendo una pista de arquitectura independiente.；
2. provider-settings/model-discovery El avance no puede ser vago packaging Valor de verdad。

### 2.2 CLI / automation El limite de la verdad permanece sin cambios, pero es mas importante

mas reciente provider Los puestos de trabajo no se amplian public CLI surface。

El valor de verdad actual sigue siendo：

1. public-safe export slice Todavia deliberadamente estrecho；
2. maintainer/helper surface Aun mas amplio, pero con fronteras；
3. provider-settings/model-discovery La mejora todavia pertenece al lado del producto y al lado de la configuracion, en lugar de ser mas amplio. public CLI Prueba del contrato。

Explicacion correcta：

1. No pongas nuevos provider helper Habilidad escrita public CLI ampliado；
2. CLI Promocionar o no sigue siendo un proceso de toma de decisiones independiente。

### 2.3 El valor real del producto ha superado significativamente al del antiguo. recovery Linea de base

Las porciones de productos limitadas restauradas anteriormente todavia existen de manera estable en la linea principal actual.：

1. preview history con saved-artifact-aware reopening；
2. onboarding release digest；
3. settings reset；
4. concept-note prerequisite guidance；
5. Para conjuntos de tareas acotados local knowledge-base retrieval；
6. chapter split Con certeza managed-artifact Comportamiento；
7. regex/file-selection profiles con batch input controlar；
8. API liveness/activity UI Relacionado con operator feedback surface。

Explicacion correcta：

1. El actual cuello de botella del progreso ya no es “visible para estos usuarios” guardrail ¿Has vuelto?”；
2. El siguiente cuello de botella es control-plane Convergencia y gestion de ancho acotado.。

### 2.4 Provider settings con model discovery Es la linea principal actual mas importante. control-plane Cambios en el valor real

Actual `main` Ahora bien, el grado de convergencia acotado del acarreo directo ha excedido obviamente 2026-05-25 Descripcion en auditoria。

Lo que ahora esta verdaderamente establecido es que：

1. `src/llmProviders.ts` Ya no solo transport/runtime metadata：
   - Ahora alojado y compartido `settingFields` taxonomy（`core`、`contextual`、`advanced`、`developer`）；
   - Ahora cargado provider de `modelDiscovery` metadata；
   - Ahora compatible provider-specific/manual-first discovery disable reason；
   - Ahora compatible canonical provider-name normalization con host-aware known-model token lookup。
2. `src/ui/NotemdSettingTab.ts` Ya no depende principalmente de provider-name Para decidir la configuracion taxonomy：
   - provider panel Ahora a traves de campos compartidos metadata Representacion；
   - advanced disclosure El estado abierto y cerrado se extendera a lo largo de la sesion de configuracion actual. re-render mantener；
   - Existente advanced/developer override Todavia obligado a ser visible cuando sea necesario；
   - discovered-model selection Se actualizara ahora model Campo, dado apply feedback、Cerrar discovered-model panel，y entrar model-aware token Enlace de sincronizacion。
3. `src/providerModelDiscovery.ts` Ya no son solo los mas pequenos first-batch helper：
   - El soporte ahora es limitado family El lote incluye OpenAI-compatible presets、OpenRouter、LiteLLM proxy-family、Together、Anthropic、Ollama、Google、Huawei Cloud MaaS、Vercel AI Gateway、AIHubMix、GitHub Models、PPIO、OVMS con xAI；
   - Ahora tolera mas wrapped catalog，Por ejemplo `provider_models`、`providerModels`、`publisherModels`、`registry`、`registries` con `services`；
   - Ahora se conservan los instantes. discovered-model metadata，Por ejemplo label、owner/provider hint con max-output-token hint；
   - Ahora lo hare `models/<id>` con `publishers/<owner>/models/<id>` Este tipo resource-style Normalizacion conservadora de nombres.；
   - Ahora se filtraran primero los directorios mas amplios. generation-relevant models，En lugar de poner embedding/reranker/speech Espere a que los elementos queden expuestos en el selector de configuracion.。
4. `src/openaiCompatibleEndpointFamily.ts` con `src/providerRequestHeaders.ts` Ahora compartido control-plane seam：
   - family detection Ahora puedes poner local OVMS Estilo `/v3` Punto final y LiteLLM Estilo local proxy separar；
   - runtime con discovery Ahora reutiliza el mismo conjunto. compatibility-header owner，Incluye `Authorization`、`X-Api-Key`、OpenRouter/Requesty referer-title header、AIHubMix `APP-Code`、GitHub Models API version header con Cerebras integration header。
5. model-aware token guidance Ahora es explicito, no solo heuristicas que coinciden：
   - `globalModelAwareMaxTokensTracking` Ahora persiste y cambia manualmente el modelo.、reset/reload con runtime request ceiling Seleccione el global compartido auto-managed baseline；
   - discovered-model apply Vuelvete independiente ahora provider-scoped lane（`discoveredModelMaxOutputTokensTracking`），En lugar de reescribir silenciosamente la situacion general token cap；
   - generic/custom gateway Ahora tu tambien puedes registry Retorno explicito owner/provider hint cuando, cierto bare model ID Reutilizacion limitada en sentido ascendente token-cap metadata；Pero cualquier bare-model La conjetura aun esta fuera de los limites.。

Explicacion correcta：

1. Esta pista ha cruzado el “primero la arquitectura” bootstrap La etapa “inicial”；
2. A lo que estamos entrando ahora es bounded breadth management con truth-maintenance Etapa。

### 2.5 Clean-state El cierre ya ha sido recertificado y ya no esta pendiente

Dentro de la antigua auditoria clean-state La escritura aun no se ha completado y ya no es exacta.。

El valor verdadero actual es：

1. provider-settings/model-discovery Esta ronda de trabajos de cierre ha sido sometida a `main`；
2. El almacen actual ha regresado. clean de `main...origin/main` Estado；
3. Para esta pista，clean-state No mas bloqueos next-direction Condiciones previas no resueltas discutidas。

Explicacion correcta：

1. clean-state Aun debe continuar como finish gate；
2. Pero este articulo ya no deberia escribirse como una deuda final inconclusa.。

### 2.6 `1.9.2` Efecto mas limitado, pero aun importante, sobre la verdad principal

La ultima ronda de incrementos de envio no reabrio una nueva via de arquitectura, pero reforzo el valor real de la via ya implementada.。

Lo que ahora esta verdaderamente establecido es que：

1. sidebar Se ha solucionado el problema del diseno de observabilidad en la linea principal de envio.：
   - `styles.css` Nuevamente incluya explicitamente footer scroll container Limitado API-activity Estilo de area；
   - `src/ui/NotemdSidebarView.ts` Deje que la salida del registro coincida nuevamente. API activity En la misma superficie de envio desplazable, ya no permita activity Las entradas hacen que el registro desaparezca de la vista。
2. Base de conocimientos locales inspect Sin expansion public runtime contract La premisa se vuelve mas diagnosticable.：
   - `src/localKnowledgeBase.ts` La estructura ahora quedara expuesta. `queryDiagnostics`；
   - inspect Los resultados ahora distinguen mas claramente las senales bajas basename Derivacion y salud retrieval camino, y a `index.*` Este tipo de nota de navegacion da caution。
3. maintainer CLI Los ejemplos y la documentacion se acercan mas al tiempo de ejecucion real.：
   - Documentacion y helper Los ejemplos ahora se utilizan constantemente. `--vault docs` bajado vault-relative Camino；
   - Esto reduce maintainer Ejemplos y realidad retrieval / chapter-split Deriva entre contratos de ejecucion。
4. chapter split Ahora hay un acceso mas explicito a la documentacion de envio, no solo maintainer Documentacion：
   - chapter split + TOC Documentos enfocados independientemente con showcase Han entrado activos checked-in de release-facing documentation surface。
5. release El valor de verdad del enlace de mantenimiento se vuelve a ajustar.：
   - chronicle refresh helper Lo conservare ahora maintainer Identidad, no retirarse tranquilamente bot-like identity。
   - workflow-source checkout con chronicle-target branch El valor de verdad regresa ahora `scripts/lib/packaging-contract.js` De principio a fin workflow env Nombre y helper/tests mantener GitHub Actions bootstrap Los valores son consistentes。
   - release workflow de tag-trigger glob El valor de verdad tambien regresa ahora `scripts/lib/packaging-contract.js` todos，`.github/workflows/release.yml` Mantener solo GitHub Actions en checkout Debe analizarse antes. bootstrap Literales。
   - semantic verification Ahora distingue entre workflow-start trigger Valor verdadero y version digital release Acceso：`*.*.*` Unico responsable de la puesta en marcha. workflow，`scripts/release/validate-release-tag.js` Sigue siendo responsable de hacer cumplir los numeros puros. `x.x.x` Contrato。

Explicacion correcta：

1. `1.9.2` No se trata de “agregar una nueva linea principal de arquitectura” release；
2. `1.9.2` Despues release-contract El seguimiento sigue por el mismo camino: disminucion operator confusion、doc/runtime Deriva vs. release-process Ambiguedad, pero no cambia el comportamiento de envio del complemento.。

### 2.7 Actual `890b21b` Stage-B2/C/D Seguimiento de las lineas de base

La linea base de ejecucion antes de que se actualizara este articulo era `890b21b`（`docs(progress): align post-recovery packaging truth`），locales `main`、`origin/main` Ser consistente con el espacio de trabajo previo al inicio de este lote y clean。Antes local-KB fixture El ancla permanece `824d07e`（`test(local-kb): cover chapter split showcase retrieval`）。

Este articulo fixture lane El valor de Stage-C Avanzar la evidencia desde la capa narrativa hasta la inspeccion operativa.：`npm run verify:local-kb-fixtures` Ahora la corriente en linea MiniSearch-backed retrieval camino, correr real-note-style de chapter-split docs-vault Ejemplos y cobertura managed artifacts、guarded reruns、estable TOC block refs、Carpetas cruzadas task-contract retrieval，y chapter-split showcase La realidad exterior note/query Diversidad。

Actual `7999a5f` Los segmentos de seguimiento posteriores no han cambiado. runtime retrieval algorithm，En su lugar, pase el fixture la verdad docs-vault El camino de la busqueda sigue recayendo en maintainer operator surface：`local-knowledge.inspect` de helper help、Bilingue capability matrix Las pruebas de alineacion con la documentacion ahora tienen cobertura conjunta explicit research query、Carpetas cruzadas batch-title source path、diagram-source retrieval，Y acotado `topK` / `slidingWindowSize` override。El significado de este segmento es reducir la falla de "la prueba lo prueba, pero el mantenedor no sabe como reproducirlo"; no cambia public CLI Ni los limites ni la maintainer-only inspect seam Promocionar a usuario API。

Comparacion `.trellis/tasks/05-19-local-kb-retrieval-chapter-split-stage-b2cd/prd.md`，La situacion actual de cada articulo es la siguiente:：

| PRD Requisitos | Codigo actual/Valor de verdad del documento | Estado | Siguiente explicacion |
|---|---|---|---|
| R1 local-KB Apoyo a la mision | `Generar a partir del titulo`、`Generacion por lotes a partir de titulos.`、`Investigacion y resumen` con `Generar graficos` Ya ingresado despues de la activacion. settings-driven retrieval Enlace | Ya implementado | Ya no escriba el cableado de tareas como un problema abierto e invierta en calidad y profundidad mas adelante. |
| R2/R3 local-only con fallback Comportamiento | Utilice el tiempo de ejecucion actual dentro del complemento. MiniSearch lexical retrieval；Cerrar retrieval O no disponible context Mantenga la ruta de la tarea original cuando | Ya implementado | Debe escribirse como una busqueda local ligera y no debe escribirse como una busqueda completa. semantic RAG Plataforma |
| R4/R4a/R4b Configuracion y source paths | Se admite la mezcla vault-relative Documentacion/Ruta de la base de conocimientos de carpetas, lista predeterminada, anulacion por tarea y anulacion vacia para volver a la lista predeterminada | Ya implementado | Primero mejora el ejemplo y inspect Facilidad de diagnostico, considere mas tipos de tareas |
| R5 Estudio comparativo | active task de `research/` Ya en el directorio local-RAG con TOC Materiales comparativos | Ya implementado como apoyo a la toma de decisiones. | Las comparaciones posteriores deben recaer en Notemd El contrato de tarea actual no se puede generalizar a RAG Lema |
| R6/R7 chapter split | command/sidebar/maintainer surface、Certeza TOC metadata、estable block refs、manifest-backed guarded reruns con managed artifact El resultado ya existe | Ya implementado | seguir result schema Evolucionar, sostener showcase docs Consistente con el contrato escrito |
| R8 packaging / semantic truth | La frontera maritima actual permanece `main.js` + inline `srcdoc`，Sin reclamaciones dedicated runtime asset | Implementado como una restriccion. | packaging convergence Es el siguiente P0 Pistas de arquitectura, elementos no completados. |
| R9/R10 tests、docs con CI Estabilidad | Pruebas de integracion existentes y `verify:local-kb-fixtures` Cubierto retrieval injection、fallback、inspect、chapter-split showcase Comportamiento, carpeta cruzada task-contract retrieval Fuentes de navegacion con senal baja diagnostics；Actual maintainer help/docs alignment Las pruebas tambien se bloquean en la realidad. docs-vault example payload | Continuo finish gate | Continue utilizando pruebas para bloquear la redaccion publicitaria en progreso antes de expandir la descripcion.；helper El ejemplo debe continuar vault-relative No cruces la frontera y entra public CLI Narracion |

Explicacion de la arquitectura.：

1. local-KB Esta dentro del complemento. MiniSearch lexical retriever，Mas task-scoped prompt injection；No enviado externo semantic RAG stack；
2. `local-knowledge.inspect` Si maintainer-only Diagnostico seam，No public CLI Expansion；
3. chapter split Asegurate rerun Comportamiento managed artifact Redaccion de contratos, no solo conversion de texto helper；
4. packaging El verdadero valor sigue siendo una entrada unica `main.js` + inline `srcdoc`，entonces latent render-host source candidate Sigue siendo solo un candidato de codigo fuente, a menos que se modifique en el mismo lote en el futuro. build、release、audit con docs。

## 3. Comparacion en profundidad con el lenguaje del programa anterior.

### 3.1 2026-05-25 Que estan subestimando las auditorias ahora

Antes bounded-recovery Las auditorias ahora estan retrasadas en un punto critico.：

1. Todavia pone provider La orbita se describe como current main Solo se ha completado la primera etapa de convergencia acotada；
2. Aun conserva algo“metadata-driven settings Frente a la codificacion rigida settings La antigua redaccion de "Aun por implementar"；
3. Todavia pone discovery Piensa en los lotes como mas reducidos. OpenAI-compatible/Ollama/Google surface。

El codigo actual anula directamente estas antiguas representaciones.：

1. metadata-driven settings rendering Ya implementado；
2. provider-specific discovery disable reason Ya implementado；
3. bounded discovery Ahora mucho mas alla de los tres primeros family de starter batch；
4. runtime/discovery de header con endpoint-family La alineacion ha aterrizado；
5. discovered-model token metadata Ahora afectara directamente settings Valor predeterminado。

Explicacion correcta：

1. Esa vieja auditoria packaging con lane ordering Sigue siendo util；
2. Pero ya no es adecuado como provider Fuentes de verdad para las orbitas.。

### 3.2 2026-05-27 provider Las partes del articulo principal que aun son correctas

provider La monografia sigue siendo correcta en los siguientes puntos y no debe relajarse：

1. Las estructuras de persistencia deben mantenerse simples；
2. manuales `model` Debe seguir siendo la unica persistencia provider-side Valor de verdad；
3. Prioriza compartir family Semantica, no provider-name Sucursal；
4. Cherry Studio Solo reutiliza las ideas estrategicas, no la perseverancia catalog Subsistema；
5. La documentacion debe describir honestamente los limites admitidos y no admitidos.。

Estas aun deberian considerarse limitaciones estrictas.。

### 3.3 2026-05-27 provider ¿Cuales son las caracteristicas que se subestiman actualmente?

El documento ahora tambien esta subestimado en varios lugares. current main：

1. Esta en Phase 3 La narrativa todavia favorece “el primer lote de discovery helper”；
2. No destaca suficientemente la wrapped registries con resource-name normalization de parser ampliar；
3. No clasifica las siguientes tres categorias token guidance Haz distinciones claras：
   - generic `OpenAI Compatible` en trusted host en bare-model token Reutilizar；
   - generic gateway Basado en registry owner hint de bare-model token Reutilizar；
   - gateway/provider-prefixed model de token Inferencia；
   - Mantenlo intencionalmente estrecho globally consistent fallback。

Explicacion correcta：

1. Esta monografia es ahora mas adecuada como control-plane contract Documentacion, no “borrador de implementacion futura””；
2. El siguiente paso es la expansion limitada y el mantenimiento del valor de verdad, en lugar de la primera ronda de entrega.。

### 3.4 Juicios erroneos que la actual matriz unificada debe seguir evitando

La Matriz Unificada ahora necesita protegerse explicitamente contra estas malas interpretaciones recurrentes.：

1. Cambiar el ancho actual. bounded discovery Mal escrito como all-provider discovery；
2. poner host-aware bare-model token lookup Mal escrito como arbitrary custom gateway Tambien se puede inferir automaticamente owner；
3. Compartir existente parser seam Si se escribe por error, se puede persistir facilmente mas adelante. remote catalog，Sin requerir nuevas decisiones arquitectonicas explicitas。
4. poner `1.9.2` medio sidebar / inspect / docs La terminacion de 23. esta incorrectamente escrita como public CLI Ampliado, o packaging El contrato ha cambiado。
5. poner YAML en `*.*.*` trigger El valor literal se escribe erroneamente como independiente. release Reglas, no aceptacion shared release contract Bloqueado y seguido de numeros. tag validator Admisible bootstrap Valor。

### 3.5 Packaging con CLI Partes del documento de planificacion que aun son validas

Antes packaging con CLI Documento de planificacion, todavia correcto en dos puntos clave：

1. El limite del renderizador actualmente enviado todavia esta `main.js` + inline `srcdoc`，En lugar de enviado dedicated runtime asset；
2. Actual CLI El limite correcto sigue siendo "mantener primero la independencia del anfitrion" core，Tratelo por separado nuevamente. host/file/UI follow-through”，En lugar de seguir ampliandose public command Expansion cuantitativa。

El codigo actual todavia respalda estas primeras decisiones.：

1. `esbuild.config.mjs`、`scripts/audit-render-host-bundle.js` con maintainer Los documentos aun estan cobloqueados en el limite de envio de entrada unica；
2. `src/operations/diagramGenerateOperation.ts`、`src/operations/diagramCommandExecution.ts`、`src/operations/diagramCommandHostAdapter.ts`、`src/operations/publicCliSurface.ts` con `src/maintainerCliBridge.ts` Aun manteniendo la siguiente division acotada：
   - typed core operation；
   - delimitado public-safe export command；
   - Mas amplio pero expresamente solo maintainer Usado path-based helper flow。

Explicacion correcta：

1. provider Se baja parcialmente el cierre de la pista control-plane Riesgo, pero no reemplazo packaging con bounded CLI promotion discipline，Convertirse en el nuevo maestro de la arquitectura；
2. next-level La planificacion deberia volver ahora a packaging/semantic convergence Prioriza, luego ven bounded CLI/public-surface Toma de decisiones；provider La ampliacion de la amplitud deberia relegarse a una via de mantenimiento continuo en lugar de seguir ocupando la narrativa central。

### 3.6 ¿Que viejas declaraciones de progreso estan ahora sobreestimadas o fuera de lugar?

Actualmente existe una clase de antiguas representaciones del progreso que han sido distorsionadas en la direccion opuesta: dan provider La pista da demasiado peso narrativo pero subestima el presente. Stage-C El valor del mantenimiento de la verdad.。

Especificamente：

1. La linea principal actual ya no deberia escribirse como provider settings/model discovery Sigue siendo la unica via de propulsion principal.；
2. La linea principal actual ya no deberia escribirse como Stage-C local-KB / chapter-split Todavia demostrando principalmente "si la funcion existe"”；
3. La linea principal actual ya no debe escribirse como la ultima release-facing truth Todavia atrapado en `1.9.0` o `1.9.1`。

Explicacion correcta：

1. provider El ancho ahora pertenece a la pista de mantenimiento.；
2. Stage-C Calidad/Las resenas son ahora una pista de productos de mayor valor.；
3. En el seguimiento release Antes de aparecer，`1.9.2` Es el limite actual del valor de la verdad publica.。

### 3.7 Stage-B2/C/D PRD El verdadero significado de la linea principal actual.

Actual active Stage-B2/C/D PRD ya no debe leerse como "si la funcion existe" checklist。En la linea principal actual，R1 llegar R7 Ya se da cuenta del valor de la verdad.；R8 Para evitar la exageracion packaging Bloqueo de fronteras；R9 con R10 es continuo finish gate。

Esto cambiara la direccion del avance del proyecto.：

1. local-KB El trabajo eficaz es mas autentico note/query Diversidad y estados de fracaso explainability，En lugar de volver a hacerse cargo de la entrada a la mision；
2. chapter split Un trabajo eficaz es showcase/doc/result-schema Alinear en lugar de restaurar la superficie de comando；
3. CLI El trabajo eficaz es determinar si existe un limite. path-based operation Vale la pena public promotion，En lugar de poner maintainer diagnostics volverse implicito public support；
4. packaging Un trabajo eficaz es resolver latent runtime candidate de source/build Limites, en lugar de escribir codigo fuente candidato como activos enviados。

## 4. Evaluacion de la promocion de la arquitectura.

### 4.1 ¿Que fue realmente avanzado?

1. provider control plane Ahora puedes compartir a traves de metadata Amplie, ya no dependa del amontonamiento manual settings Sucursal。
2. discovery con runtime en endpoint-family y header-owner Las capas se han vuelto mas convergentes.。
3. token guidance Ya no solo UI hint，En cambio, ha entrado en persistencia. settings Estado y runtime ceiling Comportamiento。
4. discovery parser Comparado con el aterrizaje inicial. helper，Ya es cierto registry Deriva、wrapped catalogs con resource-style names Mas robusto。
5. retrieval explainability en maintainer La pista es mas fuerte porque es mas debil query La derivacion ahora quedara expuesta explicitamente mediante diagnosticos estructurados en lugar de aparecer simplemente como un espacio vacio y opaco. context。
6. shipped UI de operator feedback Esta disponible nuevamente porque la salida del registro es la misma que API activity Los disenos de desplazamiento limitado ahora se comparten en lugar de seguir luchando por un espacio fijo。
7. release workflow trigger Valor de verdad ahora y release assets、notes、tag validation、workflow-source branch、chronicle-target branch Entrar juntos contract-backed Estado; esto cierra un lugar YAML-local Deriva la brecha sin fingir GitHub Actions Puede estar en checkout antes import Codigo de almacen。

### 4.2 Restricciones estructurales que aun existen

1. packaging El valor de verdad sigue siendo deliberadamente mas limitado que la capa de organizacion del codigo fuente.。
2. discovery Aun transitorio por diseno, sin persistencia remote model catalog。
3. Actual bounded discovery family Los lotes son lo suficientemente amplios como para requerir disciplina, pero no lo suficientemente amplios como para afirmar que son "universales". provider discovery”。
4. generic `OpenAI Compatible` Correcto owner Las extrapolaciones deben seguir siendo conservadoras; mas alla trusted host、Explicito registry owner hint Con explicito prefix parte de，token ceiling Aun debe mantenerse unresolved。
5. Maquina local actual host-side desktop verification Correcto plugin reload/state inspection Mas fuerte, pero correcto settings-panel La automatizacion completa de los clics con secuencias de comandos aun es debil; esto lane Actualmente todavia depende de Jest Ir a bloquear `Fetch model list -> Use` de notice/override Sucursal。
6. maintainer inspect explainability Comparar deliberadamente public CLI Los verdaderos valores son mas ricos; A menos que haya una promocion de lotes explicita en el futuro, debe continuar limitada.。

### 4.3 Si esta linea se desvia ahora, ¿cual es el mayor riesgo?

El mayor riesgo ahora no es "no darse cuenta", sino "perdida de la disciplina de limites"”。

Forma mas probable de fracasar：

1. ad hoc de provider-name special-case Comienza de nuevo la sustitucion family-based shared logic；
2. La documentacion comienza a exagerar y Cherry Studio de parity；
3. settings/discovery token guidance con runtime token-ceiling La logica vuelve a desviarse；
4. En el futuro, alguien "guardara convenientemente la lista de modelos capturados" y creara silenciosamente un segundo conjunto. provider-state subsystem。

### 4.4 ¿Adonde se ha movido el verdadero cuello de botella de la linea principal actual?

en la ultima provider Despues del cierre, el cuello de botella con mayor apalancamiento actual pero no resuelto se ha trasladado a la via adyacente.：

1. packaging / semantic-verification Todavia lleva el nucleo de source-vs-shipped Ambiguedad de limites, porque ya es reutilizable en el codigo fuente. runtime candidate，Pero el contrato de entrega real sigue siendo de una sola entrada.；
2. CLI / automation Aun llevando el mantenimiento deliberado de public-vs-maintainer Capas, cualquiera path-based operation Todas las mejoras deben seguir siendo explicitas.；
3. file-selection / local-KB / chapter-split de Stage C Lo que se necesita ahora es mas profundo mixed-corpus Cobertura de la evaluacion, alineacion de ejemplos y explainability Deja de hablar en lugar de hacer otro argumento reconstituyente de "¿existe la funcion?"。

## 5. Direcciones especificas para la siguiente etapa

El proximo lote de planes de ejecucion acotados.：

1. **P0 packaging Valor de verdad：** Cuando no hay modificacion en el mismo lote build graph、release assets、audit con docs Antes, continua `main.js` + inline `srcdoc` Como unica frontera de envio。
2. **P1 Stage-C Calidad：** Con reserva exact-file/folder、exclusion、failure-state con task-scoped inspect Sobre la premisa de la cobertura, ponga `verify:local-kb-fixtures` Ampliar a mas chapter-split showcase La realidad exterior note/query Formulario。
3. **P1 chapter split Documentacion：** deja showcase docs con generated-artifact Los ejemplos siguen a la certeza TOC front matter、estable block refs con guarded rerun Semantica。
4. **P1 CLI Limites：** A menos que se indique lo contrario public-promotion Contrato de lote y finalizacion de lote、help、Probar y documentar, o sino `local-knowledge.inspect` Sigue asi maintainer-only。
5. **P1/P2 provider Mantenimiento：** provider/model-discovery El nuevo soporte sigue siendo compartido. family con response-shape seam，Y se claro en todo momento token-guidance Ambito de influencia。

### Batch A：Priorizar la finalizacion packaging / semantic-verification Convergencia antes de decidir si ampliar cualquier narrativa

Prioridad：`P0`

Metas：

1. Continuar poniendo la corriente. `main.js` + inline `srcdoc` La verdad del envio sigue siendo un vinculo explicito y ejecutable.；
2. deja release workflow trigger、tag validation、assets、notes、workflow-source con chronicle-target El valor de verdad permanece en el mismo shared contract Abajo；
3. Ampliar en cualquiera packaging Antes de narrar, continua aferrandote explicitamente latent render-host runtime candidate de candidate-only production-build guard。

Reglas estrictas：

1. Si se va a introducir en el futuro dedicated runtime asset，Entonces build graph、release assets、audit logic、maintainer docs con release docs Deben cambiarse juntos en el mismo lote.。

### Batch B：Continuar con bounded CLI / public-surface promotion con maintainer helper Separacion explicita

Prioridad：`P1`

Metas：

1. Mantenga la corriente acotada public-safe export Solo con maintainer Usado path-based helper flow Estratificacion de；
2. Solo cuando un determinado path-based operation de contract、automation level、context requirement、Considere la posibilidad de actualizar solo cuando las pruebas y la documentacion sean suficientes para respaldar una exposicion mas amplia.。

Posibles trabajos：

1. Sigue asi `cli.public-surface.export` Con el presente registry metadata Alineacion；
2. Sigue asi `npm run cli:help` con maintainer El documento esta vinculado al actual. helper surface La descripcion es consistente con；
3. Evita poner maintainer-only mutation/introspection seam Escrito erroneamente como ya publico CLI Apoyo。

### Batch C：Sin reabrir cuestiones existenciales, profundizar file selection / local-KB / chapter split de Stage-C Calidad

Prioridad：`P1`

Metas：

1. Pon la linea principal actual. retrieval con batch-input Las capacidades se tratan como porciones de productos que ya se han implementado.；
2. Las inversiones de seguimiento se centran en objetivos mas amplios. corpus-quality Evidencia、maintainer Ejemplos y volver a la profundidad en lugar de continuar con narrativas restaurativas。

Posibles trabajos：

1. Partiendo de la premisa de que el contrato actual ya es compatible, continue expandiendose mixed file/folder、mixed query-shape con exclusion-behavior Cobertura de accesorios；
2. Sigue asi maintainer Ejemplos y retrieval inspect Orientacion y verdad task-scoped retrieval Coherencia de enlaces；
3. Al ampliar la profundidad de las pruebas, continue manteniendo deterministic managed-artifact con rerun-guard Semantica。
4. Solo si puedes caer estrictamente en Notemd Solo agregar evaluacion comparativa con proyectos de referencia externos cuando el contrato de tarea actual este vigente; Evite la generalizacion hacia algo que este divorciado del aspecto actual del producto. RAG Lema。

La linea principal actual esta en esta ronda. Stage-C follow-through La diferencia de aterrizaje se ha anadido en：

1. Los partidos sin conexion ahora volveran a bloquearse task-scoped de `batchGenerateFromTitles` con `researchSummarize` retrieval case，En lugar de diagram generation Se el unico maintainer inspect Camino de prueba；
2. maintainer helper de help/El ejemplo ahora incluye los tres admitidos actualmente. inspect query Los caminos derivados se exponen juntos.：`basename`、`explicit` con `diagram-source`；
3. exact-file-vs-folder de configured knowledge-path Los limites ahora tambien se verifican en el mismo enlace del dispositivo fuera de linea, lo que reduce aun mas la documentacion./Ejemplos y realidad retrieval Riesgo de deriva conductual；
4. maintainer lado inspect El estado de falla de explainability Valor de verdad：`no-paths`、`no-candidate-files` con `no-retrievable-sections` seguira siendo distinguible y ya no sera reprimido en un "no" general context”Resultados。
5. Los partidos fuera de linea ahora tambien estan cubiertos noisy mixed-corpus scope：Repetir/En blanco override path、mezclar file/folder entry、No Markdown Archivos que interfieren, carpetas irrelevantes y archivos vacios searchable section Todos los candidatos ingresaran al mismo camino de evaluacion para demostrar la actual MiniSearch El camino aun se puede mantener scope Convergencia sin ampliar el numero de tareas o public CLI Comportamiento。
6. Partidos fuera de linea y maintainer helper El ejemplo abarca ahora tambien real-note-style chapter-split showcase query：Te rodeara managed artifacts、guarded reruns Y estabilidad TOC block refs Verifique los resultados de la busqueda y runnable inspect Ejemplos usando real docs vault Caminos distintos a los que solo existen en el dispositivo de prueba.。
7. Los partidos fuera de linea ahora tambien estan cubiertos chapter-split showcase La realidad exterior note/query Diversidad: entre carpetas project/reference Ruta de la base de conocimientos y recuperacion del contrato de tareas、RAG Notas de evaluacion de calidad y navigation-like source diagnostics Todos estan cerrados, mientras que ninguno `local-knowledge.inspect` Promocionar a public CLI contract。
8. maintainer help、Bilingue capability matrix corresponder a Jest alignment La prueba ahora esta llena con el mismo lote de real. docs-vault inspect Ejemplo：explicit research query uso `brainstorms` + `maintainer` Ruta de conocimiento entre carpetas，batch-title Los ejemplos apuntan directamente a `brainstorms/2026-05-28-mainline-progress-audit-and-next-level-direction.md`，diagram-source El ejemplo sigue usando `index.zh-CN.md` Verificar el diagnostico de fuente de senal baja; esto permite Batch C La "Alineacion de ejemplo" paso de abierta a implementada guardrail。

La siguiente direccion acotada de este lote.：

1. Continuar aumentando chapter-split showcase La realidad exterior note/query Cuando se trata de diversidad, se debe dar prioridad a compensar estados de falla y senales bajas en contratos de tareas reales. query con noisy-corpus Evidencias en lugar de anadir caminos mas demostrativos；
2. seguir result schema Evolucionar, sostener chapter split de showcase/docs、maintainer examples Escribe un contrato con la verdad.、managed-artifact Consistencia semantica；
3. deja maintainer inspect Suficientemente adecuado para el diagnostico, pero no permita que accidentalmente se convierta en un hecho. public contract；Si se deben realizar mejoras en el futuro path-based operation，Debe empezar de nuevo public-promotion Bloqueo por lotes y por el mismo lote schema、help、Pruebas y documentacion.。

### Batch D：poner provider Reemplazo de vias bounded breadth-maintenance Patron

Prioridad：`P1/P2`

Metas：

1. Continuar solo compartiendo family Semantica o wrapped-catalog shape Apoyo para ampliar capacidades；
2. A menos que transport o discovery El contrato es realmente diferente, de lo contrario se rechazara su devolucion. provider-name-only Sucursal。

Reglas estrictas：

1. Cada nuevo provider/discovery Las extensiones deben especificarse en el mismo lote. family mode、header owner、endpoint normalization、token-guidance Comportamiento y pruebas./Documentacion。
2. Cambia cada vez discovered-model token autofill Cuando , debe quedar claramente escrito que afecta：
   - Panorama general `Max tokens`
   - provider output-token override
   - Ambos afectan
   - Ninguno afecta

Valor de verdad actual：

1. La implementacion actual solo afecta provider output-token override；
2. manuales typed model change Seguira avanzando la situacion general model-aware baseline ese camino, suponiendo que el usuario no se desvie de el。

### Batch E：Pon el documento/Pruebas y clean-state Continuar sirviendo como barrera de seguridad a largo plazo.

Prioridad：`P0`

Metas：

1. Evitar que se vuelvan a utilizar sesiones posteriores current-main El valor de verdad vuelve a caer en una redaccion obsoleta.；
2. poner clean-state Demostrar que sigue siendo una invariante de cierre que continua satisfaciendo, en lugar de volver a acumularse en deuda por saldar.。

Realidades actuales de la auditoria：

1. El almacen actualmente cuenta clean，Por lo tanto clean-state La recuperacion ya no es un elemento de accion abierto en este articulo.；
2. Lo que realmente se necesita ahora es que en el seguimiento packaging / CLI / Stage-C Continue conservando este conjunto cuando llegue el lote. finish discipline；
3. Matriz unificada, articulos tematicos.、README/change surface Verificar con regresion enfocada sigue siendo lo mas practico anti-drift Barandilla。

Acciones que deben ser seguidas：

1. Mientras packaging、CLI surface o provider/discovery Cuando los limites cambien, vuelva a verificar el documento de verdad actual.；
2. Continue `npm run build`、`npm test -- --runInBand`、`npm run audit:i18n-ui`、`npm run audit:render-host`、`git diff --check` con clean de `git status --short --branch` Como paquete de acabado minimo。

## 6. Reglas de sincronizacion de documentos.

Cualquier actualizacion se realizara en el futuro. provider-settings/model-discovery Los cambios en el valor de verdad orbital deberian comprobarse al menos de forma sincronica：

1. `change.md`
2. `README.md`
3. `README_zh.md`
4. `docs/brainstorms/2026-05-20-unified-follow-through-matrix.*`
5. `docs/brainstorms/2026-05-27-provider-settings-simplification-and-model-discovery-plan.*`
6. Este articulo

## 7. Verificar el control de acceso

Cualquier actualizacion que cambie el juicio de valor de verdad de este articulo deberia terminar con los siguientes resultados.：

1. `npm run build`
2. `npm test -- --runInBand`
3. `npm run audit:i18n-ui`
4. `npm run audit:render-host`
5. `git diff --check`
6. clean de `git status --short --branch`

## 8. Bottom Line

Actual `main` No hay necesidad de volver a hacerlo“provider settings ¿El argumento de si esta linea ha llegado al suelo o no?。

Ahora la verdadera pregunta es：

1. packaging/source organization con verdad shipped render-host truth ¿Podemos seguir manteniendo la coherencia sin exagerar el hecho de que la linea principal actual no se ha enviado? runtime topology；
2. Actual bounded CLI ¿Se puede seguir manteniendo explicitamente la estratificacion sin ningun futuro? path-based promotion Todos insisten contract-first，en lugar de convenience-first；
3. Stage-C local-KB / file-selection / chapter-split ¿Se puede seguir fortaleciendo el trabajo? mixed-corpus Evidencia de calidad en lugar de regurgitar "¿existe la funcion?"”；
4. Actualmente mas amplio bounded provider discovery surface ¿Se puede mantener? shared-core、lightweight Y los limites son honestos y se usan como excusa para mantener huellas en lugar de declaraciones arquitectonicas mas amplias.；
5. ¿Puede el documento de valor de verdad actual mantenerse al dia con los limites reales de la sucursal de envio lo suficientemente rapido como para evitar que sesiones futuras vuelvan a caer? `1.9.0/1.9.1` Redaccion antigua de la epoca.。
