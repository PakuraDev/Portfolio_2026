# Instrucciones de Traducción del Portfolio a Inglés

Hola DeepSeek Flash. Tu tarea es traducir completamente este portfolio del español al inglés, creando una copia exacta de la estructura de archivos en la carpeta `/home/pakura/Escritorio/Portfolio/codigo/en/`.

## Reglas Generales de Traducción
1. **Mantener la Estructura Intacta:** No alteres la estructura HTML, las clases CSS, los IDs, ni la lógica de JavaScript. Solo debes traducir el texto visible para el usuario (contenido de etiquetas HTML, atributos `alt` de imágenes, atributos `title`, `placeholder` en formularios y cadenas de texto en JS/JSON que se renderizan).
2. **Ubicación de Destino:** Todos los archivos traducidos deben guardarse en la carpeta `/home/pakura/Escritorio/Portfolio/codigo/en/`, manteniendo la misma jerarquía de directorios original (es decir, crear las subcarpetas necesarias como `casos_de_estudio`, `html_parciales`, `webcomponents`, etc., dentro de `en/`).
3. **Calidad de Traducción:** El tono debe ser profesional, propio de un diseñador de producto/desarrollador de alto nivel. Evita traducciones literales que suenen antinaturales en inglés.
4. **Rutas de Archivos/Assets:** Mantén las rutas a imágenes (`assets/`), hojas de estilo (`css/`) y scripts (`js/`) de forma que sigan funcionando. Si un archivo HTML que originalmente estaba en `/codigo/` ahora está en `/codigo/en/`, asegúrate de ajustar las rutas relativas si es necesario (añadiendo `../`), o simplemente conservarlas si el entorno ya está preparado para ello. El usuario usará Cloudflare Bulk Redirection, pero intenta que sea consistente.
5. **No Inventar Contenido:** Traduce estrictamente lo que existe. No añadas secciones nuevas ni elimines existentes.
6. **Archivos JSON:** En `casos_de_estudio/proyectos.json`, traduce solo los valores de las propiedades que sean texto descriptivo (títulos, descripciones, roles, etc.), pero NO traduzcas las claves del JSON (keys) ni los identificadores.

## Archivos y Carpetas a Procesar

Asegúrate de revisar y traducir el contenido de las siguientes ubicaciones dentro de `/home/pakura/Escritorio/Portfolio/codigo/`:

### 1. Raíz (`/`)
* `index.html`
* `curriculum.html`
* `contacto.html`
* `caso_estudio.html`
* `caso_estudio_test.html`

### 2. Parciales HTML (`/html_parciales/`)
* `proyectos.html`
* `resumen.html`
* `sobre_mi.html`

### 3. Casos de Estudio (`/casos_de_estudio/`)
* `proyectos.json` (Traducir solo valores, mantener las llaves del JSON intactas).
* Todos los archivos HTML dentro de esta carpeta (ej: `aerko_codigo.html`, `konta_diseno.html`, etc.).

### 4. Web Components y Scripts (`/webcomponents/` y `/js/`)
Revisa los archivos JavaScript en estas carpetas (como `header.js`, `footer.js` y los scripts en `js/`). Traduce **únicamente** las cadenas de texto (strings) que se inyectan en el DOM o se muestran al usuario (por ejemplo, textos de menú, alertas, mensajes de error). No traduzcas nombres de variables o funciones.

## Consideraciones Finales (Pezetoide's Rules)
* **Código Perfecto:** El código resultante no debe tener errores de sintaxis, etiquetas mal cerradas o problemas de indentación. 
* **Rendimiento:** No añadas librerías externas ni código extra para manejar la traducción. Solo haz una traducción directa de hard-coded strings.

¡Buena suerte con la traducción!
