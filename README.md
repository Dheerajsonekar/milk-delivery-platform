

#  FreshStore | Full-Stack AI Integrated E-Commerce Platform

A modern multi-role platform (Customer, Vendor, Admin, Delivery Boy) built with **Next.js (React 19)** and **Node.js (Express + TypeScript)**.
It supports **secure payments, AI-powered product recommendations, real-time updates**, and **cloud-based image uploads**.

---

##  Tech Stack

### **Frontend (Client)**

*  [Next.js 15](https://nextjs.org/) (React 19)
*  Tailwind CSS 4 (with PostCSS)
*  Recharts (for analytics & dashboards)
*  Axios (API communication)
*  LightningCSS (blazing fast CSS builds)

### **Backend (Server)**

*  Node.js + Express + TypeScript
*  Databases:

  * PostgreSQL (via Sequelize ORM)
  * MongoDB (via Mongoose)
*  Cloudinary (image uploads)
*  JWT Authentication + Secure Cookies
*  Razorpay Payment Integration
*  AI Product Recommendations (OpenAI / Jina Embeddings)
*  Multer (file uploads)

---

## 📁 Folder Structure

```
 project-root
├── client/                # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # Reusable components
│   ├── context/           # Global contexts (auth, cart, etc.)
│   └── lib/               # Axios instance & utils
│
└── server/                # Express backend
    ├── src/
    │   ├── controllers/   # Business logic (Auth, Product, AI)
    │   ├── models/        # Sequelize & Mongoose models
    │   ├── routes/        # API routes
    │   ├── middlewares/   # Auth & upload handling
    │   └── utils/         # Cloudinary, OpenAI setup, etc.
    └── dist/              # Compiled JS files (after build)
```

---

##  Environment Setup

### 1️ Clone the repository

```bash
git clone https://github.com/yourusername/freshstore-ai.git
cd freshstore-ai
```

### 2️ Setup backend (`server/`)

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
POSTGRES_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

OPENAI_API_KEY=your_openai_key   # or JINA_API_KEY=your_jina_key
```

Run backend:

```bash
npm run dev
```

### 3️ Setup frontend (`client/`)

```bash
cd ../client
npm install
```

Run frontend:

```bash
npm run dev
```



## AI Integration

This project uses  **Jina AI** to power semantic recommendations:

* Each product’s name + description is converted into an embedding.
* When a user views a product, the backend computes cosine similarity to find similar items.

> If OpenAI quota exceeds, set:
>
> ```env
> USE_JINA_AI=true
> JINA_API_KEY=your_jina_key
> ```



##  Scripts

| Command         | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start development server (client or backend) |
| `npm run build` | Build production files                       |
| `npm start`     | Start production server                      |
| `npm run lint`  | Run ESLint (client only)                     |


##  Features Overview

✅ **Multi-role System** – Customer, Vendor, Admin, Delivery Boy
✅ **JWT Auth + Cookies** – Secure login session handling
✅ **AI Recommendations** – Semantic similarity-based product suggestions
✅ **Cloudinary Uploads** – Optimized image hosting
✅ **Stripe / Razorpay Payments** – Real-time order handling
✅ **Real-time Cart Updates**
✅ **Dashboard Analytics** using Recharts
✅ **Responsive UI** with TailwindCSS



##  Deployment

### Client (Vercel)

```bash
npm run build
```

Then deploy `/client` folder on [Vercel](https://vercel.com/).

### Server (Render / Railway)

```bash
npm run build
npm start
```

Deploy `/server` folder on [Render](https://render.com/) or [Railway](https://railway.app/).



## 👨 Author

**Dheeraj Sonekar**
 [dheerajsonekar@example.com](mailto:dheerajsonekar@example.com)
 [LinkedIn](https://linkedin.com/in/dheeraj-sonekar)



##  Future Enhancements

* [ ] Integrate TensorFlow.js for personalized recommendations
* [ ] Add donation analytics for NGO admins
* [ ] Integrate AI chatbot for customer support


