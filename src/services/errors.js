// Maps the status codes the API returns to copy the user can act on. Without
// this every failure landed under the same generic title, and a 503 (the API is
// up but the database is not) was shown as "Sin conexión", which is false.

const BY_STATUS = {
  0: {
    title: "Sin conexión con el servidor",
    message: "No pudimos contactar la API. Verifica que esté encendida y que EXPO_PUBLIC_API_URL apunte a tu PC."
  },
  401: {
    title: "Sesión expirada",
    message: "Vuelve a iniciar sesión para continuar."
  },
  409: {
    title: "No se pudo completar"
  },
  413: {
    title: "El pedido es demasiado grande",
    message: "Reduce la cantidad de productos e inténtalo de nuevo."
  },
  429: {
    title: "Demasiados intentos",
    message: "Espera unos minutos e inténtalo de nuevo."
  },
  503: {
    title: "Servicio no disponible",
    message: "La base de datos no está respondiendo en este momento. Inténtalo más tarde."
  }
};

export function describeError(error, fallbackTitle = "Algo salió mal") {
  const status = error?.status ?? 0;
  const known = BY_STATUS[status];

  if (known) {
    // 409 keeps the server message, which names the product without stock.
    return { status, title: known.title, message: known.message ?? error?.message };
  }

  return { status, title: fallbackTitle, message: error?.message || "Inténtalo de nuevo." };
}
