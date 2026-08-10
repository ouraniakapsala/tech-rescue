import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { StatusesService } from '../../../../../../_services/statuses.service';
// import { SharedService } from ... (If needed for toasts)

@Component({
  selector: 'app-statuses-list',
  templateUrl: './statuses-list.component.html',
  styleUrls: ['./statuses-list.component.css'],
  standalone: false
})
export class StatusesListComponent implements OnInit {

  statuses: any[] = [];
  paginatedStatuses: any[] = [];

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
    private statusesService: StatusesService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses() {
    this.statusesService.getAllStatuses().subscribe({
      next: (res) => {
        // Adjust this path if your API wraps data differently
        this.statuses = res.payload?.data?.data || [];
        this.refreshTable();
      },
      error: (err) => console.error(err)
    });
  }

  refreshTable() {
    this.calculateStats();
    this.sortStatuses();
    this.updatePaginatedList();
    this.cd.detectChanges(); // ✅ Force UI update
  }

  calculateStats() {
    this.deletedCount = this.statuses.filter(s => s.delete === true).length;

    const validItems = this.statuses.filter(s => !s.delete);
    this.totalCount = validItems.length;
    this.activeCount = validItems.filter(s => s.active === true).length;
    this.inactiveCount = validItems.filter(s => s.active === false).length;
  }

  sortStatuses() {
    this.statuses.sort((a, b) => {
      const deleteSort = Number(a.delete || false) - Number(b.delete || false);
      if (deleteSort !== 0) return deleteSort;
      return (a.name || '').localeCompare(b.name || '');
    });
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    // ✅ ADD THIS LINE to tell the template how many items exist
    this.totalItems = this.statuses.length;

    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStatuses = this.statuses.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedList();
  }

  goToCreate() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  goToEdit(id: string) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteStatus(id: string) {
    if(confirm('Διαγραφή κατάστασης;')) {
      this.statusesService.deleteStatus(id).subscribe({
        next: () => {
          // 1. Find the item in the local list
          const item = this.statuses.find(s => s._id === id);

          if (item) {
            // 2. Mark it as deleted locally
            item.delete = true;

            // 3. Refresh the table immediately
            this.refreshTable();
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  restoreStatus(id: string) {
    this.statusesService.restoreStatus(id).subscribe({
      next: () => {
        const item = this.statuses.find(s => s._id === id);
        if (item) {
          item.delete = false;
          this.refreshTable();
        }
      },
      error: (err) => console.error(err)
    });
  }
}
