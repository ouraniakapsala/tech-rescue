import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TypesService } from '../../../../../../_services/types.service';
import { CategoriesService } from '../../../../../../_services/categories.service';
import { SharedService } from '../../../../../../_services/shared.service';

@Component({
  selector: 'app-types-form',
  templateUrl: './types-form.component.html',
  styleUrls: ['./types-form.component.css'],
  standalone: false
})
export class TypesFormComponent implements OnInit {

  typeForm!: FormGroup;
  editData!: any;
  categories: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private typesService: TypesService,
    private categoriesService: CategoriesService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Initialize Form
    this.typeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required], // ID string
      active: [true]
    });

    // 2. Load Categories
    this.loadCategories();

  }

  loadCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        // Παίρνουμε όλα τα δεδομένα
        const allCategories = res.payload?.data?.categories || res.payload?.data || [];

        // ΦΙΛΤΡΑΡΙΣΜΑ: Κρατάμε ΜΟΝΟ όσες είναι active και όχι deleted
        this.categories = allCategories.filter((cat: any) =>
          cat.active === true && cat.delete === false
        );

        console.log('Filtered Categories:', this.categories);

        // 3. Check for Edit Mode
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.loadType(id);
        }
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadType(id: string) {
    this.typesService.getTypeById(id).subscribe({
      next: (res) => {
        const data = res.payload?.data || res;
        this.editData = data;

        // Patch values (Handle category object -> ID)
        this.typeForm.patchValue({
          name: data.name,
          description: data.description,
          category: data.category?._id || data.category, // Handle populated object
          active: data.active
        });
      },
      error: () => this.navigateBack()
    });
  }

  onSubmit() {
    if (this.typeForm.invalid) return;
    this.isLoading = true;

    // Payload (no active)
    const payload = {
      name: this.typeForm.get('name')?.value,
      description: this.typeForm.get('description')?.value,
      category: this.typeForm.get('category')?.value
    };

    const formActive = this.typeForm.get('active')?.value;

    if (this.editData) {
      // UPDATE
      this.typesService.updateType(this.editData._id, payload).subscribe({
        next: () => {
          if (this.editData.active !== formActive) {
            this.typesService.toggleTypeActivity(this.editData._id).subscribe(() => this.navigateBack());
          } else {
            this.navigateBack();
          }
        },
        error: () => { this.isLoading = false; }
      });
    } else {
      // CREATE
      this.typesService.createType(payload).subscribe({
        next: (res) => {
          const newId = res.payload?.data?._id || res._id;
          if (formActive === false && newId) {
            this.typesService.toggleTypeActivity(newId).subscribe(() => this.navigateBack());
          } else {
            this.navigateBack();
          }
        },
        error: () => { this.isLoading = false; }
      });
    }
  }

  onCancel() { this.navigateBack(); }

  navigateBack() {
    this.isLoading = false;
    if (this.editData) this.router.navigate(['../../'], { relativeTo: this.route });
    else this.router.navigate(['../'], { relativeTo: this.route });
  }

  resetForm() {
    if (this.editData) {
      this.typeForm.patchValue({
        name: this.editData.name,
        description: this.editData.description,
        category: this.editData.category?._id || this.editData.category,
        active: this.editData.active
      });
    } else {
      this.typeForm.reset({ active: true });
    }
  }
}
