# 2026-04-09 Linea base de soporte linguistico

Guarde este directorio language-support Inmutabilidad de la transformacion de varias etapas.**Antes de los cambios**Evidencia。

## Documentacion

- `environment-before.txt`：Tiempo de ejecucion vs. CLI Instantanea del entorno（`node`、`npm`、`obsidian`、`obsidian-cli`）。
- `build-before.txt`：Antes de los cambios `npm run build` Salida。
- `targeted-tests-before.txt`：Salida de la prueba de regresion dirigida antes de los cambios.。

## Explicacion de la linea de base actual

- La prueba direccional en esta linea de base es PASS。
- La base de esta linea de base es FAIL，La razon es `ref/notebook-navigator` Ser `tsconfig` de glob El patron se incluye en el alcance de la compilacion, lo que desencadena TypeScript `TS6059`。
- El problema de construccion se considera una restriccion de referencia conocida; si `ref` El catalogo de referencia permanece en el almacen y debe estar en plano. Task 9 Step 1 Resolver (sera `ref/**` Exclusion TypeScript Alcance de la compilacion）。

## Normas de uso

Para cada tarea de implementacion, un nuevo par de `taskN-before.txt` con `taskN-after.txt` Registre y realice una comparacion directa antes de fusionar。

## Instantanea de acceso final（2026-04-09）

- `task9-build-after-docs.txt`：Finalmente `npm run build` Resultados。
- `task9-targeted-matrix.txt`：workflow/sidebar/provider/language Matriz de regresion。
- `task9-full-runInBand.txt`：completo Jest Resultados de la operacion。
- `task9-regression-baseline.txt` con `task9-regression-compare.txt`：Guiones baseline con compare Resultados。
- `task9-git-diff-check.txt`：Espacios en blanco y patch Control de seguridad。
- `task9-obsidian-help.txt` con `task9-obsidian-cli-help.txt`：Obsidian CLI Evidencia de usabilidad。

Descripcion del entorno para esta operacion.：

- No instalado en el entorno actual. `obsidian-cli`（`command not found`）。
- `obsidian help` Se puede ejecutar, pero el entorno del host puede ser de escritorio o headless Genere indicaciones adicionales segun la escena.。
