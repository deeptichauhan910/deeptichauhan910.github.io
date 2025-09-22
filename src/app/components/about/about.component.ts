import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="page-content">
      <h1>About Us</h1>
      <p>Learn more about our organization and mission.</p>
      <div class="about-details">
        <h2>Our Mission</h2>
        <p>To provide efficient management solutions for modern organizations.</p>
        <h2>Our Vision</h2>
        <p>To be the leading provider of comprehensive management systems.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content {
      padding: 1rem;
    }
    h1, h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    .about-details {
      margin-top: 2rem;
    }
  `]
})
export class AboutComponent {}