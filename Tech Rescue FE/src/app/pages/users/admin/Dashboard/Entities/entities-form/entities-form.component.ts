import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, AbstractControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EntitiesService } from '../../../../../../_services/entities.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Component({
  selector: 'app-entities-form',
  templateUrl: './entities-form.component.html',
  styleUrls: ['./entities-form.component.css'],
  standalone: false
})
export class EntitiesFormComponent implements OnInit {
  entityForm!: FormGroup;
  isLoading = false;
  entityId: string | null = null;
  deletedLocationIds: string[] = [];
  isEditMode = false;
  selectedTabIndex = 0;
  hidePassword = true;


  restoredLocationIds: string[] = [];
  showDeletedLocations = false;

  constructor(
    private fb: FormBuilder,
    private entityService: EntitiesService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.entityId = id;

      // Αφαιρούμε τους υποχρεωτικούς κανόνες κωδικού στο Edit Mode
      this.entityForm.get('password')?.clearValidators();
      this.entityForm.get('password')?.updateValueAndValidity();

      this.loadEntityData(id);
    }
  }

  loadEntityData(id: string): void {
    this.isLoading = true;

    this.entityService.getEntityById(id).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const entityData = response?.payload?.data || response?.payload || response;

        if (entityData) {
          const locationsArray = this.entityForm.get('location') as FormArray;
          locationsArray.clear();

          // Φορτώνουμε ΟΛΕΣ τις τοποθεσίες (χωρίς filter)
          if (entityData.location && Array.isArray(entityData.location)) {
            entityData.location.forEach((loc: any) => this.addLocation(loc));
          }

          // Ενεργοποίηση Transporter fields αν χρειάζεται
          if (entityData.transporter?.own) {
            const transporterGroup = this.entityForm.get('transporter') as FormGroup;
            transporterGroup.get('name')?.enable();
            transporterGroup.get('phone')?.enable();
          }

          // Patch Values
          this.entityForm.patchValue({
            email: entityData.email,
            active: entityData.active !== false,
            fullName: entityData.fullName,
            contactPerson: entityData.contactPerson,
            phone: entityData.phone,
            city: entityData.city,
            country: entityData.country || 'Greece',
            zipCode: entityData.zipCode,
            description: entityData.description,
            transporter: entityData.transporter || { own: false, name: '', phone: '' }
          });

          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Σφάλμα κατά τη φόρτωση:', err);
      }
    });
  }

  initForm(): void {
    this.entityForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      active: [true],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [this.passwordMatchValidator]],
      fullName: ['', Validators.required],
      contactPerson: [''],
      phone: [''],
      city: [''],
      country: ['Greece'],
      zipCode: [''],
      description: [''],
      transporter: this.fb.group({
        name: [''],
        phone: [''],
        own: [false]
      }),
      location: this.fb.array([])
    }, { validators: this.passwordMatchValidator });

    this.entityForm.get('password')?.valueChanges.subscribe(() => {
      const confirmCtrl = this.entityForm.get('confirmPassword');
      if (confirmCtrl) {
        confirmCtrl.updateValueAndValidity(); // Ελέγχει ξανά αν ταιριάζουν
        confirmCtrl.markAsTouched();          // "Ξυπνάει" το κόκκινο πλαίσιο του Material
        this.cd.detectChanges();              // Αναγκάζει το UI να ανανεωθεί αμέσως
      }
    });

    this.entityForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.cd.detectChanges();
    });

    // Πρόσθεσα και την κλήση για το transporter που έλειπε από το δικό σου initForm()
    this.setupTransporterListener();

  }

  passwordMatchValidator(control: AbstractControl) {
    if (!control.parent) return null;
    const password = control.parent.get('password')?.value;
    const confirm = control.value;

    if (password && password !== confirm) {
      return { mismatch: true };
    }
    return null;
  }

  createLocationGroup(data?: any): FormGroup {
    return this.fb.group({
      _id: [data?._id || null],
      delete: [data?.delete || false],
      active: [data?.active ?? true],
      main: [data?.main ?? false],
      locationName: [data?.locationName || '', Validators.required],
      contactPhone: [data?.contactPhone || ''],
      contactName: [data?.contactName || ''],
      country: [data?.country || 'Greece'],
      city: [data?.city || ''],
      zipCode: [data?.zipCode || ''],
      address: [data?.address || '', Validators.required],
      description: [data?.description || '']
    });
  }

  get locationsArray(): FormArray { return this.entityForm.get('location') as FormArray; }
  get locationControls() { return this.locationsArray.controls; }

  addLocation(data?: any): void {
    const locGroup = this.fb.group({
      _id: [data?._id || null],
      delete: [data?.delete || false],
      active: [data?.active ?? true],
      main: [data?.main ?? false],
      locationName: [data?.locationName || '', Validators.required],
      address: [data?.address || '', Validators.required],
      city: [data?.city || ''],
      zipCode: [data?.zipCode || ''],
      country: [data?.country || 'Greece'],
      contactName: [data?.contactName || ''],
      contactPhone: [data?.contactPhone || ''],
      description: [data?.description || '']
    });

    (this.entityForm.get('location') as FormArray).push(locGroup);
  }

  removeOrDeleteLocation(index: number): void {
    const locGroup = this.locationsArray.at(index);
    const locId = locGroup.get('_id')?.value;
    if (this.isEditMode && locId) {
      this.deletedLocationIds.push(locId);
    }
    this.locationsArray.removeAt(index);
  }

  cleanObject(obj: any): any {
    const clean = JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'string' ? value.trim() : value
    ));

    Object.keys(clean).forEach(key => {
      // Μην διαγράφεις το transporter key, θα το χειριστούμε ξεχωριστά
      if (key === 'transporter') return;

      if (clean[key] === "" || clean[key] === null) {
        delete clean[key];
      }
    });
    return clean;
  }

  moveToNextTab(): void {
    if (this.selectedTabIndex === 0 && !this.isBasicInfoValid) {
      this.entityForm.markAllAsTouched(); return;
    }
    if (this.selectedTabIndex === 1 && !this.isSecurityValid) {
      this.entityForm.markAllAsTouched(); return;
    }
    if (this.selectedTabIndex < 3) this.selectedTabIndex++;
  }

  moveBackTab(): void { if (this.selectedTabIndex > 0) this.selectedTabIndex--; }


  get isBasicInfoValid(): boolean {
    const basicFields = ['email', 'fullName'];
    return basicFields.every(field => this.entityForm.get(field)?.valid);
  }

  get isSecurityValid(): boolean {
    const passControl = this.entityForm.get('password');
    const confirmControl = this.entityForm.get('confirmPassword');

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

  get activeLocationsCount(): number {
    return this.locationControls.filter(c => !c.get('delete')?.value).length;
  }

  get deletedLocationsCount(): number {
    return this.locationControls.filter(c => c.get('delete')?.value).length;
  }

  toggleDeletedLocations() {
    this.showDeletedLocations = !this.showDeletedLocations;
  }

  onSubmit(): void {
    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const rawData = this.entityForm.getRawValue();

    if (this.isEditMode && this.entityId) {
      const requests: Observable<any>[] = [];

      // ==========================================
      // 1. ΕΛΕΓΧΟΣ: Βασικά Στοιχεία
      // ==========================================
      const basicFields = ['active', 'fullName', 'contactPerson', 'email', 'phone', 'country', 'city', 'zipCode', 'description'];
      const isBasicDirty = basicFields.some(field => this.entityForm.get(field)?.dirty);
      const hasNewPassword = !!rawData.password;

      if (isBasicDirty || hasNewPassword) {
        const { location, transporter, confirmPassword, password, ...basicStuff } = rawData;
        const basicPayload = this.cleanObject(basicStuff);
        if (password) basicPayload.password = password;

        requests.push(
          this.entityService.updateEntity(this.entityId, basicPayload).pipe(
            catchError(err => { console.error('Basic Info Error:', err); return of({error: true}); })
          )
        );
      }

      // ==========================================
      // 2. ΕΛΕΓΧΟΣ: Μεταφορέας
      // ==========================================
      if (this.entityForm.get('transporter')?.dirty) {
        const transporterPayload = {
          own: !!rawData.transporter?.own,
          name: rawData.transporter?.own ? (rawData.transporter.name || "") : null,
          phone: rawData.transporter?.own ? (rawData.transporter.phone || "") : null
        };

        requests.push(
          this.entityService.updateTransporter(this.entityId, transporterPayload).pipe(
            catchError(err => { console.error('Transporter Error:', err); return of({error: true}); })
          )
        );
      }

      // ==========================================
      // 3. ΕΛΕΓΧΟΣ: Τοποθεσίες (Προσθήκη / Ενημέρωση)
      // ==========================================
      const locationArray = this.entityForm.get('location') as FormArray;

      locationArray.controls.forEach((locCtrl) => {
        const locValue = locCtrl.getRawValue();
        if (locValue.delete) return; // Αν είναι για διαγραφή, αγνόησέ το (θα πάει από το delete endpoint)

        const { _id, delete: deleteField, ...restOfLoc } = locValue;
        const strictLoc = this.cleanObject(restOfLoc);

        if (_id) {
          // ΜΥΣΤΙΚΟ: Δεν κοιτάμε αν ΟΛΟ το locCtrl είναι dirty.
          // Κοιτάμε αν έστω και ένα "πραγματικό" πεδίο (όνομα, διεύθυνση κλπ) είναι dirty!
          const realFields = ['active', 'main', 'locationName', 'contactPhone', 'contactName', 'country', 'city', 'zipCode', 'address', 'description'];
          const isRealFieldDirty = realFields.some(field => locCtrl.get(field)?.dirty);

          if (isRealFieldDirty) {
            requests.push(
              this.entityService.updateLocation(_id, strictLoc).pipe(
                catchError(err => { console.error('Loc Update Error:', err); return of({error: true}); })
              )
            );
          }
        } else {
          requests.push(
            this.entityService.addLocation(this.entityId!, strictLoc).pipe(
              catchError(err => { console.error('Loc Add Error:', err); return of({error: true}); })
            )
          );
        }
      });

      // ==========================================
      // 4. ΕΛΕΓΧΟΣ: Διαγραφές & Επαναφορές
      // ==========================================
      this.deletedLocationIds.forEach(locId => {
        requests.push(this.entityService.deleteLocation(locId).pipe(catchError(e => of({error: true}))));
      });

      this.restoredLocationIds.forEach(locId => {
        requests.push(this.entityService.restoreLocation(locId).pipe(catchError(e => of({error: true}))));
      });

      // ==========================================
      // 5. ΤΕΛΙΚΗ ΕΚΤΕΛΕΣΗ
      // ==========================================
      if (requests.length === 0) {
        this.isLoading = false;
        this.router.navigate(['/admin/entities']);
        return;
      }

      forkJoin(requests).subscribe({
        next: (results) => {
          this.isLoading = false;
          const hasErrors = results.some(res => res && res.error === true);
          if (hasErrors) {
            alert('Προσοχή: Κάποια στοιχεία δεν αποθηκεύτηκαν. Ελέγξτε την Κονσόλα (F12).');
          } else {
            this.router.navigate(['/admin/entities']);
          }
        }
      });

    } else {
      // ==========================================
      // CREATE MODE (Νέος Φορέας)
      // ==========================================
      const transporterPayload = {
        own: !!rawData.transporter?.own,
        name: rawData.transporter?.own ? (rawData.transporter.name || "") : null,
        phone: rawData.transporter?.own ? (rawData.transporter.phone || "") : null
      };

      const createData = this.cleanObject(rawData);
      delete createData.confirmPassword;
      delete createData.location;
      createData.transporter = transporterPayload;

      this.entityService.createEntity(createData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/entities']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Create error:', err);
          alert('Σφάλμα κατά τη δημιουργία.');
        }
      });
    }
  }

  restoreLocation(index: number) {
    const locGroup = this.locationControls[index];
    const locId = locGroup.get('_id')?.value;

    if (locId) {
      // 1. Θέτουμε το delete σε false για να ανέβει πάλι στις Ενεργές
      locGroup.get('delete')?.setValue(false);
      locGroup.get('delete')?.markAsDirty();

      // 2. Ενημερώνουμε τις λίστες για το API
      if (this.deletedLocationIds.includes(locId)) {
        this.deletedLocationIds = this.deletedLocationIds.filter(id => id !== locId);
      } else {
        if (!this.restoredLocationIds.includes(locId)) {
          this.restoredLocationIds.push(locId);
        }
      }
    }

    // 3. ΑΝΑΓΚΑΖΟΥΜΕ ΤΟ ANGULAR ΝΑ ΑΝΑΝΕΩΣΕΙ ΤΟ UI ΑΜΕΣΩΣ!
    this.cd.detectChanges();
  }

  removeLocation(index: number) {
    const locGroup = this.locationControls[index];
    const locId = locGroup.get('_id')?.value;

    if (locId) {
      // 1. Θέτουμε το delete σε true και το μαρκάρουμε ως τροποποιημένο
      locGroup.get('delete')?.setValue(true);
      locGroup.get('delete')?.markAsDirty();

      // 2. Ενημερώνουμε τις λίστες για το API
      this.restoredLocationIds = this.restoredLocationIds.filter(id => id !== locId);

      if (!this.deletedLocationIds.includes(locId)) {
        this.deletedLocationIds.push(locId);
      }

      // 3. Ανοίγουμε το Dropdown
      this.showDeletedLocations = true;
    } else {
      // Αν δεν είχε αποθηκευτεί ποτέ στο backend, τη σβήνουμε οριστικά από το UI
      (this.entityForm.get('location') as FormArray).removeAt(index);
    }

    // 4. ΑΝΑΓΚΑΖΟΥΜΕ ΤΟ ANGULAR ΝΑ ΑΝΑΝΕΩΣΕΙ ΤΟ UI ΑΜΕΣΩΣ!
    this.cd.detectChanges();
  }

  setupTransporterListener() {
    const transporterGroup = this.entityForm.get('transporter') as FormGroup;
    transporterGroup.get('own')?.valueChanges.subscribe(isOwn => {
      if (isOwn) {
        transporterGroup.get('name')?.enable();
        transporterGroup.get('phone')?.enable();
      } else {
        transporterGroup.get('name')?.disable();
        transporterGroup.get('phone')?.disable();
        transporterGroup.get('name')?.reset();
        transporterGroup.get('phone')?.reset();
      }
      transporterGroup.get('name')?.updateValueAndValidity();
    });
  }

}
