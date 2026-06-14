# Distrito Chino Provider Ampliar la segunda ronda del plan de ejecucion.

> **给代理Ejecucion者：** Debe usar `superpowers:subagent-driven-development`（Recomendado) o `superpowers:executing-plans`，Implementar este plan paso a paso segun las tareas. Pasos para seguir usando casillas de verificacion `- [ ]` Seguimiento gramatical。

**Metas：** voluntad `Qwen Code`、`Z AI` con `Huawei Cloud MaaS` como Notemd completo provider Entrega preestablecida, incluida la cobertura del tiempo de ejecucion, la cobertura de la prueba de conexion, las actualizaciones de documentos y el lanzamiento de la version del parche.。

**Arquitectura：** Tres provider Continuar reutilizando los existentes. `openai-compatible` transport，Mantener la implementacion metadata-driven。Expandir primero provider registry，Orientacion sobre reutilizacion routing con connection-test Anule el comportamiento de bloqueo, finalmente actualice la documentacion y publique la version bilingue con los recursos necesarios.。

**Pila de tecnologia：** TypeScript、Jest、Obsidian Plugin API、Existente Notemd provider registry/runtime、GitHub Releases

---

## 进度对齐Actualizacion（2026-05-08）

Esta segunda ronda de planes se ha cumplido y ahora debe leerse como un record historico de lanzamiento.。

Resultados entregados：

- `Qwen Code`、`Z AI`、`Huawei Cloud MaaS` Ingresado como valor predeterminado de primera clase `src/llmProviders.ts`。
- Este lote Provider El comportamiento de prueba de enrutamiento y conexion ha sido cambiado por `src/tests/llmProviders.test.ts` y `src/tests/llmUtilsProviderSupport.test.ts` Cobertura。
- Se han implementado los documentos correspondientes y las actualizaciones de registros de cambios.（`README.md`、`README_zh.md`、`change.md`）。

Tambien se han implementado desarrollos posteriores mas alla de este plan.：

- Se han lanzado mas ajustes preestablecidos de China en la misma direccion.（`Baidu Qianfan`、`SiliconFlow`、`Xiaomi MiMo`）。
- compartir transport El comportamiento continua metadata-driven，Pasar en circunstancias necesarias. chat-first probing ir OpenAI-compatible Ruta de ejecucion unificada。

Brecha residual real：

1. Ir contra la corriente provider Evolucion del catalogo, manteniendo continuamente sincronizados los valores predeterminados preestablecidos, la cobertura de pruebas y las descripciones de la documentacion.。
2. Hazlo mas ancho packaging/semantic-verification convergence con provider Promocion separada del crecimiento de la lista。

---

## Estructura de archivos

### Nucleo Provider Metadatos
- Modificacion：`src/llmProviders.ts`
- Responsabilidades: Nuevo provider Preestablecido, descripcion、setup hint、Clasificacion, por defecto model y API-test Metadatos。

### Cobertura de prueba de conexion y tiempo de ejecucion
- Modificacion：`src/tests/llmProviders.test.ts`
- Modificacion：`src/tests/llmUtilsProviderSupport.test.ts`
- Responsabilidad: Bloquee estos nuevos provider de registry Exposicion、transport Enrutamiento、probe endpoint con transient-failure fallback Comportamiento。

### Documentacion y materiales de autorizacion
- Modificacion：`README.md`
- Modificacion：`README_zh.md`
- Modificacion：`change.md`
- Modificacion：`package.json`
- Modificacion：`package-lock.json`
- Modificacion：`manifest.json`
- Modificacion：`versions.json`
- Responsabilidades: para `1.7.6` Sincronizacion provider Documentacion、changelog Con metadatos de publicacion。

### Verificacion y Liberacion
- Reconstruir el producto：`main.js`
- Liberar activos：`main.js`、`manifest.json`、`styles.css`、`README.md`
- Responsabilidad: Producir una limpieza patch release，Y viene con bilingue release notes Con los activos necesarios。

---

### Tareas 1：Para lo nuevo Provider aumentar Registry Cobertura

**Documentacion：**
- Modificacion：`src/tests/llmProviders.test.ts`
- Modificacion：`src/llmProviders.ts`
- Verificacion：`src/tests/llmProviders.test.ts`

- [ ] **Pasos 1：Redaccion de aserciones de registro fallidas**

Agregue expectativas de prueba y verifique：
- provider Existencia：`Qwen Code`、`Z AI`、`Huawei Cloud MaaS`
- transport：`openai-compatible`
- API test mode：`chat-only`
- openai-compatible Clasificacion

Estas nuevas afirmaciones deberian aparecer en：
- extendido provider-set Afirmar
- transport MetadatosAfirmar
- China-focused / openai-compatible En el bloque de asercion de metadatos

- [ ] **Pasos 2：Ejecute pruebas de registro especificas y confirme fallas**

Ejecucion：

```bash
npx jest src/tests/llmProviders.test.ts --runInBand
```

Expectativas：
- Fallo por tres cosas provider Aun no ingresado `src/llmProviders.ts`

- [ ] **Pasos 3：Implementar entradas de registro minimas**

Actualizacion `src/llmProviders.ts`，nuevo：
- `Qwen Code`
- `Z AI`
- `Huawei Cloud MaaS`

Utilice la siguiente configuracion predeterminada a menos que se demuestre un valor predeterminado mas seguro despues de consultar la documentacion oficial durante la fase de implementacion.：
- `Qwen Code`
  - base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`
  - model: `qwen3-coder-plus`
- `Z AI`
  - base URL: `https://api.z.ai/api/paas/v4`
  - model: `glm-5`
- `Huawei Cloud MaaS`
  - base URL: `https://api.modelarts-maas.com/v1`
  - model: `DeepSeek-V3`

Tres provider Se deben usar todos：
- category: `cloud`
- transport: `openai-compatible`
- apiKeyMode: `required`
- apiTestMode: `chat-only`

- [ ] **Pasos 4：Vuelva a ejecutar la prueba de registro enfocada y confirme que pasa.**

Ejecucion：

```bash
npx jest src/tests/llmProviders.test.ts --runInBand
```

Expectativas：
- PASS

- [ ] **Pasos 5：Enviar segmento de registro**

```bash
git add src/llmProviders.ts src/tests/llmProviders.test.ts
git commit -m "feat: add round 2 china provider presets"
```

---

### Tareas 2：Para lo nuevo Provider Agregar prueba de enrutamiento en tiempo de ejecucion

**Documentacion：**
- Modificacion：`src/tests/llmUtilsProviderSupport.test.ts`
- Verificacion：`src/tests/llmUtilsProviderSupport.test.ts`

- [ ] **Pasos 1：La escritura fallo `callLLM()` Pruebas**

Se agregaron nuevas pruebas y afirmaciones enfocadas. `callLLM()` voluntad：
- `Qwen Code` Ruta a DashScope compatible `chat/completions`
- `Z AI` Ruta a `https://api.z.ai/api/paas/v4/chat/completions`
- `Huawei Cloud MaaS` Ruta a `https://api.modelarts-maas.com/v1/chat/completions`

Cada prueba debe afirmar：
- URL
- `Authorization` header
- model Transmision transparente
- Existente OpenAI-compatible El analizador de respuestas extrae resultados con exito

- [ ] **Pasos 2：Corre concentrado provider-support Pruebe y confirme el fallo.**

Ejecucion：

```bash
npx jest src/tests/llmUtilsProviderSupport.test.ts --runInBand
```

Expectativas：
- Fracaso porque es nuevo provider Todavia no routing Aun no se reconocen la cobertura de aserciones o las rutas de metadatos de las dependencias de prueba. provider Nombre

- [ ] **Pasos 3：Cobertura completa del tiempo de ejecucion con cambios minimos.**

Actualice solo aquellos que hacen lo nuevo. provider El nombre fluye a traves de lo existente. `openai-compatible` Codigo requerido para la ruta。

Limitaciones importantes：
- No agregues nuevos transport
- A menos que la implementacion demuestre que las rutas compartidas son completamente inviables, no agregue otras nuevas basadas en provider-name de runtime Sucursal

- [ ] **Pasos 4：Vuelva a ejecutar enfocado provider-support Pruebe y confirme que pasa la prueba de la nueva ruta.**

Ejecucion：

```bash
npx jest src/tests/llmUtilsProviderSupport.test.ts --runInBand
```

Expectativas：
- nuevo `callLLM()` Casos de uso PASS

- [ ] **Pasos 5：Enviar segmentos de enrutamiento en tiempo de ejecucion**

```bash
git add src/tests/llmUtilsProviderSupport.test.ts src/llmProviders.ts src/llmUtils.ts
git commit -m "test: cover runtime routing for new china providers"
```

---

### Tareas 3：Agregue prueba de conexion y cobertura alternativa instantanea

**Documentacion：**
- Modificacion：`src/tests/llmUtilsProviderSupport.test.ts`
- Verificacion：`src/tests/llmUtilsProviderSupport.test.ts`

- [ ] **Pasos 1：La escritura fallo `testAPI()` Pruebas**

nuevo以下Pruebas：
- `Qwen Code` de `testAPI()` Deteccion exitosa
- `Z AI` de `testAPI()` Deteccion exitosa
- `Huawei Cloud MaaS` de `testAPI()` Deteccion exitosa
- Cada nuevo provider en `testAPI()` La etapa ocurre instantaneamente `ERR_CONNECTION_CLOSED` oportuno fallback

Cada prueba debe afirmar：
- `chat/completions` probe Camino
- fallback Numero esperado de llamadas despues
- Recuperacion despues del reintento `success: true`

- [ ] **Pasos 2：Corre concentrado provider-support Pruebe y confirme que el nuevo caso de conexion falla**

Ejecucion：

```bash
npx jest src/tests/llmUtilsProviderSupport.test.ts --runInBand
```

Expectativas：
- Falla hasta registry Los metadatos y los dispositivos de prueba complementan estos nuevos connection Casos de uso

- [ ] **Pasos 3：Implementar soporte minimo para pruebas de conexion.**

保持实现继续 metadata-driven：
- `apiTestMode: chat-only`
- Reutilizar lo existente `requestUrlForConnectionTest()` fallback Camino

A menos que se demuestre su existencia provider Exclusivamente incompatibles; de lo contrario, no pague solo por estos provider Se agrego una nueva funcion de prueba de conexion.。

- [ ] **Pasos 4：Vuelva a ejecutar enfocado provider-support Prueba y confirma el paso.**

Ejecucion：

```bash
npx jest src/tests/llmUtilsProviderSupport.test.ts --runInBand
```

Expectativas：
- PASS

- [ ] **Pasos 5：Enviar segmento de prueba de conexion**

```bash
git add src/tests/llmUtilsProviderSupport.test.ts src/llmProviders.ts src/llmUtils.ts
git commit -m "test: cover connection probes for new china providers"
```

---

### Tareas 4：Actualizacion Provider Documentacion ampliada

**Documentacion：**
- Modificacion：`README.md`
- Modificacion：`README_zh.md`
- Modificacion：`change.md`

- [ ] **Pasos 1：Escriba una lista de verificacion del documento antes de editarlo.**

Asegurate de que cada documento mencione：
- `Qwen Code` como coding-focused preset
- `Z AI` como `GLM` Entrada suplementaria internacional
- `Huawei Cloud MaaS` Como alojado OpenAI-compatible preset
- Actualizado provider Lista de cobertura

- [ ] **Pasos 2：Actualizar ingles README**

Editar `README.md`，Actualizacion：
- feature / preset Cobertura bullet
- provider Capitulo de configuracion
- supported provider table/list

- [ ] **Pasos 3：Actualizar chino README**

Editar `README_zh.md`，Express en chino e ingles README Mismo significado。

- [ ] **Pasos 4：Actualizar el registro de cambios**

en `change.md` Nuevo en `1.7.6` Seccion, Descripcion：
- nuevo preset
- provider Cobertura de prueba
- Esta liberacion implica runtime Descripcion del comportamiento

- [ ] **Pasos 5：Envie fragmentos de documentos**

```bash
git add README.md README_zh.md change.md
git commit -m "docs: add round 2 provider coverage"
```

---

### Tareas 5：Preparar y verificar 1.7.6 Liberacion

**Documentacion：**
- Modificacion：`package.json`
- Modificacion：`package-lock.json`
- Modificacion：`manifest.json`
- Modificacion：`versions.json`
- construir：`main.js`

- [ ] **Pasos 1：Sincronizar los metadatos de la version con `1.7.6`**

Sincronizacion：
- `package.json`
- `package-lock.json`
- `manifest.json`
- `versions.json`
- `README.md` con `README_zh.md` Cualquier cadena de version visible en

- [ ] **Pasos 2：Ejecute la verificacion completa del almacen**

Ejecucion：

```bash
npm test -- --runInBand
npm run build
git diff --check
obsidian help
obsidian-cli help
```

Expectativas：
- Jest Pase
- build Salir `0`
- `git diff --check` limpio
- Obsidian CLI Los resultados deben documentarse fielmente, incluidas las limitaciones que aun pueden fallar en el entorno actual de la maquina.

- [ ] **Pasos 3：Envie la porcion para prepararse para su lanzamiento.**

```bash
git add package.json package-lock.json manifest.json versions.json README.md README_zh.md change.md main.js
git commit -m "chore: release 1.7.6"
```

- [ ] **Pasos 4：Empuja, etiqueta y crea GitHub Liberacion**

使用非交互式 git con GitHub CLI Orden：

```bash
git push origin main
git tag -a 1.7.6 -m "Release 1.7.6"
git push origin 1.7.6
gh release create 1.7.6 main.js manifest.json styles.css README.md --title 1.7.6 --notes-file /tmp/notemd-release-1.7.6.md --verify-tag
```

Release notes Requisitos：
- Parrafo completo en ingles.
- Parrafo chino completo
- Ambas partes se pueden leer de forma independiente.

- [ ] **Pasos 5：Verificacion已Liberacionde GitHub Liberacion**

Ejecucion：

```bash
git status --short --branch
gh release view 1.7.6 --json tagName,name,url,body,assets
```

Expectativas：
- worktree limpio
- tag/name Correcto
- Se han subido los cuatro activos requeridos.
- Bilingue release body existencia

---

## Revisar las instrucciones

Este plan mantiene deliberadamente metadata-driven 实现。如果Metas provider ¿Alguno de ellos requiere requisitos no estandar? auth header、Debe detenerse el flujo de firmas o acuerdos y provider Separalo en otro diseno en lugar de obligarlo a compartirlo. transport Camino。

Ningun usuario esta autorizado explicitamente para la delegacion de subagente para la sesion actual, por lo que no hay ningun usuario dedicado. plan-review 子代理。 Este plan se basa en el plan aprobado spec `docs/superpowers/specs/2026-03-26-china-provider-expansion-round2-design.md`、Complete la autoevaluacion del diseno de prueba actual y las reglas de liberacion solidificadas del almacen.。
