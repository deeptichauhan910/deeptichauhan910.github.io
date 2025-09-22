import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Employee, Department, PaginatedResult, SearchCriteria } from '../../models';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employeeResult: PaginatedResult<Employee> = {
    data: [],
    totalItems: 0,
    currentPage: 1,
    pageSize: 20,
    totalPages: 0
  };

  departments: Department[] = [];
  showAddForm = false;
  showEditForm = false;
  editingEmployee: Employee | null = null;
  
  currentEmployee: Partial<Employee> = this.getEmptyEmployee();
  
  searchCriteria: SearchCriteria = {
    searchTerm: '',
    departmentId: '',
    status: ''
  };

  displayMode: 'Table' | 'Div' | 'TableDiv' | 'Card' | 'TableTRTD' = 'Table';

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.departments = this.dataService.getAllDepartments();
    this.loadEmployees();
    
    // Check for edit query parameter
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        const employee = this.dataService.getEmployeeById(params['edit']);
        if (employee) {
          this.editEmployee(employee);
        }
      }
    });
  }

  getEmptyEmployee(): Partial<Employee> {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      position: '',
      salary: 0,
      hireDate: new Date(),
      status: 'Active',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    };
  }

  loadEmployees(): void {
    this.employeeResult = this.dataService.searchEmployees(
      this.searchCriteria,
      this.employeeResult.currentPage,
      this.employeeResult.pageSize
    );
  }

  performSearch(): void {
    this.employeeResult.currentPage = 1;
    this.loadEmployees();
  }

  clearSearch(): void {
    this.searchCriteria = {
      searchTerm: '',
      departmentId: '',
      status: ''
    };
    this.performSearch();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.employeeResult.totalPages) {
      this.employeeResult.currentPage = page;
      this.loadEmployees();
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.employeeResult.totalPages;
    const current = this.employeeResult.currentPage;
    const pages: number[] = [];
    
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  editEmployee(employee: Employee): void {
    this.editingEmployee = employee;
    this.currentEmployee = { 
      ...employee,
      address: { ...employee.address }
    };
    this.showEditForm = true;
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.dataService.deleteEmployee(employee.id);
      this.loadEmployees();
    }
  }

  saveEmployee(): void {
    // Ensure address is properly initialized
    if (!this.currentEmployee.address) {
      this.currentEmployee.address = {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      };
    }

    if (this.editingEmployee) {
      this.dataService.updateEmployee(this.editingEmployee.id, this.currentEmployee);
    } else {
      this.dataService.createEmployee(this.currentEmployee as Omit<Employee, 'id' | 'createdDate' | 'updatedDate'>);
    }
    this.closeForm();
    this.loadEmployees();
  }

  closeForm(): void {
    this.showAddForm = false;
    this.showEditForm = false;
    this.editingEmployee = null;
    this.currentEmployee = this.getEmptyEmployee();
  }

  getDepartmentName(departmentId: string): string {
    const department = this.departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  }

  formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  updateAddressField(field: string, value: string): void {
    if (!this.currentEmployee.address) {
      this.currentEmployee.address = {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      };
    }
    (this.currentEmployee.address as any)[field] = value;
  }

  setDisplayMode(mode: 'Table' | 'Div' | 'TableDiv' | 'Card' | 'TableTRTD'): void {
    this.displayMode = mode;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}