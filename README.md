# Management System - Angular Application

This is an Angular-based management system application with routing for different pages.

## Features

- **Angular 17** with standalone components
- **Angular Router** for navigation with clean URLs (`/Home`, `/About`, `/Employees`, `/Departments`)
- **Responsive Design** with sidebar and header layout
- **Single Page Application (SPA)** architecture
- **Express.js server** for production deployment

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/home.component.ts
│   │   ├── about/about.component.ts
│   │   ├── employees/employees.component.ts
│   │   └── departments/departments.component.ts
│   ├── app.component.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.css
```

## Available Scripts

### Development
```bash
# Start Angular development server
npm start
# or
ng serve

# Navigate to http://localhost:4200
```

### Production Build
```bash
# Build the application for production
npm run build

# Serve the built application with Express
npm run serve:express

# Navigate to http://localhost:3000
```

### Other Commands
```bash
# Build and watch for changes
npm run watch

# Run tests
npm test
```

## Routes

The application supports the following routes:

- `/Home` - Welcome page
- `/About` - About us information
- `/Employees` - Employee management interface
- `/Departments` - Department management interface

All routes redirect to `/Home` if an invalid route is accessed.

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The built files will be in `dist/management-system/`

3. Deploy using the Express server:
   ```bash
   npm run serve:express
   ```

4. Or deploy the `dist/management-system/` folder to any static hosting service.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Open browser to `http://localhost:4200`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- Angular 17
- TypeScript
- Angular Router
- Express.js
- CSS Grid Layout
- Responsive Design