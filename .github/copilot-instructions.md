# Copilot Instructions for Bloodline-DNA

## Overview
Bloodline-DNA is a monorepo with both backend (C#/.NET) and frontend (React Native, React + Vite) components. The backend is under `BE/ADNTester/`, and the frontend is under `FE/`. The project supports DNA test kit logistics, booking, and result management.

## Architecture & Key Components
- **Backend (`BE/ADNTester/`)**
  - **ADNTester.Api/**: ASP.NET Core Web API. Contains controllers for admin, authentication, logistics, payment, test booking, and more. Uses background jobs (e.g., `BackgroundJobs/OtpCleanupWorker.cs`).
  - **ADNTester.BO/**: Business objects, DTOs, and core entities.
  - **ADNTester.Repository/**: Data access, dependency injection, and migrations. `ApplicationDbContext.cs` is the main EF Core context.
  - **ADNTester.Service/**: Business logic, mapping profiles, and service interfaces/implementations.
  - **DAL/**: Data access layer interfaces and repositories.
  - **docker/**: Docker and compose files for local development and deployment.

- **Frontend (`FE/`)**
  - **MobileApp/Bloodline-DNA-App/**: React Native app for staff and users. Uses TypeScript. Screens are organized by feature (e.g., `src/screens/staff/delivery/`).
  - **Web/Bloodline-DNA/**: React + Vite web app. Uses TypeScript, Tailwind CSS, and ESLint. See `README.md` for linting and config details.

## Developer Workflows
- **Backend**
  - Build/Run: Use Visual Studio or `dotnet` CLI. Main entry: `ADNTester.Api/Program.cs`.
  - Database: EF Core migrations in `Repository/Migrations/`. Use `dotnet ef` for migration commands.
  - Docker: Use `docker-compose.yml` for local orchestration.

- **Frontend**
  - **Mobile**: Run with `npx react-native run-ios` or `run-android` in `MobileApp/Bloodline-DNA-App/`.
  - **Web**: Run with `npm run dev` in `Web/Bloodline-DNA/`.
  - Linting: See `eslint.config.js` and `README.md` in each frontend app for rules and config.

## Project-Specific Patterns
- **API Communication**: Mobile app uses `api/` modules for backend calls. Use FormData for file uploads (see `delivery/index.tsx`).
- **Status Mapping**: Delivery/order status uses `statusColorMap` and `statusTextMap` (see `types/delivery`).
- **Component Structure**: Prefer feature-based folder structure for screens/components.
- **Image Uploads**: Use `react-native-image-picker` for image selection and upload in mobile.

## Integration & Dependencies
- **Backend**: .NET Core, Entity Framework Core, Docker
- **Frontend**: React Native, React, Vite, Tailwind CSS, ESLint, react-native-image-picker

## Key Files & Directories
- `BE/ADNTester/ADNTester.Api/Controllers/`: API endpoints
- `BE/ADNTester/ADNTester.Repository/ApplicationDbContext.cs`: DB context
- `FE/MobileApp/Bloodline-DNA-App/src/screens/`: Mobile screens
- `FE/Web/Bloodline-DNA/`: Web app root

## Conventions
- Use TypeScript for all new frontend code.
- Use feature-based folders for screens/components.
- Use FormData for file/image uploads from mobile.
- Keep business logic in `Service/` and `BO/` layers, not controllers.

---

If you are unsure about a workflow or pattern, check the relevant `README.md` or ask for clarification.
