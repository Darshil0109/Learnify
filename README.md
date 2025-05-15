
# Learnify Documentation
## Project Overview

Learnify is a full-stack web application deployed on Vercel. The project is to be a learning management system with features including Google Authentication and Email Verification with Cloud Video and Image Storage.

Live Demo : [Learnify](#https://darshilpatel.me)

## 📚 Table of Contents

- Project Structure
- Technology Stack
- Features
- Installation
- Configuration
- Deployment

### Project Structure

```cmd
Learnify/
├── Backend/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   └── userController.js
│   ├── emails/
│   │   ├── passwordReset.html
│   │   └── verificationMail.html
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── node_modules
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── sendOTPMail.js
│   │   └── sendVerificationMail.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── vercel.json
├── Frontend/
│   ├── node_modules
│   ├── public/
│   │   └── ...images
│   ├── src/
│   │   ├── assets
│   │   ├── axios
│   │   ├── components/
│   │   │   ├── custom/
│   │   │   │   ├── AuthenticatedNavbar.tsx
│   │   │   │   └── ContinueWithGoogle.tsx
│   │   │   ├── layout/
│   │   │   │   ├── AuthenticatedFormLayout.tsx
│   │   │   │   └── ProtectedPageLayout.tsx
│   │   │   ├── pages/
│   │   │   │   ├── Authentication/
│   │   │   │   │   └── ...Files
│   │   │   │   ├── Courses/
│   │   │   │   │   └── ...Files
│   │   │   │   ├── Dashboard/
│   │   │   │   │   └── ...Files
│   │   │   │   ├── Landing/
│   │   │   │   │   └── ...Files
│   │   │   │   ├── Pricing/
│   │   │   │   │   └── ...Files
│   │   │   │   └── Profile/
│   │   │   │       └── ...Files
│   │   │   └── ui/
│   │   │       └── ...Files
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── html2pdf.d.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── VerifyEmail.tsx
│   │   └── vite-env.d.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── components.json
│   ├── esline.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   └── vite.config.ts  
├── sql-queries
└── .gitignore
```



## Tech Stack

**Client:** React, Typescript , TailwindCSS , Shadcn , Axios

**Server:** Node, Express , PostgreSQL , SendGrid , Cloudinary




## Features

- Google Authentication
- Email Verification
- User Profile 
- Add Course 
- Track Course Progress
- Videos and User Profile Stored on Cloud
- Certificate Generation after course gets completed.
- Secure Authentication using reset and accesstoken.
- Users can even Change their password using OTP and Verify Email using Verification Link.




## Installation

Install my-project with npm

```bash
# Clone the repository
git clone https://github.com/Darshil0109/Learnify.git
cd Learnify

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```


- Note : create database in pgAdmin4 named Learnify and run the sql file provided in sql-queries folder to create  all necessory tables 
## Configuration

The project uses environment variables for configuration. Create `.env` files based on the provided `.env.example`:

### Backend Configuration

Create a `.env` file in the backend directory with the following variables (adjust as needed):

```bash
DB_USER = YOUR_DB_USER
DB_HOST =  YOUR_DB_HOST
DB_NAME =   YOUR_DB_NAME
DB_PASSWORD = YOUR_DB_PASSWORD

DB_PORT =   YOUR_DB_PORT
SENDGRID_API_KEY= YOUR_SENDGRID_API_KEY
SENDGRID_VERIFIED_SENDER= YOUR_SENDGRID_VERIFIED_SENDER

GOOGLE_MAIL_APP_PASSWORD = YOUR_GOOGLE_MAIL_APP_PASSWORD
GOOGLE_MAIL_APP_EMAIL = YOUR_GOOGLE_MAIL_APP_EMAIL

JWT_SECRET = YourSecretKeyForJWT
JWT_SECRET_ACCESS_TOKEN = YourSecretKeyForAccessToken
JWT_SECRET_REFRESH_TOKEN = YourSecretKeyForRefreshToken

# DOMAIN = YOUR_DOMAIN  // if you have custom domain

CLIENT_URL = URL_TO_YOUR_FRONTEND

PORT = YOUR_BACKEND_PORT

SESSION_SECRET = YourSecretKeyForSession

GOOGLE_CLIENT_ID =  YOUR_GOOGLE_CLIENT_ID (from Google Cloud Console)
GOOGLE_CLIENT_SECRET = YOUR_GOOGLE_CLIENT_SECRET (from Google Cloud Console)

NODE_ENV = DEVELOPMENT 

CLOUDINARY_CLOUD_NAME = YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY =   YourCloudinaryAPIKey
CLOUDINARY_API_SECRET = YourCloudinaryAPISecret
```

### Frontend Configuration

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL = Your_Backend_URL
```
## Deployment


The application is deployed on Vercel at [htttps://darshilpatel.me](https://darshilpatel.me).
