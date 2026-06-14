# AGENTS con Provider Diseno ampliado

**fecha：** 2026-03-26

## Alcance

Este diseno cubre Notemd Tres cambios interrelacionados en 22.：

1. Sin reescribir `GEMINI.md` Bajo la premisa de agregar nivel de proyecto `AGENTS.md`，como Codex/agent Autoridad de ejecucion del flujo de trabajo.。
2. para `Doubao` Se agrego un mensaje de validacion de front-end de forma predeterminada cuando los campos del modelo todavia parecen no estar configurados. Ark endpoint Proporcionar comentarios claros al usuario a la hora de valorar。
3. Ampliar centralizado LLM provider registry，nuevo `Baidu Qianfan` con `SiliconFlow`，Y completo runtime Apoyo、API Pruebas de conexion, documentacion y pruebas de regresion.。

La razon por la que se combinan estos tres elementos es porque todos estan mejorando. agent/operator Fiabilidad: uno actua sobre la capa de flujo de trabajo del almacen y el otro actua sobre provider UX Capa, un elemento actua sobre provider Cobertura。

## Arquitectura

provider La arquitectura debe seguir utilizandose `src/llmProviders.ts` como provider Fuente unica de verdad para los metadatos. Nuevo provider Debe aparecer como registry Definir y seguir `src/llmUtils.ts` Medio transport-driven de dispatch Los caminos fluyen en lugar de aumentar provider-name Sucursal。

provider La verificacion debe implementarse como una pequena funcion pura. helper，a UI Devoluciones del consumidor warning。La pagina de configuracion puede mostrar estos warning，y en provider Bloqueo cuando la configuracion aparentemente esta incompleta connection test。Esto permite que la logica de verificacion siga siendo comprobable y reutilizable, en lugar de quedar enterrada en fragiles UI Tribunal Especial。

nuevo `AGENTS.md` Debe expresarse claramente como documento local en el almacen. Notemd de build、verification、documentation、release y asset-upload Flujo de trabajo. debe estar escrito explicitamente：GitHub release excepto `main.js`、`manifest.json`、`styles.css` Ademas, tambien debes subir `README.md`。

## Componentes

### 1. Guia de almacen

- Crear en el directorio raiz del almacen. `AGENTS.md`。
- mantener `GEMINI.md` Sin cambios。
- El contenido debe cubrir la descripcion general del proyecto y los documentos clave.、build/test Orden、release workflow、Reglas de sincronizacion de documentos.、provider Reglas de extension y Git Normas de seguridad。

### 2. Provider Verificacion

- en provider registry Agregue una pequena suma de verificacion cerca helper。
- Pruebas `Doubao` Si se deben seguir utilizando marcadores de posicion endpoint model，¿O el valor de configuracion no parece valido? Ark endpoint ID。
- Mostrar en la pagina de configuracion antes de que el usuario ejecute una tarea o prueba de conexion. warning。

### 3. Provider Extension

- voluntad `Baidu Qianfan` con `SiliconFlow` Agregar a registry Medio。
- Mantenlos como estan `openai-compatible` transport。
- Configuracion API-test Metadatos, asegurando connection test Esta dirigido a lo realmente configurado por el usuario. model。
- Actualizaciones sincronicas `README.md` con `README_zh.md`。

## Manejo de errores

La ruta de prueba de conexion debe continuar usando la ruta actual. runtime/API Comportamiento de manejo de errores. nuevo provider-validation La capa solo maneja la configuracion local obviamente incompleta y genera informacion orientada al usuario. warning；No debe intentar adivinar ni reescribir automaticamente. provider model。

Para `Doubao`，UX El objetivo debe ser solicitar al usuario que configure una opcion valida. Ark endpoint，Conserva ambos provider Deje espacio para futuros cambios en el metodo de denominacion.。Warning Mas segura que la normalizacion destructiva。

## Estrategia de prueba

- para provider validation warning Prueba unitaria agregada。
- Extension provider registry Probar, afirmar `Baidu Qianfan` con `SiliconFlow` Existencia。
- Extension provider runtime/API Prueba, afirma ambos openai-compatible runtime，Y uso chat-first API probing。
- Vuelva a ejecutarlo por completo una vez completada la implementacion. build con Jest equipo。

## Revisar las instrucciones

Esta vez no hay nada especial spec-review Subagente porque ningun usuario de la sesion actual esta autorizado explicitamente para la delegacion de subagente. Este diseno se ha basado en el almacen actual. provider Arquitectura y release workflow Realizar una autoauditoria。
