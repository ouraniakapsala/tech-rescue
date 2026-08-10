import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../../../auth/_services/auth.service';
import { ProducersService } from '../../../../../_services/producers.service';
import { DonationsService } from '../../../../../_services/donations.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-producer-overview',
  templateUrl: './producer-overview.component.html',
  styleUrls: ['./producer-overview.component.css'],
  standalone: false
})
export class ProducerOverviewComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private donationsService: DonationsService,
    private cd: ChangeDetectorRef,
    private producersService: ProducersService,
  ) {}

  today: Date = new Date();
  isLoading = false;

  producerName: string = '';
  producerEmail: string = '';
  currentUserId: string | null = null;

  stats = {
    activeOrders: 0,
    pendingDeliveries: 0,
    totalStock: 0,
    activeLocations: 0
  };

  // Αλλάζουμε το όνομα σε recentActivity για να ταιριάζει με το Admin
  recentActivity: any[] = [];

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.currentUserId = user._id || user.id || user.userId;
      this.producerName = user.fullName || user.firstName || 'Παραγωγός';
      this.producerEmail = user.email || '';
    }

    this.loadDashboardData();
  }

  loadDashboardData() {
    if (!this.currentUserId) return;
    this.isLoading = true;

    forkJoin({
      profile: this.producersService.getProducerById(this.currentUserId),
      donations: this.donationsService.getAllDonations()
    }).subscribe({
      next: (res: any) => {
        // --- Υπολογισμός Τοποθεσιών ---
        const profileData = res.profile?.payload?.data || res.profile?.data || res.profile;
        if (profileData && profileData.location) {
          this.stats.activeLocations = profileData.location.filter((l: any) => !l.delete && l.active).length;
        }

        // --- Υπολογισμός Στατιστικών Δωρεών ---
        const allDonations = res.donations?.payload?.data?.data || res.donations?.payload?.data || res.donations || [];
        const activeDonations = allDonations.filter((d: any) => !d.delete);

        this.stats.activeOrders = activeDonations.length;
        this.stats.pendingDeliveries = activeDonations.filter((d: any) =>
          !d.status || d.status?.name?.toLowerCase().includes('εκκρεμεί') || d.status?.name?.toLowerCase().includes('transit')
        ).length;

        let stockCount = 0;
        activeDonations.forEach((d: any) => {
          if (d.items && Array.isArray(d.items)) {
            stockCount += d.items.length;
          }
        });
        this.stats.totalStock = stockCount;

        // --- Πρόσφατες Δωρεές (Μετατροπή σε Activity Feed Format) ---
        const latestDonations = activeDonations
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        this.recentActivity = latestDonations.map((d: any) => ({
          _id: d._id, // Το κρατάμε για το routerLink
          title: d.entity?.fullName || 'Σε αναμονή παραλήπτη',
          desc: `Κατάσταση: ${d.status?.name || 'Εκκρεμεί'}`,
          date: this.formatTimeAgo(d.createdAt),
          icon: 'receipt_long',
          // Βάζουμε ένα background χρώμα ανάλογα αν έχει βρεθεί φορέας ή όχι
          colorClass: d.entity ? 'bg-green' : 'bg-orange'
        }));

        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης δεδομένων Dashboard:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  // Προσθήκη της μεθόδου formatTimeAgo από το Admin
  formatTimeAgo(dateString: string) {
    if (!dateString) return 'Πρόσφατα';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Πριν από λίγο';
    if (diffInHours < 24) return `${diffInHours} ώρες πριν`;
    return `${Math.floor(diffInHours / 24)} ημέρες πριν`;
  }
}
