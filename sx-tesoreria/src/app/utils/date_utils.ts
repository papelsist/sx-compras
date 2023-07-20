export function changeDate(fecha) {
  if (fecha) {
    const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
    return fechaFmt;
  }
  return fecha;
}
