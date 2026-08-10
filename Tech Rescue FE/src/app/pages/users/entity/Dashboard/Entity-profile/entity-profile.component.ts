import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../auth/_services/auth.service';
import { EntitiesService } from '../../../../../_services/entities.service';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-entity-profile',
  templateUrl: './entity-profile.component.html',
  styleUrls: ['./entity-profile.component.css'],
  standalone: false
})
export class EntityProfileComponent implements OnInit {
  entityForm!: FormGroup;
  locationForm!: FormGroup;

  hidePassword = true;
  hideOldPassword = true;
  isLoading = false;
  isLocationLoading = false;

  deletedLocationIds: string[] = [];
  restoredLocationIds: string[] = [];
  showLocationForm = false;
  editingLocationId: string | null = null;

  showDeletedLocations = false;
  currentUserProfile: any = null;
  currentUserId: string | null = null;
  joinDate: string = '-';

  constructor(
    private fb: FormBuilder,
    private entitiesService: EntitiesService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initLocationForm();
    this.loadCurrentUserProfile();
  }

  initForm(): void {
    this.entityForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: [''],
      description: [''],
      city: [''],
      country: [''],
      zipCode: [''],
      ownTransporter: [false],
      transporterName: [''],
      transporterPhone: [''],
      oldPassword: [''],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  initLocationForm(data?: any) {
    this.locationForm = this.fb.group({
      locationName: [data?.locationName || '', Validators.required],
      address: [data?.address || '', Validators.required],
      city: [data?.city || '', Validators.required],
      zipCode: [data?.zipCode || '', Validators.required],
      country: [data?.country || 'Greece'],
      contactName: [data?.contactName || ''],
      contactPhone: [data?.contactPhone || ''],
      main: [data?.main || false],
      active: [data?.active ?? true]
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    if (!password) return null;
    return password === confirm ? null : { mismatch: true };
  }

  loadCurrentUserProfile(): void {
    const decodedTokenUser = this.authService.currentUserValue;
    if (!decodedTokenUser) return;

    this.currentUserId = decodedTokenUser._id || decodedTokenUser.id || decodedTokenUser.userId;
    if (!this.currentUserId) return;

    this.entitiesService.getEntityById(this.currentUserId).subscribe({
      next: (res: any) => {
        const data = res.payload?.data || res.data || res;
        if (data) {
          this.currentUserProfile = data;

          const rawDate = data.createdAt || data.date;
          if (rawDate) {
            const date = new Date(rawDate);
            const monthNames = ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"];
            this.joinDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
          }

          const nameToSet = data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || '';
          this.entityForm.patchValue({
            fullName: nameToSet,
            email: data.email,
            phone: data.phone,
            description: data.description,
            city: data.city,
            country: data.country,
            zipCode: data.zipCode,
            ownTransporter: data.transporter?.own || false,
            transporterName: data.transporter?.name || '',
            transporterPhone: data.transporter?.phone || ''
          });
          this.cd.detectChanges();
        }
      }
    });
  }

  // --- LOCATION ACTIONS ---
  toggleAddLocation() {
    this.editingLocationId = null;
    this.initLocationForm();
    this.showLocationForm = true;
    this.cd.detectChanges();
  }

  onEditLocation(loc: any) {
    this.editingLocationId = loc._id;
    this.initLocationForm(loc);
    this.showLocationForm = true;
    this.cd.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSaveLocation() {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }
    this.isLocationLoading = true;
    this.cd.detectChanges();

    const data = this.locationForm.value;
    const action = this.editingLocationId
      ? this.entitiesService.updateLocation(this.editingLocationId, data)
      : this.entitiesService.addLocation(this.currentUserId!, data);

    action.subscribe({
      next: () => {
        this.isLocationLoading = false;
        this.showLocationForm = false;
        this.snackBar.open('Η τοποθεσία αποθηκεύτηκε!', 'OK', { duration: 3000 });
        this.loadCurrentUserProfile();
      },
      error: () => { this.isLocationLoading = false; this.cd.detectChanges(); }
    });
  }

  onDeleteLocation(id: string) {
    // Βρίσκουμε την τοποθεσία στο τοπικό αντικείμενο
    const loc = this.currentUserProfile?.location?.find((l: any) => l._id === id);

    if (loc) {
      loc.delete = true; // 1. Αλλάζουμε την κατάσταση για το UI (θα πάει στο Dropdown)

      // 2. Ενημερώνουμε τις λίστες
      this.restoredLocationIds = this.restoredLocationIds.filter(rId => rId !== id);
      if (!this.deletedLocationIds.includes(id)) {
        this.deletedLocationIds.push(id);
      }

      this.showDeletedLocations = true; // Ανοίγουμε το Dropdown για να το δει
      this.entityForm.markAsDirty(); // 3. "Ξυπνάμε" το κουμπί της Αποθήκευσης!
      this.cd.detectChanges();
    }
  }

  // --- SUBMIT WITH DIRTY CHECKING ---
  onSubmit(): void {
    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return;
    }

    const val = this.entityForm.getRawValue();
    const original = this.currentUserProfile;

    // 1. Ελέγχουμε τι άλλαξε
    const profileChanged =
      val.fullName !== (original?.fullName || `${original?.firstName || ''} ${original?.lastName || ''}`.trim()) ||
      val.phone !== (original?.phone || '') ||
      val.description !== (original?.description || '') ||
      val.city !== (original?.city || '') ||
      val.country !== (original?.country || '') ||
      val.zipCode !== (original?.zipCode || '');

    const transporterChanged =
      val.ownTransporter !== (original?.transporter?.own || false) ||
      val.transporterName !== (original?.transporter?.name || '') ||
      val.transporterPhone !== (original?.transporter?.phone || '');

    const passwordRequested = !!(val.oldPassword && val.password);

    // ΝΕΟ: Ελέγχουμε αν εκκρεμούν διαγραφές ή επαναφορές τοποθεσιών
    const locationChangesPending = this.deletedLocationIds.length > 0 || this.restoredLocationIds.length > 0;

    // Αν δεν άλλαξε απολύτως τίποτα, δεν κάνουμε τίποτα!
    if (!profileChanged && !transporterChanged && !passwordRequested && !locationChangesPending) {
      this.snackBar.open('Δεν εντοπίστηκαν αλλαγές προς αποθήκευση.', 'OK', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    const requests: Observable<any>[] = [];

    // --- Μαζεύουμε όλα τα API Calls που πρέπει να γίνουν ---
    if (profileChanged) {
      requests.push(this.entitiesService.updateEntity(this.currentUserId!, {
        fullName: val.fullName, phone: val.phone, city: val.city, country: val.country, zipCode: val.zipCode, description: val.description
      }).pipe(catchError(e => of(null))));
    }

    if (transporterChanged) {
      requests.push(this.entitiesService.updateTransporter(this.currentUserId!, {
        own: val.ownTransporter, name: val.transporterName, phone: val.transporterPhone
      }).pipe(catchError(e => of(null))));
    }

    this.deletedLocationIds.forEach(id => {
      requests.push(this.entitiesService.deleteLocation(id).pipe(catchError(e => of(null))));
    });

    this.restoredLocationIds.forEach(id => {
      requests.push(this.entitiesService.restoreLocation(id).pipe(catchError(e => of(null))));
    });

    // --- Εκτέλεση ---
    if (requests.length > 0) {
      forkJoin(requests).subscribe({
        next: () => {
          // Αδειάζουμε τις λίστες αφού σώθηκαν
          this.deletedLocationIds = [];
          this.restoredLocationIds = [];

          // Αν υπάρχει ΚΑΙ αλλαγή κωδικού, την κάνουμε στο τέλος
          if (passwordRequested) {
            this.processPasswordChange(val);
          } else {
            this.finishUpdate('Οι αλλαγές αποθηκεύτηκαν επιτυχώς!');
          }
        }
      });
    } else if (passwordRequested) {
      // Περίπτωση που άλλαξε ΜΟΝΟ τον κωδικό
      this.processPasswordChange(val);
    }
  }

  private processPasswordChange(val: any) {
    this.entitiesService.changePassword(val.oldPassword, val.password).subscribe({
      next: () => this.finishUpdate('Το προφίλ και ο κωδικός ενημερώθηκαν!'),
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Λάθος τρέχων κωδικός.', 'OK');
        this.cd.detectChanges();
      }
    });
  }


  private finishUpdate(msg: string) {
    this.isLoading = false;
    this.entityForm.patchValue({ oldPassword: '', password: '', confirmPassword: '' });
    this.entityForm.markAsPristine();
    this.snackBar.open(msg, 'OK', { duration: 3000 });
    this.loadCurrentUserProfile();
  }

  get activeLocations() {
    if (!this.currentUserProfile?.location) return [];
    return this.currentUserProfile.location.filter((loc: any) => !loc.delete);
  }

  get deletedLocations() {
    if (!this.currentUserProfile?.location) return [];
    return this.currentUserProfile.location.filter((loc: any) => loc.delete);
  }

  toggleDeletedLocations() {
    this.showDeletedLocations = !this.showDeletedLocations;
  }

  // Προσθήκη της συνάρτησης Επαναφοράς
  onRestoreLocation(id: string) {
    const loc = this.currentUserProfile?.location?.find((l: any) => l._id === id);

    if (loc) {
      loc.delete = false; // 1. Επαναφορά για το UI (θα γυρίσει στις Ενεργές)

      // 2. Ενημερώνουμε τις λίστες
      this.deletedLocationIds = this.deletedLocationIds.filter(dId => dId !== id);
      if (!this.restoredLocationIds.includes(id)) {
        this.restoredLocationIds.push(id);
      }

      this.entityForm.markAsDirty(); // 3. "Ξυπνάμε" το κουμπί της Αποθήκευσης!
      this.cd.detectChanges();
    }
  }
}
