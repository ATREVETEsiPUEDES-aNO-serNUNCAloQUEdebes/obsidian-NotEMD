---
date: 2026-05-10
last_updated: 2026-05-10
topic: multi-entry-candidate-contract-and-stage-c-gate
---

# Stage-B2 Contratos candidatos de entradas multiples y Stage-C puesta en marcha Gate

## 1. Proposito y Alcance

Este documento packaging/semantic convergence En orbita Stage-B2 El contrato se coloca por separado como un artefacto referenciable.。  
No cambia inmediatamente el empaquetado del tiempo de ejecucion, solo se define al ingresar Stage-C Limites de la evidencia que deben establecerse antes de la implementacion del tiempo de ejecucion。

Fuentes de demanda asociadas：

1. `.trellis/tasks/05-08-packaging-semantic-verification-convergence/prd.md`（R1-R6 con acceptance criteria）
2. `docs/superpowers/plans/2026-05-03-mainline-stabilization-next-batch.zh-CN.md`
3. `docs/brainstorms/2026-05-08-packaging-semantic-convergence-progress-and-next-steps.zh-CN.md`

## 2. Instantanea del valor de verdad del codigo actual (evidencia principal）

### 2.1 Construyendo valores de verdad limite（`esbuild.config.mjs`）

- `entryPoints: ["src/main.ts"]`
- `outfile: "main.js"`
- No declarado `outdir`

Conclusion: La verdad de la compilacion actual sigue siendo un complemento de una sola entrada y una sola salida. bundle modelo。

### 2.2 Valor de verdad del empaquetado del host en tiempo de ejecucion（`scripts/audit-render-host-bundle.js`）

- Requisitos de auditoria render-host La cadena de marcas existe en `main.js` Adentro
- La auditoria rechaza explicitamente los siguientes productos anfitriones independientes：
  - `render-host.html`
  - `render-host.js`
  - `rendering-webview/index.html`
- La auditoria tambien rechaza referencias que impliquen activos externos del anfitrion.

Conclusion: Los limites actualmente aplicados todavia solo resultan “en linea `srcdoc` "Host autonomo" no significa que se haya completado el aislamiento de los activos del host independiente.。

### 2.3 Release Valor real del contrato de activos（`scripts/release/publish-github-release.js`）

- `REQUIRED_RELEASE_ASSETS = ['main.js', 'manifest.json', 'styles.css', 'README.md']`
- release tag Debe coincidir con el formato del numero. `x.x.x`

Conclusion: Actual release El contrato aun asume `main.js` Es el principal producto de entrega en tiempo de ejecucion.。

### 2.4 Valor de verdad del contrato semantico（`scripts/diagram-semantic-verification.js`）

- helper La plantilla contiene actualmente：
  - `Packaging Boundary`
  - `Packaging Contract`
  - `Contract Promotion Boundary`
  - `Implementation Readiness Contract`
- helper Ahora codificado：
  - Genere el valor verdadero objetivo（`outfile` vs `outdir`）
  - release Valor real del contrato de activos
  - Stage-B2 runtime-isolation Mapeo de condiciones previas

Conclusion: La expresion del contrato de capa semantica ha madurado lo suficiente como para servir como Stage-C puesta en marcha gate，Pero el aislamiento en tiempo de ejecucion todavia se encuentra en un estado explicito de "no declarado completo"。

## 3. Comparacion profunda: requisitos previos vs Progreso de la arquitectura actual.

| Seguimiento de la demanda | Expectativas anteriores | Evidencia actual | Estado de avance | Stage-C Todavia necesito recuperarme antes |
|---|---|---|---|---|
| PRD R1 | No exageres heavy-runtime isolation | build/audit/release Todavia anclado `main.js` + En linea host Valor de verdad | Bucle cerrado y estable. | Ninguno |
| PRD R2 | No reabrir operation Superficie semantica | El corte convergente todavia esta limitado a helper/Pruebas/Documentacion | Bucle cerrado y estable. | No hay ninguna pista actual |
| PRD R3/R5 | Inspeccion del contrato de durabilidad + Cobertura antideriva | helper + Prueba de guion + Los documentos estan alineados y en continua expansion. | Bucle cerrado y estable. | parser/contract Continue con el cambio y arregle primero el ejemplo fallido. |
| PRD R4 | Las declaraciones de documentacion deben seguir los valores de verdad del codigo. | maintainer + progress/superpowers EN/ZH sincronizado | Bucle cerrado y estable. | Continuar sincronizando el mismo lote |
| superpowers Tareas 3 Intencion original | Sea honesto acerca de los limites del empaquetado en tiempo de ejecucion | La copia del borde ha sido escrita por audit/helper Expresar y ser restringido | Completado en “Capa de aclaracion de la verdad” | verdadero multi-entry runtime split Aun no he empezado |
| Stage-B2 readiness Intencion original | en runtime Curado antes de la modificacion. implementation-readiness Contrato | helper Ya tengo readiness Mapeo de bloques y condiciones previas | Parcialmente completado | Todavia necesito realizar pedidos de forma independiente. multi-entry Candidatos y migracion gate |

## 4. Stage-B2 Contrato candidato (contenido que debe hacerse explicito antes de ingresar a la transformacion en tiempo de ejecucion).）

### 4.1 Direcciones de empaquetado candidatas (semantica previa a la implementacion)）

Proporcionar Stage-C Indicaciones para la evaluacion del candidato：

1. De un solo `outfile` Migrar a controlado `outdir` Propiedad del producto
2. Solo si release/audit La division solo se permite cuando los contratos se actualizan en el mismo lote dedicated host/runtime Activos
3. La documentacion explicita debe continuar durante la migracion. `main.js` Compatibilidad y expectativas de pertenencia

Esto sigue siendo solo una expresion de contrato candidato, no una declaracion implementada.。

### 4.2 `outfile -> outdir` Actualizaciones de contrato necesarias para la migracion

Si quieres empezar Stage-C，Un mismo lote debe contener ambos：

1. Construyendo actualizaciones de la verdad.（`esbuild.config.mjs`），Declarar explicitamente la propiedad de los productos de salida.
2. Auditoria de actualizacion del valor de verdad（`scripts/audit-render-host-bundle.js`），Redefinicion permitida/Cobros de activos prohibidos
3. release Actualizacion del contrato（`REQUIRED_RELEASE_ASSETS` Y pruebas relacionadas/Documentacion）
4. semantic helper Redaccion y actualizaciones de prueba para evitar que se conserven declaraciones de entrada unica obsoletas

### 4.3 Ser runtime-isolation Declaracion de elevacion para el bloqueo de condiciones previas

Antes de implementar y verificar el limite del tiempo de ejecucion, todo lo que depende del supuesto de aislamiento del host workflow/settings/export Las declaraciones de operaciones vecinas deben continuar en el estado de "promocion prohibida a declaracion completa"。

## 5. Stage-C puesta en marcha Gate（Todo debe cumplirse）

Solo cuando se cumplan todas las siguientes condiciones，Stage-C Se requiere la implementacion del limite de tiempo de ejecucion para comenzar：

1. **Contrato Gate：** Stage-B2 El contrato candidato ha sido colocado en el documento y esta en helper Hay anclajes semanticos correspondientes en la copia.。
2. **Pruebas Gate：** Ya disponible para la migracion de contrato planificada fail-first Ejemplo de regresion。
3. **Auditoria Gate：** Bajo la nueva topologia de activos `audit:render-host` Primero se definio el modelo de verdad y luego se permitio que se implementaran cambios de construccion.。
4. **Release Gate：** Despues de la migracion release Propiedad de activos y release notes El contrato sigue siendo explicito.。
5. **Documentacion Gate：** maintainer + progress + superpowers EN/ZH La documentacion debe actualizarse en el mismo lote que el valor de verdad del codigo.。
6. **Almacen Gate：** Se paso la cadena de verificacion completa.（`build`、Prueba completa、audits、`git diff --check`、`obsidian help`、`obsidian-cli help`）。

## 6. Proximos pasos especificos despues de la publicacion de este documento

1. en semantic helper Entorno complementario en las pruebas de guiones `outfile -> outdir` Semantica de la migracion de candidatos fail-first muestra。
2. Redactar una “independencia host Diferencias en el contrato de auditoria de activos。
3. Redaccion release-helper Pruebas de migracion de activos para garantizar que el proceso de migracion `main.js` La semantica de atribucion no se pierde。
4. Continue manteniendo cada porcion atomica、CI-safe，E implementar la cadena de acceso completa.。

## 7. Articulos no declarados (para evitar）

Este documento**No**Reclamacion：

- runtime isolation Ya implementado
- multi-entry El producto de construccion ha sido enviado.
- Independencia render-host El activo ha sido release Aprobacion

El valor de verdad actual sigue siendo: entrada unica `src/main.ts -> main.js`，Y por existir audit con release Restricciones impuestas por contrato “en linea host Autonomo”。
