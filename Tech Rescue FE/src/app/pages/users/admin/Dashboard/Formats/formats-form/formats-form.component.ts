import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../../../../../_services/shared.service'; // Adjust path
import { FormatsService } from '../../../../../../_services/formats.service'; // Adjust path

@Component({
  selector: 'app-formats-form',
  templateUrl: './formats-form.component.html',
  styleUrls: ['./formats-form.component.css'],
  standalone: false
})
export class FormatsFormComponent implements OnInit {

  formatForm!: FormGroup;
  editData!: any; // Holds the format object being edited
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private formatsService: FormatsService,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<FormatsFormComponent>
  ) {}

  ngOnInit(): void {
    // 1. Initialize Form with Nested Size Group
    this.formatForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      size: this.fb.group({
        height: [null, [Validators.required, Validators.min(1)]],
        width: [null, [Validators.required, Validators.min(1)]],
        depth: [null, [Validators.required, Validators.min(1)]]
      }),
      active: [true] // Default to true
    });

    // 2. Check for Edit Mode
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.getFormatById(routeId);
    } else if (this.editData) {
      this.patchFormValues(this.editData);
    }
  }

  private patchFormValues(data: any) {
    this.formatForm.patchValue({
      name: data.name,
      description: data.description,
      size: {
        height: data.size?.height,
        width: data.size?.width,
        depth: data.size?.depth
      },
      active: (data.active !== undefined) ? data.active : true
    });
  }

  getFormatById(id: string) {
    this.formatsService.getFormatById(id).subscribe({
      next: (res) => {
        const data = res.payload?.data || res;
        this.editData = data;
        this.patchFormValues(data);
      },
      error: (err) => {
        console.error(err);
        this.sharedService.showToast('danger', 'Σφάλμα', 'Δεν βρέθηκε το κουτί');
        this.onCancel();
      }
    });
  }

  onCancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  resetForm() {
    if (this.editData) {
      this.patchFormValues(this.editData);
    } else {
      this.formatForm.reset({ active: true });
    }
  }

  onSubmit() {
    if (this.formatForm.invalid) {
      this.sharedService.showToast('danger', 'Σφάλμα', 'Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }

    this.isLoading = true;

    // 1. Prepare Payload WITHOUT 'active' (To avoid 422 Error)
    const mainPayload = {
      name: this.formatForm.get('name')?.value,
      description: this.formatForm.get('description')?.value,
      size: this.formatForm.get('size')?.value // Contains {height, width, depth}
    };

    const formActiveState = this.formatForm.get('active')?.value;
    const formatId = this.editData?._id; // Capture ID safely

    // --- CASE A: EDIT ---
    if (formatId) {
      this.formatsService.updateFormat(formatId, mainPayload).subscribe({
        next: (res) => {
          // Check if we need to flip the status
          if (formActiveState !== this.editData.active) {
            this.formatsService.toggleFormatStatus(formatId).subscribe({
              next: () => {
                this.sharedService.showToast('primary', 'Επιτυχία', 'Το κουτί ενημερώθηκε πλήρως');
                this.closeOrNavigate(res);
              },
              error: () => {
                this.sharedService.showToast('warning', 'Προσοχή', 'Αποθηκεύτηκε, αλλά η κατάσταση δεν άλλαξε.');
                this.closeOrNavigate(res);
              }
            });
          } else {
            this.sharedService.showToast('primary', 'Επιτυχία', 'Το κουτί ενημερώθηκε');
            this.closeOrNavigate(res);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.sharedService.showToast('danger', 'Σφάλμα', 'Αποτυχία ενημέρωσης');
        }
      });
    }
    // --- CASE B: CREATE ---
    else {
      this.formatsService.createFormat(mainPayload).subscribe({
        next: (res) => {
          const newId = res.payload?.data?._id || res.payload?._id || res._id;

          // If User wants INACTIVE, flip it (assuming default is Active)
          if (formActiveState === false && newId) {
            this.formatsService.toggleFormatStatus(newId).subscribe({
              next: () => {
                this.sharedService.showToast('primary', 'Επιτυχία', 'Το κουτί δημιουργήθηκε και απενεργοποιήθηκε');
                this.closeOrNavigate(res);
              },
              error: () => {
                this.sharedService.showToast('warning', 'Προσοχή', 'Δημιουργήθηκε αλλά παρέμεινε Ενεργό');
                this.closeOrNavigate(res);
              }
            });
          } else {
            this.sharedService.showToast('primary', 'Επιτυχία', 'Το κουτί δημιουργήθηκε');
            this.closeOrNavigate(res);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.sharedService.showToast('danger', 'Σφάλμα', 'Αποτυχία δημιουργίας');
        }
      });
    }
  }

  private closeOrNavigate(result: any) {
    this.isLoading = false;

    if (this.dialogRef) {
      this.dialogRef.close({ updated: true, data: result });
    } else {
      // ✅ FIX: Check if we are Editing or Creating

      if (this.editData?._id) {
        // EDIT MODE: We are at 'edit/:id' (2 levels deep)
        // So we go back 2 levels to return to the list
        this.router.navigate(['../../'], { relativeTo: this.route });
      } else {
        // CREATE MODE: We are at 'create' (1 level deep)
        // So we go back only 1 level
        this.router.navigate(['../'], { relativeTo: this.route });
      }

    }
  }
}
