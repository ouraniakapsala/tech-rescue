import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProducersService } from '../../../../../../_services/producers.service';
import { TypesService } from '../../../../../../_services/types.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-producers-form',
  templateUrl: './producers-form.component.html',
  styleUrls: ['./producers-form.component.css'],
  standalone: false
})
export class ProducersFormComponent implements OnInit {
  producerForm!: FormGroup;
  isEditMode = false;
  producerId: string | null = null;
  deletedLocationIds: string[] = [];
  hidePassword = true;
  selectedTabIndex = 0;
  isLoading = false;

  restoredLocationIds: string[] = [];
  showDeletedLocations = false;
  availableItems: any[] = [];
  savedProductIds: string[] = [];


  groupedProducts: { categoryName: string, products: any[] }[] = []; // ΝΕΟ


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private producersService: ProducersService,
    private typesService: TypesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAvailableItems();

    this.route.paramMap.subscribe(params => {
      this.producerId = params.get('id');
      if (this.producerId) {
        this.isEditMode = true;
        this.loadProducerData(this.producerId);

        this.producerForm.get('password')?.clearValidators();
        this.producerForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  compareProducts(id1: any, id2: any): boolean {
    return id1 && id2 ? String(id1) === String(id2) : id1 === id2;
  }

  loadAvailableItems() {
    this.typesService.getAllTypes().subscribe({
      next: (res) => {
        const allItems = res.payload?.data?.items || res.items || [];

        setTimeout(() => {
          this.availableItems = allItems.filter((item: any) =>
            item.active === true && item.delete === false
          );

          // ΝΕΟ: Καλούμε τη συνάρτηση ομαδοποίησης εδώ!
          this.groupProducts();

          if (this.savedProductIds.length > 0) {
            this.producerForm.get('products')?.setValue([...this.savedProductIds]);
          }

          this.cd.detectChanges();
        });
      },
      error: (err) => console.error('Σφάλμα φόρτωσης ειδών:', err)
    });
  }

  initForm() {
    this.producerForm = this.fb.group({
      role: ['producer'],
      active: [true],
      fullName: ['', Validators.required],
      contactPerson: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      country: ['Greece'],
      city: [''],
      zipCode: [''],
      description: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [this.passwordMatchValidator ]],
      products: [[]],
    });

    this.producerForm.get('password')?.valueChanges.subscribe(() => {
      this.producerForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.producerForm.addControl('transporter', this.fb.group({
      own: [false],
      name: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }]
    }));

    this.producerForm.addControl('location', this.fb.array([]));
    this.setupTransporterListener();
  }

  setupTransporterListener() {
    const transporterGroup = this.producerForm.get('transporter') as FormGroup;
    transporterGroup.get('own')?.valueChanges.subscribe(isOwn => {
      if (isOwn) {
        transporterGroup.get('name')?.enable();
        transporterGroup.get('name')?.setValidators(Validators.required);
        transporterGroup.get('phone')?.enable();
      } else {
        transporterGroup.get('name')?.disable();
        transporterGroup.get('name')?.clearValidators();
        transporterGroup.get('phone')?.disable();
        transporterGroup.get('name')?.reset();
        transporterGroup.get('phone')?.reset();
      }
      transporterGroup.get('name')?.updateValueAndValidity();
    });
  }

  get locationControls() {
    return (this.producerForm.get('location') as FormArray).controls;
  }

  addLocation(data?: any) {
    const locGroup = this.fb.group({
      _id: [data?._id || null],
      delete: [data?.delete || false],
      active: [data?.active ?? true],
      main: [data?.main ?? false],
      locationName: [data?.locationName?.trim() || '', Validators.required],
      contactName: [data?.contactName?.trim() || ''],
      contactPhone: [data?.contactPhone?.trim() || ''],
      country: [data?.country?.trim() || 'Greece'],
      city: [data?.city?.trim() || ''],
      address: [data?.address?.trim() || '', Validators.required],
      zipCode: [data?.zipCode?.trim() || ''],
      lat: [data?.lat || null],
      lng: [data?.lng || null],
      description: [data?.description?.trim() || '']
    });

    (this.producerForm.get('location') as FormArray).push(locGroup);
  }

  removeLocation(index: number) {
    const locGroup = this.locationControls[index];
    const locId = locGroup.get('_id')?.value;

    if (locId) {
      locGroup.get('delete')?.setValue(true);
      this.restoredLocationIds = this.restoredLocationIds.filter(id => id !== locId);

      if (!this.deletedLocationIds.includes(locId)) {
        this.deletedLocationIds.push(locId);
      }
      this.showDeletedLocations = true;
    } else {
      (this.producerForm.get('location') as FormArray).removeAt(index);
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    if (!control.parent) return null;

    const password = control.parent.get('password')?.value;
    const confirm = control.value;

    // Αν υπάρχει password και δεν ταιριάζει με την επιβεβαίωση, βγάζει error
    if (password && password !== confirm) {
      return { mismatch: true };
    }
    return null;
  }

  loadProducerData(id: string) {
    this.isLoading = true;

    this.producersService.getProducerById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        let data = res.payload?.data;
        if (data && data.users && Array.isArray(data.users)) {
          data = data.users[0];
        } else if (res.payload?.data) {
          data = res.payload.data;
        }

        if (!data) return;

        // --- Locations ---
        const locationArray = this.producerForm.get('location') as FormArray;
        locationArray.clear();

        if (data.location && Array.isArray(data.location)) {
          data.location.forEach((loc: any) => this.addLocation(loc));
        }

        // --- Transporter ---
        if (data.transporter?.own) {
          const transporterGroup = this.producerForm.get('transporter') as FormGroup;
          transporterGroup.get('name')?.enable();
          transporterGroup.get('phone')?.enable();
        }

        // --- Products ---
        this.savedProductIds = [];
        const incomingProducts = data.product || data.products || [];
        if (incomingProducts && Array.isArray(incomingProducts)) {
          // Παίρνουμε τα _id και τα κάνουμε String
          this.savedProductIds = incomingProducts.map((p: any) => p._id ? String(p._id) : String(p));
        }

        setTimeout(() => {
          this.producerForm.patchValue({
            ...data,
            location: data.location || [],
            products: this.savedProductIds
          });
          this.cd.detectChanges();
        });

      },
      error: (err) => {
        this.isLoading = false;
        console.error('Σφάλμα φόρτωσης:', err);
      }
    });
  }

  cleanObject(obj: any): any {
    const clean = JSON.parse(JSON.stringify(obj, (key, value) => typeof value === 'string' ? value.trim() : value));
    Object.keys(clean).forEach(key => {
      if (key === 'transporter' || key === 'products') return;
      if (clean[key] === "" || clean[key] === null || clean[key] === undefined) {
        delete clean[key];
      }
    });
    return clean;
  }

  onSubmit() {
    if (this.producerForm.invalid) {
      this.producerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const rawData = this.producerForm.getRawValue();

    if (this.isEditMode && this.producerId) {
      const requests: Observable<any>[] = [];

      // ==========================================
      // 1. ΕΛΕΓΧΟΣ: Βασικά Στοιχεία
      // ==========================================
      const basicFields = ['active', 'fullName', 'contactPerson', 'email', 'phone', 'country', 'city', 'zipCode', 'description'];
      const isBasicDirty = basicFields.some(field => this.producerForm.get(field)?.dirty);
      const hasNewPassword = !!rawData.password;

      if (isBasicDirty || hasNewPassword) {
        const {location, transporter, confirmPassword, password, role, products, ...basicStuff} = rawData;
        const basicPayload = this.cleanObject(basicStuff);
        if (password) basicPayload.password = password;

        requests.push(this.producersService.updateProducer(this.producerId, basicPayload).pipe(catchError(err => of({error: true}))));
      }

      // ==========================================
      // 2. ΕΛΕΓΧΟΣ: Μεταφορέας
      // ==========================================
      if (this.producerForm.get('transporter')?.dirty) {
        const transporterPayload = {
          own: !!rawData.transporter?.own,
          name: rawData.transporter?.own ? (rawData.transporter.name || "") : null,
          phone: rawData.transporter?.own ? (rawData.transporter.phone || "") : null
        };
        requests.push(this.producersService.updateTransporter(this.producerId, transporterPayload).pipe(catchError(err => of({error: true}))));
      }

      // ==========================================
      // 3. ΕΛΕΓΧΟΣ: Προϊόντα
      // ==========================================
      if (this.producerForm.get('products')?.dirty) {
        const productsPayload = {products: rawData.products || []};
        requests.push(this.producersService.updateUserProducts(this.producerId, productsPayload).pipe(catchError(err => of({error: true}))));
      }

      // ==========================================
      // 4. ΕΛΕΓΧΟΣ: Τοποθεσίες
      // ==========================================
      const locationArray = this.producerForm.get('location') as FormArray;
      locationArray.controls.forEach((locCtrl) => {
        const locValue = locCtrl.getRawValue();
        if (locValue.delete) return;

        const {_id, delete: deleteField, ...restOfLoc} = locValue;
        const strictLoc = this.cleanObject(restOfLoc);

        if (_id) {
          if (locCtrl.dirty) {
            requests.push(this.producersService.updateLocation(_id, strictLoc).pipe(catchError(e => of({error: true}))));
          }
        } else {
          requests.push(this.producersService.addLocation(this.producerId!, strictLoc).pipe(catchError(e => of({error: true}))));
        }
      });

      // Διαγραφές & Επαναφορές
      this.deletedLocationIds.forEach(locId => {
        requests.push(this.producersService.deleteLocation(locId).pipe(catchError(e => of({error: true}))));
      });

      this.restoredLocationIds.forEach(locId => {
        requests.push(this.producersService.restoreLocation(locId).pipe(catchError(e => of({error: true}))));
      });

      // ==========================================
      // 5. ΕΚΤΕΛΕΣΗ
      // ==========================================
      if (requests.length === 0) {
        this.isLoading = false;
        this.router.navigate(['/admin/producers']);
        return;
      }

      forkJoin(requests).subscribe({
        next: (results) => {
          this.isLoading = false;
          const hasErrors = results.some(res => res && res.error === true);

          if (hasErrors) {
            alert('Προσοχή: Κάποια στοιχεία δεν αποθηκεύτηκαν. Ελέγξτε την Κονσόλα (F12).');
          } else {
            this.router.navigate(['/admin/producers']);
          }
        }
      });

    } else {
      // ------------------------------------------
      // CREATE MODE LOGIC
      // ------------------------------------------
      const productsToSave = rawData.products || []; // Κρατάμε τα προϊόντα που διάλεξε

      const createData = this.cleanObject(rawData);
      delete createData.confirmPassword;
      delete createData.location;
      delete createData.products;
      delete createData.product;

      // ΟΡΙΖΟΥΜΕ ΤΟ TRANSPORTER PAYLOAD ΕΔΩ ΓΙΑ ΤΟ CREATE
      const transporterPayload = {
        own: !!rawData.transporter?.own,
        name: rawData.transporter?.own ? (rawData.transporter.name || "") : null,
        phone: rawData.transporter?.own ? (rawData.transporter.phone || "") : null
      };

      createData.transporter = transporterPayload;

      // ΒΗΜΑ 1: Φτιάχνουμε τον χρήστη
      this.producersService.createProducer(createData).subscribe({
        next: () => {

          if (productsToSave.length === 0) {
            this.isLoading = false;
            this.router.navigate(['/admin/producers']);
            return;
          }

          // ΒΗΜΑ 2: Ψάχνουμε το ID του νέου χρήστη
          this.producersService.getAllProducers().subscribe({
            next: (producersRes) => {
              const usersList = producersRes.payload?.data?.users || producersRes.data?.users || producersRes.users || [];
              const newlyCreatedUser = usersList.find((u: any) => u.email === createData.email);

              if (newlyCreatedUser && newlyCreatedUser._id) {
                // ΒΗΜΑ 3: Του βάζουμε τα προϊόντα
                this.producersService.updateUserProducts(newlyCreatedUser._id, {products: productsToSave}).subscribe({
                  next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/admin/producers']);
                  },
                  error: (err) => {
                    this.isLoading = false;
                    console.error('Σφάλμα αποθήκευσης προϊόντων:', err);
                    alert('Ο παραγωγός φτιάχτηκε, αλλά τα προϊόντα δεν μπόρεσαν να αποθηκευτούν.');
                    this.router.navigate(['/admin/producers']);
                  }
                });
              } else {
                this.isLoading = false;
                alert('Ο παραγωγός δημιουργήθηκε επιτυχώς, αλλά τα προϊόντα πρέπει να προστεθούν από την Επεξεργασία.');
                this.router.navigate(['/admin/producers']);
              }
            },
            error: (err) => {
              this.isLoading = false;
              this.router.navigate(['/admin/producers']);
            }
          });

        },
        error: (err) => {
          this.isLoading = false;
          console.error('Create error:', err);
          alert('Σφάλμα κατά τη δημιουργία.');
        }
      });
    }
  }

  // --- UI Helpers ---
  get isBasicInfoValid(): boolean {
    const fields = ['fullName', 'contactPerson', 'email'];
    return fields.every(field => this.producerForm.get(field)?.valid);
  }

  get isSecurityValid(): boolean {
    const passControl = this.producerForm.get('password');
    const confirmControl = this.producerForm.get('confirmPassword');

    if (this.isEditMode && !passControl?.value && !confirmControl?.value) {
      return true;
    }
    return !!(
      passControl?.valid &&                         // Ο πρώτος κωδικός να περνάει το minLength(6)
      confirmControl?.valid &&                      // Να μην χτυπάει το mismatch
      passControl?.value &&                         // Να μην είναι άδειο το πρώτο πεδίο
      passControl?.value === confirmControl?.value  // Να είναι ολόιδια τα δύο πεδία
    );
  }

  moveToNextTab() {
    if (this.selectedTabIndex === 0 && !this.isBasicInfoValid) {
      this.producerForm.markAllAsTouched();
      // alert('Παρακαλώ συμπληρώστε όλα τα βασικά στοιχεία.');
      return;
    }
    if (this.selectedTabIndex === 1 && !this.isSecurityValid) {
      this.producerForm.markAllAsTouched();
      // alert('Παρακαλώ ορίστε έναν έγκυρο κωδικό πρόσβασης.');
      return;
    }
    if (this.selectedTabIndex < 4) {
      this.selectedTabIndex++;
    }
  }

  moveBackTab() {
    if (this.selectedTabIndex > 0) this.selectedTabIndex--;
  }

  get activeLocationsCount(): number {
    return this.locationControls.filter(c => !c.get('delete')?.value).length;
  }

  get deletedLocationsCount(): number {
    return this.locationControls.filter(c => c.get('delete')?.value).length;
  }

  toggleDeletedLocations() {
    this.showDeletedLocations = !this.showDeletedLocations;
  }



  restoreLocation(index: number) {
    const locGroup = this.locationControls[index];
    const locId = locGroup.get('_id')?.value;

    if (locId) {
      locGroup.get('delete')?.setValue(false);

      if (this.deletedLocationIds.includes(locId)) {
        this.deletedLocationIds = this.deletedLocationIds.filter(id => id !== locId);
      } else {
        if (!this.restoredLocationIds.includes(locId)) {
          this.restoredLocationIds.push(locId);
        }
      }
    }
  }

  groupProducts() {
    const groups = new Map<string, any[]>();

    this.availableItems.forEach(product => {
      // Βρίσκουμε το όνομα της κατηγορίας (αν δεν έχει, το βάζουμε στα "Λοιπά")
      const catName = product.category?.name || 'Λοιπά / Χωρίς Κατηγορία';

      if (!groups.has(catName)) {
        groups.set(catName, []);
      }
      groups.get(catName)?.push(product);
    });

    // Μετατρέπουμε το Map στον πίνακα που χρειάζεται το HTML
    this.groupedProducts = Array.from(groups.keys()).map(catName => {
      return {
        categoryName: catName,
        products: groups.get(catName) || []
      };
    });
  }
}
