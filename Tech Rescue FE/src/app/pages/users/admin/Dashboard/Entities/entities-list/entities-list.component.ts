import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EntitiesService } from '../../../../../../_services/entities.service'; // Βεβαιώσου για το path

@Component({
  selector: 'app-entities-list',
  templateUrl: './entities-list.component.html',
  styleUrls: ['./entities-list.component.css'],
  standalone: false
})
export class EntitiesListComponent implements OnInit {

  entities: any[] = [];
  paginatedEntities: any[] = []; // Η λίστα που βλέπει ο χρήστης

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
    private entitiesService: EntitiesService,
    private cd: ChangeDetectorRef, // Κρίσιμο για την ενημέρωση του UI
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEntities();
  }

  loadEntities() {
    this.entitiesService.getAllEntities().subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Debugging

        // Έλεγχος δομής απάντησης (προσαρμοσμένο στο μοτίβο του Producer)
        // Αν το API επιστρέφει { payload: { data: { users: [...] } } }
        if (response?.payload?.data?.users) {
          this.entities = response.payload.data.users;
        }
        // Αν το API επιστρέφει απευθείας Array ή άλλη δομή
        else if (Array.isArray(response)) {
          this.entities = response;
        } else if (response.users) {
          this.entities = response.users;
        } else {
          this.entities = [];
        }

        // Αφού φορτώσουν τα δεδομένα, υπολογίζουμε τα πάντα
        this.refreshTable();
      },
      error: (err) => console.error('Error loading entities:', err)
    });
  }

  // Κεντρική συνάρτηση ενημέρωσης
  refreshTable() {
    this.calculateStats();
    this.sortEntities();
    this.updatePaginatedList();

    // Εξαναγκασμός ενημέρωσης του Angular UI
    this.cd.detectChanges();
  }

  calculateStats() {
    this.totalCount = this.entities.length;
    // Προσαρμογή στα boolean πεδία (active, delete)
    this.activeCount = this.entities.filter(e => e.active === true && !e.delete).length;
    this.inactiveCount = this.entities.filter(e => e.active === false && !e.delete).length;
    // Αν το delete έρχεται ως true/false ή ως 0/1
    this.deletedCount = this.entities.filter(e => e.delete === true).length;
  }

  sortEntities() {
    this.entities.sort((a, b) => {
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
    this.totalItems = this.entities.length;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    // "Κόβουμε" τον πίνακα για την τρέχουσα σελίδα (Client-side pagination)
    this.paginatedEntities = this.entities.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedList();
  }

  // --- Actions ---

  goToCreate() {
    // Χρησιμοποιούμε relative path όπως στο producers
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  goToEdit(id: string) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteEntity(id: string) {
    if(confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον φορέα;')) {
      this.entitiesService.deleteEntity(id).subscribe({
        next: () => {
          // Τοπική ενημέρωση (Soft Delete) για να μη χρειαστεί ξανά API call
          const item = this.entities.find(e => e._id === id);
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

  restoreEntity(id: string) {
    if(confirm('Θέλετε σίγουρα να επαναφέρετε αυτόν τον φορέα;')) {

      // Καλούμε το ΕΙΔΙΚΟ endpoint για το restore
      this.entitiesService.restoreEntity(id).subscribe({
        next: () => {
          // Αν πετύχει, ενημερώνουμε τοπικά τη λίστα
          const item = this.entities.find(e => e._id === id);
          if (item) {
            item.delete = false;
            // Συνήθως η επαναφορά τον κάνει αυτόματα και active, αλλιώς το βάζουμε εμείς
            item.active = true;
            this.refreshTable(); // Ξαναφτιάχνει τη λίστα!
            alert('Ο φορέας επαναφέρθηκε επιτυχώς!');
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
