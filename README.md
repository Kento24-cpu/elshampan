# El Shampán Frontend

Frontend Android para tienda de licores sellados.

## Stack
- Expo SDK 55
- React Native 0.83
- JavaScript
- NativeWind
- React Navigation
- Expo Linear Gradient

## Funciones incluidas
- Inicio
- Búsqueda
- Categorías
- Catálogo
- Detalle de producto
- Favoritos
- Carrito
- Control de cantidades
- Checkout
- Historial de pedidos
- Perfil con inicio de sesión
- Estados visuales vacíos y de error
- Catálogo, categorías y pedidos conectados a la API
- Diseño responsive basado en componentes reutilizables

## Ejecutar
```bash
npm install
npx expo start
```

La API debe estar encendida (`elshampan-api`, `npm run dev`) y accesible desde el teléfono o el emulador.

## Backend
La conexión está centralizada en `src/services/api.js` y la URL se configura por variable de entorno:

| Escenario | Valor de `EXPO_PUBLIC_API_URL` |
|---|---|
| Emulador Android | `http://10.0.2.2:3000/api` |
| Dispositivo físico en la misma red | `http://IP-DE-TU-PC:3000/api` (por ejemplo `http://192.168.1.38:3000/api`) |

Copiá `.env.example` a `.env` y ajustá la IP:

```bash
cp .env.example .env
```

### Cuenta demo
- Correo: `demo@elshampan.com`
- Contraseña: `Demo1234`

El checkout funciona como invitado; al iniciar sesión, el pedido queda asociado a la cuenta y aparece en "Mis pedidos".

## Recomendación de integración
No dupliquen lógica de API dentro de las pantallas. Mantengan:

screens -> context/hooks -> services/api.js -> backend

Para producción, el backend debe encargarse de autenticación, autorización, stock, validación de edad y reglas legales antes de confirmar una venta.
