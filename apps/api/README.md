# API Service (Core Backend)

This is the main backend service for the application. It handles all core business logic, including:
- **Authentication & Authorization** (JWT, User Login/Signup)
- **User Management**
- **Project Orchestration**
- **Task Management**

## Tech Stack
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Validation:** class-validator / DTOs

## Database Migrations

Since this is a monorepo, migrations must be run from the **root** of the workspace.

### Create a new migration
Run this command when you change the `schema.prisma` file:
```bash
npx nx migrate-dev @org/api --name <migration_name>
```

### Seed data
```bash
npx nx seed @org/api
```
