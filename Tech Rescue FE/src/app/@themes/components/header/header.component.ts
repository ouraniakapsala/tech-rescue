import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/_services/auth.service'; // Adjust path

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {

  userData: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Get user data from AuthService (or LocalStorage)
    // Assuming you implemented the 'currentUserValue' we discussed earlier
    this.userData = this.authService.currentUserValue;

    // Fallback if service doesn't have it yet (e.g., page refresh)
    if (!this.userData) {
      const token = this.authService.getToken();
      if (token) {
        try {
          // Decode token manually if needed
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.userData = payload;
        } catch (e) { console.error(e); }
      }
    }
  }

  // --- THE LOGIC YOU ASKED FOR ---
  get profileLink(): string {
    const role = this.userData?.role;

    if (role === 'admin') {
      return '/admin/profile';
    }
    else if (role === 'producer') {
      return '/producer/profile';
    }
    else if (role === 'entity') {
      return '/entity/profile';
    }
    else {
      return '/'; // Default fallback
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goHome() {
    // Optional: Redirect to the dashboard based on role
    const role = this.userData?.role;
    if (role === 'admin') this.router.navigate(['/admin/overview']);
    else if (role === 'producer') this.router.navigate(['/producer/overview']);
    else if (role === 'entity') this.router.navigate(['/entity/overview']);
    else this.router.navigate(['/']);
  }
}
