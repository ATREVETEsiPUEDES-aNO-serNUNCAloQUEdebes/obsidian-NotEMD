---
date: 2026-05-24
last_updated: 2026-05-25
topic: mainline-force-rewrite-audit-and-next-direction
---

# Trama principal Force Rewrite Auditoria y proximos pasos

## 1. Alcance y linea de base

La razon de la existencia de este documento de auditoria es que el almacen esta 2026-05-24 Se han producido cambios morfologicos sustanciales.：

1. `git fetch origin` Pantalla `origin/main` Obligado a ser reescrito；
2. La linea principal remota actual ya no es equivalente al estado de sucursal local mas amplia que se avanzo anteriormente.；
3. Si continua escribiendo el estado de las sucursales posteriores como "actual main”，El actual documento de progreso se vera directamente distorsionado.。

Comparacion de este articulo：

1. Actual despues de ser reescrito `origin/main`；
2. Documentos de planificacion principales anteriores que aun son relevantes；
3. Sucursal de respaldo local solo como referencia de auditoria `backup/main-before-origin-force-20260524`。

Reglas basicas：

- live `origin/main` Determinar el valor real del envio actual.；
- La evidencia de la rama de respaldo solo determina el futuro reintegration Oportunidades。

## 2. Instantanea del valor de verdad del codigo actual

### 2.1 Packaging / runtime Valor de verdad

actual `origin/main` Lo que aun esta demostrado es el limite de embalaje de entrada unica：

1. `esbuild.config.mjs` Construir solo `main.js`；
2. `IframeRenderHost` Consumo inline `htmlSrcdoc`；
3. `scripts/audit-render-host-bundle.js` ¿Que se audita? bundled `main.js` Etiquetas en lugar de activos de tiempo de ejecucion independientes；
4. maintainer El documento todavia establece claramente que `main.js + inline srcdoc` Escribe como el limite verdadero actual.。

### 2.2 actual automation / CLI Valor de verdad

La linea principal actual aun conserva algunos valiosos extracted automation Superficie：

1. provider profile export/import operations；
2. capability manifest export；
3. invocation contract export；
4. La superficie de arriba registry-backed operation metadata。

Pero la linea principal actual **No incluye** Agregado mas tarde en la rama de respaldo. maintainer bridge/help pila：

1. No `scripts/invoke-maintainer-cli-operation.js`；
2. Nada compartido `scripts/lib/maintainer-cli-operation-help.js`；
3. No `cliPublicSurface`、`invokeMaintainerCliOperationScript`、`repoSagaExecutionLock` Este tipo es posterior bridge/public-surface hardening Pruebas。

### 2.3 Valor verdadero visible para el usuario actual

La linea principal actual permanece：

1. preview artifact save/export helpers；
2. welcome-modal release digest；
3. provider diagnostics；
4. canonical diagram wording Con el presente inline preview host Camino。

Sin embargo, las siguientes capacidades de usuario que se realizaron posteriormente en la rama de respaldo estaran en la linea principal actual despues de la reescritura.**No se ha demostrado que exista**：

1. settings reset；
2. concept-note path guard modal；
3. file-selection profiles con folder-task filter UX；
4. local-KB retrieval；
5. chapter split；
6. Mas tarde sidebar API liveness/activity hardening。

### 2.4 Clean-state Valor de verdad

La trama principal reescrita tambien revelo una verdadera hygiene Brecha：

1. `docs/` Descargar generado localmente vault Los artefactos no se ignoran；
2. Directorio raiz dejado por un trabajo anterior `render-host.mjs` Tambien ensucia el almacen.；
3. Esto significa que una vez finalizada la verificacion nativa, incluso si el codigo real diff No hay problema, los espacios de trabajo tambien pueden parecer incorrectamente clean。

## 3. Comparacion en profundidad con los requisitos del programa anterior.

### 3.1 relativo packaging / semantic orbita

La parte del codigo actual que aun coincide.：

1. packaging-boundary honesty；
2. helper-driven anti-drift verification；
3. maintainer El documento es coherente con el valor de verdad del codigo actual.。

Partes del codigo actual que ya no coinciden：

1. Se supone enviado `render-host.mjs` Documentacion posterior para canales.；
2. Suposiciones dedicated runtime assets Seguire en la linea principal actual mas tarde. Stage-C Redaccion publicitaria。

Conclusion：

- packaging / semantic La orbita sigue viva, pero el valor de verdad actual vuelve a ser mas estrecho.。

### 3.2 relativo CLI-next-phase Planifica tu trayectoria

La parte del codigo actual que aun coincide.：

1. extracted operation contracts Aun mas importante que “seguir aumentando el numero de comandos”；
2. capability/export/config La superficie sigue siendo legal en la linea principal actual. automation seams。

Partes del codigo actual que ya no coinciden：

1. Mas tarde bounded maintainer-bridge El trabajo no existe en la linea principal actual.；
2. Mas tarde public-safe wording con help-truth El puerto de cierre no existe en la linea principal actual.。

Conclusion：

- La linea principal actual todavia puede transportar datos acotados. automation Trabaja, pero no puede heredar incondicionalmente los posteriores. maintainer-bridge Narracion。

### 3.3 relativo local-KB / chapter-split Tarea PRD

PRD La rama de respaldo demuestra que este trabajo de hecho se realizo mas tarde, pero la linea principal actual despues de la reescritura no lo incluye.：

1. Pruebas faltantes：`chapterSplit`、`localKnowledgeBase`、`localKnowledgeTaskIntegration`、`folderTaskFileSelector`、`settingsReset`；
2. Falta documentacion sobre el progreso del seguimiento: mas tarde unified matrix con 05-13/05-20 La superficie de progreso no esta en la linea principal actual.；
3. Por lo tanto, la linea principal actual ya no se puede escribir honestamente como "estas capacidades del producto se han enviado".”。

Conclusion：

- Estas capacidades ahora deberian considerarse como reintegration candidates，En lugar del elemento de finalizacion principal actual。

## 4. Evaluacion de la promocion de la arquitectura.

### 4.1 ¿Que se avanza realmente en la linea principal actual?

1. packaging/semantic Honestidad contractual；
2. registry-backed export/config automation seams；
3. release-digest/onboarding Continuidad；
4. preview artifact handling Con el presente inline preview host Proceso。

### 4.2 No se guarda nada en la linea principal actual.

1. Mas tarde dedicated runtime-asset trabajo；
2. Mas tarde maintainer-bridge/public-surface hardening；
3. Lanzamiento posterior del producto retrieval/splitting/profile rebanada；
4. Mas tarde repo-saga Restricciones de ejecucion de prevencion de errores en serie。

### 4.3 Explicacion correcta

被重写后deTrama principal并No“坏掉了”,但relativo于本地备份分支,它de **De hecho, la amplitud de las capacidades se ha reducido**。Asi que el siguiente paso correcto es no seguir fingiendo que estas capacidades mas amplias todavia existen;：

1. Primero corrija el valor de verdad principal actual en el documento.；
2. Completalo primero clean-state guardrails；
3. Luego selecciona por pista reintegration rebanada。

## 5. Instrucciones de seguimiento especificas

### Priority 0：Reparar la narrativa principal actual del valor de verdad.

1. deja packaging Documentacion de progreso realineada a entrada unica `srcdoc` Valor de verdad；
2. Agregue una matriz de promocion unificada para distinguir claramente live main con backup-branch evidence；
3. Los archivos que no existen en la linea principal actual ya no seran referenciados como live roadmap state。

### Priority 0：Cierra la boca clean-state

1. Ignorar los generados localmente vault/runtime Artefactos；
2. Cada ronda de verificacion se basa en clean status Probar el cierre；
3. poner clean-state Escriba las reglas claramente para evitar que los residuos de pruebas locales se juzguen erroneamente como regresiones de productos.。

### Priority 1：Hazlo dentro de los limites reintegration Planificacion

1. Decidir sobre el proximo lote reintegration si packaging/runtime follow-through、CLI/maintainer-surface hardening，¿O recuperacion de la superficie del producto?；
2. cada uno reintegration Mantenga las porciones lo suficientemente estrechas para garantizar que el codigo/Pruebas/Los documentos se pueden implementar en el mismo lote.；
3. No mueva toda la declaracion de la rama de respaldo a la linea principal actual sin volver a verificarla.。

### Priority 2：Recuperacion posterior del producto

Si aun desea restaurar las capacidades del producto posterior a la linea principal, se recomienda reinyectar en el siguiente orden：

1. clean-state + repo-saga/release guardrails；
2. CLI/help/public-surface truth；
3. settings/sidebar guardrails；
4. file-selection/profile control；
5. local-KB retrieval con chapter split。

## 6. Verificar el control de acceso

Cualquier lote que cambie la "interpretacion del estado actual" debe al menos ejecutarse：

1. `npm run build`
2. `npm test -- --runInBand`
3. `npm run audit:i18n-ui`
4. `npm run audit:render-host`
5. `git diff --check`
6. Finalmente clean de `git status --short --branch`

## 7. Conclusion

Actualmente reescrito `main` Sigue siendo coherente, pero solo si lo describimos honestamente.：

1. Actualmente envia entrada unica. packaging / semantic orbita；
2. Actualmente no ofrece capacidades mas amplias en la rama de respaldo.；
3. El verdadero siguiente paso“develop to next level”Debe ser disciplinado reintegration，En lugar de una deriva narrativa。

## 8. Actualizacion de recuperacion incremental（2026-05-25）

Esta seccion **No** Se utiliza para cubrir la parte superior. 2026-05-24 En lugar de auditar la linea base, registre que capacidades han regresado posteriormente a la linea principal actual.。

### 8.1 Porciones de productos que han sido recertificados en la linea principal actual

El siguiente contenido ya no debe escribirse como "actualmente main Desaparecido”：

1. settings reset（`complete` con `partial`，Entre ellos partial Reservado segun lo disenado provider Configuracion）；
2. Orientado al proceso de generacion de conceptos concept-note Ventana emergente de aviso de configuracion previa；
3. Orientado add-links / extract-concepts Aviso concept synonym suppression Cambiar；
4. file-selection profiles，Y cinturon `relativePath` / `basename` Coincidencia de destino y carpetas controladas por el alcance del subdirectorio explicito regex/glob Filtrar；
5. Orientado `Generacion por lotes a partir de titulos.`、`Investigacion y resumen`、`Generar graficos` de local knowledge retrieval；
6. Dividir con nivel de rumbo、TOC Generacion y limpieza de archivos obsoletos chapter split；
7. Orientado Mermaid、Vega-Lite、JSON Canvas、HTML de pieza de trabajo saved-artifact-aware diagram preview Restaurar el enlace。

### 8.2 Ha sido probado nuevamente en la linea principal actual. automation / maintainership rebanada

Estan acotados los siguientes automation Tambien se ha vuelto a trabajar en la linea principal actual.：

1. Desensibilizacion provider Exportacion y public-safe CLI surface Exportar；
2. Cobertura limitada path-based Operacion（`content.batch-generate-from-titles`、`content.split-note-by-chapters`、`research.summarize-topic`、`diagram.generate`）con export En el almacen operativo maintainer help/invoke Guion；
3. repo-saga Bloqueo de ejecucion en serie, prueba correspondiente y maintainer Restricciones de documentos。

### 8.3 Explicacion correcta despues de la recuperacion.

La explicacion precisa despues de la restauracion seria：

1. 2026-05-24 La auditoria queda del entonces force-rewritten Instantanea de referencia valida del estado de la sucursal；
2. Desde entonces, la linea principal actual ha recuperado algo de capacidad limitada pero sustancial. backup-branch Amplitud de capacidades；
3. package metadata、welcome digest con README family en release-facing version truth Resincronizado con `1.8.9`；
4. render-host runtime Aunque el codigo fuente candidato reaparece en `src/` Medio, pero build/audit La verdad todavia solo prueba `main.js` Entrega de un solo activo；
5. Pero se sigue sobreestimando como “ya disponible” dedicated runtime assets”O “ya tengo sin fronteras maintainer mutation surface”Aun inexacto。

Esto tambien cambia ligeramente el siguiente paso correcto.：

1. recovery El trabajo ya no consiste principalmente en “seguir demostrando si existen las porciones de producto que faltan””；
2. La pregunta en el siguiente nivel es: continuar dejando runtime Mantenimiento del codigo fuente candidato dormant source-only Estado, o actualizarlo a real packaged boundary；
3. Al mismo tiempo，maintainer helper No puede malinterpretarse como ampliado. public CLI surface。
