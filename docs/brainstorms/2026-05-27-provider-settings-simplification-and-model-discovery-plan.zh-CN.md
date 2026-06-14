---
date: 2026-05-27
last_updated: 2026-05-28
topic: provider-settings-simplification-and-model-discovery-plan
canonical: true
---

# Provider Settings Simplification con Model Discovery Planificar

## 1. ¿Por que es necesaria esta linea ahora?

El almacen actual ya cuenta con una amplia provider runtime Cubierto, pero settings control plane No convergio con este crecimiento.。

Ya no se trata de una cuestion de “la experiencia simplemente esta bien”, sino de un problema arquitectonico sustancial.：

1. actual provider runtime El ancho ya no es adecuado para seguir tolerando la codificacion a nivel de campo UI Logica；
2. El usuario ha solicitado claramente provider settings hacer core-vs-advanced Segmentacion；
3. Los usuarios tambien requieren explicitamente el descubrimiento del modelo, pero solo si permanece lightweight、backward-compatible Sea honesto dentro de los limites de sus capacidades.。

Este articulo sirve para poner en el mercado el plan de implantacion especifico de esta linea.。

## 2. Valor de verdad del codigo actual

### 2.1 Settings El renderizado todavia esta codificado

`src/ui/NotemdSettingTab.ts` Actualmente todavia determinado por sucursales directas. provider Representacion de campo：

1. API key Presione `apiKeyMode` Decide si mostrar；
2. `baseUrl`、`model`、`temperature` Representacion directa；
3. `maxOutputTokens` Solo si developer mode La persistencia esta habilitada o ya existe. override Renderizar solo cuando；
4. `topP` / `reasoningEffort` Solo para OpenAI-compatible provider Representacion；
5. `thinkingEnabled` Solo para `DeepSeek` Representacion；
6. `apiVersion` Solo para `Azure OpenAI` Representacion。

Esto esta bien desde el punto de vista operativo, pero estructuralmente debil.：

1. No hay campos reutilizables taxonomy；
2. Nada compartido advanced disclosure modelo；
3. Cada vez que se agrega o ajusta uno nuevo provider，settings Los archivos seguiran expandiendose en lugar de provider schema Crecimiento。

### 2.2 Provider metadata Actualmente parcial runtime，Imparcialidad UI

`src/llmProviders.ts` Lo que actualmente se expone es：

1. provider name；
2. category；
3. transport；
4. API key mode；
5. API test mode；
6. description/setup hint；
7. default config。

Actualmente no esta expuesto：

1. Agrupacion de visibilidad de campo.；
2. core / contextual / advanced / developer-only Clasificacion；
3. model discovery capability Metadatos；
4. provider-specific de discovery endpoint family o fallback Secuencia；
5. Sea intencional al mantener manual-first El valor predeterminado permite opcional disable reason。

### 2.3 Config Buena compatibilidad morfologica, pero demasiado plana para conducir con mas fuerza. UI

`src/types.ts` en `LLMProviderConfig` Sigue siendo una estructura plana：

1. `apiKey`
2. `baseUrl`
3. `model`
4. `temperature`
5. Opcional `topP`
6. Opcional `reasoningEffort`
7. Opcional `thinkingEnabled`
8. Opcional `maxOutputTokens`
9. Opcional `localOnly`
10. Opcional `apiVersion`

Esto es beneficioso para los siguientes objetivos.：

1. `data.json` Compatibilidad con versiones anteriores；
2. import/export Estable；
3. mantener `model` Como unica persistencia source-of-truth cuerda。

Pero es perjudicial para los siguientes objetivos：

1. Derivacion advanced auto-expand Logica；
2. Express sin agregar una nueva capa de metadatos provider-specific Agrupacion de campos。

### 2.4 Model discovery La base de helper

`src/llmUtils.ts` Ya existen algunas bases reutilizables：

1. OpenAI-compatible base-URL normalization；
2. `apiTestMode=models-then-chat`；
3. connection test en `GET /models` Deteccion。

Esto significa runtime Ya conozco algunas semanticas necesarias y el descubrimiento de modelos no comienza desde cero.。

Pero un valor de verdad que todavia requiere un mantenimiento explicito y continuo es：

1. discovery El comportamiento debe continuar con runtime/provider-family Alineacion semantica；
2. Instantaneo discovery hint Debe continuar y persistir provider state Separacion；
3. discovered-model token autofill La verdadera semantica de debe estar en UI Sea honesto con la capa de documentacion；
4. No puedo volver a provider-name-only de ad hoc sucursal。

## 3. Estado de la demanda en relacion con el almacen actual.

| Requirement | Estado actual | Conclusion |
|---|---|---|
| Solo se muestra de forma predeterminada required/default-visible Campos | Ya implementado | actual main Representacion de metadatos agrupados por campos compartidos. provider settings，Y mostrar por defecto core controls |
| mantener `model` Visible por defecto | Actualmente satisfecho | Debe conservarse al refactorizar |
| Ingresos por partidas secundarias de optimizacion advanced settings | Ya implementado | Los elementos de ajuste secundarios ahora se incluyen explicitamente advanced disclosure |
| Persistencia advanced Expandir automaticamente cuando exista valor | Ya implementado | La implementacion actual se basara en la perseverancia. provider override Derivar estado expandido |
| selective reuse Cherry Studio | Ha aterrizado de forma acotada | Implementado y reutilizado discovery Ideas estrategicas, pero no copiaron la perseverancia. provider-model catalog |
| El descubrimiento de modelos no puede bloquear la configuracion manual | Ya implementado | discovery Si additive/transient de, manual `model` La entrada sigue siendo un valor verdadero persistente. |

## 3.5 Implementacion de puntos de control

A partir de 2026-05-27 Cerrar, aislar `feat/provider-settings-model-discovery` Se ha verificado y fusionado la implementacion en el canal. current main。

actual main Contenido que ya existe en：

1. `src/llmProviders.ts` Ya agregado a la version 1 provider-field taxonomy metadata（`core`、`contextual`、`advanced`、`developer`）Y presiona provider de model-discovery metadata。
2. Se agrego un nuevo instante. `src/providerModelDiscovery.ts`，Cobertura limitada：
   - Un lote de verificados. OpenAI-compatible `GET /models` Predeterminado
   - OpenRouter Limitado chat + embedding catalog Agregacion
   - Together Dedicado `/models` Respuesta de matriz
   - Anthropic `GET /models`
   - Ollama tag listing
   - Google model listing
3. `src/ui/NotemdSettingTab.ts` Ya existe una version en metadata-driven provider panel Intentos de refactorizacion, incluidos：
   - Predeterminado/core Representacion de campo
   - contextual Representacion de campo
   - advanced disclosure
   - Basado en la perseverancia advanced Derivacion de valor auto-expand
   - Opcional fetch-models UI wiring
4. Correspondencia locale keys、README/update surface Tambien se han agregado pruebas con enfoque.。
5. actual main Tambien segui completando este articulo. lane acotado provider Cierre ancho：
   - Persistencia de lo viejo provider Nombre Hacer canonical alias Normalizacion, p.e. `Xiaomi` -> `Xiaomi MiMo`
   - Parchear y alinear acciones runtime adicional OpenAI-compatible Predeterminado（`LiteLLM`、`Nebius`、`Cerebras`、`Hugging Face`、`Vercel AI Gateway`、`AIHubMix`、`GitHub Models`、`PPIO`、`New API`、`OVMS`）
   - si Vercel AI Gateway Camine dentro de los limites `/v1/models` + `v3/ai/config` Fusion de fuente dual, derecha xAI Camina solo `/v1/language-models` Y un recurso limitado a `/v1/models`，si Huawei Cloud MaaS Camina solo `v2/models` registry endpoint，si Together Realizar formula matricial solo `/models` Responder a LiteLLM Subsuncion explicita proxy-family de `/models` + `/model/info` Fusion acotada, derecha PPIO Camina solo chat + embedding + reranker Fusion acotada de tres vias y dejar OVMS Vaya primero a lo local `/v3/models`、Regresar si es necesario `/v1/config`，En lugar de fingir que lo son generic `/models` Completamente equivalente
   - si OpenRouter Caminar solo tiene limites. chat + embedding catalog Agrega en lugar de fingir que es uno mas generic `/models` Puerta de enlace
   - si Azure OpenAI Espera manual-first Llenado predeterminado provider-specific discovery disable reason，Hacer la pagina de configuracion en Fetch model list Cuando no este disponible, se puede explicar el motivo en lugar de simplemente mostrar un uniforme "No admitido"”
   - Agregar pagina de configuracion model-aware token guidance，Conozca la salida maxima del modelo actual. Token El limite superior puede ser `Model`、provider override Con el panorama general `Max tokens` Mostrarse claramente
   - si gateway/provider-prefixed model ID Agregar acotado token-cap Inferir, hacer `openai/gpt-4o`、`anthropic/claude-sonnet-4.5` Este tipo de modelo capturado es owner Tambien se puede conducir cuando este lo suficientemente claro `Max tokens` / chunk-size Guia sin pretender serlo todo custom gateway en bare model Los nombres se pueden atribuir sin contexto.
   - Ampliar OpenAI-compatible payload Analisis, compatibilidad `list` / `items`、object-shaped proxy catalog、anidado gateway `specification.modelId` con endpoint-type-aware listing metadata
   - Continuar mejorando el intercambio fetch-model-list Se complementa la verdadera tolerancia del cuerpo al retorno. provider-mapped de `provider_models` Directorio de objetos, mas amplio. `nextPageUrl` / `next_page_url` Senal de busqueda, mantener presionado provider Semanticamente correcto `after_id` Procesamiento de continuacion de pagina, y `supportedOutputModalities`、Anidacion `supportedGenerationMethods`、limit objects Esperando mas abundante generation/modality Analisis de metadatos
   - discovered-model de token guidance Seguire absorbiendo la verdad ahora. hosted registry en token-cap Campos, p.e. `top_provider.max_completion_tokens`、`per_request_limits` con `limits.max_output_tokens`，Para que `Fetch model list -> Use` En estatico provider token registry Incluso si aun no conoces el modelo, aun puedes completarlo automaticamente. provider-scoped La salida de Token Limite de cobertura
   - Para instantaneo discovered-model metadata Mantenga las etiquetas de visualizacion、owner/provider hint con max-output-token Consejos e introduccion capability / modality / status Filtrado de percepcion: trate de evitar mezclar modelos no disponibles, de solo audio o solo de imagen en sugerencias de generacion de texto en directorios de modelos mas amplios; cuando el cuerpo de retorno aguas arriba carece del identificador principal, solo mezcle alias Uselo como respaldo identifier，En lugar de tomarlo todo alias Expandir todo a opciones independientes.
   - AIHubMix de discovery Ahora dale prioridad al sitio web oficial. `?type=llm` Directorio, en lugar de extraer primero la tabla completa del modelo multimodal mixto y luego depender completamente del filtrado local
   - deja runtime con discovery Comparte el mismo conjunto OpenAI-compatible endpoint Normalizacion (incluyendo `/responses` Este tipo de formulario de punto final) permite a los usuarios pegar el query/hash de endpoint root，Y deja generic host Tambien se puede reconocer la actualizacion automatica. OVMS Estilo local `/v3` Puntos finales en lugar de poner todos los locales host Dobla todo LiteLLM proxy bucket
   - family-specific de discovery La normalizacion ahora tambien permite a los usuarios pegar directamente archivos oficiales. discovery endpoint en lugar de provider root，Por ejemplo OpenRouter de `/models` o `/embeddings/models`，y Vercel AI Gateway de `/v3/ai/config` o `/v1/ai/models`，Para que fetch-model-list Aun puedo volver a lo correcto bounded registry Proceso
   - generic/custom gateway Ahora tambien puedes gatear registry row Dejalo claro `owned_by`、`publisher`、`provider` Este tipo owner/provider hint Cuando, cierto bare model ID Reutilizacion limitada en sentido ascendente token-cap metadata；Pero cualquier bare-model La especulacion sigue siendo intencionadamente un objetivo no objetivo.

Cosas que todavia no haces deliberadamente：

1. Remoto persistente provider model catalog；
2. model CRUD / health-check management UI；
3. Para aquellos que no sean el primer lote provider Generalizacion de discovery Reclamo de cobertura。
4. Finge todo OpenAI-compatible gateway Todos comparten exactamente lo mismo `/models` Semantica。

### 3.6 actual discovered-model token Semantica

Es muy probable que esta parte se escriba incorrectamente en sesiones posteriores y debe colocarse explicitamente.。

current main El verdadero comportamiento de：

1. `Fetch model list -> Use` **No**Sincronizar directamente global `Max tokens` o `Chunk word count`。
2. cuando `autoApplyDiscoveredModelMaxOutputTokens` Cuando este encendido, aplique discovered model Intentara analizar provider/model nivel max-output-token ceiling，Y escribe el resultado en el provider de `maxOutputTokens` override。
3. La prioridad de analisis actual esta limitada.：
   - curated/static known-model metadata
   - bounded host/owner-aware lookup
   - transient discovered-row max-output-token metadata
   - conservative fallback
4. Si no hay suficiente credibilidad ceiling，Actualmente, el complemento dara prioridad a conservar los archivos validos existentes. provider override；El valor conservador solo se utilizara si no hay ningun valor disponible actualmente. fallback（`DEFAULT_SETTINGS.maxTokens`，Actualmente `8192`）escribir provider override，Y solicitar claramente a los usuarios que revisen manualmente。
5. Esto fallback No puede describirse como "el limite superior del modelo que realmente se encuentra", es simplemente safety rail，No es el verdadero valor del modelo.。
6. Manual typed model edit Seguir adoptando un enfoque global independiente model-aware token guidance Canal（`globalModelAwareMaxTokensTracking`），La premisa es la situacion general. `Max tokens` todavia en auto-managed baseline en。

¿Por que es importante esta distincion?：

1. Mantiene el limite superior de salida global mantenido por el usuario.；
2. Hace discovered-model apply mantener additive，En lugar de reescribir silenciosamente provider Estrategia global；
3. Evita “porque el mando registry Metadatos debiles/Si falta algo, toma lo que tienes provider override Mal comportamiento “vacio”。

## 4. Cherry Studio Conclusiones comparativas

Repositorio de referencia：`/home/jacob/ref/cherry-studio`

Cherry Studio Puntos que vale la pena reutilizar：

1. strategy-registry Como obtener el modelo；
2. Presione endpoint family Separacion parser；
3. graceful fallback；
4. Orientado endpoint normalization Cobertura de regresion verdadera de。

No apto Notemd punto：

1. Persistencia `provider.models[]` ciclo de vida；
2. Mas pesado provider-domain state；
3. poner model CRUD / catalog management Cree un subsistema de productos de primera clase.。

Conclusion：

1. Debe reutilizarse discovery Modelo de estrategia；
2. La persistencia no debe reutilizarse catalog Arquitectura。

## 5. Arquitectura de destino

### 5.1 Campos taxonomy

para provider Agregar uso compartido de campos metadata，Habilitar cada campo para clasificar：

1. `core`
2. `contextual`
3. `advanced`
4. `developer`

Semantica de sugerencias.：

1. `apiKey`、`baseUrl`、`model` pertenecer a `core`；
2. `apiVersion` si Azure Este tipo provider Tambien debe pertenecer a `core`；
3. `temperature`、`topP`、`reasoningEffort`、`thinkingEnabled` pertenecer a `advanced`；
4. `maxOutputTokens` pertenecer a `developer`，Pero una vez que hay perseverancia override Aun deberia ser visible。

### 5.2 Discovery capability metadata

dar `LLMProviderDefinition` Agregar boton provider de discovery metadata：

1. Ya sea para apoyar discovery；
2. discovery family：
   - `openai-compatible`
   - `ollama`
   - `google`
3. Opcional provider-specific Explique o deshabilite los motivos.。

### 5.3 Mantenga simples las estructuras de persistencia

No introduzcas un segundo arbol provider-state tree。

Deben mantenerse las siguientes invariantes：

1. `LLMProviderConfig.model` Sigue siendo un valor de verdad persistente；
2. discovery Los resultados son solo sugerencias temporales.；
3. import/export El formato permanece sin cambios.。

## 6. Plan de implementacion

### Phase 1：metadata uplift

Documentos involucrados：

1. `src/llmProviders.ts`
2. Si es necesario, tambien puedes `src/types.ts` Agregar tipo auxiliar

Productos：

1. Campos taxonomy metadata；
2. discovery capability metadata；
3. Se utiliza para juzgar a un determinado provider ¿Hay perseverancia? advanced digno helper。

Riesgos：

1. Pon demasiado UI El comportamiento esta calzado con calzador runtime registry。

Mitigacion：

1. metadata mantener declarative con field-scoped；
2. No muevas la logica de renderizado a provider registry。

Punto de control actual：

1. Ha aterrizado en current main；
2. actual metadata La forma permanece declarative、field-scoped。
3. backward compatibility Ahora tambien cubierto legacy provider name de canonicalization，Incluye settings load con provider-profile import/export。

### Phase 2：settings renderer Refactorizacion

Documentos involucrados：

1. `src/ui/NotemdSettingTab.ts`

Productos：

1. core-only Cara predeterminada；
2. Explicito advanced disclosure；
3. Cuando la persistencia esta disponible advanced Expandir automaticamente cuando el valor es；
4. Mantenlo manual `model` La edicion sigue siendo la ruta de control predeterminada。

Riesgos：

1. Persistencia de lo existente provider config causa backward-compatibility Regreso。

Mitigacion：

1. advanced La logica de expansion se deduce en tiempo real de la configuracion actual；
2. Preservar los valores de campo existentes y guardar la semantica。

Punto de control actual：

1. Ha aterrizado en current main；
2. default/core、contextual con advanced La particion ahora esta compartida. metadata Cableado；
3. Correspondencia CSS/layout El soporte y las pruebas de estilo tambien han entrado en el proceso de envio.。
4. provider settings Tambien se mostrara ahora model-aware token guidance，y en `model`、Panorama general `Max tokens`、chunk-size Actualizar inmediatamente despues del envio.。

### Phase 3：lightweight discovery service

Se recomienda agregar nuevos documentos.：

1. `src/providerModelDiscovery.ts`

Productos：

1. Servicio de descubrimiento instantaneo de modelos.；
2. Compatibilidad actual con lotes de verificacion limitada：
   - Un lote de verificados. OpenAI-compatible `GET /models` Predeterminado
   - OpenRouter Limitado chat + embedding registry Agregacion
   - LiteLLM proxy-family `/models` + `/model/info`
   - Together `/models`
   - Anthropic `GET /models`
   - Ollama `GET /api/tags`
   - Google Gemini `GET v1beta/models`
   - Huawei Cloud MaaS `v2/models`
   - Vercel AI Gateway Limitado `/v1/models` + `v3/ai/config`
   - AIHubMix hosted registry
   - GitHub Models `catalog/models` + `/v1/models`
   - PPIO Limitado chat + embedding + reranker Agregacion
   - OVMS `/v3/models`，Y reversion limitada `/v1/config`
   - xAI `/v1/language-models`
3. Normalizacion de errores compartidos vs. graceful empty-result fallback。
4. si Google `nextPageToken`、Anthropic `has_more` / `last_id` Este tipo de paginacion registry Realice un recorrido delimitado de varias paginas。

Riesgos：

1. Dejar que los usuarios crean erroneamente que discovery A todos provider Todos son resultados autorizados.。

Mitigacion：

1. El primer lote solo admite endpoint La semantica es lo suficientemente estable. family；
2. Mantenlo siempre manual model Entrada；
3. Nunca persista en el control remoto catalog。

Punto de control actual：

1. Presionado y actualmente acotado family Llega el lote current main，Excepto el inicial OpenAI-compatible/Ollama/Google Ademas de la linea de base, ahora tambien incluye Anthropic、LM Studio、OpenRouter、LiteLLM proxy-family、Together、Huawei Cloud MaaS、Vercel AI Gateway、AIHubMix、GitHub Models、PPIO、OVMS con xAI；
2. Sigue siendo manual `model` Entrada para la persistencia source of truth；
3. No compatible provider Aun asi, volver a escribir manualmente en lugar de introducir textos pesados. catalog Subsistema。
4. gateway La divergencia acotada de ahora es explicita：Vercel AI Gateway Ahora habra fusion de limites. `/v1/models` con `v3/ai/config`；OpenRouter Ahora habra fusion de limites. chat con embedding catalog；LiteLLM Ve explicitamente proxy-family de `/models` + `/model/info` Fusion limitada；Huawei Cloud MaaS Camina exclusivamente `v2/models` registry endpoint；PPIO Camine dentro de los limites chat + embedding + reranker Fusion de tres vias；`OVMS` Priorizar el area local actual `/v3/models`，Retrocede cuando sea necesario `/v1/config`；`New API` Reutilizar compartido bounded OpenAI-compatible `/models` Camino；Hugging Face Luego unete a este camino compartido y ya no lo mantengas. manual-first。
5. Google con Anthropic en provider Al regresar al directorio del modelo de paginacion, tambien se realizara un recorrido delimitado de varias paginas para evitar fetch-model-list Detente en silencio en la primera pagina.。
6. compartir parser El refuerzo ahora tambien cubre una zona mas amplia. wrapped catalog shape，Por ejemplo `provider_models`、`providerModels`、`publisherModels`、`registry`、`registries` con `services`，Y a `models/<id>`、`publishers/<owner>/models/<id>` conservador resource-name normalization。

### Phase 4：UI Acceso

Productos：

1. en `model` Proporcione peso ligero cerca de los campos “fetch models” o suggestion surface；
2. discovery No debe haber ninguna dependencia de bloqueo en el proceso de guardar.；
3. Una vez discovery Si falla, el flujo de trabajo manual actual debe estar completamente disponible。

Punto de control actual：

1. fetch-models UI wiring Con instantaneo suggestion state Entro current main；
2. nuevo provider-panel surface de styling El apoyo esta en su lugar.；
3. README / update surface Ahora se ha descrito el mismo comportamiento limitado.。
4. “Mensaje de exito de la aplicacion” y discovered-models collapse-state/persistence Los comportamientos ahora tambien estan cubiertos por pruebas de comportamiento enfocadas.。
5. gateway/provider-prefixed Los modelos descubiertos de ahora tambien quedaran acotados token-cap guidance，Solo en owner Reutilizar solo cuando se pueda inferir de forma segura ceiling；generic `OpenAI Compatible` si bare model Los nombres siguen siendo conservadores y no es necesario adivinar sin contexto.。
5. discovery Los resultados ahora daran prioridad a retener modelos adecuados para la tarea de generacion de manera limitada para evitar embedding / reranker / speech / classifier Este tipo de lista de entradas que obviamente no es adecuada para el selector de pagina de configuracion actual tambien se puede sobrescribir. object-shaped proxy catalog con endpoint-type-aware listing Este tipo de patron de retorno mas amplio。
6. compartido OpenAI-compatible provider family Ahora tambien se mantiene explicitamente discovery/runtime Mantenga coherente el encabezado de compatibilidad y evite ciertas dependencias. `X-Api-Key` o provider-specific compatibility header El punto final esta en fetch-model-list Se produce una falla falsa en。
7. universales `OpenAI Compatible` Predeterminado en base URL Senalando OpenAI、DashScope/Qwen、Xiaomi MiMo、Fireworks、Hugging Face Este tipo de funcionario conocido y confiable host Cuando, ahora tambien deja bare model ID Reutilizar oficial provider de token-cap Metadatos, en lugar de requerir que se escriban estas escenas provider-prefixed gateway model ID。
8. Panorama general model-aware token guidance Ya no es solo una heuristica de "los valores son exactamente iguales": la linea principal actual ahora persiste explicitamente `globalModelAwareMaxTokensTracking` Marcar para habilitar la modificacion manual del modelo.、runtime request token ceiling、y reset/reload Los comportamientos comparten el mismo elemento cuando el usuario no se hace cargo del valor global auto-managed baseline Enlace de la verdad。
9. `Fetch model list -> Use` Ahora tienes independiente provider-scoped persistence lane：`discoveredModelMaxOutputTokensTracking`，Por lo tanto discovered-model autofill No mas pretender ser el panorama general max-token Gestion。
10. compartido discovery/runtime header owner Ahora pasa lo mismo endpoint-family seam Convergencia explicita, por lo que fetch-model-list Nunca volvere a estar contigo facilmente runtime En dependencia compatibility header de provider La deriva semantica ocurre en。
11. registry El momento del regreso owner/provider hint Tambien entrara ahora generic/custom gateway acotado bare-model token guidance，Asi como `gpt-4.1` + `owned_by: "openai"` Me gusta esto discovered row，Tambien se puede persistir sin obligar a los usuarios a model Cambiar a provider-prefixed ID Bajo la premisa de la conduccion segura provider output-token autofill con settings hint。

### Phase 5：Pruebas y documentacion

Cobertura de prueba que se debe completar.：

1. provider metadata Cobertura de regresion；
2. core/advanced agrupados UI rendering Cobertura；
3. Basado en la perseverancia advanced digno auto-expand Cobertura；
4. Apoyado endpoint family de discovery success/fallback Cobertura。
5. si wrapped provider/publisher catalog con resource-name normalization de registry-shape Cobertura。

Documentos que deben sincronizarse：

1. `README.md`
2. `README_zh.md`
3. Este articulo
4. Si el estado cambia, actualice sincronicamente canonical matrix/audit Documentacion

Punto de control actual：

1. enfocado i18n/test La actualizacion ha sido implementada. current main；
2. canonical La documentacion ahora describe esta linea como current-main Implementar la verdad en lugar de aislar el progreso；
3. Ahora se incluyen pruebas de verificacion. targeted provider-settings/model-discovery tests Con control completo de acceso al almacen.。
4. actual settings surface Tambien se indica claramente la situacion general. `Max tokens` con provider-specific output-token override relacion para reducir los “dos max tokens”El costo de la comprension causado。
5. El documento actual deberia considerarse ahora como current-main La verdad mantiene la documentacion, no pre-landing Proyecto de implementacion de。
6. actual host-side Las pruebas de verificacion siguen siendo asimetricas：
   - Verificado por esta maquina Obsidian de plugin reload/state inspection；
   - Usado focused Jest coverage Bloquear discovered-model apply feedback、provider override escribir, y fallback/manual-review sucursal；
   - Pero actualmente host de Obsidian CLI/runtime surface Aun no se ha expuesto una entrada de clic de escritorio limpia y programable, no se puede `Fetch model list -> Use` El enlace de clic real de la pagina de configuracion esta completamente automatizado.。

## 6.5 Este articulo lane Siguiente paso bounded direction

El siguiente paso no deberia ser seguir expandiendose provider Ancho, pero conviene ponerlo primero resolution stack Estabilizar。

Prioriza el corte：

1. Introducir explicito layered “output ceiling resolver” contract：
   - authoritative provider-native metadata（Si existe）
   - curated static registry
   - bounded host/owner-aware inference
   - transient discovery metadata
   - conservative fallback
2. en docs/tests/UI En 24 se distinguen mas claramente tres cosas.：
   - discovered model output ceiling
   - Actualmente escrito provider override
   - Controlado por los propios usuarios global response cap
3. mantener fallback Comportamiento fail-closed：
   - unresolved discovery No se pueden borrar o degradar los validos existentes provider override
   - fallback Los valores deben seguir anotandose explicitamente como fallback/manual-review Valor

## 7. No objetivos explicitos

No hagas estas cosas la primera vez：

1. Persistencia provider model catalog；
2. aumentar model CRUD management；
3. Copia todo Cherry Studio de provider domain；
4. A todos provider Reclame una cobertura completa de descubrimiento de modelos；
5. Antes de implementar la verificacion del canal de forma aislada, deje caer el producto semiacabado directamente a main worktree。
6. poner generic `OpenAI Compatible` de token owner Inferencia ampliada a trusted host、Explicito provider prefix O fuera de otros escenarios demostrables acotados。

## 8. Aplicacion de las normas

La ejecucion debe mantener la siguiente division del trabajo.：

1. `main` Solo lleva docs/progress truth，y mantener clean；
2. cuando control-plane Cuando el radio de explosion es grande, primero puedes isolated lane Promover una implementacion limitada en China；
3. Solo las implementaciones verificadas y limitadas se devuelven a la linea principal.。

Evidencia de verificacion de esta linea.：

1. targeted provider-settings/model-discovery tests；
2. completo `npm run build`；
3. completo `npm test -- --runInBand`；
4. `npm run audit:i18n-ui`；
5. `npm run audit:render-host`；
6. `git diff --check`。

Este proceso no solo mantiene honesto el valor real del plan durante el desarrollo, sino que tambien evita la verificacion a medias. control-plane Los cambios se extienden directamente al presente. main en。
