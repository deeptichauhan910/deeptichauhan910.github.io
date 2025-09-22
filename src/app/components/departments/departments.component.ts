import { Component } from '@angular/core';

@Component({
  selector: 'app-departments',
  standalone: true,
  template: `
    <div class="page-content">
      <h1>Department Management</h1>
      <p>Organize and manage different departments within the organization.</p>
      <div class="department-actions">
        <button class="btn btn-primary">Add Department</button>
        <button class="btn btn-secondary">View All Departments</button>
        <button class="btn btn-secondary">Department Budgets</button>
      </div>
    </div>
  `,
  styles: [`
    .page-content {
      padding: 1rem;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    .department-actions {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-primary {
      background-color: #3498db;
      color: white;
    }
    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }
    .btn:hover {
      opacity: 0.9;
    }
  `]
})
export class DepartmentsComponent {}