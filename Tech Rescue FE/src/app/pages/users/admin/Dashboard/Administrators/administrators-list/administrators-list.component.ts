import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdministratorsService } from '../../../../../../_services/administrators.service';

@Component({
  selector: 'app-administrators-list',
  templateUrl: './administrators-list.component.html',
  styleUrls: ['./administrators-list.component.css'],
  standalone: false
})
export class AdministratorsListComponent implements OnInit {

  administrators: any[] = [];
  paginatedAdministrators: any[] = []; // Η λίστα που βλέπει ο χρήστης

  // Στατιστικά
  totalCount = 0;
  activeCount = 0;
  inactiveCount = 0;
  deletedCount = 0;

  // Pagination Settings
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private administratorsService: AdministratorsService,
    private cd: ChangeDetectorRef, // Κρίσιμο για την ενημέρωση του UI
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadAdministrators();
  }

  loadAdministrators() {
    this.administratorsService.getAllAdministrators().subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Debugging

        // Έλεγχος δομής απάντησης
        if (response?.payload?.data?.users) {
          this.administrators = response.payload.data.users;
        } else if (Array.isArray(response)) {
          this.administrators = response;
        } else if (response.users) {
          this.administrators = response.users;
        } else {
          this.administrators = [];
        }

        // Αφού φορτώσουν τα δεδομένα, υπολογίζουμε τα πάντα
        this.refreshTable();
      },
      error: (err) => console.error('Error loading administrators:', err)
    });
  }

  // Κεντρική συνάρτηση ενημέρωσης
  refreshTable() {
    this.calculateStats();
    this.sortAdministrators();
    this.updatePaginatedList();

    // Εξαναγκασμός ενημέρωσης του Angular UI
    this.cd.detectChanges();
  }

  calculateStats() {
    this.totalCount = this.administrators.length;
    this.activeCount = this.administrators.filter(a => a.active === true && !a.delete).length;
    this.inactiveCount = this.administrators.filter(a => a.active === false && !a.delete).length;
    this.deletedCount = this.administrators.filter(a => a.delete === true).length;
  }

  sortAdministrators() {
    this.administrators.sort((a, b) => {
      // 1. Τα διεγραμμένα πάνε στο τέλος
      const deleteA = a.delete ? 1 : 0;
      const deleteB = b.delete ? 1 : 0;
      const deleteSort = deleteA - deleteB;

      if (deleteSort !== 0) return deleteSort;

      // 2. Αλφαβητική ταξινόμηση (fullName)
      const nameA = a.fullName || '';
      const nameB = b.fullName || '';
      return nameA.localeCompare(nameB);
    });
  }

  updatePaginatedList() {
    this.totalItems = this.administrators.length;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // "Κόβουμε" τον πίνακα για την τρέχουσα σελίδα (Client-side pagination)
    this.paginatedAdministrators = this.administrators.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedList();
  }

  // --- Actions ---

  goToCreate() {
    // Χρησιμοποιούμε relative path
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  goToEdit(id: string) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteAdmin(id: string) {
    if(confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον διαχειριστή;')) {
      this.administratorsService.deleteAdministrator(id).subscribe({
        next: () => {
          // Τοπική ενημέρωση (Soft Delete) για να μη χρειαστεί ξανά API call
          const item = this.administrators.find(a => a._id === id);
          if (item) {
            item.delete = true;
            item.active = false;
            this.refreshTable();
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  restoreAdmin(id: string) {
    if(confirm('Θέλετε σίγουρα να επαναφέρετε αυτόν τον διαχειριστή;')) {
      // Καλούμε το ΕΙΔΙΚΟ endpoint για το restore
      this.administratorsService.restoreAdministrator(id).subscribe({
        next: () => {
          // Αν πετύχει, ενημερώνουμε τοπικά τη λίστα
          const item = this.administrators.find(a => a._id === id);
          if (item) {
            item.delete = false;
            // Συνήθως η επαναφορά τον κάνει αυτόματα και active, αλλιώς το βάζουμε εμείς
            item.active = true;
            this.refreshTable(); // Ξαναφτιάχνει τη λίστα!
            // alert('Ο διαχειριστής επαναφέρθηκε επιτυχώς!'); // Προαιρετικό
          }
        },
        error: (err) => {
          console.error('Σφάλμα κατά την επαναφορά:', err);
          alert('Απέτυχε η επαναφορά. Δες την κονσόλα.');
        }
      });
    }
  }
}
