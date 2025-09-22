import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="page-content">
      <h1>Welcome to Home Page</h1>
      <p>This is the home page of our management system. Use the navigation above to explore different sections.</p>
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
  `]
})
export class HomeComponent {}