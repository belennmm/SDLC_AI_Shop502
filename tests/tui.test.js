import { describe, expect, it } from "vitest";
import { runTui } from "../src/tui.js";

function createFakeIo(inputs) {
  const answers = [...inputs];
  const output = [];

  return {
    output,
    ask: async () => answers.shift(),
    write: (message) => output.push(message)
  };
}

describe("runTui", () => {
  it("runs the main cart flow and then exits", async () => {
    const io = createFakeIo([
      "Rodrigo" ,
      "12345 5",
      "12345 -5" ,
      "12345 -5",
      "456 29",
      "bye"
    ]) ;

    await runTui(io);

    expect(io.output).toEqual([
      "¡Hola Rodrigo! ¿Qué deseas modificar en tu carrito?" ,
      'Usa el formato "<id de producto> <cantidad>".' ,
      "Ejemplo: 12345 5 para agregar o 12345 -2 para retirar." ,
      'Escribe "bye" para salir.' ,
      "Tu carrito es:" ,
      "  - 12345 con 5 unidades" ,
      "¿Qué más deseas hacer?" ,
      "Tu carrito está vacío, ¿qué más deseas hacer?",
      "No tienes el producto 12345 agregado a tu carrito.",
      "¿Qué más deseas hacer?",
      "Tu carrito es:" ,
      "  - 456 con 29 unidades",
      "¿Qué más deseas hacer?" ,
      "Adiós Rodrigo, ¡fue un gusto!"
    ]);
  });

  it("asks for the name again when it is empty", async () => {
    const io = createFakeIo(["   ", "Linda", "bye"]);

    await runTui(io);
    expect(io.output).toEqual([
      "El nombre no puede estar vacío.",
      "¡Hola Linda! ¿Qué deseas modificar en tu carrito?",
      'Usa el formato "<id de producto> <cantidad>".' ,
      "Ejemplo: 12345 5 para agregar o 12345 -2 para retirar.",
      'Escribe "bye" para salir.',
      "Adiós Linda, ¡fue un gusto!"
    ]);
  });

  it("recovers from invalid input and continues", async () => {
    
    const io = createFakeIo(["Linda", "12345 five", "12345 2", "bye"]);
    await runTui(io);
    expect(io.output).toContain("La cantidad debe ser un número entero distinto de cero.");
    expect(io.output).toContain("¿Qué más deseas hacer?");
    
    expect(io.output).toContain("  - 12345 con 2 unidades" ) ;
    expect(io.output.at(-1)).toBe("Adiós Linda, ¡fue un gusto!" ) ;
  });

  it("reports insufficient quantity without changing the cart", async () => {
    const io = createFakeIo(["Linda", "12345 5", "12345 -6", "bye"]);

    await runTui(io);
    expect(io.output).toContain("No puedes retirar 6 unidades del producto 12345; solamente tienes 5.");
  });

  it("reports an invalid product ID and continues", async () =>{
  const io = createFakeIo(["Linda" , "abc 5" , "bye" ]);

  await runTui(io);

  expect(io.output).toContain(
    "El ID del producto debe contener únicamente números."
  );
  expect(io.output).toContain("¿Qué más deseas hacer?");
  expect(io.output.at(-1)).toBe("Adiós Linda, ¡fue un gusto!");
});

it("reports an invalid command format and continues", async () => {
  const io = createFakeIo(["Linda", "12345", "bye"]);

  await runTui(io);

  expect(io.output).toContain('Entrada inválida. Usa el formato "<id de producto> <cantidad>".');
  expect(io.output).toContain("¿Qué más deseas hacer?");

  expect(io.output.at(-1)).toBe("Adiós Linda, ¡fue un gusto!");
});



it("reports a quantity overflow", async () => {
  const maximumQuantity = Number.MAX_SAFE_INTEGER;
  const io = createFakeIo([
    "Linda",
    `12345 ${maximumQuantity}`,
    "12345 1" , "bye"
  ]);

  await runTui(io);

  expect(io.output).toContain("La cantidad solicitada supera el límite permitido.");
  expect(io.output).toContain("¿Qué más deseas hacer?");
  
  expect(io.output.at(-1)).toBe("Adiós Linda, ¡fue un gusto!");
});
});