# 📁 Media Submission and Approval API

A secure backend REST API built with **NestJS**, **TypeScript**, **Prisma ORM**, and **PostgreSQL** for managing media submissions. Authenticated users can upload media files for review, while administrators can approve or reject submissions. Users receive email notifications whenever a decision is made.

---

# 🚀 Features

- User Registration and Login
- JWT Authentication
- Role-Based Authorization (USER / ADMIN)
- Media Upload using Multer
- File Type Validation
- File Size Validation (10 MB)
- PostgreSQL Database
- Prisma ORM
- Admin Dashboard APIs
- Approve / Reject Media Submissions
- Swagger API Documentation
- Unit Tests using Jest
- Environment-based Configuration

---

# 🛠 Technology Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Multer
- Swagger
- Jest

---

# 📂 Project Structure

```
src/
 ├── admin/
 ├── auth/
 ├── common/
 ├── email/
 ├── media/
 ├── prisma/
 ├── app.module.ts
 └── main.ts

prisma/
 ├── migrations/
 ├── schema.prisma
 └── seed.ts

test/
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/Tejasv879/media-submission-api.git
```

Move inside the project

```bash
cd media-submission-api
```

Install dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Copy

```text
.env.example
```

to

```text
.env
```

Configure the following values.

```env
DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=1d

PORT=3000

MAX_FILE_SIZE_BYTES=10485760

EMAIL_ENABLED=false

EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=
```

# 🗄 Database Setup

Create a PostgreSQL database.

Example:

```
media_submission
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate dev --name init
```

Seed the administrator account

```bash
npm run prisma:seed
```

---

# 👤 Seeded Administrator

```
Email:
admin@example.com

Password:
Admin@123
```

These credentials are for local development only.

---

# ▶ Running the Application

Development Mode

```bash
npm run start:dev
```

Production Build

```bash
npm run build
```

Run Production

```bash
npm run start:prod
```

---

# 🧪 Running Tests

Run all tests

```bash
npm test
```

---

# 📖 Swagger Documentation

After starting the application, open:

```
http://localhost:3000/api/docs
```

Swagger allows testing every endpoint directly from the browser.

For protected endpoints:

1. Login
2. Copy the JWT Access Token
3. Click **Authorize**
4. Enter

```
Bearer <your_token>
```

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## User APIs

| Method | Endpoint |
|---------|----------|
| POST | /api/media |
| GET | /api/media/my-submissions |
| GET | /api/media/:id/view |
| GET | /api/media/:id/download |
| GET | /api/media/:id |
| DELETE | /api/media/:id |
---

## Admin APIs

| Method | Endpoint |
|---------|----------|
| GET | /api/admin/media |
| PATCH | /api/admin/media/:id/approve |
| PATCH | /api/admin/media/:id/reject |

---

# 📤 Supported Uploads

Supported Media Types

- PDF
- JPEG
- PNG
- WebP
- MP4
- WebM

Maximum File Size

```
10 MB
```

Uploaded files are stored locally inside the **uploads/** directory.

---

# 👤 Administrator Account

An administrator account is **not created through the registration API**.

To create the administrator, run:

```bash
npm run prisma:seed
```

This command creates a default administrator account with the following credentials:

| Email | Password |
|--------|----------|
| admin@example.com | Admin@123 |

Use these credentials to log in as an administrator and access the admin-only APIs.

> **Note:** These credentials are intended only for local development and assessment purposes. For production deployments, they should be changed immediately after seeding.

---

# 🔒 Security Features

- Password hashing using bcrypt
- JWT Authentication
- Role-based Authorization
- Ownership Validation
- DTO Validation using class-validator
- Protected Routes
- Environment Variables for Secrets

---

# 🧱 Database Models

## User

- ID
- Name
- Email
- Password
- Role
- Created At
- Updated At

---

## Media Submission

- ID
- Title
- Description
- File Name
- File URL
- MIME Type
- File Size
- Status
- Rejection Reason
- User ID
- Created At
- Updated At

Relationship

```
One User
      │
      │
      ▼
Many Media Submissions
```

---

# 📄 Assumptions

- Local file storage is used for simplicity.
- Swagger is used for API testing.
- Email configuration is environment based.
- PostgreSQL is running locally.

---

# ⚠ Limitations

- Local storage instead of cloud storage.
- Email sending is synchronous.
- No refresh tokens.
- No Docker configuration.
- No background job queue.

---

# 🚀 Future Improvements

- Cloudinary or AWS S3 Integration
- Docker Support
- Refresh Tokens
- BullMQ Email Queue
- Rate Limiting
- Media Download Authorization
- CI/CD Pipeline
- Better Logging
- Redis Caching

---

# 📝 Submission Notes

## ✅ Completed

- User Authentication using JWT
- Role-Based Authorization
- User Registration and Login
- Media Upload
- Media Validation
- User Media APIs
- Administrator Approval APIs
- PostgreSQL Integration
- Email notification service implementation (configuration pending)
- Prisma ORM
- Swagger Documentation
- Unit Tests
- README Documentation
- Environment Configuration

## ❌ Not Completed

- Email Notification Service

# 👨‍💻 Author

**Tejasv Agarwal**

GitHub

https://github.com/Tejasv879
