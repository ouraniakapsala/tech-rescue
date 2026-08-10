import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Donation } from '../../../../../../_models/donation.model';
import { DonationsService } from '../../../../../../_services/donations.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-donations-details',
  templateUrl: './donations-details.component.html',
  styleUrls: ['./donations-details.component.css'],
  standalone: false
})
export class DonationsDetailsComponent implements OnInit {

  isLoading = true;
  fullDonationData: any = null;
  donationId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationsService: DonationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Παίρνουμε το ID από το URL (π.χ. /entity/donations/details/12345)
    this.donationId = this.route.snapshot.paramMap.get('id');

    if (this.donationId) {
      this.fetchFullDetails(this.donationId);
    } else {
      console.warn('Δεν βρέθηκε ID δωρεάς στο URL!');
      this.goBack();
    }
  }

  fetchFullDetails(id: string): void {
    this.donationsService.getDonationById(id).subscribe({
      next: (res: any) => {
        this.fullDonationData = res?.payload?.data || res?.data || res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης λεπτομερειών:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Αντικαθιστά το closeDialog()
  goBack(): void {
    this.router.navigate(['/entity/donations']); // Επιστροφή στη λίστα
  }

  get isReserved(): boolean {
    return !!(this.fullDonationData?.entity);
  }

  acceptDonation(): void {
    if (this.isReserved || !this.donationId) {
      return;
    }
    // Πλοήγηση στη σελίδα αποδοχής
    this.router.navigate(['/entity/donations/accept', this.donationId]);
  }

  // Προσθήκη για τον έλεγχο της ημερομηνίας λήξης
  getExpiryStatus(dateString: string): string {
    if (!dateString) return 'valid';
    const expDate = new Date(dateString);
    const today = new Date();

    // Υπολογισμός διαφοράς σε ημέρες
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'expiring-soon'; // 7 μέρες πριν τη λήξη
    return 'valid';
  }

}
