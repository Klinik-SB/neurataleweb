# Fuente de Neuratale

`Manrope.ttf` es la fuente variable original. Su licencia SIL Open Font License
se conserva en `OFL.txt`. El sitio publica únicamente `Manrope-latin.woff2`.

El subset mantiene los caracteres latinos y los símbolos disponibles de uso
tipográfico y matemático; conserva los pesos variables. Se generó con
fontTools 4.60.1 y Brotli 1.2.1 (43.140 bytes):

```text
python -m fontTools.subset src/assets/fonts/Manrope.ttf --output-file=src/assets/fonts/Manrope-latin.woff2 --flavor=woff2 --unicodes=U+0000-024F,U+0370-03FF,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2100-22FF,U+FEFF,U+FFFD --layout-features="*" --name-IDs="*" --name-legacy --name-languages="*" --notdef-glyph --notdef-outline --recommended-glyphs
```

WOFF2 se versiona para que la compilación estática no dependa de Python.
