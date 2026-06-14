# Division del capitulo + TOC Extraccion

![Division del capitulo + TOC Representaciones](./assets/chapter-split-toc-showcase.svg)

Cuando una nota es demasiado larga para mantenerla en un solo archivo, esta funcion generara un archivo de capitulo junto al archivo original.、TOC Y una racion manifest。

Divide el contenido segun la estructura del titulo, conserva la relacion de vinculo entre capitulos y tambien deja un limite para la ejecucion repetida. No es necesario copiar manualmente los titulos ni mantener los archivos de la tabla de contenidos usted mismo.。

## Estructura de salida

Despues de la ejecucion, se generara el siguiente conjunto de archivos.：

```text
Docs/Platform.md
└─ Docs/Platform_chapters/
   ├─ Platform_TOC.md
   ├─ 01-overview.md
   ├─ 02-delivery.md
   └─ .notemd-chapter-split.json
```

## TOC Fragmento de muestra

```md
---
notemdGenerated: true
notemdArtifactKind: "chapter-split-toc"
sourcePath: "Docs/Platform.md"
requestedSplitHeadingLevel: "auto"
resolvedSplitHeadingLevel: 2
chapterCount: 2
---

# Platform TOC

- [[Docs/Platform_chapters/01-overview|01. Overview]]
- [[Docs/Platform_chapters/01-overview#^notemd-scope|Scope]]
- [[Docs/Platform_chapters/02-delivery|02. Delivery]]
```

Aqui hay varios puntos clave en la implementacion.：

- TOC traer front matter，Capacidad para identificar claramente los archivos fuente, los niveles divididos y el numero de capitulos.。
- Los enlaces de subtitulos se escribiran de forma estable. block ref，Por ejemplo `#^notemd-scope`，Comodidad en TOC Enlace profundo directo en。
- El producto generado quedara registrado `.notemd-chapter-split.json`，Los archivos antiguos se pueden identificar y limpiar cuando se ejecutan nuevamente.。

## ¿Cuando es adecuado su uso?

- Las notas de investigacion ya son muy largas y la busqueda dentro de un solo archivo comienza a ralentizarse.。
- El plan del proyecto debe conservar una descripcion general y dividir cada capitulo en documentos independientes.。
- Necesitas una cita TOC，En lugar de separarlo temporalmente una vez y luego tirarlo.。

## Limites de comportamiento

- Los niveles divididos son opcionales `Auto`，Tambien puedes especificar con fuerza `H1` llegar `H6`。
- Si especifica con fuerza un determinado nivel, pero no existe dicho nivel en el documento fuente, la tarea informara directamente un error y no lo adivinara automaticamente.。
- Los productos antiguos se limpiaran cuando se vuelvan a ejecutar; Si un archivo generado se ha modificado manualmente, el sistema no lo sobrescribira directamente.。

## Entrada y escenarios.

- Orden / sidebar Entrada：`Division del capitulo`
- Generar valor verdadero：`<basename>_chapters`、`<basename>_TOC.md`、`.notemd-chapter-split.json`
- Configuracion de elementos：`Division del capitulo -> Dividir la jerarquia de titulos`
