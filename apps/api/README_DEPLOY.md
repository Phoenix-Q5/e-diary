# Deploy API

## Environment variables (required)
- `PORT`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN` (your web app origin, e.g. https://your-app.vercel.app)

## Notes
- Refresh token is stored in an **httpOnly cookie**.
- If deploying behind a proxy (Render/Fly), ensure HTTPS is used in production so cookies with `Secure` work.
