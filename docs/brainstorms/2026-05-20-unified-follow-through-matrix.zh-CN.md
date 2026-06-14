---
date: 2026-05-20
last_updated: 2026-06-06
topic: unified-follow-through-matrix
canonical: true
---

# Matriz de promocion unificada de linea principal

> Proposito: Mantener una matriz unica de ejecucion con distinciones claras **Despues de ser reescrito live mainline** con **Seguir conservando ramas de respaldo con mas resultados del trabajo posterior.**，Evitar que la planificacion posterior siga sobreestimando el progreso de los envios principales actuales o siga ocultando nuevos cuellos de botella estructurales.。

## 1. Source-Of-Truth Reglas

A partir de este punto de control：

1. Reescrito `origin/main` es el unico valor verdadero del envio actual。
2. `backup/main-before-origin-force-20260524` solo reintegration Evidencia, no actual release Valor de verdad。
3. Primero actualice este articulo con cualquier novedad actual.。
4. Solo cuando el codigo, las pruebas y los documentos realmente existen en la linea principal reescrita, una determinada pista se puede escribir como "implementada"”。

## 2. Linea base de auditoria

Este articulo se basa en los siguientes hechos.：

1. 2026-05-24 force rewrite Despues live `origin/main`，y en 2026-06-06 Basado en `1.9.2` Limites de envio y seguimiento post-release contract/evidence follow-through commits Vuelva a auditar el actual `main` Arbol de trabajo；
2. Documentos anteriores que aun son relevantes para la linea principal actual.：
   - `docs/brainstorms/2026-05-07-cli-next-phase-planning.*`
   - `docs/brainstorms/2026-05-08-packaging-semantic-convergence-progress-and-next-steps.*`
   - `docs/superpowers/plans/2026-05-03-mainline-stabilization-next-batch.*`
   - `docs/brainstorms/2026-05-27-provider-settings-simplification-and-model-discovery-plan.*`
3. de `backup/main-before-origin-force-20260524` Evidencia de la sucursal de respaldo。

Linea base de ejecucion actual de esta actualizacion de la matriz：

1. `890b21b`（`docs(progress): align post-recovery packaging truth`）Esta vez Stage-C Seguimiento de calidad antes del inicio del lote. clean locales/Linea de base remota；
2. `824d07e`（`test(local-kb): cover chapter split showcase retrieval`）Aun antes local-KB fixture punto de anclaje; actual fixture lane Prueba Stage-B2/C/D de local-KB con chapter split El trabajo ya no es una cuestion de “si la funcion existe” porque `npm run verify:local-kb-fixtures` Aprobado en linea MiniSearch path Cobertura real-note-style chapter-split showcase retrieval，y chapter-split showcase La realidad mas alla note/query Diversidad；
3. `7999a5f`（`test(local-kb): broaden stage-c fixture coverage`）Despues，fixture lane Ya chapter-split showcase La realidad mas alla note/query Diversidad incluida en el alcance de la certificacion actual；
4. Por lo tanto, este articulo considera local-KB、file selection con chapter split Se considera ejecutado el contrato de producto; El siguiente paso es evaluar la profundidad.、maintainer Ejemplo de alineacion con packaging Disciplina de limites en lugar de seguir haciendo reafirmacion existencial。
5. El lote actual continua maintainer example alignment Manten tu boca cerca de la verdad. docs-vault Camino：helper help、bilingue capability matrix Cocobertura con pruebas ahora explicit research query、Carpetas cruzadas batch-title source path、diagram-source retrieval，Y acotado `topK` / `slidingWindowSize` override；Esto todavia es maintainer-only Lado de diagnostico, no public CLI Expansion。

## 3. Matriz unificada actual

| orbita | Actual `origin/main` Valor de verdad | Copia de seguridad de la evidencia de la sucursal | Se requieren proximos pasos | Esta estrictamente prohibido juzgar mal | Prioridad |
|---|---|---|---|---|---|
| A. Packaging / semantic verification | Actual live build/audit El verdadero valor sigue siendo una entrada unica `main.js` + inline `srcdoc`；Aun retenido en el codigo fuente. render-host runtime Modulo candidato, pero cadena de ejecucion actual.、semantic-helper Con los valores de verdad de auditoria se han mantenido explicitamente como non-shipped：Rechazar el residuo `render-host.mjs` Activos/Cita, tambien puesta `createRenderHostBundleBuildOptions()` Bloquear production `esbuild.config.mjs` Fuera del camino candidate-only Estado | Una rama de respaldo posterior una vez entro en un ambito mas amplio dedicated runtime-asset canal | Volver a considerarlo como el cuello de botella arquitectonico de mayor prioridad de la linea principal actual: compensarlo verdaderamente en el futuro. build + release + audit + Antes del documento, continua poniendo el actual. source-only Escribe las decisiones con claridad. | No lo hagas porque `src/` / `scripts/` existe en runtime Codigo de candidato o candidato build options，Solo sigue adelante `render-host.mjs` Escriba que la linea principal actual ha sido enviada. | P0 |
| B. CLI / automation surface | La linea principal actual ya esta disponible. registry-backed de config/profile export/import、Desensibilizacion provider Exportar、public-surface Exportado, ingresado registry-backed typed contract de `content.split-note-by-chapters`，Y la cobertura esta limitada path-based Operacion y export Operacional repo-local maintainer help/invoke Guiones, que tambien contienen maintainer-only de `local-knowledge.inspect` retrieval introspection | La sucursal de respaldo tambien albergaba mas maintainer-bridge Supuesto, pero actualmente reintegration Permanecer deliberadamente dentro de limites estrechos | Continuar con maintainer helper Escribe los limites claramente; si alguno path-based operation Para ser promocionado a un publico mas amplio o mas CLI El contrato debe completarse con el mismo lote./prueba/Documentacion; no dejes reciente provider/settings El progreso desdibuja este limite estratificado | No escribas la habilidad actual como general. public CLI，O sin fronteras maintainer mutation API | P1 |
| C. Visible para los usuarios settings / preview / onboarding | La linea principal actual ya esta disponible. preview flows、preview history、Ventana emergente de bienvenida release digest、provider diagnostics、settings reset、concept-note Avisos de preconfiguracion、API liveness/activity UI、Para artefactos guardados preview Restaurar enlace, restaurado sidebar footer/API activity Diseno de desplazamiento y resincronizacion. `1.9.2` de release-facing version truth | Ramas de respaldo y mas UX Intento cerrar la boca, pero el corte se restablecio con el seguimiento. `1.9.2` de sidebar Correccion de observabilidad, probada nuevamente en la linea principal actual | Sigue asi sidebar / preview / settings Redaccion publicitaria、i18n、Comportamiento del artefacto guardado、footer-scroll Diseno y diseno release-facing version truth consistente | Deja de poner estos UX guardrail Escriba "falta la linea principal actual", pero no sobreestime lo que aun no se ha restaurado. UX Ideas, no confundas la correccion del diseno con CLI/runtime Cambios de limites | P1 |
| D. Regex / Filtrado de archivos / local-KB / chapter split | La linea principal actual ya esta disponible. file-selection profiles、carpeta regex/glob Deteccion、`relativePath` / `basename` Coincidencia, control de rango de subdirectorio opcional, cobertura `Generar a partir del titulo`、`Generacion por lotes a partir de titulos.`、`Investigacion y resumen`、`Generar graficos` de local-KB retrieval、Mixto Vault Archivos relativos/Ruta de la base de conocimientos de carpetas, lista de cobertura de la base de conocimientos por tarea con semantica alternativa predeterminada、chapter split、Estabilidad para titulos duplicados TOC block ref、determinista TOC front-matter metadata、manifest-backed de guarded rerun overwrite Semantica, pruebas de regresion correspondientes y generacion de titulos./Resumen de la investigacion/artifact-mode Ruta de resultados grafica machine-readable retrieval Resumen y timing/size telemetry、Para inspeccion effective path/query/context de maintainer-only retrieval inspect seam、Apoyo temporal `knowledgePaths` override Matriz de hacer ad hoc task-scoped retrieval Control y estructura. `queryDiagnostics`，y por `npm run verify:local-kb-fixtures` Expuesto y cubierto mixed file/folder task-scoped inspect case、Repetir/En blanco override、No Markdown Archivos que interfieren, carpetas irrelevantes y archivos vacios section Candidato noisy mixed-corpus scope、real-note-style chapter-split showcase retrieval、Recuperacion de contratos de tareas entre carpetas、RAG Notas de evaluacion de calidad y fuentes de navegacion con baja senal. diagnostics Abrazadera sin conexion mas amplia | La sucursal de respaldo proporciona la evidencia de recuperacion inicial; la linea principal actual ahora lleva directamente la porcion de producto limitada y la subsiguiente Stage C Resultados finales, y `1.9.2` de inspect explainability Apretar | El siguiente paso deberia ser avanzar hacia mas verdad. note/query corpus Cobertura、maintainer example Alineacion、chapter-split showcase/doc Alineacion con el cierre de la profundidad de la evaluacion basado en los contratos de mision actuales en lugar de continuar demostrando si estas capacidades “existen”” | No sigas escribiendo sobre estas habilidades como si existieran solo en backup、o live mainline Aun no disponible; no lo trates como single-title / task-scoped retrieval Dejar el contrato fuera del documento; no lo incluyas en el documento o contrato retrieval Presione hacia atras boolean-only signaling | P1 |
| E. Provider settings / model discovery | La linea principal actual ya esta disponible. metadata-driven de provider settings panel：La razon detras de esto `src/llmProviders.ts` Proporcionar campos compartidos taxonomy，Apoyo explicito core/contextual/advanced/developer Agrupacion, basada en la persistencia override de advanced auto-expand，Y para un lote de verificados OpenAI-compatible `/models` Incumplimiento (incluido LM Studio、Groq、Fireworks、Multiples proyectos en China provider、`New API`、`OVMS`）、OpenRouter Limitado chat + embedding catalog Agregacion、LiteLLM Explicito proxy-family `/models` + `/model/info` Agregacion、Together Exclusivo `/models` Respuesta、Anthropic `GET /models`、Ollama tags、Google Gemini model listing、Huawei Cloud MaaS Exclusivo `v2/models`、Vercel AI Gateway Limitado `/v1/models` + `v3/ai/config` Fusion de doble fuente、`AIHubMix` Alojamiento `/api/v1/models` registry、`GitHub Models` de `catalog/models` + `/v1/models` Descubrimiento de fuente dual、PPIO de chat + embedding + reranker Descubrimiento acotado de tres vias、OVMS Prioridad `/v3/models` Y retroceso acotado `/v1/config` descubrimiento local, y xAI de `/v1/language-models`；Google `nextPageToken` con Anthropic `has_more` / `last_id` Este tipo de paginacion registry Ahora tambien podemos realizar un recorrido acotado de varias paginas.；runtime con discovery Tambien ha convergido hacia lo compartido OpenAI-compatible header owner con endpoint normalization，Para evitar `Authorization` / `X-Api-Key` / `provider-specific compatibility header` La semantica sigue a la deriva y tolera `/responses`、`/chat/completions`、`/models` Este tipo endpoint Formulario；generic `OpenAI Compatible` Seguire usando OVMS Estilo local `/v3` Puntos finales vs. LiteLLM Estilo local proxy Rutas separadas; sin dejar de ser manual `model` Cadena como persistencia source-of-truth，compartir parser Ahora compatible object-shaped proxy catalog、nested `specification.modelId`、wrapped `provider_models` / `publisherModels` / `registry` / `services` Indice de contenidos, y `models/<id>`、`publishers/<owner>/models/<id>` Este tipo resource-style Los nombres estan normalizados y completados. gateway/provider-prefixed Acotacion del modelo token-cap guidance；Ademas, cuando generic `OpenAI Compatible` de base URL Senalando OpenAI、DashScope/Qwen、Xiaomi MiMo、Fireworks、Hugging Face Tal conocido trusted official host horas，bare model ID Ahora tambien reutilizaremos la version oficial. provider de token-cap Metadatos | Aqui no hay nada que valga la pena “restaurar” backup-branch Ya enviado; esta capacidad proviene de current-main Codigo、`.trellis/tasks/05-27-provider-settings-model-discovery/` bajado Cherry Studio Estudios comparativos y canales de implementacion del aislamiento que han sido verificados e integrados | Reduce esta pista a bounded breadth-maintenance：Continuar compartiendo family/response-shape Soporte de ampliacion semantica en lugar de retroceso provider-name Sucursal; solo en endpoint Semantica、header owner、fallback Comportamiento、token metadata Y probando/Solo amplie a mas documentos cuando sean lo suficientemente estables. provider family | No trates la corriente como limitada helper Escrito erroneamente como ya completo Cherry Studio parity、Remoto persistente model catalog、o todos provider Ambos admiten el descubrimiento de modelos.；generic `OpenAI Compatible` de bare model token ceiling Solo se puede hacer cuando se sabe trusted host Lo anterior esta escrito como el valor de verdad de la linea principal actual y no se puede expandir a ningun par. custom gateway Todo establecido | P1/P2 |
| F. Release / repo-saga / clean-state hygiene | La linea principal actual ya esta disponible. release/repo-saga Guion、repo-saga Bloqueos de ejecucion, pruebas, documentacion y artefactos locales ignorados. guardrail、chronicle refresh authorship proteger, y release assets / tags / notes / workflow tag-trigger globs / workflow-source branch / chronicle-target branch Ya entre al mismo set shared release contract；Sincronice la linea principal remota con la enviada `1.9.2` Continuar manteniendo despues clean-state Terminar la disciplina | Las ramas de respaldo impulsan estos guardrail；La linea principal actual ha restaurado la division de seguridad en serie limitada y la ha reforzado aun mas. release truth | mantener repo-saga Actualizar la disciplina serial del proceso para que release-facing truth Sea siempre coherente con el jefe de la rama naviera real, deje que workflow trigger、workflow-source con chronicle-target El valor de verdad continua por contract Bloquear y poner clean-state Demostrar como una invariante final de satisfaccion continua en lugar de volver a acumularse en una deuda que “se limpiara mas tarde” | No malinterpretes "el script todavia esta disponible" como "se puede ejecutar en paralelo". repo-saga Actualizar ruta", no dejes YAML-local trigger O sucursal bootstrap Alejamiento literal repo-owned release contracts，No vuelva a la tendencia final de “terminarlo primero, hablar de ello despues y limpiar el espacio de trabajo despues”, ni continuar usando versiones obsoletas de redaccion de valores de verdad. | P0 |

Esta ronda Batch-C Instrucciones de alineacion：

1. CLI / automation surface Los cambios se limitan a maintainer helper truth-maintenance：`local-knowledge.inspect` de help Produccion y bilinguismo capability matrix Completado con la verdad docs-vault example payload，Aun No Entro public-safe slice。
2. Regex / Filtrado de archivos / local-KB / chapter split Progreso actual de las pistas de "requiere maintainer Ejemplo de alineacion” Avance a“helper/docs/tests Corriente alineada fixture lane La verdad note/query Diversidad"; en caso de ampliacion posterior, primero se deben compensar los estados de fallo y las senales bajas query con noisy-corpus Evidencia, no aumentar el numero de tareas.。
3. No hay cambios en este lote de actualizaciones. MiniSearch retrieval algorithm、chapter split Escribe el contrato.、packaging Limite o provider control-plane；Solo reduce el riesgo de deriva entre la evidencia de prueba, los ejemplos ejecutables del mantenedor y la documentacion de progreso.。

## 4. Se ha confirmado la linea principal actual. register

Lo siguiente puede seguir describiendose con seguridad como existente en la linea principal actual：

1. packaging / semantic helper con maintainer Documentacion；
2. inline render-host Auditoria y pruebas relacionadas.；
3. provider profile export/import Superficie de mando；
4. Ventana emergente de bienvenida release digest；
5. preview artifact save/export helpers；
6. Desensibilizacion / public-safe CLI Superficie de exportacion y almacen maintainer help/invoke（Contener limites path-based Operacion）；
7. settings reset、concept-note Aviso previo、concept synonym suppression con API liveness/activity UI；
8. file-selection profiles con folder-scope regex/glob controlar；
9. local knowledge-base retrieval，Incluye generacion de titulos de archivos unicos y habilitacion basada en tareas, archivos mixtos/Ruta de origen de la base de conocimientos de carpetas, generacion orientada a titulos, resumen de investigacion y artifact-mode Ruta de resultados grafica machine-readable retrieval Resumen, para inspeccion effective path/query/context de maintainer-only `local-knowledge.inspect` seam、Utilizado para ad hoc task-scoped Inspeccion temporal `knowledgePaths` override Matrices y `npm run verify:local-kb-fixtures` Este articulo ahora esta cubierto. mixed file/folder task-scoped inspect case、noisy mixed-corpus scope、real-note-style chapter-split showcase retrieval、chapter-split showcase Fuera de la realidad note/query Diversidad y helper/docs/tests Sea fiel al mismo lote docs-vault example payload Alineacion；
10. chapter split（Incluyendo repeated-heading-safe TOC block ref、determinista TOC front-matter metadata con guarded rerun overwrite Semantica）；
11. package metadata、welcome digest、README family、change log con release-note artifacts Sube a la actualidad `1.9.2` de release-facing version truth；
12. transport-driven provider registry Crecimiento y OpenAI-compatible base-URL normalization、`models-then-chat` probing Esperando conexiones para probar la semantica sin dejar de ser manual model Ingrese como live configuration truth；
13. Se ha implementado la linea principal actual. schema-driven provider-settings field grouping、Basado en la perseverancia advanced Expansion automatica de valores, y actualmente acotada. family Lote in-plugin provider model discovery suggestions，Incluye OpenAI-compatible（Incluyendo LM Studio、Multiples proyectos en China provider、Groq、Fireworks、`New API`、`OVMS`）、OpenRouter、LiteLLM proxy-family、Together、Anthropic、Ollama、Google、Huawei Cloud MaaS、`AIHubMix`、`GitHub Models`、`PPIO`、Vercel AI Gateway con xAI；
14. Se ha implementado la linea principal actual. host-aware token-cap guidance：generic `OpenAI Compatible` en base URL Senalar lo conocido trusted official host Cuando, permitir bare model ID Reutilizar aguas arriba provider Salida conocida de token ceiling；manuales typed model change Todavia se puede avanzar en la situacion general. auto-managed baseline，y transient discovered-model max-output-token hint entonces solo conduce provider-scoped La salida de Token Limite de cobertura autofill，No reescribira silenciosamente la situacion global. `Max tokens`。

Lo siguiente debe actualmente describirse como **No se ha demostrado que exista en la linea principal reescrita.**：

1. enviado dedicated runtime assets；
2. Mas alla de los limites actuales path-based helper Fronteras mas amplias maintainer mutation surface；
3. Cualquier derivacion de la actual entrada unica `main.js` + inline `srcdoc` Valor verdadero dedicated-runtime Narracion；
4. Ya existe persistencia en la linea principal actual. provider model catalog o Cherry Studio Estilo model CRUD El termino subsistema；
5. La linea principal actual ha cubierto todos provider de remote model discovery，O cualquiera custom gateway Todos tienen automaticamente descubrimiento de modelo autorizado.、token metadata con provider ownership Afirmaciones sobre la capacidad de inferencia。

## 5. Secuencia de ejecucion unica

A menos que haya una regresion que interrumpa la secuencia actual：

1. **P0**：mantener packaging / semantic La linea principal actual es veraz y honesta.
2. **P0/P1**：Ampliar en el futuro packaging Antes de narrar, continua resguardando explicitamente latent render-host runtime source de candidate-only production-build guard
3. **P1**：Mantenga los limites CLI / maintainer-surface Despues de que el valor verdadero converja y la prueba sea suficiente, decida si hay path-based operation Adecuado para acotados public Promocion
4. **P1**：Pase mas ancho corpus Evaluacion y evaluacion maintainer Alinear ejemplos y seguir profundizando file-selection、local-KB、chapter split La calidad de, en lugar de reabrir, el argumento de la “existencia funcional”
5. **P1/P2**：Pon lo que ha aterrizado provider-settings/model-discovery control plane A medida que la pista de mantenimiento continua cerrandose, solo mediante shared-core La semantica continua expandiendose. family
6. **P1**：Mantenga visibles a los usuarios restaurados settings / preview guardrails En codigo、i18n、Documentacion y `1.9.2` release-facing version truth Coherencia entre
7. **P0**：poner repo-saga Serie guardrail con clean-state La prueba continua con cada lote. finish criteria

## 6. Reglas de sincronizacion de documentos.

Cada vez que toques cualquier pista, al menos sincroniza el check：

1. `change.md`
2. Temas correspondientes brainstorm Documentacion
3. Esta matriz
4. Si se trata de automation/verification Redaccion publicitaria, luego revisa el correspondiente maintainer Documentacion

## 7. Verificar el control de acceso

Cualquier cambio que actualice la sentencia de este articulo debera terminar con los siguientes resultados：

1. `npm run build`
2. `npm test -- --runInBand`
3. `npm run audit:i18n-ui`
4. `npm run audit:render-host`
5. `git diff --check`
6. clean de `git status --short --branch`
