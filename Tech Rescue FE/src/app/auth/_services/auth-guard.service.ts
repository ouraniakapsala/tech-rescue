import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'; // Πρόσθεσε αυτά
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // Προσθέτουμε τα ορίσματα route και state
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.isAuthenticated().pipe(
      take(1),
      map(isAuth => {
        // 1. Έλεγχος αν είναι συνδεδεμένος
        if (!isAuth) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        // 2. Παίρνουμε τον ρόλο του χρήστη
        const userRole = this.authService.getRole(); // π.χ. 'producer'

        // 3. Παίρνουμε τους επιτρεπτούς ρόλους από το Route Data
        // (Θα το ορίσουμε στο app.routes.ts)
        const expectedRoles = route.data['roles'] as Array<string>;

        if (expectedRoles) {
          // Αν το route απαιτεί ρόλους και ο χρήστης δεν τον έχει -> Block
          // Ελέγχουμε αν το userRole υπάρχει μέσα στο expectedRoles array
          if (!expectedRoles.includes(userRole || '')) {
            console.warn(`Access Denied: User role '${userRole}' is not in expected roles:`, expectedRoles);

            // Προαιρετικά: Αν είναι producer και προσπαθεί να μπει admin, στείλτον στο dashboard του
            if (userRole === 'producer') {
              this.router.navigate(['/producer']);
            }
            if (userRole === 'entity') {
              this.router.navigate(['/entity']);
            }
            else {
              this.router.navigate(['/auth/login']);
            }
            return false;
          }
        }

        // Αν φτάσαμε εδώ, όλα καλά!
        return true;
      })
    );
  }
}
