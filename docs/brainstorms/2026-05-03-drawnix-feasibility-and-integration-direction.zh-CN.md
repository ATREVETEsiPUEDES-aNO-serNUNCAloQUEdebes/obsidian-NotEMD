---
date: 2026-05-03
topic: drawnix-feasibility-integration-direction
---

# Drawnix Auditoria de viabilidad y direccion de integracion.

## Alcance de la auditoria

- Proyectos upstream：`plait-board/drawnix`
- Verificacion de lineas de base：`develop@e28ba80`
- Objetivo: Juicio Drawnix si Notemd Valor reutilizable, distinga “limites de capacidad que vale la pena absorber” de “colision Obsidian Complejidad del alojamiento en el limite del complemento”

## Instantanea del almacen

Drawnix No es un peso ligero renderer，Pero una pila completa de aplicaciones de pizarra：

- Nx monorepo
- React 19 + Vite
- `packages/drawnix`、`packages/react-board`、`packages/react-text`
- Plait Cubo familiar：`@plait/core`、`@plait/draw`、`@plait/layouts`、`@plait/mind`、`@plait/text-plugins`
- Slate Pila de texto enriquecido
- `browser-fs-access`、`localforage`、`mobile-detect`

En terminos de posicionamiento, se acerca mas a una “pizarra a nivel de producto en el navegador” SaaS”，No “puede insertarse directamente en Obsidian Propietario del complemento bundle Una pequena biblioteca de funciones.”。

## Fortalezas identificadas

### 1. Borrar los limites de los datos

`packages/drawnix/src/data/types.ts` Formato de exportacion estable definido：

- `type: 'drawnix'`
- `version`
- `source: 'web'`
- `elements: PlaitElement[]`
- `viewport`
- `theme`

Esto muestra Drawnix El valor de**Modelo de datos de pizarra**，en lugar de un cierto UI Componentes。

`packages/drawnix/src/data/json.ts` tambien refuerza este punto：JSON Path es una importacion de primera clase/Exporte limites en lugar del formato de depuracion que viene con el.。

`apps/web/src/app/app.tsx` Tambien demuestra que pasa `localforage` Persistir en el estado de la mesa de trabajo principal, que explica con mas detalle Drawnix Confie en la capa de persistencia nativa del navegador de forma predeterminada en lugar de Obsidian Limites de almacenamiento de complementos。

### 2. Las capacidades de transformacion son modulos independientes con carga diferida.

`markdown-to-drawnix.tsx` con `mermaid-to-drawnix.tsx` Todos se importan dinamicamente en tiempo de ejecucion.：

- `@plait-board/markdown-to-drawnix`
- `@plait-board/mermaid-to-drawnix`

Esto muestra que ellos mismos consideran las "capacidades de conversion" como modulos pesados en lugar de la ruta principal residente predeterminada. eso es correcto Notemd Muy importante: si queremos aprender de ello en el futuro, tambien debemos seguir la idea de "aislamiento y carga bajo demanda".。

Al mismo tiempo, estas ventanas emergentes de conversion eventualmente volveran a insertar los resultados. Drawnix Interactivo propio board，En otras palabras, todavia ofrecen un limite de producto de pizarra de navegador de forma predeterminada, en lugar de un backend liviano en un complemento externo. adapter。

### 3. Vale la pena aprender de la idea en capas

Drawnix de app shell、board、text renderer、Las ventanas emergentes de conversion estan explicitamente en capas. si Notemd De lo que podemos aprender es：

- UI Separacion de la logica de conversion y alojamiento.
- Separacion de formatos de datos y hosts interactivos.
- Las capacidades de repeticion se introducen bajo demanda

## con Notemd Dislocacion estructural de

### 1. Se supone que el host es una aplicacion de navegador, no Obsidian Complementos

Drawnix Una gran cantidad de dependencias directas en el codigo.：

- `window`
- `document`
- `localStorage`
- `browser-fs-access`
- `MobileDetect`

Pruebas concretas：

- `packages/drawnix/src/drawnix.tsx` Construye directamente el completo. React board shell，y uso `window.navigator.userAgent` Realizar deteccion de terminales
- `packages/drawnix/src/data/filesystem.ts` Dependencia directa `browser-fs-access`
- `packages/drawnix/src/data/json.ts` Seleccion de archivos a traves del navegador/Guardar procesamiento de proceso `.drawnix` Abrir y exportar

Esto significa que se ejecuta en un host de navegador completo de forma predeterminada, con un selector de sistema de archivos.、DOM Superposiciones, almacenamiento en el navegador y sistemas de menus interactivos.。Notemd El limite controlable actual es：

- Obsidian Hilo principal enchufable
- limitado iframe / srcdoc Representar anfitrion
- La compatibilidad con dispositivos moviles y de escritorio debe considerarse simultaneamente

poner Drawnix Cuando todo el anfitrion se muda, el control actualmente controlable preview/render boundary Escale rapidamente a un conjunto completo de problemas de alojamiento de aplicaciones front-end。

### 2. Drawnix El objetivo del producto no es Notemd Necesidades actuales

Drawnix En esencia, es la edicion de pizarra interactiva.：

- Edicion de mapas mentales
- Edicion de diagramas de flujo
- dibujo gratis
- Apertura de archivos / Guardar
- Exportacion de imagenes
- Barra de herramientas, capa flotante, menu contextual

Notemd La linea principal actual es：

- Genere diagramas estructurados a partir de la semantica de notas.
- Guardar como Obsidian Productos amigables
- Vista previa dentro del complemento / Exportar

Es decir，Notemd Lo que falta no es un “editor de pizarra completo” sino un “editor mas estable spec-first Generacion, limites de tiempo de ejecucion, puertas de verificacion sostenibles”。

### 3. La reutilizacion directa de convertidores no puede resolver el problema arquitectonico central

`mermaid-to-drawnix` con `markdown-to-drawnix` Es realmente valioso, pero si Notemd Ir directamente：

`DiagramSpec -> Mermaid/Markdown cuerda -> Drawnix converter -> PlaitElement[]`

Surgiran dos problemas：

1. Toma lo establecido `DiagramSpec` La capa semantica se vuelve a degradar al estado intermedio de cadena.
2. Vuelva a vincular la correccion de la conversion a Mermaid/Markdown Calidad del texto, no spec Calidad

Esto debilitara Notemd El paso mas importante en la hoja de ruta existente：**Cede el paso primero LLM Produce semantica estructurada y hazlo de nuevo. target-specific adapter。**

### 4. La robustez depende no solo de schema，Tambien depende de la geometria y la propiedad del diseno.

`.drawnix` El contenedor en si es transparente. JSON，Pero la verdadera compatibilidad tambien depende de quien es el responsable：

- Plait element Seleccion
- point Generar vs. board geometry
- viewport Valor predeterminado
- theme Traduccion

En otras palabras, "puede escribir JSON”No significa "puede exportar de forma estable una pizarra utilizable". si Notemd Si realmente quieres hacer esta linea, debes hacerlo tu mismo adapter Adquisicion clara semantic-to-board projection；La reutilizacion de formatos de archivo sin logica de proyeccion dara como resultado resultados fragiles y dificiles de depurar.。

## Matriz de viabilidad

| Direccion | Viabilidad | Riesgos | Conclusion |
|---|---|---|---|
| Integracion holistica Drawnix Anfitrion/UI | bajo | Muy alto | No recomendado |
| Solo pon Drawnix Uselo como nuevo host de vista previa | bajo | Muy alto | No recomendado |
| Aprende de ello app/board/text Pensamiento en capas | alto | bajo | Absorcion recomendada |
| Aprende de `.drawnix` Formatos de datos como futuros objetivos de exportacion | Medio | Medio | Puede utilizarse como candidato de seguimiento. |
| Experimenta en un camino aislado `mermaid-to-drawnix` / `markdown-to-drawnix` | Medio-bajo | Medio a alto | Solo prototipos experimentales. |
| Basado en `DiagramSpec -> PlaitElement[]` Autoconstruccion adapter | Medio | Medio | Si en el futuro board export，Esta es una direccion mas razonable. |
| Salida directa `DiagramSpec -> DrawnixExportedData` | Medio | Medio | Mejor que la integracion del host, pero aun asi debes ser responsable de ti mismo geometry/layout Toma de decisiones |

## si Notemd Conclusiones sugeridas

### Cosas que no hacer

1. No pongas Drawnix Host completo, barra de herramientas, interaccion del sistema de archivos, pizarra UI Mudate Notemd。
2. No cambie la version actual para "admitir mas tipos de graficos" renderer boundary Conviertase en otra capa de alojamiento de aplicaciones front-end。
3. No dejes `DiagramSpec` Espalda degenerada Mermaid/Markdown Como principal estado intermedio。

### Algo que vale la pena hacer

1. poner Drawnix como**Proyectos de referencia externa**，No depende directamente de las colecciones de paquetes.。
2. Si necesita una "exportacion de pizarra editable continuamente" en el futuro, de prioridad a：
   `DiagramSpec -> DrawnixExportedData(.drawnix)`
3. Si quieres experimentar en el futuro Drawnix converter，Solo se puede colocar en：
   - aislado experimental path
   - Carga bajo demanda
   - No ingresar a la cadena principal predeterminada

### Control del alcance del proximo lote de trabajo.

Esta auditoria ahora debe verse como un limite de alcance estricto, no solo como una investigacion de antecedentes.：

- Es evidente que el lote actual de hojas de ruta no esta completo. Drawnix Incrustacion de host
- Deja claro que no utilizar Drawnix Reemplazo Notemd Host de vista previa actual”
- Deja claro que no debes hacer nada Drawnix de board-editing UI Integrar en complementos
- El experimento mas fuerte que pueda aceptarse en un futuro proximo solo puede realizarse bajo el mando./Una vez estabilizado el tiempo de ejecucion, aislelo export o adapter Poner a prueba los limites en lugar de seguir adelante

## Relacion con la prioridad principal actual

Drawnix El analisis no anula la hoja de ruta existente, sino que refuerza la priorizacion actual：

1. Ordena a la superficie que se cierre
2. Sostenible live verification runbook
3. Aislamiento del embalaje durante la repeticion.
4. MermaidProcessor dividir
5. Considere un nuevo objetivo de exportacion o board-style artifact

En otras palabras，Drawnix No es candidato para “Proximo paso para conectarse de inmediato”, pero**Demostrar que la hoja de ruta actual va en la direccion correcta: absorber los limites de los datos y los limites de la transformacion en lugar de replicar toda la complejidad del host。**
