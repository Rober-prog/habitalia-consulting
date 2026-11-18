# Habitalia Consulting

Web corporativa bilingüe en castellano y catalán, construida con Astro,
TypeScript y Tailwind CSS. Seis categorías, doce servicios, contacto directo
y mapa local con enlace a Google Maps. Marca y retrato facilitados por el titular.

## Desarrollo

Node 22.23.4. Instalar con `npm ci`, iniciar con `npm run dev`.
`npm run qa` comprueba tipos, formato, compilación, enlaces, accesibilidad y
responsive. Las pruebas de navegador requieren Chrome y su ruta se configura
 en playwright.config.ts.

## GitHub Pages

[Ver la web](https://rober-prog.github.io/habitalia-consulting/es/).
Publicación manual mediante GitHub Actions, conservando noindex.
Los pushes no activan publicaciones automáticas.
[Configuración y comprobaciones](docs/GITHUB_PAGES.md).

El contacto utiliza correo y teléfono; no hay formulario de envío ni analítica.
Las ilustraciones de servicios son conceptuales y no representan proyectos reales.
