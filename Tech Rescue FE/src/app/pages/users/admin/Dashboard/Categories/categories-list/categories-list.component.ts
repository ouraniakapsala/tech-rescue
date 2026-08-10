import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../../../_services/categories.service';
import { ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-categories',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
  standalone: false
})
export class CategoriesListComponent implements OnInit {

  categories: any[] = [];
  showForm = false;
  paginatedCategories: any[] = [];

  totalCount = 0;
  activeCount = 0;
  inactiveCount = 0;
  deletedCount = 0; // Using this as the 4th box since we track deletions


  // Pagination Settings
  totalItems = 0;
  pageSize = 10;       // Items per page
  pageIndex = 0;      // Current page (starts at 0)
  pageSizeOptions = [5, 10, 25, 100];


  constructor(private categoriesService: CategoriesService,
              private cd: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              ) {}

  ngOnInit() {
    this.loadCategories();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedList();
  }

  // Slices the master array to show only current page items
  updatePaginatedList() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategories = this.categories.slice(startIndex, endIndex);
  }

  calculateStats() {
    // 1. Deleted Items (Trash)
    this.deletedCount = this.categories.filter(c => c.delete === true).length;

    // 2. Valid Items (Not deleted)
    const validItems = this.categories.filter(c => c.delete === false || c.delete === null);

    // Total Valid Categories (Excluding deleted)
    this.totalCount = validItems.length;

    // 3. Active (Not deleted AND active is true)
    this.activeCount = validItems.filter(c => c.active === true).length;

    // 4. Inactive (Not deleted AND active is false)
    this.inactiveCount = validItems.filter(c => c.active === false).length;
  }

  /** Load categories from API */
  loadCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: res => {
        this.categories = res.payload?.data?.categories || [];
        console.log('Loaded categories:', this.categories);
        // 1. Update the total count for the paginator UI
        this.totalItems = this.categories.length;

        this.calculateStats(); // <--- Update Stats
        this.sortCategories();
        this.categories = [...this.categories];
        this.cd.detectChanges();
      },
      error: err => console.error('Error loading categories', err)
    });
  }

  /** Toggle form visibility */
  toggleForm() {
    this.showForm = !this.showForm;
  }

  goToCreate(){
    this.router.navigate(['create'], {relativeTo: this.route}
    )
  }

  goToEdit(id: string) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  deleteCategory(id: string) {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κατηγορία;')) {
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          // Find item and mark as deleted locally to update UI immediately
          const cat = this.categories.find(c => c._id === id);
          if (cat) {
            cat.delete = true;
            this.calculateStats();
            this.sortCategories();
          }
          this.cd.detectChanges();
        },
        error: err => alert('Σφάλμα κατά τη διαγραφή')
      });
    }
  }

  /** Restore Category */
  restoreCategory(id: string) {
    this.categoriesService.restoreCategory(id).subscribe({
      next: (res) => {

        console.log('Restore response:', res);

        const cat = this.categories.find(c => c._id === id);
        if (cat) {
          cat.delete = false;
          this.calculateStats();
          this.sortCategories();
        }
        this.cd.detectChanges();
      },
      error: err => {
        console.error('Restore Error:', err);
        // Only show alert if Status is NOT 200
        if (err.status !== 200) {
          alert('Σφάλμα κατά την επαναφορά');
        } else {
          // Sometimes Angular parses simple text responses as errors if it expects JSON
          // If we get here with status 200, treat it as success
          const cat = this.categories.find(c => c._id === id);
          if (cat) {
            cat.delete = false;
            this.sortCategories();
          }
          this.cd.detectChanges();
        }
      }
    });
  }

  sortCategories() {
    this.categories.sort((a, b) => {
      // 1. Deleted go to bottom
      const deleteSort = Number(a.delete || false) - Number(b.delete || false);
      if (deleteSort !== 0) return deleteSort;

      // 2. Inactive go below Active
      // (active: true) = 1, (active: false) = 0. We want 1 before 0, so b - a
      const activeSort = Number(b.active || false) - Number(a.active || false);
      if (activeSort !== 0) return activeSort;

      // 3. Alphabetical
      return a.name.localeCompare(b.name);
    });

    // Every time you sort or modify the master list,
    //     // you must refresh the "sliced" view for the current page.
    this.updatePaginatedList();
  }


  protected readonly onsubmit = onsubmit;
}
