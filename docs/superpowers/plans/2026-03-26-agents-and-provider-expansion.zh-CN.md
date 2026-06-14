# AGENTS con Provider Ampliar el plan de ejecucion

> **Al agente albacea：** Debe usar `superpowers:subagent-driven-development`（Recomendado) o `superpowers:executing-plans`，Implementar este plan paso a paso segun las tareas. Pasos para seguir usando casillas de verificacion `- [ ]` Seguimiento gramatical。

**Metas：** Agregar nivel de proyecto `AGENTS.md`，Refuerzo Doubao Establezca la suma de comprobacion y Notemd Extension `Baidu Qianfan` con `SiliconFlow` provider Apoyo。

**Arquitectura：** Continue provider Los metadatos estan centralizados en `src/llmProviders.ts`，mantener `src/llmUtils.ts` de transport-driven runtime dispatch，Y agrega una pequena funcion pura validation helper，Para la pagina de configuracion warning Brinde apoyo. Las reglas del flujo de trabajo del almacen se escriben en el nuevo nivel raiz. `AGENTS.md`，Pero no lo modifiques `GEMINI.md`。

**Pila de tecnologia：** TypeScript、Jest、Obsidian Interfaz de la pagina de configuracion del complemento、GitHub Proceso de publicacion

---

## Actualizacion de alineacion de progreso（2026-05-08）

Este plan se ha entregado y actualmente se utiliza principalmente para el seguimiento historico.。

Resultados implementados：

- Nivel de proyecto `AGENTS.md` Ya existe y continua evolucionando hasta convertirse en un punto de entrada para las especificaciones de ejecucion.。
- Doubao Pagina de configuracion y verificacion del campo del modelo warning/Se ha implementado el control de acceso a la prueba de conexion y esta `src/tests/providerValidation.test.ts` Cobertura。
- `Baidu Qianfan` con `SiliconFlow` Se han implementado metadatos predeterminados. `src/llmProviders.ts`。
- El lote Provider La cobertura de prueba de conectividad y enrutamiento en tiempo de ejecucion ha sido proporcionada por `src/tests/llmProviders.test.ts` y `src/tests/llmUtilsProviderSupport.test.ts` Bloqueo。
- README / README_zh de Provider Las instrucciones de uso se han sincronizado con el comportamiento entregado.。

Mas alla del alcance del plan original, ahora implementado：

- Tambien se han lanzado mas ajustes preestablecidos orientados a China, incluidos `Qwen Code`、`Z AI`、`Huawei Cloud MaaS`、`Xiaomi MiMo`。
- Provider La expansion continua transport-driven，Compartir OpenAI-compatible Ruta de ejecucion en lugar de presionar provider Implementacion de bifurcacion de nombres。

Brecha real restante：

1. A medida que los incumplimientos sigan aumentando, seguir previniendo provider Metadatos / Documentacion / Deriva de la prueba。
2. voluntad packaging/semantic-verification convergence Continuar avanzando como pista independiente sin provider Mezcla extendida。

---

### Tareas 1：Agregar nivel de proyecto AGENTS Directrices

**Documentacion：**
- crear：`AGENTS.md`
- Pruebas/Verificacion：`README.md`、`README_zh.md`、locales git Flujo de trabajo de publicacion en la historia.

- [ ] **Pasos 1：Contenido de la guia de redaccion**
Escribe un texto conciso pero autorizado. `AGENTS.md`，Cubre la descripcion general del proyecto, los archivos clave y la construccion./Comandos de prueba, pasos de publicacion, sincronizacion de documentos.、Provider Reglas de extension y Git Normas de seguridad。

- [ ] **Pasos 2：Reglas claras para publicar activos.**
Debe estar escrito claramente en el documento. GitHub Los activos publicados deben incluir `main.js`、`manifest.json`、`styles.css` con `README.md`。

- [ ] **Pasos 3：Autoauditoria para evitar duplicaciones**
Confirmar que la guia es suficiente para respaldar la ejecucion del agente sin repetirla sin sentido. `GEMINI.md` Contenido。

### Tareas 2：Maquillate primero Doubao Prueba de verificacion

**Documentacion：**
- crear：`src/tests/providerValidation.test.ts`
- Modificacion：`src/llmProviders.ts`

- [ ] **Pasos 1：Escribe pruebas que fallen**
Agregar prueba y descripcion. Doubao Uso de marcadores de posicion o obviamente no validos endpoint Formula model Deberia aparecer una advertencia cuando se utiliza el valor y no deberia aparecer una advertencia para una configuracion que parece ser valida.。

- [ ] **Pasos 2：No se pudo ejecutar la prueba de orientacion para confirmar**
Ejecucion：`npm test -- --runInBand src/tests/providerValidation.test.ts`
Expectativas：FAIL，Porque validation helper Aun no existe。

- [ ] **Pasos 3：Implementar una verificacion minima helper**
en `src/llmProviders.ts` Agregue una pequena funcion pura en helper，Basado en provider Advertencia de devolucion de configuracion。

- [ ] **Pasos 4：Vuelva a ejecutar la prueba dirigida.**
Ejecucion：`npm test -- --runInBand src/tests/providerValidation.test.ts`
Expectativas：PASS。

### Tareas 3：Mostrar en la pagina de configuracion. Doubao Resultados de la verificacion

**Documentacion：**
- Modificacion：`src/ui/NotemdSettingTab.ts`
- Modificacion：`styles.css`

- [ ] **Pasos 1：Si es necesario, agregue pruebas fallidas orientadas a la interfaz o `helper` Prueba de llamadas**
Si las pruebas de interfaz puras son demasiado pesadas, agregue una mas `helper` Asercion de nivel, junto con una prueba de comportamiento centrada en el control de acceso de la prueba de conexion.。

- [ ] **Pasos 2：Implementar la representacion de advertencias**
Cuando sea actual provider Cuando haya una advertencia de verificacion, muestre un bloque de advertencia visible.。

- [ ] **Pasos 3：Para cosas que obviamente son ineficaces Doubao Configurar la prueba de conexion de bloqueo**
Si actualmente provider Si hay una advertencia, se mostrara `Notice`，Y omitir la solicitud de prueba remota。

- [ ] **Pasos 4：Vuelva a ejecutar las pruebas relacionadas**
Cobertura de carrera provider validation Relacionado con el comportamiento de la pagina de configuracion Jest Pruebas。

### Tareas 4：Maquillate primero Qianfan con SiliconFlow Pruebas

**Documentacion：**
- Modificacion：`src/tests/llmProviders.test.ts`
- Modificacion：`src/tests/llmUtilsProviderSupport.test.ts`

- [ ] **Pasos 1：Pruebas de registro ampliadas**
Se agrego una nueva afirmacion y verificacion de falla. `Baidu Qianfan` con `SiliconFlow` de provider Existencia y metadatos。

- [ ] **Pasos 2：Ampliar el tiempo de ejecucion / API Pruebas**
Agregue una nueva prueba de falla para afirmar estos dos provider Todos se van `openai-compatible` Tiempo de ejecucion y prioridad de uso `chat` de API Deteccion。

- [ ] **Pasos 3：No se pudo ejecutar la prueba de orientacion para confirmar**
Ejecucion：`npm test -- --runInBand src/tests/llmProviders.test.ts src/tests/llmUtilsProviderSupport.test.ts`
Expectativas：FAIL，Hasta provider Definicion completada。

### Tareas 5：Implementacion Provider Registry Con soporte de tiempo de ejecucion

**Documentacion：**
- Modificacion：`src/llmProviders.ts`
- Modificacion：`src/llmUtils.ts`
- Modificacion：`src/ui/NotemdSettingTab.ts`

- [ ] **Pasos 1：nuevo provider Definicion**
nuevo `Baidu Qianfan` con `SiliconFlow`，Completa el oficial. `base URL`、Representatividad `model ID`、Metadatos y priorizacion `chat` de API Modo de prueba。

- [ ] **Pasos 2：Reutilizar `transport-driven` Tiempo de ejecucion**
Asegurate de que dos provider Sigamos como estamos `openai-compatible` Rutas de prueba de conexion y tiempo de ejecucion。

- [ ] **Pasos 3：Si es necesario, actualice la copia de la pagina de configuracion.**
Bloqueo rapido o relacionado en la pagina de configuracion provider La descripcion refleja la ampliacion. provider Cobertura。

- [ ] **Pasos 4：Volver a ejecutar la orientacion provider Pruebas**
Ejecucion：`npm test -- --runInBand src/tests/llmProviders.test.ts src/tests/llmUtilsProviderSupport.test.ts`
Expectativas：PASS。

### Tareas 6：Actualizar documentacion

**Documentacion：**
- Modificacion：`README.md`
- Modificacion：`README_zh.md`

- [ ] **Pasos 1：Actualizacion provider Listado e instrucciones de configuracion.**
Suplementario `Baidu Qianfan` con `SiliconFlow`，Sea claro Doubao endpoint-ID Consejos de configuracion para。

- [ ] **Pasos 2：Actualice la descripcion del proceso de lanzamiento si es necesario**
Asegurese de que la documentacion del repositorio este actualizada con la nueva `AGENTS.md` Mantenga coherentes las reglas de publicacion de activos。

### Tareas 7：Verificacion final

**Documentacion：**
- Verificacion: directorio raiz del almacen y todo el codigo fuente modificado/Pruebas/Archivos de documentacion

- [ ] **Pasos 1：Ejecute la compilacion**
Ejecucion：`npm run build`
Expectativas：PASS。

- [ ] **Pasos 2：Ejecute el conjunto de pruebas completo.**
Ejecucion：`npm test -- --runInBand`
Expectativas：PASS；Si se sabe Jest open-handle warning Todavia existe y solo puede aceptarse si no se deteriora.。

- [ ] **Pasos 3：Inspeccion `git diff` Calidad**
Ejecucion：`git diff --check`
Expectativas：PASS。

- [ ] **Pasos 4：Presentar implementacion**
```bash
git add AGENTS.md docs/superpowers/specs/2026-03-26-agents-and-provider-expansion-design.md docs/superpowers/plans/2026-03-26-agents-and-provider-expansion.en.md docs/superpowers/plans/2026-03-26-agents-and-provider-expansion.zh-CN.md README.md README_zh.md src/llmProviders.ts src/llmUtils.ts src/ui/NotemdSettingTab.ts src/tests/llmProviders.test.ts src/tests/llmUtilsProviderSupport.test.ts src/tests/providerValidation.test.ts styles.css
git commit -m "feat: add agent guide and expand provider presets"
```
