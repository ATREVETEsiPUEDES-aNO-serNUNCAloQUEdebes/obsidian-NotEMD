---
date: 2026-05-11
last_updated: 2026-05-20
topic: folder-task-file-filtering-progress-and-architecture-alignment
---

# Seleccion y entrega de archivos de tareas de carpetas: comparacion en profundidad, evaluacion del progreso y direccion de seguimiento

## 1. Linea base de alcance y requisitos

Este articulo se utiliza para presentar completamente en el mercado la solucion y el estado de implementacion de la capacidad de "filtrado de archivos de tareas de carpeta". Segun los ultimos requisitos, se resume de la siguiente manera:：

1. Las tareas de carpetas deben admitir el filtrado de archivos configurable（`regex/glob/contains/no-filter`）。
2. `includeSubfolders` Debe ser opcional porque la tarea de traduccion actualmente se comporta de manera diferente a otras tareas.。
3. El objetivo del filtro debe permitir a los usuarios `relativePath` con `basename` Cambiar entre。
4. Las funciones existentes deben ser estables y no regresivas por defecto.。
5. El metodo de entrega debe cumplir con la disciplina de estabilizacion de la linea principal.（CI-safe、El contrato va primero y el camino publicado no retrocede）。

## 2. Estado actual y analisis de la causa raiz antes de los cambios.

Antes del cambio, la logica de recopilacion de archivos a nivel de carpeta estaba dispersa en varios modulos y el comportamiento entre tareas era inconsistente.：

- La mayoria de las tareas de carpetas utilizan "recursion de prefijo de ruta"”。
- `batchTranslateFolder` Utilice "Solo subclaves del directorio actual”（`folder.children`）。

Resumen de las causas fundamentales：

1. **Falta de contrato unificado de seleccion de expedientes**，Como resultado, cada comando se implementa de forma independiente, lo que es propenso a desviarse a largo plazo.。
2. **“"No se pueden introducir caracteres especiales" no es el principal obstaculo de este requisito.**；El problema central es la falta de seleccion unificada en el lado del complemento./Filtrar el esquema en su lugar Obsidian Entrada de texto en si。
3. **Falta de modo de compatibilidad.**，No se puede conservar la traduccion legacy Rango semantico al tiempo que se abre un comportamiento recursivo opcional。

## 3. Implementar el mapeo (requisitos -> Evidencia del codigo）

| Requisitos | Evidencia del codigo | Estado |
|---|---|---|
| Introducir la tarea de carpeta unificada selector | `src/folderTaskFileSelector.ts` | Ya implementado |
| Apoyo `none/contains/regex/glob` | `FolderTaskFileFilterMode`、matcher Logica de compilacion | Ya implementado |
| Apoyo `relativePath/basename` Cambio de objetivo | `FolderTaskFileFilterTarget`、target resolver | Ya implementado |
| Soporte opcional `includeSubfolders` Y manten el valor predeterminado compatible | `FolderTaskIncludeSubfoldersMode` + `legacy` Mapeo de tareas (la traduccion predeterminada es no recursiva） | Ya implementado |
| El comportamiento predeterminado se mantiene estable | `DEFAULT_SETTINGS` Medio `folderTaskIncludeSubfoldersMode = "legacy"`、`folderTaskFileFilterMode = "none"` | Ya implementado |
| regex El fracaso no guarda silencio | regex compilar `try/catch`，Informe de errores explicitos | Ya implementado |
| Sobrescribir la ruta de la tarea de la carpeta principal | `noteProcessingCommandHostAdapter.ts`、`fileUtils.ts`、`translate.ts`、`formulaFixer.ts` | Ya implementado |
| La pagina de configuracion es configurable. | `NotemdSettingTab` Bloque de filtrado agregado + EN/ZH-CN/ZH-TW i18n | Ya implementado |
| Comportamiento de bloqueo de pruebas de regresion | `folderTaskFileSelector.test.ts`、`translateContract.test.ts`、host/contract Pruebas | Ya implementado |
| aumentar operation Anulacion opcional de nivel (no cambia el comportamiento predeterminado global） | `applyFolderTaskSelectionOverride`、host adapter Abrir parametros de cobertura、operation Entrada schema Extension | Ya implementado |

## 4. Evaluacion del avance de la arquitectura.

Este cambio esta en consonancia con la ruta de promocion existente de “estabilizar primero y luego expandir”：

1. **Convergencia de la logica descentralizada al contrato unificado**
   Las reglas de seleccion de archivos se actualizan a herramientas compartidas para reducir la deriva semantica a largo plazo entre tareas.。
2. **Migracion prioritaria compatible**
   `legacy` El modo de subdirectorio garantiza que el comportamiento predeterminado de la traduccion permanezca sin cambios, al tiempo que permite activar explicitamente la recursividad.。
3. **Refuerzo de limites en lugar de generalizacion de capacidades**
   Esta es una mejora de la coherencia de la programacion de tareas, no una desviacion de la ruta de empaquetado del tiempo de ejecucion.。
4. **Ajuste de la semantica de errores.**
   Invalido regex El fallo explicito se utiliza ahora para evitar una filtracion silenciosa que conduzca a un procesamiento por lotes fuera de control.。

## 5. Comparacion en profundidad con las orbitas del esquema anterior.

### 5.1 Alineacion `mainline-stabilization-next-batch` Direccion

Puntos de acuerdo：

- Utilice contratos compartidos para promover comandos./Previsibilidad del comportamiento de la tarea.。
- Continuacion CI-safe Metodo de entrega incremental。
- No vuelvas a abrir cosas irrelevantes renderer/runtime packaging Alcance。

Diferencias：

- Este segmento afecta principalmente a los elementos de configuracion y la capa de disposicion de tareas, en lugar de a la superficie de comando del grafico en si.。
- Sin embargo, su filosofia de avance y sus metodos de gobernanza fronteriza son consistentes con el plan principal de estabilizacion.。

### 5.2 Alineacion packaging/semantic convergence orbita

Puntos de acuerdo：

- Siga tambien el "valor de verdad centralizado" + Volver a bloquear + Modo anti-deriva de "los documentos se actualizan en el mismo lote"。
- Realiza tambien un control de acceso completo（`build`、Prueba completa、audits、diff-check、Obsidian CLI Inspeccion）。

Diferencias：

- Esta seccion se centra en la seleccion del alcance del procesamiento de contenido y no pertenece a release packaging Capa semantica limite。

## 6. Lista de riesgos y medidas de control.

1. **Riesgos：** regex Los errores de configuracion provocan una expansion anormal del alcance del procesamiento。
   **controlar：** Si la compilacion falla, se informara explicitamente un error y no se realizara ninguna degradacion silenciosa.。
2. **Riesgos：** `invert` + vacio pattern Conducir al comportamiento equivocado de "exclusion total"。
   **controlar：** vacio pattern se define como no-op，Incluso si invert=true Tampoco cambies la coleccion de archivos。
3. **Riesgos：** mock/Falta el objeto del archivo de limites `extension` Excepciones al filtrar。
   **controlar：** Cuando `file.extension` Repliegue cuando falta `name/path` Derivar extensiones。
4. **Riesgos：** Regresion en las tareas de traduccion debido a cambios predeterminados recursivos。
   **controlar：** Traduccion en `legacy` El valor predeterminado sigue siendo no recursivo, solo cuando el usuario lo establece explicitamente en include Recursion temporal。

## 7. Constancia de verificacion de esta entrega

Ejecutado y aprobado：

1. `npm run build`
2. `npm test -- --runInBand`（Verde completo）
3. `npm run audit:i18n-ui`
4. `npm run audit:render-host`
5. `git diff --check`
6. `obsidian help`
7. `obsidian-cli help`

## 8. Actualizacion de progreso incremental（operation Corte de cobertura de nivel）

Una vez implementada la capacidad de deteccion global, tambien se ha completado el corte posterior en esta ronda.：

1. Alcance de la carpeta operation Entrada schema Se admiten campos de anulacion opcionales：
   `includeSubfoldersMode`、`fileFilterMode`、`fileFilterPattern`、`fileFilterTarget`、`fileFilterCaseSensitive`、`fileFilterInvert`。
2. note-processing con utility dos piezas host adapter Se ha abierto el camino para abarcar parametros y compartirlos a traves de unificado helper（`applyFolderTaskSelectionOverride`）Sintetizar configuraciones efectivas para evitar la deriva repetida de la logica de sintesis en multiples lugares。
3. Cuando no se pasa ningun parametro de cobertura, el comportamiento es completamente consistente con el original; la tarea de traduccion es `legacy` Mantenga el valor no recursivo predeterminado。
4. La cobertura de la regresion se ha ampliado a selector helper、CLI contract、operation registry Metadatos y host adapter Capa de comportamiento。
5. sidebar/workflow En el contexto existente folder Hasta ahora, se han sobrescrito y alineado de forma transparente mas acciones de carpeta.（`extract-concepts-folder`、`batch-extract-original-text`、`batch-fix-formula`），Evite la separacion semantica de "algunas acciones heredan el contexto y algunas acciones vuelven a completar el selector" en el mismo flujo de trabajo.。

## 9. Direccion de seguimiento (especifica）

1. Mas comentarios sobre/Mantener hasta que la observacion este en su lugar `legacy` Compatible con los valores predeterminados para evitar el riesgo de una migracion a gran escala de la semantica predeterminada。
2. Si posteriormente se amplia la superficie de llamada de automatizacion externa, se debe dar prioridad a mapear directamente los campos de cobertura a canonical operation Ruta de ejecucion, sin derivacion host adapter de guard/Capa de verificacion。
3. para regex/glob Agregue indicaciones de ejemplo mas enfocadas e ilegales. pattern Pautas, no bloquee la entrada gramatical avanzada。
4. Continuar avanzando por la ruta establecida. packaging / semantic-verification convergence，No importa si no vuelve a abrir runtime Alcance。

## 10. Actualizacion de progreso incremental (extraccion por lotes del texto original especificado) operation Contrato）

Este segmento complementa la "extraccion a nivel de carpeta del texto original especificado" previamente identificada en operation Vacante de contrato de capa：

1. en `src/operations/registry.ts` Nuevo en operation `content.batch-extract-original-text`。
2. Las vinculaciones de mando estan unificadas como `batch-extract-original-text`，Y reutilizar la semantica de los metadatos de las acciones del flujo de trabajo.（`interactive-ui`、`folder-selection`、`batch-write`）。
3. Entrada schema Se han admitido campos de cobertura de filtro de carpetas：
   `includeSubfoldersMode`、`fileFilterMode`、`fileFilterPattern`、`fileFilterTarget`、`fileFilterCaseSensitive`、`fileFilterInvert`。
4. Resultados schema alineado `BatchExtractOriginalTextResult` Estructura：
   `folderPath`、`processedFileCount`、`extractedCount`、`cancelled`、`fileResults`、`errors`。
5. Las pruebas de regresion han ampliado y bloqueado el operation Visibilidad y estabilidad del contrato en los siguientes niveles：
   `operationsRegistry`、`cliContracts`、`cliCapabilityManifest`。

## 11. Actualizaciones de progreso incrementales (pautas de sintaxis de deteccion y Regex Alerta temprana）

El siguiente paso en la ruta establecida es de bajo riesgo. UX El corte reforzado ha aterrizado.：

1. Se agrego una linea de configuracion de "Pautas de sintaxis de modo" en el area de filtrado de tareas de carpeta para proporcionar regex/glob Ejemplos de especificaciones y recordatorios de alineacion de objetivos coincidentes。
2. Cuando el modo de filtro esta `regex` Cuando el usuario modifica la cadena del patron en la pagina de configuracion o cambia a regex El modo activa la verificacion de compilacion sin bloqueo.。
3. Si regex No valido, la pagina de configuracion mostrara inmediatamente un mensaje de localizacion; sin embargo, el comportamiento de guardado se mantendra y el proceso de edicion continua de los usuarios avanzados no se bloqueara.。
4. Este cambio no cambia la semantica predeterminada al ejecutar tareas, solo mueve el momento en que se exponen los errores para reducir el riesgo de "descubrir despues de ejecutar el procesamiento por lotes". pattern El coste del retraso de los “errores”。
5. i18n Actualizado sincronicamente con la cobertura de regresion, bloqueando nuevas incorporaciones. key Corregir con la pagina de configuracion key Uso de。

## 12. Actualizaciones de progreso incrementales (compartidas Regex Verificacion de la convergencia + Adapter Anular bloqueo）

Se implemento otro segmento incremental estabilizado para reducir el riesgo de deriva semantica en la pagina de configuracion y la verificacion del tiempo de ejecucion.：

1. regex La verificacion previa gramatical ha convergido a `src/folderTaskFileSelector.ts` Compartir helper（`getFolderTaskRegexValidationError`），Ya no se repite localmente en la pagina de configuracion.。
2. tiempo de ejecucion regex matcher La verificacion previa de la pagina de compilacion y configuracion ahora reutiliza el mismo conjunto de semantica de verificacion, lo que reduce la probabilidad de que "se pase el mensaje pero se produzca un error durante la ejecucion" o la deriva inversa en el mantenimiento posterior.。
3. host-adapter Regreso bloqueado `runBatchExtractOriginalTextCommandWithHost` Comportamiento de cobertura, incluyendo：
   - `folderPathOverride + fileSelectionOverride` Semantica de ejecucion de
   - base settings El objeto no es override Garantia de contaminacion del proceso
4. Este cambio no cambia la semantica predeterminada del comando, solo mejora la coherencia y la regresibilidad del contrato a la capa de ejecucion.。

## 13. Conclusion de colocacion de linea principal y saneamiento del area de trabajo.

Este segmento ha cumplido las condiciones de colocacion de la linea principal.：

- El plan especifico ha sido documentado.。
- La comparacion del progreso y la evaluacion del avance de la arquitectura estan documentadas y rastreables.。
- La direccion de seguimiento es clara y ejecutable.。
- Planea `main` Ejecutar despues de enviar el push. clean Revision de estado。

## 14. 1.8.7 Evaluacion de la convergencia de versiones (comparacion en profundidad + Direccion de seguimiento）

Esta vez `1.8.7` El punto de corte de liberacion llena el espacio final entre "la funcion se ha implementado" y "el valor real de liberacion ha convergido por completo"。

### 14.1 Comparacion de diferencias entre el codigo existente y la solucion anterior

Segun los requisitos del programa mencionados anteriormente en este articulo, el estado actual es el siguiente：

1. **Compartir selector Requisitos contractuales** No solo se ha implementado, sino que tambien se ha sincronizado con el resumen emergente de bienvenida.、release notes、change log，Forme el valor de verdad visible de la capa de publicacion.。
2. **`includeSubfolders` Requisitos opcionales y compatibles** Sigue asi：`legacy` El comportamiento de compatibilidad predeterminado permanece sin cambios y se corrige explicitamente en el documento de lanzamiento.。
3. **`relativePath`/`basename` Requisitos de cambio de objetivos** Continuar manteniendo los controladores de configuracion y los bloqueos de regresion sin interrupcion del proceso de lanzamiento ni cambios en los limites del paquete.。
4. **Requisitos de estabilidad** Anade una nueva capa de proteccion antiderrapante en esta ronda：
   regex Reutilizacion unificada de verificacion previa y compilacion en tiempo de ejecucion `getFolderTaskRegexValidationError`。
5. **CI-safe Requisitos disciplinarios** Aun se publicara despues de pasar la verificacion completa del control de acceso y no existe el riesgo de orden inverso de "liberar primero y luego realizar pruebas complementarias".。

### 14.2 Evaluacion del estado de avance de la arquitectura.

En comparacion con la direccion arquitectonica existente, el estado de avance actual es：

1. **Convergencia de la capa de contrato: esta etapa esta completa**
   selector Semantica、host-adapter Sintesis de cobertura、operation Se han alineado las indicaciones de la pagina de configuracion y registro del contrato.。
2. **Consistencia entre capas: mejora significativa**
   Establecer la validacion de paginas y el uso compartido del comportamiento en tiempo de ejecucion. regex Verifique el valor real y reduzca la superficie de deriva de la doble implementacion.。
3. **Liberar la consistencia de la superficie: completado en esta etapa**
   Incluye metadatos, documentacion, registros de cambios, resumen emergente de bienvenida, bilingue release notes Sincronizar en el mismo limite de version。

### 14.3 Riesgo residual y control

1. **Riesgos：** regex/glob Todavia existe un umbral de comprension para los usuarios no tecnicos.。
   **controlar：** Continue manteniendo pautas de sintaxis ligeras y edicion sin bloqueo sin sacrificar la sintaxis avanzada.。
2. **Riesgos：** Seguimiento operation Posible omision de la superposicion compartida helper，Causar regresion a la deriva.。
   **controlar：** Nueva carpeta operation adapter Reutilizacion forzada `applyFolderTaskSelectionOverride`，Y bloquear las pruebas de contrato。
3. **Riesgos：** Si se hacen ajustes en el futuro `legacy` Semantica predeterminada, el riesgo de compatibilidad sigue siendo alto。
   **controlar：** Ofrecer la migracion semantica predeterminada como un proyecto de compatibilidad independiente, completo con una matriz de regresion explicita e instrucciones por fases.。

### 14.4 Direccion de seguimiento（1.8.7 Despues）

1. Segun lo establecido Stage-B2 La ruta sigue avanzando packaging / semantic-verification convergence，No runtime-boundary Transformacion de topologia combinada con division de tareas de carpetas。
2. Finalizacion de acciones de nuevas carpetas de forma predeterminada. `operationsRegistry` + `cliContracts` + `cliCapabilityManifest` Verificacion de la alineacion del contrato de tres niveles。
3. Haga un ajuste preestablecido de deteccion enfocado sin cambiar el contrato de comportamiento./Ejemplo UX Experimentos intensivos。

## 15. Actualizaciones de progreso incrementales (llamadas file-selection profile）

### 15.1 Extension del valor de verdad del codigo actual en relacion con los requisitos anteriores

Los requisitos de filtrado de tareas de carpetas anteriores ahora se amplian de forma limitada en lugar de reemplazarse, manteniendo la base de compatibilidad sin cambios.：

1. El valor predeterminado de la tarea de carpeta global sigue siendo canonical compatibility base；
2. Los archivos con nombre guardados son reutilizables overlay，No hay un segundo conjunto de rutas de ejecucion en competencia；
3. Las nuevas configuraciones de persistencia son `folderTaskFileSelectionProfiles`，Cada archivo ahora contiene：
   - `id`
   - `name`
   - Opcional `folderPathHint`
   - `includeSubfoldersMode`
   - `fileFilterMode`
   - `fileFilterPattern`
   - `fileFilterTarget`
   - `fileFilterCaseSensitive`
   - `fileFilterInvert`
4. Las prioridades ahora son explicitas y estan determinadas por pruebas de regresion.：
   `Ejecucion unica explicita override > Archivo guardado seleccionado > Impagos globales`。

### 15.2 Explicacion de los limites arquitectonicos

Para esta capa profile La explicacion correcta de la habilidad debe ser：

1. Esto es selector-layer Facilidad de uso y mejoras de consistencia, no workflow runtime expansion；
2. `folderPathHint` Limitado deliberadamente a valores precargados del selector en lugar de ocultar enlaces de ejecucion, evitando asi que las rutas obsoletas se apropien silenciosamente de los objetivos de ejecucion en ejecuciones posteriores.；
3. host adapter Ahora tenga prioridad cuando este disponible profile-aware de `getFolderTaskSelection(...)`，Pero cuando el host no implementa este metodo, seguira recurriendo al anterior. `getFolderSelection()`；
4. delimitado maintainer bridge Ahora tambien compatible batch-generate Pase `fileSelectionProfileId` / `fileSelectionProfileName` Reutilizar el archivo, pero esto no lo expande. public-safe CLI slice。

### 15.3 Progreso actual y proximos pasos

En comparacion con el plan anterior, el avance actual significa：

1. Originales `includeSubfolders` con `relativePath/basename` Los requisitos ya no solo se quedan en el nivel de configuracion global, sino que ahora se pueden reutilizar en el nivel de archivo.；
2. interactive picker、selector merge、host adapter Ejecucion、maintainer CLI El analisis de entrada ahora comparte el mismo conjunto de modelos de prioridad y la superficie de deriva entre capas continua reduciendose.；
3. ¿Que se debe hacer a continuacion? profile-surface hardening，En lugar de expandirse runtime scope：
   - profile export/import en secrecy con mutability No entres hasta que las reglas esten claras. public-safe slice；
   - Si hay mas carpetas operation Entrar maintainer bridge，En caso de no exigir la misma prioridad que non-mutation Regreso；
   - picker UX Para su posterior pulido, el "Guardado" hint + Se puede cambiar en tiempo de ejecucion. folder”Este contrato principal。
