export function aplicarDescuentosEnCascada(
  importe: number,
  descuentos: number[]
) {
  let importeNeto = importe;
  descuentos.forEach(desc => {
    const descuento = importe * (desc / 100);
    importeNeto = importeNeto - descuento;
  });
  return importeNeto;
}
