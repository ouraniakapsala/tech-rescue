import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DonationsService } from '../../../../../../_services/donations.service';
import { AuthService } from '../../../../../../auth/_services/auth.service'; // <--- ΠΡΟΣΘΗΚΗ: AuthService
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-donations-list',
  templateUrl: './donations-list.component.html',
  styleUrls: ['./donations-list.component.css'],
  standalone: false
})
export class DonationsListComponent implements OnInit {
  private donationsService = inject(DonationsService);
  private authService = inject(AuthService); // <--- ΠΡΟΣΘΗΚΗ: Inject το AuthService
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  donations: any[] = [];
  isLoading = true;

  // Stats
  totalItems = 0;
  activeCount = 0;
  pendingCount = 0;
  deletedCount = 0;

  // Pagination
  pageSize = 10;
  currentPage = 1;

  // Το ID του συνδεδεμένου Παραγωγού
  currentUserId: string | null = null;

  ngOnInit(): void {
    // Διαβάζουμε το ID του συνδεδεμένου χρήστη
    const user = this.authService.currentUserValue;
    this.currentUserId = user?._id || user?.id || user?.userId || null;

    this.loadDonations();
  }

  loadDonations(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page;

    this.donationsService.getAllDonations(page).subscribe({
      next: (res: any) => {
        let allData = res.payload?.data?.data || [];

        // ==========================================
        // ΦΙΛΤΡΑΡΙΣΜΑ: Κρατάμε ΜΟΝΟ τις δωρεές αυτού του Παραγωγού
        // ==========================================
        if (this.currentUserId) {
          allData = allData.filter((d: any) => d.producer && d.producer._id === this.currentUserId);
        }

        this.donations = allData;

        // Υπολογισμός Stats ΜΟΝΟ για τις δικές του δωρεές
        this.totalItems = this.donations.length;
        this.activeCount = this.donations.filter((d: any) => !d.delete && d.status).length;
        this.pendingCount = this.donations.filter((d: any) => !d.delete && !d.status).length;
        this.deletedCount = this.donations.filter((d: any) => d.delete).length;

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  getStatusClass(element: any): string {
    if (element.delete) return 'deleted';
    if (!element.status || !element.status.name) return 'pending';

    const name = element.status.name.toLowerCase();

    if (name.includes('transit')) return 'transit';
    if (name.includes('ready')) return 'ready';
    if (name.includes('completed') || name.includes('delivered')) return 'completed';

    return 'pending';
  }

  onPageChange(event: any) {
    this.loadDonations(event.pageIndex + 1);
  }

  editDonation(id: string) {
    this.router.navigate(['/producer/donations/edit', id]);
  }

  deleteDonation(id: string) {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη δωρεά;')) {
      this.donationsService.deleteDonation(id).subscribe({
        next: () => {
          this.snackBar.open('Η δωρεά διαγράφηκε', 'OK', { duration: 3000 });
          this.loadDonations(this.currentPage);
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Σφάλμα κατά τη διαγραφή', 'OK', { duration: 3000 });
        }
      });
    }
  }

  restoreDonation(id: string) {
    if (confirm('Θέλετε να επαναφέρετε τη συγκεκριμένη δωρεά;')) {
      this.donationsService.restoreDonation(id, {}).subscribe({
        next: () => {
          this.snackBar.open('Η δωρεά επαναφέρθηκε επιτυχώς!', 'OK', { duration: 3000 });
          this.loadDonations(this.currentPage);
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Σφάλμα κατά την επαναφορά', 'OK', { duration: 3000 });
        }
      });
    }
  }

  getShortId(id: string): string {
    if (!id) return '';
    return id.slice(-6).toUpperCase();
  }
}
