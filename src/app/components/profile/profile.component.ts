import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Employee, Department } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  employee: Employee | null = null;
  department: Department | null = null;
  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const employeeId = params['id'];
      this.loadEmployee(employeeId);
    });
  }

  loadEmployee(id: string): void {
    this.loading = true;
    this.notFound = false;
    
    const foundEmployee = this.dataService.getEmployeeById(id);
    this.employee = foundEmployee || null;
    
    if (this.employee) {
      const foundDepartment = this.dataService.getDepartmentById(this.employee.departmentId);
      this.department = foundDepartment || null;
      this.loading = false;
    } else {
      this.notFound = true;
      this.loading = false;
    }
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate(['/Employees'], { 
        queryParams: { edit: this.employee.id } 
      });
    }
  }

  deleteEmployee(): void {
    if (this.employee && confirm(`Are you sure you want to delete ${this.employee.firstName} ${this.employee.lastName}?`)) {
      this.dataService.deleteEmployee(this.employee.id);
      this.router.navigate(['/Employees']);
    }
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

  getYearsOfService(): number {
    if (!this.employee) return 0;
    const hireDate = new Date(this.employee.hireDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - hireDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  }
}