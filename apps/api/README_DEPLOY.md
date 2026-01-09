# Deploy API

## Environment variables (required)
- `PORT`
- `MONGO_USER`
- `MONGO_PASSWORD`
- `MONGO_HOST`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN` (Your web app origin, e.g. https://bhavyanth-diary.vercel.app)

## Notes
- Refresh token is stored in an **httpOnly cookie**.
- If deploying behind a proxy (Render/Fly), ensure HTTPS is used in production so cookies with `Secure` work.
