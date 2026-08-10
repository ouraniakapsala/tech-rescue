import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ProducersService } from '../../../../../_services/producers.service';
import { AdministratorsService } from '../../../../../_services/administrators.service'; // Προσθήκη
import { EntitiesService } from '../../../../../_services/entities.service'; // Αν υπάρχει τέτοιο service
import { AuthService } from '../../../../../auth/_services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css'],
  standalone: false
})
export class AdminOverviewComponent implements OnInit {
  private producersService = inject(ProducersService);
  private adminService = inject(AdministratorsService); // Inject για τους Admins
  private entitiesService = inject(EntitiesService); // Inject για τους Φορείς
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  today: Date = new Date();
  isLoading = false;

  // Μεταβλητές για τα Cards
  producersCount = 0;
  entitiesCount = 0;
  adminsCount = 0;
  pendingCount = 3;

  recentActivity: any[] = [];
  adminName: string = 'Διαχειριστής';

  ngOnInit(): void {
    this.setAdminName();
    this.loadDashboardData();
  }

  setAdminName() {
    const user = this.authService.currentUserValue;
    if (user) {
      this.adminName = user.fullName || user.firstName || 'Admin';
    }
  }

  loadDashboardData() {
    this.isLoading = true;

    // Τραβάμε και τα 3 APIs ταυτόχρονα
    forkJoin({
      producers: this.producersService.getAllProducers(),
      entities: this.entitiesService.getAllEntities(), // Κλήση για Φορείς
      admins: this.adminService.getAllAdministrators() // Κλήση για Admins
    }).subscribe({
      next: (res: any) => {
        // 1. Παραγωγοί
        const producers = res.producers?.payload?.data?.users || [];
        this.producersCount = producers.length;

        // 2. Φορείς (Entities)
        const entities = res.entities?.payload?.data?.users || [];
        this.entitiesCount = entities.length;

        // 3. Διαχειριστές (Admins)
        const admins = res.admins?.payload?.data?.users || [];
        this.adminsCount = admins.length;

        // 4. Πρόσφατη Δραστηριότητα (π.χ. οι τελευταίοι 4 χρήστες)
        const allRecent = [...producers].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.recentActivity = allRecent.slice(0, 4).map((p: any) => ({
          title: p.fullName || p.email,
          desc: 'Νέα εγγραφή στο σύστημα.',
          date: this.formatTimeAgo(p.createdAt),
          icon: 'person_add',
          colorClass: 'icon-green'
        }));

        this.isLoading = false;
        this.cd.detectChanges(); // Ενημέρωση του UI
      },
      error: (err: any) => {
        console.error('Dashboard Data Error:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

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
