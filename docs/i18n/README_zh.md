# Notemd Centro de Idiomas

Esta pagina explica de manera uniforme el idioma y la aplicacion del documento actual. UI El verdadero estado del soporte linguistico。

## Mantener la documentacion fuente.

- English: [README.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README.md)
- Chino simplificado: [README_zh.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_zh.md)

## Publicado README Traduccion

- Chino tradicional: [README_zh_Hant.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_zh_Hant.md)
- Español: [README_es.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_es.md)
- Français: [README_fr.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_fr.md)
- Deutsch: [README_de.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_de.md)
- Italiano: [README_it.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_it.md)
- Português: [README_pt.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_pt.md)
- japones: [README_ja.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_ja.md)
- 한국어: [README_ko.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_ko.md)
- Русский: [README_ru.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_ru.md)
- العربية: [README_ar.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_ar.md)
- हिन्दी: [README_hi.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_hi.md)
- বাংলা: [README_bn.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_bn.md)
- Nederlands: [README_nl.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_nl.md)
- Svenska: [README_sv.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_sv.md)
- Suomi: [README_fi.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_fi.md)
- Dansk: [README_da.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_da.md)
- Norsk: [README_no.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_no.md)
- Polski: [README_pl.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_pl.md)
- Türkçe: [README_tr.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_tr.md)
- עברית: [README_he.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_he.md)
- ไทย: [README_th.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_th.md)
- Ελληνικά: [README_el.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_el.md)
- Čeština: [README_cs.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_cs.md)
- Magyar: [README_hu.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_hu.md)
- Română: [README_ro.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_ro.md)
- Українська: [README_uk.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_uk.md)
- Tiếng Việt: [README_vi.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_vi.md)
- Bahasa Indonesia: [README_id.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_id.md)
- Bahasa Melayu: [README_ms.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README_ms.md)

## En la aplicacion UI Locale Cobertura

- `auto` Los patrones seguiran Obsidian Idioma actual de la interfaz。
- Soporte en la aplicacion UI locale Por [src/i18n/uiLocales.ts](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/src/i18n/uiLocales.ts) Definicion explicita：`en`、`ar`、`de`、`es`、`fa`、`fr`、`id`、`it`、`ja`、`ko`、`nl`、`pl`、`pt`、`pt-BR`、`ru`、`th`、`tr`、`uk`、`vi`、`zh-CN`、`zh-TW`。
- English fallback Sigue siendo una red de seguridad para la capa de implementacion, pero cuenta con soporte. locale La interfaz visible ha sido cubierta por pruebas de regresion y ya no deberia volver al ingles silenciosamente durante el uso normal.。
- La implementacion actual esta alineada Notebook Navigator El nucleo de i18n Principio de diseno: explicito supported-language map、`auto` Alineacion del patron Obsidian locale，y con English Como final fallback merge Metas。

| Codigo | Nombre para mostrar |
|---|---|
| `en` | English |
| `ar` | العربية |
| `de` | Deutsch |
| `es` | Español |
| `fa` | فارسی |
| `fr` | Français |
| `id` | Bahasa Indonesia |
| `it` | Italiano |
| `ja` | japones |
| `ko` | 한국어 |
| `nl` | Nederlands |
| `pl` | Polski |
| `pt` | Português |
| `pt-BR` | Português (Brasil) |
| `ru` | Русский |
| `th` | ไทย |
| `tr` | Türkçe |
| `uk` | Українська |
| `vi` | Tiếng Việt |
| `zh-CN` | Chino simplificado |
| `zh-TW` | Chino tradicional |

## Estrategia de estado de traduccion

- Documento fuente autorizado: en el almacen. English + Documentacion de mantenimiento en chino simplificado。
- Publicado README La traduccion debe cubrir el documento fuente lo mas completamente posible, pero si hay una desviacion a corto plazo, el documento fuente aun se mantendra.。
- Solo si alguien UI locale Solo cuando ya existe en el codigo y pasa la prueba de cobertura de la interfaz visible, el documento debe declarar que es "compatible"”。
- fallback El mecanismo se utiliza para brindar resiliencia y no debe usarse para reemplazar traducciones visibles faltantes.。

## Contribuir con la traduccion humana.

1. Agregue o actualice archivos de idioma en el directorio raiz del almacen, por ejemplo：`README_es.md`。
2. El orden de los capitulos debe ser lo mas coherente posible. [README.md](https://github.com/Jacobinwwey/obsidian-NotEMD/blob/main/README.md) Sea consistente。
3. nuevo README Traduccion o UI locale Actualice este centro de idiomas simultaneamente。
4. Enviar PR，Invita al menos a un hablante nativo a revisar si las condiciones lo permiten.。
