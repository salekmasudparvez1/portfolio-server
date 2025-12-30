# Rental Management Backend

A TypeScript/Node.js backend for a rental management platform with roles (`admin`, `landlord`, `tenant`), property listings, tenant applications, and authentication.

## Stack
- Node.js + TypeScript
- Express
- Mongoose (with `useDb` per database)
- Cloudinary (image uploads)
- Bun/Nodemon for dev

## Getting Started
1. Install dependencies
	- Using Bun: `bun install`
	- Or npm: `npm install`
2. Create `.env`
	- `DATABASE_URL` (Mongo connection string)
	- `DATABASE_NAME` (matches `config.database_name`)
	- `BCRYPT_SALT_ROUNDS`
	- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
	- `JWT_SECRET`, `JWT_EXPIRES_IN`
3. Run dev server
	- `bun run dev` (or `npm run dev`)

## Scripts
- `dev`: Start development server with ts-node/nodemon
- `build`: Compile TypeScript
- `start`: Run compiled JS

## Project Structure
```
src/
  app.ts, server.ts
  app/
	 config/ (cloudinary)
	 middlewares/ (auth guards, error handlers)
	 modules/
		Auth/ (login/signup, user model)
		landloard/ (properties CRUD, requests)
		tenent/ (applications)
	 utils/ (async handler, multer, email, response)
uploads/ (local temp files)
```

## Key Models
- `users` (Signup): username, email, phoneNumber, password, role, photoURL
- `rentalHouses` (RentalHouseModel): location, description, rentAmount, images, landloardId
- `tenantRequests` (TenantApplicationModel): tenantId, rentalHouseId, landloardId, status

Note: Models are registered via `mongoose.connection.useDb(DATABASE_NAME)` to isolate connections. When populating, pass actual Model instances to ensure correct connection resolution.

## API Overview

Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

Landlord
- `POST /api/landloard/properties` (multipart with images)
- `GET /api/landloard/properties`
- `PATCH /api/landloard/properties/:id`
- `DELETE /api/landloard/properties/:id`
- `GET /api/landloard/requests` (tenant applications; populates `tenantId` and `rentalHouseId`)
- `PATCH /api/landloard/requests/:id` (status: `pending|approve|reject`)

Tenant
- `POST /api/tenent/requests` (apply to a rental house)

## Images
- Images are uploaded to Cloudinary via `sendImageToCloudinary()`.
- New images on update are appended and capped (latest up to 4).

## Error Handling
- Centralized via `globalErrorhandler.ts` with custom `AppError` and zod/mongoose error mappers.

## Development Notes
- Ensure models are imported early (e.g., in `app.ts/server.ts`) so schemas are registered before routes execute.
- For `populate`, prefer using Model instances (e.g., `Signup`, `RentalHouseModel`) rather than strings when using multiple connections.

## Deployment
- Vercel config present in `vercel.json` for serverless deployment.

## License
- Proprietary project. Do not redistribute.