# Shop 502 SDLC + AI

## Integrantes: 
- Belén Monterroso 
- Adrián López


## Tecnologías utilizadas

- JavaScript
- Node.js
- Vitest
- GitHub Actions
- GitHub Flow

## Requisitos

Se necesita de:

- Node.js 24 o una versión compatible.
- npm.
- Git.

Para verificar las versiones instaladas:
```bash
node --version
npm --version
git --version
```

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/belennmm/SDLC_AI_Shop502.git
```

Entrar en la carpeta del proyecto:

```bash
cd SDLC_AI_Shop502
```

Instalar las dependencias:

```bash
npm ci
```

O se puede utilizar:

```bash
npm install
```

## Ejecución

Para iniciar la aplicación:

```bash
npm start
```

Al iniciar, la aplicación solicitará el nombre:

```text
Por favor ingrese su nombre.
> Linda
```

Después mostrará las instrucciones de uso:
```text
¡Hola Linda! ¿Qué deseas modificar en tu carrito?
Usa el formato "<id de producto> <cantidad>".
Ejemplo: 12345 5 para agregar o 12345 -2 para retirar.
Escribe "bye" para salir.
```

## Formato de los comandos

Las operaciones utilizan el siguiente formato:
```text
<id de producto> <cantidad>
```

La cantidad positiva agrega unidades:
```text
12345 5
```
La cantidad negativa quita unidades:
```text
12345 -2
```

Para finalizar la sesión:

```text
bye
```

## Ejemplo de uso

```text
Por favor ingrese su nombre.
> Linda

¡Hola Linda! ¿Qué deseas modificar en tu carrito?
Usa el formato "<id de producto> <cantidad>".
Ejemplo: 12345 5 para agregar o 12345 -2 para retirar.
Escribe "bye" para salir.

> 12345 5

Tu carrito es:
  - 12345 con 5 unidades

¿Qué más deseas hacer?
> 12345 -2

Tu carrito es:
  - 12345 con 3 unidades

¿Qué más deseas hacer?
> bye

Adiós Linda, ¡fue un gusto!
```


## Scripts disponibles

Ejecutar la aplicación:

```bash
npm start
```

Ejecutar todos los tests:

```bash
npm test
```

Ejecutar los tests en modo de observación:

```bash
npm run test:watch
```

Ejecutar los tests con reporte de cobertura:

```bash
npm run coverage
```



## Integración 

La pipeline de CI se ejecuta automáticamente al crear o actualizar una Pull Request hacia la rama `main`.

La pipeline:

1. Descarga el repositorio.
2. Configura Node.js.
3. Instala las dependencias con `npm ci`.
4. Ejecuta los tests.
5. Verifica que la cobertura mínima sea del 80%.


## Especificación funcional

La especificación, las reglas del carrito y los criterios de aceptación se encuentran en:

```text
docs/specification.md
```

## Licencia

Este proyect está bajo la licencia MIT. 


