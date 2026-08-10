import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DonationsService } from '../../../../../_services/donations.service';
import { AuthService } from '../../../../../auth/_services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-entity-overview',
  templateUrl: './entity-overview.component.html',
  styleUrls: ['./entity-overview.component.css'],
  standalone: false
})
export class EntityOverviewComponent implements OnInit {

  entityName: string = '';
  entityEmail: string = '';
  today: Date = new Date();
  isLoading = true;

  stats = {
    receivedDonations: 0,
    pendingPickups: 0,
    totalItemsImpact: 0,
    newAvailable: 0
  };

  // ΝΕΑ ΜΕΤΑΒΛΗΤΗ: Εδώ θα κρατάμε τις πρόσφατες δωρεές μας
  recentDonations: any[] = [];

  constructor(
    private donationsService: DonationsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.entityName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Φορέας';
    this.entityEmail = user?.email || 'Μη διαθέσιμο email';

    this.loadDynamicStats();
  }
  viewDonation(donationId: string): void {
    if (donationId) {
      this.router.navigate(['/entity/donations', donationId]);

    }
  }

  loadDynamicStats() {
    this.donationsService.getAllDonations().subscribe({
      next: (res: any) => {
        let data = [];
        const payload = res?.payload;

        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          data = payload.data.data;
        } else if (payload?.data && Array.isArray(payload.data)) {
          data = payload.data;
        }

        const currentUserId = this.authService.currentUserValue?._id;

        let received = 0, pending = 0, itemsImpact = 0, available = 0;
        let myDonations: any[] = []; // Προσωρινός πίνακας για να μαζέψουμε τις δικές μας

        data.forEach((donation: any) => {
          if (!donation.delete) {
            if (!donation.entity) {
              available++;
            } else {
              const donationEntityId = typeof donation.entity === 'object' ? donation.entity._id : donation.entity;

              if (donationEntityId === currentUserId || !currentUserId) {
                // Τη βρήκαμε! Τη βάζουμε στη λίστα μας
                myDonations.push(donation);

                const statusName = donation.status?.name?.toLowerCase() || '';
                if (statusName.includes('completed') || statusName.includes('delivered') || statusName.includes('ολοκληρώθηκε')) {
                  received++;
                } else {
                  pending++;
                }

                if (donation.items && Array.isArray(donation.items)) {
                  itemsImpact += donation.items.length;
                }
              }
            }
          }
        });

        // Ενημερώνουμε τα στατιστικά
        this.stats.receivedDonations = received;
        this.stats.pendingPickups = pending;
        this.stats.totalItemsImpact = itemsImpact;
        this.stats.newAvailable = available;

        // ΝΕΟ: Ταξινομούμε τις δωρεές μας (πιο πρόσφατες πρώτα) και κρατάμε τις 4 πρώτες
        myDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.recentDonations = myDonations.slice(0, 4);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης στατιστικών:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
