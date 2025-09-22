import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Department, PaginatedResult } from '../../models';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="department-management">
      <div class="header-section">
        <h1>Department Management</h1>
        <button class="btn btn-primary" (click)="showAddForm = true">Add New Department</button>
      </div>

      <!-- Add/Edit Form Modal -->
      <div class="modal" *ngIf="showAddForm || showEditForm">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{editingDepartment ? 'Edit Department' : 'Add New Department'}}</h3>
            <button class="close-btn" (click)="closeForm()">&times;</button>
          </div>
          <form (ngSubmit)="saveDepartment()" #departmentForm="ngForm" class="department-form">
            <div class="form-group">
              <label for="name">Department Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="currentDepartment.name"
                required
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="description">Description *</label>
              <textarea
                id="description"
                name="description"
                [(ngModel)]="currentDepartment.description"
                required
                rows="3"
                class="form-input"
              ></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="manager">Manager *</label>
                <input
                  type="text"
                  id="manager"
                  name="manager"
                  [(ngModel)]="currentDepartment.manager"
                  required
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label for="budget">Budget *</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  [(ngModel)]="currentDepartment.budget"
                  required
                  min="0"
                  class="form-input"
                >
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="!departmentForm.form.valid">
                {{editingDepartment ? 'Update' : 'Create'}}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Department List -->
      <div class="department-list">
        <div class="list-header">
          <span>{{departmentResult.totalItems}} department(s)</span>
          <span>Page {{departmentResult.currentPage}} of {{departmentResult.totalPages}}</span>
        </div>

        <div class="department-grid">
          <div class="department-card" *ngFor="let department of departmentResult.data">
            <div class="card-header">
              <h3>{{department.name}}</h3>
              <div class="card-actions">
                <button class="btn btn-sm btn-primary" (click)="editDepartment(department)">Edit</button>
                <button 
                  class="btn btn-sm btn-danger" 
                  (click)="deleteDepartment(department)"
                  [disabled]="department.employeeCount > 0"
                  [title]="department.employeeCount > 0 ? 'Cannot delete department with employees' : 'Delete department'"
                >
                  Delete
                </button>
              </div>
            </div>
            <div class="card-body">
              <p class="description">{{department.description}}</p>
              <div class="department-stats">
                <div class="stat">
                  <span class="stat-label">Manager:</span>
                  <span class="stat-value">{{department.manager}}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Budget:</span>
                  <span class="stat-value">{{formatCurrency(department.budget)}}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Employees:</span>
                  <span class="stat-value">{{department.employeeCount}}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Created:</span>
                  <span class="stat-value">{{formatDate(department.createdDate)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="departmentResult.totalPages > 1">
          <button
            class="btn btn-secondary"
            [disabled]="departmentResult.currentPage === 1"
            (click)="goToPage(departmentResult.currentPage - 1)"
          >
            Previous
          </button>
          
          <span class="page-numbers">
            <button
              *ngFor="let page of getPageNumbers()"
              class="btn btn-page"
              [ngClass]="{'active': page === departmentResult.currentPage}"
              (click)="goToPage(page)"
            >
              {{page}}
            </button>
          </span>
          
          <button
            class="btn btn-secondary"
            [disabled]="departmentResult.currentPage === departmentResult.totalPages"
            (click)="goToPage(departmentResult.currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .department-management {
      padding: 1rem;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 0;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .department-form {
      padding: 1rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      flex: 1;
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #333;
    }

    .form-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea.form-input {
      resize: vertical;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .department-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #eee;
      background-color: #f8f9fa;
    }

    .department-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }

    .department-card {
      border: 1px solid #dee2e6;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .department-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .card-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .card-body {
      padding: 1rem;
    }

    .description {
      margin-bottom: 1rem;
      color: #666;
      line-height: 1.5;
    }

    .department-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
      font-weight: bold;
    }

    .stat-value {
      font-size: 0.9rem;
      color: #333;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border-top: 1px solid #eee;
    }

    .page-numbers {
      display: flex;
      gap: 0.25rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    .btn-page {
      background-color: #f8f9fa;
      color: #495057;
      border: 1px solid #dee2e6;
      min-width: 40px;
    }

    .btn-page.active {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }

    .btn-page:hover:not(.active) {
      background-color: #e9ecef;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
      }

      .department-grid {
        grid-template-columns: 1fr;
      }

      .card-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .card-actions {
        align-self: stretch;
        justify-content: space-between;
      }

      .department-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DepartmentsComponent implements OnInit {
  departmentResult: PaginatedResult<Department> = {
    data: [],
    totalItems: 0,
    currentPage: 1,
    pageSize: 20,
    totalPages: 0
  };

  showAddForm = false;
  showEditForm = false;
  editingDepartment: Department | null = null;
  
  currentDepartment: Partial<Department> = this.getEmptyDepartment();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  getEmptyDepartment(): Partial<Department> {
    return {
      name: '',
      description: '',
      manager: '',
      budget: 0,
      employeeCount: 0
    };
  }

  loadDepartments(): void {
    this.departmentResult = this.dataService.getDepartmentsPaginated(
      this.departmentResult.currentPage,
      this.departmentResult.pageSize
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.departmentResult.totalPages) {
      this.departmentResult.currentPage = page;
      this.loadDepartments();
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.departmentResult.totalPages;
    const current = this.departmentResult.currentPage;
    const pages: number[] = [];
    
    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  editDepartment(department: Department): void {
    this.editingDepartment = department;
    this.currentDepartment = { ...department };
    this.showEditForm = true;
  }

  deleteDepartment(department: Department): void {
    if (department.employeeCount > 0) {
      alert('Cannot delete a department that has employees. Please reassign or remove employees first.');
      return;
    }

    if (confirm(`Are you sure you want to delete the ${department.name} department?`)) {
      try {
        this.dataService.deleteDepartment(department.id);
        this.loadDepartments();
      } catch (error: any) {
        alert(error.message);
      }
    }
  }

  saveDepartment(): void {
    if (this.editingDepartment) {
      this.dataService.updateDepartment(this.editingDepartment.id, this.currentDepartment);
    } else {
      this.dataService.createDepartment(this.currentDepartment as Omit<Department, 'id' | 'createdDate' | 'updatedDate'>);
    }
    this.closeForm();
    this.loadDepartments();
  }

  closeForm(): void {
    this.showAddForm = false;
    this.showEditForm = false;
    this.editingDepartment = null;
    this.currentDepartment = this.getEmptyDepartment();
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