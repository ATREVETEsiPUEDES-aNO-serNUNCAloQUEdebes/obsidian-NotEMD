---
date: 2026-04-14
topic: diagram-platform-phase-2
---

# Diagram Platform Phase 2 Requisitos de alineacion

## Encuadre del problema

Notemd La hoja de ruta de la plataforma de graficos ya no es solo una idea en papel. El almacen actualmente se ha implementado bastante completo. spec-first Capacidades de canalizacion, renderizador multiobjetivo, vista previa y asistencia para exportacion, y locale/theme Logica de alineacion. Ahora el problema ha cambiado: la realidad esta por delante de la hoja de ruta, pero algunas de las promesas arquitectonicas del plan original todavia estan cumplidas a medias en el codigo.。

Esta deriva plantea dos riesgos claros：

- El trabajo de seguimiento puede crear de manera redundante capacidades que ya se han implementado
- Las versiones posteriores pueden runtime isolation、Orden de callarse o renderer La estabilidad se compromete mas alla del status quo

Por lo tanto, la siguiente etapa deberia centrarse en la productizacion y el refuerzo de los limites, en lugar de seguir aumentando. renderer cantidad。

Los recientes esfuerzos de estabilizacion han reducido el resto Mermaid legacy La superficie se empuja parcialmente en esta direccion.：render-host bundle La auditoria ha entrado en el control de acceso de liberacion y el comando esta organizado en `src/main.ts` ha sido parcialmente unificado y compartido en note-directive parsing / note attachment / edge-label surgery helper Tambien empieza desde `src/mermaidProcessor.ts` hundirse en `src/diagram/adapters/mermaid/legacyFixerUtils.ts`。La cuestion actual sin resolver ya no es "¿deberiamos empezar a dividirnos?" legacy Bajo la premisa de la cobertura de reparacion, el resto sunset boundary ¿Que tan radical deberiamos impulsarlo?”。

## Demanda

**Fuente de alineacion con la verdad**

- R1. Debe haber un documento mantenible a largo plazo en el almacen que indique claramente que diagram-platform Se han enviado capacidades, cuales aun estan en la etapa experimental, cuales estan solo parcialmente completadas y cuales se han retrasado claramente.。
- R2. `docs/superpowers/plans/2026-04-14-diagram-rendering-platform-roadmap.zh-CN.md` Debe actualizarse pieza por pieza para que cada tarea refleje el estado actual de implementacion, la evidencia y las brechas restantes.。
- R3. La documentacion para usuarios y mantenedores no debe afirmar que el codigo actual no se ha entregado realmente. renderer isolation、Garantia de embalaje o uniformidad de mando。

**Direccion de produccion**

- R4. spec-first La linea de montaje es best-fit routing Hasta que se superen umbrales de aceptacion claros, la compatibilidad con la actual Mermaid Camino del comportamiento。
- R5. El proximo lote de implementaciones debe priorizar aquellas que ya se han implementado pero que aun estan estancadas. developer-only o experimental Avance las capacidades de graficos superficiales a una ruta de usuario estable y luego considere agregar otras nuevas. renderer familia。
- R6. Mermaid、JSON Canvas、Vega-Lite con HTML fallback La produccion debe seguir manteniendo una vista previa clara./Elabora un contrato que establezca claramente lo que respalda cada objetivo. inline preview、SVG export、PNG export con raw-source save。
- R7. La vista previa del grafico y el comportamiento de exportacion deben enviarse actualmente locale En el directorio, con complementos. UI locale Y el analizado Obsidian theme Sea consistente。

**Control de arquitectura**

- R8. Seguimiento renderer La obra debe reutilizarse `DiagramSpec`、`RendererService` con target-aware save/export Proceso, la nueva logica del grafico no se puede insertar directamente nuevamente en el proceso `src/main.ts`。
- R9. build/runtime isolation Debe considerarse como un hito de endurecimiento independiente; Las tareas mas pesadas no deben trasladarse hasta que los limites de empaquetado y ejecucion se realicen y verifiquen realmente. preview runtime Descrito como “en cuarentena”。
- R10. PlantUML、Graphviz、Draw.io Espere a que el motor avanzado permanezca retrasado hasta que salga la plataforma actual. experimental gating，y host/runtime boundary Refuerzo completo。

## Criterios de exito

- La hoja de ruta y los documentos de requisitos pueden reflejar fielmente el codigo actual y ya no hacer afirmaciones obviamente distorsionadas.。
- Los mantenedores no necesitan volver a leer todo el texto. diagram Base del codigo, la documentacion por si sola puede determinar el siguiente lote de trabajo de implementacion.。
- El siguiente lote de trabajo se indica claramente como "estabilizacion, estructura de mando、runtime Limites” en lugar de avance funcional。
- en phase-2 planning O antes de la ejecucion directa, ya no habra problemas de bloqueo del producto.。

## Limites del alcance

- Esta vez brainstorm No hay nuevas incorporaciones renderer Implementacion。
- Esta vez brainstorm No jubilarse legacy Mermaid fixer Camino。
- Esta vez brainstorm No reclamar iframe-host Ya puse trabajo pesado runtime Desde el complemento principal bundle Aislar de。
- Esta vez brainstorm No crea otros nuevos por si mismo. release o tag。

## Decisiones clave

- Actualizar existente roadmap，En lugar de escribir uno nuevo. Ya es un ancla de implementacion y deberia promoverse a un documento de estado autorizado.。
- Anade un especial phase-2 requirements Documentacion。roadmap Describe el corte de ejecucion. Este documento define lo que se debe optimizar en la siguiente etapa.。
- voluntad diagram platform Considerado como “las capacidades basicas se han implementado pero aun no se han producido por completo”. El modulo principal ya existe, pero experimental gating、runtime isolation con legacy La reduccion del camino aun no esta completa。
- Priorizar el refuerzo de limites en lugar de nuevas incorporaciones renderer Extensiones. La accion de mayor influencia actual es estabilizar la plataforma existente en lugar de seguir alargandola. target Lista。

## Dependencias y supuestos

- `README.md` con `docs/releases/1.8.4.md` El conjunto de funciones del grafico experimental actual ha sido documentado y debe seguir siendo coherente con el codigo.。
- `ref/**` Solo se utiliza como material de referencia local y no esta incluido en el alcance de entrega.。
- Los cambios en la calidad de la version todavia se utilizan. `npm run build`、`npm test -- --runInBand`、`npm run audit:i18n-ui`、`npm run audit:render-host` con `git diff --check` Verificar el acceso como almacen completo。

## Cuestiones abiertas

### Aplazar la etapa de planificacion

- [Impacto R4][Technical] best-fit diagram generation ¿Que umbrales de aceptacion claros deben alcanzarse para pasar de developer-only / experimental El estado se actualiza a stable opt-in o default-on？
- [Impacto R8][Technical] Resto diagram orchestration ¿Cual de los caminos deberia priorizarse? `src/main.ts` Migrar para evitar que la plataforma continue expandiendose a lo largo de la entrada del complemento.？
- [Impacto R9][Needs research] Una vez release asset packaging La forma es formalizada, mas pesada. preview runtime Debe colocarse en linea `srcdoc`、Independencia bundle frame，Todavia hybrid loader？

## Siguiente paso

-> Avance directo phase-2 Estabilizar el lote o utilizar primero `/ce:plan` Forme un desglose ejecutivo mas formal。
