import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent implements OnInit, OnDestroy {
  user = { email: '', password: '' };
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  private themeLinkElement: HTMLLinkElement | null = null;

  constructor(private authService: AuthService,
              private router: Router,
              private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.themeLinkElement = document.createElement('link');
    this.themeLinkElement.rel = 'stylesheet';
    // this.themeLinkElement.href = 'assets/themes/azure-blue.css'; // relative to base href
    document.head.appendChild(this.themeLinkElement);
  }

  ngOnDestroy() {
    if (this.themeLinkElement) {
      document.head.removeChild(this.themeLinkElement);
      this.themeLinkElement = null;
    }
  }

  login(): void {
    this.submitted = true;
    this.errors = [];

    this.authService.login(this.user).subscribe({
      next: () => {
        // 1. Get the role
        const role = this.authService.getRole();
        console.log('DEBUG: Role detected for navigation:', role);

        // 2. Redirect based on role (Ensure you match the lowercased version)
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'producer') {
          // This will now hit the simplified route we fixed in Step 1
          this.router.navigate(['/producer']);
        } else if (role === 'entity') {
          this.router.navigate(['/entity/overview']);
        } else {
          console.warn('Unknown role:', role);
          this.errors = ['Unauthorized role'];
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errors = ['Λάθος email ή κωδικός πρόσβασης. Δοκιμάστε ξανά.'];
        this.submitted = false;
        this.cdr.detectChanges();

      }
    });
  }


// Ξεκινάει το "ταξίδι" όταν το ακουμπάει το ποντίκι
  triggerWander(event: MouseEvent): void {
    const el = event.target as HTMLElement;
    el.classList.add('wandering');
  }

  // Αφαιρεί την κλάση μόλις τελειώσει το animation, για να γυρίσει στο ήρεμο float
  resetWander(event: AnimationEvent): void {
    // Τώρα πιάνει όλα τα float-wide (1, 2, 3 και 4)
    if (event.animationName.includes('float-wide')) {
      const el = event.target as HTMLElement;
      el.classList.remove('wandering');
    }
  }

  goToLanding() {
    this.router.navigate(['/']); // Βάλε το path που αντιστοιχεί στο landing page σου
  }




}
