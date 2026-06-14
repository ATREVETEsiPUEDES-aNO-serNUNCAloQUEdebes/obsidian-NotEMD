# Area de China Provider Ampliar la segunda ronda de diseno.

**Fecha：** 2026-03-26

## Alcance

Este diseno cubre Notemd En la primera ronda de China provider Proxima ronda de expansion tras expansion：

1. nuevo `Qwen Code` Como un ajuste preestablecido independiente para escenarios de codificacion, en lugar de requerir que los usuarios reutilicen los comunes. `Qwen` Predeterminado。
2. nuevo `Z AI` Como version internacional GLM/Zhipu Entrada, con la existente orientada a China continental. endpoint de `GLM` Convivencia preestablecida。
3. nuevo `Huawei Cloud MaaS` Como ciudadano de primera clase, atendido a traves de Huawei Cloud OpenAI-compatible endpoint Usuarios que acceden al modelo de hosting。
4. Actualizar sincronicamente los materiales de prueba, documentacion y lanzamiento para que estos provider Entregado con el mismo umbral de calidad que los ajustes preestablecidos existentes.。

Esta ronda excluye explicitamente la necesidad de un nuevo mecanismo de autenticacion.、provider Exclusivo SDK Logico o nuevo transport Escribe provider。El objetivo es ampliar la region de China y el China-adjacent provider Cobertura。

## Arquitectura

provider El sistema debe seguir utilizandose. `src/llmProviders.ts` como preset Fuente unica de verdad para los metadatos. tres nuevos provider Todos deben comportarse como registry entry，Y reutilizar `src/llmUtils.ts` Existente en `openai-compatible` transport Camino。

No se deben introducir nuevos transport。runtime La llamada debe continuar hasta el lugar compartido. OpenAI-compatible request builder Y centralizado retry/fallback Logica。connection test Tambien debes seguir confiando en provider Metadatos, determina el preset Detectar primero `/models`，¿O deteccion directa? `chat/completions`。

Esto significa que la implementacion sigue siendo incremental.：

- en `src/llmProviders.ts` Nuevo en registry entry
- Agregar el archivo de prueba provider Afirmacion
- Actualizacion `README.md`、`README_zh.md` con `change.md`
- Utilice el bilinguismo existente release workflow Publicar un patch Version

## Provider Toma de decisiones

### 1. Qwen Code

`Qwen Code` Debe considerarse independiente. preset Anade en lugar de esconderte `Qwen` Sugerencias model Medio。

Razones：

- Ultimo Cline Se expondra por separado en lugar de mezclado en el general. Qwen abajo
- Buscar coding-specialized model Usuarios que esperan ver directamente seleccionables preset
- Se ajusta a lo existente OpenAI-compatible transport con chat-first API testing modelo

Forma esperada：

- transport：`openai-compatible`
- category：`cloud`
- API key mode：`required`
- API test mode：`chat-only`
- base URL：DashScope compatible-mode endpoint
- Predeterminado model：Por ejemplo `qwen3-coder-plus` Este tipo Qwen coding model

### 2. Z AI

Aunque Notemd Ya incluido `GLM`，`Z AI` Aun deberia servir como independiente. preset nuevo。

Razones：

- Ultimo Cline poner `Z AI` Tratelo como de primera clase provider，En lugar de repetir el nombre
- actual `GLM` preset Para China continental `open.bigmodel.cn`
- solo `Z AI` preset Puede proporcionar a los usuarios servicios internacionales. endpoint，Sin destruir lo existente `GLM` Comportamiento

Forma esperada：

- transport：`openai-compatible`
- category：`cloud`
- API key mode：`required`
- API test mode：`chat-only`
- base URL：Version internacional `https://api.z.ai/api/paas/v4`
- Predeterminado model：`glm-5`

### 3. Huawei Cloud MaaS

`Huawei Cloud MaaS` Deben ser tratados como ciudadanos de primera clase. preset，Para alojamiento en Huawei Cloud DeepSeek/Qwen Brindar soporte a usuarios de otros modelos.。

Razones：

- Ultimo Cline Ya construido directamente
- Tiene sentido agregar nuevas entradas en lugar de las existentes. preset Cambiar el nombre
- Su documentacion endpoint Puede incorporarse directamente a los ya existentes. OpenAI-compatible runtime

Forma esperada：

- transport：`openai-compatible`
- category：`cloud`
- API key mode：`required`
- API test mode：`chat-only`
- base URL：`https://api.modelarts-maas.com/v1`
- Predeterminado model：Por ejemplo `DeepSeek-V3` Un modelo de alojamiento de Huawei tan estable ID

## Componentes

### 1. Provider Registry

Modificacion `src/llmProviders.ts`：

- nuevo `Qwen Code`、`Z AI` con `Huawei Cloud MaaS`
- Coloquelos en un contexto relevante para provider En orden razonable adyacente
- Proporcionar descripciones precisas y setup hint
- Mantener las dependencias existentes de la pagina de configuracion provider Ordenar la semantica

### 2. Runtime Pruebas con conexiones.

Mientras provider Puede pasar `openai-compatible` No se deben agregar rutas runtime sucursal。

Las implementaciones deben continuar reutilizando el comportamiento compartido actual.：

- `callLLM()` Objetivo OpenAI-compatible Solicitado transport dispatch
- `testAPI()` De base media provider Metadatos OpenAI-compatible probing
- runtime Llame y conectese para probar la red transitoria compartida fallback

Por tanto, la nueva provider Necesita metadatos, no personalizacion runtime Ruta del codigo; a menos que la revision de la implementacion demuestre que hay algo que no se puede expresar a traves de los metadatos actuales provider Problemas de compatibilidad。

### 3. Documentacion

Actualizacion：

- `README.md`
- `README_zh.md`
- `change.md`

La documentacion debe indicar：

- `Qwen Code` Si coding-focused Predeterminado
- `Z AI` si `GLM` Complementar, no reemplazar
- `Huawei Cloud MaaS` Como alojado OpenAI-compatible Opciones disponibles

provider Listas, instrucciones de configuracion y preset Cobertura en dos ejemplares README Debe estar sincronizado。

### 4. Liberacion

Si no se implementan primero otras funciones no relacionadas durante este periodo, este trabajo debe usarse como una version de parche. `1.7.6` Liberacion。

Los requisitos del proceso de publicacion permanecen sin cambios.：

- GitHub release body Debe tener un parrafo completo en ingles y un parrafo completo en chino.
- release Los bienes deben contener `main.js`、`manifest.json`、`styles.css` con `README.md`

## Manejo de errores

nuevo provider Las acciones existentes deben heredarse. retry con transient-failure fallback Comportamiento。

Este diseno no aporta nada nuevo provider Normalizacion de errores de nivel. Si alguno de los siguientes provider Demostrar la necesidad de independencia response parser O no estandar auth header，Se deberia elaborar un diseno separado, ya que eso ampliaria el alcance del acuerdo mas alla de la ronda actual.。

Las normas actuales siguen vigentes.：

- No pongas fatal client-status failure Reintentar como error de red transitorio
- La desconexion momentanea aun se mantiene estable a traves de la existente fallback Reintento de ruta

## Estrategia de prueba

### Provider Registry Pruebas

Extension `src/tests/llmProviders.test.ts`：

- Afirmacion `Qwen Code`、`Z AI` con `Huawei Cloud MaaS` Existencia
- Afirmar su `transport` con `apiTestMode`
- Confirma que sean considerados. OpenAI-compatible provider

### Runtime Routing Pruebas

Extension `src/tests/llmUtilsProviderSupport.test.ts`：

- Afirmacion `callLLM()` Pondra cada nuevo provider Ruta a OpenAI-compatible runtime
- Afirmar lo que realmente se utiliza endpoint、auth header con model Los valores son los esperados.

### Cobertura de prueba de conexion

Extension `src/tests/llmUtilsProviderSupport.test.ts`：

- Afirmacion `testAPI()` Tratara cada nuevo provider Detectar lo esperado `chat/completions` Camino
- Afirmar la desconexion instantanea fallback Estos nuevos preset

### Verificacion completa

Antes de la publicacion：

- Ejecute primero la direccion provider Prueba, sigue TDD
- correr `npm test -- --runInBand`
- correr `npm run build`
- correr `git diff --check`
- Ejecutar existente Obsidian CLI Verificar y documentar con precision las limitaciones del entorno actual de la maquina.

## Revisar las instrucciones

Este diseno selecciona deliberadamente solo aquellos elementos que pueden incorporarse directamente al diseno existente. OpenAI-compatible transport de provider。Cualquier necesidad de exclusividad SDK、Proceso de firma o nueva capa de protocolo provider，Continuar posponiendo el procesamiento.。

Ningun usuario esta autorizado explicitamente para la delegacion de subagente para la sesion actual, por lo que no hay ningun usuario dedicado. spec-review Subagente. Este diseno se ha combinado con el actual. provider registry、Pruebe el diseno, las reglas de publicacion y las referencias publicas mas recientes al disenar. Cline provider Tabla de contenidos y provider Los documentos se someten a autorevision.。
