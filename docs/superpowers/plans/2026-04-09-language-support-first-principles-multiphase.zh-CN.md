# Notemd El lenguaje respalda el plan de ejecucion de varias etapas de los primeros principios.

> **Al agente albacea：** Requerido `superpowers:subagent-driven-development`（Recomendado) o `superpowers:executing-plans`，Implementar este plan paso a paso segun las tareas. Pasos para seguir usando casillas de verificacion `- [ ]` Seguimiento gramatical。

**Metas：** 在不破坏现有功能鲁棒性de前提下,分阶段把 Notemd Actualice de "Configuracion del idioma de salida de la tarea" a“UI i18n + Unificar la estrategia linguistica + Sistema completo de soporte de idiomas para "verificacion de regresion"。

**Arquitectura：** Utilice "Modelado de dominio del lenguaje" -> i18n Infraestructura -> UI Migracion de redaccion publicitaria -> Convergencia de la estrategia del lenguaje de tareas -> Regreso a la arquitectura de cinco capas de control de acceso.。`UI Locale` Con `Task Output Language` Separacion clara, todas las decisiones sobre el lenguaje de las tareas se unifican en la capa de estrategia, todos los cambios se implementan en etapas y se comparan con el mismo calibre antes y despues de la aplicacion.。

**Pila de tecnologia：** TypeScript、Obsidian Plugin API、Jest、ESLint、npm scripts、Obsidian CLI（`obsidian` / `obsidian-cli`）

---

## Estado de ejecucion（2026-04-09）

Este plan ya esta en marcha `main` Al aterrizar se realiza la presentacion correspondiente `88202c5`。

### Indice de evidencia

- Registro de linea base y etapa：
  - `docs/superpowers/baselines/2026-04-09-language-support/`
- Producto de verificacion final：
  - `task9-build-after-docs.txt`
  - `task9-targeted-matrix.txt`
  - `task9-full-runInBand.txt`
  - `task9-regression-baseline.txt`
  - `task9-regression-compare.txt`
  - `task9-git-diff-check.txt`
  - `task9-obsidian-help.txt`
  - `task9-obsidian-cli-help.txt`

### Resultados finales del control de acceso

- `npm run build`: PASS
- Matriz de regresion direccional：PASS
- Full `npm test -- --runInBand`: PASS
- `npm run regression:language-compare`: PASS
- `git diff --check`: PASS
- `obsidian help`：Se han registrado en el registro las restricciones de configuracion local o de escritorio relevantes ejecutadas.
- `obsidian-cli help`：El entorno actual no esta disponible.（`command not found`），Registrado en el registro.

## 阶段边界Con鲁棒性规则（必须遵守）

- Cada etapa debe ser ejecutada.：`Linea de base antes de la modificacion -> Cambios minimos -> Devolucion tras modificacion -> Comparacion de referencia -> Enviar`。
- Mantenga al menos dos registros para cada etapa.：`*-before.txt` Con `*-after.txt`，poner `docs/superpowers/baselines/<date>-language-support/`。
- 如果阶段回归失败，禁止进入下一阶段；先在当前阶段内修复并重新比对。
- Utilice la misma entrada de prueba para la misma funcion para comparar el antes y el despues para evitar "pasar cambiando de calibre"”。

---

### Tareas 0：Congelar la instantanea de referencia (realidad actual）

**Documentacion：**
- crear/Actualizacion：`docs/superpowers/baselines/2026-04-09-language-support/environment-before.txt`
- crear/Actualizacion：`docs/superpowers/baselines/2026-04-09-language-support/build-before.txt`
- crear/Actualizacion：`docs/superpowers/baselines/2026-04-09-language-support/targeted-tests-before.txt`

- [ ] **Pasos 1：Recopilar lineas de base ambientales**
Ejecucion：
```bash
cd /home/jacob/obsidian-NotEMD
obsidian help
obsidian-cli help
node -v
npm -v
```
Esperado: comando ejecutable (permitir Obsidian CLI Salida de alarmas de configuracion local.）。

- [ ] **Pasos 2：Recopilar y construir lineas de base**
Ejecucion：
```bash
cd /home/jacob/obsidian-NotEMD
npm run build
```
Expectativa: La linea de base actual permite la falla, pero se debe registrar el motivo de la falla (actualmente conocido).：`ref/notebook-navigator` Ser `tsconfig` include Causas del escaneo `TS6059`）。

- [ ] **Pasos 3：Recopilar la linea base de la funcion de orientacion.**
Ejecucion：
```bash
cd /home/jacob/obsidian-NotEMD
npm test -- --runInBand src/tests/workflowButtons.test.ts src/tests/sidebarDomButtonClicks.test.ts src/tests/llmUtilsProviderSupport.test.ts src/tests/providerDiagnostics.test.ts
```
Anticipacion：PASS；Servir como base de comportamiento clave durante la transformacion del apoyo linguistico。

---

### Tareas 1：Presentacion del modelo de dominio del lenguaje (unica fuente de verdad）

**Documentacion：**
- crear：`src/i18n/languageContext.ts`
- crear：`src/i18n/taskLanguagePolicy.ts`
- Modificar：`src/types.ts`
- Modificar：`src/constants.ts`
- Pruebas：`src/tests/languagePolicy.test.ts`

- [ ] **Pasos 1：Escriba pruebas fallidas para cubrir las reglas de politicas.**
Cobertura: idioma global, idioma por tarea, desactivar traduccion automatica、Translate Excepciones de tareas、Mermaid Estrategias especiales。

- [ ] **Pasos 2：Ejecute la prueba y confirme el error.**
Ejecucion：
```bash
npm test -- --runInBand src/tests/languagePolicy.test.ts
```
Anticipacion：FAIL（La capa de estrategia aun no se ha implementado.）。

- [ ] **Pasos 3：Implementar la capa de politica minima**
Implementar entrada unificada：`resolveTaskLanguage(taskKey, settings)` Con `resolveUiLocale(settings, obsidianLocale)`。

- [ ] **Pasos 4：Vuelva a ejecutar la prueba**
Ejecucion：
```bash
npm test -- --runInBand src/tests/languagePolicy.test.ts
```
Anticipacion：PASS。

- [ ] **Pasos 5：Comparacion antes y despues de la ejecucion**
Ejecucion：
```bash
npm test -- --runInBand src/tests/languagePolicy.test.ts > docs/superpowers/baselines/2026-04-09-language-support/task1-after.txt 2>&1
```
Comparacion：
```bash
grep -E "PASS|FAIL" docs/superpowers/baselines/2026-04-09-language-support/task1-after.txt
```

---

### Tareas 2：Construye la interfaz i18n Infraestructura (Directorio de Idiomas + Revertir）

**Documentacion：**
- crear：`src/i18n/index.ts`
- crear：`src/i18n/locales/en.ts`
- crear：`src/i18n/locales/zh_cn.ts`
- crear：`src/i18n/locales/zh_tw.ts`
- Modificar：`src/main.ts`
- Pruebas：`src/tests/i18nFallback.test.ts`

- [ ] **Pasos 1：Escriba pruebas fallidas y cubra la cadena alternativa.**
Cobertura：`zh-CN -> zh -> en`、Desaparecido key Respaldo, interpolacion variable, estabilidad de cache。

- [ ] **Pasos 2：La confirmacion fallo**
Ejecucion：
```bash
npm test -- --runInBand src/tests/i18nFallback.test.ts
```
Anticipacion：FAIL。

- [ ] **Pasos 3：Implementacion i18n Nucleo**
Referencia：`ref/notebook-navigator/src/i18n/index.ts` de `LANGUAGE_MAP + deep-merge fallback` Patron, pero manten Notemd Manten tus limites simples。

- [ ] **Pasos 4：Vuelva a ejecutar la prueba**
Ejecucion：
```bash
npm test -- --runInBand src/tests/i18nFallback.test.ts
```
Anticipacion：PASS。

- [ ] **Pasos 5：Comparacion con la linea de base antes del cambio**
Guarde y compare los registros antes y despues de esta tarea, y confirme i18n La introduccion no tiene ningun impacto en los existentes. provider/mermaid/workflow Pruebas。

---

### Tareas 3：Migre la copia de la interfaz de la pagina de configuracion a i18n（Superficies de alto impacto）

**Documentacion：**
- Modificar：`src/ui/NotemdSettingTab.ts`
- Modificar：`src/i18n/locales/en.ts`
- Modificar：`src/i18n/locales/zh_cn.ts`
- Pruebas：`src/tests/providerDiagnostics.test.ts`
- Pruebas：`src/tests/sidebarDomButtonClicks.test.ts`

- [ ] **Pasos 1：采集变更前快照（设置页相关Pruebas）**
Ejecucion：
```bash
npm test -- --runInBand src/tests/providerDiagnostics.test.ts src/tests/sidebarDomButtonClicks.test.ts > docs/superpowers/baselines/2026-04-09-language-support/task3-before.txt 2>&1
```

- [ ] **Pasos 2：uso `strings` Reemplazo de acceso a etiquetas de interfaz codificadas**
Alcance: Configuracion de idioma, Diagnostico del desarrollador, Generador de flujo de trabajo、Provider Consejos de configuracion。

- [ ] **Pasos 3：Ejecute el mismo conjunto de pruebas despues de los cambios.**
Ejecucion：
```bash
npm test -- --runInBand src/tests/providerDiagnostics.test.ts src/tests/sidebarDomButtonClicks.test.ts > docs/superpowers/baselines/2026-04-09-language-support/task3-after.txt 2>&1
```
Anticipacion：PASS。

- [ ] **Pasos 4：Ejecucion `diff` Comparacion**
Ejecucion：
```bash
diff -u docs/superpowers/baselines/2026-04-09-language-support/task3-before.txt docs/superpowers/baselines/2026-04-09-language-support/task3-after.txt | sed -n '1,200p'
```
Anticipacion：只接受文案相关差异，不接受行为失败差异。

---

### Tareas 4：Migrar la barra lateral y solicitar copiar (superficie de experiencia en tiempo de ejecucion)）

**Documentacion：**
- Modificar：`src/ui/NotemdSidebarView.ts`
- Modificar：`src/ui/ErrorModal.ts`
- Modificar：`src/main.ts`
- Modificar：`src/i18n/locales/en.ts`
- Modificar：`src/i18n/locales/zh_cn.ts`
- Pruebas：`src/tests/sidebarDomButtonClicks.test.ts`
- Pruebas：`src/tests/sidebarButtonTriggerChains.test.ts`

- [ ] **Pasos 1：Registrar las pruebas de referencia de la interfaz en tiempo de ejecucion**
Ejecucion：
```bash
npm test -- --runInBand src/tests/sidebarDomButtonClicks.test.ts src/tests/sidebarButtonTriggerChains.test.ts > docs/superpowers/baselines/2026-04-09-language-support/task4-before.txt 2>&1
```

- [ ] **Pasos 2：La copia es visible cuando se ejecuta la migracion.**
Incluye: titulo principal, texto del boton, aviso de cancelacion, aviso de operacion de registro, copia del boton modal de error。

- [ ] **Pasos 3：Vuelva a ejecutar el mismo conjunto de pruebas.**
Ejecucion：
```bash
npm test -- --runInBand src/tests/sidebarDomButtonClicks.test.ts src/tests/sidebarButtonTriggerChains.test.ts > docs/superpowers/baselines/2026-04-09-language-support/task4-after.txt 2>&1
```
Anticipacion：PASS。

- [ ] **Pasos 4：Comparar y establecer puertas.**
Solo presentate FAIL o open-handle Deterioro, debe retroceder a esta etapa para su reparacion.。

---

### Tareas 5：Unificar palabras clave y decisiones de lenguaje de tareas en enlaces de procesamiento

**Documentacion：**
- Modificar：`src/promptUtils.ts`
- Modificar：`src/fileUtils.ts`
- Modificar：`src/searchUtils.ts`
- Modificar：`src/main.ts`
- Modificar：`src/i18n/taskLanguagePolicy.ts`
- Pruebas：`src/tests/languagePolicy.test.ts`
- Pruebas：`src/tests/processFile.test.ts`
- Pruebas：`src/tests/workflowButtons.test.ts`

- [ ] **Pasos 1：Recopile pruebas de comportamiento antes de los cambios.**
Ejecucion：
```bash
npm test -- --runInBand src/tests/languagePolicy.test.ts src/tests/processFile.test.ts src/tests/workflowButtons.test.ts > docs/superpowers/baselines/2026-04-09-language-support/task5-before.txt 2>&1
```

- [ ] **Pasos 2：Eliminar decisiones linguisticas dispersas**
voluntad `fileUtils/searchUtils/promptUtils` La logica de dispersion interna converge a `taskLanguagePolicy`。

- [ ] **Pasos 3：Complementar afirmaciones explicitas con comportamientos que de otro modo serian implicitos.**
Asegurate `disableAutoTranslation`、task-specific language、translate task La logica de excepcion es comprobable。

- [ ] **Pasos 4：Ejecute el mismo conjunto de pruebas despues de los cambios.**
Ejecucion：
```bash
npm test -- --runInBand src/tests/languagePolicy.test.ts src/tests/processFile.test.ts src/tests/workflowButtons.test.ts > docs/superpowers/baselines/2026-04-09-language-support/task5-after.txt 2>&1
```
Anticipacion：PASS。

- [ ] **Pasos 5：Compara el antes y el despues de los cambios.**
Solo se permiten diferencias en el texto de registro esperado; Se prohiben los cambios de ruta funcional que conduzcan a aserciones reducidas.。

---

### Tareas 6：Agregue formato localizado y RTL Proteccion de seguridad

**Documentacion：**
- Modificar：`styles.css`
- crear：`src/i18n/localeFormat.ts`
- Modificar：`src/ui/NotemdSidebarView.ts`
- Pruebas：`src/tests/sidebarDomButtonClicks.test.ts`

- [ ] **Pasos 1：aumentar RTL Reglas de seguridad con direccion de texto.**
Introducir normas minimas necesarias para evitar danar las existentes. panel Diseno。

- [ ] **Pasos 2：Para formatear helper Agregar pruebas**
Agregar fecha/Formato de hora fallback Pruebas basicas。

- [ ] **Pasos 3：Verificar las pruebas de diseno de la barra lateral**
Ejecucion：
```bash
npm test -- --runInBand src/tests/sidebarDomButtonClicks.test.ts
```
Anticipacion：PASS（Especialmente docked footer / log Afirmaciones relacionadas con la visibilidad del area）。

---

### Tareas 7：Construya un andamiaje de regresion para comparaciones de antes y despues.

**Documentacion：**
- crear：`scripts/regression/language-support-baseline.sh`
- crear：`scripts/regression/language-support-compare.sh`
- Modificar：`package.json`
- crear：`docs/superpowers/baselines/README.md`
- Pruebas：`src/tests/llmUtilsProviderSupport.test.ts`

- [ ] **Pasos 1：Comando de recopilacion de lineas base con script**
把关键命令统一封装,Asegurate团队可重复Ejecucion。

- [ ] **Pasos 2：Control de acceso de comparacion con script**
Comprobacion automatica PASS/FAIL Estadisticas y palabras clave de errores criticos（`TS6059`, `ERR_CONNECTION_CLOSED`, `socket hang up` Solo permitido en mock Aparece en el registro.）。

- [ ] **Pasos 3：Verificar el script localmente**
Ejecucion：
```bash
npm run test -- --runInBand src/tests/llmUtilsProviderSupport.test.ts
bash scripts/regression/language-support-baseline.sh
bash scripts/regression/language-support-compare.sh
```
Anticipacion：compare script Regreso 0 Antes de que se le permita continuar。

---

### Tareas 8：Sincronizar documentos y proceso de publicacion.

**Documentacion：**
- Modificar：`README.md`
- Modificar：`README_zh.md`
- Modificar：`docs/superpowers/plans/2026-04-09-language-support-first-principles-multiphase.en.md`
- Modificar：`docs/superpowers/plans/2026-04-09-language-support-first-principles-multiphase.zh-CN.md`

- [ ] **Pasos 1：Arquitectura de soporte de lenguaje de documentos**
Contiene `UI Locale` Con `Task Output Language` Definicion y uso。

- [ ] **Pasos 2：Flujo de trabajo de regresion de documentos**
Deja claro que cada etapa hay que salvarla before/after logs。

- [ ] **Pasos 3：Requisitos de instrucciones de liberacion sincronica**
Asegurate发布说明继续保持中英双语独立段落要求。

---

### Tareas 9：Verificacion final del control de acceso (esta prohibida la entrega a mitad de camino)）

**Documentacion：**
- Verificacion：`src/`、`styles.css`、`README.md`、`README_zh.md`、`scripts/regression/`、`docs/superpowers/` Archivos modificados en

- [ ] **Pasos 1：Reanudar clonacion `ref/` Genere estabilidad detras de los directorios**
Si esta reservado `ref/notebook-navigator` En el almacen, es necesario `tsconfig.json` Exclusiones `ref/**`，Asegurese de que la compilacion no se vea afectada por el repositorio de referencia.。

- [ ] **Pasos 2：Ejecute la compilacion**
Ejecucion：
```bash
npm run build
```
Anticipacion：PASS。

- [ ] **Pasos 3：Ejecucion de matrices de regresion direccional**
Ejecucion：
```bash
npm test -- --runInBand src/tests/workflowButtons.test.ts src/tests/sidebarDomButtonClicks.test.ts src/tests/llmUtilsProviderSupport.test.ts src/tests/providerDiagnostics.test.ts src/tests/languagePolicy.test.ts src/tests/i18nFallback.test.ts
```
Anticipacion：PASS。

- [ ] **Pasos 4：Ejecute la prueba completa**
Ejecucion：
```bash
npm test -- --runInBand
```
Anticipacion：PASS（Si hay un conocido open-handle warning，Necesidad de registrar y asegurar que no se haya deteriorado）。

- [ ] **Pasos 5：Ejecucion Obsidian CLI Chequeo de salud**
Ejecucion：
```bash
obsidian help
obsidian-cli help
```
Expectativa: el comando es ejecutable。

- [ ] **Pasos 6：Ejecucion `diff` Inspeccion de calidad**
Ejecucion：
```bash
git diff --check
```
Anticipacion：PASS。

- [ ] **Pasos 7：Enviar por etapa**
每个阶段独立Enviar，禁止跨阶段混杂Enviar。

- [ ] **Pasos 8：Entrega de liberacion**
Antes de que se publique la version, debe ir acompanada de: resumen de la prueba、before/after Conclusion de la comparacion y riesgo restante。

---

## Instrucciones de implementacion para ingenieros.

- Implementacion de referencia：`/home/jacob/obsidian-NotEMD/ref/notebook-navigator/src/i18n/index.ts`。
- Pero Notemd No copiar todo; migrar solo el “nucleo minimo mantenible””（map + fallback + centralized strings + tests）。
- Cada etapa debe ejecutar primero una prueba "previa a la etapa" y guardar los registros. Cualquier proceso de "cambiar primero y luego agregar registros" se considera no conforme.。
