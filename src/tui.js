import { Cart } from "./cart.js";
import { parseCommand } from "./parser.js";

/**
 * 
 *
 * @param {{
 *   ask: (message: string) => Promise<string>,
 *   write: (message: string) => void
 * }} io 
 */

export async function runTui( { ask , write } ){

  const cart = new Cart();
  const name = await requestName(ask , write) ;
  
  write(`¡Hola ${name}! ¿Qué deseas modificar en tu carrito?`);
  write('Usa el formato "<id de producto> <cantidad>".' );
  write("Ejemplo: 12345 5 para agregar o 12345 -2 para retirar.");
  write('Escribe "bye" para salir.') ;


  while (true) {
    const input = await ask("> ");
    const command = parseCommand(input);

    if (command.type === "exit"){
      write(`Adiós ${name}, ¡fue un gusto!`) ;
      return;
    }

    if (command.type === "invalid" ){
        if (command.reason === "INVALID_PRODUCT_ID") {write("El ID del producto debe contener únicamente números.");
        } else if (command.reason === "INVALID_QUANTITY") {
        write("La cantidad debe ser un número entero distinto de cero.");} 
        else {write('Entrada inválida. Usa el formato "<id de producto> <cantidad>".'); }
        
        write("¿Qué más deseas hacer?");
        
        continue;
    }

    const result = cart.update(command.productId, command.quantityDelta);

    if (!result.success) {writeBusinessError(result); continue;}

    showCart(cart, write);
  }


  function writeBusinessError(result) {
    if(result.reason === "PRODUCT_NOT_FOUND" ){
      write(`No tienes el producto ${result.productId} agregado a tu carrito.`);
      write("¿Qué más deseas hacer?");
      return;
    }

    if(result.reason === "INSUFFICIENT_QUANTITY" ){
      write(`No puedes retirar ${result.requested} unidades del producto ` + `${result.productId}; solamente tienes ${result.available}.` );
      write("¿Qué más deseas hacer?");
      return;
    }

    if( result.reason === "QUANTITY_OVERFLOW" ){write("La cantidad solicitada supera el límite permitido.");}
    write("¿Qué más deseas hacer?");
  }
}

async function requestName(ask, write) {
  while (true) {
    const name = (await ask("Por favor ingrese su nombre.\n> ")).trim();

    if( name !== "" ){return name;}

    write("El nombre no puede estar vacío.");
  }
}

function showCart(cart, write) {
  if (cart.isEmpty()) {
    write("Tu carrito está vacío, ¿qué más deseas hacer?");
    return;
  }

  write("Tu carrito es:");

  for (const item of cart.getItems()) { write(`  - ${item.productId} con ${item.quantity} unidades`);}

  write("¿Qué más deseas hacer?");
}