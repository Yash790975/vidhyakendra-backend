# Euryfox API

A clean Node.js + Express + Mongoose project structure with:

- controllers
- enums
- exceptions
- middlewares
- models
- routes
- services
- utils
- validations

## Quick Start

```bash
npm i
cp .env.example .env
# edit .env with your Mongo URI (defaults to euryfoxdb on localhost)
npm run dev
# server at http://localhost:4000
```

### Health
GET http://localhost:4000/health

### Categories
- POST   /api/v1/categories
- GET    /api/v1/categories
- GET    /api/v1/categories/:id
- PATCH  /api/v1/categories/:id
- DELETE /api/v1/categories/:id

### Products
- POST   /api/v1/products
- GET    /api/v1/products?category=healthy-snacks&search=mix&page=1&limit=20
- GET    /api/v1/products/:id
- PATCH  /api/v1/products/:id
- DELETE /api/v1/products/:id

Products reference categories via `categoryId: ObjectId` (foreign-key style).
```json
{
  "name": "Organic Mixed Nuts",
  "price": "₹1,899",
  "unit": "per kg",
  "categoryId": "68a440ffd439c69167eec4a9"
}
```
