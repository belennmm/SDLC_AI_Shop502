# Especificación funcional — Shop 502 Cart TUI

## 1. Propósito

Shop 502 Cart TUI es una prueba de concepto de una interfaz de texto para que
un usuario anónimo administre un carrito durante una sesión local. El sistema
permite agregar, incrementar, reducir y eliminar productos mediante comandos
escritos en la terminal.

## 2. Alcance

La aplicación debe:

1. Solicitar el nombre del usuario al iniciar.
2. Mostrar un saludo personalizado.
3. Mantener un carrito independiente en memoria durante la sesión.
4. Procesar operaciones con el formato `<id-producto> <cantidad>`.
5. Mostrar el estado del carrito después de cada operación válida.
6. Informar los errores de entrada o de negocio sin cerrar la aplicación.
7. Finalizar la sesión cuando el usuario escriba `bye`.

La POC no incluye autenticación, persistencia, catálogo, precios, inventario,
pagos ni comunicación con servicios externos.

## 3. Reglas de entrada

### 3.1 Nombre

- El nombre se normaliza eliminando espacios al inicio y al final.
- Un nombre vacío no es válido y se vuelve a solicitar.
- El nombre solamente se utiliza durante la sesión y no se almacena.

### 3.2 Operaciones

- Una operación contiene exactamente dos valores separados por espacios.
- El ID de producto contiene únicamente dígitos y se conserva como texto.
- La cantidad debe ser un entero seguro de JavaScript distinto de cero.
- Una cantidad positiva agrega un producto o incrementa sus unidades.
- Una cantidad negativa reduce las unidades de un producto existente.
- Se permiten espacios adicionales al inicio, al final y entre valores.
- El comando `bye`, ignorando mayúsculas y espacios exteriores, finaliza la
  sesión.

Ejemplos válidos:

```text
12345 5
12345 -2
  00042   10
bye
```

Ejemplos inválidos:

```text
12345
12345 0
12345 2.5
abc 5
12345 cinco
12345 5 extra
```

## 4. Reglas del carrito

1. Agregar una cantidad positiva a un producto inexistente crea el producto.
2. Agregar una cantidad positiva a un producto existente incrementa su total.
3. Una reducción que deja una cantidad mayor que cero actualiza el producto.
4. Una reducción que deja la cantidad exactamente en cero elimina el producto.
5. No se puede reducir un producto que no existe.
6. No se puede reducir una cantidad mayor que las unidades disponibles.
7. Una operación rechazada no modifica el carrito.
8. Los productos se muestran en su orden de inserción.
9. Volver a agregar un producto eliminado lo coloca al final del carrito.

## 5. Mensajes y presentación

Los mensajes base son:

```text
Por favor ingrese su nombre.
Hola <nombre>! ¿Qué deseas modificar en tu carrito?
Tu carrito es:
  - <id> con <cantidad> unidades
Tu carrito está vacío, ¿qué más deseas hacer?
¿Qué más deseas hacer?
Oops, parece que no tienes el producto <id> agregado a tu carrito. ¿Qué más deseas hacer?
No puedes retirar <cantidad> unidades del producto <id>; solamente tienes <disponibles>.
Entrada inválida. Usa el formato "<id de producto> <cantidad>".
Adiós, ¡fue un gusto atenderte!
```

Cuando existe más de un producto, se imprime una línea por producto. La salida
puede usar `|` y `>` como decoración visual, pero los tests no dependerán de
esa decoración.

## 6. Criterios de aceptación

### CA-01 — Agregar un producto

```gherkin
Dado un carrito vacío
Cuando el usuario agrega 5 unidades del producto "12345"
Entonces el carrito contiene "12345" con 5 unidades
```

### CA-02 — Incrementar un producto

```gherkin
Dado que el producto "12345" tiene 5 unidades
Cuando el usuario agrega 3 unidades de "12345"
Entonces el producto "12345" tiene 8 unidades
```

### CA-03 — Reducir un producto

```gherkin
Dado que el producto "12345" tiene 5 unidades
Cuando el usuario agrega -2 unidades de "12345"
Entonces el producto "12345" tiene 3 unidades
```

### CA-04 — Eliminar al llegar a cero

```gherkin
Dado que el producto "12345" tiene 5 unidades
Cuando el usuario agrega -5 unidades de "12345"
Entonces el producto "12345" ya no aparece en el carrito
Y el carrito está vacío
```

### CA-05 — Reducir un producto inexistente

```gherkin
Dado un carrito vacío
Cuando el usuario agrega -5 unidades del producto "12345"
Entonces se informa que el producto no está agregado
Y el carrito permanece vacío
Y la aplicación continúa aceptando comandos
```

### CA-06 — Impedir un saldo negativo

```gherkin
Dado que el producto "12345" tiene 5 unidades
Cuando el usuario agrega -6 unidades de "12345"
Entonces se informa que no hay suficientes unidades
Y el producto "12345" conserva sus 5 unidades
```

### CA-07 — Recuperarse de una entrada inválida

```gherkin
Dado que la aplicación está esperando una operación
Cuando el usuario escribe "12345 cinco"
Entonces se muestra el formato esperado
Y el carrito no cambia
Y la aplicación continúa aceptando comandos
```

### CA-08 — Finalizar la sesión

```gherkin
Dado que la aplicación está esperando una operación
Cuando el usuario escribe "bye"
Entonces se muestra una despedida
Y la aplicación finaliza correctamente
```

## 7. Requisitos de calidad

- Al menos 80% de cobertura de líneas, funciones, sentencias y ramas.
- Pruebas unitarias para todas las reglas del carrito y del parser.
- Pruebas de integración para el flujo conversacional principal.
- CI ejecutada en cada pull request hacia `main`.
- CD ejecutada después de integrar cambios en `main` y publicación del binario
  como GitHub Actions artifact.
- Ningún cambio directo a `main`; todos los cambios pasan por pull request.
- Validación de toda entrada antes de modificar el carrito.
- Ningún secreto, token o dato personal almacenado en el repositorio.

## 8. Supuestos y aclaraciones

- El mock original ingresa el producto `12345` y luego muestra `1234`. Se
  considera un error tipográfico: la aplicación conservará y mostrará `12345`.
- Los 4000 usuarios diarios representan ejecuciones independientes de la TUI;
  no comparten estado.
- No se establece un límite de productos o unidades en la POC, aparte del rango
  de enteros seguros de JavaScript.
- Los textos pueden ajustarse durante la revisión de UX, pero el comportamiento
  descrito por los criterios de aceptación debe conservarse.
