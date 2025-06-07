<div align="center">
 <h1>📚 Library Management System</h1>
 <img src="https://img.shields.io/badge/Next.js-15.0.2-black"/>
 <img src="https://img.shields.io/badge/TypeScript-5.0.0-blue"/>
 <img src="https://img.shields.io/badge/License-MIT-green"/>
 <img src="https://img.shields.io/badge/Prisma-6.9.0-lightgrey"/>
 <img src="https://img.shields.io/badge/React-18.3.1-61DAFB"/>
</div>

A modern web-based library management system that helps libraries manage their collections and allows users to browse, borrow, and reserve books efficiently. Built with Next.js 15, TypeScript, and Prisma with PostgreSQL, featuring a clean and responsive UI powered by shadcn/ui components.

![屏幕截图_11-11-2024_17212_localhost](https://github.com/user-attachments/assets/70bd5184-9eb6-4670-b3de-5a4002c34a46)

![屏幕截图_11-11-2024_1733_localhost](https://github.com/user-attachments/assets/54da54eb-a64d-4f93-b69a-b36349c77a43)

![屏幕截图_11-11-2024_17321_localhost](https://github.com/user-attachments/assets/a0313675-7dd5-4a3b-911e-9df6e05aee32)

![屏幕截图_11-11-2024_17342_localhost](https://github.com/user-attachments/assets/dc8b1980-44a4-4b59-9f6d-c92f60016a0c)

![屏幕截图_11-11-2024_1747_localhost](https://github.com/user-attachments/assets/c67b34d7-b771-4b86-b43a-68704cec7acb)

![屏幕截图_11-11-2024_17355_localhost](https://github.com/user-attachments/assets/dea6bc1e-41e4-413e-b614-f6562413a97e)


## ✨ Features

### 📚 Book Management
- Browse and search books by title, author, or ISBN
- Advanced filtering by categories
- Real-time book availability tracking
- Cover image management system
- Detailed book information pages

### 🔒 Security & Authentication
- Secure JWT-based authentication
- Role-based access control
- Protected routes and API endpoints
- User profile management
- Session handling

### 📖 Borrowing System
- Intuitive book checkout process
- Automated due date management
- Book reservation queue
- Return processing
- Late return notifications
- Borrowing history tracking

### 💻 Modern UI/UX
- Responsive design for all devices
- Dark mode support
- Real-time updates
- Interactive toast notifications
- Loading states and error handling
- Clean and intuitive interface

## 🛠️ Tech Stack

### Frontend
![Next JS](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend & Database
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### Tools & Utilities
- shadcn/ui - UI Components
- React Hook Form - Form handling
- Zod - Schema validation
- date-fns - Date manipulation
- ESLint - Code linting
- Prettier - Code formatting

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/ChanMeng666/library-management-system.git
cd library-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```
DATABASE_URL=your-postgresql-url
JWT_SECRET=your-jwt-secret
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── ...configuration files
```

## 🤝 Contributing

We welcome contributions to improve the Library Management System! Here's how you can help:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure you follow our coding standards and include appropriate tests.

## 📄 License

See the [AGPL-3.0 license](LICENSE) file for details.

## 👤 Author



## ⭐ Support

If you found this project helpful, give it a ⭐️. Every star motivates us to keep improving!

