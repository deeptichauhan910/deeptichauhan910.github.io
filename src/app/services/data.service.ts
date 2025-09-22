import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Department, Employee, PaginatedResult, SearchCriteria } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly DEPARTMENTS_KEY = 'management_departments';
  private readonly EMPLOYEES_KEY = 'management_employees';
  private readonly DATA_INITIALIZED_KEY = 'management_data_initialized';

  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  private employeesSubject = new BehaviorSubject<Employee[]>([]);

  public departments$ = this.departmentsSubject.asObservable();
  public employees$ = this.employeesSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    if (!localStorage.getItem(this.DATA_INITIALIZED_KEY)) {
      this.generateSampleData();
      localStorage.setItem(this.DATA_INITIALIZED_KEY, 'true');
    }
    this.loadData();
  }

  private loadData(): void {
    const departments = this.getDepartmentsFromStorage();
    const employees = this.getEmployeesFromStorage();
    
    this.departmentsSubject.next(departments);
    this.employeesSubject.next(employees);
  }

  private getDepartmentsFromStorage(): Department[] {
    const data = localStorage.getItem(this.DEPARTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getEmployeesFromStorage(): Employee[] {
    const data = localStorage.getItem(this.EMPLOYEES_KEY);
    if (data) {
      const employees = JSON.parse(data);
      return employees.map((emp: any) => ({
        ...emp,
        hireDate: new Date(emp.hireDate),
        createdDate: new Date(emp.createdDate),
        updatedDate: new Date(emp.updatedDate)
      }));
    }
    return [];
  }

  private saveDepartmentsToStorage(departments: Department[]): void {
    localStorage.setItem(this.DEPARTMENTS_KEY, JSON.stringify(departments));
    this.departmentsSubject.next(departments);
  }

  private saveEmployeesToStorage(employees: Employee[]): void {
    localStorage.setItem(this.EMPLOYEES_KEY, JSON.stringify(employees));
    this.employeesSubject.next(employees);
  }

  // Department CRUD operations
  getAllDepartments(): Department[] {
    return this.getDepartmentsFromStorage();
  }

  getDepartmentById(id: string): Department | undefined {
    return this.getDepartmentsFromStorage().find(dept => dept.id === id);
  }

  createDepartment(department: Omit<Department, 'id' | 'createdDate' | 'updatedDate'>): Department {
    const departments = this.getDepartmentsFromStorage();
    const newDepartment: Department = {
      ...department,
      id: this.generateId(),
      createdDate: new Date(),
      updatedDate: new Date()
    };
    
    departments.push(newDepartment);
    this.saveDepartmentsToStorage(departments);
    return newDepartment;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const departments = this.getDepartmentsFromStorage();
    const index = departments.findIndex(dept => dept.id === id);
    
    if (index !== -1) {
      departments[index] = {
        ...departments[index],
        ...updates,
        id,
        updatedDate: new Date()
      };
      this.saveDepartmentsToStorage(departments);
      return departments[index];
    }
    return null;
  }

  deleteDepartment(id: string): boolean {
    const departments = this.getDepartmentsFromStorage();
    const employees = this.getEmployeesFromStorage();
    
    // Check if department has employees
    const hasEmployees = employees.some(emp => emp.departmentId === id);
    if (hasEmployees) {
      throw new Error('Cannot delete department with existing employees');
    }
    
    const filteredDepartments = departments.filter(dept => dept.id !== id);
    if (filteredDepartments.length !== departments.length) {
      this.saveDepartmentsToStorage(filteredDepartments);
      return true;
    }
    return false;
  }

  // Employee CRUD operations
  getAllEmployees(): Employee[] {
    return this.getEmployeesFromStorage();
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.getEmployeesFromStorage().find(emp => emp.id === id);
  }

  createEmployee(employee: Omit<Employee, 'id' | 'createdDate' | 'updatedDate'>): Employee {
    const employees = this.getEmployeesFromStorage();
    const newEmployee: Employee = {
      ...employee,
      id: this.generateId(),
      createdDate: new Date(),
      updatedDate: new Date()
    };
    
    employees.push(newEmployee);
    this.saveEmployeesToStorage(employees);
    this.updateDepartmentEmployeeCount(newEmployee.departmentId);
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const employees = this.getEmployeesFromStorage();
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index !== -1) {
      const oldDepartmentId = employees[index].departmentId;
      employees[index] = {
        ...employees[index],
        ...updates,
        id,
        updatedDate: new Date()
      };
      
      this.saveEmployeesToStorage(employees);
      
      // Update department counts if department changed
      if (updates.departmentId && updates.departmentId !== oldDepartmentId) {
        this.updateDepartmentEmployeeCount(oldDepartmentId);
        this.updateDepartmentEmployeeCount(updates.departmentId);
      }
      
      return employees[index];
    }
    return null;
  }

  deleteEmployee(id: string): boolean {
    const employees = this.getEmployeesFromStorage();
    const employee = employees.find(emp => emp.id === id);
    
    if (employee) {
      const filteredEmployees = employees.filter(emp => emp.id !== id);
      this.saveEmployeesToStorage(filteredEmployees);
      this.updateDepartmentEmployeeCount(employee.departmentId);
      return true;
    }
    return false;
  }

  // Search and pagination
  searchEmployees(criteria: SearchCriteria, page: number = 1, pageSize: number = 20): PaginatedResult<Employee> {
    let employees = this.getEmployeesFromStorage();
    
    // Apply search filters
    if (criteria.searchTerm) {
      const searchTerm = criteria.searchTerm.toLowerCase();
      employees = employees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm)
      );
    }
    
    if (criteria.departmentId) {
      employees = employees.filter(emp => emp.departmentId === criteria.departmentId);
    }
    
    if (criteria.status) {
      employees = employees.filter(emp => emp.status === criteria.status);
    }
    
    // Apply pagination
    const totalItems = employees.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedEmployees = employees.slice(startIndex, endIndex);
    
    return {
      data: paginatedEmployees,
      totalItems,
      currentPage: page,
      pageSize,
      totalPages
    };
  }

  getDepartmentsPaginated(page: number = 1, pageSize: number = 20): PaginatedResult<Department> {
    const departments = this.getDepartmentsFromStorage();
    const totalItems = departments.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDepartments = departments.slice(startIndex, endIndex);
    
    return {
      data: paginatedDepartments,
      totalItems,
      currentPage: page,
      pageSize,
      totalPages
    };
  }

  private updateDepartmentEmployeeCount(departmentId: string): void {
    const employees = this.getEmployeesFromStorage();
    const departments = this.getDepartmentsFromStorage();
    
    const employeeCount = employees.filter(emp => emp.departmentId === departmentId).length;
    const departmentIndex = departments.findIndex(dept => dept.id === departmentId);
    
    if (departmentIndex !== -1) {
      departments[departmentIndex].employeeCount = employeeCount;
      departments[departmentIndex].updatedDate = new Date();
      this.saveDepartmentsToStorage(departments);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSampleData(): void {
    // Create departments
    const departments: Department[] = [
      {
        id: this.generateId(),
        name: 'Human Resources',
        description: 'Manages employee relations, recruitment, and HR policies',
        manager: 'Sarah Johnson',
        budget: 500000,
        employeeCount: 0,
        createdDate: new Date(),
        updatedDate: new Date()
      },
      {
        id: this.generateId(),
        name: 'Information Technology',
        description: 'Handles all technology infrastructure and software development',
        manager: 'Michael Chen',
        budget: 1200000,
        employeeCount: 0,
        createdDate: new Date(),
        updatedDate: new Date()
      },
      {
        id: this.generateId(),
        name: 'Finance',
        description: 'Manages financial planning, accounting, and budgeting',
        manager: 'Jennifer Davis',
        budget: 800000,
        employeeCount: 0,
        createdDate: new Date(),
        updatedDate: new Date()
      },
      {
        id: this.generateId(),
        name: 'Marketing',
        description: 'Responsible for brand promotion and customer acquisition',
        manager: 'David Wilson',
        budget: 900000,
        employeeCount: 0,
        createdDate: new Date(),
        updatedDate: new Date()
      },
      {
        id: this.generateId(),
        name: 'Operations',
        description: 'Oversees daily business operations and process improvement',
        manager: 'Lisa Anderson',
        budget: 700000,
        employeeCount: 0,
        createdDate: new Date(),
        updatedDate: new Date()
      },
      {
        id: this.generateId(),
        name: 'Sales',
        description: 'Drives revenue growth through customer relationships and sales',
        manager: 'Robert Taylor',
        budget: 1000000,
        employeeCount: 0,
        createdDate: new Date(),
        updatedDate: new Date()
      }
    ];

    localStorage.setItem(this.DEPARTMENTS_KEY, JSON.stringify(departments));

    // Generate 50 employees
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer', 'Christopher', 'Amanda', 'Daniel', 'Jessica', 'Matthew', 'Ashley', 'Anthony', 'Stephanie', 'Mark', 'Michelle', 'Steven', 'Kimberly', 'Paul', 'Donna', 'Andrew'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];
    const positions = ['Developer', 'Analyst', 'Manager', 'Coordinator', 'Specialist', 'Associate', 'Director', 'Supervisor', 'Representative', 'Consultant'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
    const statuses: ('Active' | 'Inactive' | 'On Leave')[] = ['Active', 'Active', 'Active', 'Active', 'Inactive', 'On Leave'];

    const employees: Employee[] = [];
    
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const departmentId = departments[Math.floor(Math.random() * departments.length)].id;
      const cityIndex = Math.floor(Math.random() * cities.length);
      
      employees.push({
        id: this.generateId(),
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        departmentId,
        position: positions[Math.floor(Math.random() * positions.length)],
        salary: Math.floor(Math.random() * 100000) + 40000,
        hireDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        address: {
          street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Cedar'][Math.floor(Math.random() * 5)]} St`,
          city: cities[cityIndex],
          state: states[cityIndex],
          zipCode: (Math.floor(Math.random() * 90000) + 10000).toString()
        },
        createdDate: new Date(),
        updatedDate: new Date()
      });
    }

    localStorage.setItem(this.EMPLOYEES_KEY, JSON.stringify(employees));

    // Update department employee counts
    departments.forEach(dept => {
      dept.employeeCount = employees.filter(emp => emp.departmentId === dept.id).length;
    });
    
    localStorage.setItem(this.DEPARTMENTS_KEY, JSON.stringify(departments));
  }
}