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
- Perfil
- Estados visuales vacíos
- Capa API preparada para backend
- Diseño responsive basado en componentes reutilizables

## Ejecutar
npm install
npx expo start

## Backend
La conexión está centralizada en:
src/services/api.js

Cambia:
API_URL = "http://TU-IP:3000/api"

Cuando se conozca el contrato real del backend, se ajustan únicamente las funciones de authApi, productApi y orderApi y los modelos de respuesta.

## Recomendación de integración
No dupliquen lógica de API dentro de las pantallas. Mantengan:
screens -> context/hooks -> services/api.js -> backend

Para producción, el backend debe encargarse de autenticación, autorización, stock, validación de edad y reglas legales antes de confirmar una venta.
