---
date: 2026-05-01
topic: llm-backward-compat-progress-audit
---

# LLM Invocar compatibilidad con versiones anteriores y auditoria de progreso. (v1.8.2)

## Definicion del problema

LLM La capa de llamadas ha completado las siguientes actualizaciones.：
1. Cline alineado `KNOWN_MODEL_MAX_OUTPUT_TOKENS` Tabla de metadatos
2. Basado en el conocimiento del modelo. `resolveProviderTokenLimit` Calculo del limite superior del token
3. Exclusivo del proveedor UI Controles（DeepSeek Piensa en cambiar、Azure API Version, etc.）
4. Normalizacion del campo de borde en el analizador de especificaciones de graficos

Estos cambios no deben alterar las configuraciones de usuario existentes: en v1.8.1 El proveedor configurado en v1.8.2 Debe funcionar correctamente sin reconfiguracion.。

## Auditoria de compatibilidad con versiones anteriores

### `resolveProviderTokenLimit` Matriz de comportamiento

| Escena | v1.8.1 | v1.8.2 | Compatibilidad？ |
|---|---|---|---|
| Modelos conocidos + Predeterminado maxTokens | 8192（Panorama general） | Limite superior del modelo conocido (como Claude 128K） | **Mejora** — Mejores tapas, sin roturas |
| Modelos conocidos + Personalizacion maxTokens（Por debajo del limite superior） | Valor para el usuario | Valor del usuario (sin cambios） | ✓ |
| Modelos conocidos + Proveedor maxOutputTokens Cobertura | Valor de cobertura (sin limite superior)） | min(Valores primordiales, Limite superior conocido) | **Mejora** — Restricciones mas seguras |
| Modelo desconocido + Predeterminado maxTokens | 8192 | undefined（API A tu propia discrecion，Cline Alineacion） | **Cambios de comportamiento** — API El valor predeterminado puede ser el mismo que 8192 diferente |
| Modelo desconocido + Personalizacion maxTokens | Valor para el usuario | Valor del usuario (sin cambios） | ✓ |
| Prueba de conexion | 1 | 1（Sin cambios） | ✓ |

**"Cambios de comportamiento"Evaluacion de riesgos de las celulas.：**
- A lo desconocido/Dependencias del nuevo modelo. `maxTokens: 8192` Los usuarios predeterminados ahora obtendran API Valores predeterminados del propio proveedor。
- si OpenAI-compatible Punto final, esto generalmente significa el valor predeterminado del modelo en si (generalmente mas alto que 8192）。
- Esta es una mejora suave: el viejo 8192 Los limites son arbitrarios y pueden limitar las capacidades.。
- Los usuarios no necesitan realizar ningun cambio de configuracion.。

### Compatibilidad con versiones anteriores de la capa de transporte

| Transmision | v1.8.1 | v1.8.2 | Cambios？ |
|---|---|---|---|
| OpenAI-compatible | pasar `callOpenAICompatibleApi` Tiempo de ejecucion compartido | Lo mismo, agrega `resolveProviderTokenLimit` | Solo analisis de tokens |
| Anthropic | Nativo Messages API | Mismo | Solo analisis de tokens |
| Google | Nativo Gemini API | Mismo | Solo analisis de tokens |
| Azure OpenAI | Modo de implementacion | Mismo | Solo analisis de tokens |
| Ollama | Nativo Ollama API | Mismo | Solo analisis de tokens |

No hay cambios de ruta de transporte. Sin cambios de protocolo. todos los existentes API Clave, base URL Y modelos ID Continuar sin cambios。

### Compatibilidad con versiones anteriores definida por el proveedor

todos 25 Las definiciones de proveedores permanecen sin cambios. Solo nuevo：
- `KNOWN_MODEL_MAX_OUTPUT_TOKENS` Tabla (busqueda de solo lectura, no afecta la configuracion del proveedor)）
- `LLMProviderConfig` en `maxOutputTokens` Campo (opcional, predeterminado undefined — Sin impacto en las configuraciones existentes.）

### Establecer compatibilidad con versiones anteriores de pestanas

- Controles especificos del proveedor（DeepSeek Piensa、Azure API Version) controlada por el nombre del proveedor
- No OpenAI Pantalla de transmision `maxOutputTokens` Campo (nuevo, opcional）
- Todos los campos de configuracion existentes permanecen en sus posiciones originales.
- No se requiere configuracion de migracion

### Compatibilidad con versiones anteriores del canal de graficos

- `diagramSpecResponseParser.ts` en `normalizeSpec` Ahora procesando `source`/`target` → `from`/`to`
- `buildDiagramSpecPrompt` Ahora se dan instrucciones claras LLM Utilice nombres de campos de borde
- Existente Mermaid El resultado se mantiene sin cambios; solo LLM Las especificaciones generadas se benefician de la normalizacion.
- Version antigua Mermaid Arreglar el camino no tocado

## Progreso de la arquitectura actual. vs Requisitos del programa

Documentacion de referencia：
- `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md`
- `docs/brainstorms/2026-04-14-diagram-platform-phase-2-requirements.zh-CN.md`

### Tarea 0：Construccion y embalaje de la base - entregada (aplican restricciones)）

| Requisitos | Estado | Evidencia |
|---|---|---|
| El host de renderizado es autonomo en main.js | ✓ | `scripts/audit-render-host-bundle.js` pasar |
| Smoke Gate prohibe los recursos externos del host | ✓ | El flujo de trabajo de lanzamiento incluye auditoria |
| Estrategia de construccion de entradas multiples | ✗ | `esbuild.config.mjs` Todavia entrada unica |

### Tarea 1：Modelo de dominio grafico y enrutamiento de intencion: entregado

Se han implementado todos los tipos, validadores, planificadores y rutas de intencion. Prueba superada。

### Tarea 2：Integracion de Spec-First Pipeline: parcialmente completa

| Requisitos | Estado |
|---|---|
| Compartir `generateDiagramCommand` Actuador | ✓ |
| Version antigua/Se ha convergido la compatibilidad con doble carril | ✓（Se ha unificado la orquestacion interna.） |
| Superficie de mando publico integrada | ✗（Comandos duales ID Aun coexistiendo） |
| `promptUtils.ts` Version antigua Mermaid El aviso ha sido retirado. | ✗ |

**Restricciones duras：** `promptUtils.ts` Version antigua en Mermaid Las palabras clave estan especialmente adaptadas a la escena original. Cualquier expansion o retiro debe preservar completamente la usabilidad de la escena original. La estabilidad entre versiones y la continuidad de la experiencia del usuario tienen prioridad sobre la limpieza. comando ID La integracion sigue siendo el proximo objetivo; Se sugiere que el desmantelamiento primero debe pasar por un proceso real. Obsidian Verificacion. No bloquear v1.8.2。

### Tarea 3：Mermaid Adaptador V2 — Parcialmente completado (suspendido segun instrucciones del usuario)）

Segun instrucciones del usuario，MermaidProcessor Descomponerse en suspensiones de estabilidad.。

**Restricciones duras：** Cada subtarea debe ser real Obsidian El avance solo se puede realizar despues de una verificacion independiente en la instancia. Las imagenes de salida del grafico deben guardarse, revisarse y verificarse para que esten completas y correctas. Las pruebas unitarias por si solas no son suficientes para abarcar los limites de ninguna subtarea. Estado actual：
- Anulacion del adaptador de subtipo mindmap、flowchart、sequence、class、ER、state
- Las fugas de tuberias se gestionan en la fase de lanzamiento del adaptador.
- `legacyFixerUtils.ts` Ya desde `mermaidProcessor.ts` Extraccion
- La descomposicion completa no es completa, por v1.8.2 La estabilidad es intencional

### Tarea 4-7：Entregado

Esqueleto de plataforma de renderizado、JSON Canvas Salida、Vega-Lite Produccion (limitada), tema/Exportar/Se han implementado mejoras en la version.。

### Tarea 8：Motor avanzado: retrasado por diseno

PlantUML、Graphviz、Draw.io Segun los requisitos de la etapa dos. R10 Mantenlo pospuesto。

## Direccion de seguimiento

v1.8.2 Prioriza el trabajo despues：

1. **Convergencia de comandos** — unificacion `summarize-as-mermaid` y `generate-experimental-diagram` Superficie de mando
2. **Retiro de las indicaciones de la version anterior.** — de `promptUtils.ts` Quitar `mindmap` Avisos vinculantes
3. **Empaquetado en tiempo de ejecucion** — Tiempo de ejecucion para vista previa completa（Vega-Lite、futuro PlantUML）Crea una compilacion de entradas multiples.
4. **MermaidProcessor sunset** — Completar `legacyFixerUtils.ts` Desglose de la puesta en marcha
5. **PlantUML Puerta de evaluacion** — Solo antes 4 Cuando el elemento este completo, presione R10

v1.8.2 Limites de rango de：
- Integracion sin comando (riesgo demasiado alto cerca del lanzamiento)）
- Jubilacion silenciosa
- No se agregaron nuevos proveedores
- No hay cambios en el sistema de compilacion.
- Solo：LLM Mejora del analisis de tokens + Normalizacion de los bordes del grafico

## Puerta de verificacion

todos CI Verificacion de equivalencia aprobada.：
- `npm run build` ✓
- `npm test -- --runInBand` ✓（111 equipo，592 Pruebas）
- `npm run audit:i18n-ui` ✓
- `npm run audit:render-host` ✓
- `git diff --check` ✓

## Toma de decisiones

1. **Cline Comportamiento de alineacion del modelo desconocido**：cuando `maxTokens` es el valor predeterminado（8192）Cuando se desconoce el modelo, regresar `undefined` → API A exclusivo criterio del proveedor. Los valores definidos por el usuario se conservan。
2. **Normalizacion del campo de borde**：Incluir siempre en el analisis de especificaciones del grafico. `source`/`target` Normalizado a `from`/`to`，No importa LLM ¿Que convencion se prefiere?。
3. **MermaidProcessor Suspension**：Segun las instrucciones explicitas del usuario, v1.8.2 Descomposicion por salto de estabilidad。
4. **Sin cambios de transferencia**：Todos 5 La transferencia se realiza sin cambios. Solo se modifico la logica de analisis de tokens。

## Siguiente paso

Enviar a main。Marca cuando este listo v1.8.2。Inicie la convergencia de comandos en el siguiente lote。


## Referencia cruzada：notebook-navigator Patrones de diseno

Referencia：`https://github.com/johansan/notebook-navigator` (v2.5.6)

notebook-navigator Es un complemento del navegador de notas.（React、IndexedDB、Desplazamiento virtual、10 Diez mil+ tamano de la nota). Ninguno LLM Integracion. El valor de referencia cruzada reside en su**Modo de ingenieria**，Mas que una superficie funcional。

### patron 1：Capa de servicio con inyeccion de dependencia.

**NN Planificar：** 23 organizaciones de servicios en `src/services/` En el subdirectorio de。`ServicesContext` pasar React El contexto proporciona acceso unico. Cada servicio tiene propiedad unica, ciclo de vida claro y dependencias explicitas.。

**NotEMD Brecha：** `src/llmUtils.ts`（aprox. 3000 fila) y `src/fileUtils.ts` Es un archivo de herramienta unica y no tiene limites de servicio. Todas las funciones se exportan globalmente, sin inyeccion de dependencia.。

**Mejorar los angulos：** Extraccion `LlmService`（Embalaje `callLLM`、`testAPI`、`resolveProviderTokenLimit`）y `FileProcessingService`（Embalaje `processFile`、Operaciones por lotes, extraccion de conceptos). Preservar las firmas de funciones exportadas existentes para compatibilidad con versiones anteriores; delegar internamente a envoltorios de clases de servicio. No bloquear v1.8.2。Mejoras de mantenibilidad。

### patron 2：Almacenamiento por niveles con invalidacion de cache

**NN Planificar：** IndexedDB（Persistencia）→ MemoryFileCache（Duplicacion sincronizada）→ LRU Almacenamiento en cache (vista previa de texto, imagenes destacadas). Basado en mtime Actualizaciones incrementales。vault Reconstruccion de cache en caso de cambio。

**NotEMD Brecha：** Sin capa de almacenamiento en cache. Recuperar cada llamada LLM Respuesta. La salida del grafico se regenera desde cero。`RenderCache` Existe pero solo en la memoria, alcance de la sesion.。

**Mejorar los angulos：** Presione (provider, model, prompt hash, content hash) Claves de almacenamiento en cache LLM Capacidad de respuesta, reduciendo el procesamiento repetitivo API Costo. prensa (markdown hash, intent, target) Especificaciones del grafico de cache para claves。Obsidian de `localStorage` o vault Proximidad JSON La documentacion es suficiente（IndexedDB si NotEMD El modelo de procesamiento de archivos unicos esta sobredisenado）。v1.8.2 Despues。

### patron 3：Configure el interruptor de sincronizacion elemento por elemento

**NN Planificar：** Cada configuracion tiene un interruptor de sincronizacion (icono de nube). habilitar → `data.json`（Sincronizacion entre dispositivos). Desactivar → `localStorage`（Dispositivo local). Etiquetas de sincronizacion no globales; granularidad articulo por articulo。

**NotEMD Brecha：** Todos los ajustes se almacenan en `data.json`。Proveedor API Sincronizacion de claves entre dispositivos (si vault Existen riesgos de seguridad al compartir). Las preferencias del flujo de trabajo tambien estan sincronizadas (puede que no sean necesarias)）。

**Mejorar los angulos：** en `LLMProviderConfig` Agregar `localOnly` Marcado. Al realizar la instalacion, la configuracion del proveedor (incluido API Clave) deposito Obsidian de `localStorage` En lugar de `data.json`。API Las claves permanecen locales en el dispositivo y la configuracion del flujo de trabajo se puede sincronizar。

### patron 4：Procesamiento de canalizacion con senal de finalizacion.

**NN Planificar：** La canalizacion de metadatos tiene 3 Capas（vault Sincronizacion → Contenido derivado → indice de arbol), con senal de finalizacion explicita. Procesamiento en segundo plano con seguimiento del progreso。

**NotEMD Brecha：** Procesamiento por lotes（`processFolder`、`batchTranslate`、`batchGenerateContent`）Ejecucion secuencial, informe basico de avance. Sin etapas de proceso, sin senales de finalizacion, sin recuperacion post-interrupcion。

**Mejorar los angulos：** El procesamiento por lotes se estructura en etapas de canalizacion.：(1) Descubrimiento de archivos + mtime comprobar，(2) LLM Procesamiento incluido el reintento，(3) Escritura de archivos + Actualizacion de metadatos. Realice un seguimiento del estado de finalizacion de archivo por archivo para su recuperacion despues de una interrupcion. Agregar almacenamiento de progreso（vault Proximidad JSON）en Obsidian Persistencia del estado del lote entre reinicios。

### patron 5：Documentacion de arquitectura.

**NN Planificar：** 8 Un documento de arquitectura dedicado que cubre el proceso de inicio, la canalizacion de metadatos, la arquitectura de almacenamiento, la arquitectura de representacion, la orquestacion continua y la arquitectura de servicios. Todo incluido Mermaid Graficos. con fecha。

**NotEMD Situacion actual：** 36 paginas del documento. planear/Lluvia de ideas/Hoja de ruta solida. Arquitectura walkthrough Debil. No hay una descripcion general de la arquitectura de una sola pagina que muestre todo el sistema。

**Mejorar los angulos：** Agregar `docs/architecture.md`（Bilingue), Presentacion: Registro de Proveedores → Analisis de tokens → Transmision y distribucion → LLM Llamar → Analisis de respuestas y canalizacion de graficos.：spec prompt → LLM Llamar → spec Analisis → Distribucion del renderizador → Vista previa/Exportar. Contiene Mermaid Graficos. Hacer que el sistema sea comprensible sin leer el codigo fuente.。

### Mejorar el resumen de prioridades

| # | patron | Prioridad | Cantidad de trabajo | Bloqueo v1.8.2？ |
|---|---|---|---|---|
| 1 | Capa de servicio + DI | bajo | alto | No |
| 2 | LLM Almacenamiento en cache de respuestas | Medio | Medio | No |
| 3 | Configure el interruptor de sincronizacion elemento por elemento | bajo-Medio | bajo | No |
| 4 | Canalizacion por lotes con recuperacion | Medio | Medio | No |
| 5 | Documento de descripcion general de la arquitectura | bajo | bajo | No |

Todo sin bloqueo v1.8.2。Todas las mejoras despues del lanzamiento.。

## Progreso final

| # | patron | Prioridad | Estado |
|---|---|---|---|
| 2 | LLM Almacenamiento en cache de respuestas | Medio | ✓ |
| 4 | Canalizacion por lotes con recuperacion | Medio | ✓ |
| 3 | Configure el interruptor de sincronizacion elemento por elemento | bajo-Medio | ✓ |
| 1 | Capa de servicio + DI | bajo | Ampliacion (elemento arquitectonico） |
| 5 | Documento de descripcion general de la arquitectura | bajo | ✓ |
| — | Selector de intencion de grafico preferido | — | ✓ |

notebook-navigator Referencias cruzadas 5 patrones ahora completos。
Division de la capa de servicio (modo #1）es el unico termino posterior retenido, ya que v1.8.x La refactorizacion arquitectonica posterior deberia posponerse y no apresurarse.。

## 2026-05-02 —— Auditoria de progreso completo

Se ha completado una auditoria de extremo a extremo para verificar cada elemento con el codigo actual, los requisitos del plan existente y las restricciones estrictas. Las conclusiones clave se registran en `docs/brainstorms/2026-05-02-progress-audit-and-next-direction.zh-CN.md`。

### Resumen del estado actual

- **Tareas de la hoja de ruta**：8 El articulo ya existe 7 El articulo ha sido entregado total o parcialmente; la tarea 8（Motor avanzado) retrasado por diseno。
- **notebook-navigator patron**：5 El articulo ya existe 4 Implementacion del articulo; patron #1（Extension de la capa de servicio。
- **Restricciones duras**：Ambos articulos siguen vigentes. —— MermaidProcessor Descomposicion y legacy prompt La jubilacion aun debe ser cierta Obsidian Verificacion。
- **Cobertura de prueba**：110  suites，708 pruebas (incluidas nuevas README Prueba del contrato de alineacion）。
- **Verificacion en tiempo real**：Localidad historica DeepSeek La verificacion alguna vez lo cubrio todo. 8 Tipos de intencion de graficos, pero estos live tests Ya no actua `main` Umbrales controlados a nivel de almacen。

### Direccion en tiempo real del siguiente paso

1. Ordena a la superficie que se cierre (unifica 3 Comandos de graficos）
2. Empaquetado en tiempo de ejecucion (creacion de compilaciones de entradas multiples para tiempos de ejecucion pesados).）

Ambas cosas se pueden hacer sin depender de la verdad. Obsidian Avance basado en pruebas. Los asuntos restantes todavia estan bloqueados por duras limitaciones.。

### CI Estado

Propiedad local CI Se han superado los controles de equivalencia. extremo lejano release workflow Ya en `1.8.4` Camino（`25274341984`）El refuerzo esta completo y permanece verde, mientras `main` Todavia deliberadamente no ordinario push/PR CI Estado de。
Restante actual CI Trabajo relacionado, el nucleo es aclarar la fuente de los hechos en el documento, en lugar de lidiar con una falla de rama sin resolver.。
