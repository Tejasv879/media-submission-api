# Media Submission and Approval API

A NestJS backend where users upload media for review and administrators approve or reject it. The application emails the user after a decision.

## Stack

NestJS, TypeScript, PostgreSQL, Prisma, JWT, Multer local uploads, Nodemailer, Jest, and Swagger.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a long `JWT_SECRET`.
2. Create a PostgreSQL database named `media_submission` (or change the URL).
3. Install packages: `npm install`
4. Generate Prisma Client: `npx prisma generate`
5. Create the database tables: `npx prisma migrate dev --name init`
6. Seed the administrator: `npm run prisma:seed`
7. Start the API: `npm run start:dev`

The seeded admin is `admin@example.com` with password `Admin@123`. Change this for any real deployment.

## Environment variables

See `.env.example`. Set `EMAIL_ENABLED=false` to run locally without an SMTP provider. With it set to `true`, fill in the SMTP details (Mailtrap is a good testing option). Email errors are logged and do not undo a decision.

## API documentation

Once running, open `http://localhost:3000/api/docs`. All routes use the `/api` prefix. Log in first, copy `accessToken`, then use Swagger's **Authorize** button with `Bearer <token>`.

## Main endpoints

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/media` | Logged-in user; multipart fields `title`, `description`, `file` |
| GET | `/api/media/my-submissions?status=PENDING` | Owner |
| GET / DELETE | `/api/media/:id` | Owner (admin may read) |
| GET | `/api/admin/media?status=PENDING&page=1&limit=10` | Admin |
| PATCH | `/api/admin/media/:id/approve` | Admin |
| PATCH | `/api/admin/media/:id/reject` | Admin; JSON `{ "reason": "..." }` |

Allowed uploads are PDF, JPEG, PNG, WebP, MP4, and WebM up to 10 MB. Files go to `uploads/`, which is deliberately ignored by Git. New submissions begin as `PENDING`; only PENDING submissions can be deleted, approved, or rejected.

## Tests

Run `npm test`. The included tests cover successful approval, prevention of double approval, and ownership protection.

## Assumptions and improvements

Local disk storage is used for assessment simplicity; production should use object storage (such as S3) and signed download URLs. The app keeps emails synchronous to make the flow easy to follow; production could queue them. Add rate limiting, refresh tokens, richer image/video inspection, and Docker if more time is available.
