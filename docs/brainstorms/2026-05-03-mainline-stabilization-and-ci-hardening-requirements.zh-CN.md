---
date: 2026-05-03
topic: mainline-stabilization-and-ci-hardening
---

# Estabilizacion de la linea principal y CI Requisitos de refuerzo

## Encuadre del problema

Notemd Actualmente no faltan diagram platform El riesgo real es desplazarse hacia la arquitectura central de：

- La documentacion del progreso del almacen puede continuar desviandose del codigo y workflow La verdad
- El mantenedor podra GitHub commit-status La interfaz se interpreta erroneamente como `main` De verdad CI Fracaso, incluso si `main` Nada ordinario en absoluto workflow
- release El camino puede aparecer "Hoy todavia esta verde, pero manana sera verde debido a GitHub La bomba de tiempo de la "perdida roja directa despues de la actualizacion de la plataforma"
- Drawnix Es facil de malinterpretar como un host que se conectara en un futuro cercano, pero es mas adecuado definirlo como una referencia para los limites de datos y los limites de transformacion.

Por lo tanto, lo que mas se necesita ahora no es otra hoja de ruta de generalizacion, sino una limitacion clara. `main` Situacion real, proxima tanda de prioridades de trabajo y Drawnix Especificidad del limite del impacto requirements Documentacion。

## Demanda

**Fuente de control de hechos**
- R1. Los documentos de progreso y las hojas de ruta deben actualizarse paso a paso para garantizar que sean precisos para el codigo actual, remoto workflow La descripcion del comportamiento y las lagunas restantes no es exagerada ni distorsionada.。
- R2. La documentacion para los mantenedores debe distinguir claramente entre `main` Verdad vs. release-tag workflow Valor de verdad. cuando GitHub commit-status API en `main` Mostrar en `pending` y `statuses=[]` La documentacion debe guiar a los mantenedores a GitHub Actions runs con `check-suites` / `check-runs` Como fuente de verdad。
- R3. release workflow Debe permanecer en GitHub Mantenido oficialmente JavaScript actions apoyado major En terminos de versiones, no se puede permitir que las advertencias de desuso se conviertan silenciosamente en fallas de version reales.。

**Prioridad del siguiente lote**
- R4. El proximo lote de implementaciones debe priorizar los cierres de superficies de mando antes de considerar otros nuevos. renderer Integracion a nivel familiar o de nuevo anfitrion。
- R5. Las proximas implementaciones deben definir un conjunto sostenible de comprobaciones semanticas locales del mantenedor. runbook o harness，No confie en claves rastreadas o codificacion rigida vault Ruta o enviada por error live tests。
- R6. El aislamiento del empaquetado en tiempo de ejecucion sigue siendo un hito explicito: en los mas pesados preview runtime Las estrategias de activos independientes o de entradas multiples no deben describirse como “puestas en cuarentena” antes de su envio real.”。
- R6.1. Derecha `2026-04-14-diagram-rendering-platform-roadmap.en.md` La interpretacion de los requisitos a mediano y largo plazo debe converger de "continuar construyendo la plataforma" a "dar prioridad a la finalizacion del refuerzo de los limites y luego decidir si se expande la plataforma".”。

**Limites de referencia externos**
- R7. Drawnix Debe seguir actuando `ref/` El proyecto de referencia local bajo Notemd Dependencias de envio o hosts integrados。
- R8. Cualquier futuro Drawnix Todos los experimentos relevantes deben conservarse. spec-first Capa semantica. La mejor direccion a largo plazo es `DiagramSpec -> DrawnixExportedData` o `DiagramSpec -> PlaitElement[]`，en lugar de `DiagramSpec -> Mermaid/Markdown -> Drawnix converter`。

**Higiene del almacen**
- R9. `ref/**`、`coverage/**` Espere el analisis local./Los artefactos de compilacion deben seguir estando excluidos del alcance del envio y de los arboles de trabajo de confirmacion.。

## Criterios de exito

- El mantenedor puede decidir el siguiente lote de trabajo de ejecucion leyendo unicamente el documento de progreso actualizado sin tener que volver a auditar todo el codigo base.。
- release workflow Ya no se conserva `actions/checkout@v4` con `actions/setup-node@v4` El que traje GitHub La ruta de alarma esta oficialmente obsoleta y `2026-05-03` de `1.8.4` Exito release run Este camino reforzado se ha reflejado。
- La documentacion del almacen explica claramente Drawnix Es un limite de referencia, no un objetivo de integracion de anfitriones a corto plazo.。
- `main` Permanecer limpio y seguir pasando las puertas de verificacion actuales a nivel de almacen.。

## Limites del alcance

- Esta vez requirements No dara `main` Anadido normal push/PR CI workflow。
- Esta vez requirements No puedo poner Drawnix Importacion interactiva de host, sistema de barra de herramientas o sistema de archivos del navegador Notemd。
- Esta vez requirements No se jubilara legacy Mermaid prompt，No sera eliminado `mermaidProcessor.ts` fixer Camino。
- Esta vez requirements No se crea solo release o tag。

## Decisiones clave

- Ponlo primero“`main` CI Trate el "informe de error" como la fuente de hechos para juzgar el problema, en lugar de asumir que la rama principal realmente tiene una tuberia fallida.。
- Arreglalo ahora release workflow El futuro punto de falla de GitHub de Node 20 JavaScript-action El programa de desaprobacion convierte las advertencias en fallas reales。
- voluntad Drawnix Limitado a adapter / data-boundary Capa de referencia, no la dejes Notemd Incorpore un segundo conjunto de limites de aplicaciones front-end administradas。
- voluntad roadmap La secuencia de aterrizaje de la siguiente etapa se fija como: superficie de mando -> Verificacion semantica local del mantenedor -> Limites del empaquetado en tiempo de ejecucion -> legacy prompt / MermaidProcessor Contraccion -> Mayor expansion。

## Dependencias y supuestos

- `.github/workflows/release.yml` Es el unico en el almacen actual. active de GitHub Actions workflow。
- exitoso `1.8.3` Arreglar run（`25215799596`）Esta es una version antigua de este almacen. JavaScript-action Evidencia concreta de advertencias de desuso。
- exitoso `1.8.4` release run（`25274341984`）Si `actions/checkout@v6` con `actions/setup-node@v6` Evidencias concretas de que el camino reforzado se ha vuelto verde。
- `actions/checkout` con `actions/setup-node` La version actual ya proporciona un reemplazo para la antigua pin apoyado major，No es necesario reescribir el proceso de lanzamiento.。

## Cuestiones abiertas

### Aplazar la etapa de planificacion
- [Impacto R4][Technical] Si bien se conservan los alias compatibles, que command ID Deberia ser definitivo canonical stable entrypoint？
- [Impacto R5][Technical] ¿Que tipo de verificacion semantica local del mantenedor? harness Solo si es lo suficientemente pequeno, lo suficientemente estable y puede cubrir Mermaid / JSON Canvas / Vega-Lite？
- [Impacto R8][Needs research] Si quieres apoyar en el futuro board export，Notemd Debe salir directamente `.drawnix`，Primero definamos uno mas general Plait adapter Limites？

## Siguiente paso

-> Ejecute directamente primero workflow Reforzar y alinear con la documentacion; si necesita promover el trabajo de estabilizacion del proximo lote de cambios de codigo real, use `/ce:plan` Haz un desmontaje formal。
