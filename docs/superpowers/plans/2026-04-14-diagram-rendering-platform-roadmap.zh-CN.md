# Notemd Hoja de ruta de la plataforma de renderizado de graficos

> **Al agente albacea：** Debe usar `superpowers:subagent-driven-development`（Recomendado) o `superpowers:executing-plans`，Implementar este plan paso a paso segun las tareas. Pasos para seguir usando casillas de verificacion `- [ ]` Seguimiento gramatical。

## 2026-05-02 Actualizacion de progreso

notebook-navigator Todos los patrones de referencia cruzada completados.（4/5 Implementado，1 Extension del articulo）。
8 Las intenciones de los graficos se han pasado en tiempo real. API Verificacion。README Se ha agregado la prueba del contrato de alineacion.（121 articulos）。
Ventana emergente de bienvenida + Apoyo del patrocinador + Cline Fichas de alineacion + Normalizacion de bordes entregada。

Seguimiento: integracion de la superficie de comando, empaquetado en tiempo de ejecucion。

## 2026-05-03 Correccion de la realidad

arriba“8 Las intenciones de los graficos se han pasado en tiempo real. API Se entendera por “verificacion” la**Una evidencia de verificacion historica local.**，En lugar de un umbral controlado para la ejecucion sostenible dentro del almacen actual. Relacionado live test El expediente ya esta en `92d3ad3` Se alejaron de la linea principal porque dependen de los locales. vault Rutas, claves reales y llamadas de red no deterministas.。

Tambien debe quedar claro：

- remoto `main` Actualmente no existe ningun comun push/PR CI；`.github/workflows/release.yml` Solo en numeros tag push o `workflow_dispatch` Al correr
- `commits/main/status` Actualmente regresara `pending` Y no hay status，Al mismo tiempo `main` Ninguno branch protection，No existe un nivel de sucursal ordinario required checks；Pero lo mismo `main@09ef239` commit Montado exitosamente release Camino `check_suite` / `check_run`，Lo real aqui CI Aun se deben observar las senales Actions runs Con checks
- exitoso `1.8.3` Reparacion run una vez recordado GitHub Oficial Node 20 JavaScript-action Las alertas estan obsoletas y actualmente `1.8.4` exito run Probado `actions/checkout@v6` Con `actions/setup-node@v6` Hay caminos de endurecimiento disponibles.
- El tiempo de ejecucion aun es compatible 8 Este diagrama esta pensado, pero UI El selector de graficos preferido actualmente solo expone subconjuntos；`mindmap` Con `canvasMap` Actualmente no es un elemento de exposicion por defecto
- `preview-experimental-diagram` Para los salvos `vega-lite` fenced artifact Se cambio a vista previa local, por lo que la superficie de comando todavia esta "parcialmente completada" en lugar de "completamente cerrada".”
- Drawnix Deben utilizarse como limites de datos. / Convierta la referencia del limite en lugar del host para que se incruste como un todo en el siguiente paso; ver para mas detalles `docs/brainstorms/2026-05-03-drawnix-feasibility-and-integration-direction.zh-CN.md`。completo Drawnix La incorporacion de host no forma parte del lote de hoja de ruta actual。

## 2026-05-08 Actualizaciones de endurecimiento posteriores

- semantic verification helper Ahora empezara desde `esbuild.config.mjs` Extraer automaticamente la entrada del embalaje./Salida de los hechos; si el analisis falla, se generara un mensaje de marcador de posicion explicito。
- Pruebas de regresion bloqueadas helper El resultado es coherente con el formulario de configuracion de compilacion actual para evitar packaging-boundary Deriva silenciosa del valor de verdad。
- `repo-saga` Actualizacion de cronica fallback Ahora volvera a intentarlo candidato por candidato cuando falle la ejecucion. package-manager corredor（`pnpm`、`corepack pnpm`、`bun x pnpm`），Para reducir CI Vulnerabilidad。
- semantic helper El analisis se ha reforzado aun mas contra la desviacion de configuracion comun: soporte para literales de acento grave y seguimiento explicito del estado del objetivo de salida.（`outfile` / `outdir` / `unknown` / `ambiguous`），Y darle prioridad a `esbuild.context({...})` Analisis dentro de bloques de opciones para evitar los mismos nombres decoy Colision de campo。
- helper Tambien agregado Stage B de packaging Verificacion de la verdad del contrato：release Activos requeridos de `scripts/release/publish-github-release.js` Extraccion sincronica, bilingue. release notes Las restricciones de archivos tambien ingresan a la lista de generacion y el numero tag Con create/upload Schema tambien se convierte en un control contractual explicito, y desde `.github/workflows/release.yml` Verificacion tag-only workflow Proteccion del gatillo。
- helper Tambien agregado Stage B Verificacion de la verdad de los limites de la promocion del contrato: desde `src/operations/registry.ts` Extraccion workflow/settings/export Restricciones de operacion de proximidad y convertidas en lineas de lista explicitas。
- La siguiente linea de trabajo activa permanece sin cambios: primero continuar manteniendo este conjunto de alineacion de valores verdaderos y luego heavy-runtime packaging isolation”Con “Seguimiento contract-promotion Elija la siguiente etapa entre "rebanar"。

Comparacion en profundidad e instrucciones de implementacion del siguiente paso：
- `docs/brainstorms/2026-05-08-packaging-semantic-convergence-progress-and-next-steps.zh-CN.md`

---

**Metas：** voluntad Notemd De“LLM Generacion directa Mermaid La ruta unica de "texto y parches posteriores" se actualiza a "reconocimiento de intencion grafica" + Especificaciones intermedias + Renderizado especializado + Plataforma grafica extensible para “salida multiformato”, en Obsidian Soporte internamente estable para mas tipos de imagenes y graficos。

**Arquitectura：** Adopte una arquitectura de cuatro niveles：`Intent Plane` Responsable de identificar expresiones graficas mas adecuadas para las notas.；`Spec Plane` deja LLM Estructuracion de la produccion `DiagramSpec` En lugar de generar la gramatica directamente；`Adapter Plane` Responsable de la generacion, verificacion y reparacion minima de diferentes formatos de destino.；`Rendering Plane` Proporcionar capacidades especializadas de host de renderizado, cache, vista previa, temas y exportacion. El plan evita intencionadamente `markdown-viewer` Copia todo Notemd，En lugar de ello, absorbelo registry/host/cache Piensa y presiona Obsidian Las restricciones de los complementos se implementan progresivamente.。

**Pila de tecnologia：** TypeScript、Obsidian Plugin API、Mermaid、Jest、ESLint、esbuild、Basado en iframe Representacion del anfitrion、JSON Canvas、Vega-Lite、SVG/HTML Enlace de vista previa


### notebook-navigator Referencia de diseno (analisis cruzado）

[notebook-navigator](https://github.com/johansan/notebook-navigator) (v2.5.6) Es un complemento de navegador de notas con un modo de ingenieria solido. Se identificaron cinco elementos. v1.8.2 El angulo de mejora final：

1. **traer DI capa de servicio** — NotEMD Los archivos de herramientas monoliticas pueden beneficiarse de la descomposicion del servicio. baja prioridad。
2. **LLM Almacenamiento en cache de respuestas** — Presione (provider, model, prompt hash, content hash) Claves de almacenamiento en cache LLM Responde a bajar API Costo. prioridad media。
3. **Configure el interruptor de sincronizacion elemento por elemento** — Proveedores permitidos API Las claves permanecen locales en el dispositivo mientras se sincronizan las configuraciones del flujo de trabajo. bajo-Prioridad media。
4. **Canalizacion por lotes con recuperacion** — El procesamiento por lotes se estructura en etapas de tramitacion con un seguimiento de la finalizacion de cada archivo. prioridad media。
5. **Documento de descripcion general de la arquitectura** — Diagrama de arquitectura del sistema de una sola pagina. baja prioridad。

Para un analisis completo ver `docs/brainstorms/2026-05-01-llm-backward-compat-and-progress-audit.zh-CN.md`。Todo sin bloqueo v1.8.2。

---

## Estado de ejecucion（2026-04-14）

La hoja de ruta es ahora mas que un simple “plan a implementar””。`main` Ya aterrice diagram domain model、spec-first Generar、Mermaid subtype adapters、renderer registry/service、JSON Canvas、Vega-Lite、preview/export、theme/i18n Se esperan competencias basicas, pero el estado del documento no se mantiene actualizado en el tiempo, lo que facilmente puede llevar a dos tipos de errores de juicio.：

- Trate las capacidades existentes como si aun no se hubieran iniciado y repita el diseno.
- Ponlo quieto experimental / partial Los limites del estado se consideran capacidades completadas, lo que induce a error en versiones posteriores y valoraciones arquitectonicas.

El objetivo de esta actualizacion no es reescribir la direccion, sino roadmap Conviertete en un “documento de progreso real” + Proximo lote de controladores de propulsion.”。

## Interpretacion a largo plazo（2026-05-03）

Esta hoja de ruta ahora deberia leerse en tres capas.：

- **Base de plataforma entregada**：Tareas 1、4、5、Tareas 6 La mayoria de las tareas 7 neutralizar release/export Las bases pertinentes ya existen en `main`。
- **Trabajo de madurez aun activo**：Tareas 0 Los limites y tareas restantes del embalaje 2 Cierre superficial de comandos y tareas. 3 de legacy La reduccion de los limites sigue siendo la agenda principal del proyecto actual.。
- **Opciones de futuro mas lejano**：Tareas 8 y cualquier Drawnix cerca board export El trabajo es una eleccion posterior, no la deuda actual.。

Este nivel de interpretacion es importante porque cambia el significado estrategico de este documento: el producto ahora no necesita iniciar una ronda de "construccion de nueva plataforma de graficos", pero requiere una ronda de "estabilizacion de plataforma y refuerzo de limites".”。

Phase-2 Resumen de requisitos：

- `docs/brainstorms/2026-04-14-diagram-platform-phase-2-requirements.md`
- `docs/brainstorms/2026-05-03-mainline-stabilization-and-ci-hardening-requirements.zh-CN.md`


## 2026-05-01 LLM Robustez de las llamadas y mejora del campo del borde del grafico

### Cline Procesamiento de tokens de salida de modelo desconocido alineado

`resolveProviderTokenLimit` Ahora usa el modelo desconocido con Cline Comportamiento consistente: cuando el global `maxTokens` es el valor predeterminado（8192）Y el modelo no esta `KNOWN_MODEL_MAX_OUTPUT_TOKENS` Cuando esta en la tabla, el sistema regresa `undefined` —— Por API A exclusivo criterio del proveedor. Esto reemplaza el paso ciego anterior de modelos desconocidos. 8192 comportamiento. Definido por el usuario para modelos desconocidos `maxTokens` Los valores permanecen sin cambios (compatibilidad con versiones anteriores）。

Ambito de influencia: Todos 5 tiempos de ejecucion de transferencia（OpenAI-compatible、Anthropic、Google、Azure OpenAI、Ollama）。

### Normalizacion del campo del borde del grafico

`diagramSpecResponseParser.ts` en `normalizeSpec` Ahora maneja multiples convenciones de nomenclatura de campos de borde（`source`/`target`、`sourceId`/`targetId`、`start`/`end` → `from`/`to`），hacer LLM Diferencias en la produccion JSON Los nombres de los campos se pueden analizar correctamente.。`buildDiagramSpecPrompt` Ahora se dan instrucciones claras. LLM uso `from`/`to` Nombre del campo。

### Verificacion historica en tiempo real

Antes DeepSeek La verificacion del enlace en vivo ahora deberia considerarse evidencia local historica en lugar de una superficie de prueba que aun se mantiene en un almacen. Relacionado live test El archivo ya no esta `main` Arriba, la documentacion actual ya no deberia implicar `src/tests/liveChainTest.test.ts` Sigue siendo una puerta de ejecucion sostenible。

### Compatibilidad con versiones anteriores

Todas las configuraciones de proveedores, protocolos de transporte e interfaces de configuracion existentes permanecen sin cambios. La unica diferencia de comportamiento para los usuarios: use el valor predeterminado `maxTokens`（8192）El modelo desconocido de ahora viene dado por API El proveedor determina el limite superior a su propia discrecion y ya no esta limitado a 8192。Nivel de proveedor maxOutputTokens La cobertura sigue estando limitada por un limite superior del modelo conocido。

---

### Instantanea actual

| Tareas | Estado | Realidad actual |
|---|---|---|
| Tareas 0 | Entregado, pero se indican limitaciones | `src/rendering/webview/*` Con `src/rendering/host/iframeRenderHost.ts` Ya implementado, continue usandolo en linea `srcdoc` Planificar；`scripts/audit-render-host-bundle.js`、release workflow Ya combinado con prueba unica.“render host Debe ser `main.js` Autonomo y portatil” smoke gate Curar, pero `esbuild.config.mjs` Todavia de entrada unica, cierto heavier-runtime isolation Aun no terminado。 |
| Tareas 1 | Entregado | `DiagramIntent`、`DiagramSpec`、validator、planner Las reglas de inferencia de intencion han entrado en la linea principal y estan cubiertas por pruebas unicas.。 |
| Tareas 2 | Parcialmente completado (restricciones estrictas） | spec-first prompt Con service pipeline Ya implementado，`src/main.ts`、`src/ui/NotemdSidebarView.ts` Con `src/operations/diagramCommandHostAdapter.ts` Ahora se ha cambiado a aprobado. canonical Entrada interna（`generateDiagramCommand`、`previewDiagramCommand`、`runPreviewDiagramCommandWithHost`）Cierre el enlace de generacion de graficos y vista previa.。workflow/sidebar action metadata Tambien se ha reducido a canonical action ID（`generate-diagram`、`preview-diagram`），Y el viejo `*-experimental-diagram` action token Solo se utilizan como alias compatibles para normalizarse durante la fase de analisis. Las pistas duales restantes ahora se reducen principalmente al periodo de compatibilidad. public command ID Siga bifurcando con redaccion publicitaria, no con cadenas de ejecucion internas.。**Restricciones duras：** `promptUtils.ts` Version antigua en Mermaid Las palabras clave estan especialmente adaptadas a la escena original. Cualquier expansion o retiro debe preservar completamente la usabilidad de la escena original. La estabilidad entre versiones tiene prioridad sobre la limpieza。 |
| Tareas 3 | Parcialmente completado (restricciones estrictas） | Mermaid subtype adapters Con `mermaid.parse` Se ha implementado la verificacion.，flowchart pipe-label escaping Avanzo adapter emit，legacy note directive parsing / edge-attachment / note-node formatting Con un lote edge-label merge/quote/rewrite helper Tambien ha comenzado a hundirse `src/diagram/adapters/mermaid/legacyFixerUtils.ts`；Pero `src/mermaidProcessor.ts` Todavia asumiendo muchas tareas legacy fixer Responsabilidad，adapter-driven fixer Division no completada。**Restricciones duras：** Cada subtarea debe ser real Obsidian Solo se puede avanzar despues de una verificacion independiente en el ejemplo. Las imagenes de salida del grafico deben guardarse, revisarse y verificarse para que esten completas y correctas. Las pruebas unitarias por si solas no son suficientes para cruzar el limite de ninguna subtarea。 |
| Tareas 4 | Entregado | renderer registry/service、cache、inline host、iframe preview session Unificacion preview modal Ya implementado。 |
| Tareas 5 | Entregado | `.canvas` Salida, conceptos basicos deterministic layout、Se ha implementado el enlace para guardar y obtener una vista previa.。 |
| Tareas 6 | Entregado, pero se indican limitaciones | Vega-Lite La vista previa ahora ha cambiado a Aprobada. iframe host Iniciar y combinar target-specific sandbox Con `srcdoc` bootstrap Camino. El limite restante ya no es la ruta de vista previa, sino el limite del paquete: en la tarea 0 Implementar entradas multiples reales host Antes de la estrategia de activos, el tiempo de ejecucion aun pasa por el principal. bundle bridge proporcionar。 |
| Tareas 7 | Entregado, pero se indican limitaciones | Tema、locale、SVG/PNG/source export Alinear el codigo actual con la matriz del documento.；HTML Los objetivos siguen siendo solo promesas iframe fallback preview Con raw source save。release workflow Tambien anadido `actions/checkout@v6` Con `actions/setup-node@v6` de action pin，Evite llevar consigo la version anterior Node 20 JavaScript-action Advertencia de obsolescencia。 |
| Tareas 8 | Posponer por diseno | Avanzado DSL / renderer La evaluacion debe seguir posponiendose。 |

### Agenda de mediano plazo despues de la validacion cruzada

Alinear esta hoja de ruta con el codigo actual, las pruebas y 2026-05-03 Despues de la verificacion cruzada de la documentacion de auditoria, la verdadera agenda de mediano plazo se puede reducir a cuatro cosas：

1. Sin destruir legacy Bajo la premisa del comportamiento canonical Superficie de comando del grafico
2. Permitir continuamente que los mantenedores registrados realicen una verificacion semantica local. helper/runbook Con verdad renderer Alinear la evidencia conductual y publicada
3. De la entrada unica actualmente aplicada `main.js` + `srcdoc` host A partir del contrato, continue reforzando el aislamiento real del empaque de tiempo de ejecucion pesado solo despues de que el producto construido realmente demuestre mas limites.
4. Para el futuro CLI Extraccion de escalabilidad independiente del host operations，En lugar de vincular directamente los comandos de complementos existentes ID
5. Despues de completar los cuatro elementos anteriores, restaure legacy prompt Jubilacion y MermaidProcessor Reduccion de personal

La "verificacion semantica local del mantenedor" en esta agenda de mediano plazo ya no es un tema hipotetico.：`npm run verify:diagram-semantics`、`docs/maintainer/diagram-semantic-verification*.md` Alineado con release-workflow Se ha registrado la redaccion. Mas alla de eso, todo lo demas se ha entregado o es una opcion de reenvio.。

## CLI Correccion de realidad extendida（2026-05-04）

El almacen necesita ahora una correccion de la realidad: el futuro CLI La escalabilidad es, en primer lugar, una cuestion de refuerzo de los limites, no una cuestion de denominacion de los comandos.。

- Mantener la envoltura estable en la maquina. `obsidian-cli` Todavia depurando/Entrada al escritorio, pero la capa inferior es oficial. `obsidian` CLI Ya admito listar y ejecutar comandos de registro de complementos。
- Notemd Ya existe algo mejor que lo existente UI La capa de comando es mas adecuada para el futuro. CLI La planta baja de seam：provider diagnostics、diagram generation core、workflow/action metadata、batch progress Persistencia y `localOnly` Este tipo config/profile Semantica。
- Por lo tanto, el siguiente lote CLI El trabajo relacionado no puede detenerse en sidebar actions o complementos command IDs Expuesto como terminal publica API，En lugar de eso, comienza con `src/main.ts` Extraer el host no tiene nada que ver operations，De nuevo en el original command-trigger Defina contratos de llamadas escritas encima de la capa.。

### Indice de evidencia

- spec-first Capa de dominio：
  - `src/diagram/types.ts`
  - `src/diagram/intent.ts`
  - `src/diagram/spec.ts`
  - `src/diagram/planner.ts`
  - `src/diagram/diagramGenerationService.ts`
- Mermaid Adaptador de subtipo：
  - `src/diagram/adapters/mermaid/mindmapAdapter.ts`
  - `src/diagram/adapters/mermaid/flowchartAdapter.ts`
  - `src/diagram/adapters/mermaid/sequenceAdapter.ts`
  - `src/diagram/adapters/mermaid/classAdapter.ts`
  - `src/diagram/adapters/mermaid/erAdapter.ts`
  - `src/diagram/adapters/mermaid/stateAdapter.ts`
  - `src/diagram/adapters/mermaid/validator.ts`
- Plataforma de renderizado：
  - `src/rendering/rendererRegistry.ts`
  - `src/rendering/rendererService.ts`
  - `src/rendering/cache/renderCache.ts`
  - `src/rendering/host/inlineRenderHost.ts`
  - `src/rendering/host/iframeRenderHost.ts`
  - `scripts/audit-render-host-bundle.js`
  - `.github/workflows/release.yml`
  - `src/ui/DiagramPreviewModal.ts`
- No Mermaid Metas：
  - `src/diagram/adapters/canvas/canvasAdapter.ts`
  - `src/diagram/adapters/vega/vegaLiteAdapter.ts`
  - `src/rendering/renderers/jsonCanvasRenderer.ts`
  - `src/rendering/renderers/vegaLiteRenderer.ts`
  - `src/rendering/renderers/htmlRenderer.ts`
- Documentacion y pruebas que han limitado el comportamiento actual.：
  - `src/tests/diagramGenerationService.test.ts`
  - `src/tests/diagramGenerationFallbacks.test.ts`
  - `src/tests/canvasAdapter.test.ts`
  - `src/tests/vegaLiteAdapter.test.ts`
  - `src/tests/rendererService.test.ts`
  - `src/tests/diagramPreviewModal.test.ts`
  - `src/tests/previewExport.test.ts`
  - `src/tests/diagramDocsContract.test.ts`
  - `src/tests/renderHostBundleAuditScript.test.ts`

## ¿Por que es necesario este plan?

Actualizar instrucciones（2026-04-14）：

Esta parte conserva el empujon inicial diagram platform Juicio de la causa fundamental de la transformacion, pero la situacion actual ya no es que “estas capacidades no existen en absoluto”, sino que “las capacidades basicas se han implementado y las deficiencias restantes se concentran en legacy Caminos, cierres de mando y runtime boundary”。La siguiente sentencia debe entenderse referida a las presiones arquitectonicas que aun existen, mas que a `main` Negacion total del status quo。

El cuello de botella de la implementacion actual no es "muy pocos tipos de graficos compatibles", sino los limites incorrectos de responsabilidades.：

- `src/main.ts` Seguir llevando simultaneamente legacy Mermaid Enlace、experimental diagram Enlaces, registro de mando y UI Arreglo，diagram domain Ya existe, pero aun no se ha extraido realmente de la entrada del complemento.。
- `src/promptUtils.ts` en legacy Mermaid prompt Todavia fuerce la salida a estar vinculada a `mindmap`，Aunque spec-first La ruta ha evitado este problema, pero la capa de comando aun no se ha cerrado completamente a la nueva ruta.。
- `src/mermaidProcessor.ts` Ha evolucionado hasta convertirse en un parche gigante, lo que indica que el sistema esta compensando la complejidad del posprocesamiento. prompt Modelado insuficiente。
- El metodo de construccion actual todavia tiene solo una `main.js` Salida，`esbuild.config.mjs` No hay planes para otros mas pesados en el futuro. iframe/webview Activos、worker O renderizar recursos estaticos para establecer una estrategia de empaquetado clara.。

Si continuas con la frase “Escribe algunos mas prompt + Agrega algunos mas regex Reparacion + Si avanzamos en la direccion de "soportar varias sintaxis nuevas", la complejidad aumentara linealmente y la estabilidad disminuira exponencialmente.。

---

## Producto Estrella del Norte

Notemd Las capacidades graficas deberian servir para tres escenarios principales, en lugar de perseguir "cuanto mas larga sea la lista de formatos compatibles, mejor".”：

1. Comprension estructural
Convierta articulos extensos, notas de investigacion y soluciones tecnicas en diagramas estructurales adecuados para navegar y revisar.。

2. Organizacion del conocimiento
Colocar conceptos, asociaciones, causalidades, jerarquias y relaciones organizativas espaciales en la forma adecuada. Obsidian Vector editable de flujo de trabajo。

3. Expresion de datos
Cuando las notas contengan indicadores, series temporales, comparaciones y distribuciones, genere graficos en lugar de obligarlos a hacerlo. Mermaid。

Corresponde a la capacidad，Notemd Lo que se necesita es "capacidad de enrutamiento de formato", no "capacidad de enrutamiento unico". Mermaid Capacidades de apilamiento”。

---

## Limitaciones actuales en el almacen.

### Codificar la realidad

- `src/main.ts`
  Registro de comando de portador actual y orquestacion de servicios.、legacy Mermaid Proceso y experimental diagram El archivo de proceso es demasiado grande y no es adecuado para diagram Largo plazo de la plataforma orchestration Entrada。
- `src/fileUtils.ts`
  Tambien responsable de la conservacion de archivos.、Mermaid Reparacion, procesamiento por lotes y movimiento de archivos de errores, se han cruzado responsabilidades。
- `src/mermaidProcessor.ts`
  Reunidos Mermaid Deteccion, reparacion, limpieza de sintaxis, profundidad. debug Una gran cantidad de logica debe dividirse en adapter Adentro validator/fixer。
- `src/promptUtils.ts`
  legacy prompt Aun vincular el formato de destino de salida directamente；spec-first prompt Ya existen, pero todavia existen dos conjuntos de enlaces en paralelo.。

### Construir la realidad

- `esbuild.config.mjs`
  Empacar solo `src/main.ts -> main.js`，Sin copia de recursos estaticos、iframe Generacion de paginas o estrategias de entrada multiple。
- `manifest.json`
  Actualmente Universal Movil/Los complementos de escritorio no deben introducir capacidades graficas que solo se puedan ejecutar en el escritorio sin una ruta de degradacion.。

### Pon a prueba la realidad

- Jest El sistema de prueba unica ya existe, por lo que conviene hacerlo primero. domain model、adapter、service Prueba de nivel。
- Lo que falta actualmente no es el marco de prueba, sino los limites de la capacidad de prueba. En la situacion actual Mermaid El acoplamiento entre generacion, reparacion y ahorro es demasiado profundo, lo que dificulta medir los resultados pero no las responsabilidades.。

---

## Resumen de decisiones arquitectonicas.

### Toma de decisiones 1：Construye primero `DiagramSpec`，Deja de ceder LLM Genere directamente la sintaxis de renderizado final.

Se recomienda introducir una representacion intermedia unificada.：

- `DiagramIntent`
- `DiagramSpec`
- `RenderTarget`
- `RenderArtifact`

`DiagramSpec` Al menos cubrir：

- title
- summary
- nodes
- edges
- sections
- callouts
- dataSeries
- layoutHints
- sourceLanguage
- outputLanguage
- evidenceRefs

Razones：

- La “comprension del contenido” y la “gramatica del formato de destino” se pueden desacoplar。
- puede ser Mermaid、Canvas、Vega-Lite Reutilizar la misma entrada semantica。
- Puede avanzar la verificacion a la capa de estructura en lugar de esperar a que se genere la cadena antes de llenar los agujeros.。

### Toma de decisiones 2：Hazlo primero `RendererRegistry + RenderHost`，No apile directamente motores de terceros

Capacidades minimas de plataforma recomendadas：

- `RendererRegistry`
- `RendererService`
- `RenderHost` interface
- `InlineRenderHost` o `IframeRenderHost`
- `RenderCache`

Razones：

- Cuando no hay un host unificado, la compatibilidad con multiples formatos solo se reducira a "generar texto de diferentes bloques de codigo" y no se podra obtener una vista previa, exportar, almacenar en cache ni unificar con temas.。
- `markdown-viewer-extension` De lo que realmente vale la pena aprender es renderer registry、host abstraction、theme y cache，En lugar de “soportar mas de una docena de formatos” en si。

### Toma de decisiones 3：La primera ola de objetivos ambiciosos no es PlantUML，En lugar Mermaid Subtipos + JSON Canvas + Vega-Lite

Las prioridades son las siguientes：

| Prioridad | Metas | Razones | Observaciones |
|---|---|---|---|
| P0 | Mermaid Multiples subtipos | La cognicion y las dependencias existentes de los usuarios estan aqui; es el punto de beneficio con el menor coste de migracion. | Ponlo primero `mindmap` Resolucion exclusiva de problemas |
| P1 | JSON Canvas | Obsidian Formato de activo nativo; Mas adecuado para graficos de conocimiento y organizacion espacial. | No se requiere tiempo de ejecucion de renderizado pesado adicional |
| P1 | Vega-Lite | Medio de expresion correcto para notas numericas y comparativas. | Requiere especializacion chart adapter y vista previa |
| P2 | HTML/SVG infographic | Bueno para tarjetas de resumen、KPI、Senales de trafico | Alto valor, pero debe estar respaldado por capacidades tematicas y de exportacion. |
| P3 | PlantUML / Graphviz / Draw.io | Gran sintaxis, grandes dependencias y altos costos de mantenimiento. | Retrasar la evaluacion hasta que madure la plataforma de renderizado. |

### Toma de decisiones 4：El host de renderizado tiene prioridad `iframe host`，Pero basado en envases progresivos

Ruta sugerida：

- Fase 1 permitida `InlineRenderHost` Solo sirve Mermaid y locales SVG Vista previa。
- Definicion de unidad al mismo tiempo. `RenderHost` Interfaz para evitar refactorizar a la persona que llama en el futuro.。
- Vuelve la segunda etapa `IframeRenderHost` Compromiso Vega-Lite、HTML/SVG Tarjetas de informacion y logica de renderizado frontal mas pesada.。

Razones：

- El sistema constructivo actual no es apto para completarse por completo una vez iniciado. worker/offscreen Sistema。
- `iframe host` Es suficiente aislar la mayoria de las dependencias de renderizado front-end y esta mas cerca de Obsidian Restricciones realistas de los complementos。
- No se recomienda copiar en un solo paso. `markdown-viewer` Complejidad de multiples direcciones。Notemd Actualmente no existe necesidad ni limite de codigo.。

---

## Diseno del modulo de destino

Se recomienda agregar o dividir los siguientes limites：

- `src/diagram/types.ts`
- `src/diagram/intent.ts`
- `src/diagram/spec.ts`
- `src/diagram/planner.ts`
- `src/diagram/prompts/diagramSpecPrompt.ts`
- `src/diagram/validators/specValidator.ts`
- `src/diagram/adapters/mermaid/base.ts`
- `src/diagram/adapters/mermaid/mindmapAdapter.ts`
- `src/diagram/adapters/mermaid/flowchartAdapter.ts`
- `src/diagram/adapters/mermaid/sequenceAdapter.ts`
- `src/diagram/adapters/mermaid/erAdapter.ts`
- `src/diagram/adapters/mermaid/validator.ts`
- `src/diagram/adapters/canvas/canvasAdapter.ts`
- `src/diagram/adapters/vega/vegaLiteAdapter.ts`
- `src/rendering/types.ts`
- `src/rendering/rendererRegistry.ts`
- `src/rendering/rendererService.ts`
- `src/rendering/cache/renderCache.ts`
- `src/rendering/host/renderHost.ts`
- `src/rendering/host/inlineRenderHost.ts`
- `src/rendering/host/iframeRenderHost.ts`
- `src/rendering/webview/index.html`
- `src/rendering/webview/bootstrap.ts`
- `src/rendering/webview/renderFrame.ts`
- `src/ui/DiagramPreviewModal.ts`
- `src/ui/components/diagramPreviewToolbar.ts`

Documentos antiguos que proponen una reduccion gradual de la responsabilidad：

- `src/main.ts`
- `src/fileUtils.ts`
- `src/mermaidProcessor.ts`
- `src/promptUtils.ts`

---

## Plan de ejecucion

### Tareas 0：Bases de construccion y embalaje para renderizado dedicado.

**Documentacion：**
- Host de tiempo de ejecucion existente：`src/rendering/webview/contract.ts`
- Host de tiempo de ejecucion existente：`src/rendering/webview/page.ts`
- Host de tiempo de ejecucion existente：`src/rendering/webview/renderFrame.ts`
- crear：`scripts/audit-render-host-bundle.js`
- Modificacion：`package.json`
- Modificacion：`.github/workflows/release.yml`
- Pruebas：`src/tests/renderHostBundleAuditScript.test.ts`

**Estado：** Entregado, pero se indican limitaciones

Actualmente aprobado `src/rendering/webview/contract.ts`、`src/rendering/webview/page.ts`、`src/rendering/webview/renderFrame.ts` y `src/rendering/host/iframeRenderHost.ts` Creado en linea `srcdoc` preview host。En otras palabras, el problema de "como el complemento transporta la pagina renderizada" todavia pasa por el problema principal. bundle incrustado HTML En lugar de resolver copiando activos estaticos adicionales。

Este lote de trabajo ha compensado lo que realmente falta. smoke gate：`scripts/audit-render-host-bundle.js` Auditara directamente lo construido `main.js`，Requisitos bundle Aun retenido en `htmlSrcdoc`、`Notemd Render Host`、`notemd-render-shell` y `notemd-html-preview-theme-shim` Espere a que aparezcan los marcadores clave y nieguese a aparecer. `rendering-webview/index.html` Me gusta externo render-host Dependencia de activos；`.github/workflows/release.yml` Esta auditoria tambien ha sido incluida en el release gate。

Las restricciones restantes siguen vigentes.：`esbuild.config.mjs` Todavia hay una entrada unica, actualmente smoke gate Lo que si esta demostrado es que “las `srcdoc` host Continuar por `main.js` "Autonomo, portatil y no degenerado" no es "ya verdaderamente independiente" heavier runtime bundle Estrategias de empaquetado, instalacion y entrega para publicar activos por separado”。

- [x] Representar claramente la convencion del catalogo de activos para evitar posteriores HTML、JS、CSS Dispersos en el directorio raiz del complemento.。
- [x] Construir solidificacion para la produccion. render host de bundle Metodo de portabilidad para garantizar que la pagina de vista previa siga siendo `main.js` Publicacion autonoma。
- [x] Crea un minimo smoke Pruebe y verifique que el producto creado contenga la pagina renderizada y los scripts necesarios.。

**Toma de decisiones：**

- Obsidian Complemento comunitario estandar release El modelo de activos solo garantiza `main.js`、`manifest.json`、`styles.css`，Por lo tanto, no base la correccion del tiempo de ejecucion en "directorios adicionales seguiran". release Sobre el supuesto de "instalarlo"。
- Prioridad de uso en la primera fase `iframe srcdoc` U otros contratos de paginas en linea, haga que la vista previa sea el host `main.js` Capacidades autonomas portatiles en lugar de depender de recursos externos `rendering-webview/` Tabla de contenidos。
- Si realmente se necesita mayor independencia mas adelante runtime bundle，Deben disenarse simultaneamente release Estrategia de disco durante el empaquetado y la instalacion, en lugar de solo compilar exitosamente localmente。
- En esta etapa smoke gate Autonomo srcdoc host”Esta limitacion; cualquier giro hacia el exterior host La realizacion de los bienes debe modificarse simultaneamente release Modelo de activos, script de auditoria y diseno de ruta de instalacion.。
- Tambien es necesario aclarar los datos de la hoja de ruta actual: los envases actuales siguen siendo de entrada unica. El limite que realmente se aplica es“render host Autonomo en `main.js`”，En lugar de “independencia ya entregada render-host Paquete de activos”。

**Estandares de finalizacion：**

- El producto de compilacion puede transportar de manera estable la pagina renderizada y tiene auditoria automatica para evitar que degenere en algo externo no declarado. host Dependencia de activos。
- No afecta la carga actual del complemento.。

### Tareas 1：Introduccion Diagram Modelo de dominio y enrutador de intencion

**Documentacion：**
- crear：`src/diagram/types.ts`
- crear：`src/diagram/intent.ts`
- crear：`src/diagram/spec.ts`
- crear：`src/diagram/planner.ts`
- Modificacion：`src/types.ts`
- Pruebas：`src/tests/diagramIntent.test.ts`
- Pruebas：`src/tests/diagramSpecValidation.test.ts`

**Estado：** Entregado

`src/diagram/types.ts`、`src/diagram/spec.ts`、`src/diagram/intent.ts` Con `src/diagram/planner.ts` Ya puse diagram intent、spec、validator y route planner Conviertete en un verdadero limite. La pregunta principal ahora ya no es "¿Existen domain model”，Pero si todos los comandos posteriores continuaran reutilizando este conjunto de modelos.。

- [x] Definicion `DiagramIntent`，Cubrir al menos `mindmap`、`flowchart`、`sequence`、`classDiagram`、`erDiagram`、`stateDiagram`、`canvasMap`、`dataChart`。
- [x] Definicion `DiagramSpec` La suma estructural minima de validator。
- [x] Cambiar la logica de "juzgar que tipo de diagrama debe generarse en funcion del contenido de las notas" de Mermaid prompt Pelar。

**Toma de decisiones：**

- Intent router Utilice las reglas primero + prompt hint El modo hibrido no crea directamente un clasificador automatico a nivel de modelo.。
- Cuando el nivel de confianza es insuficiente, el valor predeterminado vuelve a ser `mindmap` o en UI Permitir a los usuarios seleccionar el tipo de imagen de destino.。

**Estandares de finalizacion：**

- La nueva logica se puede verificar mediante una prueba unica sin renderizar” notas -> Determinacion de la “intencion”。
- Mermaid prompt Ya no esta codificado como unico tipo de imagen。

### Tareas 2：uso Spec-First Generar alternativas directamente Mermaid Prompt

**Documentacion：**
- crear：`src/diagram/prompts/diagramSpecPrompt.ts`
- Modificacion：`src/promptUtils.ts`
- Modificacion：`src/main.ts`
- Pruebas：`src/tests/diagramPromptAssembly.test.ts`
- Pruebas：`src/tests/diagramPlannerFlow.test.ts`
- Pruebas：`src/tests/diagramCommandArchitecture.test.ts`

**Estado：** Parcialmente completado

`src/diagram/prompts/diagramSpecPrompt.ts`、`src/diagram/diagramSpecResponseParser.ts` y `src/diagram/diagramGenerationService.ts` Ya aterrice spec-first prompt Con `spec -> validate -> render` Linea de montaje. Este lote de trabajo ha vuelto a `src/main.ts` Tres reglas intermedias diagram command de busy-state、leer、provider Elige、error handling orchestration Cerca de compartir `generateDiagramCommand`。

La parte verdaderamente inacabada se vuelve“public surface "Cerrado" en lugar de "completamente bifurcado": aun se conserva legacy Mermaid Orden、experimental generate Orden、experimental preview Tres entradas al comando para que sean compatibles con los flujos de trabajo existentes y sidebar/custom workflow action IDs。

- [x] Se agrego “Dejemos LLM Salida `DiagramSpec` JSON”de prompt。
- [x] deja `summarizeToMermaidCommand` Evoluciono a `generateDiagramCommand`，Pero mantenga el nombre del comando existente como entrada compatible。
- [x] Introducir “generar spec -> Verificacion spec -> Daselo a adapter”La linea de montaje。

**Toma de decisiones：**

- Mantenlo actualizado Mermaid La entrada de comandos esta disponible para evitar interrumpir el flujo de trabajo del usuario al mismo tiempo.。
- Permiso inicial UI Todavia mostrando “Summarise as Mermaid diagram”，Pero entra diagram pipeline；Posteriormente ampliado a unificado diagram action。
- La capa de comando primero unifica lo interno. executor，Decide de nuevo public command IDs、sidebar action IDs y workflow DSL ¿Se requiere migracion? De lo contrario, problemas de compatibilidad y orchestration La refactorizacion esta vinculada al mismo lote.。

**Estandares de finalizacion：**

- Generar enlaces ya no depende de LLM Solo escupelo Mermaid。
- nuevo pipeline La reutilizacion se puede generar sin la participacion del renderizador. spec。

### Tareas 3：Mermaid Adapter V2 Con `mermaidProcessor.ts` Desmontaje

**Documentacion：**
- crear：`src/diagram/adapters/mermaid/base.ts`
- crear：`src/diagram/adapters/mermaid/mindmapAdapter.ts`
- crear：`src/diagram/adapters/mermaid/flowchartAdapter.ts`
- crear：`src/diagram/adapters/mermaid/sequenceAdapter.ts`
- crear：`src/diagram/adapters/mermaid/erAdapter.ts`
- crear：`src/diagram/adapters/mermaid/validator.ts`
- Modificacion：`src/mermaidProcessor.ts`
- Pruebas：`src/tests/mermaidMindmapAdapter.test.ts`
- Pruebas：`src/tests/mermaidFlowchartAdapter.test.ts`
- Pruebas：`src/tests/mermaidValidator.test.ts`

**Estado：** Parcialmente completado

Mermaid subtype adapters Ya cubierto `mindmap`、`flowchart`、`sequenceDiagram`、`classDiagram`、`erDiagram`、`stateDiagram-v2`，y renderer El bando ira primero `mermaid.parse` Verificacion. El valor de este lote de trabajo se ha realizado.。

La ultima novedad es que parte del recurso original a legacy fixer La proteccion de sintaxis ha comenzado a avanzar. adapter：Por ejemplo flowchart edge label Adentro `|` Ahora Estara En `src/diagram/adapters/mermaid/flowchartAdapter.ts` traducido directamente como `&#124;`，En lugar de esperar `fixMermaidPipes` Una especie de parche global para apagar incendios。

Pero roadmap El objetivo original mas radical aun no se ha logrado.：`src/mermaidProcessor.ts` Aun grande legacy fixer，Mas adapter-specific fix Las reglas aun no se han convertido en el camino principal. La realidad actual es“adapter-driven emit + validate Ya existe, las defensas de sintaxis local han comenzado a avanzar y se ha implementado cierta logica de proteccion general.、note directive parsing、edge-label attachment、edge-label merge/quote/rewrite Con note-node formatting Se ha hundido hasta `src/diagram/adapters/mermaid/legacyFixerUtils.ts`，fixer decomposition Aun no terminado”。

- [ ] voluntad Mermaid La logica de reparacion se cambia de "reparacion de texto global" a "segun el tipo de imagen". adapter de emit + validate + fix”。
- [ ] poner `mermaidProcessor.ts` Las capacidades generales se reducen a funciones de herramientas limitadas, y las reglas especificas del tipo de mapa se trasladan a las correspondientes. adapter。
- [ ] Conservar la capacidad de reparacion por lotes, pero solo como legacy fallback，Ya no es necesario como paso en la ruta de compilacion principal.。
- [x] voluntad flowchart pipe-label Escapar de legacy fixer Avanzar adapter emit Etapa。
- [x] voluntad bracket-block protect/restore Este tipo de general legacy fixer El mecanismo se traslada a funciones de herramienta compartida para evitar `fixMermaidPipes` Con `fixMalformedArrows` Implementacion repetida en。
- [x] voluntad targeted note Limpieza de contenidos y note-node line formatting Sumergete en funciones de utilidad compartida para reducir `fixNotesToNodes` / `fixTargetedNotes` Logica interna de empalme repetido.。
- [x] voluntad directional / for-of / standalone / targeted note directive parsing Con directional edge-label attachment Sumergete en funciones de utilidad compartida para reducir `fixMermaidNotes`、`fixNotesToNodes`、`fixTargetedNotes` Repita regularmente y dentro de string surgery。
- [x] voluntad double-arrow merge、unquoted edge-label quote、quoted-label-after-semicolon rewrite Sumergete en funciones de utilidad compartida para reducir `fixDoubleArrowLabels`、`fixUnquotedEdgeLabels`、`fixQuotedLabelsAfterSemicolon` Repetir dentro line-regex surgery。

**Toma de decisiones：**

- Mantenga solo estrategias de reparacion minimas, p.e. fence Repara y limpia algunos personajes garantizados.。
- Eliminar reglas globales burdas como "eliminar todos los corchetes" para evitar danar la legalidad. Mermaid Gramatica。

**Estandares de finalizacion：**

- Al menos apoyo `mindmap`、`flowchart`、`sequenceDiagram`、`erDiagram` Cuatro categorias Mermaid Salida。
- Par de resultados recien generado `mermaid.parse` La tasa de aprobacion ha mejorado significativamente。

### Tareas 4：tener Registry、Host、Cache Con Preview Esqueleto de plataforma de renderizado

**Documentacion：**
- crear：`src/rendering/types.ts`
- crear：`src/rendering/rendererRegistry.ts`
- crear：`src/rendering/rendererService.ts`
- crear：`src/rendering/cache/renderCache.ts`
- crear：`src/rendering/host/renderHost.ts`
- crear：`src/rendering/host/inlineRenderHost.ts`
- crear：`src/ui/DiagramPreviewModal.ts`
- Modificacion：`src/main.ts`
- Modificacion：`src/ui/NotemdSidebarView.ts`
- Modificacion：`src/ui/NotemdSettingTab.ts`
- Pruebas：`src/tests/rendererRegistry.test.ts`
- Pruebas：`src/tests/rendererService.test.ts`
- Pruebas：`src/tests/diagramPreviewModal.test.ts`

**Estado：** Entregado

`RendererRegistry`、`RendererService`、`RenderCache`、`InlineRenderHost`、`IframeRenderHost` Con `DiagramPreviewModal` Ya puse preview/render/export Se levanta el esqueleto minimo de la plataforma. cache key Tambien incluido `spec + target + theme`。

- [x] Primero establezca la interfaz de la plataforma y luego conectese gradualmente a la plataforma real de servicio pesado. renderer。
- [x] Por el momento Mermaid El resultado proporciona una entrada de vista previa unificada en lugar de dispersar la logica de vista previa en los comandos comerciales.。
- [x] Agregue cache simple, al menos presione `spec + target + theme` hacer cache key。

**Toma de decisiones：**

- La primera etapa de vista previa solo requiere que "se pueda abrir, actualizar, copiar el codigo fuente y guardar los resultados" y no pretende exportar Family Bucket.。
- La estrategia de almacenamiento en cache primero usa memoria o vault Concentrese en el almacenamiento en cache ligero y no se apresure a crear indices persistentes complejos。

**Estandares de finalizacion：**

- La persona que llama pasa `RendererService` Acceda a capacidades de renderizado en lugar de acoplamiento directo Mermaid API。
- Mermaid La vista previa ha entrado en la ruta de la plataforma unificada.。

### Tareas 5：voluntad JSON Canvas Como el primer no- Mermaid Salida

**Documentacion：**
- crear：`src/diagram/adapters/canvas/canvasAdapter.ts`
- crear：`src/diagram/adapters/canvas/layout.ts`
- Modificacion：`src/fileUtils.ts`
- Modificacion：`src/main.ts`
- Pruebas：`src/tests/canvasAdapter.test.ts`
- Pruebas：`src/tests/canvasLayout.test.ts`

**Estado：** Entregado dentro del alcance basico

`.canvas` Salida, conceptos basicos deterministic layout、Ahorro y preview/export Se ha implementado el soporte. La implementacion actual sigue siendo un diseno automatico inicial y no proporciona una semantica de reescritura compleja, pero esto esta en linea con la intencion original de esta tarea. scope。

- [x] aumentar `.canvas` Salida en formato de destino。
- [x] Primero admita graficos de conocimiento, mapas conceptuales, combinacion de investigaciones y escenarios de desmontaje de tareas, y no busque una semantica de edicion manual completa.。
- [x] Apoyo de `DiagramSpec` Mapa a node/edge/position Diseno basico。

**Toma de decisiones：**

- Se puede utilizar el diseno inicial. deterministic auto-layout，No es necesario admitir una reescritura compleja de arrastrar y soltar desde el principio。
- Canvas Es un activo nativo y se debe dar prioridad al ahorro, apertura y vault Proceso de asociacion。

**Estandares de finalizacion：**

- Los usuarios pueden elegir entre los mismos. diagram pipeline Salida `.canvas` Documentacion。
- Salida canvas en Obsidian Se puede abrir directamente en。

### Tareas 6：Agregado para notas numericas y comparativas. Vega-Lite

**Documentacion：**
- crear：`src/diagram/adapters/vega/vegaLiteAdapter.ts`
- crear：`src/diagram/adapters/vega/schema.ts`
- crear：`src/rendering/host/iframeRenderHost.ts`
- Modificacion：`src/rendering/webview/bootstrap.ts`
- Modificacion：`src/rendering/webview/renderFrame.ts`
- Pruebas：`src/tests/vegaLiteAdapter.test.ts`
- Pruebas：`src/tests/iframeRenderHost.test.ts`

**Estado：** Entregado, pero se indican limitaciones

`dataChart` intent、controlled Vega-Lite templates、planner chart defaults、preview/export y HTML fallback han sido implementados, indicando que "las notas numericas y comparativas ya no necesitan ser Mermaid Se ha establecido la direccion del producto de "enchufe fuerte"。

runtime boundary Ahora hemos logrado avances sustanciales en comparacion con antes.：preview modal Ya no priorices los complementos runtime En linea Vega-Lite SVG Representacion，iframe host asumido bootstrap Ruta y prensa anfitriona. target Distinguir sandbox，Solo controlado Vega-Lite Ruta para habilitar las capacidades de secuencias de comandos. Esto llena el vacio anterior en la ruta de vista previa a nivel de producto que causaba que esta tarea aun se considerara "parcialmente completada".。

Las restricciones restantes se han cambiado de "si el comportamiento es correcto" a "si el paquete es independiente".”。`vega-lite` Con `vega` Actualmente todavia a traves del complemento maestro. bundle bridge Oferta porque `esbuild.config.mjs` Todavia hay una unica entrada. En otras palabras, la tarea 6 No mas estancados“Vega-Lite ¿Se debe ingresar la vista previa? iframe host”Esta decision ha sido implementada. Las piezas sin terminar se han reciclado para las tareas. 0 de heavier-runtime packaging boundary。

- [x] Tome notas que contengan datos claros, secuencias, comparaciones y proporciones. `dataChart` intent。
- [x] pasar iframe host Adquisicion Vega-Lite Vista previa de la ruta。
- [x] Soporte primero bar、line、area、scatter、pie、table-like summary Seis categorias de plantillas de graficos de alto valor。

**Toma de decisiones：**

- No admite "modelo de juego libre y escribe cualquier Vega Normal"; solo admite subconjuntos y plantillas controlados schema。
- La generacion de graficos debe requerir fuentes de datos claras y evitar la falsificacion de valores.。

**Estandares de finalizacion：**

- Vega-Lite Conviertase en un proveedor no respaldado oficialmente Mermaid Vista previa de la salida。
- Si el renderizado falla, puedes recurrir a spec/source JSON，En lugar de tragar directamente la comida equivocada。

### Tareas 7：Refuerzo tematico, exportador y editorial.

**Documentacion：**
- Modificacion：`src/rendering/rendererService.ts`
- Modificacion：`src/ui/DiagramPreviewModal.ts`
- Modificacion：`styles.css`
- Modificacion：`README.md`
- Modificacion：`docs/releases/*.md`
- Pruebas：`src/tests/renderThemeConfig.test.ts`
- Pruebas：`src/tests/renderExportFlow.test.ts`

**Estado：** Limites entregados y de soporte definidos

El codigo actual tiene preview/export Analisis tematico、UI locale Redaccion publicitaria、SVG/PNG/source Exportar con README/release docs Alineacion. Cabe destacar que esto no es “todo target Todas las exportaciones reciben apoyo por igual" en lugar de "La matriz de apoyo se ha hecho explicita”。HTML El objetivo actualmente esta comprometido solo iframe fallback preview y raw source save，Esto deberia continuar manteniendo la coherencia de la documentacion con la implementacion。

- [x] voluntad UI Idioma、Obsidian theme、Alineacion de temas de graficos y opciones de exportacion.。
- [x] completo PNG、SVG、source JSON/canvas Exportar。
- [x] Actualice la documentacion para admitir claramente tipos de imagenes, restricciones, estrategias de degradacion y solucion de problemas.。

**Toma de decisiones：**

- Admite exportar primero la combinacion de formatos mas estable para evitar compromisos al principio. PDF、DOCX、Capacidades de alto mantenimiento, como instantaneas por lotes.。
- Debe quedar claro en el documento que salida es un "archivo generado" y cual es un "resultado de renderizado previsualizable".”。

**Estandares de finalizacion：**

- Los usuarios pueden obtener una vista previa, copiar el codigo fuente y exportar al menos un resultado de imagen.。
- Documentacion matricial de soporte de idioma, tema y tipo de imagen.。

### Tareas 8：Evaluacion avanzada del motor retrasada

**Documentacion：**
- Crear nuevamente despues de la aprobacion.：`src/diagram/adapters/plantuml/*`
- Crear nuevamente despues de la aprobacion.：`src/diagram/adapters/graphviz/*`
- Haga un seguimiento y vuelva a realizar la prueba：`src/tests/plantumlAdapter.test.ts`

**Estado：** La estrategia de demora es correcta

Esta seccion no se queda atras en la actualidad, pero es el limite que mas se debe respetar. La verdadera deficiencia de la situacion actual no es que no haya suficientes formatos; build/runtime isolation、command De cerca、legacy Mermaid El limite de salida no es lo suficientemente estricto. Si se presenta ahora PlantUML、Graphviz o Draw.io，Solo extendera la deuda de plataforma inacabada a mas DSL subir。

- [ ] Evaluado solo despues de la finalizacion de la plataforma antes mencionada. PlantUML、Graphviz、Draw.io。
- [ ] Primero recopile evidencia de la demanda y luego decida si ingresa a la implementacion.。

**Umbral de decision：**

- Ingresar solo cuando se cumplan simultaneamente las siguientes condiciones：
  - Renderer platform Estable。
  - Existente Mermaid/Canvas/Vega-Lite Mayoria de las necesidades cubiertas。
  - Los usuarios tienen escenarios claros que requieren mas profesionalismo. DSL。
  - Tenga una estrategia clara de renderizado y distribucion en lugar de "generar el codigo primero y luego hablar de ello mas tarde".”。

---

## Control de direccion a corto, medio y largo plazo

### Corto plazo

Ciclo objetivo: seguir la corriente `main` el siguiente lote de diagram-platform Trabajo de cierre

Puntos clave：

- Tareas de mantenimiento 0 Entregado render-host smoke gate，No permita que las iteraciones posteriores del tiempo de ejecucion omitan la version./Restricciones de instalacion
- Realizar tareas 2 La estructura de mando que realmente falta en 38. se cierra y se reduce legacy Comandos y experimental Ordene doble via a largo plazo
- Realizar tareas 3 Lo que realmente falta en `mermaidProcessor.ts` Reducir la responsabilidad y sunset boundary
- No hagas tareas 6 Recurrir a los complementos runtime Vista previa en linea; El trabajo posterior solo debe comenzar desde el actual. bridge-backed `srcdoc` La vista previa continua avanzando hacia la tarea. 0 Crea multiples entradas reales. host Embalaje

Senales de exito：

- No confundas "agregar mas" con el siguiente lote de trabajo. renderer”Conviertalo en el tema principal。
- best-fit / legacy-mermaid Limites mas claros，experimental Las etiquetas ya no ocultan el verdadero estatus。
- `src/main.ts` No seguir estando diagram orchestration El punto de expansion permanente de。

### A medio plazo

Ciclo objetivo：`1.9.x`

Puntos clave：

- voluntad JSON Canvas Con Vega-Lite Avance del aspecto del producto "la funcion ya existe" al aspecto del producto "comprensible, estable y mantenible por defecto"
- Tranquilizate heavier renderer runtime Estrategias de embalaje y funcionamiento.
- Evaluacion HTML/SVG infographic ¿Deberia usarse como formal? target，En lugar de simplemente hacer fallback
- poner docs、tests、release notes y support matrix Vincular al mismo conjunto. truth source

Senales de exito：

- experimental diagram Las funciones ya no dependen demasiado maintainer-only Solo a traves del contexto podemos entender。
- No Mermaid El resultado no es solo “generable”, sino que tiene limites estables y modelos de fallas interpretables.。
- La descripcion del estado actual y las limitaciones del documento ya no se queda atras del codigo.。

### Largo plazo

Ciclo objetivo：`2.0+`

Puntos clave：

- en host/runtime boundary Despues del establecimiento completo, reevaluar richer infographic targets
- en support matrix y release discipline Cuando sea maduro, reevalue PlantUML、Graphviz Trabajo pesado DSL
- Evaluacion uniforme diagram workspace、Representacion por lotes e indexacion de activos

Senales de exito：

- La plataforma de graficos se convierte en un dominio de capacidad independiente en lugar de estar adjunta a un unico comando.。
- Tener claro target support matrix、theme contract、render failure model y release discipline。

---

## Riesgos clave y metodos de control

### Riesgo: se introducen demasiados tipos de graficos demasiado pronto y la plataforma pierde el control sin abstraccion.

Estrategia de control：

- Primero implemente la interfaz de la plataforma y los dos primeros tipos de no Mermaid Metas。
- Cada vez que se agrega un nuevo formato de destino, se debe reutilizar `DiagramSpec` y `RendererService`。

### Riesgo: poner `markdown-viewer-extension` Mudate en conjunto, la complejidad excede Notemd Capacidad de carga actual

Estrategia de control：

- Solo aprende de los demas registry/host/cache Pensamiento de diseno。
- No copiar offscreen、Puente multiterminal、DOCX Exportar y todo renderer establecer。

### Riesgos：Vega-Lite o HTML heavier runtime La evolucion vuelve a colarse en exteriores no declarados host Dependencia de activos

Estrategia de control：

- Quedate en la fase uno host Autonomo `main.js` Dentro, usados juntos bundle smoke gate Auditoria continua。
- Si es necesario introducir la independencia host Activos, definir primero release Embalaje, instalacion, disco y capability fallback，Cambie la implementacion nuevamente.。

### Riesgo: Generar spec El modelo temporal crea datos.

Estrategia de control：

- Derecha `dataChart` Requisitos obligatorios evidence/data extraction Pasos。
- Cuando no hay un valor claro, solo se permite generar diagramas de estructura o tarjetas de resumen de texto, y no se permiten graficos fabricados.。

### Riesgo: conservar demasiado legacy fallback，Con el tiempo, los sistemas duales coexistiran durante mucho tiempo.

Estrategia de control：

- Darle a los viejos Mermaid Configuracion de la cadena de parches sunset Limites。
- Cada vez que completas un adapter，Simplemente reduce un poco legacy fixer Responsabilidad, no convivencia infinita。

---

## Contraobjetivo

Las siguientes instrucciones no deberian ingresar actualmente a la linea principal.：

- Apoyo directo raster AI Generacion de dibujos o imagenes.
- Hazlo bien desde el principio Draw.io round-trip Editar
- en ningun renderer runtime Bajo la premisa de prometer "soportar muchos tipos de graficos”
- para PlantUML/Graphviz La introduccion requiere servidores adicionales o es compleja license Camino de riesgo
- en `src/main.ts` Continue apilando nueva logica empresarial grafica en

---

## Proximos pasos sugeridos

Si continuas avanzando ahora, se recomienda hacer solo el "lote de cierre" y no volver a "agregar mas primero" target Hablemos del camino：

1. Realizar tareas 2 Resto：diagram command architecture De cerca
2. Realizar tareas 3 Resto：`mermaidProcessor.ts` Reduccion de responsabilidad y legacy fixer sunset boundary
3. Volver a la tarea 0 resto heavier-runtime packaging boundary，deja bridge-backed iframe Obtenga una vista previa de la actualizacion posterior a una version verdaderamente independiente. host bundle
4. Continuar con las tareas de mantenimiento. 7：poner support matrix Con release/docs contract Ate mas fuerte
5. Dar la tarea 0 de smoke gate Como limite de retorno, si la independencia se introduce mas tarde host Los activos deben actualizarse primero release/install Diseno

La razon es muy directa：

- El punto de interrupcion clave actual ya no es "¿Hay DiagramSpec/renderer registry”，Pero “¿Se han utilizado correctamente estas capacidades? productize”。
- Si este punto de interrupcion no se completa, cualquier subsiguiente renderer Seguiran apilandose sobre lo inacabado runtime/command/legacy En la frontera, el coste de la reelaboracion solo sera mayor。

---

## Control de acceso de verificacion en cada etapa.

Cada etapa debera contar con al menos las siguientes verificaciones：

- `npm run build`
- Se paso la prueba de la unidad objetivo.
- `npm run audit:render-host`
- Actual Mermaid Conjunto de regresion aprobado
- nuevo renderer Los escenarios de falla tienen areas de error claras
- Las rutas de productos, las entradas de vista previa y los resultados de exportacion se pueden verificar manualmente

Requisitos suplementarios para nuevas funciones de la capa de renderizado：

- Al menos un registro de verificacion de vista previa del escritorio
- Al menos un registro de verificacion de politica movil o de degradacion
- Matriz de soporte de actualizacion de sincronizacion de documentos y descripcion de limitaciones

---

## Recomendaciones finales

La mejor manera de avanzar no es “seguir fortaleciendo Mermaid "Reparar" no significa "cargar directamente mas de una docena de tipos de imagenes", sino：

Primero reemplace el existente diagram platform productize，Luego decide cuales debe llevar renderer。

Si quieres resumir la siguiente estrategia tecnica en una frase, seria：


## 2026-05-01 LLM Robustez de las llamadas y mejora del campo del borde del grafico

### Cline Procesamiento de tokens de salida de modelo desconocido alineado

`resolveProviderTokenLimit` Ahora usa el modelo desconocido con Cline Comportamiento consistente: cuando el global `maxTokens` es el valor predeterminado（8192）Y el modelo no esta `KNOWN_MODEL_MAX_OUTPUT_TOKENS` Cuando esta en la tabla, el sistema regresa `undefined` —— Por API A exclusivo criterio del proveedor. Esto reemplaza el paso ciego anterior de modelos desconocidos. 8192 comportamiento. Definido por el usuario para modelos desconocidos `maxTokens` Los valores permanecen sin cambios (compatibilidad con versiones anteriores）。

Ambito de influencia: Todos 5 tiempos de ejecucion de transferencia（OpenAI-compatible、Anthropic、Google、Azure OpenAI、Ollama）。

### Normalizacion del campo del borde del grafico

`diagramSpecResponseParser.ts` en `normalizeSpec` Ahora maneja multiples convenciones de nomenclatura de campos de borde（`source`/`target`、`sourceId`/`targetId`、`start`/`end` → `from`/`to`），hacer LLM Diferencias en la produccion JSON Los nombres de los campos se pueden analizar correctamente.。`buildDiagramSpecPrompt` Ahora se dan instrucciones claras. LLM uso `from`/`to` Nombre del campo。

### Prueba de enlaces en vivo

`src/tests/liveChainTest.test.ts` Utilice pruebas vault Par de configuracion DeepSeek API Realice llamadas reales, que abarquen la finalizacion del chat, la generacion de especificaciones de graficos y la salida completa del proceso. Todos 5 Prueba en real DeepSeek API pasar。

### Compatibilidad con versiones anteriores

Todas las configuraciones de proveedores, protocolos de transporte e interfaces de configuracion existentes permanecen sin cambios. La unica diferencia de comportamiento para los usuarios: use el valor predeterminado `maxTokens`（8192）El modelo desconocido de ahora viene dado por API El proveedor determina el limite superior a su propia discrecion y ya no esta limitado a 8192。Nivel de proveedor maxOutputTokens La cobertura sigue estando limitada por un limite superior del modelo conocido。

---
