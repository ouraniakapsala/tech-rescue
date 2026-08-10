import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusesService } from '../../../../../../_services/statuses.service';
import { SharedService } from '../../../../../../_services/shared.service';

@Component({
  selector: 'app-statuses-form',
  templateUrl: './statuses-form.component.html',
  styleUrls: ['./statuses-form.component.css'],
  standalone: false
})
export class StatusesFormComponent implements OnInit {

  statusForm!: FormGroup;
  editData!: any;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private statusesService: StatusesService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Initialize Form with Name, Description, Note, and Active
    this.statusForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      note: [''], // Optional field based on your payload
      active: [true] // Default to true
    });

    // 2. Check for Edit Mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStatus(id);
    }
  }

  loadStatus(id: string) {
    this.statusesService.getStatusById(id).subscribe({
      next: (res) => {
        // Adjust depending on if your API returns { payload: { data: ... } } or direct object
        const data = res.payload?.data || res;
        this.editData = data;

        // Patch values into form
        this.statusForm.patchValue({
          name: data.name,
          description: data.description,
          note: data.note,
          active: data.active
        });
      },
      error: () => {
        this.sharedService.showToast('danger', 'Error', 'Could not load status');
        this.navigateBack();
      }
    });
  }

  onSubmit() {
    if (this.statusForm.invalid) return;
    this.isLoading = true;

    // Prepare Payload (Exclude 'active' to avoid 422 error, handled separately)
    const payload = {
      name: this.statusForm.get('name')?.value,
      description: this.statusForm.get('description')?.value,
      note: this.statusForm.get('note')?.value
    };

    const formActiveValue = this.statusForm.get('active')?.value;

    if (this.editData) {
      // --- UPDATE MODE ---
      this.statusesService.updateStatus(this.editData._id, payload).subscribe({
        next: (res) => {
          // Check if active state changed
          if (this.editData.active !== formActiveValue) {
            this.toggleActiveState(this.editData._id, () => this.navigateBack());
          } else {
            this.sharedService.showToast('success', 'Success', 'Status updated');
            this.navigateBack();
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.sharedService.showToast('danger', 'Error', 'Update failed');
        }
      });

    } else {
      // --- CREATE MODE ---
      this.statusesService.createStatus(payload).subscribe({
        next: (res) => {
          const newId = res.payload?.data?._id || res._id;

          // If user set it to INACTIVE during create, we must toggle it now
          // (Assuming default creation is Active=true on backend)
          if (formActiveValue === false && newId) {
            this.toggleActiveState(newId, () => this.navigateBack());
          } else {
            this.sharedService.showToast('success', 'Success', 'Status created');
            this.navigateBack();
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.sharedService.showToast('danger', 'Error', 'Creation failed');
        }
      });
    }
  }

  // Helper to toggle active state via API
  toggleActiveState(id: string, callback: () => void) {
    this.statusesService.toggleStatusActivity(id).subscribe({
      next: () => {
        this.sharedService.showToast('success', 'Success', 'Saved successfully');
        callback();
      },
      error: () => {
        // Even if toggle fails, we might want to go back or warn
        this.sharedService.showToast('warning', 'Warning', 'Saved, but failed to update status active state');
        callback();
      }
    });
  }

  onCancel() {
    this.navigateBack();
  }

  // Navigation Logic to handle Create (1 level) vs Edit (2 levels)
  navigateBack() {
    this.isLoading = false;
    if (this.editData) {
      this.router.navigate(['../../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  resetForm() {
    if (this.editData) {
      this.statusForm.patchValue({
        name: this.editData.name,
        description: this.editData.description,
        note: this.editData.note,
        active: this.editData.active
      });
    } else {
      this.statusForm.reset({ active: true });
    }
  }
}
