import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ProducersService } from '../../../../../../_services/producers.service'; // Βεβαιώσου για το path

@Component({
  selector: 'app-producers-list',
  templateUrl: './producers-list.component.html',
  styleUrls: ['./producers-list.component.css'],
  standalone: false
})
export class ProducersListComponent implements OnInit {

  producers: any[] = [];
  paginatedProducers: any[] = []; // Η λίστα που εμφανίζεται στην τρέχουσα σελίδα

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

  constructor(
    private producersService: ProducersService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducers();
  }

  loadProducers() {
    this.producersService.getAllProducers().subscribe({
      next: (response: any) => {
        if (response?.payload?.data) {
          this.producers = response.payload.data.users || [];
          this.refreshTable();

          // Επιβάλλει στην Angular να δει το "5" αντί για το "2" τώρα αμέσως
          this.cd.detectChanges();
        }
      }
    });
  }

  // Κεντρική συνάρτηση που καλεί όλους τους υπολογισμούς
  refreshTable() {
    this.calculateStats();
    this.sortProducers();
    this.updatePaginatedList(); // Αυτό φτιάχνει το paginatedProducers
    this.cd.detectChanges();    // Ενημέρωση UI
  }

  calculateStats() {
    this.totalCount = this.producers.length;
    // Based on your JSON: active: true/false and delete: true/false
    this.activeCount = this.producers.filter(p => p.active === true && p.delete === false).length;
    this.inactiveCount = this.producers.filter(p => p.active === false && p.delete === false).length;
    this.deletedCount = this.producers.filter(p => p.delete === true).length;
  }

  sortProducers() {
    this.producers.sort((a, b) => {
      // 1. Deleted items to the bottom
      const deleteSort = Number(a.delete || false) - Number(b.delete || false);
      if (deleteSort !== 0) return deleteSort;

      // 2. Alphabetical by fullName (matching your API)
      const nameA = a.fullName || '';
      const nameB = b.fullName || '';
      return nameA.localeCompare(nameB);
    });
  }

  updatePaginatedList() {
    this.totalItems = this.producers.length;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // Κόβουμε τον πίνακα για την τρέχουσα σελίδα
    this.paginatedProducers = this.producers.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedList();
  }

  // --- Actions ---

  goToCreate() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  goToEdit(id: string) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteProducer(id: string) {
    if(confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον παραγωγό;')) {
      this.producersService.deleteProducer(id).subscribe({
        next: () => {
          // Τοπική ενημέρωση (Soft Delete)
          const item = this.producers.find(p => p._id === id);
          if (item) {
            item.delete = true;
            item.active = false; // Συνήθως το κάνουμε και inactive
            this.refreshTable();
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  // Αν υποστηρίζεται Restore από το API
  restoreProducer(id: string) {
    // Αν δεν υπάρχει μέθοδος restore στο service, μπορείς να καλέσεις updateProducer({ delete: false })
    // Εδώ υποθέτω ότι υπάρχει ή το χειρίζεσαι παρόμοια
    const item = this.producers.find(p => p._id === id);
    if (item) {
      item.delete = false;
      this.refreshTable();
      this.producersService.restoreProducer(id).subscribe({
        next: () => {
          this.refreshTable();
        }
      })
    }
  }
}
