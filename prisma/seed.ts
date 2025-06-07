import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const adminPassword = await hash('admin123', 10);  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@library.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  // Create some categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Fiction' },
    }),
    prisma.category.create({
      data: { name: 'Non-Fiction' },
    }),
    prisma.category.create({
      data: { name: 'Science' },
    }),
    prisma.category.create({
      data: { name: 'Technology' },
    }),
  ]);

  // Create some sample books
  await Promise.all(
    categories.map((category) =>
      prisma.book.create({
        data: {
          title: `Sample ${category.name} Book`,
          author: 'John Doe',
          isbn: `ISBN-${Math.random().toString(36).substring(7)}`,
          categoryId: category.id,
          description: `A sample book in the ${category.name} category`,
          totalCopies: 5,
          availableCopies: 5,
        },
      })
    )
  );

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
