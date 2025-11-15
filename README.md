# Vizzko
> ⚠️ **Under maintenance** — this project is currently undergoing maintenance. Some features or services may be temporarily unavailable. 

Vizzko is a full-stack web application for generating and ordering custom t-shirt designs using AI. Built with **Next.js**, **Express**, and **MongoDB**, Vizzko leverages **Google Vertex AI** to turn your creative ideas into unique wearables.

---

## Features

- ✨ **AI-Powered Design:** Generate t-shirt designs from your own text prompts using Google Vertex AI.
- 👤 **User Authentication:** Sign up or log in with email/password or Google OAuth.
- 🖼️ **Live Preview:** Instantly see AI-generated designs before ordering.
- 🎨 **Customization:** Adjust prompts and regenerate designs as needed.
- 🛒 **Order Management:** Place and track t-shirt orders.
- 🔒 **Secure:** JWT-based authentication and secure backend.

## Preview

Watch a short preview of Vizzko in action:

[Preview video on YouTube](https://youtu.be/Qdh6Dlj48g8?si=ibwnusOwDKl8vPiF)

---

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org) (React, TypeScript)
- **Backend:** [Express.js](https://expressjs.com)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
- **AI:** [Google Vertex AI](https://cloud.google.com/vertex-ai)
- **Authentication:** JWT, Google OAuth 2.0

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vizzko.git
cd vizzko
```

### 2. Install dependencies

```bash
# For both frontend and backend
npm install
cd backend
npm install
```

### 3. Set up environment variables

Create a `.env` file in both the root and `/backend` directories. Example for `/backend/.env`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_service_account.json
BASE_URL=http://localhost:5000
```

> **Note:** Never commit your `.env` or service account JSON to version control.

### 4. Run both frontend and backend concurrently

The project uses [`concurrently`](https://www.npmjs.com/package/concurrently) to start both servers with a single command.

```bash
npm run all
```

- The **frontend** will run at [http://localhost:3000](http://localhost:3000)
- The **backend** will run at [http://localhost:5000](http://localhost:5000)

---

## Usage

1. **Sign up or log in** (email/password or Google).
2. **Enter a prompt** describing your desired t-shirt design.
3. **Preview the AI-generated design**.
4. **Customize** or regenerate as needed.
5. **Place your order** and track it in your account.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Google Vertex AI](https://cloud.google.com/vertex-ai/docs)

---

## License

This project is for personal and educational use.

---

## Acknowledgements

- [Next.js](https://nextjs.org)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Google Vertex AI](https://cloud.google.com/vertex-ai)
