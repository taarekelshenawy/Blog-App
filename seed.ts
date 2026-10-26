import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  await prisma.article.deleteMany({});

 

  const sampleArticles = [
    { title: "Introduction to JavaScript", description: "Learn the fundamentals of JS programming language.", authorId: 15 },
    { title: "Advanced React Patterns", description: "Master custom hooks, compound components, and performance.", authorId: 15 },
    { title: "Next.js App Router Guide", description: "Build fullstack web apps with server and client components.", authorId: 15 },
    { title: "Tailwind CSS Tips & Tricks", description: "Write clean, responsive utility-first CSS faster.", authorId: 15 },
    { title: "Understanding TypeScript Generics", description: "Type safety and reusable code architectures in TS.", authorId: 15 },
    { title: "Node.js and Express Backend", description: "Build scalable RESTful APIs with Node and Express.", authorId: 15 },
    { title: "Database Seeding with Prisma", description: "Populate your SQL database with test data easily.", authorId: 15 },
    { title: "State Management in 2026", description: "Comparing Zustand, Redux Toolkit, and TanStack Query.", authorId: 15 },
    { title: "Web Performance Optimization", description: "Improving Core Web Vitals, LCP, and lazy loading.", authorId: 15 },
    { title: "Git and GitHub Workflow", description: "Branching strategies, pull requests, and clean commits.", authorId: 15 },
    { title: "MongoDB vs PostgreSQL", description: "Choosing the right database for your next web project.", authorId: 15 },
    { title: "Building a Developer Portfolio", description: "Showcase your projects and land your first tech job.", authorId: 15 },
    { title: "Clean Code Principles", description: "Write maintainable software that other developers love.", authorId: 15 },
    { title: "Asynchronous JavaScript", description: "Mastering promises, async/await, and the event loop.", authorId: 15 },
    { title: "Docker for Web Developers", description: "Containerize your applications for seamless deployment.", authorId: 15 },
    { title: "API Security Best Practices", description: "Protect your backend with JWT, CORS, and rate limiting.", authorId: 15 },
    { title: "UI/UX Principles for Developers", description: "Creating intuitive user interfaces without a designer.", authorId: 15 },
    { title: "Testing with Jest and Playwright", description: "Ensuring code quality through automated testing.", authorId: 15 },
    { title: "Introduction to Cloud Deployment", description: "Deploying your Next.js apps on Vercel and AWS.", authorId: 15 },
    { title: "AI Tools for Web Development", description: "Leveraging AI assistants and automated workflows.", authorId: 15 }
  ];

  await prisma.article.createMany({
    data: sampleArticles,
  });


}

main()
  .catch((e) => {
    console.error('حدث خطأ أثناء الـ Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });