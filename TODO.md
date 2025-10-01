# TODO - Fix App Functionality

## Current Status
- [x] Fixed backend/server.js: Implemented /create_preference endpoint with MercadoPago integration and demo mode.
- [x] Fixed src/hooks/useReviews.js: Changed collection from 'reseñas' to 'reviews' for fetching and adding.
- [x] Added loading state to Cart button in src/pages/Cart.jsx.
- [x] Normalized product fields in src/hooks/useLazyProducts.js for local JSON fallback.
- [x] Updated CORS in backend to include localhost:3001.

## Pending Steps
1. **Run Backend Server**: Execute `npm run backend` to start on port 3001 and verify health check at http://localhost:3001/health.
2. **Run Frontend**: Execute `npm run dev` to start on port 5173 if not running.
3. **Test Product Loading**: Launch browser to http://localhost:5173/shop, verify 270 products load without review errors.
4. **Test Cart Flow**: Add product to cart, navigate to /cart, click "Proceder al Pago", verify loading state and redirect (demo mode if no token).
5. **Test Payment Success**: Mock success redirect, verify cart clears, order saves to Firestore 'orders' collection.
6. **Test Reviews**: Navigate to a ProductDetail page, add a review, verify it saves to 'reviews' collection and displays.
7. **Test Full Navigation**: Test login, favorites, orders history, search, empty cart, error scenarios (no user, network fail).
8. **Verify Database**: Check Firestore for products, orders, reviews; ensure local JSON fallback works if Firestore down.
9. **Edge Cases**: Test rate limiting, invalid inputs, backend down (simulate by stopping server).
10. **Performance/UX**: Check loading times, responsive design, toasts, service worker registration.

## Next Action
Proceed with step 1: Start backend server.

Progress: 40% complete (core fixes done, testing pending).
