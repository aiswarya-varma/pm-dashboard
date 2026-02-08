import { PrismaClient, Role, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: 'password123',
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@test.com',
      password: 'password123',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@test.com',
      password: 'password123',
      role: Role.USER,
    },
  });

  // Projects
  const adminProject = await prisma.project.create({
    data: {
      name: 'Admin Project Alpha',
      description: 'Main test project',
      createdById: admin.id,
    },
  });

  const readOnlyProject = await prisma.project.create({
    data: {
      name: 'Read Only Project',
      createdById: admin.id,
    },
  });

  const emptyProject = await prisma.project.create({
    data: {
      name: 'Empty Project',
      createdById: admin.id,
    },
  });

  // Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Task TODO',
        status: TaskStatus.TODO,
        projectId: adminProject.id,
        createdById: user1.id,
      },
      {
        title: 'Task IN_PROGRESS',
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date(),
        projectId: adminProject.id,
        createdById: user1.id,
      },
      {
        title: 'Task DONE',
        status: TaskStatus.DONE,
        dueDate: new Date(Date.now() - 86400000),
        projectId: adminProject.id,
        createdById: admin.id,
      },
      {
        title: 'Task BLOCKED',
        status: TaskStatus.BLOCKED,
        dueDate: new Date(Date.now() + 86400000),
        projectId: adminProject.id,
        createdById: user2.id,
      },
      {
        title: 'Read Only Task',
        status: TaskStatus.TODO,
        projectId: readOnlyProject.id,
        createdById: admin.id,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
