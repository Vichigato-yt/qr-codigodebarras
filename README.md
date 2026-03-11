# QR Codigo de Barras + Stripe

Aplicacion Expo Router que permite escanear codigos QR/de barras y completar pagos con Stripe PaymentSheet.

El flujo principal es:

1. Escanear un codigo de producto.
2. Mostrar resumen de compra.
3. Abrir PaymentSheet de Stripe y confirmar el pago.

## Stack

- Expo 54 + React Native 0.81
- Expo Router (rutas por archivo)
- expo-camera (escaneo)
- @stripe/stripe-react-native (PaymentSheet)
- Backend Node.js simple (`backend.js`) para crear `PaymentIntent`, `Customer` y `Ephemeral Key`

## Estructura del proyecto

```text
app/
	_layout.tsx          # Proveedor Stripe y stack principal
	index.tsx            # Pantalla inicial
	scanner.tsx          # Pantalla de escaneo
	payment.tsx          # Pantalla de checkout
src/
	components/
		scanner/
			CameraScanner.tsx
		payment/
			PaymentButton.tsx
			PaymentStatusCard.tsx
			StripeCheckoutSheet.tsx
	hooks/
		useStripePayment.ts
	services/
		stripe.ts          # Cliente al backend /checkout
backend.js             # Backend demo para Stripe
```

## Requisitos

- Node.js 20+
- npm
- Cuenta Stripe en modo test
- Claves Stripe de prueba:
	- `STRIPE_SECRET_KEY`
	- `STRIPE_PUBLISHABLE_KEY`

## Variables de entorno

Crea un archivo `.env` en la raiz:

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Opcional para el frontend:
# EXPO_PUBLIC_STRIPE_BACKEND=http://localhost:3000
```

Notas:

- Si no defines `EXPO_PUBLIC_STRIPE_BACKEND`, la app usa defaults por plataforma.
- Android emulador usa `http://10.0.2.2:3000` automaticamente.
- En dispositivo fisico debes usar IP local o URL publica accesible.

## Instalacion

```bash
npm install
```

## Ejecutar backend (Stripe)

En una terminal:

```bash
node --env-file=.env backend.js
```

Debe quedar escuchando en `http://localhost:3000` con endpoint `POST /checkout`.

## Ejecutar app

En otra terminal:

```bash
npm start
```

Scripts utiles:

- `npm run start:dev-client` inicia con Dev Client (recomendado para Stripe nativo).
- `npm run android` abre Android.
- `npm run ios` abre iOS.
- `npm run web` abre web.
- `npm run lint` corre lint del proyecto.

## Flujo de prueba rapido

1. Abre la pantalla principal y entra al escaner.
2. Escanea alguno de estos codigos de ejemplo:
	 - `SKU-9920`
	 - `SKU-1101`
	 - `SKU-2007`
3. En checkout, toca "Pagar".
4. En modo test de Stripe usa:
	 - Tarjeta: `4242 4242 4242 4242`
	 - Fecha futura, CVC cualquiera, ZIP cualquiera.

## Compatibilidad Expo Go

Esta app incluye protecciones para que no crashee en Expo Go cuando Stripe nativo no esta disponible.

Sin embargo, PaymentSheet nativo no funciona completamente en Expo Go. Para flujo real de pago usa Dev Client.

## Troubleshooting

### Error: Network request failed

- Verifica que `backend.js` siga corriendo.
- Revisa que la URL del backend sea accesible desde el dispositivo.
- En Android emulador, usa `10.0.2.2` en lugar de `localhost`.

### Error 401 con `www-authenticate: tunnel`

El tunel/forward de Codespaces requiere autenticacion. Publica el puerto o usa una URL publica sin login.

### Stripe no disponible

Si aparece mensaje de "Stripe no esta disponible en Expo Go", ejecuta con Dev Client:

```bash
npm run start:dev-client
```

## Seguridad

- No subas claves reales a repositorio.
- Usa siempre claves test para desarrollo.
- Para produccion, mueve secretos a infraestructura segura y backend real con autenticacion.
