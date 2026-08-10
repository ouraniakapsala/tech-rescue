import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { FormatsService } from '../../../../../../_services/formats.service';
// Ensure you have a SharedService for toasts if you want them here, or use alerts
// import { SharedService } from '...';

@Component({
  selector: 'app-formats-list',
  templateUrl: './formats-list.component.html',
  styleUrls: ['./formats-list.component.css'], // You can reuse categories.component.css or create a new one
  standalone: false
})
export class FormatsListComponent implements OnInit {

  formats: any[] = [];
  paginatedFormats: any[] = [];

  // Stats
  totalCount = 0;
  activeCount = 0;
  inactiveCount = 0;
  deletedCount = 0;

  // Pagination
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];

  constructor(
    private formatsService: FormatsService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadFormats();
  }

  loadFormats() {
    this.formatsService.getAllFormats().subscribe({
      next: (res) => {
        // Based on your JSON: payload -> data -> data (Array)
        this.formats = res.payload?.data?.data || [];

        this.totalItems = this.formats.length;
        this.calculateStats();
        this.sortFormats();
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error loading formats', err)
    });
  }

  calculateStats() {
    // 1. Deleted
    this.deletedCount = this.formats.filter(f => f.delete === true).length;

    // 2. Valid (Not deleted)
    const validItems = this.formats.filter(f => f.delete === false || f.delete == null);
    this.totalCount = validItems.length;

    // 3. Active
    this.activeCount = validItems.filter(f => f.active === true).length;

    // 4. Inactive
    this.inactiveCount = validItems.filter(f => f.active === false).length;
  }

  sortFormats() {
    this.formats.sort((a, b) => {
      // Deleted at bottom
      const deleteSort = Number(a.delete || false) - Number(b.delete || false);
      if (deleteSort !== 0) return deleteSort;

      // Active on top
      const activeSort = Number(b.active || false) - Number(a.active || false);
      if (activeSort !== 0) return activeSort;

      // Alphabetical by Name
      return (a.name || '').localeCompare(b.name || '');
    });

    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFormats = this.formats.slice(startIndex, endIndex);
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

  deleteFormat(id: string) {
    if(confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το κουτί;')) {
      this.formatsService.deleteFormat(id).subscribe({
        next: () => {
          const item = this.formats.find(f => f._id === id);
          if (item) item.delete = true;
          this.calculateStats();
          this.sortFormats();
        },
        error: (err) => alert('Σφάλμα κατά τη διαγραφή')
      });
    }
  }

  restoreFormat(id: string) {
    this.formatsService.restoreFormat(id).subscribe({
      next: () => {
        const item = this.formats.find(f => f._id === id);
        if (item) item.delete = false;
        this.calculateStats();
        this.sortFormats();
      },
      error: (err) => console.error(err)
    });
  }
}
