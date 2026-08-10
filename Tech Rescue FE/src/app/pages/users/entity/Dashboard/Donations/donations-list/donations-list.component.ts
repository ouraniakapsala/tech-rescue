import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { DonationsService } from '../../../../../../_services/donations.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DonationsDetailsComponent } from '../donations-details/donations-details.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {AuthService} from '../../../../../../auth/_services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-donations-list',
  templateUrl: './donations-list.component.html',
  styleUrls: ['./donations-list.component.css'],
  standalone: false
})
export class DonationsListComponent implements OnInit, OnDestroy {
  donations: any[] = [];
  isLoading: boolean = false;

  // Pagination & Stats
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  availableCount: number = 0;
  takenCount: number = 0;
  currentEntityId: string | null = null;

  private routerSub: Subscription | undefined;

  constructor(
    private donationsService: DonationsService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,

  ) {}

  ngOnInit(): void {

    const user = this.authService.currentUserValue;
    this.currentEntityId = user?._id || user?.id || user?.userId || null;

    this.fetchDonations();
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  fetchDonations(): void {
    this.donations = [];
    this.isLoading = true;

    this.donationsService.getAllDonations(this.currentPage).subscribe({
      next: (response) => {
        let itemsArray = [];
        const payload = response?.payload;

        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          itemsArray = payload.data.data;
        } else if (payload?.data && Array.isArray(payload.data)) {
          itemsArray = payload.data;
        }

        this.donations = itemsArray.map((d: any) => ({
          ...d,
          items: d.items || []
        }));

        this.totalItems = payload?.animalCount || this.donations.length;

        // Υπολογισμός Στατιστικών για τη συγκεκριμένη σελίδα/λίστα
        this.availableCount = this.donations.filter(d => !d.entity).length;
        this.takenCount = this.donations.filter(d => d.entity).length;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(donationId: string): void {
    if (confirm('Είστε σίγουροι ότι θέλετε να ακυρώσετε τη δέσμευση αυτής της δωρεάς;')) {
      this.isLoading = true;

      // Υποθέτουμε ότι το backend δέχεται update όπου στέλνεις entity: null
      // Ή αν υπάρχει ειδικό endpoint (π.χ. cancelDonation), πρέπει να το φτιάξεις στο service!
      const payload = { entity: null };

      this.donationsService.cancelDonation(donationId).subscribe({
        next: () => {
          this.snackBar.open('Η δωρεά ακυρώθηκε και είναι πλέον διαθέσιμη.', 'OK', { duration: 3000 });
          this.fetchDonations(); // Ξαναφορτώνουμε τη λίστα
        },
        error: (err) => {
          console.error('Σφάλμα κατά την ακύρωση:', err);
          this.isLoading = false;
          this.snackBar.open('Σφάλμα κατά την ακύρωση της δωρεάς.', 'OK', { duration: 3000 });
        }
      });
    }
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.fetchDonations();
  }

  onAccept(donationId: string): void {
    this.router.navigate(['/entity/donations/accept', donationId]);
  }

  openDetails(donation: any): void {
    this.router.navigate(['/entity/donations/details', donation._id]);
  }

  trackByFn(index: number, item: any): string {
    return item._id;
  }
}
