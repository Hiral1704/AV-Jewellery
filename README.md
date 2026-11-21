# A.V. Jewellery — Full-stack e-commerce starter

Responsive React storefront + Express/MongoDB API + EJS admin panel.

## Included
- Customer signup/login, profile edit, forgot/reset password token flow
- JWT authentication; customer/admin roles
- Product API, product search/filter/sort, wishlist and local cart
- Checkout with Cash on Delivery; orders saved in MongoDB
- Customer-only order history
- Stock validation and decrement on order placement
- Admin EJS dashboard with product add/edit/delete and image uploads, order status updates, customer list
- Responsive customer UI

## Requirements
Node.js 18+ and MongoDB (local MongoDB or Atlas).

## 1. Backend
```powershell
cd backend
npm install
copy .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, SESSION_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD
npm run dev
```
Backend: `http://localhost:5000`

Create/update the admin account in another terminal after `.env` is configured:
```powershell
cd backend
node scripts-create-admin.js
```
Admin dashboard: `http://localhost:5000/admin/login`

Optional demo products (only inserts if products collection is empty):
```powershell
node seed-products.js
```

## 2. Frontend
```powershell
cd frontend
npm install
npm run dev
```
Frontend: Vite will show the local URL, normally `http://localhost:5173`.

Optional `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Password reset note
This starter generates a development reset token in the API response. For production, configure an email provider and send a one-time link; do not expose the token in API responses.

## Security before deployment
- Replace all secrets and default admin credentials.
- Set `NODE_ENV=production` and HTTPS.
- Configure email-based password reset.
- Add payment gateway integration if online payments are required.
- Review rate limiting, validation, logging, and file upload policy.
- Configure MongoDB Atlas network access and least-privilege credentials.

## Main API routes
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET/PUT /api/auth/me` (Bearer token)
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/products`
- `GET /api/products/:id`
- `POST/PUT/DELETE /api/products` (admin Bearer token)
- `POST /api/orders` (customer token; COD)
- `GET /api/orders/mine` (customer token)
- `GET /api/orders` and `PATCH /api/orders/:id/status` (admin token)

The EJS admin dashboard uses a server session at `/admin/login` and manages products/orders via its forms.
