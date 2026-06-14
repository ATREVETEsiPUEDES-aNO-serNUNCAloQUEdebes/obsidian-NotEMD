# Regreso a la linea de base

Este directorio almacena evidencia reproducible antes y despues de cambios de alto riesgo.。

## Flujo de trabajo estandar

1. Recopilar la linea de base：
```bash
npm run regression:language-baseline
```

2. Implementar cambios。

3. Comparacion con la ultima linea de base：
```bash
npm run regression:language-compare
```

4. Si compare Fallo, la regresion debe corregirse antes de permitir la fusion.。

## Acuerdo

- Utilice directorios con nombres de fechas：`YYYY-MM-DD-<topic>`。
- Cuando sea necesario, conserve tanto la salida del comando como los codigos de salida.。
- No sobrescriba los registros historicos de referencia; agregar nuevos archivos o crear nuevos directorios de fechas。
