# Management System - Angular Application

This is an Angular-based management system application with full CRUD operations for employees and departments.

## Features

- **Angular 17** with standalone components
- **Angular Router** for navigation with clean URLs (`/Home`, `/About`, `/Employees`, `/Departments`)
- **Full CRUD Operations** for employees and departments
- **Local Storage** for data persistence
- **Search & Filtering** for employees by name, department, and status
- **Pagination** with configurable page size (default: 20)
- **Pre-populated Sample Data** (50 employees across 6 departments)
- **Responsive Design** with sidebar and header layout
- **Form Validation** for data integrity
- **Single Page Application (SPA)** architecture
- **Express.js server** for production deployment

## Data Management

### Employees
- **CRUD Operations**: Create, read, update, and delete employees
- **Search Functionality**: Search by name, email, or position
- **Filter by Department**: Filter employees by their assigned department
- **Filter by Status**: Filter by Active, Inactive, or On Leave status
- **Pagination**: Navigate through large employee lists
- **Form Validation**: Required fields and data type validation
- **Address Management**: Complete address information for each employee

### Departments
- **CRUD Operations**: Create, read, update, and delete departments
- **Employee Count Tracking**: Automatically tracks number of employees per department
- **Budget Management**: Track department budgets
- **Deletion Protection**: Prevents deletion of departments with active employees
- **Manager Assignment**: Assign department managers
- **Pagination**: Navigate through department lists

### Sample Data
- **50 Pre-populated Employees** with realistic data
- **6 Departments**: HR, IT, Finance, Marketing, Operations, Sales
- **Automatic Data Generation**: First run generates sample data
- **Persistent Storage**: Data persists in browser localStorage

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/home.component.ts
│   │   ├── about/about.component.ts
│   │   ├── employees/employees.component.ts  # Employee CRUD operations
│   │   └── departments/departments.component.ts  # Department CRUD operations
│   ├── models/
│   │   └── index.ts  # Employee, Department, and utility interfaces
│   ├── services/
│   │   └── data.service.ts  # Data management and localStorage operations
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

- `/Home` - Welcome page with system overview
- `/About` - About us information
- `/Employees` - Employee management with CRUD operations, search, and pagination
- `/Departments` - Department management with CRUD operations and pagination
- `/Profile/:id` - **NEW** - Individual employee profile pages with detailed information

All routes redirect to `/Home` if an invalid route is accessed.

## Employee Management Features

### Search & Filter
- **Text Search**: Search employees by name, email, or position
- **Department Filter**: Filter by specific department
- **Status Filter**: Filter by employment status (Active, Inactive, On Leave)
- **Combined Filters**: Use multiple filters simultaneously
- **Real-time Search**: Results update as you type

### Pagination
- **Default Page Size**: 20 employees per page
- **Page Navigation**: Previous/Next buttons and direct page selection
- **Result Count**: Shows total employees and current page information
- **Responsive**: Works on mobile devices

### Employee Form
- **Personal Information**: First name, last name, email, phone
- **Employment Details**: Department, position, salary, hire date, status
- **Address Information**: Complete address with street, city, state, zip
- **Validation**: Required field validation and data type checking
- **Edit Mode**: Update existing employee information

### Profile Pages 🆕
- **Individual Profiles**: Click any employee name to view their detailed profile
- **Comprehensive Information**: All employee details including calculated years of service
- **Direct Actions**: Edit and delete employees directly from their profile
- **Navigation**: Easy navigation between profile and employee list
- **Responsive**: Profile pages work perfectly on all devices

### Display Modes
- **Table View**: Traditional table layout with sortable columns
- **Div View**: Card-style layout with modern design
- **TableDiv**: Table styling with div elements for flexibility
- **Card View**: Modern card layout with visual appeal
- **TableTRTD**: Semantic HTML table elements for accessibility

## Department Management Features

### Department Overview
- **Card Layout**: Visual department cards with key information
- **Employee Count**: Real-time count of employees in each department
- **Budget Tracking**: Department budget information
- **Manager Information**: Department manager assignment
- **Creation Date**: Track when departments were created

### Department Form
- **Basic Information**: Name, description, manager
- **Budget Management**: Department budget allocation
- **Validation**: Required field validation
- **Employee Protection**: Cannot delete departments with active employees

## Data Storage

### Local Storage
- **Persistent Data**: All data stored in browser localStorage
- **Automatic Initialization**: Sample data created on first load
- **Data Relationships**: Employee-department relationships maintained
- **Real-time Updates**: Changes reflected immediately across components

### Sample Data Details
- **50 Employees**: Diverse names, positions, and departments
- **6 Departments**: HR, IT, Finance, Marketing, Operations, Sales
- **Realistic Information**: Phone numbers, emails, addresses, salaries
- **Date Ranges**: Hire dates spanning 2020-2025
- **Status Variety**: Mix of Active, Inactive, and On Leave employees

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
- Angular Forms (Template-driven)
- Express.js
- CSS Grid Layout
- Responsive Design
- Local Storage API

## Usage Tips

1. **Data Persistence**: Your data is saved in browser localStorage and will persist between sessions
2. **Search**: Use the search box to quickly find employees by name, email, or position
3. **Filtering**: Combine multiple filters for precise employee lists
4. **Department Management**: Cannot delete departments with employees - reassign employees first
5. **Mobile Friendly**: All features work on mobile devices with responsive design