# Ejercicio Técnico Frontend Angular - Banco Productos

Aplicación frontend desarrollada para la prueba técnica **Frontend - Angular (2024)**. Permite listar, buscar, crear, editar y eliminar productos financieros consumiendo los servicios locales provistos por el backend del reto.

## Autoría

Solución desarrollada por **[Nahuel Lemes](https://github.com/nahulemesF)**.

## Tecnologías

- Angular 21
- TypeScript
- RxJS
- SCSS sin frameworks de estilos ni componentes prefabricados
- Formularios reactivos
- Signals de Angular
- Vitest para pruebas unitarias y cobertura

## Funcionalidades implementadas

- **F1 - Listado de productos financieros:** tabla de productos obtenidos desde `/bp/products`.
- **F2 - Búsqueda:** filtro por texto sobre id, nombre y descripción.
- **F3 - Cantidad de registros:** contador de resultados y selector de 5, 10 o 20 registros.
- **F4 - Agregar producto:** formulario de registro con validaciones, reinicio y consumo de creación.
- **F5 - Editar producto:** opción de edición desde menú contextual, navegación al formulario y campo ID deshabilitado.
- **F6 - Eliminar producto:** opción de eliminación desde menú contextual con modal de confirmación.

También se incluye manejo visual de errores, estados de carga con skeletons, diseño responsive y rutas lazy-loaded para las pantallas principales.

## Mejoras de experiencia visual

Además de las funcionalidades solicitadas en el enunciado, se incorporaron mejoras orientadas a una experiencia más cómoda y cuidada:

- **Dark Mode:** selector de tema claro/oscuro con persistencia en `localStorage` y adaptación automática inicial según la preferencia del sistema.
- **Visualización responsive en tarjetas:** en pantallas pequeñas, la tabla se transforma en una lectura tipo tarjeta para mejorar la legibilidad y facilitar la navegación desde dispositivos móviles.
- **Animaciones e interacciones:** transiciones suaves en la entrada de pantallas, botones, menú contextual, skeleton loader y modal de confirmación para que la interfaz se perciba más fluida.
- **Tratamiento visual de logos:** se agregó un fallback cuando la imagen de un producto no puede cargarse, manteniendo la consistencia visual del listado.

## Validaciones del formulario

- **ID:** requerido, mínimo 3 caracteres, máximo 10 y verificación de existencia contra `/bp/products/verification/:id`.
- **Nombre:** requerido, mínimo 5 caracteres y máximo 100.
- **Descripción:** requerida, mínimo 10 caracteres y máximo 200.
- **Logo:** requerido.
- **Fecha de liberación:** requerida y mayor o igual a la fecha actual.
- **Fecha de revisión:** calculada automáticamente como un año posterior a la fecha de liberación.

## Requisitos previos

- Node.js y npm instalados.
- Backend local del reto ejecutándose en `http://localhost:3002`.

El proyecto incluye `proxy.conf.json` para redirigir las llamadas `/bp` al backend local durante `ng serve`.

## Instalación

```bash
npm install
```

## Ejecución del backend local

Desde la carpeta del backend provista para el reto:

```bash
cd repo-interview-main
npm install
npm run start:dev
```

El servicio debe quedar disponible en:

```text
http://localhost:3002
```

## Ejecución del frontend

Desde esta carpeta:

```bash
npm start
```

La aplicación queda disponible en:

```text
http://localhost:4200
```

## Pruebas unitarias y cobertura

```bash
npm test -- --watch=false --coverage
```

Última verificación local:

```text
Test Files: 9 passed
Tests: 62 passed
Statements coverage: 85.88%
Branches coverage: 89.83%
Functions coverage: 71.08%
Lines coverage: 86.20%
```

La cobertura supera el mínimo requerido del 70%.

## Build de producción

```bash
npm run build
```

El artefacto se genera en:

```text
dist/banco-productos
```

## Endpoints consumidos

- `GET /bp/products`
- `GET /bp/products/:id`
- `POST /bp/products`
- `PUT /bp/products/:id`
- `DELETE /bp/products/:id`
- `GET /bp/products/verification/:id`

## Estructura principal

```text
src/app/components
src/app/services
src/app/models
src/app/validators
src/app/utils
src/app/directives
```

La solución está organizada por componentes, servicio de productos, validadores reutilizables, utilidades de fecha y una directiva de fallback para logos.
