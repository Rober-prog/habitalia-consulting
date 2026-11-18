# Vista de Habitalia en GitHub Pages

Vista publicada: https://rober-prog.github.io/habitalia-consulting/
Repositorio: https://github.com/Rober-prog/habitalia-consulting

El titular autoriza expresamente subir el proyecto y crear esta vista el
18/11/2026. No se modifica el dominio corporativo ni DNS. La vista conserva
noindex y el formulario se sustituye por contacto mediante correo y teléfono.

## Resultado comprobado

Primer despliegue completado con éxito mediante el workflow
https://github.com/Rober-prog/habitalia-consulting/actions/runs/44415184521
(revisión bf37b39294533615d45d1066059d497b76a39729).
Tipos: 32 archivos sin errores, avisos ni hints. Formato correcto.
Build y validación estática: 28 páginas, 14 fallbacks y 808 referencias locales.
68 auditorías axe sin infracciones. Chrome verifica la vista local y publicada
en es/ca a 390/768/1440 px, las imágenes, el contacto y los 14 enlaces antiguos.
El logotipo conserva su archivo original y sus proporciones.

## Desarrollo local

Node 22.23.4. Ejecutar `npm ci`, `npm run dev`.
Comprobaciones: `npm run qa`. Las pruebas de navegador usan Chrome instalado
en Windows según playwright.config.ts.

## Publicación manual

El workflow `.github/workflows/pages.yml` solo se ejecuta manualmente;
un push posterior no publica automáticamente. Compila con
`SITE_URL=https://rober-prog.github.io` y `BASE_PATH=/habitalia-consulting/`,
comprueba tipos, formato, rutas y recursos y publica `dist/` con las acciones
oficiales de GitHub Pages. Se requiere habilitar Pages con fuente GitHub Actions.

Las URLs, imágenes, selector, 404, metadatos y enlaces internos respetan la
subcarpeta. GitHub Pages no aplica los archivos `_headers` o `_redirects` de
Cloudflare: las rutas antiguas utilizan fallbacks HTML, sin afirmar que Pages
emita un HTTP 301. Se conservan los seis destinos equivalentes y los otros ocho
enlaces antiguos conducen temporalmente al catálogo, sin exponer fichas
preliminares ni añadir servicios al catálogo de seis categorías y doce servicios.

Los avisos de trabajo y validación se han retirado de la interfaz por petición
del titular. Los datos fiscales completos y la política para un eventual
formulario siguen pendientes en la documentación interna; no se inventan ni
se presenta el texto informativo publicado como una revisión legal completa.

Los documentos de arranque y aprobaciones, informes locales y la fotografía
original sin editar permanecen fuera del repositorio público mediante
`.gitignore`. El logotipo actual y el retrato aprobados sí se conservan.

Fuentes de configuración:
- https://docs.astro.build/en/guides/deploy/github/
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Para revertir la vista, volver a una revisión anterior y ejecutar manualmente
el workflow. No cambiar DNS.
