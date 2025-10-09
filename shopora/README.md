# 🛍️ Shopora - E-Commerce Full Stack Store

Proyek e-commerce full stack menggunakan **MERN Stack** (MongoDB, Express, React, Node.js) dengan design elegant dan klasik.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Documentation](#-api-documentation)
- [Progress Development](#-progress-development)

---

## ✨ Fitur Utama

### Customer Features
- 🛒 **Product Catalog** - Browse produk dengan search & filter
- 🛍️ **Shopping Cart** - Keranjang belanja dengan update quantity
- 💳 **Multiple Payment** - Stripe, PayPal, dan Xendit
- 👤 **User Dashboard** - Manage profile dan order history
- ❤️ **Wishlist** - Simpan produk favorit
- ⭐ **Review & Rating** - Review produk yang sudah dibeli
- 📱 **WhatsApp Integration** - Customer service via WhatsApp

### Admin Features
- 📊 **Admin Dashboard** - Overview penjualan dan statistik
- 📦 **Product Management** - CRUD produk lengkap
- 📋 **Order Management** - Kelola semua pesanan
- 👥 **User Management** - Kelola user dan permissions

---

## 🛠️ Teknologi

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM untuk MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Framer Motion** - Animations

### Payment Gateways
- **Stripe** - International payments
- **PayPal** - Global payment processor
- **Xendit** - Southeast Asia payments

---

## 📁 Struktur Proyek

```
shopora/
├── backend/          # Express API Server
│   ├── config/       # Database & configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── utils/        # Helper functions
│   └── server.js     # Entry point
│
├── frontend/         # React Application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store & slices
│   │   ├── styles/      # CSS files
│   │   └── utils/       # Helper functions
│   └── public/       # Static assets
│
└── README.md         # Documentation
```

---

## 🚀 Instalasi

### Prerequisites
Pastikan sudah terinstall:
- Node.js (v18 atau lebih baru)
- MongoDB (local atau MongoDB Atlas)
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd shopora
```

### Step 2: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

---

## ⚙️ Konfigurasi

### Backend Configuration

1. Copy file `.env.example` ke `.env`:
```bash
cd backend
cp .env.example .env
```

2. Edit file `.env` dan isi dengan credentials Anda:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/shopora

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d

# Payment Gateways
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your_paypal_client_id
XENDIT_SECRET_KEY=your_xendit_key

# Email
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# WhatsApp
WHATSAPP_API_KEY=your_whatsapp_api_key
```

### Frontend Configuration

1. Copy file `.env.example` ke `.env`:
```bash
cd frontend
cp .env.example .env
```

2. Edit file `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

---

## 🏃 Menjalankan Aplikasi

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server akan berjalan di `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App akan berjalan di `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/pay` - Update order to paid

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

---

## 📈 Progress Development

### ✅ Part 1 - Setup & Struktur (SELESAI)
- [x] Struktur folder lengkap
- [x] Backend setup
- [x] Frontend setup
- [x] Configuration files

### 🔄 Part 2 - Database Connection (NEXT)
- [ ] MongoDB connection
- [ ] Database models
- [ ] Seeding data

### 📋 Upcoming Parts
- Part 3: User Authentication
- Part 4: Product API
- Part 5: Frontend Routing
- Part 6-20: Feature implementations

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername]
- Email: your.email@example.com

---

## 📄 License

MIT License - Bebas digunakan untuk pembelajaran dan proyek pribadi.

---

## 🙏 Acknowledgments

- React Documentation
- Express.js Guide
- MongoDB University
- Tailwind CSS

---

**Happy Coding! 🚀**