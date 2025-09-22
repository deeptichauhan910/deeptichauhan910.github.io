import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="container">
      <header>
        <div class="header-top">
          <div class="title" id="header-title">{{ getPageTitle() }}</div>
          <button class="btn btn-reset" (click)="resetStorage()" title="Reset all data">
            🔄 Reset
          </button>
        </div>
        <nav>
          <ul>
            <li><a routerLink="/Home" routerLinkActive="active">Home</a></li>
            <li><a routerLink="/About" routerLinkActive="active">About</a></li>
            <li><a routerLink="/Employees" routerLinkActive="active">Employees</a></li>
            <li><a routerLink="/Departments" routerLinkActive="active">Departments</a></li>
          </ul>
        </nav>
      </header>

      <aside class="sidebar">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#hr">Human Resource</a></li>
          <li><a href="#finance">Finance</a></li>
        </ul>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .container {
      display: grid;
      grid-template-areas: 
        "header header"
        "sidebar main";
      grid-template-columns: 250px 1fr;
      grid-template-rows: auto 1fr;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
    }

    header {
      grid-area: header;
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .title {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .btn-reset {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }

    .btn-reset:hover {
      background-color: #c0392b;
    }

    nav {
      background-color: #34495e;
      padding: 0.5rem;
    }

    nav ul {
      list-style: none;
      display: flex;
      gap: 1rem;
    }

    nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    nav a:hover {
      background-color: #3498db;
    }

    nav a.active {
      background-color: #3498db;
    }

    .sidebar {
      grid-area: sidebar;
      background-color: #ecf0f1;
      padding: 1rem;
      border-right: 1px solid #bdc3c7;
    }

    .sidebar h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .sidebar ul {
      list-style: none;
    }

    .sidebar li {
      margin-bottom: 0.5rem;
    }

    .sidebar a {
      color: #2c3e50;
      text-decoration: none;
      padding: 0.5rem;
      display: block;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .sidebar a:hover {
      background-color: #d5dbdb;
    }

    .main-content {
      grid-area: main;
      padding: 2rem;
      background-color: white;
      margin: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .container {
        grid-template-areas: 
          "header"
          "main";
        grid-template-columns: 1fr;
      }

      .sidebar {
        display: none;
      }

      nav ul {
        flex-direction: column;
        gap: 0.5rem;
      }

      .header-top {
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }
    }
  `]
})
export class AppComponent {
  constructor(private router: Router, private dataService: DataService) {}

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('/Home')) return 'Home';
    if (url.includes('/About')) return 'About';
    if (url.includes('/Employees')) return 'Employee Management';
    if (url.includes('/Departments')) return 'Department Management';
    return 'Home';
  }

  resetStorage(): void {
    if (confirm('Are you sure you want to reset all data? This will delete all employees and departments and restore sample data. This action cannot be undone.')) {
      // Clear all management system data from localStorage
      localStorage.removeItem('management_departments');
      localStorage.removeItem('management_employees');
      localStorage.removeItem('management_data_initialized');
      
      // Refresh the page to reinitialize with sample data
      window.location.reload();
    }
  }
}