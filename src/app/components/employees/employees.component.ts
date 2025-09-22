import { Component } from '@angular/core';

@Component({
  selector: 'app-employees',
  standalone: true,
  template: `
    <div class="page-content">
      <h1>Employee Management</h1>
      <p>Manage employee information, records, and operations.</p>
      <div class="employee-actions">
        <button class="btn btn-primary">Add Employee</button>
        <button class="btn btn-secondary">View All Employees</button>
        <button class="btn btn-secondary">Generate Reports</button>
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
    .employee-actions {
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
export class EmployeesComponent {}