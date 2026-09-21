export const money = (value) => `C$ ${Number(value).toLocaleString("es-NI")}`;

export const orderStatus = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
