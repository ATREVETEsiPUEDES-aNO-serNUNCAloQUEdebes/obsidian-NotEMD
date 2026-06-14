---
date: 2026-05-04
topic: obsidian-cli-extensibility-and-notemd-capability-extraction
---

# Obsidian CLI Escalabilidad y Notemd Extraccion de habilidades

## Encuadre del problema

Notemd Ya existe un conjunto de capacidades, cuya escala real es significativamente mayor que “un cierto Obsidian UI Boton”：

- Modo de funcionamiento reproducible provider diagnostic
- spec-first diagram generation
- batch progress Persistencia
- Estructura workflow action ID Con serializable workflow Definicion
- provider nivel `localOnly` Semantica del almacenamiento local.

Pero la realidad del anfitrion es mas limitada que la imaginacion del producto. local en esta maquina `obsidian-cli` Actualmente, Wrapper solo es un escritorio estable./La entrada de depuracion esta expuesta. `help`、`version`、`vaults`、`vault`、`doctor`、`native`、`gui`、`debug` Espere el subcomando. Oficial inferior `obsidian` CLI Ya puede enumerar y activar comandos de complementos, pero aun no abre un protocolo de extension estable y escrito para complementos de terceros.。

Esto significa que el siguiente paso mas valioso no es directamente “dar `obsidian-cli` Rellena algunas Notemd Orden”, pero aclarar tres cosas primero：

1. Notemd No tiene nada que ver con que habilidades vale la pena extraer del anfitrion. operation
2. ¿Que configuraciones y contratos de ejecucion se pueden separar de los complementos? UI Existir solo
3. `obsidian-cli` Si realmente queremos hacernos cargo de estas capacidades, ¿que limites faltan aun?

Si no haces esta capa de trabajo de limites primero，CLI El llamado a la transformacion eventualmente degenerara en seguir acumulando logica sobre `src/main.ts`，y ser UI Suposiciones y estancamiento de envoltorios especificos de la maquina。

## Demanda

**Clasificacion de habilidades**
- R1. El almacen debe distinguir claramente: cual Notemd La capacidad es independiente del anfitrion y adecuada para el futuro. CLI izado; que capacidades todavia estan limitadas Obsidian UI/runtime Superficie。
- R2. La clasificacion debe basarse en los hechos del codigo actual, no en la vision. Cualquiera que diga ser "adecuado" CLI Para cualquier capacidad de “quimicalizar”, primero hay que comprobar si todavia depende directamente de ella. `App`、`Editor`、`MarkdownView`、`Notice`、modal Procesar o complementar la seleccion de archivos propios UX。
- R3. Los documentos de progreso y los documentos de arquitectura deben distinguirse claramente entre nativos. `obsidian-cli` Envoltorio y oficial subyacente `obsidian` CLI：Este ultimo ya tiene la capacidad de activar comandos de complemento, pero aun carece de la superficie de integracion escrita necesaria para una automatizacion solida.。

**Adecuado CLI Objetivos de habilidad extraidos**
- R4. Proxima arquitectura seam Se debe dar prioridad a la extraccion de productos reutilizables en torno a las siguientes capacidades: operation：
  - provider diagnostics
  - diagram generation core
  - workflow / action registry Metadatos
  - batch progress persistence con resumability metadata
  - `localOnly` Clase I provider/settings Reglas de serializacion
- R5. Se debe dar prioridad a las capacidades extraidas para formar una entrada estable./Exportar el contrato en lugar de poner "mock" sidebar Clic en el boton” como CLI Metodo de integracion。
- R6. Todo todavia depende de que el editor se modifique en su lugar.、modal Las capacidades candidatas para interacciones, selectores de archivos o ventanas de vista previa son independientes del host. operation Antes, debe seguir marcando como pospuesto CLI Objetivo。

**Obsidian CLI Direccion de integracion**
- R7. El almacen debe almacenar `obsidian-cli` Integrar y redactar un plan de expansion por fases.：
  - Etapa 1：Extraer independiente del host Notemd operations
  - Etapa 2：Definicion `obsidian-cli` Complementos invocables/operation invocation contract
  - Etapa 3：Pon una pequena cantidad operation Exposicion a la estabilidad CLI Comando o subcomando
- R8. El almacen claramente debe evitar juzgar erroneamente que "el comando del complemento se puede activar hoy" como "la integracion es lo suficientemente completa". Las capacidades de activacion de comandos ya existen, pero los contratos de parametros, el descubrimiento de capacidades, la semantica de salida y la estabilidad de la automatizacion aun deben disenarse por separado.。
- R9. El primer lote de orientados. CLI Los objetivos de integracion deben dar prioridad a capacidades que no sean interactivas, que puedan retener evidencia y sean faciles de automatizar: diagnostico, generacion de productos y verificacion de configuraciones./Exportar、dry-run Informe sobre las capacidades de estilo en lugar de realizar primero el proceso que cambia directamente el contenido del editor.。

**Configurar y ampliar el modelo.**
- R10. ¿Que debe identificar el almacen? Notemd Establecer un futuro digno CLI Reutilizar, que partes aun son locales del complemento UI Configuracion. Al menos cubrir：
  - provider Elige y model Seleccione
  - `preferredDiagramIntent`
  - `localOnly` provider Semantica de persistencia
  - workflow DSL con action IDs
  - developer diagnostic mode / timeout / stability-run Configuracion
- R11. La siguiente etapa de la arquitectura debe avanzar hacia la “reutilizacion”. operation/config Empuje Layer”, deje que el complemento UI、Futuro CLI Los portales y las herramientas de mantenimiento comparten el mismo conjunto de limites en lugar de continuar orchestration Copiar y pegar `src/main.ts` Li。

**Documentacion y control de progreso**
- R12. El documento de progreso actual debe actualizarse seccion por seccion para indicar claramente que la estabilizacion de la superficie de mando ya no es el unico tema del refuerzo de los limites.；CLI La extraccion de capacidades es ahora la direccion de la arquitectura paralela, pero su premisa sigue siendo establecer primero la independencia del host. operation seam。
- R13. roadmap con architecture overview Debe poner CLI La extensibilidad se expresa como “servicio/Una extension del refuerzo fronterizo” en lugar de intentar tomar un atajo para evitar este paso。

## Criterios de exito

- Los mantenedores pueden senalar directamente una matriz de competencias que explique que Notemd Funciones preparadas para el futuro CLI Exposicion, que bloquea el acoplamiento del host del complemento y motivos del bloqueo。
- La documentacion debe distinguir con precision entre “oficiales CLI Se pueden activar comandos de complementos” y “el proyecto aun carece de un contrato de automatizacion de complementos maduro”.。
- La proxima ronda de planificacion puede desmantelar directamente un lote de proyectos especificos. operation-extraction Trabajar sin reinventar la rueda CLI Alcance y comportamiento del producto。
- El almacen sigue poniendo la "maquina local" wrapper”“Superficie de comando del complemento "futuro" CLI La "extensibilidad" se mantiene como un limite de tres capas en lugar de colapsar en una interfaz inestable。

## Limites del alcance

- Esta vez requirements No implementar nuevos `obsidian-cli` Subcomandos。
- Esta vez requirements No modifique la configuracion de esta maquina. `/usr/local/sbin/obsidian-cli` Script de empaquetado del sistema。
- Esta vez requirements No inmediatamente `src/main.ts` Reestructurar en capa de servicio。
- Esta vez requirements No anunciar todas las novedades Notemd Las ordenes han sido dadas CLI-ready。
- Esta vez requirements No sidebar actions o workflow DSL Tratar al propio banco como un publico estable CLI API。

## Decisiones clave

- Hacer oficial la actual CLI Trata la habilidad de activacion del comando como una base disponible, en lugar de malinterpretarla como“Notemd Las capacidades ya se adaptan naturalmente a la automatizacion. CLI Exposicion”。
- Dibujar primero operation，Reexposicion command。De lo contrario, el proyecto solo estara en el complemento. UI y CLI Repetir en ambos lados. orchestration Logica。
- Primer lote CLI La adaptacion da prioridad a archivos no interactivos, determinables y generables./Capacidad de prueba。
- Encuadernacion del editor, encuadernacion de vista previa、modal El proceso de vinculacion permanecera en el host del complemento hasta que se forme un contrato claro e independiente del host.。

## Dependencias y supuestos

- La evidencia actual del huesped proviene de `obsidian-cli help`、`obsidian-cli doctor`、`obsidian --help`、`obsidian commands filter=notemd`，Y scripts contenedores nativos `/usr/local/sbin/obsidian-cli` con `/usr/local/libexec/obsidian-launch`。
- La evidencia del codigo actual muestra `src/main.ts` Todavia domino el registro de comandos.、busy-state orchestration、reporter Ciclo de vida y gran cantidad de dependencias. `App` / `Editor` / `MarkdownView` Proceso。
- Capa inferior reutilizable building block Ya existe parcialmente en `src/providerDiagnostics.ts`、`src/diagram/diagramGenerationService.ts`、`src/workflowButtons.ts`、`src/batchProgressStore.ts` Y partes `src/llmUtils.ts` , pero aun no se han organizado en verdaderamente independientes del anfitrion. operation Capas。

## Cuestiones abiertas

### Aplazar la etapa de planificacion
- [Impacto R4][Technical] de `src/main.ts` ¿Que categoria se sorteara primero? operation：diagnostics、diagram generation，Todavia workflow execution？
- [Impacto R5][Technical] Minima independencia del anfitrion operation ¿Como deberia verse la interfaz para que pueda expresar entradas, salidas, progresos y fracasos sin depender de ellos? Obsidian UI clase？
- [Impacto R7][Needs research] Futuro `obsidian-cli` La integracion deberia desaparecer plugin-discovered、manifest-declared，Todavia CLI Pantalla lateral adapter camino？
- [Impacto R10][Technical] ¿Que ajustes deben conservarse? vault/plugin-owned state，¿Cuales merecen apoyo futuro? CLI profile Importar y exportar？

## Siguiente paso

-> /ce:plan Desglose un lote especifico de operation Extraccion y CLI Trabajo de implementacion de extension.
