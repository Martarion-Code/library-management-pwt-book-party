# Library Management System

A modern web-based library management system that helps libraries manage their collections and allows users to browse, borrow, and reserve books efficiently. Built with Next.js 15, TypeScript, and Supabase, featuring a clean and responsive UI powered by shadcn/ui components.

## Features

- 📚 **Book Management**
  - Browse and search books by title, author, or ISBN
  - Filter books by categories
  - View detailed book information
  - Track book availability in real-time
  - Cover image display and management

- 🔒 **User Authentication**
  - Secure email/password authentication
  - User profile management
  - Role-based access control
  - Protected routes

- 📖 **Borrowing System**
  - Borrow and return books
  - Book reservation system
  - Due date tracking
  - Automated availability updates

- 💻 **Modern UI/UX**
  - Responsive design for all devices
  - Dark mode support
  - Toast notifications
  - Loading states and error handling
  - Clean and intuitive interface

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, React
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Context
- **Form Handling**: React Hook Form, Zod
- **Date Handling**: date-fns

## Getting Started

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
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Chan Meng**

- LinkedIn: [chanmeng666](https://www.linkedin.com/in/chanmeng666/)
- GitHub: [ChanMeng666](https://github.com/ChanMeng666)
