# Entrega de la version de soporte linguistico（2026-04-09）

## Alcance

Este traspaso cubre la transformacion del soporte linguistico de los primeros principios.：

- Modelo de dominio del lenguaje（`uiLocale` + Estrategias de lenguaje de tareas.）。
- traer locale fallback de UI i18n Infraestructura。
- Migracion de cadenas en tiempo de ejecucion de la pagina de configuracion, barra lateral, mensaje de error, etc.。
- prompt Ruta de decision del lenguaje unificado en el flujo de procesamiento。
- locale-aware Formato de hora y RTL-safe Proteccion del estilo。
- Guiones baseline/compare Flujo de trabajo de regresion。

## Resumen de antes y despues

- La construccion de la linea de base anteriormente era inestable debido a `ref/**` Ser incluido TypeScript Alcance de la compilacion, disparador `TS6059`。
- Se ha excluido el alcance de la compilacion actual. `ref/**`；Finalmente `npm run build` para PASS。
- La matriz de comportamiento direccional se mantiene antes y despues de la migracion. PASS。
- Completar despues de la integracion. `npm test -- --runInBand` para PASS。
- `git diff --check` No se encontro ningun problema de formato。

## Evidencia de verificacion final

- Build：`task9-build-after-docs.txt`
- Matriz de orientacion：`task9-targeted-matrix.txt`
- Prueba completa：`task9-full-runInBand.txt`
- Guion de regresion：`task9-regression-baseline.txt`、`task9-regression-compare.txt`
- Patch calidad：`task9-git-diff-check.txt`
- Obsidian Verificacion de comando：`task9-obsidian-help.txt`、`task9-obsidian-cli-help.txt`

Los archivos anteriores se encuentran en：

- `docs/superpowers/baselines/2026-04-09-language-support/`

## Riesgo residual

- Dependencias del entorno: falta el entorno de ejecucion actual `obsidian-cli`（`command not found`），Por lo tanto CLI La validacion aun esta incompleta.。
- Dependencias del anfitrion：`obsidian help` El comportamiento puede estar en headless O cambios en el entorno restringido del escritorio.。

## Instrucciones de preparacion para la publicacion

- Se han sincronizado el codigo y la documentacion para la arquitectura del lenguaje y los procesos de regresion.。
- `README.md` con `README_zh.md` Las restricciones de liberacion del mantenedor se han registrado al mismo tiempo.：
  - Chino e ingles bilingues legibles de forma independiente release Redaccion publicitaria；
  - release Los activos requeridos deben incluir `README.md`。
- Se recomienda que el control de acceso a la liberacion se mantenga lo mas：
  - `npm run build`
  - `npm test -- --runInBand`
  - `npm run regression:language-compare`
