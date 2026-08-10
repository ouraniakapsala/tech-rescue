import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { TypesService } from '../../../../../../_services/types.service';
// import { SharedService } from ...

@Component({
  selector: 'app-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.css'],
  standalone: false
})
export class TypesListComponent implements OnInit {

  types: any[] = [];
  paginatedTypes: any[] = [];

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
    private typesService: TypesService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes() {
    this.typesService.getAllTypes().subscribe({
      next: (res) => {
        // According to your JSON, it is payload.data.items
        this.types = res.payload?.data?.items || [];
        this.refreshTable();
      },
      error: (err) => console.error(err)
    });
  }

  refreshTable() {
    this.calculateStats();
    this.sortTypes();
    this.updatePaginatedList();
    this.cd.detectChanges();
  }

  calculateStats() {
    this.deletedCount = this.types.filter(t => t.delete === true).length;

    const validItems = this.types.filter(t => !t.delete);
    this.totalCount = validItems.length;
    this.activeCount = validItems.filter(t => t.active === true).length;
    this.inactiveCount = validItems.filter(t => t.active === false).length;
  }

  sortTypes() {
    this.types.sort((a, b) => {
      const deleteSort = Number(a.delete || false) - Number(b.delete || false);
      if (deleteSort !== 0) return deleteSort;
      return (a.name || '').localeCompare(b.name || '');
    });
  }

  updatePaginatedList() {
    this.totalItems = this.types.length;
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTypes = this.types.slice(startIndex, endIndex);
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

  deleteType(id: string) {
    if(confirm('Διαγραφή;')) {
      this.typesService.deleteType(id).subscribe({
        next: () => {
          const item = this.types.find(t => t._id === id);
          if (item) {
            item.delete = true;
            this.refreshTable();
          }
        }
      });
    }
  }

  restoreType(id: string) {
    this.typesService.restoreType(id).subscribe({
      next: () => {
        const item = this.types.find(t => t._id === id);
        if (item) {
          item.delete = false;
          this.refreshTable();
        }
      }
    });
  }
}
