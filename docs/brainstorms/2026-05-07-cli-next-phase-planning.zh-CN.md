---
date: 2026-05-07
topic: cli-next-phase-planning
---

# CLI Planificacion de la siguiente etapa

> Actualizacion（2026-05-07，Mas adelante): Las direcciones recomendadas dadas en este documento de planificacion ya estan en la version actual. contract Aterrizar en profundidad。`diagram.generate` Sigue siendo irrelevante como anfitrion generation core，Y debajo de el command-completion La capa ahora esta escrita. `followThrough` Estructura de resultados explicita. La proxima ola de trabajo deberia pasar a packaging / semantic-verification Convergencia. ¿Solo cuando una sucursal posterior realmente demuestre que es suficientemente independiente del anfitrion, se considerara un limite de exportacion mas amplio?。

## Encuadre del problema

5 meses 4-5 Grupo de dia brainstorm De hecho, el documento ha marcado la direccion general.：

- Notemd Primero se debe extraer el host. operation，Hablemos de algo mas fuerte CLI / Compromiso publico ostensible。
- Tipo de escritura note-processing proof set Ya aterrizo。
- Primera ronda diagram/provider wrapper Tambien se ha conseguido el desapego。

Por lo tanto，CLI La siguiente etapa ya no es "seguir agregando pedidos", ni "seguir haciendo pedidos a gran escala". registry onboarding”。Los problemas restantes actuales son mas limitados.：

- `diagram.generate`、`diagram.preview` con `provider.connection.test` Todo ya esta disponible typed contract de registry-backed seam。
- `runDiagramGenerateOperation()` Ya es independiente del host generation core。
- La semantica mixta restante se encuentra principalmente en `src/operations/diagramCommandExecution.ts` con `src/operations/diagramCommandHostAdapter.ts` Responsable de guardar, reabrir, obtener una vista previa, reparar automaticamente y mostrar los resultados generados al usuario.。
- Las ordenes de envio reales todavia se siguen fielmente. `src/workflowButtons.ts` en `requires-active-file`、`write-file` o `interactive-ui` Semantica。

Por lo tanto, el nucleo del plan actual era hacer una aclaracion por niveles: core-generation contract con host follow-through contract Desembalar claramente y evitar reabrir ya completado write-heavy Familia, evita tambien la expansion prematura top-level operation ID。Esta decision ya se ha implementado y el resto de este articulo aun se puede utilizar como base de diseno para el formulario de implementacion actual.。

## Resumen de hechos del codigo

### `diagram.generate` Ya tenemos limites fundamentales reales

`src/operations/diagramGenerateOperation.ts` Recibir explicito markdown Ingrese y ejecute las dependencias, luego regrese `DiagramGenerationResult`。No guarda archivos, no abre vistas previas ni archivos emergentes. notice。Esta es la evidencia mas solida en el almacen, que indica que el proyecto ya tiene "independientes del host". diagram generation seam”。

### Los efectos secundarios restantes ocurren en generation Despues

`src/operations/diagramCommandExecution.ts` Corre primero generation core，Entonces entra `src/operations/diagramCommandHostAdapter.ts`。

Este nivel host adapter Lo que estamos emprendiendo actualmente es significativo. follow-through：

- Guardar Mermaid Salida
- Guardar artifact Salida
- Reparar automaticamente los archivos guardados segun corresponda Mermaid
- Vuelva a abrir el archivo guardado.
- Abrir vista previa
- Emitir mensajes visibles para el usuario

Estos son verdaderos anfitriones/Documentos/UI La semantica ya no debe confundirse con la pura. generation core Mezclar en el mismo nivel de abstraccion.。

### registry Esta estratificacion ya esta reflejada, pero no es lo suficientemente explicita.

`src/operations/registry.ts` Actualmente `diagram.generate` Exportar como `safe` / `read-only`，Al mismo tiempo, conserva la `src/workflowButtons.ts` La verdadera semantica de mando de：

- `notemd-generate-diagram` -> `requires-active-file` / `write-file`
- `notemd-summarize-as-mermaid` -> `requires-active-file` / `write-file`
- `notemd-preview-diagram` -> `interactive-ui` / `preview-ui`

Esto es direccionalmente correcto y las implementaciones posteriores ahora han cambiado "lo que se describe aqui es core operation，No es el comando de envio en si” para que quede mas claro: exportado `diagram.generate` Se agrego escritura en los resultados. `followThrough` Estructura, pero command binding en si permanece sin cambios。

### `provider.connection.test` Es el modelo de referencia local mas maduro

`src/operations/providerConnectionTestCommandHostAdapter.ts` Las dos capas inferiores han sido separadas.：

- Ruta principal de prueba escrita
- Adiciones adicionales busy/reporter Interaccion conductual wrapper

Este es el resto diagram/provider command-core Modelos de los que la estratificacion deberia seguir aprendiendo。

## Con existente brainstorm Relacion entre documentos

| Documentacion existente | CONCLUSIONES QUE HA CONFIRMADO | Nuevas aclaraciones anadidas a este articulo. |
|---|---|---|
| `docs/brainstorms/2026-05-04-obsidian-cli-extensibility-and-notemd-capability-extraction.md` | Primero tienes que fumar operation，Hablemos mejor de ello CLI Formulario | Mayor aclaracion: el trabajo restante es principalmente contract layering，En lugar de una nueva ronda operation Extraccion familiar |
| `docs/brainstorms/2026-05-05-cli-mainline-progress-sync-and-next-phase-requirements.md` | La siguiente etapa deberia ser mas profunda diagram/provider command-core trabajo | Aclarar mas: priorizar typed internal completion/follow-through contract，En lugar de agregarlo inmediatamente top-level operation ID |
| `docs/brainstorms/2026-05-05-cli-write-heavy-contract-tightening-requirements.md` | write-heavy proof set Completado, ya no es el principal cuello de botella. | Confirme nuevamente: Reabrir estas familias en este momento solo creara churn，No se lograran avances reales |

## Opciones consideradas

### Planificar 1：Agrega mas ahora top-level diagram operations

Por ejemplo, agregue nuevo `diagram.save-mermaid`、`diagram.save-artifact`、`diagram.preview-artifact`。

- Ventajas: Parece explicito en la superficie
- Desventaja: el archivo host sera/UI follow-through Empaquetado prematuro en "limites de proyecto independientes del anfitrion"”
- Riesgo: antes de que el codigo demuestre que estas rutas realmente se pueden separar del contexto de comando, primero expanda el area de contrato publico.

### Planificar 2：Mantener la combinacion actual wrapper Forma, no mas refinamiento

- Ventajas: coste mas bajo a corto plazo
- Desventajas：core con command follow-through Los limites de
- Riesgo: los mantenedores posteriores seguiran anadiendo mas wrapper Relleno semantico en exportado operation contract

### Planificar 3：mantener top-level operation surface Estable manteniendo el interior completion/follow-through Escritura de capas

- Ventajas: Mantenga el nivel superior correcto actual seam，Capaz de aclarar las ambiguedades restantes.
- Desventajas: Requiere un diseno interior mas cuidado contract
- Riesgo: si las limitaciones no son lo suficientemente fuertes，host-side completion helper Todavia es posible evolucionar secretamente hacia un segundo conjunto de implicitos. API

## Direcciones recomendadas

Elige un plan 3。

CLI La siguiente etapa de debe mantenerse `diagram.generate`、`diagram.preview` con `provider.connection.test` Este grupo top-level frame Estabilizar y luego poner diagram completion/follow-through Capas en este grupo. frame Escritura explicita a continuacion。

Este paso ya se ha implementado.。

Caer en el proyecto, es decir.：

1. Continuar sin tener nada que ver con el anfitrion. generation core con save/open/preview follow-through Separacion
2. Priorizar la introduccion en el ambito interno. typed execution/result structure，En lugar de inventar otros nuevos primero top-level operation ID
3. a `provider.connection.test` como core-vs-interactive layering Plantilla de referencia
4. Pon un mas ancho CLI/public-surface Expansion、packaging isolation con maintainer semantic verification Guardar para oleadas posteriores

## Plan de implementacion especifico

### Etapa 1：Primero escriba claramente la capa actual

1. mantener `diagram.generate` Continue indicando independiente del host `sourceMarkdown -> DiagramGenerationResult` Contrato。
2. Revise los campos de resultados exportados actualmente.（`operationInput`、`generation`、`outputPath`、`previewOpened`），Identifica cuales pertenecen a core result，¿Cuales pertenecen realmente a follow-through Capas。
3. Dejelo claro en documentos y metadatos: incluso si operation-level metadata Todavia `safe` / `read-only`，command binding Tambien se debe conservar la semantica de activacion del comando de envio real.。

### Etapa 2：en core Debajo Del Mango follow-through Escritura de capas

1. Introducir una claridad interna mas clara en torno a execution/result structure：
   - Mermaid Ahorre para los toques finales
   - artifact Ahorre para los toques finales
   - preview follow-through
   - reopen / auto-fix / notice Espere los efectos secundarios
2. Priorizar la implementacion de estas capacidades en "limites de ejecucion internos tipificados"”。
3. Solo cuando una rama haya demostrado ser independiente del host y pueda llamarse independientemente del contexto del comando, sera promovida a una nueva. top-level operation。

Implementar actualizaciones：
- `diagram.generate` Ahora regresara `followThrough.kind`、`followThrough.outputPath`、`followThrough.previewOpened`、`followThrough.autoFixAttempted` con `followThrough.artifactTarget`
- Para ser compatible con las personas que llaman existentes, el nivel superior `outputPath` con `previewOpened` La exportacion continua

### Etapa 3：Bloquee los limites con metadatos y pruebas

1. mantener `src/operations/registry.ts`、`src/operations/capabilityManifest.ts` con `src/cliContracts.ts` Describir claramente los niveles a los que pertenecen.。
2. Complementar o reforzar las pruebas para evitar operation-core metadata Retroceder silenciosamente command-trigger Semantica。
3. Vuelva a verificar los documentos del mantenedor para asegurarse de que ya no esten disponibles. CLI La siguiente etapa se escribe erroneamente como "el numero de comandos crece".”。

### Etapa 4：Pasar a la siguiente ola de trabajo

1. packaging / Aislamiento intenso del tiempo de ejecucion
2. maintainer-local semantic verification Endurecimiento
3. selection/export con workflow/settings contract Mejora
4. mas amplio CLI/public-surface Toma de decisiones

Esta etapa ahora se ha convertido en la direccion actual de la proxima ola.。

## Demanda

- R1. El siguiente lote de implementaciones debe mantener el orden de la etapa actual: hagalo primero diagram/provider contract layering，Hazlo de nuevo packaging/semantic-verification，Finalmente esta el mas amplio. CLI/public-surface Declaracion。
- R2. `diagram.generate` Debe continuar expresando irrelevancia del anfitrion. generation，En lugar de ejecutar el comando de archivo activo。
- R3. Mermaid Guardar、artifact Guardar、preview Abrir y volver a abrir archivos guardados、auto-fix con notice La semantica debe considerarse independiente. completion/follow-through Capas。
- R4. El proximo lote de implementaciones debe incorporar esto follow-through Las capas se escriben explicitamente. Solo cuando una rama realmente se vuelve independiente del host y se puede llamar independientemente del contexto del comando, hay alguna razon para actualizar a la nueva. top-level operation ID。
- R5. registry / capability manifest / contract Los metadatos deben dejar claro que capa describe cada uno.：core operation Todavia command binding。
- R6. Agregue una prueba para bloquear esta capa y evitar que se desvie nuevamente。
- R7. A menos que sea mas profundo diagram/provider La refactorizacion realmente genera ajustes de alineacion necesarios; de lo contrario, no vuelva a abrir lo que ya se ha implementado. write-heavy proof set。
- R8. No se agregaran nuevos en esta etapa. `obsidian-cli` Subcomandos。

## Criterios de exito

- Los mantenedores pueden explicar por que `diagram.generate` Se puede mantener `safe` / `read-only`，Y el envio real diagram commands Todavia debe ser `requires-active-file` / `write-file`。
- Proxima implementacion PRD Ahora puedes empezar desde lo ya aterrizado. `followThrough` Comience con el contrato y luego determine si es suficiente o si realmente se necesita un contrato derivado mas grande en el futuro.。
- Los documentos del almacen ya no CLI La siguiente etapa esta escrita como "El numero de comandos crece”。

## Limites del alcance

- No habra nuevas incorporaciones en este plan. `obsidian-cli` Subcomandos。
- Este plan no se reabrira write-heavy note-processing contract batch。
- Este plan no se realizara packaging isolation。
- Este plan no incluye interactive preview/file-save El proceso se mejora para `safe`。

## Decisiones clave

- Guardalo por ahora top-level operation frame estable。
- Priorizar la introduccion typed internal completion/follow-through structure，En lugar de agregar nuevos top-level operation ID。Esta preferencia se refleja ahora en la implementacion。
- uso `provider.connection.test` como“typed core con interactive wrapper Modo de referencia local de "convivencia"。

## Dependencia / Suposiciones

- Los hechos actuales se basan en `src/operations/diagramGenerateOperation.ts`、`src/operations/diagramCommandExecution.ts`、`src/operations/diagramCommandHostAdapter.ts`、`src/operations/providerConnectionTestCommandHostAdapter.ts`、`src/operations/registry.ts`、`src/cliContracts.ts` con `src/workflowButtons.ts` Verificacion de。
- 5 meses 4-5 japones brainstorm Los documentos siguen siendo validos y deben verse como linaje, no como historia antigua que debe sobrescribirse.。
- capability matrix Todavia enfrentandonos a los defensores automation-level truth La superficie de control actual debe ser consistente con este plan.。

## Cuestiones abiertas

### Posponer hasta que se realice la planificacion.

- `diagram.generate` ¿Deberia conservarse la capa superior de resultados a largo plazo? `outputPath`、`previewOpened` ¿Deberian conservarse estos campos de compatibilidad solo en el futuro? `followThrough` Estructura？
- ¿Cual diagram completion Lo que mas vale la pena es promover las sucursales a las internas mas fuertes primero. typed execution contract？
- En esta ronda layering correction Despues del aterrizaje，selection/export/workflow contract Mejora y packaging/maintainer verification，¿Cual es el siguiente elemento de seguimiento con mayor apalancamiento?？

## Siguiente paso

-> Combine este archivo con el del directorio de tareas. research Las actas sirven como base historica, y luego del “resto packaging / semantic-verification Brecha de Convergencia” inicia la proxima implementacion PRD。semantic-verification Este lado ahora se ha registrado helper（`npm run verify:diagram-semantics`），Por lo tanto, el proximo seguimiento con mayor apalancamiento deberia limitarse aun mas a packaging Pruebas de limites y cualquier resto contract-promotion Decision: a menos que posteriormente se descubra un nuevo limite independiente del host, es necesario reabrir capas mas profundas. diagram contract trabajo。
