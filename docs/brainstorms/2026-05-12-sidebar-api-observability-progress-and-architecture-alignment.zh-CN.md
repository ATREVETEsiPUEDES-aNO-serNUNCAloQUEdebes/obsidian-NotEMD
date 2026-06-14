---
date: 2026-05-12
last_updated: 2026-05-12
topic: sidebar-api-observability-progress-and-architecture-alignment
---

# Sidebar API Observabilidad: comparacion en profundidad, progreso actual y direcciones de seguimiento

## 1. Linea base de alcance y requisitos

Este documento es para colocacion. sidebar API Planes especificos para el corte de observabilidad, implementacion real y evaluacion de direcciones de la siguiente etapa.。

Principales fuentes de demanda：

1. Los requisitos del lado del producto son footer `Log output` Entrega directa regional `Deep debug` cambiar
2. Los requisitos del lado del producto son ready/progress Proporcionar visible en la tarjeta. API Estado de las pruebas, incluido：
   - Espera API Salida
   - Recibir salida normalmente
   - 30 Recordatorio de salud de tareas largas despues de unos segundos
   - Respuesta recibida con exito
   - Interrupcion de salida
3. Se requiere claramente que al agregar funciones, se de prioridad a garantizar la estabilidad de las rutas publicadas existentes, y no se permita sacrificar la solidez por un estado "de apariencia mas rica".
4. El almacen tiene disciplina de estabilizacion, que proviene de `docs/superpowers/plans/2026-05-03-mainline-stabilization-next-batch.en.md`

Objetivos de entrega de esta porcion：

1. Utilice mas directo sidebar La retroalimentacion alivia las preocupaciones de los usuarios. provider Ansiedad por saber si estas “atascado”
2. deja deep debug Ya no dependas mas de "dejar la barra lateral primero" -> Abra la pagina de configuracion. -> Camino ineficiente de "retorno"
3. mantener transport Honestidad semantica: sin exagerar buffered / Sin transmision provider Estado de salud demostrable en tiempo real
4. Cubra archivos individuales, lotes, carpetas y enlaces de reintento para evitar solo happy-path Valido en escenario de solicitud unica

## 2. Estado actual y analisis de la causa raiz antes de los cambios.

Antes de esta porcion, el complemento ya tenia ciertos debug Con progress Habilidades basicas, pero con apoyo real./Todavia existen lagunas evidentes en el proceso de solucion de problemas.：

- `enableApiErrorDebugMode` Solo existe en la pagina de configuracion y no puede admitir la solucion de problemas en tiempo real.
- sidebar Aunque puede mostrar el progreso de las tareas generales, no puede responder las preguntas que mas preocupan a los usuarios.：“provider ¿Has devuelto algo ahora o la tarea ha fallado?？”
- retry Los intentos fallidos y el fracaso final residen en UI Falta de una distincion clara en los limites
- batch / folder El proceso envuelve cada archivo. mini-reporter，Si el nuevo canal de observacion no se transmite explicitamente y de forma transparente, es facil perderse silenciosamente en el camino real.

Resumen de las causas fundamentales：

1. **debug La accesibilidad es demasiado baja**
   El interruptor de diagnostico existe, pero no esta en la superficie de trabajo donde los usuarios pueden ver los registros en tiempo real.
2. **provider La observacion de la respuesta permanece en runtime Capas**
   transport Puedo saber el tiempo de respuesta, pero sidebar No existe ningun contrato para recibir y rendir estos hechos.
3. **La semantica del fracaso es demasiado tosca**
   Un fallo reintentable con interrupcion final, sin retry-aware Bajo la premisa del Estado, es facil ser UI Representar como "Error”
4. **Concurrencia/El procesamiento por lotes introduce una vulnerabilidad de agregacion**
   Si todavia utiliza un unico campo de estado global, es muy facil finalizar antes de tiempo o juzgar mal cuando hay varias solicitudes simultaneas.

## 3. Implementar mapeo (requisitos -> Evidencia del codigo）

| Demanda / Pregunta | Evidencia del codigo | Estado |
|---|---|---|
| Sidebar rapido `Deep debug` cambiar | `src/ui/NotemdSidebarView.ts` footer log header toggle | Ya implementado |
| El conmutador necesita volver a escribir la configuracion real del complemento. | `enableApiErrorDebugMode` Pase `plugin.saveSettings()` Persistencia | Ya implementado |
| Las rutas de exito tambien generan informacion de depuracion de respuesta sin procesar, no solo rutas de error. | `src/llmUtils.ts` en `logSuccessfulApiDebug()` | Ya implementado |
| Reutilizar la desensibilizacion existente debug schema，En lugar de hacer un segundo set | `getDebugInfo()` + shared runtime debug attempts | Ya implementado |
| Sidebar API Contrato de evento de prueba de vida | `src/types.ts` Medio `ApiLivenessEvent` / `ProgressReporter.updateApiLiveness()` | Ya implementado |
| Mantener una identidad de solicitud logica estable en todos los enlaces de reintento | `src/llmUtils.ts` Medio request-scoped reporter Encuadernacion + `src/types.ts` Medio `requestId` | Ya implementado |
| Solicitud de diferenciacion aceptada / Encabezado y cuerpo de la respuesta recibida | direct transport en el camino `response-headers` lanzamiento + `src/ui/NotemdSidebarView.ts` Medio accepted Representacion estatal | Ya implementado |
| No habra mas expansion footer Exponer la estructura bajo la premisa del estado. per-request Evidencia observacional | `src/llmUtils.ts` Medio request-scoped deep debug liveness logging | Ya implementado |
| para per-request La observabilidad proporciona la primera superficie de consumo de primera clase en lugar de registros de analisis inverso. | `src/ui/NotemdSidebarView.ts` en sidebar request activity summary + export report | Ya implementado |
| Proporcionar inline per-request Profundice, no solo exporte informes | `src/ui/NotemdSidebarView.ts` Medio active/recent request sections + inline history rows | Ya implementado |
| Se recibe el enlace de transmision. chunk Evento de prueba de vida ocasional | `src/llmUtils.ts` Medio `requestViaWebFetch*StreamTransport` Con `requestViaDesktopHttp*StreamTransport` | Ya implementado |
| Sin transmision provider Utilice una semantica de prueba conservadora de "ha llegado la respuesta" | `executeAnthropicApi`、`executeGoogleApi`、`executeAzureOpenAIApi`、`executeOllamaApi` Con OpenAI-compatible Camino al exito | Ya implementado |
| Distinguir entre fallos reintentables e interrupciones finales. | `callApiWithRetry()` Envia el cinturon `retrying: true/false` de `request-error` | Ya implementado |
| Evite solicitudes simultaneas sidebar Traduccion prematura completed/error | `src/ui/NotemdSidebarView.ts` Basado en `requestId` Solicitar tabla de estado | Ya implementado |
| batch/folder mini-reporter Evento de prueba de vida de transmision transparente | `src/fileUtils.ts` Con `src/operations/noteProcessingCommandHostAdapter.ts` | Ya implementado |
| nuevo sidebar La redaccion publicitaria esta disponible i18n Cobertura | `src/i18n/locales/en.ts`、`zh_cn.ts`、`zh_tw.ts` | Ya implementado |
| Centrarse en el comportamiento de bloqueo de las pruebas de regresion | `src/tests/sidebarDomButtonClicks.test.ts`、`llmUtilsProviderSupport.test.ts`、`noteProcessingCommandHostAdapter.test.ts` | Ya implementado |

## 4. Evaluacion del avance de la arquitectura.

El valor de esta porcion radica en "estrechar el limite de observacion" en lugar de "agregar mas estados deslumbrantes".”：

1. **Promovido desde el diagnostico de la pagina de configuracion al diagnostico de adyacencia en tiempo de ejecucion**
   debug Los controles ahora estan ubicados donde los usuarios ven los registros en tiempo real, sin la necesidad de volver a abrir la arquitectura de configuracion global.
2. **De transport Hechos promovidos a explicitos. UI Contrato**
   provider Ahora se escribe el tiempo de respuesta. progress-reporter Entrada al canal UI，En lugar de confiar en adivinar cadenas de registro
3. **Pasar del fracaso general al retry-aware Semantica del fracaso**
   Ya no es necesario disfrazar las fallas transitorias como interrupciones finales
4. **Actualizacion del supuesto de solicitud unica al request-keyed Agregacion concurrente**
   sidebar El estado de prueba en vivo ahora puede tolerar con precision solicitudes superpuestas, incluso si varias solicitudes provienen del mismo provider Tampoco pisaran el estatus del otro.
5. **De aspero footer Estado mejorado a request-scoped Evidencia de depuracion**
   deep debug Estructurado ahora se registrara liveness Esta bien（`requestId`、Solicitudes logicas attempt、phase、transport、conocido `statusCode`），Sin tener que seguir ampliando el modelo de estado de usuario final
6. **Pasar de evidencia de depuracion unicamente a evidencia reutilizable request activity Superficie de trabajo**
   sidebar Ahora basado en lo mismo live event stream Persistencia request-scoped activity Resumen y Exportable per-request Historial, admite la resolucion de problemas y ya no depende de copiar el registro original y reconstruir manualmente la sincronizacion
7. **De report-only El nivel de consumo aumento a inline Profundizar**
   request-scoped El historial ahora esta disponible directamente en sidebar Dentro active/recent timeline Vista de formulario, inferior live run Inspeccion media retries Con terminal transitions Costo de

Esta rebanada**No**Cosas que hacer：

1. No hecho per-provider La linea de tiempo en tiempo real no esta disponible. footer Exponga directamente el original. transport metadata
2. Sin reclamaciones buffered / Sin transmision provider Demuestre que "generar texto continuamente" antes de que llegue el objeto de respuesta completo”
3. Sin cambios provider La semantica del protocolo no se extiende a packaging/runtime Transformacion de topologia

## 5. Comparacion en profundidad con las orbitas del esquema anterior.

### 5.1 Derecha `mainline-stabilization-next-batch` Alineacion de

Puntos de acuerdo：

1. Esta es una estabilidad/Endurecer las porciones para lograr operatividad, no para una expansion especulativa del producto
2. Sigue las reglas de implementacion existentes en el plan: contratos tipificados -> Centrarse en las pruebas -> Control de acceso total -> Sincronizacion de documentos
3. Mejora el soporte publicado./Solucion de problemas, pero sin reabrir los irrelevantes runtime-packaging Toma de decisiones

Diferencias：

- Lo que esta seccion promueve es el limite de observacion en el lado del producto, en lugar de packaging/release Limites

### 5.2 Derecha release-chronicle / CI Alineacion de los trabajos de refuerzo.

Puntos de acuerdo：

1. Lo mismo se aplica anti-drift Patron: concentre los valores verdaderos en el codigo del almacen y luego utilice pruebas enfocadas para bloquearlo.
2. Sigue igual evidence-first Normas de cierre: importe total build/test/audit/diff/Obsidian wrapper Marcar todo Mantener

Diferencias：

- Esta porcion mejora la observabilidad del tiempo de ejecucion del lado del usuario.；release-chronicle La segmentacion mejora las capacidades de recuperacion de versiones del mantenedor.

### 5.3 Derecha packaging / semantic-verification convergence Alineacion de pistas

Puntos de acuerdo：

1. Ambos boundary-hardening Trabajo
2. Ambos evitan explicitamente exagerar las capacidades de la arquitectura actual.
3. Ambos docs/tests/code Considerada como la misma superficie de verdad.

Diferencias：

- Este segmento no comienza Stage-C packaging Implementacion de topologia
- No debe malinterpretarse como heavy-runtime isolation o per-request semantic verification Resuelto

## 6. Valores de verdad semantica para resultados sin transmision

Este es el punto de la implementacion actual que debe quedar claro en la documentacion y el trabajo de seguimiento.。

### 6.1 Transmision provider / transport

Para rutas de transmision，`response-chunk` significa：runtime De hecho ha sido provider transport Byte de respuesta recibido / chunk。

Esta es una verdad liveness Senal。

### 6.2 Buffered / Sin transmision provider

Para buffered / Ruta sin transmision，runtime Por lo general, no se puede probar antes de que llegue el objeto de respuesta completo.“provider Generacion continua de resultados de texto”。

El comportamiento actual es deliberadamente conservador：

1. `request-start` hacer sidebar Ingrese waiting
2. Si direct transport Exponga realmente el encabezado de respuesta antes de que llegue el cuerpo.，runtime Se puede emitir `response-headers`，UI Representarlo como "Solicitud aceptada / Espere el mensaje de texto”
3. Si no existe tal transport Evidencia，UI Seguira quedandose en waiting
4. Cuando este completo response object O despues de que los bytes de texto esten realmente disponibles.，runtime Emitir unicamente eventos conservadores de "llego la respuesta"（`response-chunk`）y continuar complete

Esto significa：

- Ruta convectiva, “salida normal” verde……”Esta establecido por una fuerte semantica.
- Azul actual accepted El estado solo representa“transport Solicitud aceptada y expuesta headers”，No significa que "el texto se haya publicado continuamente”
- Derecha requestUrl-only O ninguno header timing Probatorio buffered Ruta, la implementacion actual solo reclamara "respuesta recibida" cuando haya llegado el objeto de respuesta; no forjara la conclusion de que "el servidor todavia esta en buen estado y continua funcionando" durante la fase de espera.

Esta es la eleccion correcta en esta etapa. Cualquier conclusion mas solida requeriria pruebas adicionales de acuerdo, p. request ID、response headers timing，O el servidor toma la iniciativa heartbeat。

## 7. Lista de riesgos y medidas de control.

1. **Riesgos：** Un reintento fallido puede convertirse en un error final, enganando a los usuarios.。
   **controlar：** `request-error` Trae ahora `retrying`，sidebar Mantendra los fallos reintentables fuera del estado rojo final.。
2. **Riesgos：** Una determinada solicitud se completa primero, lo que finaliza erroneamente el estado de prueba de otra solicitud que aun se esta ejecutando, especialmente cuando varias solicitudes provienen de la misma solicitud. provider horas。
   **controlar：** sidebar Ahora basado en `requestId` Derivacion de la tabla de estados UI，En lugar de confiar en provider Nombre o agregacion de conteo puro。
3. **Riesgos：** batch/folder mini-reporter Perdio el nuevo canal de medicion de actividad.。
   **controlar：** mini-reporter La transmision transparente se ha abierto explicitamente, y hay host-adapter Volver a bloquear。
4. **Riesgos：** Documentacion o UI Exageracion en la redaccion publicitaria buffered / Semantica de salud sin transmision。
   **controlar：** Tanto este documento como el codigo definen el comportamiento sin transmision como "llegada de respuesta conservadora" en lugar de adivinar "salida saludable en progreso".”。
5. **Riesgos：** Futuro transport Reconstruya el comportamiento de observacion de la averia, pero la funcion de superficie todavia "parece ejecutarse"”。
   **controlar：** provider/transport Las pruebas de soporte ahora afirman directamente liveness Evento en lugar de simplemente mirar el texto de devolucion final。
6. **Riesgos：** deep debug Los registros son demasiado ruidosos en la salida de streaming, lo que ahoga la informacion valida.。
   **controlar：** Estructura liveness logging Usara la misma logica. attempt Repetido dentro `response-chunk` Haz remocion de peso, cada uno attempt Quedate solo con uno chunk-transition Linea。
7. **Riesgos：** UI Exportar/Superficie de perforacion y live liveness El modelo se bifurca y comienza a contar la historia sobre footer Historias de estatus inconsistentes。
   **controlar：** Los informes de exportacion ahora estan directamente impulsados por el consumo. sidebar La misma porcion del agregado request-scoped record store，En lugar de reconstruir el estado a partir de registros replicados。
8. **Riesgos：** inline timeline El truncamiento es demasiado severo, lo que hace que el estado de conversion que mas se necesita se descarte silenciosamente.。
   **controlar：** visible history Mantenga la ventana lo suficientemente pequena como para cubrir retries + acceptance + terminal states；Copiar el informe aun conserva una imagen mas completa. retained history。

## 8. Verificacion de pruebas

Ejecutado y aprobado：

1. `npm run build`
2. `npm test -- --runInBand`
3. `npm run audit:i18n-ui`
4. `npm run audit:render-host`
5. `git diff --check`
6. `obsidian help`
7. `obsidian-cli help`

nuevo / Los retornos de enfoque actualizados incluyen：

1. sidebar Transferencia del estado de la actividad de prueba、accepted Con receiving Distinguir, indicaciones de larga espera y atajos debug toggle Persistencia
2. provider runtime Soporte bajo prueba retry-aware liveness Afirmaciones de eventos, y `requestId` Continuidad estable en los enlaces de reintento.
3. deep debug Estructura liveness logging Derecha `requestAttempt`、`statusCode` con cruz attempt retry Cobertura continua
4. batch concept extraction Debajo del camino per-file liveness Acontecimientos al Senor reporter Transmision transparente
5. sidebar request-activity Representacion e informes de cobertura de exportacion sin analisis de registros
6. sidebar active/recent timeline section Con inline history row Cobertura

## 9. Progresos actuales y direcciones futuras

Despues de que aterrice este trozo，`main` El estado anterior es：

1. quick deep debug Ya se puede acceder directamente desde la superficie de trabajo de registro en tiempo real.
2. sidebar La prueba en vivo ahora puede expresar waiting / accepted / receiving / healthy-long-running / received / interrupted
3. retry La semantica y la agregacion de solicitudes simultaneas ahora se han ajustado para `requestId` Granularidad, no solo contar granularidad
4. deep debug Ahora incluye estructuracion. per-request liveness La evidencia ya no obliga a respaldar que la solucion de problemas solo puede basarse en la generalizacion. progress log Etapa de retroceso
5. sidebar Ahora disponible por primera vez request-scoped API activity Superficie de trabajo, pudiendo basarse en la misma. live liveness Informe de exportacion de registros
6. sidebar Ahora tambien ofreciendo la primera inline active/recent request timeline，Los usuarios pueden ver directamente los eventos recientes sin copiar registros. phase transition
7. batch/folder El flujo de trabajo ya no pierde silenciosamente las senales de actividad de prueba.

Proximos pasos sugeridos：

1. **Sigue expandiendote per-request Estructurar la profundidad de la evidencia en lugar de continuar agregando al estado global**
2. **mantener preview fallback Con observability en release Alineacion de superficies.**
   1.8.8 Ya compacto API activity Con direct saved-artifact preview fallback Empaquetado en la misma ronda de lanzamiento. El trabajo posterior en la superficie del producto debe continuar manteniendo esta capa de convergencia.：sidebar Muestre informacion util sin saturar los registros. transport valor de verdad, mientras diagram preview Para seguir pudiendo verificar los productos guardados compatibles sin volver a ingresar el enlace de compilacion。
   export/report Con inline drill-down Todos han sido implementados; Si continuamos desarrollando herramientas de soporte en la siguiente etapa, se debe dar prioridad a las estrategias de retencion, los diagnosticos guardables o herramientas mas completas. per-request timing metadata，En lugar de continuar en footer Rama condicional del monton de nivel
2. **Mantengase sin transmitir provider Conclusion conservadora**
   A menos que transport Si hay evidencia real, de lo contrario no actualice la espera larga sin transmision al "Resultado de estado de la tarea" verde”
3. **Solo si transport Realmente revelador acceptance Solo ampliar cuando haya evidencia accepted Semantica**
   requestUrl-only Esperando rutas en el codigo que no se pueden probar de forma segura antes acceptance Antes, deberia seguir quedandose en waiting

## 10. Esta conclusion

Por que vale la pena esta porcion `main`，No porque tenga “unos cuantos estados mas”, sino porque acerca al estado a la realidad.：

- deep debug Llega mas rapido
- retry No mas pretensiones de fracaso final
- Las solicitudes simultaneas ya no se aclaran prematuramente footer Estado, aunque sea el mismo provider Expresion estable incluso si hay solicitudes superpuestas
- Solicitud aceptada / Se recibio el encabezado de respuesta y ya no se informara falsamente como "texto de salida".”
- deep debug Ahora lleva request-scoped liveness Evidencia en lugar de conjeturas a partir de registros de generalizacion retry/phase
- sidebar Ahora puedes acceder directamente al live records Exportar request-scoped API activity，En lugar de copiar el registro original y restaurar manualmente el enlace
- sidebar Ahora el primero tambien se proporciona directamente. inline active/recent timeline，Puedes ver los reintentos recientes y las transiciones finales sin salir del panel.
- Sin transmision provider Ser tratado de manera conservadora en lugar de dramatizar "La salud que estimula el cerebro"”

Esto lo convierte en el de hoy. `main` Es sostenible y sustentable y, al mismo tiempo, proporciona la base para un mayor desarrollo en el futuro. per-request observability Permite un camino de evolucion limpio sin inflar los valores de verdad del tiempo de ejecucion actual.。
