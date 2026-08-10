import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../../../../_services/shared.service';
import { CategoriesService } from '../../../../../../_services/categories.service';
import { Category } from '../../../../../../_models/categories.model';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css'],
  standalone: false
})
export class CategoriesFormComponent implements OnInit {

  categoryForm!: FormGroup; // Changed from 'any' to specific type
  editData!: Category;
  isLoadingToggle = false;

  constructor(
    private fb: FormBuilder, // Injected FormBuilder
    private sharedService: SharedService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<CategoriesFormComponent>
  ) {}

  ngOnInit(): void {
    // 1. Initialize the Form
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      active: [true]
    });

    // 2. Check if we are in "Edit Mode" (via Router ID or injected editData)
    // If you pass data via Dialog, ensure you set this.editData before ngOnInit runs
    // If via Router:
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      // Fetch data by ID if needed, or if you already have the object, patch it
      this.getCategoryById(routeId);
    } else if (this.editData) {
      // Valid if opened via Dialog and data was passed directly
      this.categoryForm.patchValue(this.editData);
    }
  }

  // Helper to centralize patching
  private patchFormValues(data: any) {
    this.categoryForm.patchValue({
      name: data.name,
      description: data.description,
      active: (data.active !== undefined) ? data.active : true
    });
  }

  // Optional: Helper to fetch data if opening via URL /categories/edit/123
  getCategoryById(id: string) {
    this.categoriesService.getCategoryById(id).subscribe({
      next: (res) => {
        // 1. Extract the actual data object.
        // Adjust 'res.payload.data' if your API structure is different (e.g. just 'res')
        const data = res.payload?.data || res;

        // 2. Save it to 'editData' so we have the _id for the update request later
        this.editData = data;

        // 3. Fill the form fields
        this.patchFormValues(data);
      },
      error: (err) => {
        console.error('Error fetching category', err);
        this.sharedService.showToast('danger', 'Σφάλμα', 'Δεν βρέθηκε η κατηγορία');
        this.onCancel(); // Go back if error
      }
    });
  }

  toggleActivity(event: any) {
    // We just let the form control update itself.
    // You can keep this function for manual logging or side effects,
    // or remove the (change) binding from the HTML entirely.
    console.log('New status in form:', event.checked);
  }

  /** Handle Cancel Button */
  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  /** Handle Reset/Clear */
  resetForm() {
    if (this.editData) {
      this.patchFormValues(this.editData);
    } else {
      this.categoryForm.reset({ active: true });
    }
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.sharedService.showToast('danger', 'Σφάλμα', 'Συμπληρώστε όλα τα πεδία');
      return;
    }

    // 1. Prepare Payload WITHOUT 'active'
    const mainPayload = {
      name: this.categoryForm.get('name')?.value,
      description: this.categoryForm.get('description')?.value
    };

    const formActiveState = this.categoryForm.get('active')?.value;

    // ✅ FIX: Capture the ID in a local variable
    const categoryId = this.editData?._id;

    if (categoryId) {
      // ============================================
      // CASE A: EDIT EXISTING
      // ============================================

      // Use 'categoryId' here instead of 'this.editData._id'
      this.categoriesService.editCategory(categoryId, mainPayload).subscribe({
        next: (res) => {

          // Check if we need to flip the status
          // We can safe-access this.editData.active because we know we are editing
          if (formActiveState !== this.editData.active) {

            // Use 'categoryId' here again (It is guaranteed to be a string)
            this.categoriesService.toggleCategory(categoryId).subscribe({
              next: () => {
                this.sharedService.showToast('primary', 'Επιτυχία', 'Η κατηγορία και η κατάσταση ενημερώθηκαν');
                this.closeOrNavigate(res);
              },
              error: () => {
                this.sharedService.showToast('warning', 'Προσοχή', 'Τα στοιχεία αποθηκεύτηκαν, αλλά η κατάσταση δεν άλλαξε.');
                this.closeOrNavigate(res);
              }
            });

          } else {
            this.sharedService.showToast('primary', 'Επιτυχία', 'Η κατηγορία ενημερώθηκε');
            this.closeOrNavigate(res);
          }
        },
        error: (err) => {
          this.sharedService.showToast('danger', 'Σφάλμα', err.error?.message || 'Αποτυχία ενημέρωσης');
        }
      });

    } else {
      // ============================================
      // CASE B: CREATE NEW
      // ============================================

      this.categoriesService.createCategory(mainPayload).subscribe({
        next: (res) => {
          // Get the new ID safely
          const newId = res.payload?.data?._id || res.payload?._id || res._id;

          // If User wants it INACTIVE, we must flip it immediately
          if (formActiveState === false && newId) {

            this.categoriesService.toggleCategory(newId).subscribe({
              next: () => {
                this.sharedService.showToast('primary', 'Επιτυχία', 'Η κατηγορία δημιουργήθηκε και απενεργοποιήθηκε');
                this.closeOrNavigate(res);
              },
              error: () => {
                this.sharedService.showToast('warning', 'Προσοχή', 'Η κατηγορία δημιουργήθηκε αλλά παρέμεινε Ενεργή');
                this.closeOrNavigate(res);
              }
            });

          } else {
            this.sharedService.showToast('primary', 'Επιτυχία', 'Η κατηγορία δημιουργήθηκε επιτυχώς');
            this.closeOrNavigate(res);
          }
        },
        error: (err) => {
          this.sharedService.showToast('danger', 'Σφάλμα', err.error?.message || 'Αποτυχία δημιουργίας');
        }
      });
    }
  }

  /** Helper to determine where to go after success */
  private closeOrNavigate(result: any) {
    if (this.dialogRef) {
      this.dialogRef.close({ updated: true, data: result });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
}
