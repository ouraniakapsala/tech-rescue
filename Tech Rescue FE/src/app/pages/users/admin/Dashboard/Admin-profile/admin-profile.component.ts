import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministratorsService } from '../../../../../_services/administrators.service';
import { AuthService } from '../../../../../auth/_services/auth.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
  standalone: false
})
export class AdminProfileComponent implements OnInit {
  adminForm!: FormGroup;
  locationForm!: FormGroup;

  hidePassword = true;
  hideOldPassword = true;
  isLoading = false;
  isLocationLoading = false;

  showDeletedLocations = false;
  showLocationForm = false;
  editingLocationId: string | null = null;

  currentUserProfile: any = null;
  currentUserId: string | null = null;
  joinDate: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdministratorsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initLocationForm();
    this.loadCurrentUserProfile();
  }

  initForm() {
    this.adminForm = this.fb.group({
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: [''],
      contactPerson: [''],
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

  loadCurrentUserProfile() {
    const user = this.authService.currentUserValue;
    this.currentUserId = user?._id || user?.id || user?.userId;

    if (!this.currentUserId) return;

    this.adminService.getAdministratorById(this.currentUserId).subscribe({
      next: (res: any) => {
        const data = res.payload?.data;
        if (data) {
          this.currentUserProfile = data;
          this.adminForm.patchValue({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            contactPerson: data.contactPerson,
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

  toggleAddLocation() {
    this.editingLocationId = null;
    this.initLocationForm();
    this.showLocationForm = true;
    this.cd.detectChanges(); // Ενημερώνουμε το UI αμέσως
  }

  onEditLocation(loc: any) {
    this.editingLocationId = loc._id;
    this.initLocationForm(loc);
    this.showLocationForm = true;
    this.cd.detectChanges(); // Ενημερώνουμε το UI αμέσως
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSaveLocation() {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    // Κρίσιμο σημείο: Αλλάζουμε την τιμή και εξαναγκάζουμε την Angular
    // να την "δει" ΠΡΙΝ ξεκινήσει η επόμενη διαδικασία.
    this.isLocationLoading = true;
    this.cd.detectChanges();

    const data = this.locationForm.value;

    if (this.editingLocationId) {
      this.adminService.updateLocation(this.editingLocationId, data).subscribe({
        next: () => this.handleLocationSuccess('Η τοποθεσία ενημερώθηκε!'),
        error: () => {
          this.isLocationLoading = false;
          this.cd.detectChanges();
        }
      });
    } else {
      this.adminService.addLocation(this.currentUserId!, data).subscribe({
        next: () => this.handleLocationSuccess('Η τοποθεσία προστέθηκε!'),
        error: () => {
          this.isLocationLoading = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  onDeleteLocation(id: string) {
    if (confirm('Θέλετε να διαγράψετε (soft delete) αυτήν την τοποθεσία;')) {
      this.adminService.deleteLocation(id).subscribe({
        next: () => {
          this.snackBar.open('Η τοποθεσία διαγράφηκε.', 'OK', { duration: 3000 });
          this.loadCurrentUserProfile(); // Ξαναφορτώνει για να τη δει ως deleted
        },
        error: (err) => this.handleProfileError(err)
      });
    }
  }

  onRestoreLocation(id: string) {
    if (confirm('Θέλετε να επαναφέρετε αυτήν την τοποθεσία;')) {
      // Βεβαιώσου ότι υπάρχει η restoreLocation στο service!
      this.adminService.restoreLocation(id).subscribe({
        next: () => {
          this.snackBar.open('Η τοποθεσία επαναφέρθηκε!', 'OK', { duration: 3000 });
          this.loadCurrentUserProfile(); // Ξαναφορτώνει για να τη δει ως ενεργή
        },
        error: (err) => this.handleProfileError(err)
      });
    }
  }

  private handleLocationSuccess(msg: string) {
    this.isLocationLoading = false;
    this.showLocationForm = false;
    this.editingLocationId = null;
    this.snackBar.open(msg, 'OK', { duration: 3000 });
    this.loadCurrentUserProfile();
    this.cd.detectChanges();
  }

  // --- PROFILE SUBMIT ---
  onSubmit() {
    if (this.adminForm.invalid || !this.currentUserId) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const val = this.adminForm.getRawValue();
    const original = this.currentUserProfile;

    // 1. Έλεγχος αν άλλαξαν τα Βασικά Στοιχεία / Διεύθυνση
    const profileChanged =
      val.fullName !== original?.fullName ||
      val.phone !== (original?.phone || '') ||
      val.contactPerson !== (original?.contactPerson || '') ||
      val.description !== (original?.description || '') ||
      val.city !== (original?.city || '') ||
      val.country !== (original?.country || '') ||
      val.zipCode !== (original?.zipCode || '');

    // 2. Έλεγχος αν άλλαξαν τα Μεταφορικά (Transporter)
    const transporterChanged =
      val.ownTransporter !== (original?.transporter?.own || false) ||
      val.transporterName !== (original?.transporter?.name || '') ||
      val.transporterPhone !== (original?.transporter?.phone || '');

    // 3. Έλεγχος αν ζητήθηκε Αλλαγή Κωδικού
    const passwordRequested = !!(val.oldPassword && val.password);

    // Αν δεν άλλαξε ΤΙΠΟΤΑ, σταματάμε εδώ
    if (!profileChanged && !transporterChanged && !passwordRequested) {
      this.snackBar.open('Δεν εντοπίστηκαν αλλαγές προς αποθήκευση.', 'OK', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    // Ξεκινάμε τη διαδικασία ενημέρωσης σειριακά για να ελέγχουμε τα σφάλματα
    this.executeUpdates(profileChanged, transporterChanged, passwordRequested, val);
  }

  private executeUpdates(updateProf: boolean, updateTrans: boolean, updatePass: boolean, val: any) {
    const profilePayload = {
      fullName: val.fullName,
      phone: val.phone,
      contactPerson: val.contactPerson,
      description: val.description,
      city: val.city,
      country: val.country,
      zipCode: val.zipCode
    };

    const transporterPayload = {
      own: val.ownTransporter,
      name: val.transporterName,
      phone: val.transporterPhone
    };

    // Χρησιμοποιούμε of(null) αντί για Promise.resolve(null)
    const profileOp = updateProf ? this.adminService.updateAdministrator(this.currentUserId!, profilePayload) : of(null);

    profileOp.subscribe({
      next: () => {
        // Ενημερώνουμε το τοπικό αντικείμενο αν άλλαξε
        if (updateProf) {
          this.currentUserProfile = { ...this.currentUserProfile, ...profilePayload };
        }

        const transOp = updateTrans ? this.adminService.updateTransporter(this.currentUserId!, transporterPayload) : of(null);

        transOp.subscribe({
          next: () => {
            if (updateTrans) {
              this.currentUserProfile.transporter = { ...transporterPayload };
            }

            // Τέλος ο Κωδικός
            if (updatePass) {
              this.adminService.changePassword(val.oldPassword, val.password).subscribe({
                next: () => this.finishUpdate('Το προφίλ και ο κωδικός ενημερώθηκαν!'),
                error: (err) => this.handleProfileError(err)
              });
            } else {
              this.finishUpdate('Οι αλλαγές αποθηκεύτηκαν επιτυχώς!');
            }
          },
          error: (err) => this.handleProfileError(err)
        });
      },
      error: (err) => this.handleProfileError(err)
    });
  }

  private handleProfileError(err: any) {
    this.isLoading = false;
    this.snackBar.open(err.error?.message || 'Σφάλμα', 'OK', { duration: 5000 });
    this.cd.detectChanges();
  }

  private finishUpdate(msg: string) {
    this.isLoading = false;
    this.adminForm.patchValue({ oldPassword: '', password: '', confirmPassword: '' });
    this.adminForm.markAsPristine();
    this.adminForm.markAsUntouched();
    this.snackBar.open(msg, 'OK', { duration: 3000 });
    this.cd.detectChanges();
  }
}
