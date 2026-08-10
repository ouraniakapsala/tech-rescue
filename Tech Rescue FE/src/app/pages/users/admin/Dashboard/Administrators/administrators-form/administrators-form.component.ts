import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdministratorsService } from '../../../../../../_services/administrators.service';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-administrators-form',
  templateUrl: './administrators-form.component.html',
  styleUrls: ['./administrators-form.component.css'],
  standalone: false
})
export class AdministratorsFormComponent implements OnInit {
  adminForm!: FormGroup;
  isEditMode = false;
  adminId: string | null = null;
  deletedLocationIds: string[] = [];
  hidePassword = true;
  selectedTabIndex = 0;
  isLoading = false;

  restoredLocationIds: string[] = []; // <--- ΠΡΟΣΘΗΚΗ
  showDeletedLocations = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private administratorsService: AdministratorsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      this.adminId = params.get('id');
      if (this.adminId) {
        this.isEditMode = true;
        this.loadAdminData(this.adminId);

        // Στο Edit Mode ο κωδικός δεν είναι υποχρεωτικός
        this.adminForm.get('password')?.clearValidators();
        this.adminForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  initForm() {
    this.adminForm = this.fb.group({
      role: ['admin'],
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
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    // Μεταφορέας
    this.adminForm.addControl('transporter', this.fb.group({
      own: [false],
      name: [{ value: '', disabled: true }],
      phone: [{ value: '', disabled: true }]
    }));

    // Τοποθεσίες
    this.adminForm.addControl('location', this.fb.array([]));

    this.setupTransporterListener();
  }

  setupTransporterListener() {
    const transporterGroup = this.adminForm.get('transporter') as FormGroup;
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

  get locationControls() {
    return (this.adminForm.get('location') as FormArray).controls;
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
      description: [data?.description?.trim() || '']
    });

    (this.adminForm.get('location') as FormArray).push(locGroup);
  }

  removeOrDeleteLocation(index: number) {
    const locGroup = this.locationControls[index];
    const locId = locGroup.get('_id')?.value;

    if (locId) {
      // 1. Είναι αποθηκευμένο στο server. Αλλάζουμε το UI σε "Διεγραμμένο".
      locGroup.get('delete')?.setValue(true);

      // 2. Αν το είχαμε πατήσει "Επαναφορά" νωρίτερα, αλλάξαμε γνώμη, άρα το ακυρώνουμε
      this.restoredLocationIds = this.restoredLocationIds.filter(id => id !== locId);

      // 3. Το βάζουμε στη λίστα διαγραφών για το onSubmit (αν δεν είναι ήδη)
      if (!this.deletedLocationIds.includes(locId)) {
        this.deletedLocationIds.push(locId);
      }

      // 4. Ανοίγουμε το dropdown αυτόματα για να δει ο χρήστης πού πήγε η κάρτα!
      this.showDeletedLocations = true;
    } else {
      // Είναι εντελώς καινούργιο (δεν έχει σωθεί ποτέ), οπότε το σβήνουμε οριστικά από το UI
      (this.adminForm.get('location') as FormArray).removeAt(index);
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (!password) return null;
    return password === confirm ? null : { mismatch: true };
  }

  loadAdminData(id: string) {
    this.isLoading = true;
    this.administratorsService.getAdministratorById(id).subscribe({
      next: (res) => {
        this.isLoading = false;

        // Ασφαλής εξαγωγή δεδομένων
        const data = res?.payload?.data?.users ? res.payload.data.users[0] : (res?.payload?.data || res?.payload || res);
        if (!data) return;

        // Φιλτράρισμα και προσθήκη τοποθεσιών
        const locationArray = this.adminForm.get('location') as FormArray;
        locationArray.clear();
        if (data.location && Array.isArray(data.location)) {
          // const activeLocations = data.location.filter((loc: any) => loc.delete !== true);
          data.location.forEach((loc: any) => this.addLocation(loc));
        }

        // Ενεργοποίηση Transporter fields πριν το patchValue
        if (data.transporter?.own) {
          const transporterGroup = this.adminForm.get('transporter') as FormGroup;
          transporterGroup.get('name')?.enable();
          transporterGroup.get('phone')?.enable();
        }

        // Patch Values (setTimeout για να ενημερωθεί το DOM)
        setTimeout(() => {
          this.adminForm.patchValue(data);
          this.cd.detectChanges();
        });
      },
      error: () => this.isLoading = false
    });
  }

  cleanObject(obj: any): any {
    const clean = JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'string' ? value.trim() : value
    ));

    Object.keys(clean).forEach(key => {
      if (key === 'transporter') return; // Προστασία transporter από τη διαγραφή!

      if (clean[key] === "" || clean[key] === null || clean[key] === undefined) {
        delete clean[key];
      }
    });
    return clean;
  }

  onSubmit() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const rawData = this.adminForm.getRawValue();

    if (this.isEditMode && this.adminId) {
      const requests: Observable<any>[] = [];

      // ==========================================
      // 1. ΕΛΕΓΧΟΣ: Βασικά Στοιχεία Προφίλ
      // ==========================================
      const basicFields = ['active', 'fullName', 'contactPerson', 'email', 'phone', 'country', 'city', 'zipCode', 'description'];

      // Ελέγχουμε αν έστω ΚΑΙ ΕΝΑ από τα παραπάνω πεδία έχει τροποποιηθεί (dirty)
      const isBasicDirty = basicFields.some(field => this.adminForm.get(field)?.dirty);
      // Ελέγχουμε αν έχει πληκτρολογήσει νέο κωδικό
      const hasNewPassword = !!rawData.password;

      if (isBasicDirty || hasNewPassword) {
        const { location, transporter, confirmPassword, password, role, ...basicStuff } = rawData;
        const basicPayload = this.cleanObject(basicStuff);
        if (password) basicPayload.password = password;

        requests.push(
          this.administratorsService.updateAdministrator(this.adminId, basicPayload).pipe(
            catchError(err => {
              console.error('Basic Info Error:', err);
              return of({ error: true, msg: err.error?.message || 'Σφάλμα βασικών στοιχείων' });
            })
          )
        );
      }

      // ==========================================
      // 2. ΕΛΕΓΧΟΣ: Μεταφορέας
      // ==========================================
      // Στέλνουμε το API ΜΟΝΟ αν ο χρήστης πείραξε το tab του μεταφορέα
      if (this.adminForm.get('transporter')?.dirty) {
        const transporterPayload = {
          own: !!rawData.transporter?.own,
          name: rawData.transporter?.own ? (rawData.transporter.name || "") : null,
          phone: rawData.transporter?.own ? (rawData.transporter.phone || "") : null
        };

        requests.push(
          this.administratorsService.updateTransporter(this.adminId, transporterPayload).pipe(
            catchError(err => {
              console.error('Transporter Error:', err);
              return of({ error: true, msg: 'Σφάλμα μεταφορέα' });
            })
          )
        );
      }

      // ==========================================
      // 3. ΕΛΕΓΧΟΣ: Τοποθεσίες (Προσθήκη / Ενημέρωση)
      // ==========================================
      const locationArray = this.adminForm.get('location') as FormArray;

      locationArray.controls.forEach((locCtrl) => {
        const locValue = locCtrl.getRawValue();
        if (locValue.delete) return; // Αγνοούμε αυτές που είναι στο "καλάθι διαγραφών" του UI

        const { _id, delete: deleteField, ...restOfLoc } = locValue;
        const strictLoc = this.cleanObject(restOfLoc);

        if (_id) {
          // ΕΙΝΑΙ ΗΔΗ ΥΠΑΡΧΟΥΣΑ ΤΟΠΟΘΕΣΙΑ: Κάνουμε update ΜΟΝΟ αν είναι dirty!
          if (locCtrl.dirty) {
            requests.push(
              this.administratorsService.updateLocation(_id, strictLoc).pipe(
                catchError(err => { console.error('Loc Update Error:', err); return of({ error: true }); })
              )
            );
          }
        } else {
          // ΔΕΝ ΕΧΕΙ _ID: Άρα είναι ολοκαίνουργια τοποθεσία που μόλις πάτησε "Προσθήκη"
          requests.push(
            this.administratorsService.addLocation(this.adminId!, strictLoc).pipe(
              catchError(err => { console.error('Loc Add Error:', err); return of({ error: true }); })
            )
          );
        }
      });

      // ==========================================
      // 4. ΕΛΕΓΧΟΣ: Διαγραφές & Επαναφορές (Από τα κουμπιά που πατήσαμε)
      // ==========================================
      this.deletedLocationIds.forEach(locId => {
        requests.push(
          this.administratorsService.deleteLocation(locId).pipe(catchError(e => of({ error: true })))
        );
      });

      this.restoredLocationIds.forEach(locId => {
        requests.push(
          this.administratorsService.restoreLocation(locId).pipe(catchError(e => of({ error: true })))
        );
      });

      // ==========================================
      // 5. ΤΕΛΙΚΗ ΕΚΤΕΛΕΣΗ
      // ==========================================

      // ΑΝ δεν πειράξαμε ΤΙΠΟΤΑ ΑΠΟΛΥΤΩΣ (η λίστα των requests είναι άδεια),
      // γυρνάμε κατευθείαν πίσω χωρίς καν να ενοχλήσουμε τον server!
      if (requests.length === 0) {
        this.isLoading = false;
        this.router.navigate(['/admin/administrators']);
        return;
      }

      forkJoin(requests).subscribe({
        next: (results) => {
          this.isLoading = false;
          const hasErrors = results.some(res => res && res.error === true);

          if (hasErrors) {
            alert('Προσοχή: Κάποια στοιχεία δεν αποθηκεύτηκαν. Δες την κονσόλα (F12) για το μήνυμα του Server.');
          } else {
            this.router.navigate(['/admin/administrators']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Critical save error:', err);
        }
      });

    } else {
      // ==========================================
      // CREATE MODE (Νέος Διαχειριστής)
      // Εδώ αναγκαστικά στέλνουμε τα πάντα αφού είναι καινούργιος!
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

      this.administratorsService.createAdministrator(createData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/administrators']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Create error:', err);
          alert('Σφάλμα κατά τη δημιουργία.');
        }
      });
    }
  }

  // --- Helpers για το UI ---
  get isBasicInfoValid(): boolean {
    const fields = ['fullName', 'email'];
    return fields.every(field => this.adminForm.get(field)?.valid);
  }

  get isSecurityValid(): boolean {
    if (this.isEditMode) {
      const passValue = this.adminForm.get('password')?.value;
      if (!passValue || passValue === '') return true;
    }
    const pass = this.adminForm.get('password');
    const confirm = this.adminForm.get('confirmPassword');
    return (pass?.valid ?? false) && (confirm?.valid ?? false) && !this.adminForm.hasError('mismatch');
  }

  moveToNextTab() {
    if (this.selectedTabIndex === 0 && !this.isBasicInfoValid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    if (this.selectedTabIndex === 1 && !this.isSecurityValid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    this.selectedTabIndex++;
  }

  moveBackTab() {
    if (this.selectedTabIndex > 0) this.selectedTabIndex--;
  }

  restoreLocation(index: number) {
    const locGroup = this.locationControls[index];
    const locId = locGroup.get('_id')?.value;

    if (locId) {
      // 1. Αλλάζουμε το UI σε "Ενεργό" (θα πεταχτεί αυτόματα στην πάνω λίστα!)
      locGroup.get('delete')?.setValue(false);

      // 2. Αν το είχαμε μόλις διαγράψει εμείς στο UI, απλά το βγάζουμε από τη λίστα διαγραφών
      if (this.deletedLocationIds.includes(locId)) {
        this.deletedLocationIds = this.deletedLocationIds.filter(id => id !== locId);
      } else {
        // Αν ήταν ΗΔΗ διεγραμμένο από το server από παλιά, το βάζουμε στη λίστα επαναφοράς
        if (!this.restoredLocationIds.includes(locId)) {
          this.restoredLocationIds.push(locId);
        }
      }
    }
  }

  get activeLocationsCount(): number {
    return this.locationControls.filter(c => !c.get('delete')?.value).length;
  }

  // Μετράει τις διεγραμμένες τοποθεσίες
  get deletedLocationsCount(): number {
    return this.locationControls.filter(c => c.get('delete')?.value).length;
  }

  // Κάνει Toggle το Dropdown
  toggleDeletedLocations() {
    this.showDeletedLocations = !this.showDeletedLocations;
  }

}
