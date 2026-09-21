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
La conexión está centralizada en `src/services/api.js`. La URL se toma de `EXPO_PUBLIC_API_URL` y, si no está definida, el app elige un valor por plataforma:

| Cliente | URL |
|---|---|
| Emulador Android | `http://10.0.2.2:3000/api` (por defecto) |
| Navegador web en la misma PC | `http://localhost:3000/api` (por defecto en web) |
| Teléfono físico por USB | `adb reverse tcp:3000 tcp:3000` y `EXPO_PUBLIC_API_URL=http://localhost:3000/api` |
| Teléfono físico por Wi-Fi | requiere publicar el puerto en Windows (ver abajo) |

Para forzar una URL, copiá `.env.example` a `.env` y descomentá la variable:

```bash
cp .env.example .env
```

### Teléfono físico por Wi-Fi
Con WSL en modo de red espejado, la API solo queda publicada en el loopback de Windows (`localhost`), **no en la IP de LAN**. Para que el teléfono la alcance hay que publicar el puerto con permisos de administrador:

```powershell
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=127.0.0.1
netsh advfirewall firewall add rule name="elshampan-api" dir=in action=allow protocol=TCP localport=3000
```

### Si el navegador muestra un error de CORS
Un mensaje como `Solicitud de origen cruzado bloqueada ... Código de estado: (null)` (Firefox) o `Failed to fetch` (Chrome) significa que **la petición no recibió respuesta**, no que falte un header CORS. Revisá en este orden:

1. Que la API esté encendida: `curl http://localhost:3000/api/health` desde Windows debe responder `{"status":"ok","db":"up"}`.
2. Que la URL configurada sea alcanzable desde ese cliente (ver tabla de arriba).

### Cuenta demo
- Correo: `demo@elshampan.com`
- Contraseña: `Demo1234`

El checkout funciona como invitado; al iniciar sesión, el pedido queda asociado a la cuenta y aparece en "Mis pedidos".

## Recomendación de integración
No dupliquen lógica de API dentro de las pantallas. Mantengan:

screens -> context/hooks -> services/api.js -> backend

Para producción, el backend debe encargarse de autenticación, autorización, stock, validación de edad y reglas legales antes de confirmar una venta.
