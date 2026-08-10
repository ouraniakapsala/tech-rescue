import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DonationsService } from '../../../../../../_services/donations.service';
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

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page; // Αποθήκευση τρέχουσας σελίδας

    this.donationsService.getAllDonations(page).subscribe({
      next: (res: any) => {
        const data = res.payload?.data?.data || [];
        this.donations = data;

        // Υπολογισμός Stats
        this.totalItems = res.payload?.animalCount || data.length;
        this.activeCount = data.filter((d: any) => !d.delete && d.status).length;
        this.pendingCount = data.filter((d: any) => !d.delete && !d.status).length;
        this.deletedCount = data.filter((d: any) => d.delete).length;

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

  onPageChange(event: any) {
    this.loadDonations(event.pageIndex + 1);
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

  getShortId(id: string): string {
    if (!id) return '';
    return id.slice(-6).toUpperCase();
  }
}
