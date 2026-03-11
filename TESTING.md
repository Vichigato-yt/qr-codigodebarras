# Testing Stripe Integration

## Prerequisites
- `.env` file with `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` set

## Testing Steps

### 1. Start the Stripe Demo Backend
Run in a **separate terminal**:
```bash
node --env-file=.env backend.js
```

You should see:
```
[Backend] Starting backend with STRIPE_SECRET_KEY=sk_test_...
[Backend] STRIPE_PUBLISHABLE_KEY=pk_test_...
Stripe Demo Backend running on http://localhost:3000
Checkout endpoint: POST http://localhost:3000/checkout
```

### 2. Start the Expo App

In another terminal:
```bash
npm start
```

Then choose your platform:
- **Android Emulator**: Press `a` (automatically uses `http://10.0.2.2:3000`)
- **iOS Simulator**: Press `i` (automatically uses `http://localhost:3000`)
- **Web**: Press `w` (uses `http://localhost:3000`)
- **Expo Go (physical device)**: Scan QR code, BUT you need to set:
  ```
  EXPO_PUBLIC_STRIPE_BACKEND=http://<YOUR_MACHINE_IP>:3000
  ```
  Then restart the app.

### 3. Test Payment

1. Navigate to **Scanner** screen (QR code icon)
2. Scan a test QR code or manually enter a price (e.g., "1290" for $12.90)
3. Tap **Pay** button
4. Stripe payment sheet should appear

**Expected Console Logs:**

**Frontend (Expo console):**
```
[Stripe] Platform: android|ios|web
[Stripe] Backend URL: http://...
[Stripe] Fetching checkout params from: http://.../checkout
[Stripe] Response status: 200
[Stripe] Got payment params successfully
```

**Backend console:**
```
[Backend] POST /checkout - amount=1290, currency=usd
[Backend] Creating customer...
[Backend] Customer created: cus_...
[Backend] Creating ephemeral key...
[Backend] Ephemeral key created
[Backend] Creating payment intent...
[Backend] Payment intent created: pi_...
```

## Troubleshooting

### "Network request failed"
- ✅ Is backend running at the correct address?
- ✅ Check console logs for actual URL being used
- ✅ If on physical device, set `EXPO_PUBLIC_STRIPE_BACKEND` to your machine's IP

### "Stripe no está disponible en Expo Go"
- This is expected in Expo Go (web environment)
- Use a **Development Build** for native Stripe:
  ```bash
  npm run start:dev-client
  ```

### Backend returns 401 (tunnel auth)
- Codespaces tunnel requires authentication
- Make port 3000 **Public** in Codespaces ports panel
- Or set `EXPO_PUBLIC_STRIPE_BACKEND` to a public forwarded URL

### Invalid Stripe API response
- Check that `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` are set correctly in `.env`
- Keys must start with `sk_test_` and `pk_test_` respectively
